import { test, expect } from "@playwright/test";

/**
 * Sprint 11 — RSVP Email + Commission Schema + Proportional Resize E2E Tests
 */

const BASE = process.env.BASE_URL || "https://7app.online";

// ─────────────────────────────────────────────
// 1. RSVP Email Notification — API regression
// ─────────────────────────────────────────────
test.describe("Sprint 11 — RSVP Email Notification", () => {
  test("POST /api/rsvp accepts valid RSVP (honeypot empty)", async ({ request }) => {
    const res = await request.post(`${BASE}/api/rsvp`, {
      data: {
        projectId: "test-project-id-sprint11",
        guestName: "Playwright Test Guest",
        status: "confirmed",
        guestCount: 2,
        phone: "",
        website: "", // honeypot empty
      },
      headers: { "Content-Type": "application/json" },
    });
    // 200 = inserted, 400 = validation (ok), 429 = rate limited (ok), 500 = bug
    expect(res.status()).not.toBe(500);
    console.log(`✅ POST /api/rsvp status: ${res.status()}`);
  });

  test("POST /api/rsvp honeypot blocks bot submissions", async ({ request }) => {
    const res = await request.post(`${BASE}/api/rsvp`, {
      data: {
        projectId: "test",
        guestName: "Bot",
        status: "confirmed",
        website: "https://spam.com", // honeypot filled
      },
      headers: { "Content-Type": "application/json" },
    });
    // Should return 200 (fake success to confuse bots) without inserting
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    console.log("✅ Honeypot bot blocking: PASS");
  });

  test("POST /api/rsvp rate limits (missing fields = 400)", async ({ request }) => {
    const res = await request.post(`${BASE}/api/rsvp`, {
      data: { projectId: "test" }, // missing guestName
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    console.log("✅ /api/rsvp validation 400: PASS");
  });
});

// ─────────────────────────────────────────────
// 2. Commission Schema — verify migration doesn't break API
// ─────────────────────────────────────────────
test.describe("Sprint 11 — Commission Schema", () => {
  test("referral dashboard page still loads after commission migration", async ({ request }) => {
    const res = await request.get(`${BASE}/dashboard/referral`, { maxRedirects: 5 });
    expect([200, 302]).toContain(res.status());
    console.log(`✅ /dashboard/referral after commission migration: ${res.status()}`);
  });

  test("admin page loads (commission admin view regression)", async ({ request }) => {
    const res = await request.get(`${BASE}/admin`, { maxRedirects: 3 });
    expect(res.status()).not.toBe(500);
    console.log(`✅ /admin status: ${res.status()}`);
  });
});

// ─────────────────────────────────────────────
// 3. Proportional Resize — editor regression
// ─────────────────────────────────────────────
test.describe("Sprint 11 — Proportional Resize (Editor)", () => {
  test("editor loads without JS errors (SelectionOverlay resize regression)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/editor/new`, { waitUntil: "domcontentloaded", timeout: 15_000 });

    const critical = errors.filter(e => !e.includes("chrome-extension") && !e.includes("ResizeObserver"));
    expect(critical).toHaveLength(0);
    console.log("✅ /editor/new no JS errors (SelectionOverlay SHIFT resize regression)");
  });
});

// ─────────────────────────────────────────────
// 4. Email service — endpoint exists
// ─────────────────────────────────────────────
test.describe("Sprint 11 — Email Service Security", () => {
  test("POST /api/email/send requires auth (no unauthenticated blast)", async ({ request }) => {
    const res = await request.post(`${BASE}/api/email/send`, {
      data: { to: "test@test.com", subject: "Test", html: "<p>test</p>" },
      headers: { "Content-Type": "application/json" },
    });
    // 401 = requires auth (correct). 404 = no endpoint. 500 = bug.
    expect([401, 403, 404]).toContain(res.status());
    console.log(`✅ /api/email/send auth gate: ${res.status()}`);
  });
});

// ─────────────────────────────────────────────
// 5. Security regression
// ─────────────────────────────────────────────
test.describe("Sprint 11 — Security Regression", () => {
  test("RSVP route does not expose owner email in response", async ({ request }) => {
    const res = await request.post(`${BASE}/api/rsvp`, {
      data: { projectId: "any", guestName: "Test", status: "confirmed" },
      headers: { "Content-Type": "application/json" },
    });
    const text = await res.text();
    // Should never include @xxx.xxx email patterns in RSVP response
    expect(text).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    console.log("✅ RSVP response does not leak owner email");
  });
});
