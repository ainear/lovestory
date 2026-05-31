/**
 * k6 Stress Test — LoveStory (S17 / P1)
 *
 * Run (local):  k6 run tests/stress/stress-test.js
 * Run (prod):   BASE_URL=https://7app.online k6 run tests/stress/stress-test.js
 *
 * ⚠️  Set TEST_SLUG to a real invitation slug from your project!
 *     Find it at: https://7app.online/dashboard → copy any invitation link
 *     Example: BASE_URL=https://7app.online TEST_SLUG=your-real-slug k6 run tests/stress/stress-test.js
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// ── Custom metrics ───────────────────────────────────────────────────────────
const rsvpRateLimited = new Counter("rsvp_rate_limited_count");
const viewCountCalls  = new Counter("view_count_calls");
const viewCountErrors = new Rate("view_count_errors");
const pageLoadTime    = new Trend("page_load_ms");

// ── Config ───────────────────────────────────────────────────────────────────
const BASE            = __ENV.BASE_URL       || "http://localhost:3000";
const TEST_SLUG       = __ENV.TEST_SLUG      || "demo-wedding";  // ← set to real slug!
const TEST_PROJECT_ID = __ENV.TEST_PROJECT_ID || "test-project-stress";

// HTTP options with explicit timeout — prevents VUs hanging forever
const HTTP_OPTS = {
  timeout: "10s",
  headers: { Accept: "text/html" },
  // Mark 402/404/429 as "expected" — NOT counted as failures
  responseCallback: http.expectedStatuses(
    { min: 200, max: 299 },
    402, 404, 429
  ),
};

// ── Load Profile — Conservative ───────────────────────────────────────────────
export const options = {
  stages: [
    { duration: "20s", target: 5  },  // ramp up
    { duration: "40s", target: 10 },  // peak
    { duration: "20s", target: 0  },  // cool down
  ],
  gracefulStop: "10s",
  thresholds: {
    // p95 < 3s (accounts for prod latency + CDN)
    http_req_duration: ["p(95)<3000"],
    // < 10% REAL errors (excludes 402/404/429 via expectedStatuses above)
    http_req_failed: ["rate<0.10"],
  },
};

// ── Scenario 1: View invitation page ────────────────────────────────────────
function viewInvitation() {
  const start = Date.now();
  const res   = http.get(`${BASE}/i/${TEST_SLUG}`, HTTP_OPTS);
  pageLoadTime.add(Date.now() - start);

  check(res, {
    "invitation page not 5xx":       (r) => r.status < 500,
    "invitation page has body":      (r) => (r.body?.length ?? 0) > 100,
    "invitation page 200 or 404":    (r) => [200, 404].includes(r.status),
  });
}

// ── Scenario 2: View count API call ──────────────────────────────────────────
function trackView() {
  viewCountCalls.add(1);
  const res = http.post(
    `${BASE}/api/view-count`,
    JSON.stringify({ projectId: TEST_PROJECT_ID }),
    { ...HTTP_OPTS, headers: { "Content-Type": "application/json" } }
  );

  const ok = check(res, {
    "view-count 200/402 (quota ok/exceeded)": (r) => [200, 402].includes(r.status),
    "view-count not 500":                     (r) => r.status !== 500,
  });

  viewCountErrors.add(ok ? 0 : 1);
}

// ── Scenario 3: RSVP submission ──────────────────────────────────────────────
function submitRSVP() {
  const guestNum = Math.floor(Math.random() * 10000);
  const res = http.post(
    `${BASE}/api/rsvp`,
    JSON.stringify({
      projectId: TEST_PROJECT_ID,
      guestName: `Guest ${guestNum}`,
      status:    "confirmed",
      guestCount: 2,
    }),
    { ...HTTP_OPTS, headers: { "Content-Type": "application/json" } }
  );

  if (res.status === 429) rsvpRateLimited.add(1);

  check(res, {
    "rsvp not 500":                   (r) => r.status !== 500,
    "rsvp accepted/rate-limited/400": (r) => [200, 201, 400, 429].includes(r.status),
  });
}

// ── Main VU loop ──────────────────────────────────────────────────────────────
export default function () {
  const roll = Math.random();

  if      (roll < 0.60) viewInvitation();  // 60%: browse invitation
  else if (roll < 0.85) trackView();       // 25%: track view count
  else                  submitRSVP();      // 15%: submit RSVP

  sleep(1 + Math.random() * 2);           // realistic 1-3s think time
}

// ── Summary (stdout only — no file write) ─────────────────────────────────────
export function handleSummary(data) {
  const failed     = data.metrics.http_req_failed?.values?.rate    ?? 0;
  const p95        = data.metrics.http_req_duration?.values?.["p(95)"] ?? 0;
  const reqs       = data.metrics.http_reqs?.values?.count         ?? 0;
  const rateLim    = data.metrics.rsvp_rate_limited_count?.values?.count ?? 0;
  const slugNote   = TEST_SLUG === "demo-wedding"
    ? "\n⚠️  Using default slug 'demo-wedding' — set TEST_SLUG=<real-slug> for accurate results"
    : "";

  console.log(`
📊 STRESS TEST RESULTS (${BASE})${slugNote}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Total requests:  ${reqs}
📈 p95 resp time:   ${p95.toFixed(0)}ms  ${p95 < 3000 ? "✅" : "❌ FAIL"}
💥 Error rate:      ${(failed * 100).toFixed(2)}%     ${failed < 0.10 ? "✅" : "❌ FAIL (real errors, not 402/404/429)"}
🚦 RSVP rate-lim:   ${rateLim} times
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  return {};  // no file write = no blocking
}
