-- ===================================================
-- LoveStory — FIX ALL MISSING Tables & Columns
-- Run this ONCE in Supabase SQL Editor
-- https://supabase.com/dashboard/project/ujawiwotekelzgbxiauz/sql/new
-- ===================================================

-- ─── 1. PROJECTS table — add ALL missing columns ───
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS wedding_time TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS story TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS message TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_account TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_owner TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS groom_parent_names TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bride_parent_names TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS photos TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS music_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS music_name TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS groom_phone TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- ─── 2. RSVPS table (used by /api/rsvp, dashboard, analytics) ───
CREATE TABLE IF NOT EXISTS rsvps (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    guest_name   TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'confirmed'
                 CHECK (status IN ('confirmed', 'declined', 'maybe')),
    guest_count  INTEGER NOT NULL DEFAULT 1,
    phone        TEXT DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_project ON rsvps(project_id);

-- RLS for rsvps (public insert, owner read)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can insert RSVP (public invitation page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert rsvp') THEN
    CREATE POLICY "Anyone can insert rsvp" ON rsvps FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Anyone can read rsvps (for display on invitation page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read rsvps') THEN
    CREATE POLICY "Anyone can read rsvps" ON rsvps FOR SELECT USING (true);
  END IF;
END $$;

-- Service role full access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access rsvps') THEN
    CREATE POLICY "Service role full access rsvps" ON rsvps FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ─── 3. WISHES table (used by /api/wishes, dashboard, analytics) ───
CREATE TABLE IF NOT EXISTS wishes (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
    guest_name   TEXT NOT NULL,
    message      TEXT NOT NULL,
    emoji        TEXT DEFAULT '❤️',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishes_project ON wishes(project_id);

-- RLS for wishes
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert wish') THEN
    CREATE POLICY "Anyone can insert wish" ON wishes FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read wishes') THEN
    CREATE POLICY "Anyone can read wishes" ON wishes FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access wishes') THEN
    CREATE POLICY "Service role full access wishes" ON wishes FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ─── 4. ORDERS table (used by /api/orders, /api/webhook/sepay) ───
CREATE TABLE IF NOT EXISTS orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES auth.users(id),
    plan             TEXT NOT NULL DEFAULT 'basic',
    amount           INTEGER NOT NULL DEFAULT 0,
    order_code       TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
    payment_method   TEXT DEFAULT 'sepay',
    sepay_transaction_id TEXT,
    paid_at          TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own orders') THEN
    CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own orders') THEN
    CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access orders') THEN
    CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ===================================================
-- ✅ ALL DONE — Verify with:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' ORDER BY ordinal_position;
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- ===================================================
