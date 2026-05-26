# Testing

## Framework

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | ^4.1.0 | Unit tests |
| **Playwright** | ^1.58.2 | E2E + integration tests |
| **k6** | — | Stress/load testing |
| **@vitest/coverage-v8** | ^4.1.0 | Code coverage |

## Test Structure

```
apps/web/
├── src/lib/__tests__/          # Unit tests (co-located with lib)
│   ├── rate-limit.test.ts
│   └── view-count-quota.test.ts
└── tests/
    ├── e2e/                    # Playwright E2E specs (~43 files)
    │   ├── p0-business-critical.spec.ts
    │   ├── launch-smoke.spec.ts
    │   ├── api-security.spec.ts
    │   ├── auth.spec.ts
    │   ├── editor-*.spec.ts
    │   ├── sprint*.spec.ts     # Sprint-based regression specs
    │   └── ...
    └── stress/                 # k6 stress tests
        └── stress-test.js
```

**Vitest config:** `src/**/*.test.ts` and `src/**/*.test.tsx` (env: node, globals: true)

**Playwright config:** `tests/e2e/*.spec.ts` — Desktop Chrome + iPhone 13, fully parallel

## Test Types

### Unit Tests (Vitest)
- **Location:** `src/lib/__tests__/`
- **Pattern:** Isolated pure function tests — no real DB, no HTTP
- **Style:** `describe` > `describe` (nested) > `it` with explicit labels
- **Fixtures:** Factory functions (`createRateLimiter()`) to avoid shared state between tests
- **Priority labels:** P0 tests marked in JSDoc as `P0 Unit Tests — <Feature> (Business Critical)`

### E2E Tests (Playwright)
- **Location:** `tests/e2e/`
- **Pattern:** `test.describe()` grouping by feature/route + `test()` per scenario
- **API testing:** Uses `request` fixture for direct API calls without browser
- **Browser testing:** Uses `page` fixture for UI flows
- **Base URL:** `process.env.BASE_URL || "http://localhost:3000"` — supports CI staging
- **Retry:** 2 retries in CI, 0 locally

### Stress Tests (k6)
- **Location:** `tests/stress/`
- **Runner:** `pnpm test:stress` → `k6 run tests/stress/stress-test.js`

## Current Coverage

### Unit tests cover:
- `checkRateLimit()` — 163 lines, 11 test cases (IP isolation, window reset, per-project limits)
- View count quota logic — 179 lines, 15+ test cases (free/basic/premium boundaries, XSS sanitization)

### E2E tests cover (~43 spec files):
- **P0 Business Critical:** View count quota, RSVP security (honeypot, XSS, validation), webhook auth, dashboard auth guards, JSON-LD SEO
- **Authentication:** Login, register, redirect flows
- **Editor flows:** Canvas engine, tab navigation, free transform, phase-based regression
- **Invitation page:** Public guest view, slug access control
- **API security:** Rate limiting, auth headers, CORS
- **Accessibility:** Basic a11y checks
- **Performance:** Core Web Vitals checks
- **Sprint regressions:** Sprints 2–16 each have dedicated spec files
- **Feature-specific:** RSVP realtime, email, marketplace/commission, music/templates, AI editor

### Coverage thresholds (Vitest):
- Lines: **60%** minimum
- Functions: **60%** minimum
- Scope: `src/lib/**` and `src/app/api/**` (excludes integration tests)

## CI/CD

**File:** `.github/workflows/ci.yml`

**Trigger:** Pull requests to `main` only (not every push — Vercel handles push deploys)

**Steps:**
1. Install deps (pnpm v9, Node 22)
2. `pnpm --filter @lovestory/shared type-check` (continue-on-error)
3. `pnpm --filter @lovestory/db type-check` (continue-on-error)
4. `pnpm --filter @lovestory/web lint` (continue-on-error — react-compiler false positives)
5. `pnpm --filter @lovestory/web type-check` (**blocking gate**)

**Note:** CI currently runs **lint + type-check only** — unit and E2E tests are NOT part of CI pipeline yet.

**Additional workflow:** `supabase-keepalive.yml` — pings Supabase every 4 days (cron: `0 8 */4 * *`) to prevent free-tier auto-pause.

## NPM Test Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test:unit` | `vitest run` | Run unit tests once |
| `test:unit:watch` | `vitest` | Watch mode |
| `test:unit:coverage` | `vitest run --coverage` | Coverage report |
| `test:e2e` | `playwright test` | All E2E tests |
| `test:e2e:ui` | `playwright test --ui` | Interactive Playwright UI |
| `test:p0` | `playwright test ...p0-business-critical.spec.ts` | P0 critical only |
| `test:smoke` | `playwright test ...launch-smoke.spec.ts` | Smoke test |
| `test:security` | `playwright test ...api-security.spec.ts` | Security audit |
| `test:auth` | `playwright test ...auth.spec.ts` | Auth flows |
| `test:all` | vitest + 3 E2E spec files | Recommended pre-deploy |
| `test:stress` | `k6 run tests/stress/stress-test.js` | Load test |

## Gaps

| Area | Status | Priority |
|------|--------|---------|
| Unit tests for API routes | ❌ None | High — business logic in routes |
| CI runs unit/E2E tests | ❌ Not in pipeline | High — only lint+tsc run |
| Integration tests for Supabase | ❌ None | Medium |
| tRPC router tests | ❌ None | Medium |
| Component unit tests | ❌ None | Medium — no React Testing Library |
| Coverage above 60% threshold | ⚠️ Only 2 test files | High — many lib functions untested |
| Webhook handler tests | ❌ Only E2E (auth reject) | High — payment critical |
| Admin route tests | ❌ None | Medium |
| Email service tests | ❌ None | Low |
