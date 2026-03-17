import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendRsvpAlertEmail } from "@/server/services/email";

/** Strip HTML tags & trim to prevent XSS */
function sanitize(str: string, maxLen = 500): string {
  return str
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  // Rate limit: 10 RSVPs per minute per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(`rsvp:${ip}`, { limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu, vui lòng thử lại sau" },
      { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
    );
  }

  try {
    const body = await req.json();
    const { projectId, guestName, status, guestCount, phone, website } = body;

    // Honeypot: bots fill hidden "website" field
    if (website) {
      return NextResponse.json({ success: true, data: {} });
    }

    if (!projectId || !guestName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Per-project rate limit: 50 RSVPs/hour per project (prevents mass spam)
    const prl = checkRateLimit(`rsvp-proj:${projectId}`, {
      limit: 50,
      windowSec: 3600,
    });
    if (!prl.allowed) {
      return NextResponse.json(
        { error: "Quá nhiều RSVP, vui lòng thử lại sau" },
        { status: 429, headers: { "Retry-After": String(prl.resetIn) } },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rsvp_responses")
      .insert({
        project_id: projectId,
        guest_name: sanitize(guestName, 100),
        attending: status !== "declined",
        guest_count: Math.min(Math.max(1, Number(guestCount) || 1), 50),
        note: sanitize(phone || "", 20),
      })
      .select()
      .single();

    if (error) {
      console.error("RSVP insert error:", error.message);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    // ── Fire-and-forget: notify owner via email ────────────────────────────────
    // Non-blocking: if email fails, RSVP is still saved successfully (best-effort)
    void (async () => {
      try {
        // 1. Get project owner
        const { data: project } = await supabase
          .from("projects")
          .select("user_id, title")
          .eq("id", projectId)
          .single();
        if (!project?.user_id) return;

        // 2. Get owner email from Supabase Auth
        const { data: { user } } = await supabase.auth.admin.getUserById(project.user_id);
        if (!user?.email) return;

        // 3. Map request status to email status type
        const emailStatus =
          status === "declined" ? "declined"
          : status === "maybe"   ? "maybe"
          : "confirmed";

        // 4. Send notification email
        await sendRsvpAlertEmail(
          user.email,
          user.user_metadata?.full_name || "Bạn",
          sanitize(guestName, 100),
          emailStatus as "confirmed" | "declined" | "maybe",
          project.title || "thiệp cưới của bạn",
        );
      } catch (emailErr) {
        // Non-fatal: log but don't surface to guest
        console.error("[RSVP email] Non-critical error:", emailErr);
      }
    })();

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
