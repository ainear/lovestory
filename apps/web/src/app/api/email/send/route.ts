import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
    sendWelcomeEmail,
    sendVideoReadyEmail,
    sendPaymentConfirmedEmail,
    sendRsvpAlertEmail,
} from "@/server/services/email";

// Simple in-memory rate limiter (per IP, resets on cold start)
// For production scale, replace with Redis/Upstash
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max 5 email sends per window
const RATE_WINDOW_MS = 60_000; // 1 minute window

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    entry.count += 1;
    return entry.count > RATE_LIMIT;
}

/**
 * POST /api/email/send
 * Internal email dispatch — requires authenticated user session.
 * Rate limited: 5 requests/minute per IP.
 */
export async function POST(req: NextRequest) {
    // ── Auth guard: must be logged-in user ──
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Rate limit by IP ──
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        ?? req.headers.get("x-real-ip")
        ?? "unknown";
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please wait before sending more emails." },
            { status: 429 },
        );
    }

    try {
        const body = await req.json();
        const { type, to, payload } = body as {
            type: string;
            to: string;
            payload: Record<string, string>;
        };

        if (!to || !type) {
            return NextResponse.json({ error: "Missing `to` or `type`" }, { status: 400 });
        }

        // Extra guard: only allow sending to the authenticated user's own email
        // or allow if user is admin (can be expanded later)
        // This prevents using this endpoint to send spam to arbitrary addresses
        if (to !== user.email) {
            // Allow internal system emails (rsvp-alert goes to project owner)
            const allowedInternalTypes = ["rsvp-alert"];
            if (!allowedInternalTypes.includes(type)) {
                return NextResponse.json(
                    { error: "Can only send emails to your own account" },
                    { status: 403 },
                );
            }
        }

        switch (type) {
            case "welcome":
                await sendWelcomeEmail(to, payload.name || "bạn");
                break;

            case "video-ready":
                await sendVideoReadyEmail(
                    to,
                    payload.name || "bạn",
                    payload.videoUrl || "",
                    payload.thumbnailUrl || "",
                );
                break;

            case "payment-confirmed":
                await sendPaymentConfirmedEmail(
                    to,
                    payload.name || "bạn",
                    payload.plan || "basic",
                );
                break;

            case "rsvp-alert":
                await sendRsvpAlertEmail(
                    to,
                    payload.ownerName || "bạn",
                    payload.guestName || "Khách mời",
                    (payload.status as "confirmed" | "declined" | "maybe") || "confirmed",
                    payload.projectTitle || "Thiệp cưới",
                );
                break;

            default:
                return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
        }

        return NextResponse.json({ success: true, type, to });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[Email API] Error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
