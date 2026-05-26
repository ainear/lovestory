# Architecture

## Pattern
- **Monorepo** quản lý bởi Turborepo + pnpm workspaces
- **Next.js 15 App Router** với React Server Components (RSC)
- **tRPC v11** cho type-safe end-to-end API (browser ↔ server)
- **Edge-first**: Cloudflare Workers xử lý invitation serving + RSVP tại edge
- **Background job**: BullMQ + Redis cho video processing pipeline bất đồng bộ

## Layers

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                 │
│  Next.js 15 App Router (Vercel CDN)                │
│  React 19 + Shadcn/UI + Tailwind v4                │
│  Zustand (client state) + tRPC React Query         │
├─────────────────────────────────────────────────────┤
│  API LAYER                                          │
│  tRPC v11 Routers (Next.js API Routes)             │
│  /api/trpc/[trpc] — type-safe procedures           │
│  /api/webhook/* — PayOS, Video, Build webhooks     │
│  /api/* REST endpoints (upload, RSVP, view-count)  │
├─────────────────────────────────────────────────────┤
│  EDGE LAYER (Cloudflare Workers)                   │
│  site-serve  → phục vụ invitation tĩnh từ R2      │
│  rsvp-submit → nhận RSVP, rate-limited             │
│  view-counter → đếm lượt xem                       │
├─────────────────────────────────────────────────────┤
│  SERVICE LAYER                                      │
│  server/services/: r2.ts, email.ts, ai-text.ts    │
│  server/services/: ffmpeg-builder.ts, projects.ts  │
├─────────────────────────────────────────────────────┤
│  DATABASE LAYER                                     │
│  Supabase PostgreSQL + Drizzle ORM                 │
│  Row Level Security (RLS) cho multi-tenant         │
│  GoTrue Auth + Realtime WebSocket                  │
├─────────────────────────────────────────────────────┤
│  WORKER LAYER (Fly.io / Docker)                    │
│  BullMQ consumer + FFmpeg pipeline (7 steps)       │
│  AI: face-detection, background-removal, text-gen  │
├─────────────────────────────────────────────────────┤
│  STORAGE LAYER                                      │
│  Cloudflare R2: projects/, videos/, templates/     │
│  Upstash Redis: job queue + cache                  │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### Flow 1: User tạo Invitation
```
User → Browser (React)
  → tRPC mutation (project.create)
  → Next.js API Route /api/trpc/[trpc]
  → tRPC Router (server/trpc/routers/project.ts)
  → Drizzle ORM → Supabase PostgreSQL
  → R2 Storage (document.json, theme.json)
  → Response trả về client
```

### Flow 2: AI Video Generation
```
User → Video form (app/ai-video/page.tsx)
  → Upload ảnh → /api/upload
  → R2: projects/{id}/assets/
  → tRPC mutation (video.create)
  → BullMQ job enqueue (Redis/Upstash)
  → Video Worker (Fly.io) picks job
     Step 1: Validate
     Step 2: Preprocess images
     Step 3: AI enhance (rembg, face-detection)
     Step 4: Text gen (Gemini API)
     Step 5: FFmpeg render
     Step 6: Postprocess
     Step 7: Upload to R2 (videos/{id}/output/)
  → Webhook → /api/webhook/video → update DB
  → Client polls status via tRPC (video.getStatus)
```

### Flow 3: Guest RSVP (Public Invitation)
```
Guest → *.lovestory.app/{slug}
  → Cloudflare Worker (site-serve)
  → R2: static/{project_id}/index.html
  → Guest fills RSVP form
  → Cloudflare Worker (rsvp-submit)
  → Supabase DB (rsvps table)
  → Email notification (Resend)
```

### Flow 4: Auth
```
User → Supabase Auth (Google OAuth / Email+OTP)
  → JWT access + refresh token
  → Cookie (server-side, middleware.ts)
  → tRPC context (createTRPCContext)
  → protectedProcedure validates ctx.user
  → RLS enforces row-level tenant isolation
```

## Key Abstractions

| Abstraction | Description | Key File |
|---|---|---|
| **Project** | Một wedding invitation (document.json + theme.json) | `routers/project.ts` |
| **Template** | Mẫu thiết kế có sẵn, user clone để tạo project | `routers/template.ts` |
| **Video** | AI-generated slideshow video từ ảnh của couple | `routers/video.ts` |
| **Guest** | Khách mời, có RSVP, wishes, gifts | `routers/guest.ts` |
| **Invitation Site** | Static site deploy lên R2, serve qua CF Worker | `workers/site-serve/` |
| **Plan/Billing** | Free/Basic/Premium subscription + credit | `routers/billing.ts` |
| **Media Asset** | Ảnh/nhạc upload lên R2 | `routers/media.ts` |

## Entry Points

| File | Role |
|---|---|
| `apps/web/src/app/layout.tsx` | Root Next.js layout, providers |
| `apps/web/src/app/page.tsx` | Landing page (40KB — marketing) |
| `apps/web/src/app/dashboard/page.tsx` | Dashboard chính của user |
| `apps/web/src/app/editor/[id]/page.tsx` | Invitation editor |
| `apps/web/src/app/ai-video/page.tsx` | AI video generation UI (37KB) |
| `apps/web/src/app/i/[slug]/page.tsx` | Public invitation page (SSR) |
| `apps/web/src/server/trpc/trpc.ts` | tRPC init + context + middleware |
| `apps/web/src/server/trpc/router.ts` | Root appRouter assembly |
| `apps/web/src/lib/supabase/middleware.ts` | Auth middleware (Next.js) |
| `packages/db/src/schema/index.ts` | Drizzle schema tổng hợp |
| `workers/view-counter/src/index.ts` | CF Worker entry |

## API Routes

### tRPC (via `/api/trpc/[trpc]`)

| Router | Procedures |
|---|---|
| `auth` | getUser, updateProfile |
| `project` | create, list, get, update, delete, publish |
| `template` | list, get, getById |
| `video` | create, getStatus, list |
| `guest` | create, list, import, update |
| `billing` | getPlans, subscribe, getBalance |
| `media` | getUploadUrl, delete |

### REST Endpoints (Next.js API Routes)

| Route | Method | Purpose |
|---|---|---|
| `/api/trpc/[trpc]` | GET/POST | tRPC handler |
| `/api/upload` | POST | File upload → R2 |
| `/api/upload-audio` | POST | Audio upload → R2 |
| `/api/projects` | GET/POST | Project CRUD |
| `/api/video` | POST | Video job trigger |
| `/api/rsvp` | POST | RSVP submission |
| `/api/wishes` | GET/POST | Wishes wall |
| `/api/likes` | POST | Like a wish |
| `/api/guests` | GET/POST | Guest management |
| `/api/orders` | GET/POST | Order history |
| `/api/referral` | GET | Referral data |
| `/api/view-count` | POST | View counting |
| `/api/views` | GET | Analytics views |
| `/api/admin/*` | * | Admin operations |
| `/api/email` | POST | Email sending |
| `/api/webhook/payos` | POST | PayOS payment webhook |
| `/api/webhook/video` | POST | Video complete callback |
| `/api/ai` | POST | Gemini text generation |

### Cloudflare Workers (Edge)

| Worker | Domain | Purpose |
|---|---|---|
| `site-serve` | `*.lovestory.app` | Serve static invitation pages from R2 |
| `rsvp-submit` | edge | Handle RSVP form (rate-limited) |
| `view-counter` | edge | Track + enforce page view quotas |
