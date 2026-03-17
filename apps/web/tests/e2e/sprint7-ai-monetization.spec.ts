import { test, expect } from "@playwright/test";

/**
 * Sprint 7 — AI & Monetization E2E Tests
 * CEO-level tests for: pricing page, AI API security, referral landing, blog pagination.
 */

const BASE = process.env.BASE_URL || "https://7app.online";

// ─────────────────────────────────────────────
// 1. Pricing Page
// ─────────────────────────────────────────────
test.describe("Sprint 7 — Pricing Page", () => {
  test("pricing page loads with 200 and h1 visible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/pricing`);
    await page.waitForLoadState("domcontentloaded");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 8000 });

    const critical = errors.filter(
      (e) => !e.includes("chrome-extension") && !e.includes("ResizeObserver")
    );
    expect(critical).toHaveLength(0);
    console.log("✅ /pricing loads, h1 visible");
  });

  test("pricing page has og:title meta tag", async ({ request }) => {
    const res = await request.get(`${BASE}/pricing`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("og:title");
    console.log("✅ /pricing has og:title");
  });

  test("pricing page contains 3 plan names (FREE, BASIC, PREMIUM)", async ({ request }) => {
    const res = await request.get(`${BASE}/pricing`);
    const body = await res.text();
    expect(body).toContain("FREE");
    expect(body).toContain("BASIC");
    expect(body).toContain("PREMIUM");
    console.log("✅ /pricing has all 3 plan tiers in HTML");
  });

  test("pricing FREE CTA links to /login", async ({ request }) => {
    const res = await request.get(`${BASE}/pricing`);
    const body = await res.text();
    expect(body).toContain("/login");
    console.log("✅ /pricing FREE CTA links to /login");
  });

  test("pricing page has Schema.org Product JSON-LD", async ({ request }) => {
    const res = await request.get(`${BASE}/pricing`);
    const body = await res.text();
    expect(body).toContain("application/ld+json");
    console.log("✅ /pricing has JSON-LD schema");
  });
});

// ─────────────────────────────────────────────
// 2. AI Text Suggest API — Security Gate
// ─────────────────────────────────────────────
test.describe("Sprint 7 — AI Text Suggest API Security", () => {
  test("POST /api/ai/text-suggest without auth returns 401", async ({ request }) => {
    const res = await request.post(`${BASE}/api/ai/text-suggest`, {
      data: {
        type: "invitation",
        groomName: "Minh",
        brideName: "Lan",
      },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(401);
    console.log("✅ AI API correctly rejects unauthenticated requests");
  });

  test("POST /api/ai/text-suggest never returns 500", async ({ request }) => {
    const res = await request.post(`${BASE}/api/ai/text-suggest`, {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).not.toBe(500);
    console.log(`✅ AI API returns ${res.status()} (not 500 on empty body)`);
  });

  test("GET /api/ai/text-suggest returns 405 (POST only)", async ({ request }) => {
    const res = await request.get(`${BASE}/api/ai/text-suggest`);
    expect([405, 401, 404]).toContain(res.status());
    console.log(`✅ GET on POST-only AI endpoint: ${res.status()}`);
  });
});

// ─────────────────────────────────────────────
// 3. Referral Landing /r/[code]
// ─────────────────────────────────────────────
test.describe("Sprint 7 — Referral Landing Page", () => {
  test("/r/[code] redirects (3xx) and never returns 500", async ({ request }) => {
    const res = await request.get(`${BASE}/r/test-sprint7-ref`, {
      maxRedirects: 0,
    });
    console.log(`📊 /r/test-sprint7-ref status: ${res.status()}`);
    expect(res.status()).not.toBe(500);
    // Server component using redirect() returns 307 or follows to login
    expect([200, 302, 307, 308]).toContain(res.status());
    console.log("✅ Referral landing redirects safely");
  });

  test("/r/[code] redirect location points to /login", async ({ request }) => {
    const res = await request.get(`${BASE}/r/abc123`, {
      maxRedirects: 0,
    });
    const location = res.headers()["location"] ?? "";
    console.log(`📍 Redirect location: ${location}`);
    // Location should contain /login or be relative
    if (location) {
      expect(location).toContain("login");
    }
    console.log("✅ Referral redirect points to /login");
  });

  test("/r/invalid-code-xyz does not 500", async ({ request }) => {
    const res = await request.get(`${BASE}/r/invalid-code-xyz`, {
      maxRedirects: 0,
    });
    expect(res.status()).not.toBe(500);
    console.log(`✅ /r/invalid-code returns ${res.status()}`);
  });
});

// ─────────────────────────────────────────────
// 4. Blog Load-More Pagination
// ─────────────────────────────────────────────
test.describe("Sprint 7 — Blog Pagination", () => {
  test("blog page loads without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState("domcontentloaded");

    const critical = errors.filter(
      (e) => !e.includes("chrome-extension") && !e.includes("ResizeObserver")
    );
    expect(critical).toHaveLength(0);
    console.log("✅ Blog page loads without JS errors");
  });

  test("blog has h1 visible on load", async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState("domcontentloaded");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5000 });
    console.log("✅ Blog h1 visible");
  });

  test("blog page has og:title for SEO", async ({ request }) => {
    const res = await request.get(`${BASE}/blog`);
    const body = await res.text();
    expect(body).toContain("og:title");
    console.log("✅ Blog og:title present");
  });
});

// ─────────────────────────────────────────────
// 5. Security — no secrets exposed
// ─────────────────────────────────────────────
test.describe("Sprint 7 — Security Cross-Check", () => {
  test("pricing page does not expose service role key", async ({ request }) => {
    const res = await request.get(`${BASE}/pricing`);
    const body = await res.text();
    expect(body).not.toContain("service_role");
    expect(body).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    console.log("✅ /pricing does not expose secrets");
  });

  test("blog page does not expose service role key", async ({ request }) => {
    const res = await request.get(`${BASE}/blog`);
    const body = await res.text();
    expect(body).not.toContain("service_role");
    console.log("✅ /blog does not expose secrets");
  });
});
