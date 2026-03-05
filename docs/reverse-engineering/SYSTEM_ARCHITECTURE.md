# SYSTEM_ARCHITECTURE.md — CineLove Inferred System Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CDN / Edge Layer                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ cinelove.me  │ │img.cinelove.me│ │ Cloudflare/Vercel   │ │
│  │  (Next.js)   │ │ (Image CDN)  │ │ (Static Invitations) │ │
│  └──────┬───────┘ └──────────────┘ └──────────────────────┘ │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │  Next.js Frontend    │  │   API Server                 │ │
│  │  - SSR Pages         │  │   api.cinelove.me            │ │
│  │  - Client SPA        │  │   - Auth (JWT)               │ │
│  │  - Canvas Editor     │  │   - Projects CRUD            │ │
│  │  - Dashboard         │  │   - Templates API            │ │
│  │  - Template Gallery  │  │   - File Upload              │ │
│  └──────────────────────┘  │   - Guest Interactions       │ │
│                            │   - Billing/Orders           │ │
│                            │   - Analytics                │ │
│                            └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │  PostgreSQL   │ │  Redis       │ │  S3/R2 Storage       │ │
│  │  (Users,      │ │ (Sessions,   │ │ (Images, Music,      │ │
│  │   Projects,   │ │  Cache)      │ │  Static HTML)        │ │
│  │   Templates)  │ │              │ │                      │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend

| Aspect | Technology |
|--------|-----------|
| **Framework** | Next.js (confirmed via `/_next/data/` endpoints) |
| **Rendering** | SSR for public pages, CSR for dashboard/editor |
| **Editor Engine** | Custom JavaScript canvas/page builder (NOT GrapesJS or standard library) |
| **Styling** | Custom CSS framework (dark theme) |
| **State Management** | React state + Context (likely Zustand or Redux for editor) |
| **Hosting** | Vercel (inferred from Next.js defaults) |

---

## Backend

| Aspect | Technology |
|--------|-----------|
| **API Server** | Separate server at `api.cinelove.me` |
| **Runtime** | Node.js (likely Express or Fastify) |
| **Authentication** | JWT-based with Google/Facebook OAuth |
| **File Upload** | Multipart form-data → S3-compatible storage |
| **Image Optimization** | CDN at `img.cinelove.me` (likely Cloudflare Images or custom) |

---

## Database (Inferred)

| Aspect | Technology |
|--------|-----------|
| **Primary DB** | PostgreSQL (supabase or standalone) |
| **Data Format** | JSONB columns for invitation layout data |
| **ORM** | Prisma or Drizzle (common in Next.js ecosystem) |
| **Caching** | Redis for sessions and rate limiting |

---

## Storage

| Aspect | Implementation |
|--------|---------------|
| **Image Storage** | S3-compatible (Cloudflare R2 or AWS S3) |
| **Image CDN** | `img.cinelove.me` with optimization |
| **Music Files** | Same S3 storage, served via CDN |
| **Published Invitations** | Static HTML files on CDN/hosting |
| **Layout Data** | JSON stored in PostgreSQL JSONB |

---

## Deployment

| Component | Platform |
|-----------|----------|
| **Frontend (Next.js)** | Vercel (likely) |
| **API Server** | VPS or Cloud (separate domain) |
| **Database** | Managed PostgreSQL (Supabase or Cloud SQL) |
| **Storage** | Cloudflare R2 or AWS S3 |
| **CDN** | Cloudflare (domain suggests this) |
| **DNS** | Cloudflare DNS |

---

## Key Design Patterns

1. **Separation of Concerns:** Frontend (`cinelove.me`) and API (`api.cinelove.me`) on separate domains
2. **JSON-First:** Invitation layouts are JSON documents, not database-relational
3. **Client-Side Rendering for Editor:** Editor is a heavy SPA with canvas manipulation
4. **SSR for SEO:** Public template and marketing pages are server-rendered
5. **CDN for Assets:** Dedicated image CDN for uploaded content
6. **Rate Limiting:** IP-based rate limiting for public APIs (wishes, RSVP)
7. **Plan Enforcement:** Server-side quota checking via `addons/user/usage` API

---

## Performance Characteristics

- Landing page loads fast (SSR + CDN)
- Editor is the heaviest page (large JavaScript bundle for canvas engine)
- Published invitations are lightweight (static HTML + CSS + JS)
- Image optimization via CDN ensures fast load times
- Music files are standard MP3, no transcoding needed
