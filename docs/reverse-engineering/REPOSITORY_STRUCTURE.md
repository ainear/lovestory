# REPOSITORY_STRUCTURE.md — CineLove-like System Implementation

## Monorepo Structure (Turborepo + pnpm)

```
lovestory/
│
├── apps/
│   │
│   ├── web/                          # Next.js 15 Frontend + API
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   └── images/
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   │   ├── (auth)/           # Login/Register
│   │   │   │   ├── (marketing)/      # Landing, Templates, Pricing, Contact
│   │   │   │   ├── (dashboard)/      # Dashboard pages (sidebar layout)
│   │   │   │   ├── (editor)/         # Canvas editor page
│   │   │   │   ├── (public)/         # Published invitation view
│   │   │   │   └── api/              # tRPC handler + webhooks
│   │   │   ├── components/
│   │   │   │   ├── layout/           # Sidebar, Header, Footer, Nav
│   │   │   │   ├── editor/           # Canvas, Toolbox, PropertyPanel
│   │   │   │   ├── template/         # TemplateCard, Gallery, Preview
│   │   │   │   ├── project/          # ProjectCard, ProjectForm
│   │   │   │   ├── guest/            # WishWall, RSVP, GiftBox
│   │   │   │   ├── billing/          # PricingTable, PlanCard
│   │   │   │   ├── invitation/       # PublicInvitation, Widgets
│   │   │   │   └── landing/          # Hero, Features, FAQ
│   │   │   ├── editor/               # Editor engine
│   │   │   │   ├── engine.ts         # Core canvas/layout engine
│   │   │   │   ├── elements/         # Text, Image, Widget element types
│   │   │   │   ├── widgets/          # Calendar, Countdown, Map, RSVP, etc.
│   │   │   │   ├── effects/          # Particle systems, animations
│   │   │   │   ├── toolbar/          # Toolbox tabs (8 tabs)
│   │   │   │   ├── properties/       # Property panel editors
│   │   │   │   └── types.ts          # Layout JSON type definitions
│   │   │   ├── server/               # Backend logic
│   │   │   │   ├── trpc/             # tRPC routers
│   │   │   │   └── services/         # R2, Payment, Email
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── lib/                  # Utilities, clients
│   │   │   └── stores/               # Zustand stores (editor state)
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── worker/                       # Background jobs (optional)
│       ├── src/
│       │   ├── publish/              # Static site builder
│       │   ├── image/                # Image processing (resize, bg-remove)
│       │   └── analytics/            # View aggregation
│       └── package.json
│
├── packages/
│   ├── shared/                       # Shared schemas, types, constants
│   ├── db/                           # Drizzle schema + migrations
│   ├── ui/                           # Shadcn/UI components
│   └── config/                       # ESLint, TypeScript, Tailwind configs
│
├── workers/
│   ├── site-serve/                   # CF Worker: serve published pages
│   ├── guest-api/                    # CF Worker: wishes, RSVP, gifts
│   └── view-counter/                 # CF Worker: view counting
│
├── docs/
│   ├── reverse-engineering/          # This analysis (13 documents)
│   └── design/                       # Original design documents
│
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Key Design Decisions

### Editor Engine
The editor is the most complex component. It should be built as a standalone module in `src/editor/` with:
- **Layout JSON schema** — defines all possible elements and their properties
- **Element renderers** — React components for each element type
- **Property editors** — Forms for editing element properties
- **Widget system** — Pluggable interactive widgets
- **State management** — Zustand store for editor state with undo/redo

### Publishing System
When a user publishes, the system:
1. Reads the layout JSON from the database
2. Server-side renders it to a standalone HTML page
3. Bundles necessary CSS/JS/fonts/images
4. Uploads the bundle to R2/S3
5. Returns the public URL

### Guest API
Guest interactions (wishes, RSVP, gifts) should run on edge workers for:
- Low latency
- Rate limiting per IP
- No authentication required
- Direct database writes
