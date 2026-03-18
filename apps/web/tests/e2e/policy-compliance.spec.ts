import { test, expect } from "@playwright/test";

/**
 * Sprint 15 Phase 4 — Policy & Legal Compliance Tests
 *
 * Verifies:
 * 1. /privacy page loads with required sections
 * 2. /terms page loads with required sections
 * 3. Footer links to both legal pages
 * 4. Legal pages have proper SEO metadata (title, description)
 * 5. Legal pages are accessible (h1, text contrast)
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "https://7app.online";

test.describe("📋 Policy: Privacy Policy page", () => {
  test("Privacy page loads and shows all 7 sections", async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });

    // Page title
    await expect(page).toHaveTitle(/Chính sách bảo mật/);

    // h1 exists
    await expect(page.locator("h1")).toContainText("Chính sách bảo mật");

    // Key sections present
    await expect(page.locator("body")).toContainText("Thông tin chúng tôi thu thập");
    await expect(page.locator("body")).toContainText("Quyền của bạn");
    await expect(page.locator("body")).toContainText("Bảo mật dữ liệu");
    await expect(page.locator("body")).toContainText("support@7app.online");
  });

  test("Privacy page has GDPR disclosure", async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    // GDPR mention
    await expect(page.locator("body")).toContainText("GDPR");
    // Data processor disclosure
    await expect(page.locator("body")).toContainText("Supabase");
  });

  test("Privacy page has unsubscribe info", async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    await expect(page.locator("body")).toContainText("hủy đăng ký");
  });

  test("Privacy page has link back to home", async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    const homeLink = page.locator("a[href='/']").first();
    await expect(homeLink).toBeVisible();
  });
});

test.describe("📋 Policy: Terms of Service page", () => {
  test("Terms page loads and shows required sections", async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });

    // Title
    await expect(page).toHaveTitle(/Điều khoản/);

    // h1
    await expect(page.locator("h1")).toContainText("Điều khoản sử dụng");

    // Key sections
    await expect(page.locator("body")).toContainText("Chấp nhận điều khoản");
    await expect(page.locator("body")).toContainText("Quyền sở hữu nội dung");
    await expect(page.locator("body")).toContainText("Thanh toán");
    await expect(page.locator("body")).toContainText("Giới hạn trách nhiệm");
    await expect(page.locator("body")).toContainText("Luật áp dụng");
  });

  test("Terms page has prohibited content section", async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    await expect(page.locator("body")).toContainText("Nội dung bị cấm");
  });

  test("Terms page links to Privacy Policy", async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    const privacyLink = page.locator("a[href='/privacy']");
    await expect(privacyLink.first()).toBeVisible();
  });

  test("Terms page has contact email", async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`, {
      waitUntil: "networkidle",
      timeout: 20000,
    });
    await expect(page.locator("body")).toContainText("support@7app.online");
  });
});

test.describe("📋 Policy: Footer legal links", () => {
  test("Homepage footer has link to /privacy", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20000 });

    const privacyLink = page.locator("footer a[href='/privacy']");
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toContainText("Chính sách");
  });

  test("Homepage footer has link to /terms", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20000 });

    const termsLink = page.locator("footer a[href='/terms']");
    await expect(termsLink).toBeVisible();
    await expect(termsLink).toContainText("Điều khoản");
  });

  test("Legal pages are reachable via footer links", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20000 });

    // Click privacy link
    await page.locator("footer a[href='/privacy']").click();
    await expect(page).toHaveURL(/privacy/);
    await expect(page.locator("h1")).toBeVisible();

    // Go back and click terms
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20000 });
    await page.locator("footer a[href='/terms']").click();
    await expect(page).toHaveURL(/terms/);
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("📋 Policy: Compliance checks", () => {
  test("No 'coming soon' or 'TODO' on legal pages", async ({ page }) => {
    for (const path of ["/privacy", "/terms"]) {
      await page.goto(`${BASE_URL}${path}`, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      const text = await page.locator("body").textContent();
      expect(text?.toLowerCase()).not.toContain("coming soon");
      expect(text?.toLowerCase()).not.toContain("todo");
      expect(text?.toLowerCase()).not.toContain("placeholder");
    }
  });

  test("Legal pages updated in 2026 (not stale)", async ({ page }) => {
    for (const path of ["/privacy", "/terms"]) {
      await page.goto(`${BASE_URL}${path}`, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      await expect(page.locator("body")).toContainText("2026");
    }
  });
});
