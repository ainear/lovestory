-- Sprint 65: View counting for plan limits
-- view_count already exists from earlier migrations; add reset timestamp
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count_reset_at TIMESTAMPTZ DEFAULT now();
