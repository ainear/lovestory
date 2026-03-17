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
  // Rate limit: 10 wishes per minute per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(`wishes:${ip}`, { limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu, vui lòng thử lại sau" },
      { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
    );
  }

  try {
    const body = await req.json();
    const { projectId, guestName, message, emoji, website } = body;

    // Honeypot: bots fill hidden "website" field
    if (website) {
      return NextResponse.json({ success: true, data: {} });
    }

    if (!projectId || !guestName || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Per-project rate limit: 100 wishes/hour per project
    const prl = checkRateLimit(`wish-proj:${projectId}`, {
      limit: 100,
      windowSec: 3600,
    });
    if (!prl.allowed) {
      return NextResponse.json(
        { error: "Quá nhiều lời chúc, vui lòng thử lại sau" },
        { status: 429, headers: { "Retry-After": String(prl.resetIn) } },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("wishes")
      .insert({
        project_id: projectId,
        guest_name: sanitize(guestName, 100),
        message: sanitize(message, 1000),
        emoji: sanitize(emoji || "❤️", 10),
      })
      .select()
      .single();

    if (error) {
      console.error("Wishes insert error:", error.message);
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

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ data: data || [] });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
