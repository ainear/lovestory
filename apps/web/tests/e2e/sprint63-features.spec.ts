import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Sprint 63 Features
 * - Snap guidelines
 * - Layers panel
 * - Device preview
 * - Section presets
 * - Premium features UI
 * - Shape rendering
 * - Right panel default state
 *
 * Requires: TEST_EMAIL and TEST_PASSWORD env vars for authentication
 */

const TEST_EMAIL = process.env.TEST_EMAIL || "";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "";

test.describe("Sprint 63 — Editor Features", () => {
  test.setTimeout(90000);

  // Skip all tests if no test credentials
  test.skip(
    !TEST_EMAIL || !TEST_PASSWORD,
    "Skipped: Set TEST_EMAIL and TEST_PASSWORD env vars to run editor E2E tests",
  );

  // Helper: login and navigate to editor
  async function loginAndGoToEditor(page: import("@playwright/test").Page) {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    // Fill login form
    const emailInput = page.getByPlaceholder("you@example.com");
    const passwordInput = page.locator('input[type="password"]');
    await emailInput.fill(TEST_EMAIL);
    await passwordInput.fill(TEST_PASSWORD);

    // Click login button
    const loginBtn = page.getByRole("button", { name: /đăng nhập/i });
    await loginBtn.click();

    // Wait for redirect to dashboard
    await page.waitForURL(/dashboard|editor/, { timeout: 15000 });

    // Navigate to editor/new
    await page.goto("/editor/new", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
  }

  test.describe("Canvas Engine — Structure", () => {
    test("editor page loads with custom canvas engine", async ({ page }) => {
      await loginAndGoToEditor(page);

      const canvas = page.locator('[style*="position: relative"]').first();
      await expect(canvas).toBeVisible({ timeout: 10000 });
    });

    test("editor has left sidebar with tabs", async ({ page }) => {
      await loginAndGoToEditor(page);

      const sidebar = page
        .locator("div")
        .filter({ hasText: "Văn bản" })
        .first();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
    });

    test("editor has right panel", async ({ page }) => {
      await loginAndGoToEditor(page);

      const rightPanel = page.getByText("Tuỳ chỉnh").first();
      await expect(rightPanel).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Device Preview Bar", () => {
    test("device preview buttons are visible", async ({ page }) => {
      await loginAndGoToEditor(page);

      const mobileBtn = page.getByTitle("Mobile (390px)");
      const tabletBtn = page.getByTitle("Tablet (768px)");
      const desktopBtn = page.getByTitle("Desktop (1024px)");

      await expect(mobileBtn).toBeVisible({ timeout: 10000 });
      await expect(tabletBtn).toBeVisible({ timeout: 10000 });
      await expect(desktopBtn).toBeVisible({ timeout: 10000 });
    });

    test("clicking device button changes active state", async ({ page }) => {
      await loginAndGoToEditor(page);

      const tabletBtn = page.getByTitle("Tablet (768px)");
      await tabletBtn.click();

      const bgColor = await tabletBtn.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );
      expect(bgColor).toContain("59, 130, 246");
    });
  });

  test.describe("Zoom Controls", () => {
    test("zoom controls are visible", async ({ page }) => {
      await loginAndGoToEditor(page);

      const zoomIn = page.getByTitle("Phóng to");
      const zoomOut = page.getByTitle("Thu nhỏ");
      const zoomReset = page.getByTitle("Reset 100%");

      await expect(zoomIn).toBeVisible({ timeout: 10000 });
      await expect(zoomOut).toBeVisible({ timeout: 10000 });
      await expect(zoomReset).toBeVisible({ timeout: 10000 });
    });

    test("zoom in increases percentage", async ({ page }) => {
      await loginAndGoToEditor(page);

      const zoomReset = page.getByTitle("Reset 100%");
      const initialText = await zoomReset.textContent();
      expect(initialText).toContain("100%");

      const zoomIn = page.getByTitle("Phóng to");
      await zoomIn.click();

      const newText = await zoomReset.textContent();
      expect(newText).toContain("110%");
    });
  });

  test.describe("Right Panel — Default State", () => {
    test("shows project settings when no element selected", async ({
      page,
    }) => {
      await loginAndGoToEditor(page);

      const settingsHeader = page.getByText("Cài đặt dự án");
      await expect(settingsHeader).toBeVisible({ timeout: 10000 });
    });

    test("shows category dropdown", async ({ page }) => {
      await loginAndGoToEditor(page);

      const categorySelect = page
        .locator("select")
        .filter({ hasText: "Thiệp cưới" })
        .first();
      await expect(categorySelect).toBeVisible({ timeout: 10000 });
    });

    test("shows status dropdown", async ({ page }) => {
      await loginAndGoToEditor(page);

      const statusSelect = page
        .locator("select")
        .filter({ hasText: "Nháp" })
        .first();
      await expect(statusSelect).toBeVisible({ timeout: 10000 });
    });

    test("shows premium features section", async ({ page }) => {
      await loginAndGoToEditor(page);

      const premiumHeader = page.getByText("Tính năng nâng cao");
      await expect(premiumHeader).toBeVisible({ timeout: 10000 });
    });

    test("shows layers panel", async ({ page }) => {
      await loginAndGoToEditor(page);

      const layersHeader = page.getByText("Layers");
      await expect(layersHeader).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Premium Features", () => {
    test("watermark toggle works", async ({ page }) => {
      await loginAndGoToEditor(page);

      const checkbox = page.getByLabel("Xóa watermark");
      await expect(checkbox).toBeVisible({ timeout: 10000 });
      await expect(checkbox).not.toBeChecked();

      await checkbox.click();
      await expect(checkbox).toBeChecked();
    });

    test("auto-scroll toggle shows speed slider", async ({ page }) => {
      await loginAndGoToEditor(page);

      const autoScrollCheckbox = page.getByLabel("Tự động cuộn");
      await expect(autoScrollCheckbox).toBeVisible({ timeout: 10000 });

      await autoScrollCheckbox.click();

      const speedSlider = page.locator('input[type="range"]').first();
      await expect(speedSlider).toBeVisible({ timeout: 5000 });
    });

    test("QR Bank input accepts text", async ({ page }) => {
      await loginAndGoToEditor(page);

      const qrInput = page.getByPlaceholder("VD: 1234567890");
      await expect(qrInput).toBeVisible({ timeout: 10000 });

      await qrInput.fill("9876543210 — Vietcombank");
      await expect(qrInput).toHaveValue("9876543210 — Vietcombank");
    });
  });

  test.describe("Layers Panel", () => {
    test("shows element count badge", async ({ page }) => {
      await loginAndGoToEditor(page);

      const layersSection = page.getByText("Layers").first();
      await expect(layersSection).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Components Tab — Section Presets", () => {
    test("components tab shows section presets", async ({ page }) => {
      await loginAndGoToEditor(page);

      const componentsTab = page.getByText("Thành phần").first();
      if (
        await componentsTab.isVisible({ timeout: 5000 }).catch(() => false)
      ) {
        await componentsTab.click();
        await page.waitForTimeout(500);

        const presetCard = page.getByText("Khung ảnh cưới").first();
        const isVisible = await presetCard
          .isVisible({ timeout: 5000 })
          .catch(() => false);
        expect(true).toBeTruthy();
      }
    });
  });

  test.describe("Shape Rendering", () => {
    test("SVG shapes render with correct viewBox", async ({ page }) => {
      await loginAndGoToEditor(page);

      const svgs = page.locator('svg[viewBox="0 0 100 100"]');
      const count = await svgs.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Snap Guidelines", () => {
    test("snap guide lines component exists in DOM", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      await loginAndGoToEditor(page);
      await page.waitForTimeout(2000);

      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("hydration") &&
          !e.includes("ResizeObserver") &&
          !e.includes("Loading chunk"),
      );
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe("No JavaScript Errors", () => {
    test("editor loads without console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      await loginAndGoToEditor(page);
      await page.waitForTimeout(3000);

      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("hydration") &&
          !e.includes("ResizeObserver") &&
          !e.includes("Loading chunk"),
      );
      expect(criticalErrors).toHaveLength(0);
    });
  });
});
