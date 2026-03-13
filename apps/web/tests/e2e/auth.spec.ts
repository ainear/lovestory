import { test, expect } from "@playwright/test";

/**
 * Authentication Flow Tests
 * Tests login redirect, session persistence, and dashboard access guard.
 */

test.describe("Auth — unauthenticated redirects", () => {
    test("dashboard redirects to /login when not authenticated", async ({ page }) => {
        await page.goto("/dashboard", { timeout: 15000 });
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test("editor page redirects to /login when not authenticated", async ({ page }) => {
        // Try to access an editor page directly
        await page.goto("/editor/some-project-id");
        // Should redirect to login or show error, not open raw editor
        await expect(page).toHaveURL(/\/login|\/dashboard|\/templates/);
    });
});

test.describe("Login page — UI", () => {
    test("shows login form with email + password fields", async ({ page }) => {
        await page.goto("/login");

        // Verify form elements are visible
        const emailInput = page.locator("input[type='email']");
        const passwordInput = page.locator("input[type='password']");

        await expect(emailInput.or(page.locator("input[placeholder*='mail']"))).toBeVisible({ timeout: 5000 });
        await expect(passwordInput.or(page.locator("input[placeholder*='mật khẩu'], input[placeholder*='password']"))).toBeVisible({ timeout: 5000 });
    });

    test("shows error on invalid credentials", async ({ page }) => {
        await page.goto("/login");

        // Fill wrong credentials
        await page.fill("input[type='email']", "notexist@test.com");
        await page.fill("input[type='password']", "wrongpassword123");
        await page.click("button[type='submit']");

        // Should show some error message
        await expect(
            page.locator("text=Invalid").or(
                page.locator("text=sai").or(
                    page.locator("[role='alert']")
                )
            )
        ).toBeVisible({ timeout: 8000 });
    });
});

test.describe("Public invitation page — no auth required", () => {
    test("invitation page loads without auth", async ({ page }) => {
        // The demo page or any public slug should load
        const res = await page.goto("/i/demo");
        // Should not redirect to login — it's a public page
        expect(page.url()).not.toContain("/login");
        // Status should be 200 or 404 (if demo slug doesn't exist), never 401
        if (res) {
            expect([200, 404]).toContain(res.status());
        }
    });
});
