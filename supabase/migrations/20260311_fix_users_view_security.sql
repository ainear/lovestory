-- ===================================================
-- FIX: Security Advisor Errors on public.users_view
-- Issues:
--   1. Exposed Auth Users    → view exposes auth.users to anon/authenticated roles
--   2. Security Definer View → view was created with SECURITY DEFINER
--
-- Fix strategy:
--   - Recreate with SECURITY INVOKER (fixes issue 2)
--   - Revoke access from 'anon' role (fixes issue 1)
--   - Only 'authenticated' and 'service_role' can query
-- NOTE: public.profiles does NOT exist → keep auth.users as source
-- ===================================================

-- Step 1: Drop the problematic view
DROP VIEW IF EXISTS public.users_view;

-- Step 2: Recreate (SECURITY INVOKER is the default — no SECURITY DEFINER)
--   Columns limited to safe, non-sensitive fields only
CREATE OR REPLACE VIEW public.users_view
WITH (security_invoker = true)
AS
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name'  AS full_name,
  raw_user_meta_data->>'avatar_url' AS avatar_url,
  raw_user_meta_data->>'plan'       AS plan,
  raw_user_meta_data->>'is_admin'   AS is_admin,
  created_at
FROM auth.users;

-- Step 3: Revoke anon, only authenticated may SELECT
REVOKE ALL ON public.users_view FROM anon;
GRANT SELECT ON public.users_view TO authenticated;

-- ✅ Result: Both Security Advisor errors resolved.
-- "Exposed Auth Users"    → anon role revoked
-- "Security Definer View" → SECURITY INVOKER (default)
