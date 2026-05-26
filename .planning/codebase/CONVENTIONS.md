# Code Conventions

## Language & Style

- **Language:** TypeScript strict mode (`"strict": true` in tsconfig)
- **Target:** ES2017, module resolution: bundler (Next.js 16)
- **Linter:** ESLint 9 (flat config) with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- **Formatter:** No Prettier config found — formatting likely handled via ESLint rules
- **React version:** React 19 with React Compiler (some hooks rules disabled as false positives)
- **Disabled rules:** `react-compiler/react-compiler: off`, `@typescript-eslint/no-explicit-any: warn`
- **Node:** v22 (enforced in CI via `.nvmrc`)
- **Package manager:** pnpm v9 (monorepo)

## Naming Patterns

- **Files/components:** PascalCase for React components (`CookieBanner.tsx`, `UpgradeCTA.tsx`, `ErrorBoundary.tsx`)
- **Utility/lib files:** kebab-case (`rate-limit.ts`, `admin.ts`, `error-boundary.tsx`)
- **API routes:** Next.js App Router convention — `route.ts` inside folder (`/api/rsvp/route.ts`)
- **Test files:** `*.test.ts` for unit (Vitest), `*.spec.ts` for E2E (Playwright)
- **Functions:** camelCase (`checkRateLimit`, `verifyAdmin`, `getAdminClient`, `isAdminUser`)
- **Interfaces:** PascalCase prefixed or suffixed with domain (`RateLimitOptions`, `RateLimitResult`, `ErrorBoundaryProps`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_ENTRIES`, `PLAN_QUOTAS`, `PROMPTS`)
- **Environment vars:** `NEXT_PUBLIC_` prefix for client-accessible, plain for server-only

## Component Patterns

- **"use client" directive:** Required at top of client components (`CookieBanner.tsx`, `UpgradeCTA.tsx`, tRPC client)
- **Props interface:** Always explicitly typed with `interface ComponentNameProps`
- **Default export:** Components use `export default function ComponentName()`
- **Named exports:** Utilities/classes use named exports (`export class ErrorBoundary`, `export function checkRateLimit`)
- **Styling:** Mix of Tailwind CSS v4 classes (utility-first) and inline styles for dynamic/animated elements
- **Error boundary:** Class component wrapping Sentry (`ErrorBoundary.tsx`) — catches render errors
- **State pattern:** `useState` + `useEffect` for client state; server components fetch directly

## API Route Patterns

- **Location:** `src/app/api/<resource>/route.ts` (Next.js App Router)
- **HTTP methods:** Named exports (`GET`, `POST`, `PATCH`, `DELETE`)
- **Auth check first:** Routes verify auth/admin at top before any business logic
- **Rate limiting:** Applied via `checkRateLimit()` from `@/lib/rate-limit` — keyed by IP or user ID
- **Input validation:** Manual validation (no Zod in routes yet) — check existence, type, length
- **Honeypot:** RSVP route uses silent `website` field — bots get fake 200 success
- **Response format:** `NextResponse.json({ error: "..." }, { status: N })` for errors, `NextResponse.json({ success: true, data })` for success
- **Supabase client:** `createClient()` from `@/lib/supabase/server` for user-context, `getAdminClient()` for service-role operations
- **Fire-and-forget:** Non-critical side effects (email notify) use `void (async () => { ... })()`
- **Error logging:** `console.error("[scope] message:", error)` pattern

## Error Handling

- **API routes:** try/catch wrapping entire handler body, return 500 on unhandled errors
- **DB errors:** Check `error` from Supabase calls, log + return 500
- **Auth errors:** Return 401/403 immediately — early return pattern
- **Client:** `ErrorBoundary` class component with Sentry integration captures render errors
- **Non-fatal errors:** Email failures are caught and logged but don't surface to users
- **Edge cases:** `catch {}` (empty catch) used in server components for cookie set errors (intentional)

## Import Style

- **Path alias:** `@/*` maps to `./src/*` — used for internal imports (`@/lib/...`, `@/config/...`, `@/server/...`)
- **External packages:** Standard npm package names
- **Type imports:** `import type { ... }` used for type-only imports (`import type { PlanId } from "@/config/plans"`)
- **React:** Import from `"react"` — no default React import needed (react-jsx transform)
- **Next.js:** Import from `"next/server"`, `"next/headers"`, `"next/navigation"`

## Key Patterns

- **Rate limiting:** In-memory Map with LRU-style eviction (cap at 5000 entries) — serverless-safe, no Redis
- **Admin guard:** Double-check pattern — env `ADMIN_EMAIL` + DB `user_roles` table (defense-in-depth)
- **Supabase clients:** Three variants — SSR client (cookies), server client (headers), service-role admin client
- **tRPC:** Used alongside REST API routes — `@trpc/react-query` with `superjson` transformer, `staleTime: 5s`
- **React Query:** Configured globally via TRPCProvider with `refetchOnWindowFocus: false`
- **Input sanitization:** Strip HTML tags with regex `/<[^>]*>/g`, trim, slice to maxLen — used in RSVP
- **Plan-based quotas:** `PLAN_QUOTAS` constant drives all quota checks — free=300, basic=10k, premium=Infinity
- **Atomic DB operations:** Use Supabase RPC (`increment_view_count`) for concurrent-safe increments
- **Monorepo packages:** `@lovestory/shared`, `@lovestory/db`, `@lovestory/web` — filtered via `pnpm --filter`
