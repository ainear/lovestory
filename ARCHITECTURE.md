# ARCHITECTURE.md — LoveStory System Architecture

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LoveStory Architecture                            │
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐   │
│   │   Vercel CDN  │     │ Cloudflare   │     │     Supabase Cloud       │   │
│   │   (Frontend)  │     │ Workers      │     │                          │   │
│   │               │     │ (Edge Serve) │     │  ┌───────────────────┐   │   │
│   │  Next.js 15   │     │              │     │  │   PostgreSQL DB   │   │   │
│   │  App Router   │────▶│  site-serve  │     │  │   (via Drizzle)   │   │   │
│   │  React 19     │     │  rsvp-submit │     │  └───────────────────┘   │   │
│   │  tRPC Client  │     │              │     │  ┌───────────────────┐   │   │
│   │               │     └──────┬───────┘     │  │   Auth (GoTrue)   │   │   │
│   └──────┬───────┘            │              │  └───────────────────┘   │   │
│          │                    │              │  ┌───────────────────┐   │   │
│          │    tRPC / REST     │              │  │   Realtime (WS)   │   │   │
│          ▼                    │              │  └───────────────────┘   │   │
│   ┌──────────────┐            │              └──────────┬───────────┘   │   │
│   │  API Layer   │            │                         │               │   │
│   │  (Next.js    │────────────┼─────────────────────────┘               │   │
│   │   API Routes │            │                                         │   │
│   │   + tRPC)    │            │                                         │   │
│   └──────┬───────┘            │                                         │   │
│          │                    │                                         │   │
│          │   Job Queue        ▼                                         │   │
│          │            ┌──────────────┐     ┌──────────────────────┐     │   │
│          ▼            │ Cloudflare   │     │    AI Services       │     │   │
│   ┌──────────────┐    │ R2 Storage   │     │                      │     │   │
│   │  Redis +     │    │              │     │  ┌────────────────┐  │     │   │
│   │  BullMQ      │    │  /projects/  │     │  │ FFmpeg Worker  │  │     │   │
│   │  (Job Queue) │    │  /videos/    │     │  │ (Video Render) │  │     │   │
│   │              │    │  /templates/ │     │  ├────────────────┤  │     │   │
│   └──────┬───────┘    │  /music/     │     │  │ rembg (BG Rem) │  │     │   │
│          │            │  /static/    │     │  ├────────────────┤  │     │   │
│          ▼            └──────────────┘     │  │ Face Detection │  │     │   │
│   ┌──────────────┐                        │  ├────────────────┤  │     │   │
│   │ Video Worker │                        │  │ Gemini LLM     │  │     │   │
│   │ (Fly.io /    │───────────────────────▶│  │ (Text Gen)     │  │     │   │
│   │  Docker)     │                        │  └────────────────┘  │     │   │
│   └──────────────┘                        └──────────────────────┘     │   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Service Breakdown

### 2.1 Web Application (Next.js 15)

| Aspect | Decision |
|--------|----------|
| **Framework** | Next.js 15 (App Router) |
| **Runtime** | Node.js (Vercel serverless) |
| **UI Library** | React 19 + Shadcn/UI |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand (client) + React Query (server) |
| **API Layer** | tRPC v11 (type-safe end-to-end) |
| **Auth** | Supabase Auth (Google, Email+OTP) |
| **i18n** | next-intl (Vietnamese default, English ready) |
| **Deployment** | Vercel (auto-deploy from main branch) |

**Responsibilities:**
- Landing page, template gallery, dashboard
- Invitation editor (Phase 1: form-based, Phase 2: GrapesJS)
- Video generation UI (upload, preview, download)
- User settings, billing, guest management
- Admin panel (analytics, template management)

### 2.2 Video Worker (Background Processing)

| Aspect | Decision |
|--------|----------|
| **Runtime** | Node.js + TypeScript |
| **Job Queue** | BullMQ (Redis-backed) |
| **Video Processing** | FFmpeg (fluent-ffmpeg) |
| **AI Enhancement** | Python microservices (rembg, face-api) |
| **Deployment** | Fly.io (auto-scale) or Docker (self-hosted) |

**Responsibilities:**
- Video rendering pipeline (10-step process)
- Image preprocessing (resize, crop, background removal)
- Static invitation site building
- Thumbnail generation
- Webhook callbacks on completion

### 2.3 Edge Functions (Cloudflare Workers)

| Worker | Purpose |
|--------|---------|
| `site-serve` | Serve published invitation pages from R2 |
| `rsvp-submit` | Handle RSVP form submissions (rate-limited) |
| `view-counter` | Track page views with quota enforcement |

### 2.4 AI Services Layer

| Service | Technology | Purpose |
|---------|-----------|---------|
| **FFmpeg Pipeline** | fluent-ffmpeg + custom presets | Video compositing, transitions, overlays |
| **Background Removal** | rembg (Python, ONNX) | Remove photo backgrounds |
| **Face Detection** | face-api.js or Mediapipe | Smart crop, face positioning |
| **Text Generation** | Google Gemini API | Love story text, poem generation |
| **Music Analysis** | Essentia.js (optional) | BPM/mood matching for music selection |

---

## 3. Data Architecture

### 3.1 Database (Supabase / PostgreSQL)

- **ORM:** Drizzle ORM (type-safe, migration-friendly)
- **Connection:** Supabase connection pooler (pgBouncer)
- **RLS:** Row Level Security for multi-tenant isolation
- **Migrations:** drizzle-kit (push/generate/migrate)

### 3.2 Object Storage (Cloudflare R2)

```
r2://lovestory-storage/
├── projects/{project_id}/
│   ├── document.json          # Invitation structure
│   ├── theme.json             # Design tokens
│   └── assets/                # User-uploaded images
├── videos/{video_id}/
│   ├── input/                 # Source photos
│   ├── processed/             # AI-processed images
│   ├── output/
│   │   ├── preview.mp4        # Preview quality (720p)
│   │   ├── final.mp4          # Final quality (1080p/4K)
│   │   └── thumbnail.jpg      # Video thumbnail
│   └── metadata.json          # Render config
├── templates/{template_id}/
│   ├── preview.jpg
│   ├── document.json
│   └── theme.json
├── music/
│   ├── library/               # Platform music library
│   └── user/{user_id}/        # User-uploaded music
└── static/{project_id}/       # Published static sites
    ├── index.html
    ├── assets/
    └── manifest.json
```

### 3.3 Cache Layer (Redis / Upstash)

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `session:{id}` | 24h | User session cache |
| `quota:{user_id}` | 1h | View/credit quota cache |
| `template:list` | 5m | Template gallery cache |
| `render:status:{job_id}` | 1h | Video render progress |

---

## 4. API Architecture

### 4.1 tRPC Router Structure

```
src/server/trpc/
├── routers/
│   ├── auth.ts          # Authentication & profile
│   ├── project.ts       # Invitation CRUD
│   ├── template.ts      # Template gallery
│   ├── video.ts         # AI video generation
│   ├── guest.ts         # Guest management (RSVP, wishes, gifts)
│   ├── billing.ts       # Subscription & credits
│   ├── media.ts         # File upload & management
│   └── admin.ts         # Admin operations
└── trpc.ts              # tRPC initialization + context
```

### 4.2 Internal API (Worker ↔ Backend)

- **Protocol:** REST with API key authentication
- **Endpoints:** `/api/internal/webhook/video-complete`, `/api/internal/webhook/build-complete`
- **Security:** Shared secret in header + IP allowlist

---

## 5. Deployment Architecture

### 5.1 Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| **Development** | Local dev | localhost:3000 |
| **Preview** | PR previews | pr-{n}.lovestory.vercel.app |
| **Staging** | Pre-production | staging.lovestory.app |
| **Production** | Live | lovestory.app |

### 5.2 Infrastructure Map

```
┌─────────────────────────────────────────────────────┐
│  DNS: Cloudflare (lovestory.app)                    │
│  ├── lovestory.app → Vercel (Next.js)               │
│  ├── *.lovestory.app → Cloudflare Worker (sites)    │
│  └── api.lovestory.app → Vercel API Routes          │
│                                                      │
│  Compute:                                            │
│  ├── Vercel: Next.js + API Routes (Serverless)       │
│  ├── Fly.io: Video Worker (Docker, auto-scale 1-5)   │
│  └── Cloudflare Workers: Edge functions              │
│                                                      │
│  Data:                                               │
│  ├── Supabase: PostgreSQL + Auth + Realtime          │
│  ├── Upstash Redis: Queue + Cache                    │
│  └── Cloudflare R2: Object Storage                   │
│                                                      │
│  External:                                           │
│  ├── Google Gemini API: Text generation              │
│  ├── PayOS: Payment processing (VN)                  │
│  └── Resend: Transactional emails                    │
└─────────────────────────────────────────────────────┘
```

### 5.3 Scaling Strategy

| Component | Strategy | Auto-scale Trigger |
|-----------|----------|-------------------|
| Web (Vercel) | Serverless, auto-scale | Automatic |
| Video Worker | Fly.io machines (1-5) | Queue depth > 10 |
| Database | Supabase Pro (connection pooler) | Connection count > 50 |
| Redis | Upstash Serverless | Automatic |
| R2 Storage | Cloudflare, unlimited | Automatic |

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
User → Supabase Auth (Google/Email+OTP)
     → JWT Token (access + refresh)
     → tRPC context middleware validates
     → RLS policies enforce tenant isolation
```

### 6.2 Security Layers

| Layer | Implementation |
|-------|---------------|
| **Auth** | Supabase GoTrue (JWT, refresh tokens) |
| **Authorization** | RLS + tRPC middleware (tenant isolation) |
| **API Security** | Rate limiting (Upstash ratelimit) |
| **Input Validation** | Zod schemas (shared package) |
| **File Upload** | Type check, size limit, virus scan (ClamAV optional) |
| **Secrets** | Environment variables (Vercel/Fly.io secrets) |
| **HTTPS** | Enforced everywhere (Cloudflare SSL) |
| **CORS** | Whitelist lovestory.app domains only |
| **CSP** | Content Security Policy headers |

### 6.3 Data Privacy

- PII encrypted at rest (Supabase encryption)
- Guest data subject to GDPR-lite (delete on request)
- User can delete all data (account + projects + videos)
- Payment data never stored (PayOS handles)

---

## 7. Monorepo Structure

**Tool:** Turborepo

```
lovestory/
├── apps/
│   ├── web/              # Next.js 15 web application
│   └── worker/           # Video processing worker
├── packages/
│   ├── shared/           # Shared types, schemas, utils
│   ├── db/               # Drizzle schema + migrations
│   ├── ui/               # Shared UI components (Shadcn)
│   └── config/           # Shared configs (ESLint, TS, Tailwind)
├── workers/
│   ├── site-serve/       # Cloudflare Worker: serve sites
│   ├── rsvp-submit/      # Cloudflare Worker: RSVP handler
│   └── view-counter/     # Cloudflare Worker: view tracking
├── turbo.json
├── package.json
└── docker-compose.yml    # Local dev (Redis, PostgreSQL)
```

---

## 8. Tech Stack Summary

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Framework** | Next.js 15 | App Router, RSC, API routes, Vercel-native |
| **UI** | Shadcn/UI + Tailwind v4 | Composable, accessible, modern |
| **API** | tRPC v11 | End-to-end type safety |
| **Database** | PostgreSQL (Supabase) | Relational, RLS, realtime |
| **ORM** | Drizzle | Type-safe, lightweight, migration-friendly |
| **Auth** | Supabase Auth | Social login, OTP, JWT |
| **Storage** | Cloudflare R2 | S3-compatible, no egress fees |
| **Queue** | BullMQ + Redis | Reliable, delayed jobs, retries |
| **Video** | FFmpeg + fluent-ffmpeg | Industry standard, full control |
| **AI Text** | Google Gemini | Cost-effective, high quality |
| **AI Vision** | rembg, face-api.js | Open source, on-premise |
| **Email** | Resend | Developer-friendly, React templates |
| **Payment** | PayOS | Vietnam market leader |
| **Monorepo** | Turborepo | Fast builds, caching |
| **Deploy (Web)** | Vercel | Zero-config, preview deploys |
| **Deploy (Worker)** | Fly.io | Docker, auto-scale, global |
| **Edge** | Cloudflare Workers | Ultra-low latency |
