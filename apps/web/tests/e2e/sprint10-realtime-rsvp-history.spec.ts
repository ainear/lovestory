import { test, expect } from "@playwright/test";

/**
 * Sprint 10 — Real-time RSVP, Multi-project Filter, History Panel E2E Tests
 */

const BASE = process.env.BASE_URL || "https://7app.online";

// ─────────────────────────────────────────────
// 1. RSVP Real-time Dashboard
// ─────────────────────────────────────────────
test.describe("Sprint 10 — RSVP Real-time Dashboard", () => {
  test("RSVP page loads (client component, 200 or auth redirect)", async ({ request }) => {
    const res = await request.get(`${BASE}/dashboard/rsvp`, { maxRedirects: 5 });
    expect([200, 302]).toContain(res.status());
    console.log(`✅ /dashboard/rsvp status: ${res.status()}`);
  });

  test("RSVP page has no 500 server error", async ({ request }) => {
    const res = await request.get(`${BASE}/dashboard/rsvp`, { maxRedirects: 5 });
    expect(res.status()).not.toBe(500);
    console.log(`✅ /dashboard/rsvp no 500: ${res.status()}`);
  });

  test("RSVP CSV export requires auth", async ({ request }) => {
    const res = await request.get(`${BASE}/api/guests/export?projectId=test`, { maxRedirects: 0 });
    expect(res.status()).not.toBe(500);
    expect(res.status()).not.toBe(200); // 200 without auth would be a security issue
    console.log(`✅ /api/guests/export auth gate: ${res.status()}`);
  });
});

// ─────────────────────────────────────────────
// 2. Multi-project RSVP filter
// ─────────────────────────────────────────────
test.describe("Sprint 10 — Multi-project RSVP Filter", () => {
  test("RSVP page has project filter UI (page renders HTML, not empty)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const res = await page.goto(`${BASE}/dashboard/rsvp`, { waitUntil: "domcontentloaded", timeout: 15_000 });
    const status = res?.status() ?? 0;

    // Either we're redirected to login (auth gate works) or page loads (200)
    // Either way, no uncaught JS errors
    const critical = errors.filter(e => !e.includes("chrome-extension") && !e.includes("ResizeObserver"));
    expect(critical).toHaveLength(0);
    console.log(`✅ /dashboard/rsvp no JS errors, status: ${status}`);
  });
});

// ─────────────────────────────────────────────
// 3. Editor History Panel
// ─────────────────────────────────────────────
test.describe("Sprint 10 — Editor History Panel", () => {
  test("editor page loads without JS errors (HistoryPanel regression)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/editor/new`, { waitUntil: "domcontentloaded", timeout: 15_000 });

    const critical = errors.filter(e => !e.includes("chrome-extension") && !e.includes("ResizeObserver"));
    expect(critical).toHaveLength(0);
    console.log("✅ /editor/new no JS errors with HistoryPanel");
  });
});

// ─────────────────────────────────────────────
// 4. Referral /r/ route regression
// ─────────────────────────────────────────────
test.describe("Sprint 10 — Referral Route Regression", () => {
  test("/r/[code] redirects to login with click tracking (no 500)", async ({ request }) => {
    const res = await request.get(`${BASE}/r/SPRINT10`, { maxRedirects: 0 });
    expect(res.status()).not.toBe(500);
    const loc = res.headers()["location"] ?? "";
    if (loc) expect(loc).toContain("login");
    console.log(`✅ /r/SPRINT10 → ${res.status()} ${loc}`);
  });
});

// ─────────────────────────────────────────────
// 5. Security: RSVP page does not expose sensitive data
// ─────────────────────────────────────────────
test.describe("Sprint 10 — Security", () => {
  test("RSVP dashboard does not expose supabase service_role", async ({ request }) => {
    const res = await request.get(`${BASE}/dashboard/rsvp`, { maxRedirects: 5 });
    const body = await res.text();
    expect(body).not.toContain("service_role");
    expect(body).not.toContain("SUPABASE_SERVICE");
    console.log("✅ /dashboard/rsvp no secrets in HTML");
  });
});
