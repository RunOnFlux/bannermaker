import {
  DISCOVERED_CUMULUS_BACKGROUNDS,
  DISCOVERED_FLUX_BACKGROUNDS,
  DISCOVERED_FLUXAI_BACKGROUNDS,
  DISCOVERED_SSP_BACKGROUNDS,
  DISCOVERED_ZELCORE_BACKGROUNDS,
} from './discovered-backgrounds'

export interface BackgroundOption {
  id: string
  name: string
  path: string
  thumbnail: string
  type?: 'image' | 'video'
  headline?: string
  subtext?: string
}

export interface ProductConfig {
  id: 'flux' | 'ssp' | 'zelcore' | 'fluxai' | 'cumulus'
  name: string
  subtitle: string
  logoPath: string
  navLogoPath?: string
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

type BackgroundCopy = Pick<BackgroundOption, 'headline' | 'subtext'>

function stripVideoSuffix(name: string): string {
  return name.replace(/\s+\(Video\)$/i, '')
}

function withBackgroundCopy(
  backgrounds: BackgroundOption[],
  copyByName: Record<string, BackgroundCopy>
): BackgroundOption[] {
  return backgrounds.map((background) => {
    const copy = copyByName[stripVideoSuffix(background.name)]
    return copy ? { ...background, ...copy } : background
  })
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

const ZELCORE_COPY: Record<string, BackgroundCopy> = {
  'True Self-Custody': {
    headline: 'True Self-Custody',
    subtext: 'Your keys, your crypto. Zelcore never holds your funds, seed phrase, or private keys. You stay in control at all times.',
  },
  '100K+ Assets in One Wallet': {
    headline: '100K+ Assets in One Wallet',
    subtext: 'Bitcoin, Ethereum, Solana, Avalanche, Flux, Polygon, and thousands more. Manage your entire portfolio without bouncing between apps.',
  },
  '80+ Blockchains Supported': {
    headline: '80+ Blockchains Supported',
    subtext: 'One wallet for the chains you actually use. Store, send, receive, swap, and track assets across a truly multi-chain ecosystem.',
  },
  'Desktop, Mobile, and Browser': {
    headline: 'Desktop, Mobile, and Browser',
    subtext: 'Use Zelcore on Windows, macOS, Linux, iOS, Android, and browser extension. Your crypto command center goes wherever you do.',
  },
  'Built-In Swap Access': {
    headline: 'Built-In Swap Access',
    subtext: 'Trade between assets directly inside Zelcore. No extra exchange tabs, no complicated routing, no leaving your wallet workflow.',
  },
  'Buy, Sell, Send, Receive': {
    headline: 'Buy, Sell, Send, Receive',
    subtext: 'Everything you expect from a modern crypto wallet in one interface. Simple enough for daily use, powerful enough for serious holders.',
  },
  'Biometric Security': {
    headline: 'Biometric Security',
    subtext: 'Unlock and approve wallet access with fingerprint or face ID on supported devices. Fast access without weakening control.',
  },
  'Optional Decentralized 2FA': {
    headline: 'Optional Decentralized 2FA',
    subtext: 'Add another layer of protection without relying on a centralized custodian. Security that keeps ownership in your hands.',
  },
  'Portfolio Visibility': {
    headline: 'Portfolio Visibility',
    subtext: 'Track balances, assets, and activity across chains from one place. Zelcore turns scattered holdings into a clear portfolio view.',
  },
  'Non-Custodial by Design': {
    headline: 'Non-Custodial by Design',
    subtext: 'No exchange custody. No hidden account lockups. No one can move your funds but you.',
  },
  'Hardware Wallet Support': {
    headline: 'Hardware Wallet Support',
    subtext: 'Connect additional protection for long-term holdings and higher-value assets. Keep convenience and security in the same workflow.',
  },
  'Web3 Ready': {
    headline: 'Web3 Ready',
    subtext: 'Access decentralized apps and blockchain ecosystems from a wallet built for multi-chain activity, not single-chain limitations.',
  },
  'Free Forever Core Wallet': {
    headline: 'Free Forever Core Wallet',
    subtext: 'Download and use Zelcore without subscription fees. A serious crypto wallet should not charge you just to hold your own assets.',
  },
  'Built for Real Users': {
    headline: 'Built for Real Users',
    subtext: 'Manage crypto on the device you already use, with an interface built for everyday sending, swapping, and portfolio control.',
  },
  'One Wallet, Full Ownership': {
    headline: 'One Wallet, Full Ownership',
    subtext: 'Zelcore brings assets, chains, swaps, and security into one place while keeping the most important thing untouched: your control.',
  },
}

const SSP_COPY: Record<string, BackgroundCopy> = {
  'True Self Custody': {
    headline: 'True Self-Custody',
    subtext: 'Your keys, your coins. No third party ever holds or touches your assets. Unlike Fireblocks or BitGo, nobody can freeze or seize your funds.',
  },
  'Multi Party Approval': {
    headline: 'Multi-Party Approval',
    subtext: 'No single person can move funds alone. CEO + CFO + Board Member must agree. Eliminates internal fraud and rogue actors.',
  },
  'Multi Chain Native': {
    headline: 'Multi-Chain Native',
    subtext: 'Bitcoin, Ethereum, Polygon, Avalanche, Flux, and 10+ more. One platform, all chains - no juggling multiple tools.',
  },
  '90% Cheaper Than Alternatives': {
    headline: '90% Cheaper Than Alternatives',
    subtext: 'Fireblocks costs $100K-$1M/year. SSP Enterprise core is free. Premium starts at 0.3% AUM annually.',
  },
  'Security Audited Halborn': {
    headline: 'Security Audited by Halborn',
    subtext: 'Not a promise. A proven, independent audit with 100% of issues resolved. March 2025.',
  },
  'Fully Open Source': {
    headline: 'Fully Open Source',
    subtext: 'Every line of code is public. No black boxes, no hidden backdoors. You can verify everything yourself.',
  },
  'Biometrics Security': {
    headline: 'Mobile-Native Biometric Signing',
    subtext: 'Each approver signs from their phone with fingerprint/face ID. Built on the same SSP Key app already in use.',
  },
  'Biometric Security': {
    headline: 'Mobile-Native Biometric Signing',
    subtext: 'Each approver signs from their phone with fingerprint/face ID. Built on the same SSP Key app already in use.',
  },
  'Complete Audit Trail': {
    headline: 'Complete Audit Trail',
    subtext: 'Every transaction, every approval, every rejection - immutably logged for compliance and reporting.',
  },
  '1 Hour Setup': {
    headline: '1-Hour Setup Ceremony',
    subtext: 'No 4-8 week enterprise onboarding. Get a multi-party business wallet running in under an hour.',
  },
  'No Vendor Lock In': {
    headline: 'No Vendor Lock-In',
    subtext: "Open source means you can self-host, fork, or migrate anytime. You're never dependent on a company staying in business.",
  },
}

const ZELCORE_BACKGROUNDS: BackgroundOption[] = [
  { id: 'zelcore-true-self-custody', name: 'True Self-Custody', path: '/products/zelcore/backgrounds/true-self-custody.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/true-self-custody.jpg' },
  { id: 'zelcore-100k-assets-in-one-wallet', name: '100K+ Assets in One Wallet', path: '/products/zelcore/backgrounds/100k-assets-in-one-wallet.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/100k-assets-in-one-wallet.jpg' },
  { id: 'zelcore-80-plus-blockchains-supported', name: '80+ Blockchains Supported', path: '/products/zelcore/backgrounds/80-plus-blockchains-supported.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/80-plus-blockchains-supported.jpg' },
  { id: 'zelcore-desktop-mobile-and-browser', name: 'Desktop, Mobile, and Browser', path: '/products/zelcore/backgrounds/desktop-mobile-and-browser.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/desktop-mobile-and-browser.jpg' },
  { id: 'zelcore-built-in-swap-access', name: 'Built-In Swap Access', path: '/products/zelcore/backgrounds/built-in-swap-access.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/built-in-swap-access.jpg' },
  { id: 'zelcore-buy-sell-send-receive', name: 'Buy, Sell, Send, Receive', path: '/products/zelcore/backgrounds/buy-sell-send-receive.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/buy-sell-send-receive.jpg' },
  { id: 'zelcore-biometric-security', name: 'Biometric Security', path: '/products/zelcore/backgrounds/biometric-security.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/biometric-security.jpg' },
  { id: 'zelcore-optional-decentralized-2fa', name: 'Optional Decentralized 2FA', path: '/products/zelcore/backgrounds/optional-decentralized-2fa.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/optional-decentralized-2fa.jpg' },
  { id: 'zelcore-portfolio-visibility', name: 'Portfolio Visibility', path: '/products/zelcore/backgrounds/portfolio-visibility.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/portfolio-visibility.jpg' },
  { id: 'zelcore-non-custodial-by-design', name: 'Non-Custodial by Design', path: '/products/zelcore/backgrounds/non-custodial-by-design.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/non-custodial-by-design.jpg' },
  { id: 'zelcore-hardware-wallet-support', name: 'Hardware Wallet Support', path: '/products/zelcore/backgrounds/hardware-wallet-support.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/hardware-wallet-support.jpg' },
  { id: 'zelcore-web3-ready', name: 'Web3 Ready', path: '/products/zelcore/backgrounds/web3-ready.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/web3-ready.jpg' },
  { id: 'zelcore-free-forever-core-wallet', name: 'Free Forever Core Wallet', path: '/products/zelcore/backgrounds/free-forever-core-wallet.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/free-forever-core-wallet.jpg' },
  { id: 'zelcore-built-for-real-users', name: 'Built for Real Users', path: '/products/zelcore/backgrounds/built-for-real-users.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/built-for-real-users.jpg' },
  { id: 'zelcore-one-wallet-full-ownership', name: 'One Wallet, Full Ownership', path: '/products/zelcore/backgrounds/one-wallet-full-ownership.jpg', thumbnail: '/products/zelcore/backgrounds/thumbnails/one-wallet-full-ownership.jpg' },
  { id: 'zelcore-v-true-self-custody', name: 'True Self-Custody (Video)', path: '/products/zelcore/backgrounds/true-self-custody.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/true-self-custody.jpg', type: 'video' },
  { id: 'zelcore-v-100k-assets-in-one-wallet', name: '100K+ Assets in One Wallet (Video)', path: '/products/zelcore/backgrounds/100k-assets-in-one-wallet.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/100k-assets-in-one-wallet.jpg', type: 'video' },
  { id: 'zelcore-v-80-plus-blockchains-supported', name: '80+ Blockchains Supported (Video)', path: '/products/zelcore/backgrounds/80-plus-blockchains-supported.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/80-plus-blockchains-supported.jpg', type: 'video' },
  { id: 'zelcore-v-desktop-mobile-and-browser', name: 'Desktop, Mobile, and Browser (Video)', path: '/products/zelcore/backgrounds/desktop-mobile-and-browser.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/desktop-mobile-and-browser.jpg', type: 'video' },
  { id: 'zelcore-v-built-in-swap-access', name: 'Built-In Swap Access (Video)', path: '/products/zelcore/backgrounds/built-in-swap-access.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/built-in-swap-access.jpg', type: 'video' },
  { id: 'zelcore-v-buy-sell-send-receive', name: 'Buy, Sell, Send, Receive (Video)', path: '/products/zelcore/backgrounds/buy-sell-send-receive.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/buy-sell-send-receive.jpg', type: 'video' },
  { id: 'zelcore-v-biometric-security', name: 'Biometric Security (Video)', path: '/products/zelcore/backgrounds/biometric-security.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/biometric-security.jpg', type: 'video' },
  { id: 'zelcore-v-optional-decentralized-2fa', name: 'Optional Decentralized 2FA (Video)', path: '/products/zelcore/backgrounds/optional-decentralized-2fa.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/optional-decentralized-2fa.jpg', type: 'video' },
  { id: 'zelcore-v-portfolio-visibility', name: 'Portfolio Visibility (Video)', path: '/products/zelcore/backgrounds/portfolio-visibility.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/portfolio-visibility.jpg', type: 'video' },
  { id: 'zelcore-v-non-custodial-by-design', name: 'Non-Custodial by Design (Video)', path: '/products/zelcore/backgrounds/non-custodial-by-design.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/non-custodial-by-design.jpg', type: 'video' },
  { id: 'zelcore-v-hardware-wallet-support', name: 'Hardware Wallet Support (Video)', path: '/products/zelcore/backgrounds/hardware-wallet-support.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/hardware-wallet-support.jpg', type: 'video' },
  { id: 'zelcore-v-web3-ready', name: 'Web3 Ready (Video)', path: '/products/zelcore/backgrounds/web3-ready.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/web3-ready.jpg', type: 'video' },
  { id: 'zelcore-v-free-forever-core-wallet', name: 'Free Forever Core Wallet (Video)', path: '/products/zelcore/backgrounds/free-forever-core-wallet.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/free-forever-core-wallet.jpg', type: 'video' },
  { id: 'zelcore-v-built-for-real-users', name: 'Built for Real Users (Video)', path: '/products/zelcore/backgrounds/built-for-real-users.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/built-for-real-users.jpg', type: 'video' },
  { id: 'zelcore-v-one-wallet-full-ownership', name: 'One Wallet, Full Ownership (Video)', path: '/products/zelcore/backgrounds/one-wallet-full-ownership.mp4', thumbnail: '/products/zelcore/backgrounds/thumbnails/one-wallet-full-ownership.jpg', type: 'video' },
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

const CUMULUS_COPY: Record<string, BackgroundCopy> = {
  'Private Internet': {
    headline: 'Private Internet, No Account, No Logs',
    subtext: 'A decentralized VPN on Flux Cloud. Your WireGuard key is your identity — no email, no signup, nothing stored.',
  },
  'No Account No Logs': {
    headline: "We Can't Hand Over What We Never Had",
    subtext: 'No accounts, no logs, no email. Privacy by architecture: there is nothing to subpoena, leak, or sell.',
  },
  'Pay In Flux': {
    headline: 'Pay in FLUX — About $0.99 a Month',
    subtext: 'Send 20 FLUX from any wallet and every gateway unlocks your key within a minute. Prepay to stack months. No card, no billing account.',
  },
  'Free That Works': {
    headline: 'Free That Actually Works',
    subtext: 'Every country, every gateway, forever — throttled to 100 KB/s, fine for browsing and chat. Full speed is one wallet transfer away.',
  },
  'Decentralized Network': {
    headline: 'No Accounts. No Server of Ours. Just the Chain.',
    subtext: 'Payment is a fact on the Flux blockchain that every gateway reads independently. If we vanished tomorrow, the network keeps running.',
  },
  'Every Screen': {
    headline: 'One Connect Button, on Every Screen You Own',
    subtext: 'Web, desktop, and mobile share one design language and one key. Pay once and every device flips to full speed on its own.',
  },
}

export const PRODUCTS: Record<ProductConfig['id'], ProductConfig> = {
  flux: {
    id: 'flux',
    name: 'Flux',
    subtitle: 'Flux Marketing',
    logoPath: '/flux-logo.svg',
    navLogoPath: '/Flux_blue.svg',
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
      headline: 'True Self-Custody',
      subtext: 'Your keys, your coins. No third party ever holds or touches your assets. Unlike Fireblocks or BitGo, nobody can freeze or seize your funds.',
      logoOverlayEnabled: false,
    },
    backgrounds: withBackgroundCopy(mergeBackgrounds(SSP_BACKGROUNDS, DISCOVERED_SSP_BACKGROUNDS), SSP_COPY),
  },
  zelcore: {
    id: 'zelcore',
    name: 'Zelcore',
    subtitle: 'Zelcore Marketing',
    logoPath: '/products/zelcore/zelcore-white.png',
    navLogoPath: '/products/zelcore/zelcore-black.png',
    defaults: {
      headline: 'True Self-Custody',
      subtext: 'Your keys, your crypto. Zelcore never holds your funds, seed phrase, or private keys. You stay in control at all times.',
      logoOverlayEnabled: true,
    },
    backgrounds: withBackgroundCopy(
      mergeBackgrounds(ZELCORE_BACKGROUNDS, DISCOVERED_ZELCORE_BACKGROUNDS),
      ZELCORE_COPY
    ),
  },
  fluxai: {
    id: 'fluxai',
    name: 'FluxAI',
    subtitle: 'FluxAI Marketing',
    logoPath: '/products/fluxai/fluxai-logo-black.png',
    defaults: {
      headline: 'Write a FluxAI headline here',
      subtext: 'Add FluxAI-specific marketing copy. You can remove this line if not needed.',
      logoOverlayEnabled: false,
    },
    backgrounds: mergeBackgrounds([], DISCOVERED_FLUXAI_BACKGROUNDS),
  },
  cumulus: {
    id: 'cumulus',
    name: 'CumulusVPN',
    subtitle: 'CumulusVPN Marketing',
    logoPath: '/products/cumulus/cumulus-logo-white.png',
    navLogoPath: '/products/cumulus/cumulus-logo-ink.png',
    defaults: {
      headline: 'Private Internet, No Account, No Logs',
      subtext: 'A decentralized VPN on Flux Cloud. Your WireGuard key is your identity — no email, no signup, nothing stored.',
      logoOverlayEnabled: true,
    },
    backgrounds: withBackgroundCopy(
      mergeBackgrounds([], DISCOVERED_CUMULUS_BACKGROUNDS),
      CUMULUS_COPY
    ),
  },
}

export const PRODUCT_ORDER: ProductConfig['id'][] = ['flux', 'ssp', 'zelcore', 'fluxai', 'cumulus']


