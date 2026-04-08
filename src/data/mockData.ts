import type { Company, Person, Deal, Task, Activity, Deliverable } from '../types'

export const companies: Company[] = [
  { id: 'co-1', name: 'Envato', domain: 'envato.com', industry: 'Design Marketplace' },
  { id: 'co-2', name: 'Krea AI', domain: 'krea.ai', industry: 'AI Creative Tools' },
  { id: 'co-3', name: 'ElevenLabs', domain: 'elevenlabs.io', industry: 'AI Audio' },
  { id: 'co-4', name: 'Decimals', domain: 'decimals.co', industry: 'Design Talent' },
  { id: 'co-5', name: 'Grok / xAI', domain: 'x.ai', industry: 'AI' },
  { id: 'co-6', name: 'Flux', domain: 'flux.ai', industry: 'AI Image Generation' },
  { id: 'co-7', name: 'Reve.art', domain: 'reve.art', industry: 'AI Image Generation' },
  { id: 'co-8', name: 'Block Inc', domain: 'block.xyz', industry: 'Fintech' },
  { id: 'co-9', name: 'Higgsfield', domain: 'higgsfield.ai', industry: 'AI Video' },
  { id: 'co-10', name: 'Freepik', domain: 'freepik.com', industry: 'Design Assets' },
  { id: 'co-11', name: 'Lovable', domain: 'lovable.dev', industry: 'AI Dev Tools' },
]

export const people: Person[] = [
  { id: 'pe-1', name: 'Sarah Chen', email: 'sarah@envato.com', role: 'Partnerships Lead', companyId: 'co-1' },
  { id: 'pe-2', name: 'Victor Perez', email: 'victor@krea.ai', role: 'Head of Growth', companyId: 'co-2' },
  { id: 'pe-3', name: 'Maria Santos', email: 'maria@elevenlabs.io', role: 'Creator Partnerships', companyId: 'co-3' },
  { id: 'pe-4', name: 'Ridd', email: 'ridd@decimals.co', role: 'Scout', companyId: 'co-4' },
  { id: 'pe-5', name: 'Alex Kim', email: 'alex@x.ai', role: 'Marketing', companyId: 'co-5' },
  { id: 'pe-6', name: 'Jordan Lee', email: 'jordan@flux.ai', role: 'Partnerships', companyId: 'co-6' },
  { id: 'pe-7', name: 'Luna Park', email: 'luna@reve.art', role: 'Community Lead', companyId: 'co-7' },
  { id: 'pe-8', name: 'Tyler Brooks', email: 'tyler@block.xyz', role: 'Brand Manager', companyId: 'co-8' },
  { id: 'pe-9', name: 'Mika Tanaka', email: 'mika@higgsfield.ai', role: 'CEO', companyId: 'co-9', notes: 'Via Shown Media' },
  { id: 'pe-10', name: 'Carlos Ruiz', email: 'carlos@freepik.com', role: 'Influencer Ops', companyId: 'co-10' },
  { id: 'pe-11', name: 'Emma Wright', email: 'emma@lovable.dev', role: 'Marketing Lead', companyId: 'co-11' },
]

export const deals: Deal[] = [
  // ── Content Pipeline ──
  {
    id: 'd-3', name: 'ElevenLabs Sponsored Post', companyId: 'co-3', contactId: 'pe-3',
    pipeline: 'content', stage: 'Inbound', type: 'Sponsored Post', priority: 'Medium',
    value: 15000, platforms: ['X', 'YouTube'],
    terms: 'Initial interest. Need to scope deliverables and send rate.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-03-20', lastActivityAt: '2026-04-05',
  },
  {
    id: 'd-5', name: 'Grok QRT Campaign', companyId: 'co-5', contactId: 'pe-5',
    pipeline: 'content', stage: 'Rate Sent', type: 'QRT + Comment', priority: 'Medium',
    value: 8000, platforms: ['X'],
    deliverables: 'QRTs + organic mentions',
    terms: 'Jamey uses Grok for image gen. Natural fit. Rate sent, waiting on their response.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-03-18', lastActivityAt: '2026-04-04',
  },
  {
    id: 'd-6', name: 'Flux Sponsored Post', companyId: 'co-6', contactId: 'pe-6',
    pipeline: 'content', stage: 'Inbound', type: 'Sponsored Post', priority: 'Low',
    value: 10000, platforms: ['X'],
    terms: 'Stale. 25+ days. No clear next step. Re-engage or kill.',
    jameyUsesProduct: false, owner: 'justin',
    createdAt: '2026-03-12', lastActivityAt: '2026-03-14',
  },
  {
    id: 'd-11', name: 'Lovable Sponsored Video', companyId: 'co-11', contactId: 'pe-11',
    pipeline: 'content', stage: 'Terms Agreed', type: 'Sponsored Video', priority: 'High',
    value: 20000, platforms: ['X', 'YouTube'],
    deliverables: 'Video walkthrough + thread',
    terms: 'They offered $15K. Our floor is $18K. Counter at $20K with Figma-to-code angle.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-03-15', lastActivityAt: '2026-04-08', expectedCloseDate: '2026-04-25',
  },
  {
    id: 'd-9', name: 'Higgsfield Sponsored Video', companyId: 'co-9', contactId: 'pe-9',
    pipeline: 'content', stage: 'Invoiced', type: 'Sponsored Video', priority: 'Medium',
    value: 1200, closedValue: 1200, platforms: ['X'],
    deliverables: 'Sponsored video',
    notes: 'Came through Shown Media. Content delivered. In invoicing/collections.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-02-01', lastActivityAt: '2026-03-15', closedAt: '2026-03-15',
  },

  // ── Partnership Pipeline ──
  {
    id: 'd-1', name: 'Envato Education Partnership', companyId: 'co-1', contactId: 'pe-1',
    pipeline: 'partnership', stage: 'Negotiating', type: 'Education Partnership', priority: 'High',
    value: 50000, platforms: ['YouTube', 'X'],
    deliverables: '3-5 tutorials, SREFs, brand design templates, logos',
    terms: 'Jamey wants tutorials not courses. Non-exclusive. Envato wants logo/brand design content.',
    notes: 'Proposal drafted, waiting on Jamey review before sending.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-03-10', lastActivityAt: '2026-04-07', expectedCloseDate: '2026-04-20',
  },
  {
    id: 'd-2', name: 'Krea AI Ambassador', companyId: 'co-2', contactId: 'pe-2',
    pipeline: 'partnership', stage: 'Proposal Sent', type: 'Brand Ambassador', priority: 'High',
    value: 30000, platforms: ['X', 'YouTube'],
    deliverables: 'Ongoing posts, feature demos, early access content',
    terms: 'They owe affiliate link. Multi-model platform = strong strategic fit.',
    notes: 'Jamey uses and loves the product. Ball in their court.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-03-05', lastActivityAt: '2026-04-06', expectedCloseDate: '2026-04-25',
  },
  {
    id: 'd-4', name: 'Decimals Affiliate Campaign', companyId: 'co-4', contactId: 'pe-4',
    pipeline: 'partnership', stage: 'Proposal Sent', type: 'Affiliate', priority: 'Medium',
    value: 5000, platforms: ['X'],
    deliverables: 'X thread + newsletter email with affiliate link',
    terms: 'Affiliate model — no upfront pay. Revenue share on signups.',
    notes: 'Campaign drafts written and voice-matched. Ready to post when Jamey approves.',
    jameyUsesProduct: false, owner: 'both',
    createdAt: '2026-03-25', lastActivityAt: '2026-04-08',
  },
  {
    id: 'd-7', name: 'Reve.art Ambassador', companyId: 'co-7', contactId: 'pe-7',
    pipeline: 'partnership', stage: 'Inbound', type: 'Brand Ambassador', priority: 'Medium',
    value: 15000, platforms: ['X'],
    deliverables: 'Content series, early access, community building',
    terms: 'A-tier brand prestige. Education funnel potential. Strong evaluator score.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-04-01', lastActivityAt: '2026-04-08',
  },
  {
    id: 'd-10', name: 'Freepik Education Partnership', companyId: 'co-10', contactId: 'pe-10',
    pipeline: 'partnership', stage: 'Discovery Call', type: 'Education Partnership', priority: 'Medium',
    value: 25000, platforms: ['YouTube'],
    deliverables: 'TBD — workshop or tutorial series',
    terms: 'Multi-model platform like Krea. Meeting scheduled for Apr 9.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-03-28', lastActivityAt: '2026-04-08', expectedCloseDate: '2026-05-01',
  },

  // ── Service Pipeline ──
  {
    id: 'd-8', name: 'Block Brand Identity', companyId: 'co-8', contactId: 'pe-8',
    pipeline: 'service', stage: 'Invoiced', type: 'Creative Direction', priority: 'High',
    value: 5000, closedValue: 5000,
    deliverables: 'Brand identity consultation',
    jameyUsesProduct: false, owner: 'jamey',
    createdAt: '2026-02-15', lastActivityAt: '2026-03-20', closedAt: '2026-03-20',
  },
]

export const tasks: Task[] = [
  { id: 't-1', title: 'Review & approve Envato proposal', description: 'Tutorials focus (not courses), SREFs, brand design templates. Sign off before we send.', status: 'To Do', priority: 'Urgent', assignee: 'jamey', dealId: 'd-1', dueDate: '2026-04-09', createdAt: '2026-04-06', createdBy: 'justin' },
  { id: 't-2', title: 'Send Envato proposal after approval', description: 'Blocked on Jamey. Email draft ready.', status: 'Waiting', priority: 'Urgent', assignee: 'justin', dealId: 'd-1', dueDate: '2026-04-10', createdAt: '2026-04-06', createdBy: 'justin' },
  { id: 't-3', title: 'Follow up with Krea on affiliate link', description: 'Ball in their court. 4 days stale.', status: 'To Do', priority: 'High', assignee: 'justin', dealId: 'd-2', dueDate: '2026-04-10', createdAt: '2026-04-07', createdBy: 'agent' },
  { id: 't-4', title: 'Scope ElevenLabs and send rate', description: 'Initial interest only. Propose deliverables + pricing.', status: 'To Do', priority: 'High', assignee: 'justin', dealId: 'd-3', dueDate: '2026-04-11', createdAt: '2026-04-05', createdBy: 'agent' },
  { id: 't-5', title: 'Approve Decimals campaign drafts', description: 'X thread + newsletter in Jamey\'s voice. Ready for review.', status: 'To Do', priority: 'High', assignee: 'jamey', dealId: 'd-4', dueDate: '2026-04-10', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-6', title: 'Post Decimals campaign', description: 'Post thread + newsletter after approval. Tag @riikiird.', status: 'Waiting', priority: 'Normal', assignee: 'jamey', dealId: 'd-4', dueDate: '2026-04-11', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-7', title: 'Draft Grok QRT proposal', description: 'Propose QRT cadence and pricing.', status: 'To Do', priority: 'Normal', assignee: 'justin', dealId: 'd-5', dueDate: '2026-04-12', createdAt: '2026-04-06', createdBy: 'justin' },
  { id: 't-8', title: 'Re-engage or kill Flux', description: '25+ days stale. Either re-engage or close lost.', status: 'To Do', priority: 'Low', assignee: 'justin', dealId: 'd-6', dueDate: '2026-04-12', createdAt: '2026-04-07', createdBy: 'agent' },
  { id: 't-9', title: 'Send Reve.art initial outreach', description: 'Strong evaluator scores. Draft intro for ambassador.', status: 'To Do', priority: 'High', assignee: 'justin', dealId: 'd-7', dueDate: '2026-04-11', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-10', title: 'Prep for Freepik meeting', description: 'Meeting Apr 9. Research creator program, prepare talking points.', status: 'To Do', priority: 'Urgent', assignee: 'justin', dealId: 'd-10', dueDate: '2026-04-09', createdAt: '2026-04-08', createdBy: 'agent' },
  { id: 't-11', title: 'Counter Lovable at $20K', description: 'They offered $15K. Floor $18K. Figma-to-code workflow angle.', status: 'In Progress', priority: 'Urgent', assignee: 'justin', dealId: 'd-11', dueDate: '2026-04-09', createdAt: '2026-04-07', createdBy: 'justin' },
  { id: 't-12', title: 'Record Lovable demo video', description: '2 min screen recording of Jamey using Lovable. Helps close deal.', status: 'To Do', priority: 'High', assignee: 'jamey', dealId: 'd-11', dueDate: '2026-04-12', createdAt: '2026-04-08', createdBy: 'justin' },
]

export const activities: Activity[] = [
  { id: 'a-1', type: 'email_received', title: 'Envato sent revised terms', dealId: 'd-1', companyId: 'co-1', personId: 'pe-1', createdBy: 'system', timestamp: '2026-04-07T14:30:00Z' },
  { id: 'a-2', type: 'email_sent', title: 'Sent Krea follow-up re: affiliate link', dealId: 'd-2', companyId: 'co-2', personId: 'pe-2', createdBy: 'justin', timestamp: '2026-04-06T10:15:00Z' },
  { id: 'a-3', type: 'agent_alert', title: 'Flux deal flagged stale (25+ days)', dealId: 'd-6', companyId: 'co-6', createdBy: 'agent', timestamp: '2026-04-07T09:00:00Z' },
  { id: 'a-4', type: 'email_received', title: 'Lovable countered at $15K', dealId: 'd-11', companyId: 'co-11', personId: 'pe-11', createdBy: 'system', timestamp: '2026-04-07T16:00:00Z' },
  { id: 'a-5', type: 'meeting', title: 'Freepik intro call scheduled for Apr 9', dealId: 'd-10', companyId: 'co-10', personId: 'pe-10', createdBy: 'agent', timestamp: '2026-04-08T08:00:00Z' },
  { id: 'a-6', type: 'note', title: 'Decimals campaign drafts rewritten in voice', dealId: 'd-4', companyId: 'co-4', createdBy: 'justin', timestamp: '2026-04-08T11:00:00Z' },
  { id: 'a-7', type: 'email_received', title: 'ElevenLabs wants to explore partnership', dealId: 'd-3', companyId: 'co-3', personId: 'pe-3', createdBy: 'system', timestamp: '2026-04-05T13:00:00Z' },
  { id: 'a-8', type: 'agent_alert', title: 'Krea flagged stale — 4 days', dealId: 'd-2', companyId: 'co-2', createdBy: 'agent', timestamp: '2026-04-08T09:00:00Z' },
  { id: 'a-9', type: 'email_sent', title: 'Lovable counter-offer at $20K', dealId: 'd-11', companyId: 'co-11', personId: 'pe-11', createdBy: 'justin', timestamp: '2026-04-08T12:00:00Z' },
  { id: 'a-10', type: 'call', title: 'Higgsfield post-campaign debrief', dealId: 'd-9', companyId: 'co-9', personId: 'pe-9', createdBy: 'justin', timestamp: '2026-04-04T17:00:00Z' },
  { id: 'a-11', type: 'stage_change', title: 'Envato advanced to Negotiating', dealId: 'd-1', companyId: 'co-1', createdBy: 'justin', timestamp: '2026-04-06T09:00:00Z' },
  { id: 'a-12', type: 'note', title: 'Reve.art deal evaluation completed — A-tier', dealId: 'd-7', companyId: 'co-7', createdBy: 'justin', timestamp: '2026-04-08T10:00:00Z' },
  { id: 'a-13', type: 'task_created', title: 'Agent: Prep for Freepik meeting', dealId: 'd-10', companyId: 'co-10', createdBy: 'agent', timestamp: '2026-04-08T07:00:00Z' },
]

export const deliverables: Deliverable[] = [
  { id: 'del-1', title: 'Block Brand Identity', dealId: 'd-8', status: 'Published', contentType: 'Brand Identity', invoiceAmount: 5000, invoiceStatus: 'Invoiced', dueDate: '2026-03-15', publishDate: '2026-03-18' },
  { id: 'del-2', title: 'Higgsfield Sponsored Video', dealId: 'd-9', status: 'Published', contentType: 'Sponsored Video', invoiceAmount: 1200, invoiceStatus: 'Invoiced', dueDate: '2026-03-08', publishDate: '2026-03-10' },
]

// Lookups
export const getCompany = (id: string) => companies.find(c => c.id === id)
export const getPerson = (id: string) => people.find(p => p.id === id)
export const getDeal = (id: string) => deals.find(d => d.id === id)
export const getDealsForCompany = (cid: string) => deals.filter(d => d.companyId === cid)
export const getPeopleForCompany = (cid: string) => people.filter(p => p.companyId === cid)
export const getTasksForDeal = (did: string) => tasks.filter(t => t.dealId === did)
export const getActivitiesForDeal = (did: string) => activities.filter(a => a.dealId === did).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
export const getActivitiesForCompany = (cid: string) => activities.filter(a => a.companyId === cid).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
