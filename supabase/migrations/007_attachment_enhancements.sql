-- 007: Attachment enhancements
-- 1. Make storage_path nullable (for URL-only attachments)
-- 2. Expand file_type CHECK to include meeting_transcript and notes
-- 3. Add description column if missing

-- Make storage_path nullable
ALTER TABLE attachments ALTER COLUMN storage_path DROP NOT NULL;

-- Drop and re-create the file_type CHECK constraint to include new types
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_file_type_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_file_type_check
  CHECK (file_type IN ('brief', 'contract', 'invoice', 'deliverable', 'proposal', 'rate_card', 'meeting_transcript', 'notes', 'other'));

-- Ensure description column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attachments' AND column_name = 'description'
  ) THEN
    ALTER TABLE attachments ADD COLUMN description text;
  END IF;
END $$;
