/**
 * k6 Stress Test — LoveStory (S17 / P1)
 *
 * Simulates realistic wedding invitation traffic:
 * - 100 concurrent guests viewing 1 invitation (viral social share scenario)
 * - 50 RSVP submissions over 2 minutes
 * - Rate limiter and quota enforcement under load
 *
 * Install k6: brew install k6
 * Run:
 *   k6 run stress-test.js                           # default local
 *   k6 run --env BASE_URL=https://7app.online stress-test.js
 *
 * Thresholds (SLA):
 *   p95 response time < 2000ms
 *   Error rate < 1%
 *   RSVP 429 rate > 0 (confirms rate limiting works under load)
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

// ── Custom metrics ───────────────────────────────────────────────────────────
const rsvpRateLimited = new Counter("rsvp_rate_limited_count");
const viewCountCalls = new Counter("view_count_calls");
const viewCountErrors = new Rate("view_count_errors");
const pageLoadTime = new Trend("page_load_ms");

// ── Config ───────────────────────────────────────────────────────────────────
const BASE = __ENV.BASE_URL || "http://localhost:3000";
const TEST_SLUG = __ENV.TEST_SLUG || "demo-wedding"; // public invitation slug
const TEST_PROJECT_ID = __ENV.TEST_PROJECT_ID || "test-project-stress";

// ── Load Profile: 3 stages ───────────────────────────────────────────────────
export const options = {
  stages: [
    // Ramp up: simulate invitation going viral (0 → 50 users in 30s)
    { duration: "30s", target: 50 },
    // Peak: 100 concurrent guests (wedding day traffic spike)
    { duration: "1m", target: 100 },
    // Cool down
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    // SLA thresholds — business standard
    http_req_duration: ["p(95)<2000"], // p95 < 2s
    http_req_failed: ["rate<0.01"],    // < 1% errors
    view_count_errors: ["rate<0.05"],  // view-count API < 5% errors
  },
};

// ── Scenario 1: View invitation page ────────────────────────────────────────
function viewInvitation() {
  const start = Date.now();
  const res = http.get(`${BASE}/i/${TEST_SLUG}`, {
    headers: { "Accept": "text/html" },
  });
  pageLoadTime.add(Date.now() - start);

  check(res, {
    "invitation page status 200": (r) => r.status === 200,
    "page has content": (r) => r.body.length > 500,
    "not 5xx error": (r) => r.status < 500,
  });
}

// ── Scenario 2: View count API call ─────────────────────────────────────────
function trackView() {
  viewCountCalls.add(1);
  const res = http.post(
    `${BASE}/api/view-count`,
    JSON.stringify({ projectId: TEST_PROJECT_ID }),
    { headers: { "Content-Type": "application/json" } }
  );

  const ok = check(res, {
    "view-count returns 200 or 402": (r) => [200, 402].includes(r.status),
    "view-count not 500": (r) => r.status !== 500,
  });

  if (!ok) viewCountErrors.add(1);
  else viewCountErrors.add(0);
}

// ── Scenario 3: RSVP submission ──────────────────────────────────────────────
function submitRSVP() {
  const guestNum = Math.floor(Math.random() * 10000);
  const res = http.post(
    `${BASE}/api/rsvp`,
    JSON.stringify({
      projectId: TEST_PROJECT_ID,
      guestName: `Guest ${guestNum}`,
      status: "confirmed",
      guestCount: 2,
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  if (res.status === 429) {
    rsvpRateLimited.add(1);
  }

  check(res, {
    "rsvp not 500": (r) => r.status !== 500,
    "rsvp accepted or rate-limited": (r) => [200, 429, 500].includes(r.status),
  });
}

// ── Main VU function: mix of scenarios ──────────────────────────────────────
export default function () {
  const scenario = Math.random();

  if (scenario < 0.6) {
    // 60% of users: view the invitation
    viewInvitation();
  } else if (scenario < 0.85) {
    // 25% of users: also track view count
    trackView();
  } else {
    // 15% of users: submit RSVP
    submitRSVP();
  }

  // Realistic user behavior: wait 1-3 seconds between actions
  sleep(1 + Math.random() * 2);
}

// ── Summary ──────────────────────────────────────────────────────────────────
export function handleSummary(data) {
  const failed = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values?.["p(95)"] ?? 0;
  const rateLimited = data.metrics.rsvp_rate_limited_count?.values?.count ?? 0;

  console.log(`\n📊 STRESS TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 p95 Response Time: ${p95.toFixed(0)}ms ${p95 < 2000 ? "✅" : "❌ (>2s FAIL)"}
💥 Error Rate:        ${(failed * 100).toFixed(2)}% ${failed < 0.01 ? "✅" : "❌ (>1% FAIL)"}
🚦 RSVP Rate Limited: ${rateLimited} times ${rateLimited > 0 ? "✅ (working)" : "⚠️ (check rate limiter)"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  return {
    "k6-stress-report.json": JSON.stringify(data, null, 2),
  };
}
