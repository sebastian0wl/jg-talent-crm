-- JG Talent CRM — Seed Data
-- Run this in Supabase SQL Editor after 001_initial_schema.sql

-- ── Companies ──
INSERT INTO companies (id, name, domain, industry) VALUES
  ('co-1', 'Envato', 'envato.com', 'Design Marketplace'),
  ('co-2', 'Krea AI', 'krea.ai', 'AI Creative Tools'),
  ('co-3', 'ElevenLabs', 'elevenlabs.io', 'AI Audio'),
  ('co-4', 'Decimals', 'decimals.co', 'Design Talent'),
  ('co-5', 'Grok / xAI', 'x.ai', 'AI'),
  ('co-6', 'Flux', 'flux.ai', 'AI Image Generation'),
  ('co-7', 'Reve.art', 'reve.art', 'AI Image Generation'),
  ('co-8', 'Block Inc', 'block.xyz', 'Fintech'),
  ('co-9', 'Higgsfield', 'higgsfield.ai', 'AI Video'),
  ('co-10', 'Freepik', 'freepik.com', 'Design Assets'),
  ('co-11', 'Lovable', 'lovable.dev', 'AI Dev Tools'),
  ('co-12', 'Maven', 'maven.com', 'Education Platform'),
  ('co-13', 'Flora.ai', 'flora.ai', 'AI E-Commerce'),
  ('co-14', 'Instant.so', 'instant.so', 'AI E-Commerce');

-- ── People ──
INSERT INTO people (id, name, email, role, company_id, notes) VALUES
  ('pe-1', 'Hichame Assi', 'hichame.assi@envato.com', 'Partnerships', 'co-1', NULL),
  ('pe-2', 'Miguel Lara', 'miguel@krea.ai', 'Partnerships', 'co-2', NULL),
  ('pe-3', 'Konstantin Kanin', 'konstantin@kudosnarratives.com', 'Agency (Kudos Narratives)', 'co-3', 'Agency rep for ElevenLabs. Also: Liza Novikova (liz@kudosnarratives.com)'),
  ('pe-4', 'Danny Martinez', 'danny@decimals.work', 'Partnerships', 'co-4', 'Also: Michael Riddering / Ridd (ridd@dive.club)'),
  ('pe-5', 'Alex Kim', 'alex@x.ai', 'Marketing', 'co-5', NULL),
  ('pe-6', 'Jordan Lee', 'jordan@flux.ai', 'Partnerships', 'co-6', NULL),
  ('pe-7', 'Oscar Dumlao', 'oscar.dumlao@reve.art', 'Partnerships', 'co-7', 'Initiated from X thread. Also: Melisa Seah (melisa.seah@reve.art)'),
  ('pe-8', 'Tyler Brooks', 'tyler@block.xyz', 'Brand Manager', 'co-8', NULL),
  ('pe-9', 'Mika Tanaka', 'mika@higgsfield.ai', 'CEO', 'co-9', 'Via Shown Media'),
  ('pe-10', 'Carlos Ruiz', 'carlos@freepik.com', 'Influencer Ops', 'co-10', NULL),
  ('pe-11', 'Emma Wright', 'emma@lovable.dev', 'Marketing Lead', 'co-11', NULL),
  ('pe-12', 'Mallory Contois', 'mallory@maven.com', 'Creator Partnerships', 'co-12', 'Invited Jamey to run Maven workshop. Also: Delaney Niermann (operations).'),
  ('pe-13', 'Weber Wong', 'weber@flora.ai', 'Founder', 'co-13', 'Jamey gets 1M credits/mo. 487 clicks / 178 leads / $1,875 in sales generated for Flora.'),
  ('pe-14', 'Sam van Hees', 'sam@instant.so', 'Founder', 'co-14', 'Jamey has early access to AI features. Said "yes sounds good!" to sponsorship.');

-- ── Deals ──
INSERT INTO deals (id, name, company_id, contact_id, pipeline, stage, type, priority, value, closed_value, platforms, deliverables, terms, notes, jamey_uses_product, owner, created_at, last_activity_at, expected_close_date, closed_at) VALUES
  -- Content Pipeline
  ('d-3', 'ElevenLabs Sponsored Post', 'co-3', 'pe-3', 'content', 'Inbound', 'Sponsored Post', 'Medium', 15000, NULL, ARRAY['X','YouTube'], NULL, 'Initial interest. Need to scope deliverables and send rate.', NULL, true, 'justin', '2026-03-20', '2026-04-05', NULL, NULL),
  ('d-5', 'Grok QRT Campaign', 'co-5', 'pe-5', 'content', 'Rate Sent', 'QRT + Comment', 'Medium', 8000, NULL, ARRAY['X'], 'QRTs + organic mentions', 'Jamey uses Grok for image gen. Natural fit. Rate sent, waiting on their response.', NULL, true, 'justin', '2026-03-18', '2026-04-04', NULL, NULL),
  ('d-6', 'Flux Sponsored Post', 'co-6', 'pe-6', 'content', 'Inbound', 'Sponsored Post', 'Low', 10000, NULL, ARRAY['X'], NULL, 'Stale. 25+ days. No clear next step. Re-engage or kill.', NULL, false, 'justin', '2026-03-12', '2026-03-14', NULL, NULL),
  ('d-11', 'Lovable Sponsored Video', 'co-11', 'pe-11', 'content', 'Terms Agreed', 'Sponsored Video', 'High', 20000, NULL, ARRAY['X','YouTube'], 'Video walkthrough + thread', 'They offered $15K. Our floor is $18K. Counter at $20K with Figma-to-code angle.', NULL, true, 'justin', '2026-03-15', '2026-04-08', '2026-04-25', NULL),
  ('d-9', 'Higgsfield Sponsored Video', 'co-9', 'pe-9', 'content', 'Invoiced', 'Sponsored Video', 'Medium', 1200, 1200, ARRAY['X'], 'Sponsored video', 'Came through Shown Media. Content delivered. In invoicing/collections.', NULL, true, 'both', '2026-02-01', '2026-03-15', NULL, '2026-03-15'),
  -- Partnership Pipeline
  ('d-1', 'Envato Education Partnership', 'co-1', 'pe-1', 'partnership', 'Negotiating', 'Education Partnership', 'High', 50000, NULL, ARRAY['YouTube','X'], '3-5 tutorials, SREFs, brand design templates, logos', 'Jamey wants tutorials not courses. Non-exclusive. Envato wants logo/brand design content.', 'Proposal drafted, waiting on Jamey review before sending.', true, 'both', '2026-03-10', '2026-04-07', '2026-04-20', NULL),
  ('d-2', 'Krea AI Ambassador', 'co-2', 'pe-2', 'partnership', 'Proposal Sent', 'Brand Ambassador', 'High', 30000, NULL, ARRAY['X','YouTube'], 'Ongoing posts, feature demos, early access content', 'They owe affiliate link. Multi-model platform = strong strategic fit.', 'Jamey uses and loves the product. Ball in their court.', true, 'justin', '2026-03-05', '2026-04-06', '2026-04-25', NULL),
  ('d-4', 'Decimals Affiliate Campaign', 'co-4', 'pe-4', 'partnership', 'Proposal Sent', 'Affiliate', 'Medium', 5000, NULL, ARRAY['X'], 'X thread + newsletter email with affiliate link', 'Affiliate model — no upfront pay. Revenue share on signups.', 'Campaign drafts written and voice-matched. Ready to post when Jamey approves.', false, 'both', '2026-03-25', '2026-04-08', NULL, NULL),
  ('d-7', 'Reve.art Ambassador', 'co-7', 'pe-7', 'partnership', 'Inbound', 'Brand Ambassador', 'Medium', 15000, NULL, ARRAY['X'], 'Content series, early access, community building', 'A-tier brand prestige. Education funnel potential. Strong evaluator score.', NULL, true, 'justin', '2026-04-01', '2026-04-08', NULL, NULL),
  ('d-10', 'Freepik Education Partnership', 'co-10', 'pe-10', 'partnership', 'Discovery Call', 'Education Partnership', 'Medium', 25000, NULL, ARRAY['YouTube'], 'TBD — workshop or tutorial series', 'Multi-model platform like Krea. Meeting scheduled for Apr 9.', NULL, true, 'both', '2026-03-28', '2026-04-08', '2026-05-01', NULL),
  -- Service Pipeline
  ('d-12', 'Maven Workshop — AI for E-Commerce Leaders', 'co-12', 'pe-12', 'service', 'Scoping Call', 'Speaking', 'High', 9000, NULL, ARRAY['Maven'], '3-hour live workshop: AI for E-Commerce Leaders crash course, Apr 16', '~30 students @ $300 = ~$9K. Only 1 week of promo. Delaney recommended 3hr @ $300.', 'Mallory from Maven invited Jamey. Flora.ai and Instant.so as potential sponsors. Instant.so confirmed interest.', true, 'both', '2026-04-07', '2026-04-08', '2026-04-16', NULL),
  ('d-13', 'Flora.ai — Maven Workshop Sponsor', 'co-13', 'pe-13', 'partnership', 'Inbound', 'Brand Ambassador', 'Medium', 2000, NULL, ARRAY['Maven'], 'Workshop sponsor mention + demo during AI for E-Commerce Leaders session', 'Jamey DM''d Weber Wong. Flora gives 1M credits/mo. 487 clicks / 178 leads / $1,875 in sales so far.', NULL, true, 'jamey', '2026-04-08', '2026-04-08', NULL, NULL),
  ('d-14', 'Instant.so — Maven Workshop Sponsor', 'co-14', 'pe-14', 'partnership', 'Inbound', 'Brand Ambassador', 'High', 2000, NULL, ARRAY['Maven'], 'Workshop sponsor mention + demo during AI for E-Commerce Leaders session', 'Sam confirmed interest via DM. Need to email sam@instant.so with sponsorship proposal + tiers.', NULL, true, 'both', '2026-04-08', '2026-04-08', NULL, NULL),
  ('d-8', 'Block Brand Identity', 'co-8', 'pe-8', 'service', 'Invoiced', 'Creative Direction', 'High', 5000, 5000, NULL, 'Brand identity consultation', NULL, NULL, false, 'jamey', '2026-02-15', '2026-03-20', NULL, '2026-03-20');

-- ── Tasks ──
INSERT INTO tasks (id, title, description, status, priority, assignee, deal_id, due_date, created_at, created_by) VALUES
  ('t-1', 'Review & approve Envato proposal', 'Tutorials focus (not courses), SREFs, brand design templates. Sign off before we send.', 'To Do', 'Urgent', 'jamey', 'd-1', '2026-04-09', '2026-04-06', 'justin'),
  ('t-2', 'Send Envato proposal after approval', 'Blocked on Jamey. Email draft ready.', 'Waiting', 'Urgent', 'justin', 'd-1', '2026-04-10', '2026-04-06', 'justin'),
  ('t-3', 'Follow up with Krea on affiliate link', 'Ball in their court. 4 days stale.', 'To Do', 'High', 'justin', 'd-2', '2026-04-10', '2026-04-07', 'agent'),
  ('t-4', 'Scope ElevenLabs and send rate', 'Initial interest only. Propose deliverables + pricing.', 'To Do', 'High', 'justin', 'd-3', '2026-04-11', '2026-04-05', 'agent'),
  ('t-5', 'Approve Decimals campaign drafts', 'X thread + newsletter in Jamey''s voice. Ready for review.', 'To Do', 'High', 'jamey', 'd-4', '2026-04-10', '2026-04-08', 'justin'),
  ('t-6', 'Post Decimals campaign', 'Post thread + newsletter after approval. Tag @riikiird.', 'Waiting', 'Normal', 'jamey', 'd-4', '2026-04-11', '2026-04-08', 'justin'),
  ('t-7', 'Draft Grok QRT proposal', 'Propose QRT cadence and pricing.', 'To Do', 'Normal', 'justin', 'd-5', '2026-04-12', '2026-04-06', 'justin'),
  ('t-8', 'Re-engage or kill Flux', '25+ days stale. Either re-engage or close lost.', 'To Do', 'Low', 'justin', 'd-6', '2026-04-12', '2026-04-07', 'agent'),
  ('t-9', 'Send Reve.art initial outreach', 'Strong evaluator scores. Draft intro for ambassador.', 'To Do', 'High', 'justin', 'd-7', '2026-04-11', '2026-04-08', 'justin'),
  ('t-10', 'Prep for Freepik meeting', 'Meeting Apr 9. Research creator program, prepare talking points.', 'To Do', 'Urgent', 'justin', 'd-10', '2026-04-09', '2026-04-08', 'agent'),
  ('t-11', 'Counter Lovable at $20K', 'They offered $15K. Floor $18K. Figma-to-code workflow angle.', 'In Progress', 'Urgent', 'justin', 'd-11', '2026-04-09', '2026-04-07', 'justin'),
  ('t-12', 'Record Lovable demo video', '2 min screen recording of Jamey using Lovable. Helps close deal.', 'To Do', 'High', 'jamey', 'd-11', '2026-04-12', '2026-04-08', 'justin'),
  ('t-13', 'Build attendance estimate for Maven workshop', 'Need concrete attendance story before approaching sponsors. Workshop is Apr 16, only 1 week of promo.', 'To Do', 'Urgent', 'justin', 'd-12', '2026-04-09', '2026-04-08', 'justin'),
  ('t-14', 'Create sponsorship tiers for Maven workshop', 'Build tiered sponsorship proposal for Flora.ai and Instant.so before emailing Sam.', 'To Do', 'Urgent', 'justin', 'd-12', '2026-04-09', '2026-04-08', 'justin'),
  ('t-15', 'Email Instant.so sponsorship proposal', 'Sam confirmed interest via DM. Need attendance story + tiers first. BLOCKED on t-13 and t-14.', 'Waiting', 'Urgent', 'justin', 'd-14', '2026-04-10', '2026-04-08', 'justin'),
  ('t-16', 'Send Flora.ai sponsorship proposal', 'Jamey DM''d Weber Wong. Follow up with formal proposal. Leverage existing stats.', 'To Do', 'High', 'jamey', 'd-13', '2026-04-10', '2026-04-08', 'justin'),
  ('t-17', 'Submit workshop description to Maven', 'Delaney asked for workshop description. Jamey drafted a 6-section brief. Finalize and send.', 'In Progress', 'Urgent', 'jamey', 'd-12', '2026-04-09', '2026-04-08', 'justin'),
  ('t-18', 'Confirm Maven workshop logistics', 'Apr 16, 3 hours, $300 price point. Confirm exact time, platform setup, promo materials from Maven.', 'To Do', 'High', 'justin', 'd-12', '2026-04-10', '2026-04-08', 'justin');

-- ── Activities ──
INSERT INTO activities (id, type, title, deal_id, company_id, person_id, created_by, timestamp) VALUES
  ('a-1', 'email_sent', 'Pitched Envato 3-point proposal (1stCollab, workshop, Tuts+)', 'd-1', 'co-1', 'pe-1', 'justin', '2026-04-01T12:00:00Z'),
  ('a-14', 'email_received', 'Hichame replied: send itemized proposal for points 2 & 3', 'd-1', 'co-1', 'pe-1', 'system', '2026-04-02T14:00:00Z'),
  ('a-2', 'email_sent', 'Krea follow-up on next steps', 'd-2', 'co-2', 'pe-2', 'justin', '2026-04-05T10:15:00Z'),
  ('a-3', 'agent_alert', 'Flux deal flagged stale (25+ days)', 'd-6', 'co-6', NULL, 'agent', '2026-04-07T09:00:00Z'),
  ('a-4', 'email_received', 'Lovable countered at $15K', 'd-11', 'co-11', 'pe-11', 'system', '2026-04-07T16:00:00Z'),
  ('a-5', 'meeting', 'Freepik intro call scheduled for Apr 9', 'd-10', 'co-10', 'pe-10', 'agent', '2026-04-08T08:00:00Z'),
  ('a-6', 'note', 'Decimals campaign drafts rewritten in voice', 'd-4', 'co-4', NULL, 'justin', '2026-04-08T11:00:00Z'),
  ('a-7', 'email_received', 'ElevenLabs collab proposal via Kudos Narratives (Konstantin)', 'd-3', 'co-3', 'pe-3', 'system', '2026-04-06T13:00:00Z'),
  ('a-15', 'email_sent', 'Justin confirmed ElevenLabs — "Works! Send agreement" + asked re deadline & tool access', 'd-3', 'co-3', 'pe-3', 'justin', '2026-04-08T11:00:00Z'),
  ('a-16', 'email_received', 'Reve — Oscar connected Jamey with Melisa Seah, meeting booked Apr 8', 'd-7', 'co-7', 'pe-7', 'system', '2026-04-07T15:00:00Z'),
  ('a-17', 'email_received', 'Decimals — Danny thread, meeting scheduled for Apr 8', 'd-4', 'co-4', 'pe-4', 'system', '2026-04-08T09:00:00Z'),
  ('a-8', 'agent_alert', 'Krea flagged stale — 4 days', 'd-2', 'co-2', NULL, 'agent', '2026-04-08T09:00:00Z'),
  ('a-9', 'email_sent', 'Lovable counter-offer at $20K', 'd-11', 'co-11', 'pe-11', 'justin', '2026-04-08T12:00:00Z'),
  ('a-10', 'call', 'Higgsfield post-campaign debrief', 'd-9', 'co-9', 'pe-9', 'justin', '2026-04-04T17:00:00Z'),
  ('a-11', 'stage_change', 'Envato advanced to Negotiating', 'd-1', 'co-1', NULL, 'justin', '2026-04-06T09:00:00Z'),
  ('a-12', 'note', 'Reve.art deal evaluation completed — A-tier', 'd-7', 'co-7', NULL, 'justin', '2026-04-08T10:00:00Z'),
  ('a-13', 'task_created', 'Agent: Prep for Freepik meeting', 'd-10', 'co-10', NULL, 'agent', '2026-04-08T07:00:00Z'),
  ('a-18', 'email_received', 'Maven invited Jamey to run a workshop (Mallory Contois + Delaney Niermann)', 'd-12', 'co-12', 'pe-12', 'system', '2026-04-07T10:00:00Z'),
  ('a-19', 'note', 'Jamey drafted full workshop brief: "AI for E-Commerce Leaders" — 3hr crash course @ $300', 'd-12', 'co-12', NULL, 'jamey', '2026-04-08T14:00:00Z'),
  ('a-20', 'email_sent', 'Jamey DM''d Weber Wong (Flora.ai) re: sponsoring Maven workshop', 'd-13', 'co-13', 'pe-13', 'jamey', '2026-04-08T15:00:00Z'),
  ('a-21', 'email_received', 'Instant.so — Sam confirmed interest: "yes sounds good! send to sam@instant.so"', 'd-14', 'co-14', 'pe-14', 'system', '2026-04-08T16:00:00Z'),
  ('a-22', 'task_created', 'Created Maven workshop task chain: attendance story → sponsorship tiers → email sponsors', 'd-12', 'co-12', NULL, 'justin', '2026-04-08T17:00:00Z');

-- ── Deliverables ──
INSERT INTO deliverables (id, title, deal_id, status, content_type, due_date, publish_date, invoice_amount, invoice_status) VALUES
  ('del-1', 'Block Brand Identity', 'd-8', 'Published', 'Brand Identity', '2026-03-15', '2026-03-18', 5000, 'Invoiced'),
  ('del-2', 'Higgsfield Sponsored Video', 'd-9', 'Published', 'Sponsored Video', '2026-03-08', '2026-03-10', 1200, 'Invoiced');
