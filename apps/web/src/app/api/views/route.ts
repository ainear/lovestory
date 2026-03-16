import { createClient as createServerClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    // Rate limit: 30 views per minute per IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const rl = checkRateLimit(`view:${ip}`, { limit: 30, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Atomic increment via RPC (same pattern as likes)
    const { data: views, error: rpcError } = await supabase.rpc(
      "increment_view_count",
      { p_slug: slug },
    );

    if (!rpcError) {
      return NextResponse.json({ success: true, views });
    }

    // Fallback: read-then-update if RPC doesn't exist yet
    console.error(
      "increment_view_count RPC failed, using fallback:",
      rpcError.message,
    );
    const { data: project } = await supabase
      .from("projects")
      .select("id, view_count")
      .eq("slug", slug)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await supabase
      .from("projects")
      .update({ view_count: (project.view_count || 0) + 1 })
      .eq("id", project.id);

    return NextResponse.json({
      success: true,
      views: (project.view_count || 0) + 1,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
