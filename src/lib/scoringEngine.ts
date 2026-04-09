import type {
  Deal, Company, Person, DealScore, DimensionScore, UpgradeMove,
  ViabilityPath, ScoreGrade, ScoreDimension, DealType,
} from '../types'

// ── Grade Utilities ──

const GRADE_NUM: Record<ScoreGrade, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 }
const NUM_GRADE = (n: number): ScoreGrade =>
  n >= 4.5 ? 'S' : n >= 3.5 ? 'A' : n >= 2.5 ? 'B' : n >= 1.5 ? 'C' : 'D'

const NEXT_GRADE: Record<ScoreGrade, ScoreGrade> = { D: 'C', C: 'B', B: 'A', A: 'S', S: 'S' }

function fmt$(v: number): string {
  return `$${v.toLocaleString()}`
}

// ── Prestigious Brands / Industries ──

const PRESTIGIOUS_COMPANIES = new Set([
  'apple', 'google', 'meta', 'microsoft', 'adobe', 'figma', 'canva',
  'notion', 'linear', 'stripe', 'vercel', 'openai', 'anthropic',
  'elevenlabs', 'midjourney', 'runway', 'nvidia', 'tesla', 'nike',
  'spotify', 'netflix', 'airbnb', 'uber', 'amazon',
])

const PRESTIGIOUS_INDUSTRIES = new Set([
  'AI', 'Artificial Intelligence', 'Design Tools', 'Creative Tools',
  'Developer Tools', 'SaaS', 'Enterprise Software',
])

const MAJOR_PLATFORMS = new Set([
  'youtube', 'x', 'twitter', 'instagram', 'ig', 'tiktok',
  'linkedin', 'newsletter', 'threads', 'podcast',
])

// ── 9 Dimension Scorers ──

function scoreCashValue(deal: Deal): DimensionScore {
  const v = deal.value ?? 0
  let grade: ScoreGrade
  let reasoning: string

  if (v >= 30000) {
    grade = 'S'
    reasoning = `Deal value is ${fmt$(v)} — top-tier cash for a creator deal.`
  } else if (v >= 15000) {
    grade = 'A'
    reasoning = `Deal value is ${fmt$(v)} which hits the A tier ($15K+).`
  } else if (v >= 8000) {
    grade = 'B'
    reasoning = `Deal value is ${fmt$(v)} — solid but not exceptional.`
  } else if (v >= 3000) {
    grade = 'C'
    reasoning = `Deal value is ${fmt$(v)} — below our comfort zone. Consider countering higher.`
  } else {
    grade = 'D'
    reasoning = v > 0
      ? `Deal value is only ${fmt$(v)} — too low for Jamey's time unless effort is minimal.`
      : 'No value set. Need to establish pricing before evaluating cash.'
  }

  return { dimension: 'Cash Value', grade, reasoning }
}

function scoreBrandPrestige(_deal: Deal, company?: Company): DimensionScore {
  const name = (company?.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const industry = company?.industry ?? ''

  if (PRESTIGIOUS_COMPANIES.has(name)) {
    return {
      dimension: 'Brand Prestige',
      grade: 'S',
      reasoning: `${company!.name} is a tier-1 brand. Top-shelf association for Jamey's portfolio.`,
    }
  }

  if (PRESTIGIOUS_INDUSTRIES.has(industry)) {
    return {
      dimension: 'Brand Prestige',
      grade: 'A',
      reasoning: `${company?.name ?? 'Company'} operates in ${industry} — a respected space that aligns with Jamey's positioning.`,
    }
  }

  if (company?.name) {
    return {
      dimension: 'Brand Prestige',
      grade: 'B',
      reasoning: `${company.name} is a known brand but not a prestige play. Functional, not aspirational.`,
    }
  }

  return {
    dimension: 'Brand Prestige',
    grade: 'C',
    reasoning: 'Unknown company — no brand prestige signal.',
  }
}

function scoreDistribution(deal: Deal): DimensionScore {
  const platforms = (deal.platforms ?? []).map(p => p.toLowerCase().trim())
  const majorCount = platforms.filter(p =>
    [...MAJOR_PLATFORMS].some(mp => p.includes(mp))
  ).length

  let grade: ScoreGrade
  let reasoning: string

  if (majorCount >= 4) {
    grade = 'S'
    reasoning = `${majorCount} major platforms (${deal.platforms!.join(', ')}). Exceptional distribution reach.`
  } else if (majorCount >= 3 || platforms.some(p => p.includes('youtube') || p.includes('newsletter'))) {
    grade = 'A'
    reasoning = platforms.some(p => p.includes('youtube'))
      ? `Includes YouTube — high-value distribution channel. ${majorCount} platform(s) total.`
      : platforms.some(p => p.includes('newsletter'))
        ? `Includes newsletter — direct audience reach. ${majorCount} platform(s) total.`
        : `${majorCount} platforms: ${deal.platforms!.join(', ')}. Good multi-platform spread.`
  } else if (majorCount >= 2) {
    grade = 'B'
    reasoning = `${majorCount} platforms (${deal.platforms!.join(', ')}). Decent but could be broader.`
  } else if (majorCount === 1) {
    grade = 'C'
    reasoning = `Single platform (${deal.platforms?.[0] ?? 'unknown'}). Limited distribution.`
  } else {
    grade = 'D'
    reasoning = platforms.length === 0
      ? 'No platforms specified. Need to define distribution channels.'
      : `Platforms listed (${deal.platforms!.join(', ')}) are not major distribution channels.`
  }

  return { dimension: 'Distribution', grade, reasoning }
}

function scoreAudienceMatch(deal: Deal): DimensionScore {
  const type = deal.type
  const typeGrades: Record<DealType, { grade: ScoreGrade; reason: string }> = {
    'Education Partnership': { grade: 'S', reason: 'Education partnerships are Jamey\'s core strength — direct audience alignment.' },
    'Consulting':           { grade: 'S', reason: 'Consulting leverages Jamey\'s expertise directly. Perfect audience match.' },
    'Workshop':             { grade: 'S', reason: 'Workshops let Jamey teach what she knows best. Core strength.' },
    'Brand Ambassador':     { grade: 'A', reason: 'Ambassador deals position Jamey as an authority figure to the brand\'s audience.' },
    'Creative Direction':   { grade: 'A', reason: 'Creative direction showcases Jamey\'s design leadership to a relevant audience.' },
    'Speaking':             { grade: 'A', reason: 'Speaking engagements reach design and AI audiences directly.' },
    'Sponsored Video':      { grade: 'B', reason: 'Sponsored video reaches Jamey\'s audience but with brand messaging constraints.' },
    'Sponsored Post':       { grade: 'B', reason: 'Sponsored post format has limited depth for audience engagement.' },
    'QRT + Comment':        { grade: 'C', reason: 'QRT + Comment format has shallow engagement. Brief touchpoint, not deep connection.' },
    'Affiliate':            { grade: 'C', reason: 'Affiliate deals are transactional. Audience match depends on the product, not the format.' },
    'Brand Design':         { grade: 'D', reason: 'Brand design is service work — Jamey\'s audience doesn\'t see it happening.' },
  }

  const match = typeGrades[type] ?? { grade: 'B', reason: `${type} deal — moderate audience alignment.` }
  return { dimension: 'Audience Match', grade: match.grade, reasoning: match.reason }
}

function scoreEducationFunnel(deal: Deal): DimensionScore {
  const type = deal.type
  const deliverables = (deal.deliverables ?? '').toLowerCase()

  if (type === 'Education Partnership' || type === 'Workshop') {
    return {
      dimension: 'Education Funnel',
      grade: 'S',
      reasoning: `${type} directly feeds Jamey's course/community pipeline. Perfect funnel alignment.`,
    }
  }

  if (deliverables.includes('course') || deliverables.includes('tutorial') || deliverables.includes('education') || deliverables.includes('workshop') || deliverables.includes('curriculum')) {
    return {
      dimension: 'Education Funnel',
      grade: 'A',
      reasoning: 'Deliverables include educational content — strong pipeline to Maven course.',
    }
  }

  if (type === 'Brand Ambassador') {
    return {
      dimension: 'Education Funnel',
      grade: 'B',
      reasoning: 'Ambassador deal creates ongoing touchpoints that can funnel to education. Indirect but useful.',
    }
  }

  if (type === 'Sponsored Video' || type === 'Sponsored Post' || type === 'QRT + Comment' || type === 'Affiliate' || type === 'Speaking') {
    return {
      dimension: 'Education Funnel',
      grade: 'C',
      reasoning: `One-off ${type.toLowerCase()} content. Limited education funnel value unless CTA is negotiated.`,
    }
  }

  // Service work
  return {
    dimension: 'Education Funnel',
    grade: 'D',
    reasoning: 'Service work with no education funnel. The audience doesn\'t see this work.',
  }
}

function scoreRelationshipCompound(_deal: Deal, pastDealCount: number): DimensionScore {
  let grade: ScoreGrade
  let reasoning: string

  if (pastDealCount >= 3) {
    grade = 'S'
    reasoning = `${pastDealCount} past deals with this company. Deep relationship that compounds over time.`
  } else if (pastDealCount === 2) {
    grade = 'A'
    reasoning = '2 past deals with this company. Relationship is building — they keep coming back.'
  } else if (pastDealCount === 1) {
    grade = 'B'
    reasoning = '1 past deal with this company. Some relationship established.'
  } else {
    grade = 'C'
    reasoning = 'New relationship — no deal history with this company yet.'
  }

  return { dimension: 'Relationship Compound', grade, reasoning }
}

function scoreCreativeValue(deal: Deal): DimensionScore {
  const typeGrades: Record<DealType, { grade: ScoreGrade; reason: string }> = {
    'Creative Direction':   { grade: 'S', reason: 'Creative direction is portfolio-worthy work. Showcases Jamey\'s design leadership.' },
    'Brand Design':         { grade: 'S', reason: 'Brand design is core creative work — high portfolio and showcase value.' },
    'Sponsored Video':      { grade: 'A', reason: 'Sponsored video allows creative expression. Good portfolio content if executed well.' },
    'Education Partnership': { grade: 'A', reason: 'Education content builds authority. Strong creative value for Jamey\'s brand.' },
    'Workshop':             { grade: 'A', reason: 'Workshops showcase Jamey\'s teaching ability and creative process.' },
    'Speaking':             { grade: 'A', reason: 'Speaking engagements build authority and creative reputation.' },
    'Brand Ambassador':     { grade: 'B', reason: 'Ambassador deals are ongoing but creatively constrained by brand guidelines.' },
    'Consulting':           { grade: 'B', reason: 'Consulting is valuable but invisible — doesn\'t produce creative output.' },
    'Sponsored Post':       { grade: 'C', reason: 'Sponsored post format limits creative depth. Brief, not portfolio-worthy.' },
    'QRT + Comment':        { grade: 'D', reason: 'QRT + Comment is the lowest creative bar. Quick engagement, not creative showcase.' },
    'Affiliate':            { grade: 'D', reason: 'Affiliate is transactional. No creative value — just a promotion.' },
  }

  const match = typeGrades[deal.type] ?? { grade: 'B', reason: `${deal.type} — moderate creative value.` }
  return { dimension: 'Creative Value', grade: match.grade, reasoning: match.reason }
}

function scoreTimeCost(deal: Deal): DimensionScore {
  const typeGrades: Record<DealType, { grade: ScoreGrade; reason: string }> = {
    'QRT + Comment':        { grade: 'S', reason: 'QRT + Comment requires minimal production time. High $/hr potential.' },
    'Affiliate':            { grade: 'S', reason: 'Affiliate deal requires minimal ongoing effort. Post and earn.' },
    'Sponsored Post':       { grade: 'A', reason: 'Sponsored post takes 1-2 days of production. Efficient $/hr.' },
    'Speaking':             { grade: 'A', reason: 'Speaking is a single event commitment. Good time efficiency.' },
    'Sponsored Video':      { grade: 'B', reason: 'Sponsored video takes 3-5 days of production. Moderate time investment.' },
    'Workshop':             { grade: 'B', reason: 'Workshop requires preparation and delivery. Moderate time cost.' },
    'Brand Ambassador':     { grade: 'C', reason: 'Ambassador deals are ongoing commitments. Time adds up over months.' },
    'Education Partnership': { grade: 'C', reason: 'Education partnerships involve curriculum creation. Significant time investment.' },
    'Creative Direction':   { grade: 'D', reason: 'Creative direction is high-effort, high-touch work. Weeks of involvement.' },
    'Consulting':           { grade: 'D', reason: 'Consulting requires deep engagement. High time cost per deliverable.' },
    'Brand Design':         { grade: 'D', reason: 'Brand design projects are time-intensive. Multiple rounds of iteration.' },
  }

  const match = typeGrades[deal.type] ?? { grade: 'B', reason: `${deal.type} — moderate time cost.` }
  return { dimension: 'Time Cost', grade: match.grade, reasoning: match.reason }
}

function scoreStrategicTiming(deal: Deal): DimensionScore {
  const closeDate = deal.expectedCloseDate
  const now = new Date()

  if (!closeDate) {
    return {
      dimension: 'Strategic Timing',
      grade: 'C',
      reasoning: 'No expected close date set. Hard to evaluate timing urgency.',
    }
  }

  const close = new Date(closeDate)
  const daysUntilClose = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilClose < 0) {
    return {
      dimension: 'Strategic Timing',
      grade: 'D',
      reasoning: `Expected close date was ${Math.abs(daysUntilClose)} days ago. Deal is stale — needs action or archiving.`,
    }
  }

  if (daysUntilClose <= 14) {
    return {
      dimension: 'Strategic Timing',
      grade: 'S',
      reasoning: `Closing in ${daysUntilClose} days. Urgent momentum — act now to capture this deal.`,
    }
  }

  if (daysUntilClose <= 30) {
    return {
      dimension: 'Strategic Timing',
      grade: 'A',
      reasoning: `Closing in ~${Math.ceil(daysUntilClose / 7)} weeks. Good pace — keep pushing.`,
    }
  }

  if (daysUntilClose <= 60) {
    return {
      dimension: 'Strategic Timing',
      grade: 'B',
      reasoning: `Closing in ~${Math.ceil(daysUntilClose / 30)} months. No rush, but don't let it stall.`,
    }
  }

  return {
    dimension: 'Strategic Timing',
    grade: 'B',
    reasoning: `Close date is ${daysUntilClose} days out. Long timeline — keep warm but don't over-invest yet.`,
  }
}

// ── Dimension Weights (must sum to 1.0) ──

const WEIGHTS: Record<ScoreDimension, number> = {
  'Cash Value': 0.20,
  'Brand Prestige': 0.12,
  'Distribution': 0.10,
  'Audience Match': 0.10,
  'Education Funnel': 0.10,
  'Relationship Compound': 0.08,
  'Creative Value': 0.10,
  'Time Cost': 0.10,
  'Strategic Timing': 0.10,
}

// ── Upgrade Moves Generator ──

function generateUpgradeMoves(deal: Deal, dimensions: DimensionScore[]): UpgradeMove[] {
  const moves: UpgradeMove[] = []

  for (const dim of dimensions) {
    if (dim.grade === 'S' || dim.grade === 'A') continue

    const potential = NEXT_GRADE[dim.grade]
    let move = ''

    switch (dim.dimension) {
      case 'Cash Value': {
        const v = deal.value ?? 0
        const nextThreshold = dim.grade === 'B' ? 15000 : dim.grade === 'C' ? 8000 : 3000
        move = v > 0
          ? `Counter at ${fmt$(nextThreshold)} to push Cash Value from ${dim.grade} to ${potential}. Current value is ${fmt$(v)}.`
          : `Set a price — can't evaluate cash without a number. Aim for ${fmt$(nextThreshold)}+ for ${potential}-tier.`
        break
      }
      case 'Brand Prestige':
        move = `Frame the deal title to elevate prestige — "AI Design Advisor for ${deal.name}" vs generic partnership. Title framing matters.`
        break
      case 'Distribution':
        move = deal.platforms && deal.platforms.length > 0
          ? `Add more platforms — YouTube or newsletter would significantly boost distribution from ${dim.grade} to ${potential}.`
          : `Define distribution channels. Even adding 2 major platforms would improve this score.`
        break
      case 'Audience Match':
        move = `Reposition the deal angle toward AI tools, design, or education to better match Jamey's core audience.`
        break
      case 'Education Funnel':
        move = `Negotiate a Maven course CTA or tutorial component to create an education pipeline from this deal.`
        break
      case 'Relationship Compound':
        move = `Propose a multi-part or ongoing arrangement to build relationship depth beyond a one-off deal.`
        break
      case 'Creative Value':
        move = `Negotiate creative control so Jamey picks topics/direction. Authentic creative work is portfolio-worthy.`
        break
      case 'Time Cost':
        move = `Reduce deliverable scope or simplify format to improve time efficiency without cutting total value.`
        break
      case 'Strategic Timing':
        move = deal.expectedCloseDate
          ? `Set a tighter timeline or follow up now to create deal velocity.`
          : `Set an expected close date to create urgency and track momentum.`
        break
    }

    moves.push({
      dimension: dim.dimension,
      currentGrade: dim.grade,
      potentialGrade: potential,
      move,
    })
  }

  return moves
}

// ── Viability Paths Generator ──

function generateViabilityPaths(
  deal: Deal,
  dimensions: DimensionScore[],
  overallGrade: ScoreGrade,
  upgradeMoves: UpgradeMove[],
): ViabilityPath[] {
  const gradeVerdict = (g: ScoreGrade): ViabilityPath['verdict'] =>
    g === 'S' ? 'no-brainer' : g === 'A' ? 'strong' : g === 'B' ? 'viable' : g === 'C' ? 'marginal' : 'not worth it'

  // Path A: Current deal
  const pathA: ViabilityPath = {
    name: 'Current Deal',
    label: 'Path A',
    overallGrade,
    verdict: gradeVerdict(overallGrade),
    changes: [`${deal.type} at ${fmt$(deal.value ?? 0)} as proposed`],
    whatMakesItWork: dimensions
      .filter(d => d.grade === 'S' || d.grade === 'A')
      .map(d => `${d.dimension} (${d.grade})`)
      .join(', ') || undefined,
    whatHoldsItBack: dimensions
      .filter(d => d.grade === 'C' || d.grade === 'D')
      .map(d => `${d.dimension} (${d.grade})`)
      .join(', ') || undefined,
  }

  // Path B: Expanded — apply top upgrade moves
  const topMoves = upgradeMoves.slice(0, 3)
  const expandedScore = GRADE_NUM[overallGrade] + topMoves.length * 0.3
  const expandedGrade = NUM_GRADE(Math.min(expandedScore, 5))
  const pathB: ViabilityPath = {
    name: 'Expanded Deal',
    label: 'Path B',
    overallGrade: expandedGrade,
    verdict: gradeVerdict(expandedGrade),
    changes: topMoves.map(m => m.move),
    whatMakesItWork: topMoves.length > 0
      ? `Implementing these ${topMoves.length} upgrades addresses the weakest dimensions.`
      : undefined,
  }

  // Path C: Dream version
  const dreamChanges: string[] = []
  const v = deal.value ?? 0
  if (v < 30000) dreamChanges.push(`Push value to ${fmt$(Math.max(v * 1.5, 30000))}`)
  dreamChanges.push('Negotiate creative control and topic selection')
  dreamChanges.push('Add newsletter/platform feature for maximum distribution')
  dreamChanges.push('Include Maven course CTA in all deliverables')
  if (deal.type !== 'Brand Ambassador' && deal.type !== 'Education Partnership') {
    dreamChanges.push('Convert to ongoing relationship (ambassador or education partner)')
  }

  const pathC: ViabilityPath = {
    name: 'Dream Version',
    label: 'Path C',
    overallGrade: 'S',
    verdict: 'no-brainer',
    changes: dreamChanges,
    whatMakesItWork: 'Every dimension optimized. This is what an S-tier deal looks like for Jamey.',
  }

  return [pathA, pathB, pathC]
}

// ── Positioning Angles Generator ──

function generatePositioningAngles(deal: Deal, company?: Company): string[] {
  const angles: string[] = []
  const companyName = company?.name ?? 'the brand'

  // Always generate the practitioner angle
  angles.push(
    `The practitioner angle: "I use ${companyName}'s tools in my actual workflow. This isn't a sponsorship — it's documenting what I already do."`
  )

  // Type-specific angles
  switch (deal.type) {
    case 'Education Partnership':
    case 'Workshop':
      angles.push(
        `The educator angle: "I'm building the definitive AI design curriculum, starting with this ${deal.type.toLowerCase()} for ${companyName}."`
      )
      break
    case 'Brand Ambassador':
      angles.push(
        `The insider angle: "I get early access to everything ${companyName} ships. You see it here first."`
      )
      break
    case 'Sponsored Video':
    case 'Sponsored Post':
      angles.push(
        `The results angle: "Watch me create something real with ${companyName}'s product in real time — not a demo, actual work."`
      )
      break
    case 'Consulting':
    case 'Creative Direction':
      angles.push(
        `The authority angle: "${companyName} brought me in to lead their design direction. That's the level of trust."`
      )
      break
    default:
      angles.push(
        `The credibility angle: "Working with ${companyName} validates the workflow I've been teaching."`
      )
  }

  // Market timing angle
  angles.push(
    `The timing angle: "AI creative tools are evolving fast. I'm partnering with the companies building the future — ${companyName} is one of them."`
  )

  return angles.slice(0, 3)
}

// ── Recommendation Generator ──

function generateRecommendation(
  _deal: Deal,
  overallGrade: ScoreGrade,
  dimensions: DimensionScore[],
  upgradeMoves: UpgradeMove[],
): string {
  const strengths = dimensions.filter(d => d.grade === 'S' || d.grade === 'A')
  const weaknesses = dimensions.filter(d => d.grade === 'C' || d.grade === 'D')

  let rec = ''

  if (overallGrade === 'S' || overallGrade === 'A') {
    rec = `Strong deal overall (${overallGrade}).`
    if (strengths.length > 0) {
      rec += ` Key strengths: ${strengths.slice(0, 3).map(s => `${s.dimension} (${s.grade})`).join(', ')}.`
    }
    if (weaknesses.length > 0) {
      rec += ` Push to improve ${weaknesses[0].dimension} — ${upgradeMoves.find(m => m.dimension === weaknesses[0].dimension)?.move ?? 'needs attention'}`
    }
  } else if (overallGrade === 'B') {
    rec = `Viable deal (${overallGrade}) but has room to improve.`
    if (upgradeMoves.length > 0) {
      rec += ` Focus on: ${upgradeMoves.slice(0, 2).map(m => m.move).join(' ')}`
    }
  } else {
    rec = `Below threshold (${overallGrade}).`
    if (weaknesses.length > 0) {
      rec += ` Major concerns: ${weaknesses.map(w => `${w.dimension} (${w.grade})`).join(', ')}.`
    }
    rec += ' Consider renegotiating fundamentals or passing.'
  }

  return rec
}

// ── Main Entry Point ──

/**
 * Deterministic deal evaluation — same inputs always produce the same DealScore.
 * @param deal           The deal to evaluate
 * @param company        The company associated with the deal
 * @param _person        The primary contact (reserved for future use)
 * @param pastDealCount  Number of previous deals with the same company
 */
export function evaluateDeal(
  deal: Deal,
  company?: Company,
  _person?: Person,
  pastDealCount: number = 0,
): DealScore {
  // Score all 9 dimensions
  const dimensions: DimensionScore[] = [
    scoreCashValue(deal),
    scoreBrandPrestige(deal, company),
    scoreDistribution(deal),
    scoreAudienceMatch(deal),
    scoreEducationFunnel(deal),
    scoreRelationshipCompound(deal, pastDealCount),
    scoreCreativeValue(deal),
    scoreTimeCost(deal),
    scoreStrategicTiming(deal),
  ]

  // Weighted average
  const weightedSum = dimensions.reduce((sum, dim) => {
    const weight = WEIGHTS[dim.dimension]
    return sum + GRADE_NUM[dim.grade] * weight
  }, 0)
  const overallGrade = NUM_GRADE(weightedSum)

  // Generate insights
  const upgradeMoves = generateUpgradeMoves(deal, dimensions)
  const viabilityPaths = generateViabilityPaths(deal, dimensions, overallGrade, upgradeMoves)
  const positioningAngles = generatePositioningAngles(deal, company)
  const recommendation = generateRecommendation(deal, overallGrade, dimensions, upgradeMoves)

  return {
    dealId: deal.id,
    overallGrade,
    dimensions,
    upgradeMoves,
    viabilityPaths,
    positioningAngles,
    recommendation,
    evaluatedAt: new Date().toISOString(),
  }
}
