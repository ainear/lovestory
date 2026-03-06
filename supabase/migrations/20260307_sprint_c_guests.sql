-- ===================================================
-- LoveStory Sprint C — Guests Table Migration
-- Run this in Supabase SQL Editor
-- ===================================================

CREATE TABLE IF NOT EXISTS guests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES auth.users(id),
    name         TEXT NOT NULL,
    email        TEXT,
    phone        TEXT,
    status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'invited', 'confirmed', 'declined')),
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guests_user ON guests(user_id);
CREATE INDEX IF NOT EXISTS idx_guests_project ON guests(project_id);

-- RLS for guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own guests" ON guests
    FOR ALL USING (user_id = auth.uid());

-- ===================================================
-- ✅ Migration complete
-- Verify: SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'guests';
-- ===================================================
