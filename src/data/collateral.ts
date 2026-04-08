// ── Collateral: Media Kits, Decks, Sales Assets ──

export interface CollateralItem {
  id: string
  title: string
  type: 'media-kit' | 'deck' | 'case-study' | 'rate-card' | 'template' | 'one-pager'
  url: string
  description: string
  lastUpdated: string
  tags: string[]
}

export interface AudienceStat {
  platform: string
  followers: string
  notes?: string
}

export interface RateCard {
  offering: string
  price: string
  notes?: string
}

// ── Jamey's Audience Stats (from Media Kit) ──
export const audienceStats: AudienceStat[] = [
  { platform: 'X (Twitter)', followers: '24,200+', notes: '76.5M+ impressions (12mo), 8.0% engagement rate, 78.2% non-follower reach' },
  { platform: 'TikTok', followers: '30,500+', notes: 'Dormant — no posts 12+ months' },
  { platform: 'Instagram', followers: '19,463', notes: '94.1% non-follower reach, Reels = 87.3% of views' },
  { platform: 'Email List', followers: '1,535', notes: 'Newsletter subscribers' },
]

// ── Partnership Rate Card ──
export const rateCard: RateCard[] = [
  { offering: 'Single Sponsored Post (X or IG/TikTok)', price: '$3,500' },
  { offering: 'Add Second Platform', price: '+$1,500' },
  { offering: 'Campaign (1 week, 3-5 posts)', price: '$8,000' },
  { offering: 'Add Second Platform to Campaign', price: '+$3,000' },
  { offering: 'Paid Media Usage Rights (single)', price: '+40% ($1,400)' },
  { offering: 'Paid Media Usage Rights (campaign)', price: '+$1,000/post' },
  { offering: 'Video Tutorial / Brand Appearance', price: 'Starts at $5,000' },
  { offering: 'Custom Education / Evergreen Content', price: 'Base rate $30,000' },
]

// ── Key Stats (for quick reference) ──
export const keyStats = {
  totalReach: '~75,700',
  courseStudents: '207+',
  courseRevenue: '$100K+',
  courseRating: '4.9/5.0',
  cohortPrice: '$800',
  freelanceRevenue: '$1M+',
  startupsServed: '60+',
  xImpressions12mo: '76.5M+',
  xEngagementRate: '8.0%',
  xBestPost: '3.4M impressions / 34K likes',
  notableFollowers: 'Marc Andreessen, Andrew Chen, David Holz (Midjourney founder)',
  googleRanking: '#1 for "the AI creative director"',
  previousPartners: ['Adobe', 'Figma', 'LinkedIn', 'Google Labs', 'X AI', 'Higgsfield', 'Flora', 'Freepik', 'Meta'],
}

// ── Demographics ──
export const demographics = {
  topCountry: 'United States (45%)',
  ageRange: '79% age 18-34, 47.3% age 25-34',
  ios: '67.5%',
  nonFollowerReach: '78.2%',
}

// ── Collateral Items ──
export const collateral: CollateralItem[] = [
  {
    id: 'col-1',
    title: 'Media & Partnerships Kit',
    type: 'media-kit',
    url: 'https://jameygannon.notion.site/Media-Partnerships-Kit-32ff9be0ceae81b391e4f5de128a172c',
    description: 'Full media kit with bio, audience stats, engagement metrics, rate card, previous partners, and course performance. Canonical source — send to brand partners.',
    lastUpdated: '2026-04-08',
    tags: ['partnerships', 'rates', 'audience', 'stats'],
  },
  {
    id: 'col-2',
    title: 'Jamey Gannon — Pitch Deck',
    type: 'deck',
    url: 'https://gamma.app/docs/Jamey-Gannon-6ryjz1h2elwqclg',
    description: 'Visual presentation version of the media kit. Same stats formatted as a pitch deck — good for cold outreach and meetings.',
    lastUpdated: '2026-04-08',
    tags: ['partnerships', 'pitch', 'visual'],
  },
]
