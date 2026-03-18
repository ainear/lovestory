-- Sprint 11: Commission & Referral Payouts Schema
-- Creates referral_payouts table + indexes + RLS policies
-- Tracks commissions earned by referrers when a referred user purchases a plan

-- ─── 1. Referral payouts table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referral_payouts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  plan          TEXT NOT NULL CHECK (plan IN ('basic', 'premium')),
  amount_vnd    INT  NOT NULL DEFAULT 0,   -- commission in VND (e.g. 50000 = 50k)
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  paid_at       TIMESTAMPTZ,
  note          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_referral_payouts_referrer ON referral_payouts(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_status   ON referral_payouts(status);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_code     ON referral_payouts(referral_code);

-- ─── 3. RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;

-- Referrers can see their own payouts
CREATE POLICY IF NOT EXISTS "referral_payouts_select_own" ON referral_payouts
  FOR SELECT USING (auth.uid() = referrer_id);

-- Only service_role can insert/update/delete (payouts are created by backend only)
CREATE POLICY IF NOT EXISTS "referral_payouts_service_only" ON referral_payouts
  FOR ALL USING (
    (SELECT rolname FROM pg_roles WHERE oid = current_user::regrole) = 'service_role'
  );

-- ─── 4. Commission view for dashboard (per referrer) ──────────────────────────
CREATE OR REPLACE VIEW my_commission_summary AS
SELECT
  referrer_id,
  COUNT(*)                                    AS total_referrals,
  SUM(amount_vnd)                             AS total_earned_vnd,
  SUM(CASE WHEN status = 'paid' THEN amount_vnd ELSE 0 END) AS paid_vnd,
  SUM(CASE WHEN status = 'pending' THEN amount_vnd ELSE 0 END) AS pending_vnd,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_count,
  COUNT(CASE WHEN status = 'paid' THEN 1 END)     AS paid_count
FROM referral_payouts
WHERE referrer_id = auth.uid()
GROUP BY referrer_id;

-- RLS on view: users see only their rows
ALTER VIEW my_commission_summary OWNER TO authenticated;

COMMENT ON TABLE referral_payouts IS 'Tracks affiliate commission payouts for referrers. Admin sets status, paid_at when paying out.';
