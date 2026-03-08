-- Sprint 7: Add canvas_json column for visual editor
-- Backward-compatible: NULL means use legacy form-based editor

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS canvas_json JSONB DEFAULT NULL;

COMMENT ON COLUMN projects.canvas_json IS
    'JSON blob for visual canvas editor (DOM-based Canva-style). NULL = use legacy form-based invitation.';
