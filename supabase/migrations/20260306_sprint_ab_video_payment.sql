-- ===================================================
-- LoveStory Sprint A+B — Database Migration
-- Run this in Supabase SQL Editor
-- ===================================================

-- 1. Videos table (AI Video Pipeline)
CREATE TABLE IF NOT EXISTS videos (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES auth.users(id),
    project_id    UUID,
    template_preset TEXT NOT NULL DEFAULT 'cinematic',
    config        JSONB NOT NULL DEFAULT '{}',
    status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'queued', 'processing', 'encoding', 'complete', 'failed')),
    progress      INTEGER NOT NULL DEFAULT 0,
    job_id        TEXT,
    error_message TEXT,
    render_duration_ms INTEGER,
    preview_url   TEXT,
    output_url    TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    resolution    TEXT NOT NULL DEFAULT '1080p'
                  CHECK (resolution IN ('720p', '1080p', '4k')),
    has_watermark BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_videos_user ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_project ON videos(project_id);

-- RLS for videos
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own videos" ON videos
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own videos" ON videos
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role full access videos" ON videos
    FOR ALL USING (auth.role() = 'service_role');

-- 2. Subscriptions table (SePay Payment)
CREATE TABLE IF NOT EXISTS subscriptions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    plan        TEXT NOT NULL DEFAULT 'free'
                CHECK (plan IN ('free', 'basic', 'premium')),
    order_id    UUID,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role full access subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- 3. Ensure orders table has all needed columns
-- (orders table should already exist, but add missing columns)
DO $$
BEGIN
    -- Add payment_method if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'sepay';
    END IF;

    -- Add sepay_transaction_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'sepay_transaction_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN sepay_transaction_id TEXT;
    END IF;

    -- Add paid_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'paid_at'
    ) THEN
        ALTER TABLE orders ADD COLUMN paid_at TIMESTAMPTZ;
    END IF;
END $$;

-- 4. Create Supabase Storage bucket for media (videos)
-- NOTE: Run this via Supabase Dashboard > Storage > New Bucket
-- Bucket name: "media"
-- Public: true

-- ===================================================
-- ✅ Migration complete
-- Verify: SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- ===================================================
