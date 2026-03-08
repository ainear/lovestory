-- Sprint 5: Referral System DB Schema
-- Date: 2026-03-08

-- ── Referral codes table ──
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,  -- e.g. "JOHN2025"
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    commission_earned DECIMAL(10,2) DEFAULT 0,  -- VND accumulated
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Add referrer to users table ──
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- ── Auto-generate referral code on user create ──
CREATE OR REPLACE FUNCTION generate_referral_code(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    base_code TEXT;
    final_code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Take first 6 chars of email prefix + random 3 digits
    base_code := UPPER(SUBSTRING(SPLIT_PART(user_email, '@', 1) FROM 1 FOR 5));
    final_code := base_code || LPAD(FLOOR(RANDOM() * 999)::TEXT, 3, '0');
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM referral_codes WHERE code = final_code) AND counter < 10 LOOP
        final_code := base_code || LPAD(FLOOR(RANDOM() * 999)::TEXT, 3, '0');
        counter := counter + 1;
    END LOOP;
    
    RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- ── RLS ──
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Users can read their own referral code
CREATE POLICY "User reads own referral code" ON referral_codes
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update (managed by API)
CREATE POLICY "Service role manages referrals" ON referral_codes
    FOR ALL USING (auth.role() = 'service_role');

-- ── Index for quick code lookup ──
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
