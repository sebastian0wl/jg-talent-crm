-- 008: Add education pipeline + recategorize Maven deal + Event Sponsorship type

-- Expand pipeline CHECK constraint to include 'education'
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_pipeline_check;
ALTER TABLE deals ADD CONSTRAINT deals_pipeline_check
  CHECK (pipeline IN ('content', 'partnership', 'service', 'education'));

-- Recategorize Maven workshop from service -> education
UPDATE deals
SET pipeline = 'education', stage = 'Curriculum Design'
WHERE id = 'd-12';

-- Recategorize sponsor deals from Brand Ambassador -> Event Sponsorship
UPDATE deals SET type = 'Event Sponsorship' WHERE id IN ('d-13', 'd-14', 'd-15');
