# DATABASE_SCHEMA.md — LoveStory Database Design

## ORM: Drizzle ORM (PostgreSQL)

All schemas defined in `packages/db/src/schema/` using Drizzle's TypeScript-first approach.

---

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   tenants    │     │    users     │     │    plans     │
│              │◄────│              │     │              │
│  id (PK)     │     │  id (PK)     │     │  id (PK)     │
│  name        │     │  tenant_id   │────▶│  name        │
│  plan_id     │────▶│  email       │     │  price       │
│  created_at  │     │  avatar_url  │     │  limits      │
└──────┬───────┘     │  role        │     └──────────────┘
       │             └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   projects   │     │   videos     │     │  templates   │
│              │     │              │     │              │
│  id (PK)     │     │  id (PK)     │     │  id (PK)     │
│  tenant_id   │     │  project_id  │     │  name        │
│  template_id │────▶│  status      │     │  category    │
│  title       │     │  config      │     │  tier        │
│  slug        │     │  output_url  │     │  preview_url │
│  status      │     │  created_at  │     │  document    │
│  published   │     └──────────────┘     └──────────────┘
│  config      │
└──────┬───────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│    guests    ││    rsvps     ││   wishes     ││    gifts     │
│              ││              ││              ││              │
│  id (PK)     ││  id (PK)     ││  id (PK)     ││  id (PK)     │
│  project_id  ││  project_id  ││  project_id  ││  project_id  │
│  name        ││  guest_id    ││  guest_name  ││  guest_name  │
│  phone       ││  status      ││  message     ││  amount      │
│  sent        ││  guests_count││  approved    ││  bank_ref    │
│  viewed      ││  created_at  ││  created_at  ││  created_at  │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

---

## Table Definitions

### `tenants` — Multi-tenant root

```sql
CREATE TABLE tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  plan_id       UUID REFERENCES plans(id),
  plan_expires  TIMESTAMPTZ,
  credits       INTEGER NOT NULL DEFAULT 0,
  settings      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Drizzle:**
```typescript
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  planId: uuid('plan_id').references(() => plans.id),
  planExpires: timestamp('plan_expires', { withTimezone: true }),
  credits: integer('credits').notNull().default(0),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### `users` — User accounts

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Matches Supabase auth.users.id
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: text('role', { enum: ['owner', 'editor', 'viewer'] }).notNull().default('owner'),
  locale: text('locale').notNull().default('vi'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### `plans` — Subscription plans

```typescript
export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // 'free', 'pro', 'premium'
  displayName: text('display_name').notNull(),
  priceVnd: integer('price_vnd').notNull().default(0),
  maxProjects: integer('max_projects').notNull().default(1),
  maxViewsPerProject: integer('max_views_per_project').notNull().default(500),
  maxImagesPerProject: integer('max_images_per_project').notNull().default(10),
  monthlyVideoCredits: integer('monthly_video_credits').notNull().default(1),
  maxVideoResolution: text('max_video_resolution', { enum: ['720p', '1080p', '4k'] }).notNull().default('720p'),
  storageDurationDays: integer('storage_duration_days').notNull().default(180),
  hasWatermark: boolean('has_watermark').notNull().default(true),
  hasPremiumTemplates: boolean('has_premium_templates').notNull().default(false),
  hasAiLoveStory: boolean('has_ai_love_story').notNull().default(false),
  hasGuestExport: boolean('has_guest_export').notNull().default(false),
  supportLevel: text('support_level', { enum: ['community', 'email', 'priority'] }).notNull().default('community'),
  isActive: boolean('is_active').notNull().default(true),
});
```

---

### `projects` — Wedding invitations

```typescript
export const projectStatusEnum = pgEnum('project_status', [
  'draft', 'published', 'archived', 'expired'
]);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  templateId: uuid('template_id').references(() => templates.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  status: projectStatusEnum('status').notNull().default('draft'),

  // Core wedding data
  groomName: text('groom_name'),
  brideName: text('bride_name'),
  weddingDate: timestamp('wedding_date', { withTimezone: true }),
  venueName: text('venue_name'),
  venueAddress: text('venue_address'),
  venueMapUrl: text('venue_map_url'),

  // Design config
  colorPalette: jsonb('color_palette').default('{}'),
  fontFamily: text('font_family').default('Inter'),
  musicTrackId: uuid('music_track_id'),

  // Storage references (R2)
  documentUrl: text('document_url'),  // projects/{id}/document.json
  themeUrl: text('theme_url'),        // projects/{id}/theme.json

  // Analytics
  viewCount: integer('view_count').notNull().default(0),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('idx_projects_tenant').on(table.tenantId),
  slugIdx: uniqueIndex('idx_projects_slug').on(table.slug),
  statusIdx: index('idx_projects_status').on(table.status),
}));
```

---

### `templates` — Invitation & video templates

```typescript
export const templateCategoryEnum = pgEnum('template_category', [
  'wedding', 'birthday', 'anniversary', 'event', 'other'
]);

export const templateTierEnum = pgEnum('template_tier', [
  'free', 'basic', 'premium'
]);

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  category: templateCategoryEnum('category').notNull().default('wedding'),
  tier: templateTierEnum('tier').notNull().default('free'),
  style: text('style'), // 'cinematic', 'minimal', 'traditional', 'modern'
  previewUrl: text('preview_url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  documentUrl: text('document_url').notNull(), // R2 path to template document.json
  themeUrl: text('theme_url'),                 // R2 path to template theme.json
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### `videos` — AI-generated videos

```typescript
export const videoStatusEnum = pgEnum('video_status', [
  'pending', 'queued', 'processing', 'encoding', 'complete', 'failed'
]);

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  projectId: uuid('project_id').references(() => projects.id),

  // Video config
  templatePreset: text('template_preset').notNull(), // 'cinematic', 'romantic', etc.
  config: jsonb('config').notNull().default('{}'),
  // config: { photos: [...urls], music: url, text_overlays: [...], transitions: 'crossfade' }

  // Processing
  status: videoStatusEnum('status').notNull().default('pending'),
  progress: integer('progress').notNull().default(0), // 0-100
  jobId: text('job_id'), // BullMQ job ID
  errorMessage: text('error_message'),
  renderDurationMs: integer('render_duration_ms'),

  // Output
  previewUrl: text('preview_url'),   // 720p preview
  outputUrl: text('output_url'),     // Full quality output
  thumbnailUrl: text('thumbnail_url'),
  durationSeconds: integer('duration_seconds'),
  resolution: text('resolution', { enum: ['720p', '1080p', '4k'] }).notNull().default('1080p'),
  hasWatermark: boolean('has_watermark').notNull().default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ({
  tenantIdx: index('idx_videos_tenant').on(table.tenantId),
  projectIdx: index('idx_videos_project').on(table.projectId),
  statusIdx: index('idx_videos_status').on(table.status),
}));
```

---

### `guests` — Guest list management

```typescript
export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  groupName: text('group_name'), // "Nhà trai", "Nhà gái", "Bạn bè"
  personalLink: text('personal_link'), // unique slug for personalization
  invitationSent: boolean('invitation_sent').notNull().default(false),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  viewedAt: timestamp('viewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectIdx: index('idx_guests_project').on(table.projectId),
}));
```

---

### `rsvps` — RSVP responses

```typescript
export const rsvpStatusEnum = pgEnum('rsvp_status', [
  'confirmed', 'declined', 'maybe'
]);

export const rsvps = pgTable('rsvps', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  guestId: uuid('guest_id').references(() => guests.id),
  guestName: text('guest_name').notNull(),
  status: rsvpStatusEnum('status').notNull(),
  guestsCount: integer('guests_count').notNull().default(1),
  dietaryNotes: text('dietary_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectIdx: index('idx_rsvps_project').on(table.projectId),
}));
```

---

### `wishes` — Guest blessings/wishes

```typescript
export const wishes = pgTable('wishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  guestName: text('guest_name').notNull(),
  message: text('message').notNull(),
  isApproved: boolean('is_approved').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectIdx: index('idx_wishes_project').on(table.projectId),
}));
```

---

### `gifts` — Gift tracking

```typescript
export const gifts = pgTable('gifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  guestName: text('guest_name').notNull(),
  amount: integer('amount'), // in VND
  bankRef: text('bank_ref'),
  note: text('note'),
  isConfirmed: boolean('is_confirmed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectIdx: index('idx_gifts_project').on(table.projectId),
}));
```

---

### `orders` — Payment orders

```typescript
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'paid', 'cancelled', 'refunded'
]);

export const orderTypeEnum = pgEnum('order_type', [
  'subscription', 'credit_pack', 'addon'
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  orderCode: text('order_code').notNull().unique(), // PayOS order code
  type: orderTypeEnum('type').notNull(),
  planId: uuid('plan_id').references(() => plans.id),
  creditAmount: integer('credit_amount'),
  amountVnd: integer('amount_vnd').notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  payosData: jsonb('payos_data').default('{}'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
}, (table) => ({
  tenantIdx: index('idx_orders_tenant').on(table.tenantId),
  orderCodeIdx: uniqueIndex('idx_orders_code').on(table.orderCode),
}));
```

---

### `music_tracks` — Background music library

```typescript
export const musicTracks = pgTable('music_tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'), // NULL = platform library, set = user upload
  title: text('title').notNull(),
  artist: text('artist'),
  durationSeconds: integer('duration_seconds').notNull(),
  mood: text('mood'), // 'romantic', 'upbeat', 'classical', 'cinematic'
  bpm: integer('bpm'),
  storageUrl: text('storage_url').notNull(), // R2 path
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### `media_assets` — User uploaded files

```typescript
export const assetTypeEnum = pgEnum('asset_type', [
  'image', 'music', 'video', 'font', 'other'
]);

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  projectId: uuid('project_id').references(() => projects.id),
  type: assetTypeEnum('type').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(), // bytes
  mimeType: text('mime_type').notNull(),
  storageUrl: text('storage_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  metadata: jsonb('metadata').default('{}'), // width, height, face_data, etc.
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('idx_assets_tenant').on(table.tenantId),
  projectIdx: index('idx_assets_project').on(table.projectId),
}));
```

---

## Row Level Security (RLS) Policies

```sql
-- All tables with tenant_id use RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own tenant's data
CREATE POLICY tenant_isolation ON projects
  FOR ALL
  USING (tenant_id = (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Repeat for: videos, guests, rsvps, wishes, gifts, orders, media_assets
```

---

## Indexes Summary

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| projects | tenant_id | B-tree | Tenant isolation queries |
| projects | slug | Unique | Public URL lookup |
| projects | status | B-tree | Filter by status |
| videos | tenant_id | B-tree | Tenant listing |
| videos | project_id | B-tree | Project videos |
| videos | status | B-tree | Queue processing |
| guests | project_id | B-tree | Guest list queries |
| rsvps | project_id | B-tree | RSVP listing |
| wishes | project_id | B-tree | Wishes listing |
| gifts | project_id | B-tree | Gift listing |
| orders | tenant_id | B-tree | Order history |
| orders | order_code | Unique | PayOS lookup |
| media_assets | tenant_id | B-tree | Asset listing |

---

## Migration Strategy

```bash
# Generate migration from schema changes
pnpm --filter db drizzle-kit generate

# Push schema directly (development only)
pnpm --filter db drizzle-kit push

# Run migrations (production)
pnpm --filter db drizzle-kit migrate

# Seed initial data (plans, sample templates)
pnpm --filter db seed
```

### Seed Data

```typescript
// Plans seed
const seedPlans = [
  { name: 'free', displayName: 'Free', priceVnd: 0, maxProjects: 1, ... },
  { name: 'pro', displayName: 'Pro', priceVnd: 149000, maxProjects: 5, ... },
  { name: 'premium', displayName: 'Premium', priceVnd: 299000, maxProjects: -1, ... },
];

// Sample templates seed
const seedTemplates = [
  { name: 'Classic Romance', category: 'wedding', tier: 'free', ... },
  { name: 'Cinematic Dream', category: 'wedding', tier: 'premium', ... },
  // ...50+ templates
];
```
