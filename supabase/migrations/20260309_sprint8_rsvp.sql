-- Sprint 8: RSVP responses table for Canvas Invitation
-- Stores guest confirmations from the public /i/[slug] invitation page

CREATE TABLE IF NOT EXISTS rsvp_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT true,
    guest_count INTEGER NOT NULL DEFAULT 1,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by project
CREATE INDEX IF NOT EXISTS idx_rsvp_project_id ON rsvp_responses(project_id);

-- RLS: public can insert (guests fill form), owner can read
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit RSVP"
    ON rsvp_responses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Project owner can read RSVP"
    ON rsvp_responses FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );
