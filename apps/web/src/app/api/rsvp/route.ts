import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

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
    const { projectId, guestName, status, guestCount, phone } = body;

    if (!projectId || !guestName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rsvp_responses")
      .insert({
        project_id: projectId,
        guest_name: sanitize(guestName, 100),
        attending: status !== "declined", // attending=true for confirmed/maybe, false only for declined
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

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
