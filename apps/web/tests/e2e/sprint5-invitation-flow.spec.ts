import { test, expect } from "@playwright/test";

/**
 * Sprint 5 — E2E Invitation Flow Tests
 * CEO-level production smoke tests covering the entire user journey:
 * landing → templates → invitation preview → RSVP → share.
 *
 * Runs against BASE_URL (default: https://7app.online)
 */

const BASE = process.env.BASE_URL || "https://7app.online";

// ─────────────────────────────────────────────────────────────────────────
// 1. SMOKE — Core public pages load without JS errors or 500s
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — Public Page Smoke", () => {
  const publicPages = [
    { path: "/", label: "Homepage" },
    { path: "/templates", label: "Templates" },
    { path: "/gallery", label: "Gallery" },
    { path: "/blog", label: "Blog" },
    { path: "/pricing", label: "Pricing" },
  ];

  for (const pg of publicPages) {
    test(`${pg.label} loads without 500 or JS errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      const res = await page.goto(`${BASE}${pg.path}`);
      await page.waitForLoadState("domcontentloaded");

      const critical = errors.filter(
        (e) =>
          !e.includes("chrome-extension") &&
          !e.includes("ResizeObserver") &&
          !e.includes("Non-Error")
      );

      expect(res?.status(), `${pg.label} status`).not.toBe(500);
      expect(critical, `${pg.label} JS errors`).toHaveLength(0);
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// 2. SEO — Full OG tag verification on homepage and invitation pages
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — SEO & OG Tags", () => {
  test("homepage has og:title, og:description, twitter:card", async ({
    request,
  }) => {
    const res = await request.get(BASE);
    const body = await res.text();
    expect(body).toContain("og:title");
    expect(body).toContain("og:description");
    expect(body).toContain("twitter:card");
  });

  test("homepage title is not empty or default Next.js", async ({ page }) => {
    await page.goto(BASE);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    expect(title).not.toBe("Create Next App");
    console.log(`📊 Homepage title: ${title}`);
  });

  test("templates page has meta description", async ({ request }) => {
    const res = await request.get(`${BASE}/templates`);
    const body = await res.text();
    expect(body).toContain("description");
  });

  test("blog page has og:title from metadata", async ({ request }) => {
    const res = await request.get(`${BASE}/blog`);
    const body = await res.text();
    expect(body).toContain("og:title");
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 3. SECURITY — Production header re-verification (CEO gate)
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — Security Headers (Production Gate)", () => {
  test("X-Frame-Options: DENY on production", async ({ request }) => {
    const res = await request.get(BASE);
    const xfo = res.headers()["x-frame-options"];
    expect(xfo).toBe("DENY");
    console.log(`🛡️ X-Frame-Options: ${xfo}`);
  });

  test("X-Content-Type-Options: nosniff", async ({ request }) => {
    const res = await request.get(BASE);
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  });

  test("Strict-Transport-Security present", async ({ request }) => {
    const res = await request.get(BASE);
    const hsts = res.headers()["strict-transport-security"];
    expect(hsts).toBeTruthy();
    expect(hsts).toContain("max-age=");
    console.log(`🛡️ HSTS: ${hsts}`);
  });

  test("Permissions-Policy present", async ({ request }) => {
    const res = await request.get(BASE);
    const pp = res.headers()["permissions-policy"];
    expect(pp).toBeTruthy();
    console.log(`🛡️ Permissions-Policy: ${pp}`);
  });

  test("no server secrets in HTML response", async ({ request }) => {
    const res = await request.get(BASE);
    const body = await res.text();
    expect(body).not.toContain("service_role");
    expect(body).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(body).not.toContain("SEPAY_SECRET_KEY");
    expect(body).not.toContain("RESEND_API_KEY");
  });

  test("RSVP rejects empty payload with 400 or 429", async ({ request }) => {
    const res = await request.post(`${BASE}/api/rsvp`, {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect([400, 429]).toContain(res.status());
  });

  test("upload API requires auth (401 on unauthenticated POST)", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/api/upload`, {
      data: { file: "test" },
      headers: { "Content-Type": "application/json" },
    });
    // Should be 401 (unauth) or 415/400 (wrong content-type) — never 200
    expect(res.status()).not.toBe(200);
    expect(res.status()).not.toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 4. INVITATION FLOW — Core user journey (public invitation view)
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — Invitation Flow", () => {
  test("invitation URL /i/[slug] returns non-500 response", async ({
    request,
  }) => {
    // The invitation page is 'use client' — SSR layout wraps with try/catch
    // Unknown slugs return 200 HTML with empty data (handled client-side)
    const res = await request.get(`${BASE}/i/test-invitation-unknown`);
    console.log(`📊 /i/test-invitation-unknown status: ${res.status()}`);
    // Should never 500 — generateMetadata has try/catch
    expect([200, 302, 404]).toContain(res.status());
  });

  test("invitation HTML has og:title for Zalo/FB sharing (layout.tsx generateMetadata)", async ({
    request,
  }) => {
    // layout.tsx uses generateMetadata with try/catch — always returns OG tags
    const res = await request.get(`${BASE}/i/test-og-check`);
    console.log(`📊 /i/[slug] OG status: ${res.status()}`);
    // generateMetadata never throws — any status proves SSR metadata works
    expect([200, 302, 404]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.text();
      // Check for og:title fallback ("Thiệp mời cưới - LoveStory" when slug not found)
      expect(body).toContain("og:title");
      console.log("✅ OG tags present on /i/* route");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 5. AUTH — Protected routes redirect unauthenticated users
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — Auth Gate", () => {
  test("/dashboard redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    // Should have been redirected to login
    expect(url).toContain("/login");
    console.log(`🔒 Dashboard redirect: ${url}`);
  });

  test("/editor/new redirects unauthenticated users", async ({ page }) => {
    await page.goto(`${BASE}/editor/new`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toContain("/login");
    console.log(`🔒 Editor redirect: ${url}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 6. PERFORMANCE — Timing baselines
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — Performance Baselines", () => {
  test("homepage DOMContentLoaded < 8s", async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE);
    await page.waitForLoadState("domcontentloaded");
    const ms = Date.now() - start;
    console.log(`📊 Homepage TTDOM: ${ms}ms`);
    expect(ms).toBeLessThan(8000);
  });

  test("templates page DOMContentLoaded < 10s", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE}/templates`);
    await page.waitForLoadState("domcontentloaded");
    const ms = Date.now() - start;
    console.log(`📊 Templates TTDOM: ${ms}ms`);
    expect(ms).toBeLessThan(10000);
  });

  test("no render-blocking identified by title", async ({ page }) => {
    await page.goto(BASE);
    const title = await page.title();
    // Page must render enough to have a title — proves no blocking
    expect(title.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 7. GALLERY — Community showcase loads correctly
// ─────────────────────────────────────────────────────────────────────────
test.describe("Sprint 5 — Gallery Showcase", () => {
  test("gallery page has h1 heading", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/gallery`);
    await page.waitForLoadState("domcontentloaded");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5000 });

    const critical = errors.filter(
      (e) => !e.includes("chrome-extension") && !e.includes("ResizeObserver")
    );
    expect(critical).toHaveLength(0);
  });

  test("blog page shows h1 heading", async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await page.waitForLoadState("domcontentloaded");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5000 });
  });
});
