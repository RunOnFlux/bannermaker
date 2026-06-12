import { describe, expect, it } from 'vitest'
import {
  MAX_TWITTER_EXPORT_BYTES,
  calculateVideoBitrate,
  createTwitterFilename,
  isAllowedSspVideoBackground,
  wrapText,
} from './policy'

const allowedPaths = [
  '/products/ssp/backgrounds/true self custody.png',
  '/products/ssp/backgrounds/true self custody.mp4',
]

describe('SSP Twitter export policy', () => {
  it('allows only exact configured SSP video paths', () => {
    expect(isAllowedSspVideoBackground(allowedPaths[1], [allowedPaths[1]])).toBe(true)
    expect(isAllowedSspVideoBackground(allowedPaths[0], [allowedPaths[1]])).toBe(false)
    expect(isAllowedSspVideoBackground('/products/zelcore/backgrounds/example.mp4', allowedPaths)).toBe(false)
    expect(isAllowedSspVideoBackground('/products/ssp/backgrounds/../../package.json', allowedPaths)).toBe(false)
  })

  it('uses X-compatible extensions in download names', () => {
    expect(createTwitterFilename('2026-06-12')).toBe('ssp-twitter-2026-06-12.mp4')
  })

  it('budgets video bitrate below the target file size', () => {
    const bitrate = calculateVideoBitrate(8)
    const projectedBytes = (bitrate * 8) / 8

    expect(projectedBytes).toBeLessThan(MAX_TWITTER_EXPORT_BYTES)
    expect(bitrate).toBeGreaterThan(250_000)
  })

  it('allows short videos to use most of the file-size budget', () => {
    const bitrate = calculateVideoBitrate(4)

    expect(bitrate).toBeGreaterThan(8_000_000)
  })

  it('wraps copy without losing words', () => {
    const text = 'No single person can move funds alone without approval'
    const lines = wrapText(text, 18)

    expect(lines.length).toBeGreaterThan(1)
    expect(lines.join(' ')).toBe(text)
    expect(lines.every((line) => line.length <= 18)).toBe(true)
  })
})
