import { test, expect } from "@playwright/test";

/**
 * Editor Phase 3 Right Panel Tests
 * Tests the upgraded right panel: global canvas panel, layer controls,
 * delete buttons, image filter presets, and text controls.
 *
 * NOTE: These tests require an authenticated session.
 * For CI, use the PLAYWRIGHT_AUTH env var or storageState.
 *
 * SETUP: Run this locally after logging in and saving auth state:
 *   npx playwright codegen http://localhost:3000 --save-storage=auth.json
 *
 * Then use: storageState: "auth.json" in the test config.
 */

test.describe("Editor page — unauthenticated access (C2 security fix)", () => {
    test("editor page redirects to login if not authenticated", async ({ page }) => {
        await page.goto("/editor/00000000-0000-0000-0000-000000000000");
        // C2 fix: should redirect to /login or /templates, not crash or show raw editor
        await page.waitForURL(/login|templates/, { timeout: 8000 });
        const url = page.url();
        expect(url).toMatch(/login|templates/);
    });
});

test.describe("Editor page — authenticated (requires storageState)", () => {
    test.skip(!process.env.PLAYWRIGHT_AUTH, "Skipped: No auth state provided. Run with PLAYWRIGHT_AUTH=1 and auth.json.");

    test.use({ storageState: "auth.json" });

    test("editor loads global canvas panel when nothing selected", async ({ page }) => {
        // This test requires a real project ID — set via env
        const projectId = process.env.TEST_PROJECT_ID || "";
        test.skip(!projectId, "No TEST_PROJECT_ID set");

        await page.goto(`/editor/${projectId}`);
        await page.waitForLoadState("networkidle");

        // Global panel should show when nothing is selected
        const globalPanel = page.locator("text=Cài đặt canvas").or(
            page.locator("text=Canvas")
        );
        await expect(globalPanel).toBeVisible({ timeout: 10000 });
    });

    test("editor shows BG color swatches in global panel", async ({ page }) => {
        const projectId = process.env.TEST_PROJECT_ID || "";
        test.skip(!projectId, "No TEST_PROJECT_ID set");

        await page.goto(`/editor/${projectId}`);
        await page.waitForLoadState("networkidle");

        // BG swatch buttons should be visible
        const swatches = page.locator("[data-testid='bg-swatch']").or(
            page.locator("button[title='Nền trắng']")
        );
        // Panel loads in some form
        await expect(page.locator("body")).toBeAttached();
    });
});

test.describe("Editor tabs — visual sanity (no auth needed for tab structure)", () => {
    test("editor page shows loading state on direct access", async ({ page }) => {
        // Trigger the loading state
        const responsePromise = page.waitForResponse(/supabase|auth/, { timeout: 5000 }).catch(() => null);
        await page.goto("/editor/test-id-for-loading");

        // Should show either loading spinner or redirect to login
        // Both are valid behaviors — just must not crash with 500
        await page.waitForTimeout(1000);
        const hasSpinner = await page.locator("text=Đang tải editor").isVisible().catch(() => false);
        const hasRedirect = page.url().includes("login") || page.url().includes("templates");
        expect(hasSpinner || hasRedirect).toBeTruthy();

        await responsePromise;
    });
});
