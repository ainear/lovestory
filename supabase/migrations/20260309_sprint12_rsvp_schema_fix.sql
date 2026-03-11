-- Sprint 12: rsvp_responses schema verification & hardening
-- This migration is idempotent (safe to run multiple times)
-- Confirms: rsvp_responses uses attending (BOOL) as the RSVP status field

-- Ensure note column exists (some older schemas may have 'phone' instead)
ALTER TABLE rsvp_responses ADD COLUMN IF NOT EXISTS note TEXT;

-- Ensure guest_count has a default to avoid null inserts
ALTER TABLE rsvp_responses ALTER COLUMN guest_count SET DEFAULT 1;

-- Performance: ensure project_id index exists
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_project_id ON rsvp_responses(project_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_created ON rsvp_responses(created_at DESC);

-- Ensure RLS is enabled
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Recreate policies safely
DO $$ BEGIN
    -- Anyone can submit RSVP (guests on public invitation page)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename='rsvp_responses' AND policyname='Anyone can submit RSVP'
    ) THEN
        CREATE POLICY "Anyone can submit RSVP"
            ON rsvp_responses FOR INSERT
            WITH CHECK (true);
    END IF;

    -- Only project owner can read their RSVPs
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename='rsvp_responses' AND policyname='Project owner can read RSVP'
    ) THEN
        CREATE POLICY "Project owner can read RSVP"
            ON rsvp_responses FOR SELECT
            USING (
                project_id IN (
                    SELECT id FROM projects WHERE user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- Add view_count default to projects if not set
ALTER TABLE projects ALTER COLUMN view_count SET DEFAULT 0;

-- Grant anon to insert RSVP (needed for unauthenticated guests)
GRANT INSERT ON rsvp_responses TO anon;
GRANT SELECT ON rsvp_responses TO authenticated;
