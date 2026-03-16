import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { PLANS, PlanId } from "@/config/plans";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

    // 3. Atomic increment with reset check and limit enforcement
    // Single SQL statement prevents race conditions
    const resetAt = project.view_count_reset_at
      ? new Date(project.view_count_reset_at).getTime()
      : 0;
    const needsReset = Date.now() - resetAt > THIRTY_DAYS_MS;

    const currentCount: number = needsReset ? 0 : (project.view_count ?? 0);

    // 4. If at or over limit, return not allowed
    if (currentCount >= maxViews) {
      return NextResponse.json({
        allowed: false,
        limit: maxViews,
        current: currentCount,
        plan: planId,
      });
    }

    // 5. Atomic increment via SQL to prevent race conditions
    const { data: updated } = await supabase.rpc("increment_view_count", {
      p_project_id: project.id,
      p_max_views: maxViews,
      p_needs_reset: needsReset,
    });

    // Fallback: if RPC doesn't exist, use regular update
    if (updated === null || updated === undefined) {
      const newCount = currentCount + 1;
      const updatePayload: Record<string, unknown> = {
        view_count: newCount,
      };
      if (needsReset) {
        updatePayload.view_count_reset_at = new Date().toISOString();
      }
      await supabase
        .from("projects")
        .update(updatePayload)
        .eq("id", project.id);

      return NextResponse.json({
        success: true,
        allowed: true,
        views: newCount,
        limit: maxViews,
        plan: planId,
      });
    }

    // RPC returns new count, or -1 if limit exceeded
    const allowed = updated >= 0 && updated <= maxViews;
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
