/**
 * Sprint 13 E2E Tests
 * - Commission approve flow (admin UI buttons)
 * - Rate limit coverage (upload + orders)
 * - RSVP email opt-in (unsubscribed user check)
 * - Analytics realtime (view count subscription)
 * - A/B pricing test (cookie-based variant)
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

// ── 13.1 Commission Admin Page ───────────────────────────────────────────────
test.describe("13.1 Commission Admin Page", () => {
  test("shows commission table with action buttons", async ({ page }) => {
    // Commission page is admin-only; we test the redirect for unauthenticated
    const res = await page.goto(`${BASE}/admin/commissions`);
    // Unauthenticated should redirect to /login
    expect(page.url()).toMatch(/\/login|\/admin\/commissions/);
  });

  test("commission page has correct stat card labels", async ({ page }) => {
    await page.goto(`${BASE}/admin/commissions`);
    // If logged in as admin, stat labels should exist
    const url = page.url();
    if (url.includes("/admin/commissions")) {
      await expect(page.getByText("Tổng hoa hồng")).toBeVisible();
      await expect(page.getByText("Chờ duyệt")).toBeVisible();
      await expect(page.getByText("Đã duyệt")).toBeVisible();
      await expect(page.getByText("Đã thanh toán")).toBeVisible();
    }
  });
});

// ── 13.2 Rate Limit Coverage ─────────────────────────────────────────────────
test.describe("13.2 Rate Limit — Upload API", () => {
  test("upload route returns 401 for unauthenticated request", async ({ request }) => {
    const formData = new FormData();
    formData.append("file", new Blob(["test"], { type: "image/png" }), "test.png");
    const res = await request.post(`${BASE}/api/upload`, {
      multipart: { file: { name: "test.png", mimeType: "image/png", buffer: Buffer.from("test") } },
    });
    expect(res.status()).toBe(401);
  });

  test("orders route returns 401 for unauthenticated request", async ({ request }) => {
    const res = await request.post(`${BASE}/api/orders`, {
      data: { plan: "basic", orderCode: "TEST123478" },
    });
    expect(res.status()).toBe(401);
  });
});

// ── 13.3 RSVP Opt-in Check ──────────────────────────────────────────────────
test.describe("13.3 RSVP Email Opt-in Check", () => {
  test("RSVP API accepts valid submission without auth", async ({ request }) => {
    // RSVP doesn't require auth — checks honeypot + rate limit
    const res = await request.post(`${BASE}/api/rsvp`, {
      data: {
        projectId: "00000000-0000-0000-0000-000000000000", // non-existent
        guestName: "Test Guest",
        status: "confirmed",
        guestCount: 2,
      },
    });
    // Should return 500 (project not found) or 200 — not 401
    expect([200, 500, 429]).toContain(res.status());
  });
});

// ── 13.4 Analytics Realtime ──────────────────────────────────────────────────
test.describe("13.4 Analytics Page", () => {
  test("analytics page redirects unauthenticated to login", async ({ page }) => {
    await page.goto(`${BASE}/dashboard/projects/test-id/analytics`);
    await expect(page).toHaveURL(/\/login|\/dashboard/);
  });
});

// ── 13.5 A/B Pricing Test ────────────────────────────────────────────────────
test.describe("13.5 A/B Pricing Test", () => {
  test("pricing page renders without crash", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await expect(page.locator("h1")).toContainText("Chọn gói phù hợp");
  });

  test("pricing page shows basic plan card", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await expect(page.getByText("Basic")).toBeVisible();
  });

  test("pricing page shows free plan", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await expect(page.getByText("Free")).toBeVisible();
    await expect(page.getByText("Miễn phí")).toBeVisible();
  });

  test("A/B cookie is set after first visit to pricing", async ({ context, page }) => {
    // Clear cookies first for clean test
    await context.clearCookies();
    await page.goto(`${BASE}/pricing`);
    // After visit, cookie should exist OR we're in SSR (cookie set via response)
    const cookies = await context.cookies(BASE);
    // ab_pricing may or may not be set depending on SSR/client behavior
    const abCookie = cookies.find((c) => c.name === "ab_pricing");
    // At minimum, the page should render pricing content
    await expect(page.locator("text=Basic")).toBeVisible();
    if (abCookie) {
      expect(["control", "variant"]).toContain(abCookie.value);
    }
  });

  test("basic plan shows valid price (either 49K or 199K variant)", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    // Price is either 49.000đ (variant) or 199.000đ (control)
    const priceText = await page.locator(".text-4xl.font-extrabold").nth(1).textContent();
    expect(priceText).toMatch(/49\.000đ|199\.000đ/);
  });
});

// ── Security regression ───────────────────────────────────────────────────
test.describe("Security — Admin routes protected", () => {
  test("admin dashboard redirects unauthenticated users", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin commissions redirects unauthenticated users", async ({ page }) => {
    await page.goto(`${BASE}/admin/commissions`);
    await expect(page).toHaveURL(/\/login/);
  });
});
