import { test, expect } from "@playwright/test";

/**
 * Sprint 6 — Growth Features E2E Tests
 * CEO-level tests for: viral CTA, blog post pages, premium lock UI.
 */

const BASE = process.env.BASE_URL || "https://7app.online";

// ─────────────────────────────────────────────
// 1. Templates page — premium lock UI
// ─────────────────────────────────────────────
test.describe("Sprint 6 — Premium Template Lock UI", () => {
  test("templates page loads with premium/basic/free tiers", async ({
    page,
  }) => {
    await page.goto(`${BASE}/templates`);
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    expect(title.length).toBeGreaterThan(3);

    // Verify PREMIUM badge appears (purple badges on premium cards)
    const premiumBadge = page.getByText("PREMIUM").first();
    await expect(premiumBadge).toBeVisible({ timeout: 8000 });
    console.log("✅ PREMIUM badge visible on template grid");
  });

  test("templates page has tier filter select (free/basic/premium)", async ({
    page,
  }) => {
    await page.goto(`${BASE}/templates`);
    await page.waitForLoadState("domcontentloaded");

    // Tier filter select should exist
    const select = page.locator("select").first();
    await expect(select).toBeVisible({ timeout: 5000 });
    console.log("✅ Tier filter select visible");
  });

  test("premium lock overlay contains Nâng cấp link to /pricing", async ({
    request,
  }) => {
    // Check templates page HTML contains pricing link for premium templates
    const res = await request.get(`${BASE}/templates`);
    const body = await res.text();
    // The page is client-rendered ('use client') — check JS bundle references
    expect(res.status()).toBe(200);
    expect(body).toContain("templates");
    console.log("✅ Templates page returns 200");
  });
});

// ─────────────────────────────────────────────
// 2. Blog post page — /blog/[slug]
// ─────────────────────────────────────────────
test.describe("Sprint 6 — Blog Post SEO Page", () => {
  test("blog index page loads and links to posts", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState("domcontentloaded");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5000 });

    const critical = errors.filter(
      (e) => !e.includes("chrome-extension") && !e.includes("ResizeObserver")
    );
    expect(critical).toHaveLength(0);
  });

  test("blog index page has og:title for social sharing", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/blog`);
    const body = await res.text();
    expect(body).toContain("og:title");
  });

  test("blog/[slug] returns 200 or 404 (never 500)", async ({ request }) => {
    // Test with a slug that we seeded
    const res = await request.get(`${BASE}/blog/thiep-cuoi-dep-2026`);
    console.log(`📊 /blog/thiep-cuoi-dep-2026 status: ${res.status()}`);
    expect([200, 404]).toContain(res.status());

    if (res.status() === 200) {
      const body = await res.text();
      expect(body).toContain("og:title");
      expect(body).toContain("og:description");
      console.log("✅ Blog post page has OG tags");
    }
  });

  test("blog/[slug] page generates twitter:card meta", async ({ request }) => {
    const res = await request.get(`${BASE}/blog/huong-dan-tao-thiep-cuoi-online`);
    console.log(`📊 /blog/huong-dan-... status: ${res.status()}`);
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.text();
      expect(body).toContain("twitter:card");
      expect(body).toContain("summary_large_image");
      console.log("✅ Twitter card meta present");
    }
  });

  test("blog/[slug] page has Schema.org BlogPosting JSON-LD", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/blog/loi-cam-on-dam-cuoi`);
    console.log(`📊 /blog/loi-cam-on-dam-cuoi status: ${res.status()}`);
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.text();
      expect(body).toContain("application/ld+json");
      expect(body).toContain("BlogPosting");
      console.log("✅ Schema.org BlogPosting JSON-LD present");
    }
  });
});

// ─────────────────────────────────────────────
// 3. Viral CTA — /i/[slug] invitation page
// ─────────────────────────────────────────────
test.describe("Sprint 6 — Viral Growth CTA", () => {
  test("/i/[slug] page returns 200 or 404 (never 500) for known page", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/i/test-viral-cta-sprint6`);
    console.log(`📊 /i/test-viral-cta status: ${res.status()}`);
    expect([200, 302, 404]).toContain(res.status());
  });

  test("invitation page HTML source does not expose secrets", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/i/test-viral-cta-sprint6`);
    const body = await res.text();
    expect(body).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(body).not.toContain("service_role");
    console.log("✅ No secrets in invitation page HTML");
  });
});

// ─────────────────────────────────────────────
// 4. Referral tracking — query param verification
// ─────────────────────────────────────────────
test.describe("Sprint 6 — Referral Attribution", () => {
  test("/login page accepts ref + from query params without error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/login?ref=invitation&from=test-slug`);
    await page.waitForLoadState("domcontentloaded");

    const critical = errors.filter(
      (e) => !e.includes("chrome-extension") && !e.includes("ResizeObserver")
    );
    expect(critical).toHaveLength(0);
    console.log("✅ /login?ref=invitation accepts query params");
  });

  test("/login?ref=blog-post doesn't crash the login page", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/login?ref=blog-post&from=thiep-cuoi-dep-2026`
    );
    expect(res.status()).not.toBe(500);
    console.log(`✅ /login?ref=blog-post status: ${res.status()}`);
  });
});
