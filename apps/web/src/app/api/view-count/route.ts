/**
 * S17-B: View Count API Route (Next.js fallback / dev proxy)
 *
 * In production, the Cloudflare Worker at /api/view-count handles this directly.
 * This route is used in development and as an edge fallback.
 *
 * POST /api/view-count { projectId: string }
 * → { ok: true, currentViews: number, maxViews: number, ... }
 * → { error: "quota_exceeded", ... } with 402
 */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Deploy as Edge Function for low latency

// Plan quotas matching the Worker (single source of truth in plans config)
const PLAN_QUOTAS: Record<string, number> = {
  free: 300,
  basic: 10_000,
  premium: Infinity,
};

function monthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function POST(request: Request) {
  let body: { projectId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { projectId } = body;
  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  // ── In production: delegate to Cloudflare Worker ─────────────────────────
  const workerUrl = process.env.VIEW_COUNTER_WORKER_URL;
  if (workerUrl && process.env.NODE_ENV === "production") {
    const workerRes = await fetch(`${workerUrl}?projectId=${encodeURIComponent(projectId)}`, {
      method: "GET",
    });
    const data = await workerRes.json();
    return NextResponse.json(data, { status: workerRes.status });
  }

  // ── Dev fallback: use Supabase directly ───────────────────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const month = monthKey();

  // Fetch project plan
  const { data: project } = await supabase
    .from("projects")
    .select("plan")
    .eq("id", projectId)
    .maybeSingle();

  const plan = project?.plan ?? "free";
  const maxViews = PLAN_QUOTAS[plan] ?? PLAN_QUOTAS.free;

  // Fetch current monthly count
  const { data: counter } = await supabase
    .from("view_counts")
    .select("count")
    .eq("project_id", projectId)
    .eq("month", month)
    .maybeSingle();

  const currentViews = counter?.count ?? 0;

  if (currentViews >= maxViews) {
    return NextResponse.json(
      { error: "quota_exceeded", plan, currentViews, maxViews, month },
      { status: 402 },
    );
  }

  // Upsert count
  await supabase
    .from("view_counts")
    .upsert(
      { project_id: projectId, month, count: currentViews + 1 },
      { onConflict: "project_id,month" },
    );

  return NextResponse.json({
    ok: true,
    plan,
    currentViews: currentViews + 1,
    maxViews,
    month,
  });
}
