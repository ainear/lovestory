import { test, expect } from "@playwright/test";

/**
 * Editor Visual Audit — Screenshot LoveStory editor vs CineLove
 */

test.describe("Editor Visual Audit", () => {
  test("LoveStory editor — all tabs + features", async ({ page }) => {
    test.setTimeout(60000);

    // Login first
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(1000);

    // Fill login
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    const passInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.isVisible()) {
      await emailInput.fill("ainear@lovestory.com");
      await passInput.fill("password123");

      // Click login button
      const loginBtn = page.locator('button:has-text("Đăng nhập")').first();
      await loginBtn.click();
      await page.waitForTimeout(3000);
    }

    // Navigate to editor
    await page.goto("http://localhost:3000/editor/new", { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(3000);

    // Screenshot full editor
    await page.screenshot({ path: "tests/e2e/screenshots/ls-editor-full.png", fullPage: false });

    // Click through each tab and screenshot
    const tabs = [
      "Văn bản", "Hình ảnh", "Stock", "Hình dạng", "Nền",
      "Âm nhạc", "Tiện ích", "Mẫu", "Hiệu ứng", "Thành phần"
    ];

    for (const tabName of tabs) {
      const tabBtn = page.locator(`button:has-text("${tabName}")`).first();
      if (await tabBtn.isVisible().catch(() => false)) {
        await tabBtn.click();
        await page.waitForTimeout(800);
        await page.screenshot({
          path: `tests/e2e/screenshots/ls-tab-${tabName.toLowerCase().replace(/\s/g, "-")}.png`,
          fullPage: false,
        });
        console.log(`✅ Tab "${tabName}" — captured`);
      } else {
        console.log(`❌ Tab "${tabName}" — NOT FOUND`);
      }
    }

    // Check for visible UI elements
    console.log("\n=== UI ELEMENT CHECK ===");
    const checks = [
      { name: "Left sidebar 85px", sel: 'button:has-text("Văn bản")' },
      { name: "Right panel", sel: 'text=Tuỳ chỉnh' },
      { name: "Save indicator", sel: 'text=Đã lưu' },
      { name: "Canvas area", sel: '[class*="craft"]' },
      { name: "Zoom controls", sel: 'button:has-text("%")' },
    ];

    for (const c of checks) {
      const el = page.locator(c.sel).first();
      const vis = await el.isVisible().catch(() => false);
      console.log(`  ${vis ? "✅" : "❌"} ${c.name}`);
    }
  });

  test("CineLove editor — visual comparison", async ({ page }) => {
    test.setTimeout(90000);

    // CineLove login
    await page.goto("https://cinelove.me/login", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.isVisible()) {
      await emailInput.fill("onenearcelo@gmail.com");
      await passInput.fill("Admin@123");

      const loginBtn = page.locator('button:has-text("Sign in"), button[type="submit"]').first();
      await loginBtn.click();

      // Wait for redirect after login
      await page.waitForURL("**/dashboard**", { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }

    // Go to editor
    await page.goto("https://cinelove.me/editor/53", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(5000);

    // Full screenshot
    await page.screenshot({ path: "tests/e2e/screenshots/cl-editor-full.png", fullPage: false });

    // Click CineLove tabs
    const cineTabs = [
      "Văn bản", "Hình ảnh", "Stock", "Hình dạng", "Nền",
      "Âm nhạc", "Tiện ích", "Thành phần", "Mẫu", "Hiệu ứng"
    ];

    for (const tabName of cineTabs) {
      const tabBtn = page.locator(`text="${tabName}"`).first();
      if (await tabBtn.isVisible().catch(() => false)) {
        await tabBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: `tests/e2e/screenshots/cl-tab-${tabName.toLowerCase().replace(/\s/g, "-")}.png`,
          fullPage: false,
        });
        console.log(`✅ CineLove Tab "${tabName}" — captured`);
      } else {
        console.log(`❌ CineLove Tab "${tabName}" — NOT FOUND`);
      }
    }
  });
});
