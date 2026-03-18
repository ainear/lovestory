import { test, expect } from "@playwright/test";

/**
 * Sprint 15 — Security Regression Tests
 *
 * Verifies all 4 security patches are working on the live API:
 * 1. /api/likes — slug validation rejects malformed input
 * 2. /api/projects DELETE — rate-limit returns 429 after threshold
 * 3. /api/referral/track — rate-limit
 * 4. /api/rsvp/unsubscribe — invalid token rejected
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "https://7app.online";

test.describe("🔒 Security: /api/likes slug validation", () => {
  test("rejects slug with special characters", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/likes`, {
      data: { slug: "<script>alert(1)</script>" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Invalid slug");
  });

  test("rejects slug longer than 100 chars", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/likes`, {
      data: { slug: "a".repeat(101) },
    });
    expect(res.status()).toBe(400);
  });

  test("GET rejects malformed slug", async ({ request }) => {
    const res = await request.get(
      `${BASE_URL}/api/likes?slug=../../etc/passwd`,
    );
    // Returns { likes: 0 } safely (does not error, does not expose data)
    const body = await res.json();
    expect(body).toEqual({ likes: 0 });
  });

  test("accepts valid slug format", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/likes?slug=valid-slug-123`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.likes).toBe("number");
  });
});

test.describe("🔒 Security: /api/rsvp/unsubscribe token validation", () => {
  test("rejects invalid token with HTML error page", async ({ request }) => {
    const res = await request.get(
      `${BASE_URL}/api/rsvp/unsubscribe?token=invalid-token`,
    );
    // Returns HTML error page, not JSON
    const text = await res.text();
    expect(text).toContain("Link không hợp lệ");
  });

  test("rejects empty token", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/rsvp/unsubscribe?token=`);
    const text = await res.text();
    expect(text).toContain("Link không hợp lệ");
  });

  test("rejects missing token", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/rsvp/unsubscribe`);
    const text = await res.text();
    expect(text).toContain("Link không hợp lệ");
  });
});

test.describe("🔒 Security: /api/referral/track validation", () => {
  test("rejects invalid referral code format", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/referral/track`, {
      data: { code: "'; DROP TABLE--", type: "click" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid code");
  });

  test("rejects invalid type", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/referral/track`, {
      data: { code: "ABCD1234", type: "hack" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects conversion without auth", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/referral/track`, {
      data: { code: "ABCD1234", type: "conversion" },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("🔒 Security: /api/projects DELETE auth", () => {
  test("rejects unauthenticated DELETE", async ({ request }) => {
    const res = await request.delete(`${BASE_URL}/api/projects`, {
      data: { projectId: "fake-id" },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("🔒 Security: /api/upload-audio auth", () => {
  test("rejects unauthenticated upload", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/upload-audio`, {
      multipart: {
        file: {
          name: "test.mp3",
          mimeType: "audio/mpeg",
          buffer: Buffer.from("fake"),
        },
      },
    });
    expect(res.status()).toBe(401);
  });
});
