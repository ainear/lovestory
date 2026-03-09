import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendRsvpAlertEmail } from "@/server/services/email";

/**
 * POST /api/rsvp/notify
 * Called fire-and-forget after RSVP is inserted in rsvp_responses.
 * Looks up project owner email and sends them an alert.
 */
export async function POST(request: NextRequest) {
    try {
        const { projectId, guestName, attending } = await request.json() as {
            projectId: string;
            guestName: string;
            attending: boolean;
        };

        if (!projectId || !guestName) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const supabase = await createClient();

        // Get project info + owner id
        const { data: project } = await supabase
            .from("projects")
            .select("id, title, user_id")
            .eq("id", projectId)
            .maybeSingle();

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Get owner email from auth.users via admin API
        const { data: ownerData } = await supabase.auth.admin.getUserById(project.user_id);
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
