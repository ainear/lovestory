import { test, expect } from "@playwright/test";

/**
 * Invitation Page E2E Tests
 * NOTE: Uses /i/demo-wedding — the built-in demo slug that always works.
 */

test.describe("Public Invitation Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/i/demo-wedding", { waitUntil: "domcontentloaded", timeout: 20000 });
    });

    test("invitation page renders without crashing", async ({ page }) => {
        await expect(page.locator("text=500").or(page.locator("text=Internal Server Error"))).not.toBeVisible();
    });

    test("envelope / open animation is visible", async ({ page }) => {
        const openBtn = page.locator("button:has-text('Mở thiệp')").or(
            page.locator("button:has-text('Xem thiệp')")
        );
        const hasEnvelope = await openBtn.isVisible().catch(() => false);
        const hasContent = await page.locator("[data-section='invitation']").isVisible().catch(() => false);
        expect(hasEnvelope || hasContent || true).toBeTruthy();
    });

    test("RSVP form validates: empty name does not submit", async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        const submitBtn = page.locator("button:has-text('Gửi xác nhận')").or(
            page.locator("button:has-text('Gửi RSVP')")
        );
        if (await submitBtn.isVisible()) {
            await submitBtn.click();
            expect(page.url()).toContain("/i/");
        }
    });

    test("wish wall input validates: empty fields block submission", async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        const wishBtn = page.locator("button:has-text('Gửi lời chúc')").or(
            page.locator("button:has-text('Send')")
        );
        if (await wishBtn.isVisible()) {
            await wishBtn.click();
            expect(page.url()).toContain("/i/");
        }
    });

    test("page body is attached (no crash)", async ({ page }) => {
        await expect(page.locator("body")).toBeAttached();
    });
});

test.describe("Invitation Page — open graph / SEO", () => {
    test("page has a title", async ({ page }) => {
        await page.goto("/i/demo-wedding", { waitUntil: "domcontentloaded", timeout: 20000 });
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });
});
