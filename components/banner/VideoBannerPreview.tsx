'use client'

import NextImage from 'next/image'

interface VideoBannerPreviewProps {
  headline: string
  subtext: string
  videoPath: string
  logoPath: string
  showLogoOverlay: boolean
}

interface ExportVideoOptions {
  videoPath: string
  headline: string
  subtext: string
  logoPath: string
  showLogoOverlay: boolean
}

const WIDTH = 2400
const HEIGHT = 1300
const LOGO_X = 180
const LOGO_Y = 180
const LOGO_WIDTH = 400
const TEXT_LEFT = 180
const TEXT_RIGHT = 180
const TEXT_BOTTOM = 128
const HEADLINE_LINE_HEIGHT = 144
const SUBTEXT_LINE_HEIGHT = 76

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      lines.push(line.trim())
      line = words[i] + ' '
    } else {
      line = testLine
    }
  }

  lines.push(line.trim())
  return lines.filter((item) => item.length > 0)
}

function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  headline: string,
  subtext: string,
  width: number,
  height: number
) {
  const scaleX = width / WIDTH
  const scaleY = height / HEIGHT
  const fontScale = Math.min(scaleX, scaleY)

  const textLeft = Math.round(TEXT_LEFT * scaleX)
  const textRight = Math.round(TEXT_RIGHT * scaleX)
  const textBottom = Math.round(TEXT_BOTTOM * scaleY)
  const headlineFontPx = Math.max(44, Math.round(112 * fontScale))
  const subtextFontPx = Math.max(24, Math.round(48 * fontScale))
  const headlineLineHeight = Math.round(HEADLINE_LINE_HEIGHT * fontScale)
  const subtextLineHeight = Math.round(SUBTEXT_LINE_HEIGHT * fontScale)
  const maxWidth = width - textLeft - textRight

  ctx.font = `bold ${headlineFontPx}px Gilroy, system-ui, -apple-system, sans-serif`
  const headlineLines = wrapLines(ctx, headline, maxWidth)
  const headlineHeight = headlineLines.length * headlineLineHeight

  ctx.font = `${subtextFontPx}px Figtree, system-ui, -apple-system, sans-serif`
  const subtextLines = subtext.trim() ? wrapLines(ctx, subtext, maxWidth) : []
  const subtextHeight = subtextLines.length * subtextLineHeight

  const gap = subtextLines.length > 0 ? Math.round(64 * fontScale) : 0
  const totalHeight = headlineHeight + (subtextLines.length > 0 ? subtextHeight + gap : 0)
  const startY = height - textBottom - totalHeight

  const overlayHeight = Math.min(totalHeight + Math.round(120 * fontScale) + textBottom, Math.round(height * 0.6))
  const overlayStartY = height - overlayHeight

  const gradient = ctx.createLinearGradient(0, overlayStartY, 0, height)
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(0.1, 'rgba(0,0,0,0.05)')
  gradient.addColorStop(0.3, 'rgba(0,0,0,0.1)')
  gradient.addColorStop(0.6, 'rgba(0,0,0,0.25)')
  gradient.addColorStop(0.8, 'rgba(0,0,0,0.35)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, overlayStartY, width, overlayHeight)

  ctx.textBaseline = 'top'
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${headlineFontPx}px Gilroy, system-ui, -apple-system, sans-serif`

  let y = startY
  for (const line of headlineLines) {
    ctx.fillText(line, textLeft, y)
    y += headlineLineHeight
  }

  if (subtextLines.length > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = `${subtextFontPx}px Figtree, system-ui, -apple-system, sans-serif`
    y = startY + headlineHeight + gap

    for (const line of subtextLines) {
      ctx.fillText(line, textLeft, y)
      y += subtextLineHeight
    }
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'
    video.onloadeddata = () => resolve(video)
    video.onerror = () => reject(new Error(`Failed to load video: ${src}`))
  })
}

export async function exportVideoBanner({
  videoPath,
  headline,
  subtext,
  logoPath,
  showLogoOverlay,
}: ExportVideoOptions): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const video = await loadVideo(videoPath)
  const sourceWidth = video.videoWidth || WIDTH
  const sourceHeight = video.videoHeight || HEIGHT
  canvas.width = sourceWidth
  canvas.height = sourceHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to initialize canvas context for video export')
  }

  const logo = showLogoOverlay ? await loadImage(logoPath).catch(() => null) : null
  const targetDurationMs =
    Number.isFinite(video.duration) && video.duration > 0
      ? Math.round(video.duration * 1000)
      : 5000

  const fps = 30
  const stream = canvas.captureStream(fps)
  const supportedMimeType = [
    'video/webm;codecs=vp8',
    'video/webm;codecs=vp9',
    'video/webm',
  ].find((mime) => MediaRecorder.isTypeSupported(mime))
  const targetBitrate = Math.max(12_000_000, Math.round(sourceWidth * sourceHeight * 12))
  const recorderOptions = supportedMimeType
    ? {
        mimeType: supportedMimeType,
        videoBitsPerSecond: targetBitrate,
        bitsPerSecond: targetBitrate,
      }
    : {
        videoBitsPerSecond: targetBitrate,
        bitsPerSecond: targetBitrate,
      }

  const recorder = new MediaRecorder(stream, recorderOptions)

  const chunks: BlobPart[] = []
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data)
    }
  }

  const stopPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: supportedMimeType ?? 'video/webm' }))
    }
    recorder.onerror = () => reject(new Error('Video recording failed'))
  })

  await video.play()
  recorder.start()

  const startedAt = performance.now()

  await new Promise<void>((resolve) => {
    const draw = () => {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.clearRect(0, 0, sourceWidth, sourceHeight)
      ctx.drawImage(video, 0, 0, sourceWidth, sourceHeight)

      drawTextOverlay(ctx, headline, subtext, sourceWidth, sourceHeight)

      if (logo) {
        const scale = Math.min(sourceWidth / WIDTH, sourceHeight / HEIGHT)
        const logoWidth = Math.round(LOGO_WIDTH * scale)
        const logoX = Math.round(LOGO_X * (sourceWidth / WIDTH))
        const logoY = Math.round(LOGO_Y * (sourceHeight / HEIGHT))
        const logoHeight = (logo.height / logo.width) * logoWidth
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
      }

      if (performance.now() - startedAt >= targetDurationMs) {
        resolve()
        return
      }

      requestAnimationFrame(draw)
    }

    draw()
  })

  recorder.stop()
  stream.getTracks().forEach((track) => track.stop())
  video.pause()
  video.src = ''

  return stopPromise
}

export function VideoBannerPreview({
  headline,
  subtext,
  videoPath,
  logoPath,
  showLogoOverlay,
}: VideoBannerPreviewProps) {
  return (
    <div className="relative border border-gray-300 rounded-lg shadow-lg max-w-full h-auto overflow-hidden">
      <div className="aspect-[1200/650] relative [container-type:size]">
        <video
          src={videoPath}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {showLogoOverlay && (
          <NextImage
            src={logoPath}
            alt="Product logo"
            width={400}
            height={120}
            className="absolute h-auto object-contain"
            style={{
              left: `${(LOGO_X / WIDTH) * 100}cqw`,
              top: `${(LOGO_Y / HEIGHT) * 100}cqh`,
              width: `${(LOGO_WIDTH / WIDTH) * 100}cqw`,
            }}
            unoptimized
          />
        )}

        <div
          className="absolute text-white"
          style={{
            left: `${(TEXT_LEFT / WIDTH) * 100}cqw`,
            right: `${(TEXT_RIGHT / WIDTH) * 100}cqw`,
            bottom: `${(TEXT_BOTTOM / HEIGHT) * 100}cqh`,
          }}
        >
          <h3
            className="font-bold"
            style={{
              fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
              fontSize: `${(112 / WIDTH) * 100}cqw`,
              lineHeight: `${HEADLINE_LINE_HEIGHT / 112}`,
              marginBottom: subtext.trim() ? `${(64 / HEIGHT) * 100}cqh` : 0,
            }}
          >
            {headline}
          </h3>
          {subtext.trim() && (
            <p
              className="text-white/85"
              style={{
                fontFamily: 'Figtree, system-ui, -apple-system, sans-serif',
                fontSize: `${(48 / WIDTH) * 100}cqw`,
                lineHeight: `${SUBTEXT_LINE_HEIGHT / 48}`,
              }}
            >
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
