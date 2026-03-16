import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { PLANS, PlanId } from "@/config/plans";

function getSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.slug as string | undefined;
    const projectId = body.projectId as string | undefined;

    if (!slug && !projectId) {
      return NextResponse.json(
        { error: "Missing slug or projectId" },
        { status: 400 },
      );
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

    const supabase = getSupabase();

    // 1. Get project
    const query = supabase
      .from("projects")
      .select("id, user_id, view_count, view_count_reset_at");

    const { data: project, error: projectError } = slug
      ? await query.eq("slug", slug).single()
      : await query.eq("id", projectId).single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Get project owner's subscription plan
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", project.user_id)
      .single();

    const planId: PlanId = (subscription?.plan as PlanId) || "free";
    const planConfig = PLANS[planId] ?? PLANS.free;
    const maxViews = planConfig.maxViewsPerMonth;

    // 3. Atomic increment via SQL function (handles reset + limit check)
    // The SQL function computes reset eligibility internally — no app-side flag
    const { data: updated, error: rpcError } = await supabase.rpc(
      "increment_view_count",
      {
        p_project_id: project.id,
        p_max_views: maxViews,
      },
    );

    if (rpcError) {
      console.error("[Views API] RPC error:", rpcError.message);
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // RPC returns new count (>= 1), or -1 if limit exceeded
    const allowed =
      typeof updated === "number" && updated >= 0 && updated <= maxViews;
    const currentCount = project.view_count ?? 0;

    return NextResponse.json({
      success: allowed,
      allowed,
      views: allowed ? updated : currentCount,
      limit: maxViews,
      plan: planId,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
