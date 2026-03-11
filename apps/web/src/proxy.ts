import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
    const response = await updateSession(request);

    // Security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-DNS-Prefetch-Control", "on");
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    // ── Referral click tracking — Sprint 11 ──
    // When a user arrives with /?ref=CODE, save code in cookie (30 days)
    // and call the tracking API if not already counted in this session
    const { searchParams } = new URL(request.url);
    const refCode = searchParams.get("ref");

    if (refCode && refCode.match(/^[A-Z0-9]{6,12}$/)) {
        const existingRef = request.cookies.get("ref_code")?.value;

        // Only set + track if this is a new ref code for this browser
        if (!existingRef || existingRef !== refCode) {
            response.cookies.set("ref_code", refCode, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            });

            // Fire-and-forget: track click in background
            // We use NextResponse.next() so we don't block the user request
            const trackUrl = new URL("/api/referral/track", request.url);
            fetch(trackUrl.toString(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: refCode, type: "click" }),
            }).catch(() => { }); // silent — never block user nav
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
