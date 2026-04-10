-- 009: Document ingestion pipeline
-- Add text extraction and AI analysis columns to attachments table
-- Enables: upload/URL → extract text → AI analysis → deal field suggestions

-- Extraction status tracking
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS extraction_status text
  DEFAULT 'pending'
  CHECK (extraction_status IN ('pending', 'extracting', 'done', 'failed', 'skipped'));

-- Extracted text content from the document
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS extracted_text text;

-- AI analysis JSON (deal field suggestions, summary, key terms)
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS ai_analysis jsonb;

-- Source type: was this a file upload or a URL attachment?
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS source_type text
  DEFAULT 'file'
  CHECK (source_type IN ('file', 'url'));

-- Index for querying documents that need extraction
CREATE INDEX IF NOT EXISTS idx_attachments_extraction_status
  ON attachments(extraction_status) WHERE extraction_status IN ('pending', 'extracting');
