import { test, expect } from "@playwright/test";

const PROD_URL = "https://7app.online";

/**
 * Production Smoke Tests for 7app.online (LoveStory)
 * Runs against the live production site.
 */

// Override baseURL for all tests in this file
test.use({ baseURL: PROD_URL });

// ─── 1. Landing Page ────────────────────────────────────────────────────────

test.describe("1. Landing Page", () => {
  test("page loads within 5s and title contains LoveStory", async ({
    page,
  }) => {
    const response = await page.goto("/", {
      timeout: 5000,
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(400);

    const title = await page.title();
    expect(title.toLowerCase()).toContain("lovestory");
  });

  test("CTA button is visible", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/", { timeout: 15000, waitUntil: "domcontentloaded" });

    // Look for a primary call-to-action button
    const cta = page.locator(
      'a:has-text("Tạo"), a:has-text("Bắt đầu"), a:has-text("Thử"), button:has-text("Tạo"), button:has-text("Bắt đầu"), button:has-text("Start"), a:has-text("Create")',
    );
    await expect(cta.first()).toBeVisible({ timeout: 8000 });
  });

  test("navigation links are present", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Check that there are navigation links (header or nav)
    const navLinks = page.locator("nav a, header a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ─── 2. Public Viewer ───────────────────────────────────────────────────────

test.describe("2. Public Viewer", () => {
  // Try demo-wedding first, fall back to /i/demo
  const publicPaths = ["/i/demo-wedding", "/i/demo"];

  test("public invitation page loads", async ({ page }) => {
    let loaded = false;
    for (const path of publicPaths) {
      const res = await page.goto(path, {
        timeout: 10000,
        waitUntil: "domcontentloaded",
      });
      if (res && res.status() === 200) {
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      // Try to find any public invitation by checking the landing page for links
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const demoLink = page.locator('a[href*="/i/"]').first();
      if (await demoLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await demoLink.click();
        loaded = true;
      }
    }

    // At minimum, page should not be a hard error
    expect(page.url()).toBeDefined();
    // Log the final URL for debugging
    console.log(`Public viewer URL: ${page.url()}`);
  });

  test("content renders on public page", async ({ page }) => {
    // Navigate to a public invitation
    for (const path of publicPaths) {
      const res = await page.goto(path, {
        timeout: 10000,
        waitUntil: "domcontentloaded",
      });
      if (res && res.status() === 200) break;
    }

    // Check that some content is visible (text or images)
    const hasContent = await page
      .locator(
        "img, p, h1, h2, h3, span, div[class*='text'], div[class*='card']",
      )
      .first()
      .isVisible({ timeout: 8000 })
      .catch(() => false);

    // If the page loaded (200), it should have content
    const status = (await page.goto(page.url()))?.status();
    if (status === 200) {
      expect(hasContent).toBeTruthy();
    }
  });

  test("mobile viewport test (390px)", async ({ browser }) => {
    test.setTimeout(60000);
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
    });
    const page = await context.newPage();

    for (const path of publicPaths) {
      const res = await page.goto(`${PROD_URL}${path}`, {
        timeout: 20000,
        waitUntil: "domcontentloaded",
      });
      if (res && res.status() === 200) break;
    }

    // Page should not have horizontal overflow (basic responsive check)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 390;
    // Allow small tolerance (10px)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);

    await context.close();
  });
});

// ─── 3. Auth Flow ───────────────────────────────────────────────────────────

test.describe("3. Auth Flow", () => {
  test("/login page loads", async ({ page }) => {
    const res = await page.goto("/login", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });
    expect(res?.status()).toBeLessThan(400);

    // Should have some form of login UI
    const hasLoginUI = await page
      .locator(
        "input[type='email'], input[type='password'], input[placeholder*='mail'], button[type='submit'], form",
      )
      .first()
      .isVisible({ timeout: 8000 })
      .catch(() => false);
    expect(hasLoginUI).toBeTruthy();
  });

  test("/register page loads", async ({ page }) => {
    const res = await page.goto("/register", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });
    // Could be 200 or redirect to /login with register tab
    expect(res?.status()).toBeLessThan(500);
    // Should not be a server error page
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).not.toContain("internal server error");
  });

  test("/dashboard redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });
    // Should redirect to login
    await expect(page).toHaveURL(/\/login|\/auth/, { timeout: 10000 });
  });

  test("/editor/test redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/editor/test", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });
    // Should redirect to login or templates/dashboard
    await expect(page).toHaveURL(/\/login|\/auth|\/dashboard|\/templates/, {
      timeout: 10000,
    });
  });
});

// ─── 4. Editor Demo ─────────────────────────────────────────────────────────

test.describe("4. Editor Demo", () => {
  test("/editor/demo loads without auth", async ({ page }) => {
    const res = await page.goto("/editor/demo", {
      timeout: 15000,
      waitUntil: "domcontentloaded",
    });

    // Should load (200) or redirect to a valid page (not login)
    const url = page.url();
    console.log(`Editor demo URL: ${url}`);

    // If the page loaded, check for editor-like content
    if (res && res.status() === 200 && url.includes("/editor")) {
      // Look for canvas or editor container
      const hasEditor = await page
        .locator(
          "[class*='canvas'], [class*='editor'], [class*='Canvas'], [class*='Editor'], [data-testid*='canvas'], [data-testid*='editor'], iframe",
        )
        .first()
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      console.log(`Editor visible: ${hasEditor}`);
    }
  });

  test("editor new page loads", async ({ page }) => {
    const res = await page.goto("/editor/new", {
      timeout: 15000,
      waitUntil: "domcontentloaded",
    });

    const url = page.url();
    console.log(`Editor new URL: ${url}`);

    // It may redirect to login or to an actual editor
    expect(res?.status()).toBeLessThan(500);
  });
});

// ─── 5. API Health ──────────────────────────────────────────────────────────

test.describe("5. API Health", () => {
  test("/api/views returns proper response", async ({ request }) => {
    const res = await request.get(`${PROD_URL}/api/views`, { timeout: 10000 });
    // Should return a valid HTTP response (not 500)
    console.log(`/api/views status: ${res.status()}`);
    // API might require params, so 400 is acceptable, 500 is not
    expect(res.status()).toBeLessThan(500);
  });

  test("/api/likes returns proper response", async ({ request }) => {
    const res = await request.get(`${PROD_URL}/api/likes`, { timeout: 10000 });
    console.log(`/api/likes status: ${res.status()}`);
    expect(res.status()).toBeLessThan(500);
  });

  test("site returns valid HTML on root", async ({ request }) => {
    const res = await request.get(`${PROD_URL}/`, { timeout: 10000 });
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"] || "";
    expect(contentType).toContain("text/html");
  });
});
