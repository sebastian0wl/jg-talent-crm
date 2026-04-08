import type { DealScore, EmailThread } from '../types'

// ── Deal Evaluator Scores ──

export const dealScores: DealScore[] = [
  // Envato — Education Partnership (d-1)
  {
    dealId: 'd-1', overallGrade: 'A', evaluatedAt: '2026-04-05',
    dimensions: [
      { dimension: 'Cash Value', grade: 'A', reasoning: '$50K for tutorials + templates. Strong $/hr if scoped to 3-5 tutorials.' },
      { dimension: 'Brand Prestige', grade: 'B', reasoning: 'Envato is solid but not prestigious. Known as a marketplace, not a design leader. Designers respect Tuts+ content though.' },
      { dimension: 'Distribution', grade: 'S', reasoning: 'Tuts+ YouTube has 1.7M subscribers. Massive distribution for Jamey\'s content beyond her own channels.' },
      { dimension: 'Audience Match', grade: 'A', reasoning: 'Tuts+ audience is designers and creative professionals. Strong overlap with Jamey\'s target.' },
      { dimension: 'Education Funnel', grade: 'S', reasoning: 'Direct pipeline to Maven course. Tutorials = "go deeper in my course" CTA. Perfect top-of-funnel.' },
      { dimension: 'Relationship Compound', grade: 'A', reasoning: 'Multi-tutorial deal = ongoing relationship. Internal champion (Sarah Chen). Could lead to platform deal.' },
      { dimension: 'Creative Value', grade: 'B', reasoning: 'Tutorials are useful but not portfolio-worthy. Good for authority building, not for creative portfolio.' },
      { dimension: 'Time Cost', grade: 'B', reasoning: '3-5 tutorials plus templates. Moderate time investment — probably 2-3 weeks of production total.' },
      { dimension: 'Strategic Timing', grade: 'A', reasoning: 'Pre-Cohort 3 launch. Building top-of-funnel content that feeds the course is exactly the right move right now.' },
    ],
    upgradeMoves: [
      { dimension: 'Brand Prestige', currentGrade: 'B', potentialGrade: 'A', move: 'Frame as "Curriculum Advisor for Envato" not "Sponsored Creator" — different title, different perception.' },
      { dimension: 'Creative Value', currentGrade: 'B', potentialGrade: 'A', move: 'Negotiate creative control so Jamey picks topics. If she\'s teaching her actual workflow, the tutorials become portfolio pieces.' },
      { dimension: 'Time Cost', currentGrade: 'B', potentialGrade: 'A', move: 'Reduce to 3 tutorials + 1 SREF pack (half the production, keep 80% of the value).' },
    ],
    viabilityPaths: [
      {
        name: 'Current Deal', label: 'Path A', overallGrade: 'A', verdict: 'strong',
        changes: ['5 tutorials, SREFs, templates, logos as proposed'],
        whatMakesItWork: 'Distribution (S) and Education Funnel (S) are carrying this deal. The Tuts+ audience IS the Maven funnel.',
        whatHoldsItBack: 'Time cost at 5 tutorials is high. Could burn Jamey out before Cohort 3 launch.',
      },
      {
        name: 'Reframed Deal', label: 'Path B', overallGrade: 'A', verdict: 'no-brainer',
        changes: ['Reduce to 3 tutorials + 1 SREF pack', 'Add "Curriculum Advisor" title', 'Jamey picks topics', 'Non-exclusive'],
        whatMakesItWork: 'Less time, same strategic value. Title upgrade adds brand prestige.',
      },
      {
        name: 'Dream Version', label: 'Path C', overallGrade: 'S', verdict: 'no-brainer',
        changes: ['3 tutorials + SREF pack at $50K', '"Lead Curriculum Advisor" title', 'Tuts+ newsletter feature (2M subs)', 'Revenue share on template sales', 'Course CTA in every tutorial'],
      },
    ],
    positioningAngles: [
      'The educator angle: "I\'m building the definitive AI design curriculum, starting with these tutorials for Envato."',
      'The credibility transfer angle: "Envato picked me as their AI design curriculum advisor." (title framing matters)',
      'The practitioner angle: "Every tutorial teaches my real workflow — not theory, not prompts, real professional process."',
    ],
    recommendation: 'Strong deal. The Distribution + Education Funnel combo makes this a no-brainer for the Maven pipeline. Push for Path B (fewer tutorials, better title, creative control) to optimize time cost. Don\'t go below $40K.',
  },

  // Krea AI — Ambassador (d-2)
  {
    dealId: 'd-2', overallGrade: 'A', evaluatedAt: '2026-04-05',
    dimensions: [
      { dimension: 'Cash Value', grade: 'A', reasoning: '$30K for ongoing content. Strong value for ambassador deal.' },
      { dimension: 'Brand Prestige', grade: 'A', reasoning: 'Krea is respected in AI creative tools. Multi-model approach seen as forward-thinking. Designers talk about it positively.' },
      { dimension: 'Distribution', grade: 'B', reasoning: 'Krea has growing but not massive social presence. Some distribution through their platform features.' },
      { dimension: 'Audience Match', grade: 'S', reasoning: 'Krea users ARE Jamey\'s exact audience — AI-forward designers and creatives using generative tools professionally.' },
      { dimension: 'Education Funnel', grade: 'A', reasoning: 'Krea users are exactly who\'d buy the Maven course. Natural "learn my full workflow" upsell.' },
      { dimension: 'Relationship Compound', grade: 'A', reasoning: 'Ambassador deal = long-term relationship. Multi-model platform means staying power. Could grow into advisory role.' },
      { dimension: 'Creative Value', grade: 'A', reasoning: 'Jamey genuinely uses and loves Krea. Content will be authentic and portfolio-worthy.' },
      { dimension: 'Time Cost', grade: 'A', reasoning: 'She\'s already making Krea content organically. Ambassador deal pays her for what she\'d do anyway.' },
      { dimension: 'Strategic Timing', grade: 'A', reasoning: 'AI creative tools market is hot. Being the face of a leading platform during the wave is smart positioning.' },
    ],
    upgradeMoves: [
      { dimension: 'Distribution', currentGrade: 'B', potentialGrade: 'A', move: 'Negotiate featured creator spot on Krea\'s platform + newsletter features to boost distribution.' },
    ],
    viabilityPaths: [
      {
        name: 'Current Deal', label: 'Path A', overallGrade: 'A', verdict: 'strong',
        changes: ['$30K ambassador, ongoing posts + demos'],
        whatMakesItWork: 'Authenticity. Jamey already uses Krea. The content is natural, not forced.',
        whatHoldsItBack: 'Distribution could be stronger. Krea\'s social reach is growing but not huge yet.',
      },
      {
        name: 'Dream Version', label: 'Path B', overallGrade: 'S', verdict: 'no-brainer',
        changes: ['$30K + equity/advisory component', 'Featured creator on platform', 'Co-branded course module', 'Early access to all new features'],
      },
    ],
    positioningAngles: [
      'The practitioner angle: "Krea is in my actual daily workflow. This isn\'t a sponsorship — it\'s documenting what I already do."',
      'The insider angle: "I get early access to everything Krea ships. You see it here first."',
      'The contrarian angle: "Everyone\'s fighting over which AI model is best. I use ALL of them through Krea."',
    ],
    recommendation: 'Excellent deal. Authentic product-market fit (Jamey actually uses Krea). Push for featured creator spot on their platform to improve distribution. This is a foundation partnership that grows with Krea.',
  },

  // Lovable — Sponsored Video (d-11)
  {
    dealId: 'd-11', overallGrade: 'B', evaluatedAt: '2026-04-07',
    dimensions: [
      { dimension: 'Cash Value', grade: 'B', reasoning: '$20K target, they countered at $15K. At $15K it\'s a C. Need to hold $18K+ floor.' },
      { dimension: 'Brand Prestige', grade: 'A', reasoning: 'Lovable is hot in AI dev tools. Designers know it. Good look on resume.' },
      { dimension: 'Distribution', grade: 'B', reasoning: 'Lovable has strong social presence but mostly dev-focused. Some cross-pollination potential.' },
      { dimension: 'Audience Match', grade: 'B', reasoning: 'Lovable audience is more developers than designers. Partial overlap through the Figma-to-code bridge.' },
      { dimension: 'Education Funnel', grade: 'B', reasoning: 'Tangentially related. Designers who want to ship without devs might buy the course, but it\'s not a direct pipeline.' },
      { dimension: 'Relationship Compound', grade: 'B', reasoning: 'One-off sponsored post. Could lead to more but no guarantee. Nice internal champion (Emma).' },
      { dimension: 'Creative Value', grade: 'A', reasoning: 'Figma-to-code workflow is genuinely cool content. Jamey would enjoy making this and it showcases real skills.' },
      { dimension: 'Time Cost', grade: 'A', reasoning: 'Single video + thread. 2-3 days of work. Good $/hr ratio at $20K.' },
      { dimension: 'Strategic Timing', grade: 'B', reasoning: 'No urgency either way. Fits the content calendar but isn\'t critical.' },
    ],
    upgradeMoves: [
      { dimension: 'Cash Value', currentGrade: 'B', potentialGrade: 'A', move: 'Hold at $20K. Add usage rights (+40%) because they\'ll want to run this as paid media — that gets them to $28K.' },
      { dimension: 'Audience Match', currentGrade: 'B', potentialGrade: 'A', move: 'Position the video for designers who want to ship (not devs who want to design). Reframe the audience angle.' },
      { dimension: 'Education Funnel', currentGrade: 'B', potentialGrade: 'A', move: 'Include a "learn my full design-to-code workflow" CTA that drives to Maven course.' },
      { dimension: 'Relationship Compound', currentGrade: 'B', potentialGrade: 'A', move: 'Propose 2-part series instead of 1 video. Locks in repeat relationship and doubles the value.' },
    ],
    viabilityPaths: [
      {
        name: 'Current Deal', label: 'Path A', overallGrade: 'B', verdict: 'viable',
        changes: ['$15K (their offer), single video + thread'],
        whatMakesItWork: 'Good creative brief, light time cost.',
        whatHoldsItBack: '$15K is below our comfort zone for video. Not enough cash to justify the effort.',
      },
      {
        name: 'Counter Offer', label: 'Path B', overallGrade: 'A', verdict: 'strong',
        changes: ['Counter at $20K', 'Add Maven course CTA', 'Negotiate usage rights discussion for later upsell'],
        whatMakesItWork: 'Better cash + education funnel value.',
      },
      {
        name: 'Dream Version', label: 'Path C', overallGrade: 'A', verdict: 'no-brainer',
        changes: ['$20K base + $8K usage rights = $28K', '2-part series (design + code)', 'Featured on Lovable\'s blog and newsletter', 'Maven course CTA in both videos'],
      },
    ],
    positioningAngles: [
      'The practitioner angle: "I use Lovable to ship my client brand identities without waiting for a developer."',
      'The results angle: "Watch me take a Figma design to a live website in 20 minutes."',
      'The educator angle: "Designers who can ship are 10x more valuable. Here\'s the workflow."',
    ],
    recommendation: 'Viable at $20K, not at $15K. Counter at $20K with the Figma-to-code angle. If they push back, add usage rights discussion as a sweetener. Walk at $18K floor.',
  },

  // Reve.art — Ambassador (d-7)
  {
    dealId: 'd-7', overallGrade: 'B', evaluatedAt: '2026-04-08',
    dimensions: [
      { dimension: 'Cash Value', grade: 'B', reasoning: '$15K target. Decent but not exceptional for an ambassador deal.' },
      { dimension: 'Brand Prestige', grade: 'A', reasoning: 'Reve.art is emerging as a serious AI image gen player. Respected in the community. Good to be early.' },
      { dimension: 'Distribution', grade: 'C', reasoning: 'Small but growing. Limited distribution beyond their own user base right now.' },
      { dimension: 'Audience Match', grade: 'A', reasoning: 'AI image generation users overlap heavily with Jamey\'s audience of AI-forward designers.' },
      { dimension: 'Education Funnel', grade: 'A', reasoning: 'Image gen workflows are core to what Jamey teaches. Direct pipeline to Maven course content.' },
      { dimension: 'Relationship Compound', grade: 'A', reasoning: 'Early ambassador = ground floor of a growing brand. If Reve takes off, this relationship compounds hard.' },
      { dimension: 'Creative Value', grade: 'A', reasoning: 'Jamey loves the product. Content would be authentic and showcase her real creative process.' },
      { dimension: 'Time Cost', grade: 'A', reasoning: 'Ambassador with a tool she already uses. Minimal incremental time.' },
      { dimension: 'Strategic Timing', grade: 'S', reasoning: 'AI image gen market is in a pivotal moment. Being the face of a rising player during the wave is perfect timing.' },
    ],
    upgradeMoves: [
      { dimension: 'Cash Value', currentGrade: 'B', potentialGrade: 'A', move: 'Push for $20K+ by bundling early access content + tutorial series. More deliverables = higher price justified.' },
      { dimension: 'Distribution', currentGrade: 'C', potentialGrade: 'B', move: 'Negotiate featured creator page on Reve\'s site + inclusion in their launch marketing.' },
    ],
    viabilityPaths: [
      {
        name: 'Current Deal', label: 'Path A', overallGrade: 'B', verdict: 'viable',
        changes: ['$15K ambassador, content series'],
        whatMakesItWork: 'Strategic timing (S) + authentic product fit. Being early to a rising brand.',
        whatHoldsItBack: 'Cash and distribution are moderate. Not a slam dunk financially.',
      },
      {
        name: 'Expanded Deal', label: 'Path B', overallGrade: 'A', verdict: 'strong',
        changes: ['$20K+ with tutorial component', 'Featured creator page on their site', 'Early access to all features', 'Maven course integration'],
      },
    ],
    positioningAngles: [
      'The insider angle: "I\'m one of the first professional designers building with Reve. Here\'s what I\'m seeing."',
      'The practitioner angle: "This is genuinely in my daily workflow. Not a sponsorship — a documentation of my process."',
      'The contrarian angle: "While everyone\'s fighting over Midjourney vs Flux, I\'m using this."',
    ],
    recommendation: 'Worth pursuing. The strategic timing is perfect — be early to a rising brand. Push for $20K with tutorial component and featured creator placement. The relationship compounds if Reve takes off.',
  },

  // Decimals — Affiliate (d-4)
  {
    dealId: 'd-4', overallGrade: 'B', evaluatedAt: '2026-04-08',
    dimensions: [
      { dimension: 'Cash Value', grade: 'C', reasoning: 'Affiliate model. $5K estimate based on signups. No guaranteed upfront.' },
      { dimension: 'Brand Prestige', grade: 'B', reasoning: 'Decimals is respected in design hiring. Good look for Jamey as a talent scout.' },
      { dimension: 'Distribution', grade: 'C', reasoning: 'Minimal distribution from Decimals side. Content lives on Jamey\'s channels.' },
      { dimension: 'Audience Match', grade: 'S', reasoning: 'Designers looking for work = exactly who follows Jamey. Perfect overlap.' },
      { dimension: 'Education Funnel', grade: 'B', reasoning: 'Tangential. Designers who need jobs might also want to upskill via course.' },
      { dimension: 'Relationship Compound', grade: 'B', reasoning: 'Could lead to paid sponsorship if signups are strong. Danny relationship is warm.' },
      { dimension: 'Creative Value', grade: 'C', reasoning: 'Affiliate post isn\'t creatively interesting. Functional, not inspiring.' },
      { dimension: 'Time Cost', grade: 'S', reasoning: 'Thread + email. Already written. Maybe 1 hour to post and send.' },
      { dimension: 'Strategic Timing', grade: 'B', reasoning: 'Fine timing. Not critical, not conflicting.' },
    ],
    upgradeMoves: [
      { dimension: 'Cash Value', currentGrade: 'C', potentialGrade: 'B', move: 'Track signups. If we hit 170+ (like Flora), upsell Danny to a $5K paid sponsorship next round.' },
      { dimension: 'Creative Value', currentGrade: 'C', potentialGrade: 'B', move: 'Reframe as "I\'m building my design collective" not "use my affiliate link."' },
      { dimension: 'Distribution', currentGrade: 'C', potentialGrade: 'B', move: 'Get Ridd to QRT/engage with the post to add credibility and reach.' },
    ],
    viabilityPaths: [
      {
        name: 'Current Deal', label: 'Path A', overallGrade: 'B', verdict: 'viable',
        changes: ['Post thread + newsletter with affiliate link'],
        whatMakesItWork: 'Time Cost (S) — it\'s basically free effort. Already written.',
        whatHoldsItBack: 'Cash is speculative. If signups are low, it was a waste of a post slot.',
      },
      {
        name: 'Upsell Path', label: 'Path B', overallGrade: 'A', verdict: 'strong',
        changes: ['Post affiliate now', 'Track signups for 30 days', 'If strong, pitch Danny $5K paid sponsorship for round 2'],
      },
    ],
    positioningAngles: [
      'The insider angle: "I joined a collective that flips how design hiring works."',
      'The practitioner angle: "Hot take: designers should not be applying to jobs."',
    ],
    recommendation: 'Do it — the time cost is almost zero and the audience match is perfect. Track signups and use the data to upsell Danny to paid. This is a seeding play, not a cash play.',
  },

  // Freepik — Education Partnership (d-10)
  {
    dealId: 'd-10', overallGrade: 'B', evaluatedAt: '2026-04-08',
    dimensions: [
      { dimension: 'Cash Value', grade: 'A', reasoning: '$25K for education partnership. Strong rate.' },
      { dimension: 'Brand Prestige', grade: 'B', reasoning: 'Freepik is known but not prestigious. Design asset marketplace. Functional, not aspirational.' },
      { dimension: 'Distribution', grade: 'A', reasoning: 'Freepik has massive user base. Newsletter, platform features, social channels.' },
      { dimension: 'Audience Match', grade: 'B', reasoning: 'Freepik users skew more casual/beginner. Partial overlap with Jamey\'s pro designer audience.' },
      { dimension: 'Education Funnel', grade: 'A', reasoning: 'Workshop/tutorial format feeds directly into Maven course pipeline.' },
      { dimension: 'Relationship Compound', grade: 'B', reasoning: 'First deal. Could grow but no established relationship yet.' },
      { dimension: 'Creative Value', grade: 'B', reasoning: 'Multi-model platform means interesting content. But asset marketplace isn\'t glamorous.' },
      { dimension: 'Time Cost', grade: 'B', reasoning: 'Workshop or tutorial series. Moderate production investment.' },
      { dimension: 'Strategic Timing', grade: 'A', reasoning: 'Multi-model platforms are the future. Good timing to establish these relationships.' },
    ],
    upgradeMoves: [
      { dimension: 'Brand Prestige', currentGrade: 'B', potentialGrade: 'A', move: 'Frame as "AI Design Educator for Freepik" not generic partnership. Title matters.' },
      { dimension: 'Audience Match', currentGrade: 'B', potentialGrade: 'A', move: 'Target the workshop at professional designers using Freepik\'s AI tools, not beginners.' },
      { dimension: 'Time Cost', currentGrade: 'B', potentialGrade: 'A', move: 'Single workshop (not series) keeps time manageable while maintaining full value.' },
    ],
    viabilityPaths: [
      {
        name: 'Current Deal', label: 'Path A', overallGrade: 'B', verdict: 'viable',
        changes: ['$25K for workshop or tutorial series, scope TBD'],
        whatMakesItWork: 'Cash (A) + Distribution (A) + Education Funnel (A). The trifecta.',
        whatHoldsItBack: 'Brand prestige is meh. Need to frame it right so it doesn\'t cheapen Jamey\'s positioning.',
      },
      {
        name: 'Reframed Deal', label: 'Path B', overallGrade: 'A', verdict: 'strong',
        changes: ['Single premium workshop at $25K', 'Freepik newsletter feature (massive reach)', '"AI Design Educator" title', 'Maven CTA included'],
      },
    ],
    positioningAngles: [
      'The educator angle: "Teaching professional AI design workflows to the world\'s largest design community."',
      'The contrarian angle: "Freepik is evolving from assets to AI. I\'m helping lead that transition."',
    ],
    recommendation: 'Good deal with the right framing. Meeting tomorrow — push for workshop format (less time), newsletter feature (distribution), and educator title (prestige). The combo of cash + distribution + education funnel is compelling.',
  },
]

export const getDealScore = (dealId: string) => dealScores.find(s => s.dealId === dealId)

// ── Email Threads ──

export const emailThreads: EmailThread[] = [
  {
    activityId: 'a-1', dealId: 'd-1',
    messages: [
      { id: 'em-1', from: 'sarah@envato.com', to: 'partnerships@brand-sprints.com', subject: 'Re: Jamey Gannon x Envato — Education Partnership', body: 'Hi Justin,\n\nThanks for the proposal! We\'ve reviewed internally and love the direction. A few thoughts on the revised terms:\n\n- We\'re aligned on 3-5 tutorials focused on AI design workflows\n- Happy with the SREF pack inclusion\n- We\'d like to add brand design/logo content (this is a big gap in our library)\n- Non-exclusive is fine\n- Budget: we can do $45K for the full package\n\nCan we schedule a call to finalize scope?\n\nBest,\nSarah Chen\nPartnerships Lead, Envato', timestamp: '2026-04-07T14:30:00Z', direction: 'inbound' },
      { id: 'em-2', from: 'partnerships@brand-sprints.com', to: 'sarah@envato.com', subject: 'Re: Jamey Gannon x Envato — Education Partnership', body: 'Hi Sarah,\n\nGreat to hear you\'re aligned on the direction. A few notes from our side:\n\n- Jamey is excited about tutorials (not full courses) — this plays to her strength of concise, practical content\n- Brand design/logo content is a great add. She\'s been doing a lot of AI-assisted identity work\n- On budget: we were targeting $50K given the scope (tutorials + SREFs + brand design templates). Happy to discuss on a call.\n\nHow does Thursday at 2pm ET work?\n\nBest,\nJustin\nTalent Manager, Jamey Gannon', timestamp: '2026-04-06T16:00:00Z', direction: 'outbound' },
    ],
  },
  {
    activityId: 'a-4', dealId: 'd-11',
    messages: [
      { id: 'em-3', from: 'emma@lovable.dev', to: 'partnerships@brand-sprints.com', subject: 'Re: Sponsored Content — Jamey Gannon x Lovable', body: 'Hi Justin,\n\nWe love Jamey\'s work and think the Figma-to-code angle is perfect for our audience.\n\nAfter reviewing internally, we can offer $15K for a sponsored video walkthrough + X thread. This includes organic posting only.\n\nLet me know if that works or if you\'d like to discuss further.\n\nBest,\nEmma Wright\nMarketing Lead, Lovable', timestamp: '2026-04-07T16:00:00Z', direction: 'inbound' },
      { id: 'em-4', from: 'partnerships@brand-sprints.com', to: 'emma@lovable.dev', subject: 'Re: Sponsored Content — Jamey Gannon x Lovable', body: 'Hey Emma,\n\nAppreciate the offer! Jamey is genuinely excited about this one — she already uses Lovable in her Figma-to-code workflow, so the content will be very authentic.\n\nOn pricing: given the production value of a full video walkthrough + thread, and Jamey\'s audience reach, we\'re targeting $20K for this package. This reflects:\n- Full HD video production with real project showcase\n- X thread with engagement\n- Jamey\'s 120K+ highly targeted audience of designers and AI professionals\n\nWould love to find a number that works for both sides. Open to discussing scope adjustments if helpful.\n\nBest,\nJustin', timestamp: '2026-04-08T12:00:00Z', direction: 'outbound' },
    ],
  },
  {
    activityId: 'a-7', dealId: 'd-3',
    messages: [
      { id: 'em-5', from: 'maria@elevenlabs.io', to: 'partnerships@brand-sprints.com', subject: 'Creator Partnership — ElevenLabs x Jamey Gannon', body: 'Hi there,\n\nI\'m Maria from the Creator Partnerships team at ElevenLabs. We\'ve been following Jamey\'s work in AI creative tools and think there could be a great fit for a partnership.\n\nWe recently launched some exciting new features for creative professionals and would love to explore how Jamey might showcase them to her audience.\n\nWould you be open to a quick call to discuss possibilities?\n\nBest,\nMaria Santos\nCreator Partnerships, ElevenLabs', timestamp: '2026-04-05T13:00:00Z', direction: 'inbound' },
    ],
  },
]

export const getEmailThread = (activityId: string) => emailThreads.find(t => t.activityId === activityId)
export const getEmailThreadForDeal = (dealId: string) => emailThreads.filter(t => t.dealId === dealId)
