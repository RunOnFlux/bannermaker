import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const OUTPUT_FILE = path.join(ROOT, 'lib', 'discovered-backgrounds.ts')

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov'])
const IGNORED_FILES = new Set(['.gitkeep', 'README.md'])

function toTitleCase(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}

async function listFilesAbsolute(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (IGNORED_FILES.has(entry.name)) continue
    files.push(path.join(directory, entry.name))
  }

  return files
}

async function discoverProductBackgrounds({
  productKey,
  baseDir,
  publicBasePath,
  thumbnailsDir = 'thumbnails',
}) {
  const absoluteBaseDir = path.join(PUBLIC_DIR, baseDir)
  const absoluteThumbsDir = path.join(absoluteBaseDir, thumbnailsDir)

  let files = []
  let thumbFiles = []
  try {
    files = await listFilesAbsolute(absoluteBaseDir)
  } catch {
    files = []
  }

  try {
    thumbFiles = await listFilesAbsolute(absoluteThumbsDir)
  } catch {
    thumbFiles = []
  }

  const thumbMap = new Map()
  for (const thumb of thumbFiles) {
    const parsed = path.parse(thumb)
    thumbMap.set(parsed.name.toLowerCase(), `${publicBasePath}/${thumbnailsDir}/${parsed.base}`)
  }

  const imageSiblingByStem = new Map()
  for (const filePath of files) {
    const parsed = path.parse(filePath)
    const ext = parsed.ext.toLowerCase()
    if (!IMAGE_EXTENSIONS.has(ext)) continue
    imageSiblingByStem.set(parsed.name.toLowerCase(), `${publicBasePath}/${parsed.base}`)
  }

  const candidates = []
  for (const filePath of files) {
    const parsed = path.parse(filePath)
    const ext = parsed.ext.toLowerCase()
    const isImage = IMAGE_EXTENSIONS.has(ext)
    const isVideo = VIDEO_EXTENSIONS.has(ext)
    if (!isImage && !isVideo) continue

    const stemKey = parsed.name.toLowerCase()
    const relativePath = `${publicBasePath}/${parsed.base}`

    let thumbnail = thumbMap.get(stemKey)
    if (!thumbnail && isImage) {
      thumbnail = relativePath
    }
    if (!thumbnail && isVideo) {
      const normalizedStem = stemKey
        .replace(/\b(loop|video|clip)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      const fuzzyImage =
        imageSiblingByStem.get(normalizedStem) ??
        Array.from(imageSiblingByStem.entries()).find(([name]) => name.includes(normalizedStem))?.[1]
      thumbnail = fuzzyImage ?? relativePath
    }

    candidates.push({
      id: `${productKey}-${stemKey}-${isVideo ? 'video' : 'image'}`,
      name: isVideo ? `${toTitleCase(parsed.name)} (Video)` : toTitleCase(parsed.name),
      path: relativePath,
      thumbnail,
      type: isVideo ? 'video' : 'image',
    })
  }

  candidates.sort((a, b) => a.name.localeCompare(b.name))
  return candidates
}

function toTsArrayLiteral(items) {
  const lines = items.map((item) => {
    const typeLine = item.type === 'video' ? ", type: 'video'" : ''
    return `  { id: '${item.id}', name: '${item.name.replace(/'/g, "\\'")}', path: '${item.path}', thumbnail: '${item.thumbnail}'${typeLine} }`
  })
  return `[\n${lines.join(',\n')}\n]`
}

async function run() {
  const [flux, ssp, zelcore, fluxai] = await Promise.all([
    discoverProductBackgrounds({
      productKey: 'flux',
      baseDir: 'backgrounds',
      publicBasePath: '/backgrounds',
    }),
    discoverProductBackgrounds({
      productKey: 'ssp',
      baseDir: path.join('products', 'ssp', 'backgrounds'),
      publicBasePath: '/products/ssp/backgrounds',
    }),
    discoverProductBackgrounds({
      productKey: 'zelcore',
      baseDir: path.join('products', 'zelcore', 'backgrounds'),
      publicBasePath: '/products/zelcore/backgrounds',
    }),
    discoverProductBackgrounds({
      productKey: 'fluxai',
      baseDir: path.join('products', 'fluxai', 'backgrounds'),
      publicBasePath: '/products/fluxai/backgrounds',
    }),
  ])

  const content = `import type { BackgroundOption } from './products'

// AUTO-GENERATED FILE. Do not edit by hand.
// Run: npm run generate:backgrounds

export const DISCOVERED_FLUX_BACKGROUNDS: BackgroundOption[] = ${toTsArrayLiteral(flux)}

export const DISCOVERED_SSP_BACKGROUNDS: BackgroundOption[] = ${toTsArrayLiteral(ssp)}

export const DISCOVERED_ZELCORE_BACKGROUNDS: BackgroundOption[] = ${toTsArrayLiteral(zelcore)}

export const DISCOVERED_FLUXAI_BACKGROUNDS: BackgroundOption[] = ${toTsArrayLiteral(fluxai)}
`

  await fs.writeFile(OUTPUT_FILE, content, 'utf8')
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
