-- Sprint 65: View counting for plan limits
-- view_count already exists from earlier migrations; add reset timestamp
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count_reset_at TIMESTAMPTZ DEFAULT now();

-- Atomic view count increment (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_view_count(
  p_project_id UUID,
  p_max_views INTEGER,
  p_needs_reset BOOLEAN
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF p_needs_reset THEN
    UPDATE projects
    SET view_count = 1, view_count_reset_at = now()
    WHERE id = p_project_id
    RETURNING view_count INTO new_count;
    RETURN new_count;
  END IF;

  UPDATE projects
  SET view_count = view_count + 1
  WHERE id = p_project_id AND view_count < p_max_views
  RETURNING view_count INTO new_count;

  IF new_count IS NULL THEN
    RETURN -1; -- limit exceeded
  END IF;

  RETURN new_count;
END;
$$;
