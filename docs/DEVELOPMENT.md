# LoveStory — Development Report
> Cập nhật: 08/03/2026 | Domain: 7app.online | Repo: github.com/ainear/lovestory

---

## 🎯 Mục tiêu dự án

Xây dựng platform thiệp cưới điện tử (SaaS) tại Việt Nam, cạnh tranh trực tiếp với **cinelove.me**. Người dùng tạo thiệp online, chia sẻ link, khách nhận link → mở thiệp → RSVP.

**Stack:** Next.js 15 (App Router) + Supabase (PostgreSQL + Auth) + Cloudflare R2 (media) + Vercel (deploy)

---

## ✅ Công việc đã hoàn thành

### Sprint 0 — Production Launch
| Việc | Kết quả |
|------|---------|
| Domain `7app.online` kích hoạt | ✅ |
| Vercel deploy monorepo (pnpm + Corepack 9.15.0) | ✅ |
| Google OAuth enable | ✅ |
| Resend DNS (DKIM, SPF, MX) | ✅ |
| SePay payment integration | ✅ |
| Plan-gated tRPC middleware | ✅ |

### Sprint 1 — Security + Cinelove Parity
| Việc | File | Kết quả |
|------|------|---------|
| Rate limit `/api/likes` (10/min/IP) | `api/likes/route.ts` | ✅ |
| Rate limit `/api/views` (30/min/IP) | `api/views/route.ts` | ✅ |
| Scroll reveal animations (IntersectionObserver) | `i/[slug]/page.tsx` | ✅ |
| 15 themes synced (editor ↔ invitation view) | `editor/[id]/page.tsx` | ✅ |
| Landing page template showcase section | `page.tsx` | ✅ |
| Support tab P0 fix (redirect loop) | `dashboard` | ✅ |

### Sprint 2 — Layout Templates
| Việc | Chi tiết |
|------|---------|
| **Classic layout** | Original style |
| **Cinematic layout** | Full-screen photo hero + serif typography |
| **Minimal layout** | Font-weight 100 + thin divider |
| Auto-detect từ `template_slug` | `cinematic-*` prefix → Cinematic layout |

### Sprint 3 — Multi-category + Blog/SEO + Drag-drop
| Việc | File |
|------|------|
| DB migration: `category` column + `blog_posts` table | `migrations/20260308_sprint3_categories_blog.sql` |
| Editor category dropdown wired (wedding/birthday/event/anniversary/other) | `editor/[id]/page.tsx` |
| Blog index `/blog` (force-dynamic + anon key) | `blog/page.tsx` |
| Blog post `/blog/[slug]` (generateMetadata + OpenGraph + BlogPosting schema) | `blog/[slug]/page.tsx` |
| 3 SEO seed posts | SQL migration |
| Drag-drop section reorder (HTML5 native) | `editor/[id]/page.tsx` |
| Blog link added to landing nav | `page.tsx` |

### Sprint 4 — Growth
| Việc | File |
|------|------|
| Dynamic `sitemap.xml` (includes all blog posts) | `sitemap.ts` |
| Share buttons: Zalo + Facebook + Copy link (floating glassmorphism) | `i/[slug]/page.tsx` |
| Admin blog CRUD (`/admin/blog`) | `admin/blog/page.tsx` |
| Blog Posts link in admin sidebar | `admin/layout.tsx` |

### Supabase Keep-Alive
| Việc | File |
|------|------|
| GitHub Actions ping every 4 days (08:00 UTC) | `.github/workflows/supabase-keepalive.yml` |
| Reuses `SUPABASE_URL` + `SUPABASE_ANON_KEY` secrets | GitHub Secrets |
| Tested: HTTP 200 cả 2 endpoints | ✅ Pass |

---

## 📊 Pre-check kết quả (08/03/2026 ~18:51)

| URL | Status | Chi tiết |
|-----|--------|---------|
| `7app.online` | ✅ | Nav: Blog link hiển thị |
| `7app.online/blog` | ✅ | 3 bài viết, force-dynamic |
| `7app.online/blog/thiet-ke-thiep-cuoi-online-dep` | ✅ | SEO metadata + OpenGraph OK |
| `7app.online/i/demo-wedding` | ✅ | Envelope → scroll reveal → share bar |
| `7app.online/templates` | ✅ | Category filter (Wedding/Birthday/Event) |
| `7app.online/admin/blog` | ✅ | CRUD table: 3 posts + "+ Bài viết mới" |
| `7app.online/sitemap.xml` | ✅ | 9 URLs, 3 blog posts index |

---

## 🗺️ Git History

```
3df6283  fix(ci): keepalive SUPABASE_URL/ANON_KEY + validate step
3ea4e40  ci: add Supabase keep-alive ping (every 4 days)
ee3b438  feat(sprint4): sitemap + share buttons + admin blog manager
6a61b3a  fix: blog index force-dynamic + anon key
5a16262  feat(sprint3): multi-category + blog/SEO + drag-drop editor
fde78b6  feat: rate limit likes/views + 3 layout templates
6d56232  feat: scroll reveal + 15 synced themes + landing template showcase
46c50db  feat: P0 fix Support tab + 12 new templates (total 15)
```

---

## 🔐 Security Status

| Mục | Status |
|-----|--------|
| Rate limiting (likes + views) | ✅ Implemented |
| RLS on blog_posts (public read published only) | ✅ |
| Admin route guard (email whitelist) | ✅ |
| No secrets in code | ✅ |
| HTTPS | ✅ Vercel |

### Điểm cần theo dõi
- [ ] Thêm CSRF protection cho RSVP form
- [ ] Review RLS policies blog_posts update/delete (admin only?)
- [ ] Content Security Policy headers

---

## 📦 Database Schema (Sprint 3 additions)

```sql
-- projects table
ALTER TABLE projects ADD COLUMN category TEXT 
  CHECK (category IN ('wedding','birthday','event','anniversary','other'))
  DEFAULT 'wedding';

-- blog_posts table (NEW)
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_url TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: public SELECT on published=true
```

---

## 🚀 Sprint 5 Backlog (Next)

### P0 — Templates (30+ target)
- Hiện tại: 15 templates
- Cần thêm: 15-20 templates mới (birthday, event, anniversary themes)
- Action: Update `TEMPLATE_THEMES` object in `editor/[id]/page.tsx`

### P1 — Analytics
- Option A: Google Analytics 4 (free, đơn giản)
- Option B: Posthog (self-host, privacy-first, funnel analysis)
- Recommendation: GA4 trước (5 phút setup), Posthog sau khi có traffic

### P2 — Referral / Affiliate
- DB: `referral_codes` table + `referrer_id` on users
- Logic: unique link `/r/[code]` → tạo tài khoản → credit referrer
- Reward: free premium month hoặc commission

---

## 🔧 Môi trường

| Var | Where |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + GitHub Secrets |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + GitHub Secrets |
| `SUPABASE_URL` | GitHub Secrets (keep-alive) |
| `SUPABASE_ANON_KEY` | GitHub Secrets (keep-alive) |
| `ADMIN_EMAIL` | Vercel env |
| `RESEND_API_KEY` | Vercel env |
