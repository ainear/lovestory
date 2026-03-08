-- Sprint 6: Editor UX — particle_effect + font_family columns
-- Date: 2026-03-08

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS particle_effect TEXT DEFAULT 'petals',
    ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'serif';
