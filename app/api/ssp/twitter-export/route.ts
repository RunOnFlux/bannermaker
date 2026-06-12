import path from 'node:path'
import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products'
import { exportTwitterVideo } from '@/lib/twitter-export/media'
import {
  createTwitterFilename,
  isAllowedSspVideoBackground,
} from '@/lib/twitter-export/policy'

export const runtime = 'nodejs'
export const maxDuration = 120

interface TwitterExportRequest {
  backgroundPath?: unknown
  headline?: unknown
  subtext?: unknown
  showLogoOverlay?: unknown
}

function invalidRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(request: Request) {
  let body: TwitterExportRequest
  try {
    body = await request.json()
  } catch {
    return invalidRequest('The export request must contain valid JSON.')
  }

  if (
    typeof body.backgroundPath !== 'string' ||
    typeof body.headline !== 'string' ||
    typeof body.subtext !== 'string' ||
    typeof body.showLogoOverlay !== 'boolean'
  ) {
    return invalidRequest('The export request is missing required fields.')
  }

  if (body.headline.length > 300 || body.subtext.length > 1500) {
    return invalidRequest('The banner copy is too long to export.')
  }

  const allowedVideoPaths = PRODUCTS.ssp.backgrounds
    .filter((background) => background.type === 'video')
    .map((background) => background.path)
  if (!isAllowedSspVideoBackground(body.backgroundPath, allowedVideoPaths)) {
    return invalidRequest('Only configured SSP videos can use Twitter export.')
  }

  const background = PRODUCTS.ssp.backgrounds.find(
    (item) => item.path === body.backgroundPath
  )
  if (!background || background.type !== 'video') {
    return invalidRequest('The selected SSP video could not be found.')
  }

  const publicDirectory = path.join(process.cwd(), 'public')
  const sourcePath = path.join(publicDirectory, body.backgroundPath.replace(/^\/+/, ''))
  const logoPath = path.join(publicDirectory, PRODUCTS.ssp.logoPath.replace(/^\/+/, ''))

  try {
    const options = {
      sourcePath,
      logoPath,
      headline: body.headline,
      subtext: body.subtext,
      showLogoOverlay: body.showLogoOverlay,
    }
    const output = await exportTwitterVideo(options)
    const date = new Date().toISOString().slice(0, 10)
    const filename = createTwitterFilename(date)

    return new Response(new Uint8Array(output), {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(output.byteLength),
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('SSP Twitter export failed:', error)
    const message =
      error instanceof Error && /ffmpeg|ffprobe/i.test(error.message)
        ? 'Server video processing is unavailable. FFmpeg and ffprobe are required.'
        : 'The server could not create an export below 5 MB.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
