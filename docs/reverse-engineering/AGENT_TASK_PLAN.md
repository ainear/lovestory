# AGENT_TASK_PLAN.md — Atomic Tasks for AI Coding Agents

> Mỗi task có đủ context để AI agent execute independently.

---

## Phase 1: Foundation

### T001 — Initialize Monorepo
**Objective:** Create Turborepo monorepo with pnpm workspaces  
**Files to create:**
- `turbo.json`
- `pnpm-workspace.yaml`
- `package.json` (root)
- `docker-compose.yml` (PostgreSQL + Redis)
- `.env.example`
- `.gitignore`

**Expected behavior:** `pnpm install` succeeds  
**Test:** Run `pnpm dev` without errors

---

### T002 — Scaffold Next.js App
**Objective:** Create Next.js 15 app in `apps/web/`  
**Files to create:**
- `apps/web/` via `create-next-app` (App Router, Tailwind, TypeScript)
- Route groups: `(auth)`, `(marketing)`, `(dashboard)`, `(editor)`, `(public)`
- Root layout with Inter font

**Expected behavior:** `pnpm --filter web dev` starts on :3000  
**Test:** Visit localhost:3000 shows empty app

---

### T003 — Shared Schemas Package
**Objective:** Create `packages/shared/` with all Zod schemas  
**Files to create:**
- `packages/shared/src/schemas/project.ts` — ProjectSchema
- `packages/shared/src/schemas/template.ts` — TemplateSchema
- `packages/shared/src/schemas/user.ts` — UserSchema
- `packages/shared/src/schemas/wish.ts` — WishSchema
- `packages/shared/src/schemas/rsvp.ts` — RsvpSchema
- `packages/shared/src/schemas/gift.ts` — GiftSchema
- `packages/shared/src/schemas/order.ts` — OrderSchema
- `packages/shared/src/types/enums.ts` — All enums
- `packages/shared/src/constants/plans.ts` — Plan definitions
- `packages/shared/src/index.ts` — Export all

**Expected behavior:** Import schemas in web app, type check passes  
**Test:** `pnpm --filter shared type-check`

---

### T004 — Database Schema (Drizzle ORM)
**Objective:** Create `packages/db/` with all tables per DATA_MODEL_INFERENCE.md  
**Files to create:**
- `packages/db/src/schema/users.ts`
- `packages/db/src/schema/plans.ts`
- `packages/db/src/schema/templates.ts`
- `packages/db/src/schema/projects.ts`
- `packages/db/src/schema/media-assets.ts`
- `packages/db/src/schema/wishes.ts`
- `packages/db/src/schema/rsvps.ts`
- `packages/db/src/schema/gifts.ts`
- `packages/db/src/schema/orders.ts`
- `packages/db/src/schema/addons.ts`
- `packages/db/src/schema/page-views.ts`
- `packages/db/src/seed/plans.ts`
- `packages/db/src/seed/templates.ts`
- `packages/db/drizzle.config.ts`
- `packages/db/src/client.ts`

**Expected behavior:** `drizzle-kit push` creates all tables  
**Test:** Connect to DB, verify tables exist with correct columns

---

### T005 — Supabase Auth
**Objective:** Login/Register with email + Google OAuth  
**Files to create:**
- `apps/web/src/lib/supabase/client.ts`
- `apps/web/src/lib/supabase/server.ts`
- `apps/web/src/lib/supabase/middleware.ts`
- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/middleware.ts`
- `apps/web/src/hooks/use-auth.ts`
- `apps/web/src/components/auth/login-modal.tsx`

**Expected behavior:** Click "Đăng nhập" → modal → login → redirect to /dashboard  
**Test:** Login with email, login with Google, session persists

---

### T006 — tRPC Setup
**Objective:** Initialize tRPC v11 with all router stubs  
**Files to create:**
- `apps/web/src/server/trpc/trpc.ts`
- `apps/web/src/server/trpc/router.ts`
- `apps/web/src/server/trpc/routers/auth.ts` (stub)
- `apps/web/src/server/trpc/routers/project.ts` (stub)
- `apps/web/src/server/trpc/routers/template.ts` (stub)
- `apps/web/src/server/trpc/routers/guest.ts` (stub)
- `apps/web/src/server/trpc/routers/billing.ts` (stub)
- `apps/web/src/server/trpc/routers/media.ts` (stub)
- `apps/web/src/app/api/trpc/[trpc]/route.ts`
- `apps/web/src/lib/trpc/client.ts`

**Expected behavior:** tRPC client calls work from React components  
**Test:** `trpc.hello.useQuery()` returns data

---

## Phase 3: Editor (Critical Path)

### T016 — Editor Layout Shell
**Objective:** Build the editor page with 3-panel layout  
**Files to create:**
- `apps/web/src/app/(editor)/editor/[id]/page.tsx`
- `apps/web/src/components/editor/editor-layout.tsx` (3-panel: toolbox | canvas | properties)
- `apps/web/src/components/editor/toolbox.tsx` (8 vertical icon tabs)
- `apps/web/src/components/editor/canvas.tsx` (scrollable preview area + zoom controls)
- `apps/web/src/components/editor/property-panel.tsx` (context-sensitive properties)
- `apps/web/src/components/editor/toolbar.tsx` (top bar: undo/redo, auto-save, preview, publish)

**Expected behavior:** Editor loads with 3-panel layout, toolbox shows 8 tab icons  
**Test:** Navigate to /editor/[id], see layout rendered correctly

---

### T017 — Layout JSON Schema
**Objective:** Define the JSON structure for invitation layouts  
**Files to create:**
- `apps/web/src/editor/types.ts` — Layout, Element, Widget interfaces
- `apps/web/src/editor/defaults.ts` — Default element configs

**Schema should support:**
```typescript
interface LayoutJSON {
  version: string;
  settings: { backgroundColor, backgroundImage, musicTrackId, particleEffect };
  sections: Section[];
}
interface Section {
  id: string;
  elements: Element[];
}
interface Element {
  id: string;
  type: 'text' | 'image' | 'widget' | 'sticker' | 'divider';
  position: { x, y };
  size: { width, height };
  style: { font, color, alignment, shadow, border, animation };
  content: any; // type-specific content
}
```

**Test:** Validate sample layout JSON against schema

---

### T018 — Canvas Rendering Engine
**Objective:** Render layout JSON as interactive React components on canvas  
**Files to create:**
- `apps/web/src/editor/engine.ts`
- `apps/web/src/editor/elements/text-element.tsx`
- `apps/web/src/editor/elements/image-element.tsx`
- `apps/web/src/editor/elements/widget-element.tsx`
- `apps/web/src/editor/elements/sticker-element.tsx`

**Expected behavior:** Load layout JSON → see invitation rendered on canvas  
**Test:** Load template layout JSON, verify all elements visible

---

### T024 — Widget System
**Objective:** Pluggable widget architecture for interactive components  
**Files to create:**
- `apps/web/src/editor/widgets/calendar.tsx`
- `apps/web/src/editor/widgets/countdown.tsx`
- `apps/web/src/editor/widgets/google-map.tsx`
- `apps/web/src/editor/widgets/rsvp-form.tsx`
- `apps/web/src/editor/widgets/qr-code.tsx`
- `apps/web/src/editor/widgets/youtube-video.tsx`
- `apps/web/src/editor/widgets/photo-album.tsx`
- `apps/web/src/editor/widgets/call-button.tsx`
- `apps/web/src/editor/widgets/wish-form.tsx`
- `apps/web/src/editor/widgets/guest-name.tsx`
- `apps/web/src/editor/widgets/registry.ts` (widget registry)

**Expected behavior:** Add any widget from toolbox → appears on canvas → configurable  
**Test:** Add calendar, countdown, map widgets, verify render + interaction

---

### T030 — Property Panel
**Objective:** Right sidebar for editing selected element properties  
**Files to create:**
- `apps/web/src/editor/properties/text-props.tsx` (font, size, color, alignment, spacing)
- `apps/web/src/editor/properties/style-props.tsx` (border, shadow, opacity)
- `apps/web/src/editor/properties/animation-props.tsx` (entrance + loop animations)
- `apps/web/src/editor/properties/position-props.tsx` (x, y, width, height)
- `apps/web/src/editor/properties/widget-props.tsx` (widget-specific settings)

**Expected behavior:** Click element on canvas → right panel shows editable properties  
**Test:** Select text → change font → canvas updates in real-time

---

## Phase 4: Publishing

### T035 — Publish System
**Objective:** One-click publish → generate public URL  
**Files to create:**
- `apps/web/src/server/trpc/routers/project.ts` — `publish` mutation
- `apps/web/src/server/services/publish.ts` — Layout JSON → HTML builder
- `apps/web/src/components/editor/publish-dialog.tsx`
- `apps/web/src/components/project/share-dialog.tsx`

**Expected behavior:** Click "Xuất bản" → generate URL → copy + share  
**Test:** Publish → visit URL → invitation renders correctly

---

### T037 — Public Invitation Renderer
**Objective:** Render published invitation as mobile-first web page  
**Files to create:**
- `apps/web/src/app/(public)/i/[slug]/page.tsx`
- `apps/web/src/components/invitation/public-renderer.tsx`
- `apps/web/src/components/invitation/envelope-animation.tsx`
- `apps/web/src/components/invitation/music-player.tsx`
- `apps/web/src/components/invitation/scroll-animations.ts`

**Expected behavior:** Open `/i/[slug]` → envelope opens → music plays → scroll through invitation  
**Test:** Open published URL on mobile, verify all sections + animations work

---

## Phase 5: Guest Interactions

### T044 — Wish API + Wall
**Objective:** Guests can submit and view wishes on the invitation  
**Files to create:**
- `workers/guest-api/src/wishes.ts` — POST/GET wishes
- `apps/web/src/components/invitation/wish-wall.tsx`
- `apps/web/src/components/invitation/wish-form.tsx`

**Expected behavior:** Guest writes wish → appears on wish wall → owner sees in dashboard  
**Test:** Submit wish via form → verify appears on page + in dashboard

---

## Phase 6: Billing

### T052 — Pricing Page
**Objective:** 3-tier pricing comparison with upgrade flow  
**Files to create:**
- `apps/web/src/app/(marketing)/pricing/page.tsx`
- `apps/web/src/components/billing/pricing-table.tsx`
- `apps/web/src/components/billing/plan-card.tsx`
- `apps/web/src/components/billing/feature-comparison.tsx`

**Expected behavior:** Beautiful pricing page with 3 tiers, feature comparison table  
**Test:** Page loads, all features displayed correctly, "Nâng cấp" buttons work

---

## Agent Execution Guidelines

### For each task:
1. **READ** task description + files to create + expected behavior
2. **CHECK** dependencies are complete
3. **IMPLEMENT** following the file list exactly
4. **VERIFY** using the test instructions
5. **COMMIT** with message: `feat(T{number}): {description}`

### Code Standards:
- TypeScript strict mode
- Zod validation on all inputs
- Components use Shadcn/UI primitives
- Vietnamese UI text, English code
- kebab-case files, PascalCase components, camelCase functions

### Key Decision: Editor vs Video
CineLove is a **page builder**, NOT a video generator. LoveStory can differentiate by adding:
- **AI Video Generation** (FFmpeg pipeline) — T019-T024 from original TASK_PLAN.md
- **AI Text Generation** (Gemini) — T022 from original TASK_PLAN.md

The editor core (Phase 3) is the most complex and critical part of the system.
