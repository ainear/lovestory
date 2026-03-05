# REPOSITORY_STRUCTURE.md — LoveStory Monorepo Layout

## Monorepo Manager: Turborepo

```
lovestory/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint + Type check + Test on PR
│   │   ├── preview.yml               # Vercel preview deploy on PR
│   │   └── deploy.yml                # Deploy to production on main push
│   └── CODEOWNERS
│
├── .agent/                           # AI agent configuration (existing)
│   ├── agents/
│   ├── skills/
│   ├── scripts/
│   └── workflows/
│
├── apps/
│   │
│   ├── web/                          # ── Next.js 15 Web Application ──
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   ├── images/
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── register/page.tsx
│   │   │   │   ├── (marketing)/
│   │   │   │   │   ├── page.tsx             # Landing page
│   │   │   │   │   ├── templates/page.tsx   # Template gallery
│   │   │   │   │   ├── pricing/page.tsx     # Pricing plans
│   │   │   │   │   └── contact/page.tsx
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── layout.tsx           # Dashboard shell (sidebar)
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── page.tsx         # Overview
│   │   │   │   │   │   ├── projects/
│   │   │   │   │   │   │   ├── page.tsx     # Project list
│   │   │   │   │   │   │   ├── new/page.tsx # Create from template
│   │   │   │   │   │   │   └── [id]/
│   │   │   │   │   │   │       ├── page.tsx      # Project detail
│   │   │   │   │   │   │       ├── edit/page.tsx  # Edit invitation
│   │   │   │   │   │   │       ├── video/page.tsx # AI video gen
│   │   │   │   │   │   │       ├── guests/page.tsx # Guest mgmt
│   │   │   │   │   │   │       └── analytics/page.tsx
│   │   │   │   │   │   ├── videos/page.tsx  # All videos
│   │   │   │   │   │   ├── billing/page.tsx # Plans & credits
│   │   │   │   │   │   └── settings/page.tsx # Account settings
│   │   │   │   ├── (admin)/
│   │   │   │   │   ├── admin/
│   │   │   │   │   │   ├── page.tsx         # Admin dashboard
│   │   │   │   │   │   ├── templates/page.tsx # Template CRUD
│   │   │   │   │   │   ├── users/page.tsx   # User management
│   │   │   │   │   │   └── analytics/page.tsx
│   │   │   │   ├── i/[slug]/page.tsx        # Public invitation (SSR)
│   │   │   │   ├── api/
│   │   │   │   │   ├── trpc/[trpc]/route.ts # tRPC handler
│   │   │   │   │   ├── webhook/
│   │   │   │   │   │   ├── payos/route.ts   # PayOS webhook
│   │   │   │   │   │   └── video/route.ts   # Video complete webhook
│   │   │   │   │   └── internal/
│   │   │   │   │       └── build/route.ts   # Build complete webhook
│   │   │   │   ├── layout.tsx               # Root layout
│   │   │   │   └── not-found.tsx
│   │   │   │
│   │   │   ├── components/           # App-specific components
│   │   │   │   ├── layout/
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   └── mobile-nav.tsx
│   │   │   │   ├── project/
│   │   │   │   │   ├── project-card.tsx
│   │   │   │   │   ├── project-form.tsx
│   │   │   │   │   ├── invitation-editor.tsx
│   │   │   │   │   ├── invitation-preview.tsx
│   │   │   │   │   └── publish-dialog.tsx
│   │   │   │   ├── video/
│   │   │   │   │   ├── video-generator.tsx
│   │   │   │   │   ├── video-player.tsx
│   │   │   │   │   ├── photo-uploader.tsx
│   │   │   │   │   ├── music-picker.tsx
│   │   │   │   │   ├── template-preset-selector.tsx
│   │   │   │   │   └── render-progress.tsx
│   │   │   │   ├── guest/
│   │   │   │   │   ├── guest-table.tsx
│   │   │   │   │   ├── guest-import.tsx
│   │   │   │   │   ├── rsvp-dashboard.tsx
│   │   │   │   │   ├── wishes-wall.tsx
│   │   │   │   │   └── gifts-tracker.tsx
│   │   │   │   ├── template/
│   │   │   │   │   ├── template-gallery.tsx
│   │   │   │   │   ├── template-card.tsx
│   │   │   │   │   └── template-preview-modal.tsx
│   │   │   │   ├── billing/
│   │   │   │   │   ├── pricing-table.tsx
│   │   │   │   │   ├── plan-card.tsx
│   │   │   │   │   ├── credit-balance.tsx
│   │   │   │   │   └── order-history.tsx
│   │   │   │   └── landing/
│   │   │   │       ├── hero-section.tsx
│   │   │   │       ├── features-section.tsx
│   │   │   │       ├── showcase-section.tsx
│   │   │   │       ├── pricing-section.tsx
│   │   │   │       └── faq-section.tsx
│   │   │   │
│   │   │   ├── server/               # Server-side code
│   │   │   │   ├── trpc/
│   │   │   │   │   ├── trpc.ts              # tRPC init + context
│   │   │   │   │   ├── router.ts            # Root router
│   │   │   │   │   └── routers/
│   │   │   │   │       ├── auth.ts
│   │   │   │   │       ├── project.ts
│   │   │   │   │       ├── template.ts
│   │   │   │   │       ├── video.ts
│   │   │   │   │       ├── guest.ts
│   │   │   │   │       ├── billing.ts
│   │   │   │   │       ├── media.ts
│   │   │   │   │       └── admin.ts
│   │   │   │   └── services/
│   │   │   │       ├── r2.ts                # R2 storage service
│   │   │   │       ├── payos.ts             # PayOS integration
│   │   │   │       ├── email.ts             # Resend email service
│   │   │   │       └── queue.ts             # BullMQ job submission
│   │   │   │
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-project.ts
│   │   │   │   ├── use-video-status.ts
│   │   │   │   └── use-upload.ts
│   │   │   │
│   │   │   ├── lib/                  # Utility libraries
│   │   │   │   ├── supabase/
│   │   │   │   │   ├── client.ts     # Browser client
│   │   │   │   │   ├── server.ts     # Server client (cookies)
│   │   │   │   │   └── middleware.ts # Auth middleware
│   │   │   │   ├── trpc/
│   │   │   │   │   ├── client.ts     # tRPC React client
│   │   │   │   │   └── server.ts     # tRPC server caller
│   │   │   │   ├── utils.ts
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   └── stores/               # Zustand stores
│   │   │       ├── editor-store.ts
│   │   │       └── upload-store.ts
│   │   │
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── worker/                       # ── Video Processing Worker ──
│       ├── src/
│       │   ├── index.ts              # Worker entry (BullMQ consumer)
│       │   ├── pipeline/
│       │   │   ├── orchestrator.ts   # Pipeline orchestrator (steps 1-5)
│       │   │   ├── step-1-validate.ts
│       │   │   ├── step-2-preprocess.ts
│       │   │   ├── step-3-ai-enhance.ts
│       │   │   ├── step-4-text-gen.ts
│       │   │   ├── step-5-ffmpeg.ts
│       │   │   ├── step-6-postprocess.ts
│       │   │   └── step-7-upload.ts
│       │   ├── ffmpeg/
│       │   │   ├── command-builder.ts
│       │   │   ├── presets/
│       │   │   │   ├── cinematic.ts
│       │   │   │   ├── romantic.ts
│       │   │   │   ├── modern.ts
│       │   │   │   ├── vintage.ts
│       │   │   │   └── traditional.ts
│       │   │   ├── transitions.ts
│       │   │   ├── ken-burns.ts
│       │   │   └── text-overlay.ts
│       │   ├── ai/
│       │   │   ├── face-detection.ts
│       │   │   ├── background-removal.ts
│       │   │   ├── smart-crop.ts
│       │   │   └── text-generator.ts
│       │   ├── services/
│       │   │   ├── r2.ts
│       │   │   ├── webhook.ts
│       │   │   └── gemini.ts
│       │   └── utils/
│       │       ├── image.ts
│       │       └── logger.ts
│       ├── Dockerfile
│       ├── fly.toml
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   │
│   ├── shared/                       # ── Shared Types & Schemas ──
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   │   ├── project.ts
│   │   │   │   ├── video.ts
│   │   │   │   ├── guest.ts
│   │   │   │   ├── billing.ts
│   │   │   │   ├── template.ts
│   │   │   │   ├── media.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── api.ts
│   │   │   │   ├── enums.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── plans.ts
│   │   │   │   ├── limits.ts
│   │   │   │   └── video-presets.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── db/                           # ── Database (Drizzle) ──
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── tenants.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── plans.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── templates.ts
│   │   │   │   ├── videos.ts
│   │   │   │   ├── guests.ts
│   │   │   │   ├── rsvps.ts
│   │   │   │   ├── wishes.ts
│   │   │   │   ├── gifts.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── music-tracks.ts
│   │   │   │   ├── media-assets.ts
│   │   │   │   └── index.ts
│   │   │   ├── seed/
│   │   │   │   ├── plans.ts
│   │   │   │   ├── templates.ts
│   │   │   │   └── music-library.ts
│   │   │   ├── migrations/           # Auto-generated by drizzle-kit
│   │   │   ├── client.ts             # Drizzle client init
│   │   │   └── index.ts
│   │   ├── drizzle.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ui/                           # ── Shared UI (Shadcn/UI) ──
│   │   ├── src/
│   │   │   ├── components/           # Shadcn components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   └── ... (more shadcn)
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── config/                       # ── Shared Configs ──
│       ├── eslint/
│       │   └── base.js
│       ├── typescript/
│       │   └── base.json
│       └── tailwind/
│           └── base.ts
│
├── workers/
│   │
│   ├── site-serve/                   # ── Cloudflare Worker ──
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── wrangler.toml
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── rsvp-submit/                  # ── Cloudflare Worker ──
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── wrangler.toml
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── view-counter/                 # ── Cloudflare Worker ──
│       ├── src/
│       │   └── index.ts
│       ├── wrangler.toml
│       ├── tsconfig.json
│       └── package.json
│
├── docs/                             # ── Documentation ──
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_SPEC.md
│   ├── AI_PIPELINE.md
│   ├── TASK_PLAN.md
│   └── REPOSITORY_STRUCTURE.md
│
├── docker-compose.yml                # Local dev: PostgreSQL + Redis
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
├── pnpm-workspace.yaml               # PNPM workspace config
├── .env.example                      # Environment variables template
├── .gitignore
├── .prettierrc
├── .eslintrc.js
└── README.md
```

---

## Key Files

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {},
    "test": {
      "dependsOn": ["build"]
    },
    "db:push": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    }
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "workers/*"
```

### `docker-compose.yml` (Local Dev)
```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: lovestory
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### `.env.example`
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://postgres:xxx@xxx.supabase.co:5432/postgres

# Cloudflare R2
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_BUCKET_NAME=lovestory-storage
R2_PUBLIC_URL=https://storage.lovestory.app

# Redis (Upstash)
REDIS_URL=redis://xxx

# Google Gemini
GEMINI_API_KEY=xxx

# PayOS
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx

# Resend (Email)
RESEND_API_KEY=xxx

# Internal
INTERNAL_API_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://lovestory.app
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files (components) | kebab-case | `video-generator.tsx` |
| Files (utils) | kebab-case | `smart-crop.ts` |
| Components | PascalCase | `VideoGenerator` |
| Functions | camelCase | `generateVideo()` |
| Types/Interfaces | PascalCase | `VideoRenderJob` |
| DB tables | snake_case | `media_assets` |
| DB columns | snake_case | `tenant_id` |
| Env variables | SCREAMING_SNAKE | `REDIS_URL` |
| CSS classes | Tailwind utility | `bg-primary text-foreground` |
| API routes | kebab-case | `/api/webhook/video-complete` |
