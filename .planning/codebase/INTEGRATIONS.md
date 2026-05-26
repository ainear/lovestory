# External Integrations

## Database
### Supabase (PostgreSQL)
- **Client**: `@supabase/supabase-js ^2.98.0` + `@supabase/ssr ^0.9.0`
- **Region**: `aws-0-ap-southeast-1` (Southeast Asia)
- **Usage**: Primary database, auth, file storage (`media` bucket for videos)
- **Connection**: Direct Postgres URL via `DATABASE_URL` (migrations only)
- **Pooler**: `aws-0-ap-southeast-1.pooler.supabase.com:6543` (port 6543)
- **Environment vars**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
  - `DATABASE_URL` (local migrations only)

### Drizzle ORM Layer
- **Package**: `drizzle-orm ^0.39.0` in `packages/db`
- **Dialect**: PostgreSQL
- **Schema location**: `packages/db/src/schema/index.ts`
- **Migrations output**: `packages/db/drizzle/`
- **Commands**: `db:push`, `db:generate`, `db:migrate`, `db:studio`, `db:seed`

## Authentication
### Supabase Auth (built-in)
- **Provider**: Supabase Auth (email/password + OAuth)
- **SSR**: `@supabase/ssr` for server-side session handling
- **Middleware**: `apps/web/src/lib/supabase/middleware.ts`
- **Client helpers**: `apps/web/src/lib/supabase/client.ts`, `server.ts`

## Payments
### SePay (Vietnamese Payment Gateway)
- **Provider**: [sepay.vn](https://sepay.vn) — Vietnamese bank transfer gateway
- **Webhook endpoint**: `apps/web/src/app/api/webhook/sepay/`
- **Environment vars**:
  - `SEPAY_MERCHANT_ID`
  - `SEPAY_SECRET_KEY`
  - `SEPAY_WEBHOOK_SECRET` (HMAC signature verification)
  - `SEPAY_SANDBOX` (set `false` for production)
- **Plans**: Free, Basic, Premium tiers

## AI / ML Services

### Google Gemini AI
- **Package**: `@google/generative-ai ^0.24.1`
- **Model**: `gemini-2.5-flash` (via REST API)
- **Usage**: AI text generation for wedding video overlays (love story, poems, titles)
- **Service**: `apps/web/src/server/services/ai-text.ts`
- **API endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Environment vars**:
  - `GEMINI_API_KEY`

### Kling AI (Optional — AI Video from Photos)
- **Usage**: AI-powered video generation from couple photos (referenced in `.env.example`)
- **Status**: Optional integration (configured but may not be actively used in current routes)
- **Environment vars**:
  - `KLING_ACCESS_KEY`
  - `KLING_SECRET_KEY`

### FFmpeg (Self-hosted Video Engine)
- **Runtime**: `spawn('ffmpeg', ...)` — system FFmpeg binary
- **Production**: Runs in Docker container on **Fly.io**
- **Local dev**: `brew install ffmpeg` (macOS)
- **Service**: `apps/web/src/server/services/ffmpeg-builder.ts`
- **Features**: Ken Burns, xfade transitions, text overlays, color grading, audio mixing
- **Resolutions**: 720p (free), 1080p (basic), 4K (premium)

### Background Removal (Client-side)
- **Package**: `@imgly/background-removal ^1.7.0`
- **Usage**: Remove photo backgrounds in browser (WebAssembly-based)

## Storage
### Supabase Storage
- **Usage**: Primary — video files and thumbnails (`media` bucket: `videos/{id}/output.mp4`, `videos/{id}/thumb.jpg`)

### Cloudflare R2 (S3-compatible)
- **Package**: `@aws-sdk/client-s3 ^3.1002.0` + `@aws-sdk/s3-request-presigner ^3.1002.0`
- **Service**: `apps/web/src/server/services/r2.ts`
- **Usage**: User uploads (photos, music), presigned direct uploads
- **Environment vars**:
  - `R2_ENDPOINT`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET`
  - `R2_PUBLIC_URL`

## Email
### Resend
- **Package**: `resend ^6.9.3`
- **From address**: `LoveStory <noreply@7app.online>`
- **Service**: `apps/web/src/server/services/email.ts`
- **Email types**:
  - Welcome email (new user registration)
  - Video ready notification
  - Payment confirmed
  - RSVP alert (with 1-click unsubscribe token)
- **Environment vars**:
  - `RESEND_API_KEY`
  - `EMAIL_FROM`
  - `UNSUBSCRIBE_SECRET` (HMAC for unsubscribe tokens)

## Hosting & Deployment
### Vercel
- **Framework**: Next.js
- **Build command**: `cd ../.. && pnpm turbo build --filter=@lovestory/web`
- **Install command**: `cd ../.. && pnpm install`
- **Output**: `.next`
- **Config**: `apps/web/vercel.json`
- **Production URL**: `https://7app.online`

### Fly.io
- **Usage**: FFmpeg video rendering workers (Docker containers)
- **Role**: Async video generation backend (fire-and-forget via internal API)
- **Auth**: `INTERNAL_API_SECRET` (server-to-server Bearer token)

## Error Monitoring
### Sentry
- **Package**: `@sentry/nextjs ^10.43.0`
- **Configs**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- **Features**: Error capture, performance monitoring (10% sample), session replay (10% + 100% on error)
- **Environment vars**:
  - `NEXT_PUBLIC_SENTRY_DSN`
  - `SENTRY_DSN`
  - `SENTRY_ORG`
  - `SENTRY_PROJECT` (`lovestory-web`)
  - `SENTRY_AUTH_TOKEN` (source map uploads on CI)

## Analytics
### PostHog
- **Package**: `posthog-js ^1.360.2`
- **Provider**: `apps/web/src/lib/posthog/provider.tsx`
- **Wrapper**: Applied at root layout level
- **Environment vars**:
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST`

### Google Analytics 4 (Optional)
- **Method**: `next/script` (via `gtag.js`)
- **Conditional**: Only loads if `NEXT_PUBLIC_GA_ID` is set
- **Environment vars**:
  - `NEXT_PUBLIC_GA_ID`

## External Content APIs
### Pixabay CDN
- **Usage**: Music tab thumbnails (allowed in `next.config.ts` remotePatterns)
- **Domain**: `cdn.pixabay.com`

### VietQR / QuickChart
- **Usage**: QR code generation for wedding invitations
- **Domains**: `img.vietqr.io`, `quickchart.io`

## Security
- **Rate limiting**: `apps/web/src/lib/rate-limit.ts` (custom implementation)
- **Internal API auth**: `INTERNAL_API_SECRET` Bearer token (server-to-server calls)
- **Admin routes**: Protected by `ADMIN_EMAIL` env var
- **Security headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options (in `next.config.ts`)
- **HTML sanitization**: `isomorphic-dompurify ^3.3.0`
