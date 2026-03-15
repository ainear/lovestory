import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendRsvpAlertEmail } from "@/server/services/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Service-role Supabase client for admin operations (e.g. auth.admin.getUserById).
 * Never expose this client to the browser.
 */
function createServiceRoleClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } },
    );
}

/**
 * POST /api/rsvp/notify
 * Called fire-and-forget after RSVP is inserted in rsvp_responses.
 * Looks up project owner email and sends them an alert.
 * Requires the caller to be authenticated.
 */
export async function POST(request: NextRequest) {
    try {
        // SEC-05: Rate limiting
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            "unknown";
        const rl = checkRateLimit(`rsvp-notify:${ip}`, { limit: 20, windowSec: 60 });
        if (!rl.allowed) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 },
            );
        }

        // SEC-05: Authentication check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { projectId, guestName, attending } = await request.json() as {
            projectId: string;
            guestName: string;
            attending: boolean;
        };

        if (!projectId || !guestName) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Get project info + owner id (use anon client — RLS handles visibility)
        const { data: project } = await supabase
            .from("projects")
            .select("id, title, user_id")
            .eq("id", projectId)
            .maybeSingle();

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // SEC-02: Use service-role client for admin auth operations
        const adminClient = createServiceRoleClient();
        const { data: ownerData } = await adminClient.auth.admin.getUserById(project.user_id);
        const ownerEmail = ownerData?.user?.email;

        if (!ownerEmail) {
            return NextResponse.json({ ok: false, reason: "No owner email" });
        }

        const ownerName = ownerData?.user?.user_metadata?.full_name
            || ownerEmail.split("@")[0];

        const status = attending ? "confirmed" : "declined";

        await sendRsvpAlertEmail(
            ownerEmail,
            ownerName,
            guestName,
            status,
            project.title || "Thiệp cưới",
        );

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[rsvp/notify]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
