-- ===================================================
-- FIX: Supabase Security Advisor — 9 Warnings
-- Date: 2026-03-11
-- ===================================================

-- ─── 1. Function Search Path Mutable (2 warnings) ─────────────────────────
-- Functions without SET search_path are vulnerable to search_path injection.
-- Fix: add SET search_path = '' so function uses fully-qualified names only.

CREATE OR REPLACE FUNCTION increment_referral_clicks(ref_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''          -- ← FIX: pin search_path to empty
AS $$
BEGIN
    UPDATE public.referral_codes          -- must use fully-qualified name now
    SET clicks = clicks + 1
    WHERE code = ref_code;
END;
$$;

CREATE OR REPLACE FUNCTION increment_referral_conversions(ref_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''          -- ← FIX
AS $$
BEGIN
    UPDATE public.referral_codes
    SET conversions = conversions + 1
    WHERE code = ref_code;
END;
$$;

-- Re-grant permissions (unchanged from original)
GRANT EXECUTE ON FUNCTION increment_referral_clicks(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_referral_clicks(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_referral_conversions(TEXT) TO authenticated;

-- ─── 2. RLS Policy Always True (6 warnings) ───────────────────────────────
-- Tables: gifts, rsvp_responses, rsvps (x2), wishes (x2)
-- These tables allow public INSERT (invitation page: anyone can RSVP/wish/gift).
-- Supabase warns about WITH CHECK (true) on INSERT — intentional for public forms.
-- No code fix needed; these ARE by design. Mark as acknowledged below.

-- If you want to suppress the warning: add a comment to the policy names,
-- or accept via Security Advisor UI → mark as "Acknowledged".

-- Optional: tighten rsvps INSERT to only allow valid project_id (exists check)
-- Uncomment below to apply stricter policy:
/*
DROP POLICY IF EXISTS "Anyone can insert rsvp" ON rsvps;
DROP POLICY IF EXISTS "Public RSVP insert" ON rsvps;
CREATE POLICY "Public RSVP insert" ON rsvps
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM projects)   -- must be a real project
  );

DROP POLICY IF EXISTS "Anyone can insert wish" ON wishes;
DROP POLICY IF EXISTS "Public wish insert" ON wishes;
CREATE POLICY "Public wish insert" ON wishes
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM projects)
  );
*/

-- ─── 3. Leaked Password Protection Disabled (1 warning) ───────────────────
-- This is a Supabase Auth SETTING — cannot be fixed via SQL migration.
-- Must be enabled via Supabase Dashboard:
--   Authentication → Settings → Enable "Leaked password protection" toggle
-- ===================================================
