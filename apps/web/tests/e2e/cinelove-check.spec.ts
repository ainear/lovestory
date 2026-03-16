import { test } from "@playwright/test";

test("Scrape CineLove editor-template page", async ({ page }) => {
  test.setTimeout(120000);

  // Login first
  await page.goto("https://cinelove.me/login", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  if (await emailInput.isVisible()) {
    await emailInput.fill("onenearcelo@gmail.com");
    await page.locator('input[type="password"]').first().fill("Admin@123");
    await page.locator('button[type="submit"], button:has-text("Sign in")').first().click();
    await page.waitForTimeout(5000);
  }

  // Navigate to the specific editor template
  await page.goto("https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4", {
    waitUntil: "domcontentloaded", timeout: 20000
  });
  await page.waitForTimeout(5000);

  // Full page screenshot
  await page.screenshot({ path: "/tmp/cl-editor-template-full.png", fullPage: false });

  // Get page title and URL
  console.log("=== PAGE INFO ===");
  console.log("URL:", page.url());
  console.log("Title:", await page.title());

  // Capture all visible tabs
  const tabs = ["Văn bản", "Hình ảnh", "Stock", "Hình dạng", "Nền", "Âm nhạc", "Tiện ích", "Thành phần", "Mẫu", "Hiệu ứng"];

  for (const tabName of tabs) {
    const tabBtn = page.locator(`text="${tabName}"`).first();
    if (await tabBtn.isVisible().catch(() => false)) {
      await tabBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `/tmp/cl-tab-${tabName}.png`, fullPage: false });
      console.log(`✅ Tab "${tabName}" — captured`);
    } else {
      console.log(`❌ Tab "${tabName}" — NOT FOUND`);
    }
  }

  // Capture right panel
  await page.screenshot({ path: "/tmp/cl-right-panel.png", fullPage: false });

  // Click on a text element to see selection + right panel settings
  const textElements = page.locator('.text-box-component, [class*="craft"]').first();
  if (await textElements.isVisible().catch(() => false)) {
    await textElements.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "/tmp/cl-text-selected.png", fullPage: false });
    console.log("✅ Text element selected — captured");
  }

  // Analyze DOM structure
  console.log("\n=== DOM ANALYSIS ===");

  // Count sidebar tabs
  const sidebarTabs = await page.locator('.ant-tabs-tab, [class*="toolbox"] button').count();
  console.log(`Sidebar elements: ${sidebarTabs}`);

  // Get all button texts
  const buttons = await page.locator('button').allTextContents();
  const uniqueButtons = [...new Set(buttons.filter(b => b.trim().length > 0))];
  console.log(`\nAll buttons (${uniqueButtons.length}):`);
  uniqueButtons.forEach(b => console.log(`  - "${b.trim()}"`));

  // Get header elements
  const headerText = await page.locator('header, nav, [class*="header"]').first().textContent().catch(() => "");
  console.log(`\nHeader text: ${headerText?.substring(0, 200)}`);

  // Check for specific CineLove features
  const featureChecks = [
    { name: "Xem trước button", sel: 'text="Xem trước"' },
    { name: "Xuất bản button", sel: 'text="Xuất bản"' },
    { name: "Lưu tạm button", sel: 'text*="Lưu"' },
    { name: "Undo button", sel: '[class*="undo"], button[title*="Undo"]' },
    { name: "Redo button", sel: '[class*="redo"], button[title*="Redo"]' },
    { name: "Zoom controls", sel: 'text="100%"' },
    { name: "Thay ảnh nhanh", sel: 'text*="Thay ảnh"' },
    { name: "Hỗ trợ", sel: 'text="Hỗ trợ"' },
    { name: "Tính năng nâng cao", sel: 'text*="nâng cao"' },
    { name: "Xóa watermark", sel: 'text*="watermark"' },
    { name: "QR Bank", sel: 'text*="QR"' },
  ];

  console.log("\n=== FEATURE CHECKS ===");
  for (const check of featureChecks) {
    const el = page.locator(check.sel).first();
    const visible = await el.isVisible().catch(() => false);
    console.log(`  ${visible ? "✅" : "❌"} ${check.name}`);
  }
});
