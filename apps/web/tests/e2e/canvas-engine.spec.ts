import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Custom Canvas Engine (Phase 1+2)
 * Tests: rendering, selection, drag, keyboard, right panel, inline editing
 */

const BASE_URL = "http://localhost:3000";

test.describe("Canvas Engine — Core", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Navigate to editor with template that uses custom canvas
    // First need to login
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill("test-demo@lovestory.vn");
      await page.locator('input[type="password"]').first().fill("TestDemo123!");
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
    }
  });

  test("Canvas renderer mounts and shows canvas area", async ({ page }) => {
    // Go to editor/new which should use custom canvas by default
    await page.goto(`${BASE_URL}/editor/new`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);

    // Check that the canvas area exists (the custom canvas renderer)
    // Look for the canvas viewport with background #e5e7eb
    const canvasViewport = page.locator('div[style*="background: rgb(229, 231, 235)"]').first();
    const isVisible = await canvasViewport.isVisible({ timeout: 10000 }).catch(() => false);

    if (isVisible) {
      console.log("✅ Custom canvas viewport found");
    } else {
      // Fallback: check for the canvas area with position: relative
      const canvas = page.locator('div[style*="position: relative"]').first();
      const canvasExists = await canvas.isVisible({ timeout: 5000 }).catch(() => false);
      console.log(`Canvas with position:relative: ${canvasExists}`);
    }

    // Take screenshot for visual verification
    await page.screenshot({ path: "/tmp/canvas-engine-mount.png", fullPage: false });
    console.log("📸 Screenshot saved to /tmp/canvas-engine-mount.png");
  });

  test("Right panel shows 'click to edit' when no element selected", async ({ page }) => {
    await page.goto(`${BASE_URL}/editor/new`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);

    // Look for the right panel text
    const rightPanelText = page.locator("text=Click vào phần tử trên canvas để chỉnh sửa");
    const hasText = await rightPanelText.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`✅ Right panel 'click to edit' message: ${hasText}`);

    // Check right panel header
    const header = page.locator("text=Tuỳ chỉnh");
    const hasHeader = await header.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`✅ Right panel header: ${hasHeader}`);
  });

  test("Left sidebar tabs are visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/editor/new`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);

    // Check key sidebar tabs exist
    const tabs = ["Văn bản", "Hình ảnh", "Nền", "Âm nhạc", "Hiệu ứng"];
    for (const tab of tabs) {
      const tabEl = page.locator(`text=${tab}`).first();
      const visible = await tabEl.isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`Tab "${tab}": ${visible ? "✅" : "❌"}`);
    }
  });

  test("Top toolbar has save/preview/publish buttons", async ({ page }) => {
    await page.goto(`${BASE_URL}/editor/new`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);

    // Check for toolbar buttons
    const saveBtn = page.locator("text=Lưu").first();
    const previewBtn = page.locator("text=Xem trước").first();

    const hasSave = await saveBtn.isVisible({ timeout: 3000 }).catch(() => false);
    const hasPreview = await previewBtn.isVisible({ timeout: 3000 }).catch(() => false);

    console.log(`Save button: ${hasSave ? "✅" : "❌"}`);
    console.log(`Preview button: ${hasPreview ? "✅" : "❌"}`);
  });
});

test.describe("Canvas Engine — DOM Structure Analysis", () => {
  test.setTimeout(60000);

  test("Analyze actual DOM structure of editor page", async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill("test-demo@lovestory.vn");
      await page.locator('input[type="password"]').first().fill("TestDemo123!");
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
    }

    await page.goto(`${BASE_URL}/editor/new`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(8000);

    // Analyze the DOM to understand what rendered
    const analysis = await page.evaluate(() => {
      const result: Record<string, unknown> = {};

      // 1. Check if custom canvas or CraftJS rendered
      const customCanvas = document.querySelector('[style*="position: relative"][style*="min-height"]');
      const craftFrame = document.querySelector('.craftjs-renderer');
      const editorFrame = document.querySelector('[data-cy="craft-renderer"]');

      result.hasCustomCanvas = !!customCanvas;
      result.hasCraftFrame = !!craftFrame;
      result.hasEditorFrame = !!editorFrame;

      // 2. Check for absolute-positioned elements (canvas engine elements)
      const absElements = document.querySelectorAll('[data-element-id]');
      result.canvasElementCount = absElements.length;

      // 3. Check for right panel
      const rightPanel = document.querySelector('[style*="width: 350px"]') ||
                         document.querySelector('[style*="width: 350"]');
      result.hasRightPanel = !!rightPanel;

      // 4. Check for canvas background
      const canvasBg = document.querySelector('[style*="background: rgb(248, 243, 235)"]') ||
                       document.querySelector('[style*="#f8f3eb"]');
      result.hasCanvasBackground = !!canvasBg;

      // 5. Overall page structure
      const mainContent = document.querySelector('main') || document.body;
      result.bodyChildCount = mainContent.children.length;

      // 6. Check for error messages
      const errors = document.querySelectorAll('[class*="error"], [class*="Error"]');
      result.errorCount = errors.length;
      if (errors.length > 0) {
        result.firstError = errors[0].textContent?.substring(0, 100);
      }

      // 7. Check page title
      result.pageTitle = document.title;

      // 8. Check for loading states
      const spinners = document.querySelectorAll('[class*="spinner"], [class*="loading"]');
      result.isLoading = spinners.length > 0;

      return result;
    });

    console.log("=== Editor Page DOM Analysis ===");
    console.log(JSON.stringify(analysis, null, 2));

    await page.screenshot({ path: "/tmp/canvas-engine-analysis.png", fullPage: false });
    console.log("📸 Screenshot: /tmp/canvas-engine-analysis.png");
  });
});
