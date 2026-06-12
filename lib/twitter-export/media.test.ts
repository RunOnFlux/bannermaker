import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { MAX_TWITTER_EXPORT_BYTES } from './policy'
import { exportTwitterVideo } from './media'

const publicDirectory = path.join(process.cwd(), 'public')
const logoPath = path.join(publicDirectory, 'products', 'ssp', 'ssp-enterprise-black.png')

describe('server-side SSP Twitter media export', () => {
  it('creates an H.264 MP4 video below the Twitter export ceiling', async () => {
    const sourcePath = path.join(
      publicDirectory,
      'products',
      'ssp',
      'backgrounds',
      'biometric security.mp4'
    )

    const result = await exportTwitterVideo({
      sourcePath,
      logoPath,
      headline: 'Biometric Security',
      subtext: 'Secure approvals built for real operational teams.',
      showLogoOverlay: false,
    })

    expect(result.subarray(4, 8).toString('ascii')).toBe('ftyp')
    expect(result.byteLength).toBeLessThanOrEqual(MAX_TWITTER_EXPORT_BYTES)
  }, 90_000)
})
