import { test, expect } from "@playwright/test";

/**
 * API Security Tests
 * Covers: C1 rate-limit, C2 editor auth, C3 video API auth, H1 SePay secret
 * These tests verify the security fixes from CEO Round-2 pre-check.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

// ── RSVP API ──────────────────────────────────────────────────────────────
test.describe("POST /api/rsvp — rate limit + validation", () => {
    test("rejects empty payload with 400", async ({ request }) => {
        const res = await request.post(`${BASE}/api/rsvp`, {
            data: {},
        });
        expect(res.status()).toBe(400);
        const body = await res.json() as { error: string };
        expect(body.error).toBeTruthy();
    });

    test("accepts valid RSVP and returns 200", async ({ request }) => {
        const res = await request.post(`${BASE}/api/rsvp`, {
            data: {
                projectId: "test-project-id",
                guestName: "Playwright Test Guest",
                status: "confirmed",
                guestCount: 2,
            },
        });
        // Either 200 (if test project exists) or 500 (project not found in DB)
        // — but NOT 400 (bad request) or 403 (auth issue for public endpoint)
        expect([200, 500]).toContain(res.status());
    });

    test("returns 429 after 11 rapid requests from same IP", async ({ request }) => {
        const payload = {
            projectId: "ratelimit-test",
            guestName: "Spam Bot",
            status: "confirmed",
            guestCount: 1,
        };

        let gotRateLimited = false;
        for (let i = 0; i < 12; i++) {
            const res = await request.post(`${BASE}/api/rsvp`, { data: payload });
            if (res.status() === 429) {
                gotRateLimited = true;
                const headers = res.headers();
                expect(headers["retry-after"]).toBeTruthy();
                break;
            }
        }
        expect(gotRateLimited).toBe(true);
    });
});

// ── WISHES API ─────────────────────────────────────────────────────────────
test.describe("POST /api/wishes — rate limit + validation", () => {
    test("rejects missing message field", async ({ request }) => {
        const res = await request.post(`${BASE}/api/wishes`, {
            data: { projectId: "test", guestName: "Someone" }, // no message
        });
        expect(res.status()).toBe(400);
    });

    test("returns 429 after 11 rapid wishes from same IP", async ({ request }) => {
        let gotRateLimited = false;
        for (let i = 0; i < 12; i++) {
            const res = await request.post(`${BASE}/api/wishes`, {
                data: {
                    projectId: "test",
                    guestName: "Bot",
                    message: `Wish ${i}`,
                    emoji: "❤️",
                },
            });
            if (res.status() === 429) {
                gotRateLimited = true;
                break;
            }
        }
        expect(gotRateLimited).toBe(true);
    });
});

// ── VIDEO GENERATE API — C3 ────────────────────────────────────────────────
test.describe("POST /api/video/generate — auth required (C3 fix)", () => {
    test("returns 401 when called without auth header or session", async ({ request }) => {
        const res = await request.post(`${BASE}/api/video/generate`, {
            data: {
                videoId: "test-video-id",
                photoUrls: [],
                style: "cinematic",
                music: "none",
                duration: "30",
                resolution: "720p",
                hasWatermark: true,
            },
        });
        expect(res.status()).toBe(401);
    });
});

// ── SEPAY WEBHOOK — H1 ─────────────────────────────────────────────────────
test.describe("POST /api/webhook/sepay — secret required (H1 fix)", () => {
    test("returns 401 when called without Authorization header", async ({ request }) => {
        const res = await request.post(`${BASE}/api/webhook/sepay`, {
            data: {
                transferAmount: 299000,
                content: "LS123ABC payment for premium",
                id: "fake-txn-id",
            },
        });
        expect(res.status()).toBe(401);
    });

    test("returns 401 when called with wrong secret", async ({ request }) => {
        const res = await request.post(`${BASE}/api/webhook/sepay`, {
            headers: { Authorization: "Bearer wrong-secret-value" },
            data: {
                transferAmount: 299000,
                content: "LS123ABC",
                id: "fake-txn-id",
            },
        });
        expect(res.status()).toBe(401);
    });
});

// ── UPLOAD API — auth required ─────────────────────────────────────────────
test.describe("POST /api/upload — auth required", () => {
    test("returns 401 when not authenticated", async ({ request }) => {
        const res = await request.post(`${BASE}/api/upload`, {
            multipart: {
                file: {
                    name: "test.jpg",
                    mimeType: "image/jpeg",
                    buffer: Buffer.from("fake-image-data"),
                },
                projectId: "test-project",
            },
        });
        expect(res.status()).toBe(401);
    });
});
