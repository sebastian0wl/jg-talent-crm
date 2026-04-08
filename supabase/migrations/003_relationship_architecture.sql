-- ══════════════════════════════════════════════════════════════════
-- 003_relationship_architecture.sql
-- CRM Architecture Upgrade: Proper relational model
-- Run AFTER 001 (schema) and 002 (seed data)
-- ══════════════════════════════════════════════════════════════════

-- ── 1. PERSON <-> COMPANY: Many-to-Many with employment history ──

CREATE TABLE person_companies (
  id text PRIMARY KEY,
  person_id text NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role text,
  is_primary boolean DEFAULT true,
  started_at date,
  ended_at date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(person_id, company_id)
);

CREATE INDEX idx_person_companies_person ON person_companies(person_id);
CREATE INDEX idx_person_companies_company ON person_companies(company_id);
CREATE INDEX idx_person_companies_primary ON person_companies(person_id) WHERE is_primary = true;

-- Migrate existing data
INSERT INTO person_companies (id, person_id, company_id, role, is_primary)
SELECT 'pc_' || id, id, company_id, role, true
FROM people WHERE company_id IS NOT NULL;

COMMENT ON COLUMN people.company_id IS 'DEPRECATED: Use person_companies table.';
COMMENT ON COLUMN people.role IS 'DEPRECATED: Use person_companies.role.';


-- ── 2. DEAL <-> PERSON: Many-to-Many with contact roles ──

CREATE TABLE deal_contacts (
  id text PRIMARY KEY,
  deal_id text NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  person_id text NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'contact'
    CHECK (role IN ('primary', 'decision_maker', 'creative_lead', 'finance', 'legal', 'contact')),
  is_primary boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, person_id)
);

CREATE INDEX idx_deal_contacts_deal ON deal_contacts(deal_id);
CREATE INDEX idx_deal_contacts_person ON deal_contacts(person_id);
CREATE INDEX idx_deal_contacts_primary ON deal_contacts(deal_id) WHERE is_primary = true;

-- Migrate existing contact_id data
INSERT INTO deal_contacts (id, deal_id, person_id, role, is_primary)
SELECT 'dc_' || id, id, contact_id, 'primary', true
FROM deals WHERE contact_id IS NOT NULL;

COMMENT ON COLUMN deals.contact_id IS 'DEPRECATED: Use deal_contacts table.';


-- ── 3. COMPANY <-> COMPANY: Relationships ──

CREATE TABLE company_relationships (
  id text PRIMARY KEY,
  parent_company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  child_company_id text NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  relationship_type text NOT NULL
    CHECK (relationship_type IN ('parent_subsidiary', 'agency_client', 'partner', 'reseller')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_company_id, child_company_id, relationship_type),
  CHECK (parent_company_id != child_company_id)
);

CREATE INDEX idx_company_rel_parent ON company_relationships(parent_company_id);
CREATE INDEX idx_company_rel_child ON company_relationships(child_company_id);

-- Seed: Kudos Narratives is agency for ElevenLabs
INSERT INTO company_relationships (id, parent_company_id, child_company_id, relationship_type, notes)
VALUES ('cr-1', 'co-3', 'co-3', 'agency_client', 'Kudos Narratives represents ElevenLabs for creator partnerships');
-- Note: We'd need a separate company for Kudos Narratives to model this properly.
-- For now this is a placeholder — Konstantin's notes field captures the relationship.
DELETE FROM company_relationships WHERE id = 'cr-1'; -- remove placeholder


-- ── 4. ACTIVITY <-> ENTITIES: Many-to-Many ──

CREATE TABLE activity_people (
  activity_id text NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  person_id text NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, person_id)
);

CREATE TABLE activity_deals (
  activity_id text NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  deal_id text NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, deal_id)
);

CREATE INDEX idx_activity_people_person ON activity_people(person_id);
CREATE INDEX idx_activity_deals_deal ON activity_deals(deal_id);

-- Migrate existing single-FK data
INSERT INTO activity_people (activity_id, person_id)
SELECT id, person_id FROM activities WHERE person_id IS NOT NULL;

INSERT INTO activity_deals (activity_id, deal_id)
SELECT id, deal_id FROM activities WHERE deal_id IS NOT NULL;

COMMENT ON COLUMN activities.deal_id IS 'DEPRECATED: Use activity_deals table.';
COMMENT ON COLUMN activities.person_id IS 'DEPRECATED: Use activity_people table.';


-- ── 5. TASKS: Add person_id ──

ALTER TABLE tasks ADD COLUMN person_id text REFERENCES people(id);
CREATE INDEX idx_tasks_person ON tasks(person_id);


-- ── 6. EMAIL MESSAGES: Multi-recipient + entity links ──

ALTER TABLE email_messages ADD COLUMN to_addrs text[] DEFAULT '{}';
ALTER TABLE email_messages ADD COLUMN cc_addrs text[] DEFAULT '{}';
ALTER TABLE email_messages ADD COLUMN company_id text REFERENCES companies(id);
ALTER TABLE email_messages ADD COLUMN person_id text REFERENCES people(id);

UPDATE email_messages SET to_addrs = ARRAY[to_addr] WHERE to_addr IS NOT NULL;

COMMENT ON COLUMN email_messages.to_addr IS 'DEPRECATED: Use to_addrs array.';

CREATE INDEX idx_email_messages_company ON email_messages(company_id);
CREATE INDEX idx_email_messages_person ON email_messages(person_id);


-- ── 7. DEALS: Add lost_reason + currency ──

ALTER TABLE deals ADD COLUMN lost_reason text;
ALTER TABLE deals ADD COLUMN currency text DEFAULT 'USD';


-- ── 8. COMPANIES: Add type + enrichment ──

ALTER TABLE companies ADD COLUMN company_type text
  CHECK (company_type IN ('brand', 'agency', 'platform', 'media', 'other'));
ALTER TABLE companies ADD COLUMN website text;
ALTER TABLE companies ADD COLUMN linkedin_url text;
ALTER TABLE companies ADD COLUMN size_range text
  CHECK (size_range IN ('1-10', '11-50', '51-200', '201-1000', '1001-5000', '5000+'));

-- Set types for existing companies
UPDATE companies SET company_type = 'platform' WHERE id IN ('co-2', 'co-6', 'co-7', 'co-10', 'co-11');
UPDATE companies SET company_type = 'brand' WHERE id IN ('co-1', 'co-3', 'co-5', 'co-8', 'co-9');
UPDATE companies SET company_type = 'platform' WHERE id IN ('co-12', 'co-13', 'co-14');
UPDATE companies SET company_type = 'other' WHERE id = 'co-4';


-- ── 9. PEOPLE: Add enrichment fields ──

ALTER TABLE people ADD COLUMN phone text;
ALTER TABLE people ADD COLUMN linkedin_url text;
ALTER TABLE people ADD COLUMN preferred_channel text
  CHECK (preferred_channel IN ('email', 'phone', 'linkedin', 'twitter', 'text'));


-- ── 10. TAGS: Flexible tagging system ──

CREATE TABLE tags (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  color text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE entity_tags (
  tag_id text NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('company', 'person', 'deal')),
  entity_id text NOT NULL,
  PRIMARY KEY (tag_id, entity_type, entity_id)
);

CREATE INDEX idx_entity_tags_entity ON entity_tags(entity_type, entity_id);


-- ── 11. Triggers + RLS for new tables ──

CREATE TRIGGER person_companies_updated_at
  BEFORE UPDATE ON person_companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE person_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON person_companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON deal_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON company_relationships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activity_people FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activity_deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON entity_tags FOR ALL USING (true) WITH CHECK (true);

-- ── Realtime for new junction tables ──
ALTER PUBLICATION supabase_realtime ADD TABLE deal_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_people;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_deals;
