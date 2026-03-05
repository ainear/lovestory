# DEVELOPMENT_ROADMAP.md — CineLove Clone Build Plan

## Phase 1: Foundation (Week 1-2)

### Sprint Goals
- Monorepo setup with Turborepo + pnpm
- Next.js 15 app with Tailwind + Shadcn/UI
- Supabase Auth (Google + Email)
- Database schema (Drizzle ORM)
- tRPC setup
- CI/CD pipeline

### Tasks
- T001: Init Turborepo monorepo
- T002: Scaffold Next.js 15 app
- T003: Setup shared package (Zod schemas)
- T004: Setup database package (Drizzle)
- T005: Integrate Supabase Auth
- T006: Setup tRPC
- T007: Setup R2 storage
- T008: Docker Compose for local dev
- T009: GitHub Actions CI/CD

### Deliverables
- ✅ Running dev environment
- ✅ Login/Register working
- ✅ Database connected with seed data

---

## Phase 2: Template System (Week 3-4)

### Sprint Goals
- Template gallery with categories
- Template preview modal
- Template data model and seeding

### Tasks
- T010: Dashboard layout (sidebar + shell)
- T011: Template gallery page with filters
- T012: Template preview modal (iframe + QR)
- T013: Template detail page
- T014: Seed 10+ template designs
- T015: BASIC/PREMIUM tier badge system

### Deliverables
- ✅ Public template gallery browsing
- ✅ Template preview with QR scan
- ✅ Template data with categories and tiers

---

## Phase 3: Editor Core (Week 5-8) 🔴 Critical Path

### Sprint Goals
- Canvas-based invitation editor
- 8 toolbox tabs
- Element property editing
- Auto-save functionality

### Tasks
- T016: Editor layout (toolbox + canvas + property panel)
- T017: Layout JSON schema definition
- T018: Element rendering engine
- T019: Text element (add, edit, style, animate)
- T020: Image element (upload, position, resize)
- T021: Background editing (color, image)
- T022: Stock materials library
- T023: Music selector + player
- T024: Widget system architecture
- T025: Calendar widget
- T026: Countdown widget
- T027: Google Maps widget
- T028: RSVP form widget
- T029: QR code widget
- T030: Property panel (font, color, size, animation, shadow)
- T031: Undo/Redo system
- T032: Layer management
- T033: Auto-save (debounced)
- T034: Global effects (particles: hearts, leaves, snow)

### Deliverables
- ✅ Fully functional visual editor
- ✅ All 8 toolbox tabs working
- ✅ Auto-save with real-time indicator

---

## Phase 4: Publishing & Public Pages (Week 9-10)

### Sprint Goals
- Publish flow with URL generation
- Public invitation rendering
- Sharing (Zalo, Facebook, QR)
- View counting

### Tasks
- T035: Publish mutation (generate slug, build HTML)
- T036: Static site builder (layout JSON → HTML)
- T037: Public invitation page renderer
- T038: Envelope animation
- T039: Mobile-first responsive design
- T040: Share dialog (copy URL, social buttons)
- T041: QR code generation
- T042: View counter (edge worker or API)
- T043: View quota enforcement

### Deliverables
- ✅ One-click publish
- ✅ Beautiful public invitation page
- ✅ Sharing via link, QR, social media

---

## Phase 5: Guest Interactions (Week 11-12)

### Sprint Goals
- Wish wall (submit + display)
- RSVP system
- Gift QR system
- Dashboard management for all

### Tasks
- T044: Wish API (public POST, GET)
- T045: Wish wall component on invitation
- T046: RSVP form + API
- T047: RSVP dashboard view
- T048: Gift QR (VietQR generation)
- T049: Gift tracking dashboard
- T050: Rate limiting for public APIs
- T051: Blessing box page (dashboard)

### Deliverables
- ✅ Guests can interact with invitations
- ✅ Dashboard shows all guest activity

---

## Phase 6: Billing & Monetization (Week 13-14)

### Sprint Goals
- Pricing page
- Plan management
- Payment integration
- Feature gating
- Add-on system

### Tasks
- T052: Pricing page (3 tiers comparison)
- T053: PayOS/Stripe integration
- T054: Order creation and tracking
- T055: Plan activation on payment
- T056: Feature gating middleware
- T057: Watermark for free tier
- T058: Add-on purchase system
- T059: Billing dashboard
- T060: Full-service package page

### Deliverables
- ✅ Users can upgrade plans
- ✅ Feature limits enforced
- ✅ Payment processing working

---

## Phase 7: Polish & Launch (Week 15-16)

### Sprint Goals
- Performance optimization
- SEO
- Security audit
- Landing page
- Customer showcase

### Tasks
- T061: Landing page (hero, features, templates, FAQ)
- T062: Customer showcase page
- T063: SEO optimization (meta tags, OG images)
- T064: Performance audit (Core Web Vitals)
- T065: Security audit (XSS, CSRF, rate limiting)
- T066: Error monitoring (Sentry)
- T067: Analytics (PostHog)
- T068: Profile management page
- T069: Feedback system
- T070: Partner program page

### Deliverables
- ✅ Production-ready application
- ✅ Beautiful marketing pages
- ✅ Monitoring and analytics in place
