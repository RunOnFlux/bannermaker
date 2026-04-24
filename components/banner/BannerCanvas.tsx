'use client'

import { useEffect, useRef, useState } from 'react'

interface BannerCanvasProps {
  headline: string
  subtext: string
  background: string
  logoPath: string
  showLogoOverlay: boolean
  isExportMode?: boolean
}

interface TextLayout {
  headlineLines: string[]
  subtextLines: string[]
  headlineY: number
  subtextY: number
  overlayHeight: number
  maxWidth: number
}

const CANVAS_WIDTH = 2400
const CANVAS_HEIGHT = 1300
const LOGO_POSITION = { x: 180, y: 180 }
const TEXT_MARGIN = { left: 180, right: 180, bottom: 128 }
const LINE_HEIGHTS = { headline: 144, subtext: 76 }
const FONTS = {
  headline: 'bold 112px Gilroy, system-ui, -apple-system, sans-serif',
  subtext: '48px Figtree, system-ui, -apple-system, sans-serif',
}

export function BannerCanvas({
  headline,
  subtext,
  background,
  logoPath,
  showLogoOverlay,
  isExportMode = false,
}: BannerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const gilroy = new FontFace(
          'Gilroy',
          'url(/fonts/Gilroy-bold.woff2) format("woff2")',
          { weight: '700', style: 'normal' }
        )

        await gilroy.load()
        document.fonts.add(gilroy)
        await document.fonts.ready
        setFontsLoaded(true)
      } catch (error) {
        console.warn('Font loading failed, using fallback fonts:', error)
        setFontsLoaded(true)
      }
    }

    loadFonts()
  }, [])

  useEffect(() => {
    if (!fontsLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    setIsLoading(true)

    const bgImage = new Image()
    bgImage.crossOrigin = 'anonymous'

    bgImage.onload = () => {
      setIsLoading(false)
      ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      const textLayout = calculateTextLayout(ctx, headline, subtext)

      if (headline.trim() || subtext.trim()) {
        applyBackgroundBlur(ctx, bgImage, textLayout.overlayHeight)
        applyProgressiveOverlay(ctx, textLayout.overlayHeight)
      }

      if (!showLogoOverlay) {
        drawTextWithLayout(ctx, textLayout)
        return
      }

      const logoImage = new Image()
      logoImage.crossOrigin = 'anonymous'
      logoImage.onload = () => {
        const logoWidth = 400
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth
        ctx.drawImage(logoImage, LOGO_POSITION.x, LOGO_POSITION.y, logoWidth, logoHeight)
        drawTextWithLayout(ctx, textLayout)
      }
      logoImage.onerror = () => {
        console.error('Failed to load Flux logo')
        drawTextWithLayout(ctx, textLayout)
      }
      logoImage.src = logoPath
    }

    bgImage.onerror = () => {
      setIsLoading(false)
      console.error('Failed to load background')
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      const textLayout = calculateTextLayout(ctx, headline, subtext)
      applyProgressiveOverlay(ctx, textLayout.overlayHeight)
      drawTextWithLayout(ctx, textLayout)
    }

    bgImage.src = background

    function calculateTextLayout(ctx2d: CanvasRenderingContext2D, headlineText: string, subtextText: string) {
      const maxWidth = CANVAS_WIDTH - TEXT_MARGIN.left - TEXT_MARGIN.right
      ctx2d.font = FONTS.headline
      const headlineLines = getWrappedLines(ctx2d, headlineText, maxWidth)
      const headlineHeight = headlineLines.length * LINE_HEIGHTS.headline

      ctx2d.font = FONTS.subtext
      const subtextLines = subtextText.trim() ? getWrappedLines(ctx2d, subtextText, maxWidth) : []
      const subtextHeight = subtextLines.length * LINE_HEIGHTS.subtext

      const headlineSubtextGap = subtextLines.length > 0 ? 64 : 0
      const totalContentHeight = headlineHeight + (subtextLines.length > 0 ? subtextHeight + headlineSubtextGap : 0)
      const contentBottomY = CANVAS_HEIGHT - TEXT_MARGIN.bottom
      const contentStartY = contentBottomY - totalContentHeight
      const overlayTopPadding = 120
      const overlayHeight = totalContentHeight + overlayTopPadding + TEXT_MARGIN.bottom

      return {
        headlineLines,
        subtextLines,
        headlineY: contentStartY,
        subtextY: contentStartY + headlineHeight + headlineSubtextGap,
        overlayHeight: Math.min(overlayHeight, 780),
        maxWidth,
      }
    }

    function getWrappedLines(ctx2d: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
      const words = text.split(' ')
      const lines: string[] = []
      let line = ''

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const testWidth = ctx2d.measureText(testLine).width

        if (testWidth > maxWidth && i > 0) {
          lines.push(line.trim())
          line = words[i] + ' '
        } else {
          line = testLine
        }
      }

      lines.push(line.trim())
      return lines.filter((item) => item.length > 0)
    }

    function applyProgressiveOverlay(ctx2d: CanvasRenderingContext2D, overlayHeight: number) {
      const startY = CANVAS_HEIGHT - overlayHeight
      const gradient = ctx2d.createLinearGradient(0, startY, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.05)')
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.1)')
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)')
      gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.35)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)')
      ctx2d.fillStyle = gradient
      ctx2d.fillRect(0, startY, CANVAS_WIDTH, overlayHeight)
    }

    function applyBackgroundBlur(ctx2d: CanvasRenderingContext2D, image: HTMLImageElement, overlayHeight: number) {
      const startY = CANVAS_HEIGHT - overlayHeight
      const numStrips = 80
      const stripHeight = overlayHeight / numStrips
      const maxBlur = 36

      for (let i = 0; i < numStrips; i++) {
        const stripY = startY + (i * stripHeight)
        const blurAmount = (i / (numStrips - 1)) * maxBlur

        ctx2d.save()
        ctx2d.filter = `blur(${blurAmount}px)`
        ctx2d.beginPath()
        ctx2d.rect(0, stripY, CANVAS_WIDTH, stripHeight + 1)
        ctx2d.clip()
        ctx2d.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx2d.restore()
      }
    }

    function drawTextWithLayout(ctx2d: CanvasRenderingContext2D, layout: TextLayout) {
      ctx2d.fillStyle = '#ffffff'
      ctx2d.font = FONTS.headline
      ctx2d.textBaseline = 'top'

      let currentY = layout.headlineY
      layout.headlineLines.forEach((line) => {
        ctx2d.fillText(line, TEXT_MARGIN.left, currentY)
        currentY += LINE_HEIGHTS.headline
      })

      if (layout.subtextLines.length > 0) {
        ctx2d.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx2d.font = FONTS.subtext
        currentY = layout.subtextY
        layout.subtextLines.forEach((line) => {
          ctx2d.fillText(line, TEXT_MARGIN.left, currentY)
          currentY += LINE_HEIGHTS.subtext
        })
      }
    }
  }, [headline, subtext, background, logoPath, showLogoOverlay, isExportMode, fontsLoaded])

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300"
          style={{ aspectRatio: '1200/650' }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Loading background...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={`border border-gray-300 rounded-lg shadow-lg max-w-full h-auto transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}

export function getCanvasBlob(canvasElement: HTMLCanvasElement, format: 'png' | 'webp'): Promise<Blob | null> {
  return new Promise((resolve) => {
    const mimeType = format === 'webp' ? 'image/webp' : 'image/png'
    canvasElement.toBlob((blob) => resolve(blob), mimeType, 1.0)
  })
}
