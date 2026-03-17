-- Sprint 65 launch security: RLS + indexes + admin roles + hardening
-- =================================================================

-- 1. Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Owner can SELECT own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

-- Owner can INSERT own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Owner can UPDATE own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (user_id = auth.uid());

-- Owner can DELETE own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (user_id = auth.uid());

-- Published projects are publicly readable (for /i/[slug] viewer)
CREATE POLICY "Published projects are public"
  ON projects FOR SELECT
  USING (status = 'published');

-- Service role bypasses RLS (for admin, view counter, etc.)
CREATE POLICY "Service role full access projects"
  ON projects FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- 3. Unique constraint on orders.order_code (prevent duplicate payments)
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_code_unique ON orders(order_code);

-- 4. user_roles table for admin authorization (defense-in-depth)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Only service role can manage roles
CREATE POLICY "Service role manages roles"
  ON user_roles FOR ALL
  USING (auth.role() = 'service_role');

-- Users can read own roles (for client-side checks)
CREATE POLICY "Users can read own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Seed admin user (match ADMIN_EMAIL env var)
-- Run manually after first admin login:
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'admin@7app.online'
-- ON CONFLICT DO NOTHING;

-- 5. Fix increment_view_count search_path (empty = most secure)
CREATE OR REPLACE FUNCTION increment_view_count(
  p_project_id UUID,
  p_max_views INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_count INTEGER;
  reset_at TIMESTAMPTZ;
BEGIN
  SELECT view_count_reset_at INTO reset_at
  FROM public.projects WHERE id = p_project_id;

  IF reset_at IS NULL OR (now() - reset_at) > INTERVAL '30 days' THEN
    UPDATE public.projects
    SET view_count = 1, view_count_reset_at = now()
    WHERE id = p_project_id
    RETURNING view_count INTO new_count;
    RETURN new_count;
  END IF;

  UPDATE public.projects
  SET view_count = view_count + 1
  WHERE id = p_project_id AND view_count < p_max_views
  RETURNING view_count INTO new_count;

  IF new_count IS NULL THEN
    RETURN -1;
  END IF;

  RETURN new_count;
END;
$$;
