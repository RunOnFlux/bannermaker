'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { BannerCanvas, getCanvasBlob } from './BannerCanvas'
import { VideoBannerPreview, exportVideoBanner } from './VideoBannerPreview'
import { TextEditor } from './TextEditor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Check, Download } from 'lucide-react'
import { PRODUCT_ORDER, PRODUCTS, type ProductConfig } from '@/lib/products'

type BackgroundSection = 'video' | 'image'

export function BannerEditor() {
  const [productId, setProductId] = useState<ProductConfig['id']>('flux')
  const currentProduct = PRODUCTS[productId]

  const [headline, setHeadline] = useState(currentProduct.defaults.headline)
  const [subtext, setSubtext] = useState(currentProduct.defaults.subtext)
  const [selectedBackground, setSelectedBackground] = useState(currentProduct.backgrounds[0]?.path ?? '')
  const [backgroundSection, setBackgroundSection] = useState<BackgroundSection>('video')
  const [showLogoOverlay, setShowLogoOverlay] = useState(currentProduct.defaults.logoOverlayEnabled)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportMode, setIsExportMode] = useState(false)

  useEffect(() => {
    const hasVideos = currentProduct.backgrounds.some((item) => item.type === 'video')
    const defaultSection: BackgroundSection = productId === 'flux' ? 'image' : hasVideos ? 'video' : 'image'
    const firstInSection = currentProduct.backgrounds.find((item) =>
      defaultSection === 'video' ? item.type === 'video' : item.type !== 'video'
    )

    setHeadline(currentProduct.defaults.headline)
    setSubtext(currentProduct.defaults.subtext)
    setBackgroundSection(defaultSection)
    setSelectedBackground(firstInSection?.path ?? currentProduct.backgrounds[0]?.path ?? '')
    setShowLogoOverlay(currentProduct.defaults.logoOverlayEnabled)
  }, [currentProduct, productId])

  const selectedBackgroundMeta = useMemo(
    () => currentProduct.backgrounds.find((item) => item.path === selectedBackground),
    [currentProduct.backgrounds, selectedBackground]
  )
  const videoBackgrounds = useMemo(
    () => currentProduct.backgrounds.filter((item) => item.type === 'video'),
    [currentProduct.backgrounds]
  )
  const imageBackgrounds = useMemo(
    () => currentProduct.backgrounds.filter((item) => item.type !== 'video'),
    [currentProduct.backgrounds]
  )

  const backgroundsInSection = backgroundSection === 'video' ? videoBackgrounds : imageBackgrounds
  const isVideoBackground = selectedBackgroundMeta?.type === 'video'
  const canExport = selectedBackground.length > 0 && !isExporting

  const handleBackgroundSectionChange = (section: BackgroundSection) => {
    setBackgroundSection(section)
    const firstInSection = currentProduct.backgrounds.find((item) =>
      section === 'video' ? item.type === 'video' : item.type !== 'video'
    )
    if (firstInSection) {
      setSelectedBackground(firstInSection.path)
    }
  }

  const handleExport = async (format: 'png' | 'webp') => {
    if (!selectedBackground) return

    try {
      setIsExporting(true)
      setIsExportMode(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
      if (!canvas) {
        console.error('Canvas not found')
        return
      }

      const blob = await getCanvasBlob(canvas, format)
      if (!blob) {
        console.error('Failed to generate image')
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `${currentProduct.id}-banner-${timestamp}.${format}`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExportMode(false)
      setIsExporting(false)
    }
  }

  const handleVideoExport = async () => {
    if (!selectedBackground || !isVideoBackground) return

    try {
      setIsExporting(true)
      const blob = await exportVideoBanner({
        videoPath: selectedBackground,
        headline,
        subtext,
        logoPath: currentProduct.logoPath,
        showLogoOverlay,
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `${currentProduct.id}-banner-${timestamp}.webm`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Video export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportBackgroundOnly = async () => {
    if (!selectedBackground || isVideoBackground) return

    try {
      setIsExporting(true)

      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = 2400
      exportCanvas.height = 1300
      const ctx = exportCanvas.getContext('2d')
      if (!ctx) return

      const image = document.createElement('img')
      image.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Failed to load selected background'))
        image.src = selectedBackground
      })

      ctx.drawImage(image, 0, 0, 2400, 1300)

      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob((value) => resolve(value), 'image/png', 1.0)
      })
      if (!blob) return

      const timestamp = new Date().toISOString().split('T')[0]
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${currentProduct.id}-background-${timestamp}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Background export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      className="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full"
      style={{ ['--sidebar-width' as string]: '32rem', ['--sidebar-width-mobile' as string]: '20rem' }}
    >
      <div className="flex min-h-screen w-full">
        <aside className="hidden md:block border-r bg-white w-[32rem]">
          <div className="border-b p-6">
            <h2 className="text-5xl font-bold leading-tight mb-5">Banner Maker</h2>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
              <button
                type="button"
                onClick={() => setProductId('flux')}
                className={`h-14 rounded-md border px-4 transition-colors flex items-center justify-center ${
                  productId === 'flux' ? 'border-gray-300 bg-gray-100' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Image
                  src="/Flux_blue.svg"
                  alt="Flux logo"
                  width={190}
                  height={56}
                  className="h-10 w-auto object-contain"
                />
              </button>

              <div className="h-24 w-[3px] rounded-full bg-black" />

              <button
                type="button"
                onClick={() => setProductId('ssp')}
                className={`h-14 rounded-md border px-4 transition-colors flex items-center justify-center ${
                  productId === 'ssp' ? 'border-gray-300 bg-gray-100' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Image
                  src={PRODUCTS.ssp.logoPath}
                  alt="SSP logo"
                  width={190}
                  height={56}
                  className="h-10 w-auto object-contain"
                />
              </button>
            </div>
          </div>

          <div className="px-4 py-6 h-[calc(100vh-101px)] overflow-auto">
            <div className="space-y-3 p-2">
              <h3 className="text-sm font-semibold">Backgrounds</h3>

              {currentProduct.backgrounds.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                  No backgrounds configured for {currentProduct.name} yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleBackgroundSectionChange('video')}
                      disabled={videoBackgrounds.length === 0}
                      className={`h-9 rounded-md border px-3 text-sm font-medium transition-colors ${
                        backgroundSection === 'video'
                          ? 'border-gray-300 bg-gray-100 text-gray-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      Videos ({videoBackgrounds.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBackgroundSectionChange('image')}
                      disabled={imageBackgrounds.length === 0}
                      className={`h-9 rounded-md border px-3 text-sm font-medium transition-colors ${
                        backgroundSection === 'image'
                          ? 'border-gray-300 bg-gray-100 text-gray-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      Images ({imageBackgrounds.length})
                    </button>
                  </div>

                  {backgroundsInSection.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600">
                      No {backgroundSection} backgrounds found for {currentProduct.name}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {backgroundsInSection.map((bg) => {
                        const isSelected = selectedBackgroundMeta?.id === bg.id

                        return (
                          <button
                            key={bg.id}
                            onClick={() => setSelectedBackground(bg.path)}
                            className={`
                              relative w-full aspect-[1200/650] rounded-lg overflow-hidden
                              border-2 transition-all duration-200 cursor-pointer
                              hover:scale-[1.02] hover:shadow-lg
                              ${
                                isSelected
                                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                                  : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                            aria-label={`Select ${bg.name}`}
                          >
                            {bg.type === 'video' ? (
                              <video
                                src={bg.path}
                                className="absolute inset-0 h-full w-full object-cover"
                                muted
                                loop
                                autoPlay
                                playsInline
                              />
                            ) : (
                              <Image
                                src={bg.thumbnail}
                                alt={bg.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}

                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="w-3 h-3" />
                              </div>
                            )}

                            {bg.type === 'video' && (
                              <div className="absolute top-1 left-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                                VIDEO
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                              <p className="text-[12px] text-white font-medium leading-tight">{bg.name}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="md:hidden flex gap-2 px-6">
              {PRODUCT_ORDER.map((id) => {
                const product = PRODUCTS[id]
                const isActive = productId === id

                return (
                  <Button
                    key={id}
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => setProductId(id)}
                  >
                    {product.name}
                  </Button>
                )
              })}
            </div>

            <TextEditor
              headline={headline}
              subtext={subtext}
              onHeadlineChange={setHeadline}
              onSubtextChange={setSubtext}
            />

            <div className="px-6">
              <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-4">
                <input
                  id="logo-overlay-toggle"
                  type="checkbox"
                  checked={showLogoOverlay}
                  onChange={(e) => setShowLogoOverlay(e.target.checked)}
                  className="h-4 w-4 accent-gray-700"
                />
                <Label htmlFor="logo-overlay-toggle" className="cursor-pointer">
                  Include logo overlay on generated image
                </Label>
              </div>
            </div>

            <div className="px-6 space-y-4">
              {selectedBackground ? (
                isVideoBackground ? (
                  <VideoBannerPreview
                    headline={headline}
                    subtext={subtext}
                    videoPath={selectedBackground}
                    logoPath={currentProduct.logoPath}
                    showLogoOverlay={showLogoOverlay}
                  />
                ) : (
                  <BannerCanvas
                    headline={headline}
                    subtext={subtext}
                    background={selectedBackground}
                    logoPath={currentProduct.logoPath}
                    showLogoOverlay={showLogoOverlay}
                    isExportMode={isExportMode}
                  />
                )
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
                  No background selected for {currentProduct.name}.
                </div>
              )}

              <div className="flex gap-3">
                {isVideoBackground ? (
                  <Button
                    onClick={handleVideoExport}
                    disabled={!canExport}
                    className="flex-1 cursor-pointer"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exporting Video...' : 'Export as Video (WebM)'}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => handleExport('png')}
                      disabled={!canExport}
                      className="flex-1 cursor-pointer"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting PNG...' : 'Export as PNG'}
                    </Button>

                    <Button
                      onClick={() => handleExport('webp')}
                      disabled={!canExport}
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting WebP...' : 'Export as WebP'}
                    </Button>

                    <Button
                      onClick={exportBackgroundOnly}
                      disabled={!canExport}
                      variant="ghost"
                      className="flex-1 cursor-pointer"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Background Only
                    </Button>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-500 text-center">
                {isVideoBackground
                  ? 'Video export: WebM, source resolution, full source clip duration'
                  : 'Export size: 2400 x 1300px'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
