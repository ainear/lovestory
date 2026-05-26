# Directory Structure

## Root Layout

```
lovestory/                          # Turborepo monorepo root
├── apps/                           # Deployable applications
│   └── web/                        # Next.js 15 web app (Vercel)
├── packages/                       # Shared internal packages
│   ├── db/                         # Drizzle ORM schema + client
│   └── shared/                     # Shared types, schemas, constants
├── workers/                        # Cloudflare Edge Workers
│   └── view-counter/               # View tracking worker (only 1 implemented)
├── supabase/                       # Supabase DB migrations
│   └── migrations/                 # 18 SQL migration files
├── .agent/                         # AI agent config (skills, agents)
├── .planning/                      # GSD planning artifacts
│   └── codebase/                   # Codebase mapping documents
├── .github/workflows/              # CI/CD: ci.yml, preview.yml, deploy.yml
├── docs/                           # Documentation
├── scripts/                        # Utility scripts
├── backups/                        # Project backups
├── docker-compose.yml              # Local dev: PostgreSQL + Redis
├── turbo.json                      # Turborepo pipeline config
├── pnpm-workspace.yaml             # PNPM workspaces: apps/*, packages/*, workers/*
├── package.json                    # Root package (Node 20.x)
├── .env.example                    # Env template (Supabase, R2, Redis, Gemini, PayOS, Resend)
├── ARCHITECTURE.md                 # System architecture doc
├── REPOSITORY_STRUCTURE.md        # Repo layout doc
├── DATABASE_SCHEMA.md              # DB schema reference
├── AI_PIPELINE.md                  # AI video pipeline doc
├── API_SPEC.md                     # API specification
├── PRODUCT.md                      # Product spec
├── ROADMAP.md                      # Development roadmap
└── TASK_PLAN.md                    # Sprint task planning
```

## apps/web/src/

```
src/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout, providers
│   ├── page.tsx                    # Landing page (marketing, 40KB)
│   ├── globals.css                 # Global styles + Tailwind v4
│   ├── metadata.ts                 # SEO metadata
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── robots.ts                   # robots.txt
│   ├── error.tsx / global-error.tsx / not-found.tsx
│   │
│   ├── auth/                       # Auth pages
│   │   └── login/page.tsx          # Login (Supabase Auth)
│   ├── dashboard/                  # User dashboard (protected)
│   │   ├── layout.tsx              # Dashboard shell (sidebar)
│   │   ├── page.tsx                # Overview (10KB)
│   │   ├── projects/               # Invitation projects
│   │   ├── guests/                 # Guest management
│   │   ├── rsvp/                   # RSVP tracking
│   │   ├── wishes/                 # Wishes wall
│   │   ├── gifts/                  # Gift tracking
│   │   ├── videos/                 # Video list
│   │   ├── referral/               # Referral program
│   │   ├── my-plan/                # Subscription & billing
│   │   ├── profile/                # Account settings
│   │   └── admin/                  # Admin panel (inside dashboard)
│   ├── editor/                     # Invitation editor
│   │   ├── [id]/page.tsx           # Edit by project ID
│   │   ├── new/page.tsx            # Create new
│   │   └── demo/page.tsx           # Demo mode
│   ├── ai-video/                   # AI video generation
│   │   └── page.tsx                # Video UI (37KB)
│   ├── templates/                  # Template gallery (public)
│   ├── gallery/                    # Showcase gallery
│   ├── blog/                       # Blog (seeded content)
│   ├── pricing/                    # Pricing plans (public)
│   ├── checkout/                   # Payment checkout
│   ├── demo/                       # Demo invitation
│   ├── i/                          # Public invitation pages
│   │   ├── [slug]/page.tsx         # Live invitation (SSR) — 120KB!
│   │   └── preview/                # Preview mode
│   ├── r/                          # Referral redirect
│   ├── limit-reached/              # Quota exceeded page
│   ├── privacy/ terms/             # Legal pages
│   │
│   └── api/                        # Next.js API Routes
│       ├── trpc/[trpc]/route.ts    # tRPC handler
│       ├── upload/                 # File upload (images)
│       ├── upload-audio/           # Audio upload
│       ├── projects/               # Project CRUD REST
│       ├── video/                  # Video job trigger
│       ├── rsvp/                   # RSVP submission
│       ├── wishes/                 # Wishes CRUD
│       ├── likes/                  # Like system
│       ├── guests/                 # Guest management
│       ├── orders/                 # Order history
│       ├── referral/               # Referral tracking
│       ├── view-count/             # View counting
│       ├── views/                  # Analytics
│       ├── email/                  # Email sending
│       ├── ai/                     # Gemini AI text
│       ├── admin/                  # Admin endpoints
│       └── webhook/                # External webhooks (PayOS, video)
│
├── server/                         # Server-side only code
│   ├── trpc/
│   │   ├── trpc.ts                 # tRPC init, context, protectedProcedure
│   │   ├── router.ts               # Root appRouter (7 sub-routers)
│   │   ├── routers/
│   │   │   ├── auth.ts             # Auth & profile
│   │   │   ├── project.ts          # Invitation CRUD
│   │   │   ├── template.ts         # Template gallery
│   │   │   ├── video.ts            # AI video generation
│   │   │   ├── guest.ts            # Guest + RSVP + wishes + gifts
│   │   │   ├── billing.ts          # Plans, subscription, credits
│   │   │   └── media.ts            # File management
│   │   └── middleware/             # tRPC middleware
│   ├── services/
│   │   ├── r2.ts                   # Cloudflare R2 storage client
│   │   ├── email.ts                # Resend email (13KB, templates)
│   │   ├── ai-text.ts              # Google Gemini text gen (4KB)
│   │   ├── ffmpeg-builder.ts       # FFmpeg command builder (8KB)
│   │   └── projects.ts             # Project service logic (5KB)
│   └── data/                       # Data access layer
│
├── components/                     # Shared UI components (app-level)
│   ├── CookieBanner.tsx
│   ├── UpgradeCTA.tsx
│   └── error-boundary.tsx
│
├── lib/                            # Utility libraries
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client (cookies)
│   │   └── middleware.ts           # Auth session middleware
│   ├── trpc/                       # tRPC client setup
│   ├── posthog/                    # Analytics (PostHog)
│   ├── seo/                        # SEO utilities
│   ├── admin.ts                    # Admin check helpers
│   ├── rate-limit.ts               # Rate limiting (Upstash)
│   └── __tests__/                  # Unit tests
│
├── contexts/
│   └── SubscriptionContext.tsx     # Subscription state context
│
├── types/
│   └── database.ts                 # Supabase DB type definitions
│
├── config/
│   └── plans.ts                    # Plan limits config
│
└── proxy.ts                        # Reverse proxy config (2KB)
```

## packages/

```
packages/
├── db/                             # Drizzle ORM (database package)
│   ├── src/
│   │   ├── schema/
│   │   │   └── index.ts            # All Drizzle table definitions (7KB)
│   │   │                           # Tables: users, projects, templates,
│   │   │                           # videos, guests, rsvps, wishes,
│   │   │                           # gifts, orders, music_tracks,
│   │   │                           # media_assets, plans, tenants
│   │   ├── client.ts               # Drizzle client init (Supabase pooler)
│   │   └── index.ts                # Package exports
│   └── drizzle.config.ts           # Drizzle-kit config
│
└── shared/                         # Shared utilities (no DB/UI deps)
    └── src/
        ├── schemas/                # Zod validation schemas
        │   # project.ts, video.ts, guest.ts, billing.ts,
        │   # template.ts, media.ts
        ├── types/                  # TypeScript interfaces
        │   # api.ts, enums.ts
        ├── constants/              # App constants
        │   # plans.ts, limits.ts, video-presets.ts
        └── index.ts                # Package exports

⚠️ Note: packages/ui và packages/config được đề cập trong docs
nhưng chưa có thư mục thực tế — có thể chưa được khởi tạo.
```

## workers/

```
workers/
└── view-counter/                   # Cloudflare Worker (implemented)
    ├── src/index.ts                # Worker entry point
    ├── wrangler.toml               # CF Worker config
    ├── tsconfig.json
    └── package.json

⚠️ Note: site-serve và rsvp-submit được đề cập trong docs
nhưng chưa có thư mục thực tế trong /workers/ —
logic có thể đã được tích hợp vào Next.js API routes.
```

## supabase/

```
supabase/
└── migrations/                     # 18 SQL migrations (chronological)
    ├── 20260306_sprint_ab_video_payment.sql
    ├── 20260307_add_music_columns.sql
    ├── 20260307_sprint_c_guests.sql
    ├── 20260308_admin_premium.sql
    ├── 20260308_fix_all_missing.sql
    ├── 20260308_sprint3_categories_blog.sql
    ├── 20260308_sprint5_referral.sql
    ├── 20260308_sprint6_editor_ux.sql
    ├── 20260309_sprint7_visual_editor.sql
    ├── 20260309_sprint8_rsvp.sql
    ├── 20260309_sprint11_referral_rpc.sql
    ├── 20260309_sprint12_rsvp_schema_fix.sql
    ├── 20260311_fix_security_warnings.sql
    ├── 20260311_fix_users_view_security.sql
    ├── 20260316_sprint65_view_counts.sql
    ├── 20260317_launch_security.sql
    ├── 20260317_sprint6_blog_seed.sql
    └── 20260318_sprint11_commission.sql
```

## Key File Locations

| File | Purpose |
|---|---|
| `apps/web/src/app/layout.tsx` | Root provider tree (Supabase, tRPC, PostHog) |
| `apps/web/src/app/page.tsx` | Landing page (marketing, 40KB) |
| `apps/web/src/app/ai-video/page.tsx` | AI video UI (37KB, core feature) |
| `apps/web/src/app/dashboard/layout.tsx` | Dashboard sidebar shell (6KB) |
| `apps/web/src/app/editor/[id]/page.tsx` | Invitation editor |
| `apps/web/src/app/i/[slug]/page.tsx` | Public invitation (SSR) — 120KB |
| `apps/web/src/app/api/trpc/[trpc]/route.ts` | tRPC HTTP handler |
| `apps/web/src/server/trpc/trpc.ts` | tRPC context + middleware (auth) |
| `apps/web/src/server/trpc/router.ts` | Root router (7 sub-routers) |
| `apps/web/src/server/services/email.ts` | Email templates via Resend (13KB) |
| `apps/web/src/server/services/ffmpeg-builder.ts` | FFmpeg command builder (8KB) |
| `apps/web/src/lib/supabase/middleware.ts` | Session refresh middleware |
| `apps/web/src/lib/rate-limit.ts` | Rate limiting |
| `apps/web/src/config/plans.ts` | Subscription plan definitions |
| `apps/web/src/contexts/SubscriptionContext.tsx` | Plan context provider |
| `packages/db/src/schema/index.ts` | All Drizzle table definitions |
| `packages/db/src/client.ts` | DB connection (Supabase pooler) |
| `packages/shared/src/index.ts` | Shared exports entry |
| `workers/view-counter/src/index.ts` | CF Worker entry |
| `turbo.json` | Turborepo task pipeline |
| `docker-compose.yml` | Local PostgreSQL + Redis |
| `.env.example` | All required env vars |

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Files (components) | kebab-case | `video-generator.tsx` |
| Files (utils/services) | kebab-case | `ffmpeg-builder.ts`, `smart-crop.ts` |
| React Components | PascalCase | `VideoGenerator`, `UpgradeCTA` |
| Functions | camelCase | `generateVideo()`, `createTRPCContext()` |
| Types/Interfaces | PascalCase | `VideoRenderJob`, `AppRouter` |
| DB tables | snake_case | `media_assets`, `music_tracks` |
| DB columns | snake_case | `tenant_id`, `created_at` |
| Env variables | SCREAMING_SNAKE_CASE | `REDIS_URL`, `GEMINI_API_KEY` |
| CSS classes | Tailwind utility | `bg-primary text-foreground` |
| API routes | kebab-case | `/api/upload-audio`, `/api/view-count` |
| Next.js route groups | (group-name) | `(auth)`, `(dashboard)`, `(admin)` |
| Dynamic segments | [param] | `[id]`, `[slug]`, `[trpc]` |
