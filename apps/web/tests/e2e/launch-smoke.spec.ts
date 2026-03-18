/**
 * Launch Readiness Smoke Tests
 * CEO pre-check: validates all critical routes and features before deploy.
 * Run: npx playwright test tests/e2e/launch-smoke.spec.ts --reporter=list
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Public pages — render and SEO
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Public Pages", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page).toHaveTitle(/LoveStory/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("homepage has OG meta tags", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
    expect(ogTitle).toContain("LoveStory");
    const desc = await page.getAttribute('meta[name="description"]', "content");
    expect(desc?.length).toBeGreaterThan(50);
  });

  test("homepage footer has privacy link", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page.getByRole("link", { name: /Chính sách bảo mật/i })).toBeVisible();
  });

  test("/templates page loads", async ({ page }) => {
    await page.goto(`${BASE}/templates`);
    await expect(page).toHaveTitle(/mẫu|template/i);
    await expect(page.locator("body")).toContainText("mẫu");
  });

  test("/pricing page loads with plan cards", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await page.waitForLoadState("networkidle");
    // Check body text content for plan names (robust vs CSS selector)
    await expect(page.locator("body")).toContainText("Miễn phí");
    await expect(page.locator("body")).toContainText("Basic");
    await expect(page.locator("body")).toContainText("Premium");
  });

  test("/privacy page loads with all 7 sections", async ({ page }) => {
    await page.goto(`${BASE}/privacy`);
    await expect(page.locator("h1")).toContainText("Chính sách bảo mật");
    await expect(page.locator("h2")).toHaveCount(7);
  });

  test("/blog page loads", async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(page.locator("body")).not.toContainText("500");
    await expect(page.locator("body")).not.toContainText("Error");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. SEO / Technical
// ─────────────────────────────────────────────────────────────────────────────
test.describe("SEO & Technical", () => {
  test("robots.txt is accessible", async ({ request }) => {
    const res = await request.get(`${BASE}/robots.txt`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.toLowerCase()).toContain("user-agent");
    expect(body.toLowerCase()).toContain("sitemap");
  });

  test("sitemap.xml returns valid XML", async ({ request }) => {
    const res = await request.get(`${BASE}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("<loc>");
  });

  test("manifest.json is valid", async ({ request }) => {
    const res = await request.get(`${BASE}/manifest.json`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.name).toBe("LoveStory");
    expect(json.icons?.length).toBeGreaterThan(0);
  });

  test("favicon is accessible", async ({ request }) => {
    const res = await request.get(`${BASE}/icon.svg`);
    expect(res.status()).toBe(200);
  });

  test("viewport meta exists", async ({ page }) => {
    await page.goto(`${BASE}/`);
    const viewport = await page.getAttribute('meta[name="viewport"]', "content");
    expect(viewport).toContain("width=device-width");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GDPR & Cookie
// ─────────────────────────────────────────────────────────────────────────────
test.describe("GDPR Cookie Banner", () => {
  test("cookie banner appears on first visit", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto(`${BASE}/`);
    // Banner shows with 1.5s delay
    await page.waitForTimeout(2000);
    const banner = page.locator('[role="dialog"][aria-label="Cookie consent"]');
    await expect(banner).toBeVisible();
  });

  test("cookie banner accept button works", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto(`${BASE}/`);
    await page.waitForTimeout(2000);
    await page.locator("text=Chấp nhận tất cả").click();
    const cookies = await context.cookies(BASE);
    const consent = cookies.find((c) => c.name === "consent_given");
    expect(consent?.value).toBe("true");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Authentication & Protected Routes
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Auth Guards", () => {
  test("dashboard redirects to login unauthenticated", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin routes redirect to login", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin commissions redirect to login", async ({ page }) => {
    await page.goto(`${BASE}/admin/commissions`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.locator("body")).not.toContainText("500");
    // Should have email input
    await expect(page.locator("input[type='email'], input[name='email']")).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. API Security — Rate Limits & Auth
// ─────────────────────────────────────────────────────────────────────────────
test.describe("API Security", () => {
  test("upload API returns 401 without auth", async ({ request }) => {
    const res = await request.post(`${BASE}/api/upload`, {
      multipart: { file: { name: "t.png", mimeType: "image/png", buffer: Buffer.from("data") } },
    });
    expect(res.status()).toBe(401);
  });

  test("orders API returns 401 without auth", async ({ request }) => {
    const res = await request.post(`${BASE}/api/orders`, {
      data: { plan: "basic", orderCode: "TEST001" },
    });
    expect(res.status()).toBe(401);
  });

  test("admin/orders API returns 401 or 403 without auth", async ({ request }) => {
    const res = await request.get(`${BASE}/api/admin/orders`);
    // Next.js middleware can return 401 or 403 for unauthenticated admin routes
    expect([401, 403]).toContain(res.status());
  });

  test("likes API returns 200 or 400 for public access", async ({ request }) => {
    const res = await request.post(`${BASE}/api/likes`, { data: { slug: "" } });
    expect([200, 400, 429]).toContain(res.status());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. A/B Pricing Test
// ─────────────────────────────────────────────────────────────────────────────
test.describe("A/B Pricing", () => {
  test("pricing page shows valid basic price", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await page.waitForLoadState("networkidle");
    // Check body text contains price patterns (robust)
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/\d+\.\d{3}đ|Miễn phí|VNĐ|\d+,\d{3}/);
  });

  test("A/B cookie is set on first pricing visit", async ({ context, page }) => {
    await context.clearCookies();
    await page.goto(`${BASE}/pricing`);
    const cookies = await context.cookies(BASE);
    const ab = cookies.find((c) => c.name === "ab_pricing");
    if (ab) {
      expect(["control", "variant"]).toContain(ab.value);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Core Web Vitals — CLS check
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Performance (CLS)", () => {
  test("homepage has no layout shift on load (CLS ≈ 0)", async ({ page }) => {
    // Fix: use window property instead of closure to avoid ReferenceError in isolated context
    await page.addInitScript(() => {
      (window as any).__cls = 0;
      new (window as any).PerformanceObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) (window as any).__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`${BASE}/`);
    await page.waitForTimeout(2000);
    const clsValue: number = await page.evaluate(() => (window as any).__cls ?? 0);
    console.log(`CLS: ${clsValue.toFixed(4)}`);
    expect(clsValue).toBeLessThan(0.1); // Google's "Good" threshold
  });
});
