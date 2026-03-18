import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /r/[code] — Referral redirect with click tracking
 *
 * 1. Look up referral_codes table for this code
 * 2. Increment clicks (fire-and-forget, never blocks redirect)
 * 3. Redirect to /login?ref=referral&code={code}
 * 4. Unknown/invalid codes → redirect to /login (soft fail, never 500)
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> },
) {
    const { code } = await params;

    if (!code || code.length > 64) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Click tracking — fire-and-forget (use service role key for write)
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        const { data } = await supabase
            .from("referral_codes")
            .select("id, clicks")
            .eq("code", code.toUpperCase())
            .maybeSingle();

        if (data) {
            supabase
                .from("referral_codes")
                .update({ clicks: (data.clicks || 0) + 1, last_clicked_at: new Date().toISOString() })
                .eq("id", data.id)
                .then(() => {});
        }
    } catch {
        // Soft fail — always redirect regardless of DB errors
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("ref", "referral");
    loginUrl.searchParams.set("code", code.toUpperCase());
    return NextResponse.redirect(loginUrl);
}
