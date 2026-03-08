-- Sprint 5: Referral System DB Schema (FIXED)
-- Date: 2026-03-08
-- Fix: project uses auth.users directly (no public.users table)

-- ── Referral codes table ──
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,  -- e.g. "JOHN001"
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    commission_earned DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Add referral tracking to projects table (already exists) ──
-- Store who referred this user via the project creator's metadata
ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- ── RLS ──
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Users can read their own referral code
CREATE POLICY "User reads own referral code" ON referral_codes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own referral code
CREATE POLICY "User inserts own referral code" ON referral_codes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Index for quick code lookup ──
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
