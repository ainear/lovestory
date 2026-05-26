# Tech Stack

## Runtime & Languages
- **Node.js**: `>=20` (required), `.nvmrc` pins to `20.x`
- **TypeScript**: `^5` (strict mode, `noEmit: true`, target `ES2017`)
- **Package Manager**: `pnpm@9.15.0`

## Frameworks
- **Next.js**: `16.1.6` (App Router, Turbopack dev, `--turbopack` flag)
- **React**: `19.2.3`
- **React DOM**: `19.2.3`

## Monorepo Structure
- **Turborepo**: `^2.4.0` (build orchestration, caching)
- **pnpm workspaces**: `apps/*` + `packages/*`
- **Apps**: `apps/web` (`@lovestory/web`)
- **Packages**:
  - `packages/db` (`@lovestory/db`) — Drizzle ORM + schema
  - `packages/shared` (`@lovestory/shared`) — Shared Zod types/validators

## Key Dependencies (apps/web)

### API Layer
| Package | Version | Role |
|---------|---------|------|
| `@trpc/server` | `^11.11.0` | Type-safe API server |
| `@trpc/client` | `^11.11.0` | Type-safe API client |
| `@trpc/next` | `^11.11.0` | Next.js tRPC adapter |
| `@trpc/react-query` | `^11.11.0` | React Query bridge |
| `@tanstack/react-query` | `^5.90.21` | Server state management |
| `superjson` | `^2.2.6` | tRPC serialization |
| `zod` | `^3.24.0` | Schema validation |

### Database
| Package | Version | Role |
|---------|---------|------|
| `drizzle-orm` | `^0.39.0` | ORM for PostgreSQL |
| `drizzle-kit` | `^0.30.0` | Schema migrations CLI |
| `postgres` | `^3.4.0` | PostgreSQL driver |
| `pg` | `^8.20.0` | PostgreSQL (dev/testing) |

### Auth & Backend Services
| Package | Version | Role |
|---------|---------|------|
| `@supabase/supabase-js` | `^2.98.0` | Supabase JS client |
| `@supabase/ssr` | `^0.9.0` | Supabase SSR helpers |

### Storage
| Package | Version | Role |
|---------|---------|------|
| `@aws-sdk/client-s3` | `^3.1002.0` | Cloudflare R2 via S3 API |
| `@aws-sdk/s3-request-presigner` | `^3.1002.0` | Presigned URLs |

### UI & Frontend
| Package | Version | Role |
|---------|---------|------|
| `lucide-react` | `^0.577.0` | Icons |
| `@dnd-kit/core` | `^6.3.1` | Drag-and-drop |
| `@dnd-kit/utilities` | `^3.2.2` | DnD utilities |
| `html2canvas` | `^1.4.1` | Invitation screenshot |
| `@imgly/background-removal` | `^1.7.0` | Client-side BG removal |
| `isomorphic-dompurify` | `^3.3.0` | HTML sanitization |

### AI & Email
| Package | Version | Role |
|---------|---------|------|
| `@google/generative-ai` | `^0.24.1` | Gemini AI SDK |
| `resend` | `^6.9.3` | Transactional email |

### Observability
| Package | Version | Role |
|---------|---------|------|
| `@sentry/nextjs` | `^10.43.0` | Error monitoring |
| `posthog-js` | `^1.360.2` | Product analytics |

## Build & Tooling
- **Turbopack**: Used in `next dev --turbopack` for fast HMR
- **Turborepo tasks**: `build`, `dev`, `lint`, `type-check`, `db:push`, `db:seed`
- **Tailwind CSS**: `^4` (PostCSS config via `@tailwindcss/postcss`)
- **ESLint**: `^9` + `eslint-config-next 16.1.6`
- **Testing**:
  - Unit: `vitest ^4.1.0` + `@vitest/coverage-v8`
  - E2E: `@playwright/test ^1.58.2`
  - Stress: `k6` (`test:stress` script)
- **TypeScript build info**: incremental builds (`tsconfig.tsbuildinfo`)

## Fonts
29 Google Fonts loaded via `next/font/google` (Vietnamese wedding typography):
- Scripts: Dancing Script, Great Vibes, Sacramento, Alex Brush, Allura, Pinyon Script, Parisienne, Tangerine, Petit Formal Script, Italianno, Lovers Quarrel, Rouge Script, Carattere, Pacifico, Satisfy
- Serif: Playfair Display, Lora, Cormorant Garamond, Cormorant Infant, Libre Baskerville, EB Garamond, Crimson Text, Spectral, Bodoni Moda, Playfair Display SC, Cinzel, Cinzel Decorative, Tenor Sans, Antic Didone
- Sans: Inter, Quicksand, Montserrat, Raleway, Josefin Sans, Poppins

## Configuration Files
| File | Path |
|------|------|
| Root workspace config | `/pnpm-workspace.yaml` |
| Turborepo config | `/turbo.json` |
| Next.js config | `apps/web/next.config.ts` |
| TypeScript config | `apps/web/tsconfig.json` |
| Drizzle config | `packages/db/drizzle.config.ts` |
| Tailwind/PostCSS | `apps/web/postcss.config.mjs` |
| ESLint | `apps/web/eslint.config.mjs` |
| Playwright | `apps/web/playwright.config.ts` |
| Vitest | `apps/web/vitest.config.ts` |
| Sentry client | `apps/web/sentry.client.config.ts` |
| Sentry server | `apps/web/sentry.server.config.ts` |
| Sentry edge | `apps/web/sentry.edge.config.ts` |
| Vercel deploy config | `apps/web/vercel.json` |
| Env template | `apps/web/.env.example` |
