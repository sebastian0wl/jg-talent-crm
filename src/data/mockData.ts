import type { Company, Person, Deal, Action, Fulfillment, Activity } from '../types'

// ── Companies ──

export const companies: Company[] = [
  { id: 'co-1', name: 'Envato', domain: 'envato.com', industry: 'Design Marketplace', dealCount: 1, totalRevenue: 0 },
  { id: 'co-2', name: 'Krea AI', domain: 'krea.ai', industry: 'AI Creative Tools', dealCount: 1, totalRevenue: 0 },
  { id: 'co-3', name: 'ElevenLabs', domain: 'elevenlabs.io', industry: 'AI Audio', dealCount: 1, totalRevenue: 0 },
  { id: 'co-4', name: 'Decimals', domain: 'decimals.co', industry: 'Design Talent', dealCount: 1, totalRevenue: 0 },
  { id: 'co-5', name: 'Grok / xAI', domain: 'x.ai', industry: 'AI / Social', dealCount: 1, totalRevenue: 0 },
  { id: 'co-6', name: 'Flux', domain: 'flux.ai', industry: 'AI Image Gen', dealCount: 1, totalRevenue: 0 },
  { id: 'co-7', name: 'Reve.art', domain: 'reve.art', industry: 'AI Image Gen', dealCount: 1, totalRevenue: 0 },
  { id: 'co-8', name: 'Block Inc', domain: 'block.xyz', industry: 'Fintech', dealCount: 1, totalRevenue: 5000 },
  { id: 'co-9', name: 'Higgsfield', domain: 'higgsfield.ai', industry: 'AI Video', dealCount: 1, totalRevenue: 8000 },
  { id: 'co-10', name: 'Freepik', domain: 'freepik.com', industry: 'Design Assets', dealCount: 1, totalRevenue: 0 },
  { id: 'co-11', name: 'Lovable', domain: 'lovable.dev', industry: 'AI Dev Tools', dealCount: 1, totalRevenue: 0 },
  { id: 'co-12', name: 'Bluehost', domain: 'bluehost.com', industry: 'Web Hosting', dealCount: 1, totalRevenue: 0 },
]

// ── People ──

export const people: Person[] = [
  { id: 'pe-1', name: 'Sarah Chen', email: 'sarah@envato.com', role: 'Partnerships Lead', companyId: 'co-1' },
  { id: 'pe-2', name: 'Victor Perez', email: 'victor@krea.ai', role: 'Head of Growth', companyId: 'co-2' },
  { id: 'pe-3', name: 'Maria Santos', email: 'maria@elevenlabs.io', role: 'Creator Partnerships', companyId: 'co-3' },
  { id: 'pe-4', name: 'Ridd', email: 'ridd@decimals.co', role: 'Scout / Intro', companyId: 'co-4' },
  { id: 'pe-5', name: 'Alex Kim', email: 'alex@x.ai', role: 'Marketing', companyId: 'co-5' },
  { id: 'pe-6', name: 'Jordan Lee', email: 'jordan@flux.ai', role: 'Partnerships', companyId: 'co-6' },
  { id: 'pe-7', name: 'Luna Park', email: 'luna@reve.art', role: 'Community Lead', companyId: 'co-7' },
  { id: 'pe-8', name: 'Tyler Brooks', email: 'tyler@block.xyz', role: 'Brand Manager', companyId: 'co-8' },
  { id: 'pe-9', name: 'Mika Tanaka', email: 'mika@higgsfield.ai', role: 'CEO', companyId: 'co-9' },
  { id: 'pe-10', name: 'Carlos Ruiz', email: 'carlos@freepik.com', role: 'Influencer Ops', companyId: 'co-10' },
  { id: 'pe-11', name: 'Emma Wright', email: 'emma@lovable.dev', role: 'Marketing Lead', companyId: 'co-11' },
  { id: 'pe-12', name: 'Generic Rep', email: 'partnerships@bluehost.com', role: 'Outreach', companyId: 'co-12' },
]

// ── Deals ──

export const deals: Deal[] = [
  {
    id: 'd-1', name: 'Envato — Education Partnership', brand: 'Envato', companyId: 'co-1', contactId: 'pe-1',
    contactEmail: 'sarah@envato.com', status: 'Negotiating', dealType: 'Education Partnership',
    priority: 'High', platforms: ['YouTube', 'X'], quotedRate: 50000, pipelineValue: 40000,
    deliverables: '3-5 tutorials (NOT courses), SREFs, brand design templates, logos',
    keyTerms: 'Jamey wants tutorials not courses. Envato wants logo/brand design content. Non-exclusive.',
    notes: 'Proposal drafted, waiting on Jamey final review before sending.',
    jameyUsesProduct: true, firstContact: '2026-03-10', deadline: '2026-04-15',
    actionIds: ['a-1', 'a-2'], fulfillmentIds: [],
  },
  {
    id: 'd-2', name: 'Krea AI — Ambassador', brand: 'Krea AI', companyId: 'co-2', contactId: 'pe-2',
    contactEmail: 'victor@krea.ai', status: 'Scoping', dealType: 'Ambassador',
    priority: 'High', platforms: ['X', 'YouTube'], quotedRate: 30000, pipelineValue: 24000,
    deliverables: 'Ongoing posts, feature demos, early access content',
    keyTerms: 'They owe Jamey the affiliate link. Multi-model platform = strong strategic fit.',
    notes: 'Jamey already uses and loves the product. Sent last message — ball in their court for affiliate link.',
    jameyUsesProduct: true, firstContact: '2026-03-05', deadline: '2026-04-20',
    actionIds: ['a-3'], fulfillmentIds: [],
  },
  {
    id: 'd-3', name: 'ElevenLabs — Sponsored Post', brand: 'ElevenLabs', companyId: 'co-3', contactId: 'pe-3',
    contactEmail: 'maria@elevenlabs.io', status: 'Warm Lead', dealType: 'Sponsored Post',
    priority: 'Medium', platforms: ['X', 'YouTube'], quotedRate: 15000, pipelineValue: 10000,
    deliverables: 'TBD — likely video + thread',
    keyTerms: 'Initial conversation only. Need to scope deliverables.',
    jameyUsesProduct: true, firstContact: '2026-03-20',
    actionIds: ['a-4'], fulfillmentIds: [],
  },
  {
    id: 'd-4', name: 'Decimals — Affiliate Campaign', brand: 'Decimals', companyId: 'co-4', contactId: 'pe-4',
    contactEmail: 'ridd@decimals.co', status: 'Scoping', dealType: 'Ambassador',
    priority: 'Medium', platforms: ['X'], quotedRate: 0, pipelineValue: 5000,
    deliverables: 'X thread + newsletter email with affiliate link',
    keyTerms: 'Affiliate model — no upfront payment. Revenue share on signups. Drafted campaign content.',
    notes: 'Campaign drafts written and voice-matched. Ready to post when Jamey approves.',
    jameyUsesProduct: false, firstContact: '2026-03-25',
    actionIds: ['a-5', 'a-6'], fulfillmentIds: [],
  },
  {
    id: 'd-5', name: 'Grok — QRT Campaign', brand: 'Grok / xAI', companyId: 'co-5', contactId: 'pe-5',
    contactEmail: 'alex@x.ai', status: 'Scoping', dealType: 'QRT + Comment',
    priority: 'Medium', platforms: ['X'], quotedRate: 8000, pipelineValue: 6000,
    deliverables: 'QRTs + organic mentions',
    keyTerms: 'Jamey already uses Grok for image gen. Natural fit.',
    jameyUsesProduct: true, firstContact: '2026-03-18',
    actionIds: ['a-7'], fulfillmentIds: [],
  },
  {
    id: 'd-6', name: 'Flux — Sponsored Post', brand: 'Flux', companyId: 'co-6', contactId: 'pe-6',
    contactEmail: 'jordan@flux.ai', status: 'Warm Lead', dealType: 'Sponsored Post',
    priority: 'Low', platforms: ['X'], quotedRate: 10000, pipelineValue: 5000,
    deliverables: 'TBD',
    keyTerms: 'Not sure what next step is. Need to re-engage or kill.',
    jameyUsesProduct: false, firstContact: '2026-03-12',
    actionIds: ['a-8'], fulfillmentIds: [],
  },
  {
    id: 'd-7', name: 'Reve.art — Ambassador', brand: 'Reve.art', companyId: 'co-7', contactId: 'pe-7',
    contactEmail: 'luna@reve.art', status: 'Prospect', dealType: 'Ambassador',
    priority: 'Medium', platforms: ['X'], quotedRate: 15000, pipelineValue: 8000,
    deliverables: 'Content series, early access, community building',
    keyTerms: 'Strong image model. Good brand prestige (A-tier). Education funnel potential. Worth pursuing.',
    notes: 'Deal evaluator scored well on Brand Prestige and Education Funnel. Strategic timing is right.',
    jameyUsesProduct: true, firstContact: '2026-04-01',
    actionIds: ['a-9'], fulfillmentIds: [],
  },
  {
    id: 'd-8', name: 'Block — Creative Direction', brand: 'Block Inc', companyId: 'co-8', contactId: 'pe-8',
    contactEmail: 'tyler@block.xyz', status: 'Closed Won', dealType: 'Creative Direction',
    priority: 'High', platforms: [], finalRate: 5000,
    deliverables: 'Brand identity consultation',
    keyTerms: 'Completed. Invoice sent.',
    jameyUsesProduct: false, firstContact: '2026-02-15',
    actionIds: [], fulfillmentIds: ['f-1'],
  },
  {
    id: 'd-9', name: 'Higgsfield — Sponsored Post', brand: 'Higgsfield', companyId: 'co-9', contactId: 'pe-9',
    contactEmail: 'mika@higgsfield.ai', status: 'Closed Won', dealType: 'Sponsored Post',
    priority: 'High', platforms: ['X', 'YouTube'], finalRate: 8000,
    deliverables: 'Sponsored video + thread',
    keyTerms: 'Completed and paid.',
    jameyUsesProduct: true, firstContact: '2026-02-01',
    actionIds: [], fulfillmentIds: ['f-2'],
  },
  {
    id: 'd-10', name: 'Freepik — Education Partnership', brand: 'Freepik', companyId: 'co-10', contactId: 'pe-10',
    contactEmail: 'carlos@freepik.com', status: 'Initial Meeting', dealType: 'Education Partnership',
    priority: 'Medium', platforms: ['YouTube'], quotedRate: 25000, pipelineValue: 15000,
    deliverables: 'TBD — workshop or tutorial series',
    keyTerms: 'Multi-model platform like Krea. Meeting scheduled.',
    jameyUsesProduct: true, firstContact: '2026-03-28',
    actionIds: ['a-10', 'a-11'], fulfillmentIds: [],
  },
  {
    id: 'd-11', name: 'Lovable — Sponsored Post', brand: 'Lovable', companyId: 'co-11', contactId: 'pe-11',
    contactEmail: 'emma@lovable.dev', status: 'Negotiating', dealType: 'Sponsored Post',
    priority: 'High', platforms: ['X', 'YouTube'], quotedRate: 20000, pipelineValue: 18000,
    deliverables: 'Video walkthrough + thread',
    keyTerms: 'They want Figma-to-code angle. Good fit for Jamey\'s workflow.',
    jameyUsesProduct: true, firstContact: '2026-03-15', deadline: '2026-04-25',
    actionIds: ['a-12', 'a-13'], fulfillmentIds: [],
  },
  {
    id: 'd-12', name: 'Bluehost — Sponsored Post', brand: 'Bluehost', companyId: 'co-12', contactId: 'pe-12',
    contactEmail: 'partnerships@bluehost.com', status: 'Closed Lost', dealType: 'Sponsored Post',
    priority: 'Low', platforms: ['X'], quotedRate: 3000,
    deliverables: 'Sponsored thread',
    keyTerms: 'Hard pass. D across the board on evaluator. Brand misalignment.',
    jameyUsesProduct: false, firstContact: '2026-04-02',
    actionIds: [], fulfillmentIds: [],
  },
]

// ── Actions ──

export const actions: Action[] = [
  // Envato
  { id: 'a-1', title: 'Review & approve Envato proposal before sending', dealId: 'd-1', type: 'Approval', priority: 'Urgent', status: 'To Do', owner: 'Jamey', source: 'Manual - Justin', dueDate: '2026-04-09', notes: 'Proposal drafted with tutorials focus (not courses), SREFs, brand design templates. Needs Jamey sign-off before we send.', createdAt: '2026-04-06' },
  { id: 'a-2', title: 'Send Envato proposal after Jamey approval', dealId: 'd-1', type: 'Response Draft', priority: 'Urgent', status: 'Waiting', owner: 'Justin', source: 'Manual - Justin', dueDate: '2026-04-10', notes: 'Blocked on a-1. Email draft ready.', createdAt: '2026-04-06' },

  // Krea
  { id: 'a-3', title: 'Follow up with Krea on affiliate link', dealId: 'd-2', type: 'Follow-Up', priority: 'This Week', status: 'To Do', owner: 'Justin', source: 'Agent - Follow-Up', dueDate: '2026-04-10', notes: 'We sent last message. They owe the affiliate link. 4 days stale.', createdAt: '2026-04-07' },

  // ElevenLabs
  { id: 'a-4', title: 'Scope ElevenLabs deliverables + send rate card', dealId: 'd-3', type: 'Response Draft', priority: 'This Week', status: 'To Do', owner: 'Justin', source: 'Agent - Inbound Scanner', dueDate: '2026-04-11', notes: 'Initial interest only. Need to propose specific deliverables and pricing.', createdAt: '2026-04-05' },

  // Decimals
  { id: 'a-5', title: 'Approve Decimals campaign drafts for posting', dealId: 'd-4', type: 'Approval', priority: 'This Week', status: 'To Do', owner: 'Jamey', source: 'Manual - Justin', dueDate: '2026-04-10', notes: 'X thread + newsletter rewritten in Jamey\'s voice. Ready for her review.', createdAt: '2026-04-08' },
  { id: 'a-6', title: 'Post Decimals campaign after Jamey approval', dealId: 'd-4', type: 'Content Creation', priority: 'This Week', status: 'Waiting', owner: 'Jamey', source: 'Manual - Justin', dueDate: '2026-04-11', notes: 'Post X thread, send newsletter. Tag @riikiird.', createdAt: '2026-04-08' },

  // Grok
  { id: 'a-7', title: 'Draft Grok QRT campaign proposal', dealId: 'd-5', type: 'Response Draft', priority: 'This Week', status: 'To Do', owner: 'Justin', source: 'Manual - Justin', dueDate: '2026-04-12', notes: 'Natural product fit. Need to propose QRT cadence and pricing.', createdAt: '2026-04-06' },

  // Flux
  { id: 'a-8', title: 'Re-engage or kill Flux deal', dealId: 'd-6', type: 'Follow-Up', priority: 'When Possible', status: 'To Do', owner: 'Justin', source: 'Agent - Follow-Up', dueDate: '2026-04-12', notes: 'Stale 25+ days. No clear next step. Either re-engage with a specific ask or move to Closed Lost.', createdAt: '2026-04-07' },

  // Reve
  { id: 'a-9', title: 'Send initial outreach to Reve.art', dealId: 'd-7', type: 'Response Draft', priority: 'This Week', status: 'To Do', owner: 'Justin', source: 'Manual - Justin', dueDate: '2026-04-11', notes: 'Strong evaluator scores. Draft intro email positioning Jamey as ambassador.', createdAt: '2026-04-08' },

  // Freepik
  { id: 'a-10', title: 'Prep for Freepik meeting', dealId: 'd-10', type: 'Call Prep', priority: 'Urgent', status: 'To Do', owner: 'Both', source: 'Agent - Briefing', dueDate: '2026-04-09', notes: 'Meeting tomorrow. Research their creator program, prepare talking points, know their platform capabilities.', createdAt: '2026-04-08' },
  { id: 'a-11', title: 'Freepik post-meeting follow-up', dealId: 'd-10', type: 'Follow-Up', priority: 'This Week', status: 'Waiting', owner: 'Justin', source: 'Manual - Justin', notes: 'After meeting — send recap and proposed terms.', createdAt: '2026-04-08' },

  // Lovable
  { id: 'a-12', title: 'Counter Lovable at $20K (they offered $15K)', dealId: 'd-11', type: 'Response Draft', priority: 'Urgent', status: 'In Progress', owner: 'Justin', source: 'Manual - Justin', dueDate: '2026-04-09', notes: 'They offered $15K. Our floor is $18K. Counter at $20K with Figma-to-code workflow video angle. Draft email ready.', createdAt: '2026-04-07' },
  { id: 'a-13', title: 'Record Lovable demo for pitch', dealId: 'd-11', type: 'Creative', priority: 'This Week', status: 'To Do', owner: 'Jamey', source: 'Manual - Justin', dueDate: '2026-04-12', notes: 'Quick screen recording of Jamey using Lovable in her Figma-to-code workflow. 2 min max. Helps close the deal.', createdAt: '2026-04-08' },
]

// ── Fulfillment ──

export const fulfillments: Fulfillment[] = [
  {
    id: 'f-1', projectName: 'Block — Brand Identity Consultation', dealId: 'd-8',
    status: 'Invoiced', contentType: 'Creative Direction', invoiceAmount: 5000,
    invoiceStatus: 'Invoiced', invoiceDate: '2026-03-20', paymentDue: '2026-04-20',
    usageRights: 'Organic Only', revisionRound: 0, createdAt: '2026-03-01',
  },
  {
    id: 'f-2', projectName: 'Higgsfield — Sponsored Video + Thread', dealId: 'd-9',
    status: 'Paid', contentType: 'Short-form Video', postingDate: '2026-03-10',
    invoiceAmount: 8000, invoiceStatus: 'Paid', invoiceDate: '2026-03-12',
    paymentDue: '2026-04-12', usageRights: 'Plus Paid Media', usageExpiry: '2026-09-10',
    revisionRound: 1, createdAt: '2026-02-15',
  },
]

// ── Activities ──

export const activities: Activity[] = [
  { id: 'act-1', type: 'email_in', title: 'Envato sent revised terms', dealId: 'd-1', companyId: 'co-1', personId: 'pe-1', timestamp: '2026-04-07T14:30:00Z', source: 'Agent - Inbound Scanner' },
  { id: 'act-2', type: 'email_out', title: 'Sent Krea follow-up re: affiliate link', dealId: 'd-2', companyId: 'co-2', personId: 'pe-2', timestamp: '2026-04-06T10:15:00Z' },
  { id: 'act-3', type: 'agent_action', title: 'Agent flagged Flux deal as stale (25+ days)', dealId: 'd-6', companyId: 'co-6', timestamp: '2026-04-07T09:00:00Z', source: 'Agent - Follow-Up' },
  { id: 'act-4', type: 'email_in', title: 'Lovable countered at $15K', dealId: 'd-11', companyId: 'co-11', personId: 'pe-11', timestamp: '2026-04-07T16:00:00Z', source: 'Agent - Inbound Scanner' },
  { id: 'act-5', type: 'meeting', title: 'Freepik intro call scheduled for Apr 9', dealId: 'd-10', companyId: 'co-10', personId: 'pe-10', timestamp: '2026-04-08T08:00:00Z', source: 'Agent - Briefing' },
  { id: 'act-6', type: 'note', title: 'Decimals campaign drafts rewritten in Jamey\'s voice', dealId: 'd-4', companyId: 'co-4', timestamp: '2026-04-08T11:00:00Z' },
  { id: 'act-7', type: 'email_in', title: 'ElevenLabs initial interest — wants to explore', dealId: 'd-3', companyId: 'co-3', personId: 'pe-3', timestamp: '2026-04-05T13:00:00Z', source: 'Agent - Inbound Scanner' },
  { id: 'act-8', type: 'agent_action', title: 'Deal evaluator: Bluehost scored D — hard pass', dealId: 'd-12', companyId: 'co-12', timestamp: '2026-04-06T15:00:00Z', source: 'Agent - Briefing' },
  { id: 'act-9', type: 'email_out', title: 'Sent Reve.art deal evaluation to pipeline', dealId: 'd-7', companyId: 'co-7', timestamp: '2026-04-08T10:00:00Z' },
  { id: 'act-10', type: 'agent_action', title: 'Krea flagged stale — 4 days no response', dealId: 'd-2', companyId: 'co-2', timestamp: '2026-04-08T09:00:00Z', source: 'Agent - Follow-Up' },
  { id: 'act-11', type: 'email_out', title: 'Lovable counter-offer draft at $20K', dealId: 'd-11', companyId: 'co-11', personId: 'pe-11', timestamp: '2026-04-08T12:00:00Z' },
  { id: 'act-12', type: 'call', title: 'Higgsfield — post-campaign debrief call', dealId: 'd-9', companyId: 'co-9', personId: 'pe-9', timestamp: '2026-04-04T17:00:00Z' },
]

// ── Helpers ──

export function getDealsByStatus(status: Deal['status']) {
  return deals.filter(d => d.status === status)
}

export function getActionsByOwner(owner: Action['owner']) {
  return actions.filter(a => a.owner === owner && a.status !== 'Done' && a.status !== 'Cancelled')
}

export function getActionsForDeal(dealId: string) {
  return actions.filter(a => a.dealId === dealId)
}

export function getFulfillmentsForDeal(dealId: string) {
  return fulfillments.filter(f => f.dealId === dealId)
}

export function getActivitiesForDeal(dealId: string) {
  return activities.filter(a => a.dealId === dealId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getCompany(id: string) {
  return companies.find(c => c.id === id)
}

export function getPerson(id: string) {
  return people.find(p => p.id === id)
}

export function getDeal(id: string) {
  return deals.find(d => d.id === id)
}

export function getPersonsForCompany(companyId: string) {
  return people.filter(p => p.companyId === companyId)
}

export function getDealsForCompany(companyId: string) {
  return deals.filter(d => d.companyId === companyId)
}

export function getActivitiesForCompany(companyId: string) {
  return activities.filter(a => a.companyId === companyId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
