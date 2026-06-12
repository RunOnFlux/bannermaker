export const MAX_TWITTER_EXPORT_BYTES = Math.floor(4.8 * 1024 * 1024)

export function isAllowedSspVideoBackground(path: string, allowedVideoPaths: string[]): boolean {
  return (
    path.startsWith('/products/ssp/backgrounds/') &&
    path.toLowerCase().endsWith('.mp4') &&
    allowedVideoPaths.includes(path)
  )
}

export function createTwitterFilename(date: string): string {
  return `ssp-twitter-${date}.mp4`
}

export function calculateVideoBitrate(
  durationSeconds: number,
  targetBytes = MAX_TWITTER_EXPORT_BYTES
): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error('Video duration must be greater than zero')
  }

  const containerSafetyFactor = 0.97
  const availableBits = targetBytes * 8 * containerSafetyFactor
  return Math.max(250_000, Math.min(12_000_000, Math.floor(availableBits / durationSeconds)))
}

export function wrapText(text: string, maxCharacters: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    if (candidate.length <= maxCharacters || !currentLine) {
      currentLine = candidate
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}
