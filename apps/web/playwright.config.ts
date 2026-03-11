import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for LoveStory E2E tests.
 * Runs against the local dev server (or staging URL via BASE_URL env).
 */
export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
    ],

    use: {
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },

    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "Mobile", use: { ...devices["iPhone 13"] } },
    ],

    // Auto-start dev server when running locally
    webServer: process.env.BASE_URL ? undefined : {
        command: "pnpm dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
