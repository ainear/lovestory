# TASK_PLAN.md — LoveStory Atomic Engineering Tasks

> Danh sách task atomic cho AI coding agents. Mỗi task có đầy đủ context, dependencies, và verification criteria để agent có thể execute step-by-step.

---

## Task Notation

| Symbol | Meaning |
|--------|---------|
| 🟢 | Ready (no blockers) |
| 🟡 | Has dependencies |
| 🔴 | Critical path |
| `[P0]` | Must have for MVP |
| `[P1]` | Should have |
| `[P2]` | Nice to have |

---

## Phase 0: Foundation (Tuần 1-2)

### T001 🟢🔴 [P0] Initialize Turborepo Monorepo

**Description:** Create the Turborepo monorepo with pnpm workspaces.  
**Agent Instructions:**
1. Run `npx create-turbo@latest ./ --package-manager pnpm`
2. Configure `turbo.json` with tasks: build, dev, lint, type-check, test
3. Create `pnpm-workspace.yaml` with apps/*, packages/*, workers/*
4. Add root `.gitignore`, `.prettierrc`, `.eslintrc.js`
5. Create `docker-compose.yml` with PostgreSQL 16 + Redis 7

**Verification:** `pnpm install` succeeds, `turbo build` succeeds (empty)  
**Depends on:** Nothing  
**Estimated time:** 30 min

---

### T002 🟡 [P0] Setup Next.js 15 Web App

**Description:** Scaffold the Next.js 15 web application in `apps/web/`.  
**Agent Instructions:**
1. Run `npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --use-pnpm`
2. Install: `shadcn`, `@tanstack/react-query`, `zustand`, `next-intl`
3. Configure `tailwind.config.ts` with custom color palette
4. Setup Shadcn/UI: `npx shadcn@latest init`
5. Add base components: Button, Card, Dialog, Input, Select, Table, Toast
6. Create route groups: `(auth)`, `(marketing)`, `(dashboard)`, `(admin)`
7. Create layout files for each group
8. Add root layout with Inter font from Google Fonts

**Verification:** `pnpm --filter web dev` starts on localhost:3000, all routes render  
**Depends on:** T001  
**Estimated time:** 1 hour

---

### T003 🟡 [P0] Setup Shared Package

**Description:** Create `packages/shared/` with Zod schemas, types, and constants.  
**Agent Instructions:**
1. Create `packages/shared/` with TypeScript config
2. Define all Zod schemas from API_SPEC.md (ProjectSchema, VideoSchema, etc.)
3. Define type exports and enums
4. Define constants (plan limits, video presets)
5. Export everything from `src/index.ts`

**Verification:** Import schemas in `apps/web`, type check passes  
**Depends on:** T001  
**Estimated time:** 1 hour

---

### T004 🟡 [P0] Setup Database Package (Drizzle)

**Description:** Create `packages/db/` with Drizzle ORM schema matching DATABASE_SCHEMA.md.  
**Agent Instructions:**
1. Create `packages/db/`
2. Install: `drizzle-orm`, `drizzle-kit`, `postgres`
3. Define all tables from DATABASE_SCHEMA.md
4. Create `drizzle.config.ts` with Supabase connection string
5. Create seed files for plans, sample templates, music library
6. Export client + schema from `src/index.ts`

**Verification:** `pnpm --filter db drizzle-kit push` succeeds, seed runs  
**Depends on:** T001, Supabase project created  
**Estimated time:** 2 hours

---

### T005 🟡 [P0] Setup Supabase Auth Integration

**Description:** Integrate Supabase Auth (Google + Email OTP) with Next.js.  
**Agent Instructions:**
1. Install: `@supabase/supabase-js`, `@supabase/ssr`
2. Create `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server)
3. Create `lib/supabase/middleware.ts` for session refresh
4. Add auth middleware to `middleware.ts`
5. Build login page: Google OAuth button + Email OTP form
6. Build register/callback pages
7. Create auth context provider
8. Create `use-auth.ts` hook
9. Auto-create tenant + user record on first login (trigger or API)

**Verification:** Login with Google works, session persists, logout works  
**Depends on:** T002, T004  
**Estimated time:** 2 hours

---

### T006 🟡 [P0] Setup tRPC

**Description:** Initialize tRPC v11 with Next.js App Router.  
**Agent Instructions:**
1. Install: `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`
2. Create `server/trpc/trpc.ts` with context (user session, db)
3. Create `server/trpc/router.ts` with empty routers
4. Create API route handler at `app/api/trpc/[trpc]/route.ts`
5. Create tRPC client provider in `lib/trpc/client.ts`
6. Wrap app with `TRPCProvider` + `QueryClientProvider`
7. Test with a simple `hello` query

**Verification:** `trpc.hello.useQuery()` returns data in a component  
**Depends on:** T002, T003, T004, T005  
**Estimated time:** 1.5 hours

---

### T007 🟡 [P0] Setup Cloudflare R2 Storage

**Description:** Configure R2 bucket and S3 client for file storage.  
**Agent Instructions:**
1. Create R2 bucket `lovestory-storage` in Cloudflare dashboard
2. Create `server/services/r2.ts` with S3 client (aws-sdk v3)
3. Implement: `uploadFile()`, `getSignedUploadUrl()`, `deleteFile()`, `getFileUrl()`
4. Create folder structure: projects/, videos/, templates/, music/, static/
5. Test upload/download in a tRPC mutation

**Verification:** File upload → retrieve URL → download works  
**Depends on:** T006  
**Estimated time:** 1 hour

---

### T008 🟡 [P0] Setup Redis + BullMQ

**Description:** Configure Upstash Redis and BullMQ job queue.  
**Agent Instructions:**
1. Create Upstash Redis instance
2. Install: `bullmq`, `ioredis` (or `@upstash/redis`)
3. Create `server/services/queue.ts` with queue initialization
4. Create queue: `video-render`
5. Create `server/services/queue.ts` with `submitVideoJob()` function
6. Test: submit job and verify it appears in queue

**Verification:** Job submitted, visible in BullMQ dashboard (BullBoard optional)  
**Depends on:** T006  
**Estimated time:** 1 hour

---

### T009 🟢 [P0] CI/CD Pipeline

**Description:** Setup GitHub Actions for CI and Vercel deploy.  
**Agent Instructions:**
1. Create `.github/workflows/ci.yml`: lint + type-check + test on PR
2. Create `.github/workflows/deploy.yml`: deploy to Vercel on main push
3. Configure Vercel project for `apps/web`
4. Add environment variables to Vercel project
5. Verify preview deploys on PR

**Verification:** PR creates preview deploy, main branch auto-deploys  
**Depends on:** T002  
**Estimated time:** 1 hour

---

### T010 🟡 [P1] Dashboard Layout Shell

**Description:** Build the dashboard layout with sidebar, header, and mobile nav.  
**Agent Instructions:**
1. Create `(dashboard)/layout.tsx` with sidebar + main content area
2. Build sidebar component with groups: HOME, THIẾT KẾ, QUẢN LÝ, TÀI KHOẢN
3. Build header with user avatar dropdown (profile, settings, logout)
4. Build mobile hamburger navigation
5. Add active route highlighting
6. Add usage quota indicators in sidebar

**Verification:** Dashboard loads with sidebar, all links navigate, mobile responsive  
**Depends on:** T005, T006  
**Estimated time:** 2 hours

---

## Phase 1: MVP (Tuần 3-6)

### T011 🟡🔴 [P0] Template Gallery Page

**Description:** Public template browsing with category filters.  
**Agent Instructions:**
1. Create `template.list` tRPC query
2. Build `(marketing)/templates/page.tsx` with grid layout
3. Build `TemplateCard` component (thumbnail, name, tier badge)
4. Add category filter tabs (Cưới, Sinh nhật, Kỷ niệm, Event)
5. Add tier filter (Free, Basic, Premium)
6. Build `TemplatePreviewModal` with QR code (qrcode lib)
7. Add "Dùng mẫu này" button → redirect to project creation

**Verification:** Templates display in grid, filters work, preview modal opens  
**Depends on:** T004 (seed templates), T006  
**Estimated time:** 3 hours

---

### T012 🟡🔴 [P0] Project Creation from Template

**Description:** "Use this template" flow → create project → redirect to editor.  
**Agent Instructions:**
1. Create `project.create` tRPC mutation (check plan limits)
2. Clone template document + theme to new project in R2
3. Generate unique slug (nanoid, 8 chars)
4. Create project record in DB
5. Redirect to `/dashboard/projects/{id}/edit`

**Verification:** Click "Dùng mẫu này" → project created → editor loads  
**Depends on:** T006, T007, T011  
**Estimated time:** 2 hours

---

### T013 🟡🔴 [P0] Invitation Form Editor (Phase 1)

**Description:** Template-based form editor for wedding details.  
**Agent Instructions:**
1. Create edit page at `dashboard/projects/[id]/edit/page.tsx`
2. Build form sections:
   - Couple info (groom name, bride name)
   - Wedding date + time picker
   - Venue (name, address, Google Maps link)
   - Photo upload (drag & drop, max per plan)
   - Color palette picker (preset palettes + custom)
   - Font family selector (Google Fonts dropdown)
   - Background music selector (music library picker)
3. Auto-save on change (debounced tRPC mutation)
4. Live preview panel (split view: form | preview)
5. Create `project.update` tRPC mutation

**Verification:** Fill form → preview updates live → save → reload maintains data  
**Depends on:** T012, T007  
**Estimated time:** 4 hours

---

### T014 🟡 [P0] Media Upload System

**Description:** Photo and music upload with presigned URLs.  
**Agent Instructions:**
1. Create `media.getUploadUrl` tRPC mutation
2. Create `media.confirmUpload` tRPC mutation
3. Build `PhotoUploader` component (drag & drop, preview thumbnails)
4. Build `MusicPicker` component (library + upload tab)
5. Implement client-side upload to presigned R2 URL
6. Generate thumbnails on confirm
7. File type + size validation (client + server)

**Verification:** Upload photo → thumbnail appears → music plays in picker  
**Depends on:** T007, T013  
**Estimated time:** 3 hours

---

### T015 🟡 [P0] Invitation Preview (Mobile-First)

**Description:** Build the invitation preview component and public page.  
**Agent Instructions:**
1. Create `InvitationPreview` component (mobile-first responsive)
2. Render sections: Hero (couple photo), Names + Date, Venue + Map, Gallery, Music player, RSVP form, Wish wall, Gift QR
3. Apply template theme (colors, fonts, backgrounds)
4. Add scroll animations (fade in, slide up)
5. Add envelope opening animation (optional)
6. Create SSR public page at `i/[slug]/page.tsx`

**Verification:** Preview looks great on mobile, animations work, sections render  
**Depends on:** T013  
**Estimated time:** 4 hours

---

### T016 🟡🔴 [P0] Publish & Share Flow

**Description:** Publish invitation to R2 and generate shareable link.  
**Agent Instructions:**
1. Create `project.publish` tRPC mutation
2. Build static HTML from invitation data (React SSR → HTML)
3. Upload HTML + assets to R2 `static/{project_id}/`
4. Set `publishedAt` + `expiresAt` in DB
5. Generate shareable link: `lovestory.app/i/{slug}`
6. Generate QR code for the link
7. Build share dialog with copy link + social buttons (Zalo, Facebook, SMS)
8. Build `PublishDialog` component

**Verification:** Publish → link works → QR scans to page → share buttons work  
**Depends on:** T015, T007  
**Estimated time:** 3 hours

---

### T017 🟡 [P0] site-serve Cloudflare Worker

**Description:** Cloudflare Worker to serve published invitation pages from R2.  
**Agent Instructions:**
1. Create `workers/site-serve/` project
2. Bind R2 bucket in `wrangler.toml`
3. Route: `GET /i/{slug}` → fetch from R2 `static/{project_id}/index.html`
4. Slug → project ID lookup via Supabase REST API (cached)
5. Check view quota → decrement if under limit → return 402 if over
6. Add cache headers (stale-while-revalidate)

**Verification:** Published invitation loads at custom URL, view counting works  
**Depends on:** T016  
**Estimated time:** 2 hours

---

### T018 🟡🔴 [P0] Video Worker Setup

**Description:** Create the video processing worker service.  
**Agent Instructions:**
1. Create `apps/worker/` with TypeScript + BullMQ consumer
2. Install: `fluent-ffmpeg`, `sharp`, `@google/generative-ai`
3. Verify FFmpeg is available (install in Docker image)
4. Create BullMQ worker consuming `video-render` queue
5. Implement basic pipeline orchestrator (step 1-7 skeleton)
6. Implement progress reporting via `job.updateProgress()`
7. Create `Dockerfile` with FFmpeg + Node.js
8. Create `fly.toml` for Fly.io deployment

**Verification:** Worker starts, consumes test job, reports progress  
**Depends on:** T008  
**Estimated time:** 3 hours

---

### T019 🟡🔴 [P0] FFmpeg Video Compositing

**Description:** Core FFmpeg pipeline — photos to video with Ken Burns, transitions, text.  
**Agent Instructions:**
1. Implement `step-2-preprocess.ts`: resize photos with sharp
2. Implement Ken Burns effect (zoompan filter)
3. Implement transitions (xfade: crossfade, slide, zoom, fade)
4. Implement text overlays (drawtext with custom fonts)
5. Implement music mixing (concat + fade in/out)
6. Create 5 template presets: cinematic, romantic, modern, vintage, traditional
7. Build `FFmpegCommandBuilder` class
8. Handle encoding profiles: preview (720p) + final (1080p)
9. Generate thumbnail at 3s mark

**Verification:** 10 photos → 30s video with transitions + music + text  
**Depends on:** T018  
**Estimated time:** 6 hours

---

### T020 🟡 [P0] AI Enhancement: Face Detection + Smart Crop

**Description:** Auto-detect faces and apply smart crop to photos.  
**Agent Instructions:**
1. Install `face-api.js` with TinyFaceDetector model
2. Implement `step-3-ai-enhance.ts`: face detection
3. Implement `smart-crop.ts`: center on face, rule-of-thirds
4. Fallback: center crop if no face found
5. Integrate into pipeline

**Verification:** Photo with faces → crop centers on faces  
**Depends on:** T019  
**Estimated time:** 2 hours

---

### T021 🟡 [P0] AI Enhancement: Background Removal

**Description:** Remove photo backgrounds using rembg.  
**Agent Instructions:**
1. Create Python microservice with `rembg` (ONNX runtime)
2. API: `POST /remove-bg` accepting image → returning PNG with transparency
3. Containerize in worker Dockerfile (multi-stage)
4. Integrate as optional step in pipeline (user toggle)

**Verification:** Portrait photo → transparent background output  
**Depends on:** T018  
**Estimated time:** 2 hours

---

### T022 🟡 [P0] AI Text Generation (Gemini)

**Description:** Generate "Love Story" text using Google Gemini API.  
**Agent Instructions:**
1. Install `@google/generative-ai`
2. Create `ai/text-generator.ts` with Gemini Flash model
3. Implement prompt template from AI_PIPELINE.md
4. Parse JSON response into `LoveStoryOutput` type
5. Handle error/retry (3 attempts with backoff)
6. Integrate as step-4 in pipeline
7. Also expose as tRPC mutation for real-time preview in editor

**Verification:** Input couple info → get title, story, poem output  
**Depends on:** T018  
**Estimated time:** 1.5 hours

---

### T023 🟡🔴 [P0] Video Generation UI

**Description:** Frontend for AI video generation flow.  
**Agent Instructions:**
1. Create `dashboard/projects/[id]/video/page.tsx`
2. Build `VideoGenerator` component:
   - Step 1: Upload photos (reuse PhotoUploader)
   - Step 2: Select template preset (visual cards)
   - Step 3: Choose music (library picker)
   - Step 4: Enter couple info (if not from project)
   - Step 5: Preview config → Submit
3. Build `RenderProgress` component:
   - Poll `video.getStatus` every 2s
   - Show progress bar with step labels
   - Animated loading state
4. Build `VideoPlayer` component for completed videos
5. Create `video.generate` tRPC mutation (check credits, enqueue job)
6. Create `video.getStatus` tRPC query

**Verification:** Submit → progress bar → video plays on completion  
**Depends on:** T019, T014  
**Estimated time:** 4 hours

---

### T024 🟡 [P0] Watermark for Free Tier

**Description:** Add LoveStory watermark to videos for free tier users.  
**Agent Instructions:**
1. Implement watermark in `step-6-postprocess.ts`
2. Watermark: "lovestory.app" semi-transparent bottom-right
3. Check plan tier → apply watermark if free
4. Watermark-free for Pro/Premium

**Verification:** Free tier video has watermark, Pro does not  
**Depends on:** T019, T004  
**Estimated time:** 1 hour

---

### T025 🟡🔴 [P0] Landing Page

**Description:** Marketing landing page inspired by CineLove but differentiated.  
**Agent Instructions:**
1. Create `(marketing)/page.tsx` (landing page)
2. Sections: Hero (video demo), Features, Template showcase, AI Video demo, Pricing preview, Customer testimonials, FAQ, Footer
3. Hero: Animated gradient + demo video autoplay
4. Features: Icon grid with hover animations
5. Template showcase: Horizontal scroll gallery
6. AI Video demo: Before/after comparison
7. Add SEO meta tags, OG image
8. Mobile responsive, smooth scroll

**Verification:** Page loads < 2s, all sections render, mobile looks great  
**Depends on:** T002  
**Estimated time:** 4 hours

---

## Phase 2: Growth (Tuần 7-10)

### T026 🟡 [P0] Guest List Management

**Description:** CRUD for guest list with CSV import/export.  
**Agent Instructions:**
1. Create `guest.*` tRPC routes (list, create, update, delete, bulkImport, exportCsv)
2. Build `dashboard/projects/[id]/guests/page.tsx`
3. Build `GuestTable` with sorting, filtering, pagination
4. Build `GuestImport` modal (CSV upload → parse → preview → confirm)
5. Build guest group management (Nhà trai, Nhà gái, Bạn bè)
6. Generate personal links per guest

**Verification:** Add guest → appears in table → CSV import works → personal link works  
**Depends on:** T006, T012  
**Estimated time:** 4 hours

---

### T027 🟡 [P0] RSVP System

**Description:** RSVP form on invitation + dashboard tracking.  
**Agent Instructions:**
1. Add RSVP form to invitation preview/public page
2. Create `workers/rsvp-submit/` Cloudflare Worker
3. Rate limit: 5 per IP per minute
4. Save to Supabase via REST API
5. Build `RsvpDashboard` component (confirmed/declined/pending stats)
6. Realtime updates via Supabase Realtime (optional)

**Verification:** Submit RSVP on invitation → appears in dashboard  
**Depends on:** T015, T017, T026  
**Estimated time:** 3 hours

---

### T028 🟡 [P1] Guest Wishes Wall

**Description:** Guests can submit wishes that display on invitation.  
**Agent Instructions:**
1. Add wish form to invitation page
2. Submit via rsvp-submit Worker
3. Build `WishesWall` display component (cards, masonry layout)
4. Build moderation UI in dashboard (approve/reject/delete)
5. Auto-approve by default, option to require approval

**Verification:** Submit wish → appears on invitation → moderation works  
**Depends on:** T027  
**Estimated time:** 2 hours

---

### T029 🟡 [P1] Gift Management

**Description:** QR bank transfer for gifts with tracking.  
**Agent Instructions:**
1. Add gift section to invitation page with QR code (VietQR format)
2. Generate QR from couple's bank info
3. Build `GiftsTracker` component in dashboard
4. Manual + auto gift confirmation
5. Total gift amount display

**Verification:** QR displays on invitation → gifts tracked in dashboard  
**Depends on:** T027  
**Estimated time:** 2 hours

---

### T030 🟡🔴 [P0] Pricing Page + PayOS Checkout

**Description:** Pricing comparison page and payment flow.  
**Agent Instructions:**
1. Create `(marketing)/pricing/page.tsx`
2. Build `PricingTable` component (3 tiers + credit packs)
3. Feature comparison table with checkmarks
4. Create `billing.createOrder` tRPC mutation
5. Integrate PayOS SDK for checkout
6. Create `api/webhook/payos/route.ts` for payment confirmation
7. On payment success: activate plan, add credits, send email
8. Build `BillingDashboard` (current plan, usage, invoices)

**Verification:** Select plan → PayOS checkout → plan activated → billing shows  
**Depends on:** T006, T004  
**Estimated time:** 4 hours

---

### T031 🟡 [P0] Feature Gating Middleware

**Description:** Enforce plan limits across the application.  
**Agent Instructions:**
1. Create tRPC middleware to check plan limits
2. Gates: max projects, max views, video credits, premium templates
3. Return friendly error with upgrade CTA
4. Credit deduction on video generation
5. Monthly credit reset (cron or on-demand)

**Verification:** Free user hits limit → blocked with upgrade prompt  
**Depends on:** T030, T006  
**Estimated time:** 2 hours

---

### T032 🟡 [P1] Email Notifications (Resend)

**Description:** Transactional emails for key events.  
**Agent Instructions:**
1. Install `resend`
2. Create React email templates: Welcome, Plan Upgraded, Video Ready, RSVP Received
3. Send on triggers: signup, payment success, video complete, new RSVP
4. Create `server/services/email.ts`

**Verification:** Events trigger emails, emails render correctly  
**Depends on:** T005, T030  
**Estimated time:** 2 hours

---

### T033 🟡 [P1] view-counter Cloudflare Worker

**Description:** Track page views with quota enforcement.  
**Agent Instructions:**
1. Create `workers/view-counter/`
2. Increment view count in Supabase (or KV for speed)
3. Check against plan quota → return 402 if over
4. Serve upgrade page when quota exceeded
5. Batch writes to reduce DB calls

**Verification:** Views counted → quota enforced → upgrade page at limit  
**Depends on:** T017, T004  
**Estimated time:** 2 hours

---

## Phase 3: Scale (Tuần 11-14)

### T034 🟡 [P1] GrapesJS Visual Editor

**Description:** Integrate GrapesJS for drag-and-drop invitation editing.  
**Estimated time:** 8 hours  
**Depends on:** T013

### T035 🟡 [P1] Advanced Video Templates

**Description:** 10+ video presets with more transitions and effects.  
**Estimated time:** 4 hours  
**Depends on:** T019

### T036 🟡 [P2] Live Photo Wall

**Description:** Real-time guest photo uploads during events.  
**Estimated time:** 6 hours  
**Depends on:** T027

### T037 🟡 [P1] Admin Panel

**Description:** Template CRUD, user management, revenue analytics.  
**Estimated time:** 6 hours  
**Depends on:** T006

### T038 🟡 [P2] 4K Video Rendering

**Description:** Premium 4K output for Premium users.  
**Estimated time:** 2 hours  
**Depends on:** T019

---

## Phase 4: Polish (Tuần 15-16)

### T039 🟢 [P0] Performance Audit

**Estimated time:** 3 hours

### T040 🟢 [P0] Security Audit

**Estimated time:** 3 hours

### T041 🟢 [P1] SEO Optimization

**Estimated time:** 2 hours

### T042 🟢 [P1] Error Monitoring (Sentry)

**Estimated time:** 1 hour

### T043 🟢 [P1] Analytics (PostHog)

**Estimated time:** 1 hour

---

## Task Dependency Graph

```
T001 ──┬── T002 ──┬── T003
       │          ├── T005 ──── T006 ──┬── T007 ──── T012 ──── T013 ──┬── T015 ──── T016 ──── T017
       │          │                    ├── T008 ──── T018 ──┬── T019 ──┼── T023
       │          │                    ├── T010              ├── T020   ├── T014
       │          │                    ├── T011              ├── T021   └── T026 ──── T027 ──┬── T028
       │          │                    └── T030 ──── T031    ├── T022                       ├── T029
       │          └── T009                                   └── T024                       └── T033
       └── T004
```

---

## Critical Path (MVP)

```
T001 → T002 → T005 → T006 → T007 → T012 → T013 → T015 → T016 → T017
                                ↘ T008 → T018 → T019 → T023
```

**Estimated MVP completion:** ~6 tuần (60-80 giờ AI agent time)

---

## Agent Execution Guidelines

### Cho mỗi task, agent PHẢI:

1. **Read** — Đọc task description + dependencies + verification criteria
2. **Check** — Verify dependencies đã complete
3. **Implement** — Viết code theo instructions
4. **Verify** — Run verification criteria
5. **Report** — Commit + report status

### File Naming Rules:
- Components: `kebab-case.tsx`
- Utils: `kebab-case.ts`
- Types: `PascalCase` in files
- DB columns: `snake_case`

### Commit Message Format:
```
feat(T{number}): {short description}

- {detail 1}
- {detail 2}

Task: T{number}
Phase: {phase}
```
