-- Sprint 11: Supabase RPC functions for referral click/conversion tracking
-- Called from /api/referral/track

-- Safely increment click counter (atomic, avoids race conditions)
CREATE OR REPLACE FUNCTION increment_referral_clicks(ref_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE referral_codes
    SET clicks = clicks + 1
    WHERE code = ref_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely increment conversion counter
CREATE OR REPLACE FUNCTION increment_referral_conversions(ref_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE referral_codes
    SET conversions = conversions + 1
    WHERE code = ref_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon role (click tracking is public, no auth needed)
GRANT EXECUTE ON FUNCTION increment_referral_clicks(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_referral_clicks(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_referral_conversions(TEXT) TO authenticated;
