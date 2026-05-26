# Technical Concerns — LoveStory

> Generated: 2026-05-26 | Pass 4 — Concerns Focus
> Source: `/Users/mini4/AAA/lovestory/apps/web/src`

---

## Technical Debt

### TODOs / FIXMEs
- **Không có TODO/FIXME/HACK/XXX** nào trong codebase (`src/`) — đây là điều tốt.
- Nhưng có nhiều `eslint-disable-next-line` comments (34 occurrences) thay thế cho việc fix properly.

### ESLint Suppressions (Tech Debt)
| File | Count | Type |
|------|-------|------|
| `app/i/[slug]/CanvasInvitation.tsx` | 8 | `@no-img-element`, `@no-explicit-any` |
| `app/editor/new/page.tsx` | 2 | `@no-explicit-any`, `react-hooks/exhaustive-deps` |
| `editor/[id]/components/sidebar/FloatingToolbar.tsx` | 4 | `@no-explicit-any` |
| `app/editor/[id]/components/Canvas.tsx` | 1 | `react-hooks/exhaustive-deps` |
| `server/trpc/middleware/feature-gate.ts` | 3 | `@no-explicit-any` |
| `app/dashboard/rsvp/page.tsx` | 2 | `react-hooks/exhaustive-deps` |
| `app/api/video/generate/route.ts` | 2 | `@no-explicit-any` |
| `app/admin/blog/page.tsx` | 1 | `react-hooks/exhaustive-deps` |

### Plans: Subscriptions có `expires_at: null`
- File: `webhook/sepay/route.ts:97` và `admin/orders/route.ts:130`
- `expires_at: null` — subscriptions hiện tại là **"Lifetime"** (không có expiry)
- Khi chuyển sang mô hình billing hàng tháng sẽ cần migration logic

---

## Security Concerns

### 🟡 MEDIUM: `auth.admin.getUserById()` trong public route
- **File:** `app/api/rsvp/route.ts:100`
- RSVP route dùng `supabase.auth.admin.getUserById()` nhưng client này được tạo với `anon key` (không phải service role)
- Nếu anon key không có quyền admin, call này có thể fail silently (code bọc trong fire-and-forget)
- **Không gây lỗi cho user** nhưng email thông báo RSVP có thể không gửi được

### 🟡 MEDIUM: `view-count/route.ts` — fallback dùng anon key
- **File:** `app/api/view-count/route.ts:55`
- ```ts
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ```
- Trong dev mode (khi thiếu `SUPABASE_SERVICE_ROLE_KEY`), sẽ fallback sang anon key
- Anon key không đủ quyền cho `upsert` trên `view_counts` — gây silent failure

### 🟡 MEDIUM: In-memory rate limiter không persist qua restarts
- **File:** `app/api/ai/text-suggest/route.ts:17`
- Comment rõ: _"resets on cold start — good enough for free tier"_
- Vercel serverless có nhiều instances → rate limit per-process, không global
- Attacker có thể bypass bằng cách tạo nhiều requests đồng thời

### 🟢 LOW: `UNSUB_SECRET` fallback chain có hardcoded default
- **File:** `server/services/email.ts:9`
- ```ts
  const UNSUB_SECRET = process.env.UNSUBSCRIBE_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "lovestory-unsub";
  ```
- Nếu cả hai env vars đều missing, fallback là string `"lovestory-unsub"` — predictable, dễ forge unsubscribe token

### 🟢 LOW: RSVP/Wishes RLS cho phép `INSERT WITH CHECK (true)`
- **Files:** `migrations/20260308_fix_all_missing.sql`, `20260311_fix_security_warnings.sql`
- Các bảng `rsvps`, `wishes` cho phép public insert mà không verify project tồn tại
- Stricter policy đã được comment-out trong `20260311_fix_security_warnings.sql` nhưng chưa apply
- **Intentional** cho public forms nhưng dễ bị spam với project IDs giả

### ✅ Đã xử lý tốt
- Admin routes có `verifyAdmin()` middleware
- Video generate route kiểm tra auth (internal secret hoặc Supabase session)
- SePay webhook có `SEPAY_WEBHOOK_SECRET` validation
- Sentry đã được tích hợp
- PostHog analytics đã tích hợp

---

## Performance Concerns

### 🔴 CRITICAL: Mega files — rất khó maintain & ảnh hưởng bundle
| File | Size | Lines (est.) |
|------|------|--------------|
| `app/i/[slug]/page.tsx` | **120 KB** | ~3,000+ |
| `app/i/[slug]/CanvasInvitation.tsx` | **113 KB** | ~2,700+ |
| `app/editor/new/page.tsx` | **73 KB** | ~2,796 |
| `editor/[id]/components/RightPanel.tsx` | **82 KB** | ~2,000+ |
| `editor/[id]/components/CraftVisualEditor.tsx` | **35 KB** | ~900+ |

- `page.tsx` (120KB) + `CanvasInvitation.tsx` (113KB) là 2 file lớn nhất — **page invitation public bị bloat nặng**
- `editor/new/page.tsx` (73KB) chứa hardcoded template data (CINELOVE_BG dictionary + inline template arrays) trong component file
- Next.js bundle cho những file này sẽ rất lớn

### 🟡 MEDIUM: `authData.listUsers({ perPage: 1000 })` trong admin route
- **File:** `app/api/admin/orders/route.ts:44`
- Fetch 1000 users mỗi khi admin load orders page
- Không có pagination — nếu user base tăng lên, sẽ slow hoặc hit Supabase limit

### 🟡 MEDIUM: Video generation chạy trong Next.js process (không phải worker)
- **File:** `app/api/video/generate/route.ts`
- FFmpeg spawn trong Next.js API route — **blocking** serverless function
- Vercel functions có timeout 60s (Hobby) / 300s (Pro) — video dài có thể timeout
- Không có proper job queue (BullMQ chưa implement per TASK_PLAN T008)

---

## Code Quality Issues

### TypeScript `any` Types
| File | Location | Issue |
|------|----------|-------|
| `app/api/video/generate/route.ts` | Line 358, 365 | `supabase: any`, `Record<string, any>` |
| `editor/[id]/components/sidebar/FloatingToolbar.tsx` | Lines 16,19,26,28 | `settings: any`, `props: any`, `query: any`, `actions: any` |
| `app/i/[slug]/CanvasInvitation.tsx` | Line 2719 | `parseCanvasJson` returns `any` |
| `server/trpc/middleware/feature-gate.ts` | Lines 83, 105 | `supabase: any` params |

### Console Statements
- **Không có `console.log`** nào trong production code ✅
- Có nhiều `console.error` trong API routes — acceptable cho server-side logging nhưng nên thay bằng structured logger (Pino/Winston) dài hạn

### React Hooks Issues
- `eslint-disable react-hooks/exhaustive-deps` ở 5 files → dependency arrays không đầy đủ → potential stale closure bugs
- Đặc biệt: `app/editor/[id]/page.tsx:61`, `Canvas.tsx:264`, `dashboard/rsvp/page.tsx:88,95`

### Image Optimization
- 8 instances `eslint-disable @next/next/no-img-element` → dùng `<img>` thay vì Next.js `<Image>`
- Mất lợi thế WebP conversion, lazy loading tự động, và LQIP

---

## Missing Features / Gaps

### Từ TASK_PLAN.md (chưa implement)
| Task | Status | Priority |
|------|--------|----------|
| T008 — Redis + BullMQ queue | ❌ Missing | P0 |
| T017 — site-serve Cloudflare Worker | ❌ Missing | P0 |
| T018-T019 — Video Worker (BullMQ consumer) | ❌ Missing | P0 (workaround: inline FFmpeg) |
| T020 — Face Detection Smart Crop | ❌ Missing | P0 |
| T021 — Background Removal (rembg) | ❌ Missing | P0 |
| T027 — RSVP System | ✅ Partial (API có, dashboard có) | P0 |
| T033 — view-counter Cloudflare Worker | ❌ Missing | P1 |
| T037 — Admin Panel | ✅ Partial (có `/admin/*`) | P1 |
| T042 — Error Monitoring (Sentry) | ✅ Done | P1 |
| T043 — Analytics (PostHog) | ✅ Done | P1 |

### Từ ROADMAP.md Phase 2-4
- Leaked password protection cần bật trong Supabase Dashboard
- RSVP tighter policy (với project existence check) chưa apply
- White-label (custom domain per studio) chưa có
- Load testing (k6/Artillery) chưa có
- WCAG 2.1 AA accessibility audit chưa có
- Legal pages (Privacy Policy, ToS) chưa có

---

## Fragile Areas

### 1. FFmpeg trong Serverless (Highest Risk)
- `app/api/video/generate/route.ts` spawn FFmpeg trực tiếp trong Next.js API route
- **Problem:** Serverless có ephemeral filesystem, FFmpeg phải được install trong runtime
- **Workaround hiện tại:** Expects FFmpeg available trên system (`brew install ffmpeg` cho dev)
- **Production risk:** Vercel không có FFmpeg built-in → video generation sẽ fail hoàn toàn
- **Cần:** move sang dedicated worker (Docker) hoặc dùng cloud FFmpeg API

### 2. Canvas JSON Parsing
- **File:** `app/i/[slug]/CanvasInvitation.tsx:2719`
- `parseCanvasJson` returns `any` — mọi access trên kết quả đều untyped
- Nếu canvas JSON schema thay đổi, sẽ gây runtime errors khó debug

### 3. Subscription Lifetime Model
- `expires_at: null` cho tất cả subscriptions (Lifetime plan)
- Khi chuyển sang monthly billing: cần backfill `expires_at` cho users hiện tại
- Không có migration plan rõ ràng

### 4. Rate Limiting In-Memory
- Rate limiters trong `lib/rate-limit.ts` dùng in-memory store
- Vercel serverless = multiple instances → rate limit không consistent
- Attacker có thể bypass bằng concurrent requests đến different instances

### 5. Template Data Hardcoded trong Component
- `app/editor/new/page.tsx`: CINELOVE_BG dictionary (150+ entries) và template arrays hardcoded trong component file
- Nên tách ra file JSON/data riêng — hiện tại gây file 73KB và slow IDE

### 6. Dual Editor Architecture
- Có 2 editors: `app/editor/new/page.tsx` (legacy?) và `app/editor/[id]/` (mới với Canvas engine)
- Không rõ relationship giữa chúng — điểm confusing cho maintainers

---

## Recommendations

### Priority P0 — Fix ngay
1. **FFmpeg Worker**: Move video generation ra khỏi Next.js API → dedicated Docker container với BullMQ (T018/T019)
2. **Apply RSVP stricter RLS**: Uncomment stricter policy trong `20260311_fix_security_warnings.sql`
3. **Fix `auth.admin.getUserById()` trong RSVP**: Dùng service role client (không phải anon client) hoặc dùng RPC

### Priority P1 — Trong milestone tới
4. **Split mega files**:
   - `page.tsx` (120KB) → extract từng section thành components
   - `CanvasInvitation.tsx` (113KB) → chia theo template sections
   - `editor/new/page.tsx` (73KB) → tách template data ra `data/` folder
5. **Fix `any` types trong `feature-gate.ts`**: Dùng proper Supabase client type
6. **Rate limiting persistent**: Dùng Upstash Redis cho rate limiting thay vì in-memory

### Priority P2 — Cleanup dài hạn
7. **Replace `console.error` với structured logger** (Pino)
8. **Migrate `<img>` → Next.js `<Image>`** để get CDN/WebP benefits
9. **Fix react-hooks/exhaustive-deps** thay vì suppress
10. **Plan subscription expiry migration** trước khi launch billing model mới
