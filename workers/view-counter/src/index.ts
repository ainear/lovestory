/**
 * S17-B: view-counter Cloudflare Worker (T033)
 *
 * Tracks public invitation page views with KV storage.
 * Enforces view quota per plan:  Free 300/mo, Basic 10k/mo, Premium unlimited
 */

export interface Env {
  VIEW_KV: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface PlanQuota {
  maxViews: number;
}

const PLAN_QUOTAS: Record<string, PlanQuota> = {
  free:    { maxViews: 300 },
  basic:   { maxViews: 10_000 },
  premium: { maxViews: Infinity },
};

/** Returns current month key: "2026-03" */
function monthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Fetch project plan from Supabase (cached 1min in KV) */
async function getProjectPlan(
  projectId: string,
  env: Env,
): Promise<string> {
  const cacheKey = `plan:${projectId}`;
  const cached = await env.VIEW_KV.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/projects?id=eq.${projectId}&select=plan`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!res.ok) return "free";

  const rows = await res.json() as Array<{ plan?: string }>;
  const plan = rows[0]?.plan ?? "free";

  // Cache plan for 60s
  await env.VIEW_KV.put(cacheKey, plan, { expirationTtl: 60 });
  return plan;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
      return Response.json({ error: "Missing projectId" }, { status: 400 });
    }

    const month = monthKey();
    const viewKey = `views:${projectId}:${month}`;

    // ── Get current count ────────────────────────────────────────────────────
    const raw = await env.VIEW_KV.get(viewKey);
    const currentViews = raw ? parseInt(raw, 10) : 0;

    // ── Quota check ──────────────────────────────────────────────────────────
    const plan = await getProjectPlan(projectId, env);
    const quota = PLAN_QUOTAS[plan] ?? PLAN_QUOTAS.free;

    if (currentViews >= quota.maxViews) {
      return Response.json(
        {
          error: "quota_exceeded",
          plan,
          currentViews,
          maxViews: quota.maxViews,
          month,
        },
        {
          status: 402,
          headers: {
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    // ── Increment (30-day TTL or end of month) ───────────────────────────────
    const newCount = currentViews + 1;
    await env.VIEW_KV.put(viewKey, String(newCount), {
      expirationTtl: 60 * 60 * 24 * 30, // 30 days
    });

    return Response.json(
      {
        ok: true,
        plan,
        currentViews: newCount,
        maxViews: quota.maxViews,
        month,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  },
};
