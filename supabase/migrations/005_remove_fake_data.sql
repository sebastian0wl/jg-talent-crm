-- 005: Remove fake/mock deals and fix incorrect contacts
-- Removes: Flux (d-6), Block (d-8), Lovable (d-11)
-- Fixes: Higgsfield contact (pe-9), Grok contact (pe-5), Freepik contact (pe-10)

BEGIN;

-- ═══════════════════════════════════════════
-- 1. DELETE FLUX (d-6, co-6, pe-6)
-- ═══════════════════════════════════════════

-- Junction tables
DELETE FROM deal_contacts WHERE deal_id = 'd-6';
DELETE FROM activity_deals WHERE deal_id = 'd-6';
DELETE FROM activity_people WHERE activity_id IN (SELECT id FROM activities WHERE deal_id = 'd-6');
DELETE FROM entity_tags WHERE entity_id = 'd-6' OR entity_id = 'co-6' OR entity_id = 'pe-6';
DELETE FROM person_companies WHERE person_id = 'pe-6';

-- Attachments
DELETE FROM attachments WHERE deal_id = 'd-6';

-- Activities
DELETE FROM activities WHERE deal_id = 'd-6';

-- Tasks
DELETE FROM tasks WHERE deal_id = 'd-6';

-- Deliverables
DELETE FROM deliverables WHERE deal_id = 'd-6';

-- Deal
DELETE FROM deals WHERE id = 'd-6';

-- Person
DELETE FROM people WHERE id = 'pe-6';

-- Company (only if no other deals reference it)
DELETE FROM companies WHERE id = 'co-6'
  AND NOT EXISTS (SELECT 1 FROM deals WHERE company_id = 'co-6');


-- ═══════════════════════════════════════════
-- 2. DELETE BLOCK (d-8, co-8, pe-8)
-- ═══════════════════════════════════════════

DELETE FROM deal_contacts WHERE deal_id = 'd-8';
DELETE FROM activity_deals WHERE deal_id = 'd-8';
DELETE FROM activity_people WHERE activity_id IN (SELECT id FROM activities WHERE deal_id = 'd-8');
DELETE FROM entity_tags WHERE entity_id = 'd-8' OR entity_id = 'co-8' OR entity_id = 'pe-8';
DELETE FROM person_companies WHERE person_id = 'pe-8';

DELETE FROM attachments WHERE deal_id = 'd-8';
DELETE FROM activities WHERE deal_id = 'd-8';
DELETE FROM tasks WHERE deal_id = 'd-8';
DELETE FROM deliverables WHERE deal_id = 'd-8';
DELETE FROM deals WHERE id = 'd-8';
DELETE FROM people WHERE id = 'pe-8';
DELETE FROM companies WHERE id = 'co-8'
  AND NOT EXISTS (SELECT 1 FROM deals WHERE company_id = 'co-8');


-- ═══════════════════════════════════════════
-- 3. DELETE LOVABLE (d-11, co-11, pe-11) — if not already removed
-- ═══════════════════════════════════════════

DELETE FROM deal_contacts WHERE deal_id = 'd-11';
DELETE FROM activity_deals WHERE deal_id = 'd-11';
DELETE FROM activity_people WHERE activity_id IN (SELECT id FROM activities WHERE deal_id = 'd-11');
DELETE FROM entity_tags WHERE entity_id = 'd-11' OR entity_id = 'co-11' OR entity_id = 'pe-11';
DELETE FROM person_companies WHERE person_id = 'pe-11';

DELETE FROM attachments WHERE deal_id = 'd-11';
DELETE FROM activities WHERE deal_id = 'd-11';
DELETE FROM tasks WHERE deal_id = 'd-11';
DELETE FROM deliverables WHERE deal_id = 'd-11';
DELETE FROM deals WHERE id = 'd-11';
DELETE FROM people WHERE id = 'pe-11';
DELETE FROM companies WHERE id = 'co-11'
  AND NOT EXISTS (SELECT 1 FROM deals WHERE company_id = 'co-11');


-- ═══════════════════════════════════════════
-- 4. FIX HIGGSFIELD CONTACT (pe-9)
-- ═══════════════════════════════════════════

UPDATE people SET
  name = 'Alex Mashrabov',
  email = NULL,
  notes = 'Via Shown Media. Forbes 30u30, ex-Snap (Director of Gen AI), co-founded AI Factory (sold to Snap).'
WHERE id = 'pe-9';


-- ═══════════════════════════════════════════
-- 5. FIX GROK/XAI CONTACT (pe-5)
-- ═══════════════════════════════════════════

UPDATE people SET
  name = 'Unknown',
  email = NULL,
  notes = 'Contact unknown — need to identify real xAI marketing contact'
WHERE id = 'pe-5';


-- ═══════════════════════════════════════════
-- 6. FIX FREEPIK CONTACT (pe-10)
-- ═══════════════════════════════════════════

UPDATE people SET
  name = 'Unknown',
  email = NULL,
  notes = 'Contact unknown — need to identify real Freepik contact from Apr 9 meeting'
WHERE id = 'pe-10';


-- ═══════════════════════════════════════════
-- 7. FIX STALE STAGES (from earlier audit)
-- ═══════════════════════════════════════════

UPDATE deals SET stage = 'Delivered' WHERE id = 'd-9' AND stage = 'Invoiced';
UPDATE deals SET stage = 'Delivered' WHERE id = 'd-8' AND stage = 'Invoiced';

COMMIT;
