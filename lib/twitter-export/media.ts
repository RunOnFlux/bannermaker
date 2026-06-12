import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'
import {
  MAX_TWITTER_EXPORT_BYTES,
  calculateVideoBitrate,
  wrapText,
} from './policy'

const execFileAsync = promisify(execFile)
const VIDEO_WIDTH = 1280
const VIDEO_HEIGHT = 720

interface TwitterMediaOptions {
  sourcePath: string
  logoPath: string
  headline: string
  subtext: string
  showLogoOverlay: boolean
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function createOverlay(
  width: number,
  height: number,
  options: Omit<TwitterMediaOptions, 'sourcePath'>
): Promise<Buffer> {
  const scale = Math.min(width / 2400, height / 1300)
  const left = Math.round(180 * (width / 2400))
  const right = Math.round(180 * (width / 2400))
  const bottom = Math.round(128 * (height / 1300))
  const headlineSize = Math.max(48, Math.round(112 * scale))
  const subtextSize = Math.max(24, Math.round(48 * scale))
  const headlineLineHeight = Math.round(headlineSize * 1.28)
  const subtextLineHeight = Math.round(subtextSize * 1.58)
  const gap = options.subtext.trim() ? Math.round(64 * scale) : 0
  const usableWidth = width - left - right
  const headlineCharacters = Math.max(18, Math.floor(usableWidth / (headlineSize * 0.58)))
  const subtextCharacters = Math.max(28, Math.floor(usableWidth / (subtextSize * 0.52)))
  const headlineLines = wrapText(options.headline, headlineCharacters)
  const subtextLines = options.subtext.trim()
    ? wrapText(options.subtext, subtextCharacters)
    : []
  const contentHeight =
    headlineLines.length * headlineLineHeight +
    subtextLines.length * subtextLineHeight +
    gap
  const startY = height - bottom - contentHeight
  const gradientStart = Math.max(0, startY - Math.round(120 * scale))

  const headlineSvg = headlineLines
    .map(
      (line, index) =>
        `<text x="${left}" y="${startY + index * headlineLineHeight}" class="headline">${escapeXml(line)}</text>`
    )
    .join('')
  const subtextStart = startY + headlineLines.length * headlineLineHeight + gap
  const subtextSvg = subtextLines
    .map(
      (line, index) =>
        `<text x="${left}" y="${subtextStart + index * subtextLineHeight}" class="subtext">${escapeXml(line)}</text>`
    )
    .join('')

  let logoSvg = ''
  if (options.showLogoOverlay) {
    const logo = await readFile(options.logoPath)
    const logoMetadata = await sharp(logo).metadata()
    const logoWidth = Math.round(400 * scale)
    const logoHeight = Math.round(
      logoWidth * ((logoMetadata.height ?? 1) / (logoMetadata.width ?? 1))
    )
    const logoX = Math.round(180 * (width / 2400))
    const logoY = Math.round(180 * (height / 1300))
    logoSvg = `<image href="data:image/png;base64,${logo.toString('base64')}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" />`
  }

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity="0" />
          <stop offset="45%" stop-color="#000" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#000" stop-opacity="0.58" />
        </linearGradient>
        <style>
          .headline { fill: #fff; font-family: Arial, sans-serif; font-size: ${headlineSize}px; font-weight: 700; dominant-baseline: hanging; }
          .subtext { fill: #fff; fill-opacity: 0.88; font-family: Arial, sans-serif; font-size: ${subtextSize}px; font-weight: 400; dominant-baseline: hanging; }
        </style>
      </defs>
      <rect x="0" y="${gradientStart}" width="${width}" height="${height - gradientStart}" fill="url(#shade)" />
      ${logoSvg}
      ${headlineSvg}
      ${subtextSvg}
    </svg>
  `

  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function getVideoDuration(sourcePath: string): Promise<number> {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    sourcePath,
  ])
  const duration = Number.parseFloat(stdout.trim())
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Unable to determine source video duration')
  }
  return duration
}

async function encodeVideo(
  sourcePath: string,
  overlayPath: string,
  outputPath: string,
  bitrate: number
): Promise<void> {
  const filter =
    `[0:v]scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}[base];` +
    '[base][1:v]overlay=0:0:format=auto[out]'

  await execFileAsync(
    'ffmpeg',
    [
      '-y',
      '-i',
      sourcePath,
      '-i',
      overlayPath,
      '-filter_complex',
      filter,
      '-map',
      '[out]',
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-b:v',
      String(bitrate),
      '-maxrate',
      String(Math.round(bitrate * 1.15)),
      '-bufsize',
      String(bitrate * 2),
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { maxBuffer: 10 * 1024 * 1024 }
  )
}

export async function exportTwitterVideo(options: TwitterMediaOptions): Promise<Buffer> {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'ssp-twitter-'))

  try {
    const duration = await getVideoDuration(options.sourcePath)
    const overlay = await createOverlay(VIDEO_WIDTH, VIDEO_HEIGHT, options)
    const overlayPath = path.join(temporaryDirectory, 'overlay.png')
    const outputPath = path.join(temporaryDirectory, 'output.mp4')
    await writeFile(overlayPath, overlay)

    let bitrate = calculateVideoBitrate(duration)
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await encodeVideo(options.sourcePath, overlayPath, outputPath, bitrate)
      const result = await readFile(outputPath)

      if (result.byteLength <= MAX_TWITTER_EXPORT_BYTES) {
        return result
      }

      const ratio = MAX_TWITTER_EXPORT_BYTES / result.byteLength
      bitrate = Math.max(250_000, Math.floor(bitrate * ratio * 0.9))
    }

    throw new Error('Unable to compress the SSP video below 5 MB')
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true })
  }
}
