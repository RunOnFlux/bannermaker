import {
  DISCOVERED_FLUX_BACKGROUNDS,
  DISCOVERED_SSP_BACKGROUNDS,
} from './discovered-backgrounds'

export interface BackgroundOption {
  id: string
  name: string
  path: string
  thumbnail: string
  type?: 'image' | 'video'
}

export interface ProductConfig {
  id: 'flux' | 'ssp'
  name: string
  subtitle: string
  logoPath: string
  defaults: {
    headline: string
    subtext: string
    logoOverlayEnabled: boolean
  }
  backgrounds: BackgroundOption[]
}

function mergeBackgrounds(
  manual: BackgroundOption[],
  discovered: BackgroundOption[]
): BackgroundOption[] {
  const seenPaths = new Set(manual.map((item) => item.path))
  const extras = discovered.filter((item) => !seenPaths.has(item.path))
  return [...manual, ...extras]
}

const FLUX_BACKGROUNDS: BackgroundOption[] = [
  { id: '1', name: '4 blocks', path: '/backgrounds/one.png', thumbnail: '/backgrounds/thumbnails/one.jpg' },
  { id: '2', name: 'Node Elevated', path: '/backgrounds/two.png', thumbnail: '/backgrounds/thumbnails/two.jpg' },
  { id: '3', name: 'Flux Nodes BG', path: '/backgrounds/three.png', thumbnail: '/backgrounds/thumbnails/three.jpg' },
  { id: '4', name: 'Flux AI BG', path: '/backgrounds/four.png', thumbnail: '/backgrounds/thumbnails/four.jpg' },
  { id: '5', name: 'Flux Wallets BG', path: '/backgrounds/five.png', thumbnail: '/backgrounds/thumbnails/five.jpg' },
  { id: '6', name: 'Flux Kaspa BG', path: '/backgrounds/six.png', thumbnail: '/backgrounds/thumbnails/six.jpg' },
  { id: '7', name: 'Flux Arcane BG', path: '/backgrounds/seven.png', thumbnail: '/backgrounds/thumbnails/seven.jpg' },
  { id: '9', name: 'Flux WP BG', path: '/backgrounds/nine.png', thumbnail: '/backgrounds/thumbnails/nine.jpg' },
  { id: '8', name: 'Flux Generic BG 1', path: '/backgrounds/eight.png', thumbnail: '/backgrounds/thumbnails/eight.jpg' },
  { id: '10', name: 'Flux Generic BG 2', path: '/backgrounds/ten.png', thumbnail: '/backgrounds/thumbnails/ten.jpg' },
  { id: '11', name: 'Flux Generic BG 3', path: '/backgrounds/11.png', thumbnail: '/backgrounds/thumbnails/11.jpg' },
  { id: '12', name: 'Flux Generic BG 4', path: '/backgrounds/12.png', thumbnail: '/backgrounds/thumbnails/12.jpg' },
  { id: '13', name: 'Flux Generic BG 5', path: '/backgrounds/13.png', thumbnail: '/backgrounds/thumbnails/13.jpg' },
  { id: '14', name: 'Flux Generic BG 6', path: '/backgrounds/14.png', thumbnail: '/backgrounds/thumbnails/14.jpg' },
  { id: '15', name: 'Flux Generic BG 7', path: '/backgrounds/15.png', thumbnail: '/backgrounds/thumbnails/15.jpg' },
  { id: '16', name: 'Flux Generic BG 8', path: '/backgrounds/16.png', thumbnail: '/backgrounds/thumbnails/16.jpg' },
  { id: '17', name: 'Flux Generic BG 9', path: '/backgrounds/17.png', thumbnail: '/backgrounds/thumbnails/17.jpg' },
  { id: '18', name: 'Flux Generic BG 10', path: '/backgrounds/18.png', thumbnail: '/backgrounds/thumbnails/18.jpg' },
  { id: '19', name: 'Flux Generic BG 11', path: '/backgrounds/19.png', thumbnail: '/backgrounds/thumbnails/19.jpg' },
  { id: '20', name: 'Flux Generic BG 12', path: '/backgrounds/20.png', thumbnail: '/backgrounds/thumbnails/20.jpg' },
  { id: '21', name: 'Flux VS AWS - 1', path: '/backgrounds/21.png', thumbnail: '/backgrounds/thumbnails/21.jpg' },
  { id: '22', name: 'Flux VS AWS - 2', path: '/backgrounds/22.png', thumbnail: '/backgrounds/thumbnails/22.jpg' },
  { id: '23', name: 'Flux Generic BG 15', path: '/backgrounds/23.png', thumbnail: '/backgrounds/thumbnails/23.jpg' },
  { id: '24', name: 'Flux Generic BG 16', path: '/backgrounds/24.png', thumbnail: '/backgrounds/thumbnails/24.jpg' },
  { id: '25', name: 'Flux Generic BG 17', path: '/backgrounds/25.png', thumbnail: '/backgrounds/thumbnails/25.jpg' },
  { id: '26', name: 'Flux Generic BG 18', path: '/backgrounds/26.png', thumbnail: '/backgrounds/thumbnails/26.jpg' },
  { id: '27', name: 'Flux Generic BG 19', path: '/backgrounds/27.png', thumbnail: '/backgrounds/thumbnails/27.jpg' },
  { id: '28', name: 'Flux App Deployment', path: '/backgrounds/28.png', thumbnail: '/backgrounds/thumbnails/28.jpg' },
  { id: '29', name: 'Flux VS AWS - 3', path: '/backgrounds/29.png', thumbnail: '/backgrounds/thumbnails/29.jpg' },
  { id: '30', name: 'Flux Generic BG 22', path: '/backgrounds/30.png', thumbnail: '/backgrounds/thumbnails/30.jpg' },
  { id: '31', name: 'PoUW V2 Node Rewards', path: '/backgrounds/31.png', thumbnail: '/backgrounds/thumbnails/31.jpg' },
  { id: '32', name: 'PoUW V2 Nodes 1', path: '/backgrounds/32.png', thumbnail: '/backgrounds/thumbnails/32.jpg' },
  { id: '33', name: 'PoUW V2 Nodes 2', path: '/backgrounds/33.png', thumbnail: '/backgrounds/thumbnails/33.jpg' },
  { id: '34', name: 'PoUW V2 Nodes 3', path: '/backgrounds/34.png', thumbnail: '/backgrounds/thumbnails/34.jpg' },
  { id: '35', name: 'PoUW V2 Nodes 4', path: '/backgrounds/35.png', thumbnail: '/backgrounds/thumbnails/35.jpg' },
  { id: '36', name: 'PoUW Cloud', path: '/backgrounds/36.png', thumbnail: '/backgrounds/thumbnails/36.jpg' },
  { id: '37', name: 'PoUW Deployment', path: '/backgrounds/37.png', thumbnail: '/backgrounds/thumbnails/37.jpg' },
  { id: '38', name: 'PoUW Orbit', path: '/backgrounds/38.png', thumbnail: '/backgrounds/thumbnails/38.jpg' },
  { id: '39', name: 'Nodes Revenue', path: '/backgrounds/39.png', thumbnail: '/backgrounds/thumbnails/39.jpg' },
  { id: '40', name: 'Flux Academy', path: '/backgrounds/40.png', thumbnail: '/backgrounds/thumbnails/40.jpg' },
  { id: '41', name: 'Project Factor', path: '/backgrounds/41.png', thumbnail: '/backgrounds/thumbnails/41.jpg' },
  { id: '42', name: 'Kadena Community', path: '/backgrounds/42.png', thumbnail: '/backgrounds/thumbnails/42.jpg' },
  { id: '43', name: 'Orbit Platforms', path: '/backgrounds/43.png', thumbnail: '/backgrounds/thumbnails/43.jpg' },
  { id: '44', name: 'Orbit Platforms 2', path: '/backgrounds/44.png', thumbnail: '/backgrounds/thumbnails/44.jpg' },
  { id: '45', name: 'Orbit Platforms 3', path: '/backgrounds/45.png', thumbnail: '/backgrounds/thumbnails/45.jpg' },
]

const SSP_BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'ssp-9',
    name: '90% Cheaper Than Alternatives',
    path: '/products/ssp/backgrounds/90 percent cheaper than alternatives.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/90 percent cheaper than alternatives.jpg',
  },
  {
    id: 'ssp-10',
    name: '1 Hour Setup',
    path: '/products/ssp/backgrounds/1 hour setup.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/1 hour setup.jpg',
  },
  {
    id: 'ssp-11',
    name: 'No Vendor Lock In',
    path: '/products/ssp/backgrounds/no vendor lock in.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/no vendor lock in.jpg',
  },
  {
    id: 'ssp-1',
    name: 'Biometrics Security',
    path: '/products/ssp/backgrounds/biometrics security.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/biometrics security.jpg',
  },
  {
    id: 'ssp-2',
    name: 'Complete Audit Trail',
    path: '/products/ssp/backgrounds/complete audit trail.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/complete audit trail.jpg',
  },
  {
    id: 'ssp-3',
    name: 'Fully Open Source',
    path: '/products/ssp/backgrounds/fully open source.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/fully open source.jpg',
  },
  {
    id: 'ssp-4',
    name: 'Generic Main',
    path: '/products/ssp/backgrounds/generic - main.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/generic - main.jpg',
  },
  {
    id: 'ssp-5',
    name: 'Multi Chain Native',
    path: '/products/ssp/backgrounds/multi chain native.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/multi chain native.jpg',
  },
  {
    id: 'ssp-6',
    name: 'Multi Party Approval',
    path: '/products/ssp/backgrounds/multi party approval.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/multi party approval.jpg',
  },
  {
    id: 'ssp-7',
    name: 'Security Audited Halborn',
    path: '/products/ssp/backgrounds/security audited halborn.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/security audited halborn.jpg',
  },
  {
    id: 'ssp-8',
    name: 'True Self Custody',
    path: '/products/ssp/backgrounds/true self custody.png',
    thumbnail: '/products/ssp/backgrounds/thumbnails/true self custody.jpg',
  },
  {
    id: 'ssp-v1',
    name: '90% Cheaper Than Alternatives (Video)',
    path: '/products/ssp/backgrounds/90 percent cheaper than alternatives.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/90 percent cheaper than alternatives.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v2',
    name: '1 Hour Setup (Video)',
    path: '/products/ssp/backgrounds/1 hour setup.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/1 hour setup.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v3',
    name: 'No Vendor Lock In (Video)',
    path: '/products/ssp/backgrounds/no vendor lock in.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/no vendor lock in.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v4',
    name: 'Biometrics Security (Video)',
    path: '/products/ssp/backgrounds/biometric security.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/biometrics security.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v5',
    name: 'Complete Audit Trail (Video)',
    path: '/products/ssp/backgrounds/complete audit trail.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/complete audit trail.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v6',
    name: 'Fully Open Source (Video)',
    path: '/products/ssp/backgrounds/fully open source.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/fully open source.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v7',
    name: 'Generic Main (Video)',
    path: '/products/ssp/backgrounds/generic - main.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/generic - main.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v8',
    name: 'Multi Chain Native (Video)',
    path: '/products/ssp/backgrounds/multi chain native.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/multi chain native.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v9',
    name: 'Multi Party Approval (Video)',
    path: '/products/ssp/backgrounds/mutli part approval.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/multi party approval.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v10',
    name: 'Security Audited Halborn (Video)',
    path: '/products/ssp/backgrounds/sec audit halbron.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/security audited halborn.jpg',
    type: 'video',
  },
  {
    id: 'ssp-v11',
    name: 'True Self Custody (Video)',
    path: '/products/ssp/backgrounds/true self custody.mp4',
    thumbnail: '/products/ssp/backgrounds/thumbnails/true self custody.jpg',
    type: 'video',
  },
]

export const PRODUCTS: Record<ProductConfig['id'], ProductConfig> = {
  flux: {
    id: 'flux',
    name: 'Flux',
    subtitle: 'Flux Marketing',
    logoPath: '/flux-logo.svg',
    defaults: {
      headline: 'Write a great headline here',
      subtext: 'Enter description text. It can be the details of the post, a feature of Flux, or any other relevant information. Or remove if no need.',
      logoOverlayEnabled: true,
    },
    backgrounds: mergeBackgrounds(FLUX_BACKGROUNDS, DISCOVERED_FLUX_BACKGROUNDS),
  },
  ssp: {
    id: 'ssp',
    name: 'SSP',
    subtitle: 'SSP Marketing',
    logoPath: '/products/ssp/ssp-enterprise-black.png',
    defaults: {
      headline: 'Write an SSP headline here',
      subtext: 'Add SSP-specific marketing copy. You can remove this line if not needed.',
      logoOverlayEnabled: false,
    },
    backgrounds: mergeBackgrounds(SSP_BACKGROUNDS, DISCOVERED_SSP_BACKGROUNDS),
  },
}

export const PRODUCT_ORDER: ProductConfig['id'][] = ['flux', 'ssp']


