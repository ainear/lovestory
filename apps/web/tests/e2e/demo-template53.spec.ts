import { test } from "@playwright/test";

test("Demo Template 53 — deep scroll for plugin widgets", async ({ page }) => {
  test.setTimeout(120000);

  // Login
  await page.goto("http://localhost:3000/login", {
    waitUntil: "networkidle",
    timeout: 15000,
  });
  await page.waitForTimeout(1500);

  const emailInput = page.locator('input[type="email"]').first();
  const passInput = page.locator('input[type="password"]').first();

  if (await emailInput.isVisible()) {
    await emailInput.fill("test-demo@lovestory.vn");
    await passInput.fill("TestDemo123!");
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Navigate to editor with template 53
  await page.goto("http://localhost:3000/editor/new?template=thiep-cuoi-53", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await page.waitForTimeout(8000);

  console.log("Editor URL:", page.url());

  // Scroll deep to reach plugin widgets (they are after story section ~scroll 5000px)
  // First skip to the bottom half
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(300);
  }
  // Now we're ~10000px down, take screenshots from here
  await page.waitForTimeout(1000);

  for (let i = 1; i <= 12; i++) {
    await page.screenshot({
      path: `/tmp/template53-deep-${i}.png`,
      fullPage: false,
    });
    console.log(`✅ Deep screenshot ${i}`);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(600);
  }

  // Content check
  const allText = await page.locator("body").textContent();
  const keywords = [
    "Ngày trọng đại", "Xác nhận tham dự", "Album ảnh",
    "Thankyou", "designed by lovestory", "TUAN MINH", "MAI TRANG",
    "MB BANK", "VIETCOMBANK", "Nhà hàng Sen Vàng",
  ];
  console.log("\n=== DEEP CONTENT CHECK ===");
  for (const kw of keywords) {
    const found = allText?.toLowerCase().includes(kw.toLowerCase());
    console.log(`  ${found ? "✅" : "❌"} "${kw}"`);
  }
});
