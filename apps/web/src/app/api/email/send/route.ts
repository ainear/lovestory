import { NextRequest, NextResponse } from "next/server";
import {
    sendWelcomeEmail,
    sendVideoReadyEmail,
    sendPaymentConfirmedEmail,
    sendRsvpAlertEmail,
} from "@/server/services/email";

/**
 * POST /api/email/send
 * Internal email dispatch endpoint.
 * Accepts a type-safe payload and routes to the correct template.
 */
export async function POST(req: NextRequest) {
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
