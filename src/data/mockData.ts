import type { Company, Person, Deal, Task, Activity, Deliverable } from '../types'

export const companies: Company[] = [
  { id: 'co-1', name: 'Envato', domain: 'envato.com', industry: 'Design Marketplace' },
  { id: 'co-2', name: 'Krea AI', domain: 'krea.ai', industry: 'AI Creative Tools' },
  { id: 'co-3', name: 'ElevenLabs', domain: 'elevenlabs.io', industry: 'AI Audio' },
  { id: 'co-4', name: 'Decimals', domain: 'decimals.co', industry: 'Design Talent' },
  { id: 'co-5', name: 'Grok / xAI', domain: 'x.ai', industry: 'AI' },
  { id: 'co-7', name: 'Reve.art', domain: 'reve.art', industry: 'AI Image Generation' },
  { id: 'co-9', name: 'Higgsfield', domain: 'higgsfield.ai', industry: 'AI Video' },
  { id: 'co-10', name: 'Freepik', domain: 'freepik.com', industry: 'Design Assets' },
  { id: 'co-12', name: 'Maven', domain: 'maven.com', industry: 'Education Platform' },
  { id: 'co-13', name: 'Flora.ai', domain: 'flora.ai', industry: 'AI E-Commerce' },
  { id: 'co-14', name: 'Instant.so', domain: 'instant.so', industry: 'AI E-Commerce' },
  { id: 'co-8', name: 'Cash App / Block', domain: 'cash.app', industry: 'Fintech' },
  { id: 'co-15', name: 'Vellum', domain: 'vellum.ai', industry: 'AI Assistant' },
]

export const people: Person[] = [
  { id: 'pe-1', name: 'Hichame Assi', email: 'hichame.assi@envato.com', role: 'Partnerships', companyId: 'co-1' },
  { id: 'pe-2', name: 'Miguel Lara', email: 'miguel@krea.ai', role: 'Partnerships', companyId: 'co-2' },
  { id: 'pe-3', name: 'Konstantin Kanin', email: 'konstantin@kudosnarratives.com', role: 'Agency (Kudos Narratives)', companyId: 'co-3', notes: 'Agency rep for ElevenLabs. Also: Liza Novikova (liz@kudosnarratives.com)' },
  { id: 'pe-4', name: 'Danny Martinez', email: 'danny@decimals.work', role: 'Partnerships', companyId: 'co-4', notes: 'Also: Michael Riddering / Ridd (ridd@dive.club)' },
  { id: 'pe-5', name: 'Unknown', email: undefined, role: 'Marketing', companyId: 'co-5', notes: 'Contact unknown - need to identify real xAI marketing contact' },
  { id: 'pe-7', name: 'Melisa Seah', email: 'melisa.seah@reve.art', role: 'Storytelling Lead (Product Marketing, Brand, Community)', companyId: 'co-7', notes: 'Ex-Google/YouTube. Primary contact. Oscar Dumlao (oscar.dumlao@reve.art) = Head of Design (ex-Figma), initiated from X thread. Christian = co-founder (ex-Adobe 20yrs).' },
  { id: 'pe-9', name: 'Alex Mashrabov', email: undefined, role: 'CEO', companyId: 'co-9', notes: 'Via Shown Media. Forbes 30u30, ex-Snap (Director of Gen AI), co-founded AI Factory (sold to Snap).' },
  { id: 'pe-10', name: 'Unknown', email: undefined, role: 'Influencer Ops', companyId: 'co-10', notes: 'Contact unknown - need to identify real Freepik contact from Apr 9 meeting' },
  { id: 'pe-12', name: 'Mallory Contois', email: 'mallory@maven.com', role: 'Creator Partnerships', companyId: 'co-12', notes: 'Invited Jamey to run Maven workshop. Also: Delaney Niermann (operations).' },
  { id: 'pe-13', name: 'Weber Wong', email: 'weber@flora.ai', role: 'Founder', companyId: 'co-13', notes: 'Jamey gets 1M credits/mo. 487 clicks / 178 leads / $1,875 in sales generated for Flora.' },
  { id: 'pe-14', name: 'Sam van Hees', email: 'sam@instant.so', role: 'Founder', companyId: 'co-14', notes: 'Jamey has early access to AI features. Said "yes sounds good!" to sponsorship - email sam@instant.so.' },
  { id: 'pe-8', name: 'Eva Alzamora', email: 'eva@boysclub.vip', role: 'Partnerships', companyId: 'co-8', notes: 'Via Boys Club (Predicate Labs Inc.). Also: Miranda Martell (miranda@boysclub.vip). Agency manages Cash App/Block/Bitkey creator campaigns.' },
  { id: 'pe-15', name: 'Shown Media', email: undefined, role: 'Agency', companyId: 'co-15', notes: 'Vellum deal came through Shown Media. QRT + Engagement campaign. $1,200 flat.' },
]

export const deals: Deal[] = [
  // -- Content Pipeline --
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
    id: 'd-9', name: 'Higgsfield Sponsored Video', companyId: 'co-9', contactId: 'pe-9',
    pipeline: 'content', stage: 'Delivered', type: 'Sponsored Video', priority: 'Medium',
    value: 1200, closedValue: 1200, platforms: ['X'],
    deliverables: 'Sponsored video',
    notes: 'Came through Shown Media. Content delivered. In invoicing/collections.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-02-01', lastActivityAt: '2026-03-15', closedAt: '2026-03-15',
  },

  {
    id: 'd-8', name: 'Cash App x Bitcoin Day 2026', companyId: 'co-8', contactId: 'pe-8',
    pipeline: 'content', stage: 'Delivered', type: 'Sponsored Video', priority: 'High',
    value: 3000, closedValue: 3000, platforms: ['X'],
    deliverables: 'Sponsored X video featuring Bitkey hardware wallet for Bitcoin Day 2026. Tags: @BitcoinatBlock, @CashApp, @Square, @Bitkey. Link: btc.day',
    terms: 'MSA with Predicate Labs Inc. (Boys Club). $3,000 USD flat. Net 30 from posting. 30-day organic usage rights for Block channels.',
    notes: 'Via Boys Club agency. Eva Alzamora + Miranda Martell. Script approved Apr 2, Bitkey hardware shipped, final video approved Apr 5, posted Apr 7 at 4pm. Jamey filmed Bitkey product - Corian marble body, fingerprint sensor, tap-to-approve. W9 submitted under Good Fast Cheap LLC.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-03-30', lastActivityAt: '2026-04-07', closedAt: '2026-04-07',
  },
  {
    id: 'd-16', name: 'Vellum QRT Campaign', companyId: 'co-15', contactId: 'pe-15',
    pipeline: 'content', stage: 'Terms Agreed', type: 'QRT + Comment', priority: 'Medium',
    value: 1200, platforms: ['X'],
    deliverables: 'QRT + Engagement on X',
    terms: '$1,200 flat via Shown Media. Tentative launch Apr 21.',
    notes: 'Vellum = always-on personal AI assistant (persistent memory, email/Slack/browser integration). Campaign goal: drive early-access signups. ICP: founders, operators, AI-curious knowledge workers. Content direction: operator-to-operator, experiential, insight-driven.',
    jameyUsesProduct: false, owner: 'both',
    createdAt: '2026-04-09', lastActivityAt: '2026-04-09', expectedCloseDate: '2026-04-21',
  },

  // -- Partnership Pipeline --
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
    terms: 'Affiliate model - no upfront pay. Revenue share on signups.',
    notes: 'Campaign drafts written and voice-matched. Ready to post when Jamey approves.',
    jameyUsesProduct: false, owner: 'both',
    createdAt: '2026-03-25', lastActivityAt: '2026-04-08',
  },
  {
    id: 'd-7', name: 'Reve.art Creative Partnership', companyId: 'co-7', contactId: 'pe-7',
    pipeline: 'partnership', stage: 'Discovery Call', type: 'Brand Ambassador', priority: 'High',
    value: 15000, platforms: ['X', 'YouTube'],
    deliverables: 'Tiered: (1) short-term feature posts/promos, (2) mid-tier workshop/sponsorship/YouTube, (3) long-term residency/retainer/course/series. Let them take the lead on what works.',
    terms: 'CASUAL VIBES. Jamey demoed the product, loved references/annotations/effects. They build own models (not a wrapper). Send soft partnership deck, get affiliate link, join creator program immediately. Melisa to review with team.',
    notes: 'Apr 8 call with Melisa Seah (storytelling lead, ex-Google/YouTube). Oscar = head of design (ex-Figma), Christian = co-founder (ex-Adobe 20yrs). In-house research team builds models from scratch. Focused on brand designers, marketers, product photography. Coming soon: composite text/logos, organizations collab, reframe, 2.0 model. They do artist residencies, workshop sponsorships, course support. Jamey spent ~2hrs testing, impressed by editing + references.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-04-01', lastActivityAt: '2026-04-08',
  },
  {
    id: 'd-10', name: 'Freepik Education Partnership', companyId: 'co-10', contactId: 'pe-10',
    pipeline: 'partnership', stage: 'Discovery Call', type: 'Education Partnership', priority: 'Medium',
    value: 25000, platforms: ['YouTube'],
    deliverables: 'TBD - workshop or tutorial series',
    terms: 'Multi-model platform like Krea. Meeting scheduled for Apr 9.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-03-28', lastActivityAt: '2026-04-08', expectedCloseDate: '2026-05-01',
  },

  // -- Service Pipeline --
  {
    id: 'd-12', name: 'Maven Workshop - AI Visuals for E-Commerce Leaders', companyId: 'co-12', contactId: 'pe-12',
    pipeline: 'education', stage: 'Curriculum Design', type: 'Workshop', priority: 'High',
    value: 9000, platforms: ['Maven'],
    deliverables: '3-hour live workshop: AI product photography, ad creation, static visuals for e-commerce. Announced Apr 16, workshop end of April (~Apr 23-25).',
    terms: '~30 students @ $300 = ~$9K. Only 1 week of promo. Delaney recommended 3hr @ $300. Jamey wants focused mastery (product photography) over tool overload. Potential 3-part series with 15-min breaks to reduce drop-off.',
    notes: 'Mallory from Maven invited Jamey. Flora.ai = primary demo tool. Instant.so + ElevenLabs (Dub V2) as additional sponsors. Tiered sponsorship packages needed. Jamey concerned about 3hr drop-off - may restructure.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-04-07', lastActivityAt: '2026-04-08', expectedCloseDate: '2026-04-25',
  },
  {
    id: 'd-13', name: 'Flora.ai - Maven Workshop Sponsor', companyId: 'co-13', contactId: 'pe-13',
    pipeline: 'partnership', stage: 'Inbound', type: 'Event Sponsorship', priority: 'High',
    value: 3000, platforms: ['Maven'],
    deliverables: 'TIER 1 (GOLD): Collaborative demo - call with Flora team, brand alignment, they approve tutorial feature. Affiliate link in show notes + follow-up emails. Public social promotion before AND after workshop (Jamey tweets + emails "sponsored by Flora").',
    terms: 'Flora = primary demo tool for product photography. $2.5-3K flat + affiliate commission. Proof: 487 clicks, 178 leads, $1,875 sales from ORGANIC alone. No affiliate-only option - demo time is the value.',
    jameyUsesProduct: true, owner: 'jamey',
    createdAt: '2026-04-08', lastActivityAt: '2026-04-08',
  },
  {
    id: 'd-14', name: 'Instant.so - Maven Workshop Sponsor', companyId: 'co-14', contactId: 'pe-14',
    pipeline: 'partnership', stage: 'Inbound', type: 'Event Sponsorship', priority: 'High',
    value: 1500, platforms: ['Maven'],
    deliverables: 'TIER 2 (SILVER): Jamey demos on her own, no approval needed. Affiliate link included. Promotion only DURING workshop, no social before/after.',
    terms: 'Sam confirmed interest via DM ("yes sounds good!"). $1-1.5K flat + affiliate commission. No affiliate-only option. Email sam@instant.so with two-tier proposal.',
    jameyUsesProduct: true, owner: 'both',
    createdAt: '2026-04-08', lastActivityAt: '2026-04-08',
  },
  {
    id: 'd-15', name: 'ElevenLabs - Maven Workshop Sponsor', companyId: 'co-3', contactId: 'pe-3',
    pipeline: 'partnership', stage: 'Inbound', type: 'Event Sponsorship', priority: 'Low',
    value: 1500, platforms: ['Maven'],
    deliverables: 'Quick Dub V2 demo at end of workshop - turn a product photo into video with AI dubbing. 2-min add-on, not core content.',
    terms: 'MAYBE - probably not per Justin. Jamey said easy to add but not a priority. Would need to reach out via Konstantin/Kudos Narratives.',
    jameyUsesProduct: true, owner: 'justin',
    createdAt: '2026-04-08', lastActivityAt: '2026-04-08',
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
  { id: 't-9', title: 'Send Reve.art soft partnership deck', description: 'Call done Apr 8 with Melisa Seah. Casual vibes - let them take the lead. Send media kit + tiered partnership options. Also: immediately request affiliate link + join creator program (free Pro, direct line to team).', status: 'To Do', priority: 'High', assignee: 'justin', dealId: 'd-7', dueDate: '2026-04-10', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-10', title: 'Prep for Freepik meeting', description: 'Meeting Apr 9. Research creator program, prepare talking points.', status: 'To Do', priority: 'Urgent', assignee: 'justin', dealId: 'd-10', dueDate: '2026-04-09', createdAt: '2026-04-08', createdBy: 'agent' },
  // Maven Workshop
  { id: 't-13', title: 'Build attendance estimate for Maven workshop', description: 'Need concrete attendance story before approaching sponsors. Announced Apr 16, workshop end of April. ~30 students @ $300 = ~$9K estimate.', status: 'To Do', priority: 'Urgent', assignee: 'justin', dealId: 'd-12', dueDate: '2026-04-09', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-14', title: 'Finalize two-tier sponsorship packages', description: 'GOLD (~$2.5-3K + affiliate): Collaborative - call with sponsor team, brand alignment, approved tutorial feature, affiliate link in show notes + follow-up, public social promo before AND after workshop. SILVER (~$1-1.5K + affiliate): Jamey demos solo, no approval needed, affiliate link, promo only during workshop. NO affiliate-only option - demo time is the value. Flora = Gold candidate, Instant = Silver candidate. Also pitch Reve.art (they literally sponsor workshops).', status: 'To Do', priority: 'Urgent', assignee: 'justin', dealId: 'd-12', dueDate: '2026-04-09', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-15', title: 'Email Instant.so sponsorship proposal', description: 'Sam confirmed interest via DM ("yes sounds good! send to sam@instant.so"). Need attendance story + tiers first. BLOCKED on t-13 and t-14.', status: 'Waiting', priority: 'Urgent', assignee: 'justin', dealId: 'd-14', dueDate: '2026-04-10', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-16', title: 'Send Flora.ai sponsorship proposal', description: 'Flora = PRIMARY sponsor (main demo tool). Jamey DM\'d Weber Wong. Pitch: live product photography demo to $300 e-commerce leaders. Leverage stats: 487 clicks, 178 leads, $1,875 in sales.', status: 'To Do', priority: 'High', assignee: 'jamey', dealId: 'd-13', dueDate: '2026-04-10', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-17', title: 'Submit updated workshop description to Maven', description: 'Renamed: "AI Visuals for E-Commerce Leaders" - product photography, ads, static content. Jamey drafted 6-section brief. Finalize and send. Announced Apr 16, workshop end of April.', status: 'In Progress', priority: 'Urgent', assignee: 'jamey', dealId: 'd-12', dueDate: '2026-04-09', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-18', title: 'Confirm Maven workshop logistics', description: 'Announced Apr 16, actual workshop end of April (~Apr 23-25). 3 hours, $300. Jamey concerned about drop-off - consider 3-part series with 15-min breaks. Confirm exact time, platform, promo materials.', status: 'To Do', priority: 'High', assignee: 'justin', dealId: 'd-12', dueDate: '2026-04-10', createdAt: '2026-04-08', createdBy: 'justin' },
  { id: 't-19', title: 'Reach out to ElevenLabs re: Maven workshop sponsorship', description: 'MAYBE - probably not per Justin. Dub V2 on product photos = natural add-on but low priority. Only pursue if Flora + Instant close first. Reach out via Konstantin at Kudos Narratives if green-lit.', status: 'To Do', priority: 'Low', assignee: 'justin', dealId: 'd-15', dueDate: '2026-04-14', createdAt: '2026-04-08', createdBy: 'justin' },
]

export const activities: Activity[] = [
  { id: 'a-1', type: 'email_sent', title: 'Pitched Envato 3-point proposal (1stCollab, workshop, Tuts+)', dealId: 'd-1', companyId: 'co-1', personId: 'pe-1', createdBy: 'justin', timestamp: '2026-04-01T12:00:00Z' },
  { id: 'a-14', type: 'email_received', title: 'Hichame replied: send itemized proposal for points 2 & 3', dealId: 'd-1', companyId: 'co-1', personId: 'pe-1', createdBy: 'system', timestamp: '2026-04-02T14:00:00Z' },
  { id: 'a-2', type: 'email_sent', title: 'Krea follow-up on next steps', dealId: 'd-2', companyId: 'co-2', personId: 'pe-2', createdBy: 'justin', timestamp: '2026-04-05T10:15:00Z' },
  { id: 'a-5', type: 'meeting', title: 'Freepik intro call scheduled for Apr 9', dealId: 'd-10', companyId: 'co-10', personId: 'pe-10', createdBy: 'agent', timestamp: '2026-04-08T08:00:00Z' },
  { id: 'a-6', type: 'note', title: 'Decimals campaign drafts rewritten in voice', dealId: 'd-4', companyId: 'co-4', createdBy: 'justin', timestamp: '2026-04-08T11:00:00Z' },
  { id: 'a-7', type: 'email_received', title: 'ElevenLabs collab proposal via Kudos Narratives (Konstantin)', dealId: 'd-3', companyId: 'co-3', personId: 'pe-3', createdBy: 'system', timestamp: '2026-04-06T13:00:00Z' },
  { id: 'a-15', type: 'email_sent', title: 'Justin confirmed ElevenLabs - "Works! Send agreement" + asked re deadline & tool access', dealId: 'd-3', companyId: 'co-3', personId: 'pe-3', createdBy: 'justin', timestamp: '2026-04-08T11:00:00Z' },
  { id: 'a-16', type: 'email_received', title: 'Reve - Oscar connected Jamey with Melisa Seah, meeting booked Apr 8', dealId: 'd-7', companyId: 'co-7', personId: 'pe-7', createdBy: 'system', timestamp: '2026-04-07T15:00:00Z' },
  { id: 'a-24', type: 'meeting', title: 'Reve.art discovery call - Melisa Seah demoed full product suite (references, annotations, effects, 4K). Jamey impressed. Casual vibes. Next: send soft partnership deck + get affiliate link + join creator program.', dealId: 'd-7', companyId: 'co-7', personId: 'pe-7', createdBy: 'jamey', timestamp: '2026-04-08T18:00:00Z' },
  { id: 'a-17', type: 'email_received', title: 'Decimals - Danny thread, meeting scheduled for Apr 8', dealId: 'd-4', companyId: 'co-4', personId: 'pe-4', createdBy: 'system', timestamp: '2026-04-08T09:00:00Z' },
  { id: 'a-8', type: 'agent_alert', title: 'Krea flagged stale - 4 days', dealId: 'd-2', companyId: 'co-2', createdBy: 'agent', timestamp: '2026-04-08T09:00:00Z' },
  { id: 'a-10', type: 'call', title: 'Higgsfield post-campaign debrief', dealId: 'd-9', companyId: 'co-9', personId: 'pe-9', createdBy: 'justin', timestamp: '2026-04-04T17:00:00Z' },
  { id: 'a-11', type: 'stage_change', title: 'Envato advanced to Negotiating', dealId: 'd-1', companyId: 'co-1', createdBy: 'justin', timestamp: '2026-04-06T09:00:00Z' },
  { id: 'a-12', type: 'note', title: 'Reve.art deal evaluation completed - A-tier', dealId: 'd-7', companyId: 'co-7', createdBy: 'justin', timestamp: '2026-04-08T10:00:00Z' },
  { id: 'a-13', type: 'task_created', title: 'Agent: Prep for Freepik meeting', dealId: 'd-10', companyId: 'co-10', createdBy: 'agent', timestamp: '2026-04-08T07:00:00Z' },
  // Maven Workshop
  { id: 'a-18', type: 'email_received', title: 'Maven invited Jamey to run a workshop (Mallory Contois + Delaney Niermann)', dealId: 'd-12', companyId: 'co-12', personId: 'pe-12', createdBy: 'system', timestamp: '2026-04-07T10:00:00Z' },
  { id: 'a-19', type: 'note', title: 'Jamey drafted full workshop brief: "AI for E-Commerce Leaders" - 3hr crash course @ $300', dealId: 'd-12', companyId: 'co-12', createdBy: 'jamey', timestamp: '2026-04-08T14:00:00Z' },
  { id: 'a-20', type: 'email_sent', title: 'Jamey DM\'d Weber Wong (Flora.ai) re: sponsoring Maven workshop', dealId: 'd-13', companyId: 'co-13', personId: 'pe-13', createdBy: 'jamey', timestamp: '2026-04-08T15:00:00Z' },
  { id: 'a-21', type: 'email_received', title: 'Instant.so - Sam confirmed interest: "yes sounds good! send to sam@instant.so"', dealId: 'd-14', companyId: 'co-14', personId: 'pe-14', createdBy: 'system', timestamp: '2026-04-08T16:00:00Z' },
  { id: 'a-22', type: 'task_created', title: 'Created Maven workshop task chain: attendance story -> sponsorship tiers -> email sponsors', dealId: 'd-12', companyId: 'co-12', createdBy: 'justin', timestamp: '2026-04-08T17:00:00Z' },
  { id: 'a-23', type: 'note', title: 'Justin + Jamey call: workshop = "AI Visuals for E-Commerce Leaders." Sponsorship pitch: product demo weaved into educational workshop to purchase-ready e-commerce leaders. Flora = primary demo ($3K), Instant = featured ($1.5K), ElevenLabs Dub V2 = add-on ($1.5K). Announced Apr 16, workshop end of April.', dealId: 'd-12', companyId: 'co-12', createdBy: 'justin', timestamp: '2026-04-08T20:00:00Z' },
  // Cash App Bitcoin Day
  { id: 'a-25', type: 'email_received', title: 'Boys Club (Eva Alzamora) sent MSA + creator brief for Cash App x Bitcoin Day 2026', dealId: 'd-8', companyId: 'co-8', personId: 'pe-8', createdBy: 'system', timestamp: '2026-03-30T15:13:00Z' },
  { id: 'a-26', type: 'email_sent', title: 'Justin signed MSA, submitted W9, sent shipping address for Bitkey hardware', dealId: 'd-8', companyId: 'co-8', personId: 'pe-8', createdBy: 'justin', timestamp: '2026-03-30T15:54:00Z' },
  { id: 'a-27', type: 'email_sent', title: 'Jamey submitted script concept + caption for approval', dealId: 'd-8', companyId: 'co-8', personId: 'pe-8', createdBy: 'jamey', timestamp: '2026-04-01T14:34:00Z' },
  { id: 'a-28', type: 'email_received', title: 'Eva confirmed script approved with minor edits', dealId: 'd-8', companyId: 'co-8', personId: 'pe-8', createdBy: 'system', timestamp: '2026-04-02T21:13:00Z' },
  { id: 'a-29', type: 'email_sent', title: 'Final video submitted for approval', dealId: 'd-8', companyId: 'co-8', personId: 'pe-8', createdBy: 'jamey', timestamp: '2026-04-05T04:14:00Z' },
  { id: 'a-30', type: 'email_received', title: 'Video approved - Eva requested posting ASAP', dealId: 'd-8', companyId: 'co-8', personId: 'pe-8', createdBy: 'system', timestamp: '2026-04-07T18:30:00Z' },
  { id: 'a-31', type: 'note', title: 'Jamey posted Bitcoin Day video on X at 4pm. Eva confirmed receipt. Deal delivered.', dealId: 'd-8', companyId: 'co-8', createdBy: 'justin', timestamp: '2026-04-07T20:14:00Z' },
  // Vellum
  { id: 'a-32', type: 'email_received', title: 'Shown Media sent Vellum campaign - QRT + Engagement @ $1,200. Tentative Apr 21 launch.', dealId: 'd-16', companyId: 'co-15', personId: 'pe-15', createdBy: 'system', timestamp: '2026-04-09T12:00:00Z' },
  { id: 'a-33', type: 'note', title: 'Jamey confirmed - locking in for Vellum QRT campaign', dealId: 'd-16', companyId: 'co-15', createdBy: 'justin', timestamp: '2026-04-09T12:30:00Z' },
]

export const deliverables: Deliverable[] = [
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
