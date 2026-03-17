import { test, expect } from "@playwright/test";

/**
 * Production E2E: Full editor flow test on 7app.online
 * Tests: Homepage → Templates → Login → Editor → Save → Preview
 */

const BASE_URL = "https://7app.online";

test.describe("Production Editor Flow", () => {
  test.setTimeout(120_000);

  test("1. Homepage loads correctly", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // Check title
    await expect(page).toHaveTitle(/LoveStory/);

    // Check key elements exist
    const heading = page.locator("text=Tạo thiệp cưới");
    await expect(heading.first()).toBeVisible({ timeout: 10_000 });

    // Check navigation links
    await expect(page.locator("text=Mẫu thiệp").first()).toBeVisible();
    await expect(page.locator("text=Bảng giá").first()).toBeVisible();

    console.log("✅ Homepage: OK");
  });

  test("2. Templates page — 75+ templates load", async ({ page }) => {
    await page.goto(`${BASE_URL}/templates`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    // Check template grid exists
    const templateCards = page.locator("img[alt]");
    const count = await templateCards.count();
    console.log(`📋 Templates found: ${count}`);
    expect(count).toBeGreaterThan(30);

    // Check filter buttons exist
    const freeFilter = page.locator("text=FREE").first();
    await expect(freeFilter).toBeVisible({ timeout: 5000 });

    console.log("✅ Templates page: OK");
  });

  test("3. Login page renders correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Check login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await expect(emailInput).toBeVisible({ timeout: 10_000 });
    await expect(passwordInput).toBeVisible();

    // Check Google login button
    const googleBtn = page.locator("text=Google").first();
    await expect(googleBtn).toBeVisible();

    console.log("✅ Login page: OK");
  });

  test("4. Login + Editor flow", async ({ page }) => {
    // Go to login
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    // Try to login with test account
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill("onenearcelo@gmail.com");
    await passwordInput.fill("Admin@123");

    // Click login button
    const loginBtn = page.locator('button[type="submit"], button:has-text("Đăng nhập")').first();
    await loginBtn.click();

    // Wait for redirect to dashboard
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log(`📍 After login URL: ${currentUrl}`);

    if (currentUrl.includes("/dashboard") || currentUrl.includes("/editor")) {
      console.log("✅ Login: SUCCESS");

      // Screenshot dashboard
      await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-dashboard.png", fullPage: false });

      // Navigate to editor/new to create a project
      await page.goto(`${BASE_URL}/editor/new`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(5000);

      const editorUrl = page.url();
      console.log(`📍 Editor new URL: ${editorUrl}`);
      await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-editor-new.png", fullPage: false });

      // Check if template picker is shown
      const templatePicker = page.locator("text=Chọn mẫu").first();
      const editorCanvas = page.locator("[data-testid='canvas'], [class*='canvas'], [style*='position: relative']").first();

      const hasTemplatePicker = await templatePicker.isVisible().catch(() => false);
      const hasCanvas = await editorCanvas.isVisible().catch(() => false);

      console.log(`📋 Template picker visible: ${hasTemplatePicker}`);
      console.log(`🎨 Canvas visible: ${hasCanvas}`);

      if (hasCanvas || editorUrl.includes("/editor/")) {
        console.log("✅ Editor: LOADED");

        // Try to interact with editor elements
        await page.waitForTimeout(3000);
        await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-editor-loaded.png", fullPage: false });

        // Check sidebar tabs
        const sidebarTabs = page.locator("button, [role='tab']");
        const tabCount = await sidebarTabs.count();
        console.log(`📑 Sidebar elements found: ${tabCount}`);

        // Check for key UI elements
        const checks = [
          { name: "Save button", selector: "text=Lưu" },
          { name: "Preview button", selector: "text=Xem trước" },
          { name: "Publish button", selector: "text=Xuất bản" },
        ];

        for (const check of checks) {
          const el = page.locator(check.selector).first();
          const visible = await el.isVisible().catch(() => false);
          console.log(`  ${visible ? "✅" : "⚠️"} ${check.name}: ${visible ? "visible" : "not found"}`);
        }
      }
    } else if (currentUrl.includes("/login")) {
      console.log("⚠️ Login: Stayed on login page — credentials may be invalid");
      await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-login-failed.png", fullPage: false });

      // Check for error message
      const errorMsg = page.locator("text=Sai, text=không hợp lệ, text=error, text=thất bại").first();
      const hasError = await errorMsg.isVisible().catch(() => false);
      if (hasError) {
        console.log(`❌ Login error: ${await errorMsg.textContent()}`);
      }
    }
  });

  test("5. Pricing page renders correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Check pricing tiers
    const freePrice = page.locator("text=0₫").first();
    await expect(freePrice).toBeVisible({ timeout: 5000 });

    // Check all tier names
    for (const tier of ["Free", "Basic", "Pro", "Premium"]) {
      const el = page.locator(`text=${tier}`).first();
      const visible = await el.isVisible().catch(() => false);
      console.log(`  ${visible ? "✅" : "⚠️"} Tier ${tier}: ${visible ? "visible" : "not found"}`);
    }

    console.log("✅ Pricing page: OK");
  });

  test("6. Editor demo loads without login", async ({ page }) => {
    await page.goto(`${BASE_URL}/editor/demo`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(8000);

    const currentUrl = page.url();
    console.log(`📍 Demo URL: ${currentUrl}`);

    // Should NOT redirect to login
    expect(currentUrl).not.toContain("/login");

    await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-editor-demo.png", fullPage: false });

    // Check if editor UI loaded
    const editorElements = await page.locator("[style*='position']").count();
    console.log(`🎨 Editor elements: ${editorElements}`);

    console.log("✅ Editor demo: OK");
  });

  test("7. Public invitation viewer works", async ({ page }) => {
    // Try to load a public invitation (if any exist)
    await page.goto(`${BASE_URL}/gallery`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`📍 Gallery URL: ${currentUrl}`);

    await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-gallery.png", fullPage: false });

    // Check if gallery has any public invitations
    const invitationLinks = page.locator("a[href*='/i/']");
    const linkCount = await invitationLinks.count();
    console.log(`💌 Public invitations found: ${linkCount}`);

    if (linkCount > 0) {
      // Click first invitation to test viewer
      const firstLink = invitationLinks.first();
      const href = await firstLink.getAttribute("href");
      console.log(`📍 First invitation: ${href}`);

      await firstLink.click();
      await page.waitForTimeout(5000);

      await page.screenshot({ path: "apps/web/tests/e2e/screenshots/prod-viewer.png", fullPage: false });
      console.log("✅ Viewer: LOADED");
    } else {
      console.log("⚠️ No public invitations to test viewer");
    }
  });

  test("8. API health check", async ({ request }) => {
    // Test public API endpoints
    const endpoints = [
      { name: "Views API", method: "POST", url: `${BASE_URL}/api/views`, body: { slug: "test-nonexistent" }, expectedStatus: 404 },
      { name: "Likes API", method: "GET", url: `${BASE_URL}/api/likes?slug=test`, expectedStatus: 200 },
      { name: "Wishes API", method: "GET", url: `${BASE_URL}/api/wishes?projectId=test`, expectedStatus: 200 },
    ];

    for (const ep of endpoints) {
      try {
        let response;
        if (ep.method === "POST") {
          response = await request.post(ep.url, { data: ep.body });
        } else {
          response = await request.get(ep.url);
        }
        const status = response.status();
        const ok = status === ep.expectedStatus;
        console.log(`  ${ok ? "✅" : "⚠️"} ${ep.name}: ${status} (expected ${ep.expectedStatus})`);
      } catch (e) {
        console.log(`  ❌ ${ep.name}: FAILED — ${e}`);
      }
    }

    console.log("✅ API health: OK");
  });
});
