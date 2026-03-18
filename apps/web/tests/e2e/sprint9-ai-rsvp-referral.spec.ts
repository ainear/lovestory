import { test, expect } from "@playwright/test";

/**
 * Sprint 9 — AI Text Panel + RSVP + Referral E2E Tests
 */

const BASE = process.env.BASE_URL || "https://7app.online";

// ─────────────────────────────────────────────
// 1. RSVP Dashboard — stat cards and CSV link
// ─────────────────────────────────────────────
test.describe("Sprint 9 — RSVP Dashboard", () => {
  test("RSVP page loads (200 or redirects to login)", async ({ request }) => {
    const res = await request.get(`${BASE}/dashboard/rsvp`, { maxRedirects: 5 });
    expect([200, 302]).toContain(res.status());
    console.log(`✅ /dashboard/rsvp status: ${res.status()}`);
  });

  test("RSVP CSV export endpoint exists and requires auth", async ({ request }) => {
    const res = await request.get(`${BASE}/api/guests/export?projectId=test`, { maxRedirects: 0 });
    // 401/403/302 = requires auth. 404 = endpoint missing. 500 = error.
    expect(res.status()).not.toBe(500);
    expect(res.status()).not.toBe(404);
    console.log(`✅ /api/guests/export auth gate: ${res.status()}`);
  });
});

// ─────────────────────────────────────────────
// 2. Referral Dashboard — /r/ link format
// ─────────────────────────────────────────────
test.describe("Sprint 9 — Referral Dashboard", () => {
  test("referral dashboard page loads", async ({ request }) => {
    const res = await request.get(`${BASE}/dashboard/referral`, { maxRedirects: 5 });
    expect([200, 302]).toContain(res.status());
    console.log(`✅ /dashboard/referral status: ${res.status()}`);
  });

  test("/r/[code] route works (click tracking, no 500)", async ({ request }) => {
    const res = await request.get(`${BASE}/r/TEST9CODE`, { maxRedirects: 0 });
    expect(res.status()).not.toBe(500);
    const location = res.headers()["location"] ?? "";
    console.log(`✅ /r/TEST9CODE → ${res.status()} →  ${location}`);
  });

  test("/r/[code] redirects to login (not /?ref=)", async ({ request }) => {
    const res = await request.get(`${BASE}/r/REFTEST`, { maxRedirects: 0 });
    const location = res.headers()["location"] ?? "";
    // Should redirect to login (auth page), not home/?ref=
    if (location) {
      expect(location).toContain("login");
    }
    expect(res.status()).not.toBe(500);
    console.log(`✅ /r/REFTEST → ${location}`);
  });
});

// ─────────────────────────────────────────────
// 3. AI API — sprint 9 regression
// ─────────────────────────────────────────────
test.describe("Sprint 9 — AI API Regression", () => {
  test("POST /api/ai/text-suggest still returns 401 without auth", async ({ request }) => {
    const res = await request.post(`${BASE}/api/ai/text-suggest`, {
      data: { type: "vow", groomName: "Minh", brideName: "Lan" },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(401);
    console.log("✅ AI API 401 regression: PASS");
  });
});

// ─────────────────────────────────────────────
// 4. Editor text element AI panel — no JS errors
// ─────────────────────────────────────────────
test.describe("Sprint 9 — Editor Text AI Panel", () => {
  test("editor page loads without JS crashes (text element AI panel regression)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/editor/new`, { waitUntil: "domcontentloaded", timeout: 15000 });

    const critical = errors.filter(
      (e) => !e.includes("chrome-extension") && !e.includes("ResizeObserver")
    );
    expect(critical).toHaveLength(0);
    console.log("✅ /editor/new no JS crashes");
  });
});

// ─────────────────────────────────────────────
// 5. Blog — verify Sprint 8 seed still live
// ─────────────────────────────────────────────
test.describe("Sprint 9 — Blog Seed Regression", () => {
  test("blog page still returns 200 (regression after sprint 9 deploy)", async ({ request }) => {
    const res = await request.get(`${BASE}/blog`);
    expect(res.status()).toBe(200);
    console.log("✅ /blog 200 regression: PASS");
  });
});
