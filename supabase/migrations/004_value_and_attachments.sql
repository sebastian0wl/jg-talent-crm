-- ══════════════════════════════════════════════════════════════════
-- 004_value_and_attachments.sql
-- 1. Consolidate value/closed_value into single value field
-- 2. Add file attachments system for briefs, contracts, etc.
-- ══════════════════════════════════════════════════════════════════

-- ── 1. DEAL VALUE: Single field + contracted_at timestamp ──

-- Add contracted_at to mark when the value became a real number
ALTER TABLE deals ADD COLUMN contracted_at timestamptz;

-- Migrate: if closed_value exists, use it as the canonical value and set contracted_at
UPDATE deals
SET value = closed_value, contracted_at = closed_at
WHERE closed_value IS NOT NULL;

-- Mark closed_value as deprecated (drop in future migration)
COMMENT ON COLUMN deals.closed_value IS 'DEPRECATED: Use value + contracted_at. Value is the single source of truth.';


-- ── 2. ATTACHMENTS: File uploads for deals ──

CREATE TABLE attachments (
  id text PRIMARY KEY,
  deal_id text REFERENCES deals(id) ON DELETE CASCADE,
  company_id text REFERENCES companies(id) ON DELETE SET NULL,

  -- What kind of file
  file_type text NOT NULL CHECK (file_type IN (
    'brief',        -- Project/creative brief from brand
    'contract',     -- Signed agreement
    'invoice',      -- Invoice sent by us
    'deliverable',  -- Final content files
    'proposal',     -- Proposal we sent
    'rate_card',    -- Rate card / pricing
    'other'         -- Catch-all
  )),

  -- File metadata
  file_name text NOT NULL,          -- Original filename
  file_size integer,                -- Bytes
  mime_type text,                   -- e.g. 'application/pdf'
  storage_path text NOT NULL,       -- Supabase Storage path
  public_url text,                  -- Public URL if applicable

  -- Context
  description text,
  uploaded_by text CHECK (uploaded_by IN ('justin', 'jamey', 'agent', 'system')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_attachments_deal ON attachments(deal_id);
CREATE INDEX idx_attachments_company ON attachments(company_id);
CREATE INDEX idx_attachments_type ON attachments(file_type);

-- Trigger
CREATE TRIGGER attachments_updated_at
  BEFORE UPDATE ON attachments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON attachments FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE attachments;
