import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/referral/track
// {code: string, type: "click" | "conversion"}
// click — called by middleware when /?ref=CODE is visited (no auth required)
// conversion — called after signup (auth required)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { code?: string; type?: string };
        const { code, type } = body;

        if (!code || typeof code !== "string" || !code.match(/^[A-Z0-9]{4,16}$/)) {
            return NextResponse.json({ error: "Invalid code" }, { status: 400 });
        }
        if (type !== "click" && type !== "conversion") {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const supabase = await createClient();

        if (type === "click") {
            // Atomic increment via RPC — no auth needed, anyone can click
            await supabase.rpc("increment_referral_clicks", { ref_code: code });
            return NextResponse.json({ ok: true });
        }

        if (type === "conversion") {
            // Only authenticated users can trigger conversions
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            await supabase.rpc("increment_referral_conversions", { ref_code: code });
            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ error: "Unhandled" }, { status: 400 });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
