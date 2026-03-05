# ROADMAP.md — LoveStory Development Phases

## Tổng Quan

```
Timeline: 16 tuần (4 tháng)

Phase 0: Foundation     [Tuần 1-2]    ████░░░░░░░░░░░░  12.5%
Phase 1: MVP            [Tuần 3-6]    ████████░░░░░░░░  37.5%
Phase 2: Growth         [Tuần 7-10]   ████████████░░░░  62.5%
Phase 3: Scale          [Tuần 11-14]  ████████████████  87.5%
Phase 4: Polish         [Tuần 15-16]  ████████████████  100%
```

---

## Phase 0: Foundation (Tuần 1-2)

> **Mục tiêu:** Setup monorepo, database, auth, và CI/CD pipeline

### Deliverables
- [ ] Turborepo monorepo initialized
- [ ] Next.js 15 app scaffolded (Shadcn/UI, Tailwind v4, tRPC)
- [ ] Supabase project created (PostgreSQL + Auth)
- [ ] Drizzle ORM schema + initial migration
- [ ] Cloudflare R2 bucket configured
- [ ] Redis/Upstash setup for queue
- [ ] Docker Compose for local dev (PostgreSQL, Redis)
- [ ] ESLint + Prettier + Husky configured
- [ ] CI/CD pipeline (GitHub Actions → Vercel preview deploys)
- [ ] Auth flow working (Google + Email OTP)
- [ ] Basic layout: Landing page skeleton + Dashboard skeleton

### Technical Milestones
| Milestone | Verification |
|-----------|-------------|
| Monorepo builds | `turbo build` succeeds |
| Database connected | Drizzle push + seed works |
| Auth flow | Login/logout/session works |
| R2 connected | File upload/download works |
| CI/CD | PR creates preview deploy |

---

## Phase 1: MVP — Invitation + AI Video (Tuần 3-6)

> **Mục tiêu:** User có thể tạo thiệp từ template, generate AI video, và share

### Sprint 1 (Tuần 3-4): Template Invitation Builder

- [ ] Template Gallery page (grid + category filters)
- [ ] Template preview modal với QR code
- [ ] "Use this template" → create project flow
- [ ] Form-based invitation editor:
  - Couple names, wedding date, venue
  - Photo upload (up to 10 free tier)
  - Color palette selector
  - Font selector (Google Fonts)
  - Background music (library picker)
- [ ] Invitation preview (mobile responsive)
- [ ] Publish invitation → generate static HTML → deploy to R2
- [ ] Shareable link generation (lovestory.app/i/{slug})
- [ ] site-serve Cloudflare Worker
- [ ] SEO: Invitation public pages with OG meta

### Sprint 2 (Tuần 5-6): AI Video Generator

- [ ] Video generation UI:
  - Upload photos (5-20)
  - Select video template (5 presets)
  - Choose music track
  - Enter couple info (for text overlays)
- [ ] FFmpeg video worker:
  - Photo preprocessing (resize, auto-crop)
  - Ken Burns effect (zoom/pan animation)
  - Transitions (crossfade, slide, zoom)
  - Text overlays (couple names, date, venue)
  - Music track mixing
  - Output: 720p preview + 1080p final
- [ ] AI Enhancements:
  - Face detection for smart crop
  - Background removal (rembg)
  - Gemini API: Generate "Love Story" text
- [ ] Video render queue (BullMQ):
  - Job submission → progress tracking → webhook callback
  - Status: queued → processing → encoding → complete
- [ ] Video preview/download in dashboard
- [ ] Embed video in invitation page
- [ ] Watermark for free tier videos

### Phase 1 Exit Criteria
- ✅ User can signup → pick template → create invitation → publish → share
- ✅ User can upload photos → generate AI video → embed in invitation
- ✅ Free tier works with limits (1 invitation, 1 video, watermark)
- ✅ Landing page is live and presentable

---

## Phase 2: Growth — Guest Management + Billing (Tuần 7-10)

> **Mục tiêu:** Monetization + guest interaction features

### Sprint 3 (Tuần 7-8): Guest Management & RSVP

- [ ] Guest list management (add, edit, delete)
- [ ] CSV import/export guests
- [ ] Personalized guest name in invitation link (?guest=Anh+Minh)
- [ ] RSVP form on invitation page (via rsvp-submit Worker)
- [ ] RSVP dashboard: Confirmed / Declined / Pending
- [ ] Guest wish wall (submit + display on invitation)
- [ ] Gift management (QR code for bank transfer)
- [ ] View counter + quota enforcement (view-counter Worker)

### Sprint 4 (Tuần 9-10): Billing & Pricing

- [ ] Pricing page (Free / Pro / Premium comparison)
- [ ] PayOS integration (checkout flow)
- [ ] Plan upgrade/downgrade logic
- [ ] Credit pack purchase (for extra AI videos)
- [ ] Feature gating middleware (check plan limits)
- [ ] Billing dashboard (current plan, usage, invoices)
- [ ] Webhook: payment confirmation → activate plan
- [ ] Email notifications (Resend): welcome, plan upgraded, video ready

### Phase 2 Exit Criteria
- ✅ Guest can RSVP, send wishes, send gifts via invitation
- ✅ Couple can manage guest list, view analytics
- ✅ Payment flow works end-to-end
- ✅ Free/Pro/Premium feature gating enforced
- ✅ Revenue is flowing

---

## Phase 3: Scale — Editor + Advanced Features (Tuần 11-14)

> **Mục tiêu:** Drag-and-drop editor, advanced AI, B2B features

### Sprint 5 (Tuần 11-12): Visual Editor

- [ ] GrapesJS integration with custom wedding blocks
- [ ] Drag-and-drop: text, image, video, countdown, map blocks
- [ ] Component library: header, hero, timeline, gallery, RSVP form
- [ ] Style panel: colors, fonts, spacing, backgrounds
- [ ] Responsive preview (mobile/tablet/desktop)
- [ ] Auto-save + version history

### Sprint 6 (Tuần 13-14): Advanced AI + B2B

- [ ] AI Video Templates v2 (10+ presets, more transitions)
- [ ] Video resolution: 4K for Premium users
- [ ] Live Photo Wall (Phase 2 viral feature):
  - Guest can upload photos during event
  - Photos appear in real-time on invitation page
- [ ] Admin panel:
  - Template management (CRUD)
  - User management
  - Revenue analytics
  - System health dashboard
- [ ] White-label preparation (custom domain per studio)
- [ ] API rate limiting + abuse protection

### Phase 3 Exit Criteria
- ✅ Full drag-and-drop editor working with blocks
- ✅ 4K video rendering for premium
- ✅ Live Photo Wall feature working
- ✅ Admin panel operational

---

## Phase 4: Polish & Launch (Tuần 15-16)

> **Mục tiêu:** Production readiness, performance, SEO

### Polish Tasks
- [ ] Performance audit (Core Web Vitals < 2s LCP)
- [ ] Security audit (OWASP checklist)
- [ ] SEO optimization (meta tags, sitemap, structured data)
- [ ] Error handling & monitoring (Sentry)
- [ ] Analytics integration (PostHog or Mixpanel)
- [ ] Documentation: API docs, user guide
- [ ] Load testing (k6 or Artillery)
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Legal: Privacy policy, Terms of Service
- [ ] Blog setup (SEO content marketing)
- [ ] Social media presence (Zalo OA, Facebook, TikTok)

### Launch Checklist
- [ ] Domain configured (lovestory.app)
- [ ] SSL certificates active
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Customer support channel (Zalo/Facebook Messenger)
- [ ] Launch landing page with demo video

---

## Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| FFmpeg render too slow | High | Medium | Pre-computed transition presets, caching, worker auto-scale |
| AI costs exceed budget | High | Low | Credit system, usage limits, batch processing |
| Supabase limits hit | Medium | Low | Connection pooler, query optimization, caching |
| CineLove copies AI video | Medium | Medium | Speed to market, build moat with quality + UX |
| Low conversion to paid | High | Medium | A/B test pricing, offer trial credits, optimize funnel |

---

## Success Milestones

| Month | Target | Key Metric |
|-------|--------|------------|
| Month 1 | MVP live | First 100 signups |
| Month 2 | Billing live | First 10 paying users |
| Month 3 | Growth features | 1,000 MAU, 50 paid |
| Month 4 | Scale features | 5,000 MAU, 200 paid |
| Month 6 | Market expansion | 10,000 MAU, 500 paid, 5M VND MRR |
| Month 12 | Market leader | 50,000 MAU, 2,000 paid, 100M VND MRR |
