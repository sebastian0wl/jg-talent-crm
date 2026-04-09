-- 006: Insert Cash App and Vellum deals + fix Unicode mojibake
-- Run in Supabase SQL Editor

-- ============================
-- Fix Unicode mojibake in existing data
-- ============================
UPDATE activities SET title = REPLACE(title, E'\u2014', '-') WHERE title LIKE E'%\u2014%';
UPDATE activities SET title = REPLACE(title, E'\u2192', '->') WHERE title LIKE E'%\u2192%';
UPDATE activities SET title = REPLACE(title, E'\u2500', '--') WHERE title LIKE E'%\u2500%';
UPDATE deals SET deliverables = REPLACE(deliverables, E'\u2014', '-') WHERE deliverables LIKE E'%\u2014%';
UPDATE deals SET terms = REPLACE(terms, E'\u2014', '-') WHERE terms LIKE E'%\u2014%';
UPDATE deals SET notes = REPLACE(notes, E'\u2014', '-') WHERE notes LIKE E'%\u2014%';
UPDATE deals SET deliverables = REPLACE(deliverables, E'\u2192', '->') WHERE deliverables LIKE E'%\u2192%';
UPDATE deals SET terms = REPLACE(terms, E'\u2192', '->') WHERE terms LIKE E'%\u2192%';
UPDATE deals SET notes = REPLACE(notes, E'\u2192', '->') WHERE notes LIKE E'%\u2192%';

-- ============================
-- Cash App / Block - Company
-- ============================
INSERT INTO companies (id, name, domain, industry)
VALUES ('co-8', 'Cash App / Block', 'cash.app', 'Fintech')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, domain = EXCLUDED.domain, industry = EXCLUDED.industry;

-- ============================
-- Eva Alzamora - Contact (via Boys Club)
-- ============================
INSERT INTO people (id, name, email, role, company_id, notes)
VALUES (
  'pe-8',
  'Eva Alzamora',
  'eva@boysclub.vip',
  'Partnerships',
  'co-8',
  'Via Boys Club (Predicate Labs Inc.). Also: Miranda Martell (miranda@boysclub.vip). Agency manages Cash App/Block/Bitkey creator campaigns.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role, company_id = EXCLUDED.company_id, notes = EXCLUDED.notes;

-- ============================
-- Cash App x Bitcoin Day 2026 - Deal
-- ============================
INSERT INTO deals (id, name, company_id, contact_id, pipeline, stage, type, priority, value, closed_value, platforms, deliverables, terms, notes, jamey_uses_product, owner, created_at, last_activity_at, closed_at)
VALUES (
  'd-8',
  'Cash App x Bitcoin Day 2026',
  'co-8',
  'pe-8',
  'content',
  'Delivered',
  'Sponsored Video',
  'High',
  3000,
  3000,
  ARRAY['X'],
  'Sponsored X video featuring Bitkey hardware wallet for Bitcoin Day 2026. Tags: @BitcoinatBlock, @CashApp, @Square, @Bitkey. Link: btc.day',
  'MSA with Predicate Labs Inc. (Boys Club). $3,000 USD flat. Net 30 from posting. 30-day organic usage rights for Block channels.',
  'Via Boys Club agency. Eva Alzamora + Miranda Martell. Script approved Apr 2, Bitkey hardware shipped, final video approved Apr 5, posted Apr 7 at 4pm. Jamey filmed Bitkey product - Corian marble body, fingerprint sensor, tap-to-approve. W9 submitted under Good Fast Cheap LLC.',
  true,
  'both',
  '2026-03-30',
  '2026-04-07',
  '2026-04-07'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, company_id = EXCLUDED.company_id, contact_id = EXCLUDED.contact_id,
  pipeline = EXCLUDED.pipeline, stage = EXCLUDED.stage, type = EXCLUDED.type, priority = EXCLUDED.priority,
  value = EXCLUDED.value, closed_value = EXCLUDED.closed_value, platforms = EXCLUDED.platforms,
  deliverables = EXCLUDED.deliverables, terms = EXCLUDED.terms, notes = EXCLUDED.notes,
  jamey_uses_product = EXCLUDED.jamey_uses_product, owner = EXCLUDED.owner,
  last_activity_at = EXCLUDED.last_activity_at, closed_at = EXCLUDED.closed_at;

-- ============================
-- Cash App Activities
-- ============================
INSERT INTO activities (id, type, title, deal_id, company_id, person_id, created_by, timestamp) VALUES
  ('a-25', 'email_received', 'Boys Club (Eva Alzamora) sent MSA + creator brief for Cash App x Bitcoin Day 2026', 'd-8', 'co-8', 'pe-8', 'system', '2026-03-30T15:13:00Z'),
  ('a-26', 'email_sent', 'Justin signed MSA, submitted W9, sent shipping address for Bitkey hardware', 'd-8', 'co-8', 'pe-8', 'justin', '2026-03-30T15:54:00Z'),
  ('a-27', 'email_sent', 'Jamey submitted script concept + caption for approval', 'd-8', 'co-8', 'pe-8', 'jamey', '2026-04-01T14:34:00Z'),
  ('a-28', 'email_received', 'Eva confirmed script approved with minor edits', 'd-8', 'co-8', 'pe-8', 'system', '2026-04-02T21:13:00Z'),
  ('a-29', 'email_sent', 'Final video submitted for approval', 'd-8', 'co-8', 'pe-8', 'jamey', '2026-04-05T04:14:00Z'),
  ('a-30', 'email_received', 'Video approved - Eva requested posting ASAP', 'd-8', 'co-8', 'pe-8', 'system', '2026-04-07T18:30:00Z'),
  ('a-31', 'note', 'Jamey posted Bitcoin Day video on X at 4pm. Eva confirmed receipt. Deal delivered.', 'd-8', 'co-8', NULL, 'justin', '2026-04-07T20:14:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================
-- Vellum - Company
-- ============================
INSERT INTO companies (id, name, domain, industry)
VALUES ('co-15', 'Vellum', 'vellum.ai', 'AI Assistant')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, domain = EXCLUDED.domain, industry = EXCLUDED.industry;

-- ============================
-- Shown Media - Contact (agency for Vellum)
-- ============================
INSERT INTO people (id, name, role, company_id, notes)
VALUES (
  'pe-15',
  'Shown Media',
  'Agency',
  'co-15',
  'Vellum deal came through Shown Media. QRT + Engagement campaign. $1,200 flat.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, company_id = EXCLUDED.company_id, notes = EXCLUDED.notes;

-- ============================
-- Vellum QRT Campaign - Deal
-- ============================
INSERT INTO deals (id, name, company_id, contact_id, pipeline, stage, type, priority, value, platforms, deliverables, terms, notes, jamey_uses_product, owner, created_at, last_activity_at, expected_close_date)
VALUES (
  'd-16',
  'Vellum QRT Campaign',
  'co-15',
  'pe-15',
  'content',
  'Terms Agreed',
  'QRT + Comment',
  'Medium',
  1200,
  ARRAY['X'],
  'QRT + Engagement on X',
  '$1,200 flat via Shown Media. Tentative launch Apr 21.',
  'Vellum = always-on personal AI assistant (persistent memory, email/Slack/browser integration). Campaign goal: drive early-access signups. ICP: founders, operators, AI-curious knowledge workers. Content direction: operator-to-operator, experiential, insight-driven.',
  false,
  'both',
  '2026-04-09',
  '2026-04-09',
  '2026-04-21'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, company_id = EXCLUDED.company_id, contact_id = EXCLUDED.contact_id,
  pipeline = EXCLUDED.pipeline, stage = EXCLUDED.stage, type = EXCLUDED.type, priority = EXCLUDED.priority,
  value = EXCLUDED.value, platforms = EXCLUDED.platforms,
  deliverables = EXCLUDED.deliverables, terms = EXCLUDED.terms, notes = EXCLUDED.notes,
  jamey_uses_product = EXCLUDED.jamey_uses_product, owner = EXCLUDED.owner,
  last_activity_at = EXCLUDED.last_activity_at, expected_close_date = EXCLUDED.expected_close_date;

-- ============================
-- Vellum Activities
-- ============================
INSERT INTO activities (id, type, title, deal_id, company_id, person_id, created_by, timestamp) VALUES
  ('a-32', 'email_received', 'Shown Media sent Vellum campaign - QRT + Engagement @ $1,200. Tentative Apr 21 launch.', 'd-16', 'co-15', 'pe-15', 'system', '2026-04-09T12:00:00Z'),
  ('a-33', 'note', 'Jamey confirmed - locking in for Vellum QRT campaign', 'd-16', 'co-15', NULL, 'justin', '2026-04-09T12:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================
-- Cash App Deliverable
-- ============================
INSERT INTO deliverables (id, deal_id, title, status, content_type, due_date, publish_date) VALUES (
  'del-cashapp-1',
  'd-8',
  'Bitcoin Day Sponsored Video - X post featuring Bitkey hardware',
  'Published',
  'video',
  '2026-04-07',
  '2026-04-07'
)
ON CONFLICT (id) DO NOTHING;
