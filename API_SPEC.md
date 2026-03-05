# API_SPEC.md — LoveStory API Contract Specification

## Overview

LoveStory sử dụng **tRPC v11** cho type-safe API giữa Next.js frontend và backend. Edge functions sử dụng REST. Internal worker communication sử dụng webhooks.

---

## 1. tRPC Router Map

```
trpc/
├── auth          # Authentication & profile
├── project       # Invitation CRUD & publishing
├── template      # Template gallery & browsing
├── video         # AI video generation
├── guest         # Guest management (RSVP, wishes, gifts)
├── billing       # Plans, orders, credits
├── media         # File upload & management
└── admin         # Admin operations (protected)
```

---

## 2. Router: `auth`

### `auth.getSession`
**Type:** Query  
**Auth:** Public  
**Returns:** Current user session or null

```typescript
output: z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    tenantId: z.string().uuid(),
    role: z.enum(['owner', 'editor', 'viewer']),
    plan: z.object({
      name: z.string(),
      displayName: z.string(),
    }),
  }).nullable(),
})
```

### `auth.updateProfile`
**Type:** Mutation  
**Auth:** Authenticated  

```typescript
input: z.object({
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  locale: z.enum(['vi', 'en']).optional(),
})
output: z.object({ success: z.boolean() })
```

### `auth.deleteAccount`
**Type:** Mutation  
**Auth:** Authenticated  
**Description:** Delete user account + all data (GDPR)

---

## 3. Router: `project`

### `project.list`
**Type:** Query  
**Auth:** Authenticated  

```typescript
input: z.object({
  status: z.enum(['draft', 'published', 'archived', 'expired']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
})
output: z.object({
  projects: z.array(ProjectSchema),
  total: z.number(),
  hasMore: z.boolean(),
})
```

### `project.getById`
**Type:** Query  
**Auth:** Authenticated (owner)

```typescript
input: z.object({ id: z.string().uuid() })
output: ProjectDetailSchema  // Includes full config, video, guests count
```

### `project.create`
**Type:** Mutation  
**Auth:** Authenticated  
**Side Effects:** Check plan limits (max projects)

```typescript
input: z.object({
  templateId: z.string().uuid(),
  title: z.string().min(1).max(200),
})
output: z.object({
  project: ProjectSchema,
  redirectUrl: z.string(),  // /dashboard/projects/{id}/edit
})
```

### `project.update`
**Type:** Mutation  
**Auth:** Authenticated (owner)

```typescript
input: z.object({
  id: z.string().uuid(),
  title: z.string().optional(),
  groomName: z.string().optional(),
  brideName: z.string().optional(),
  weddingDate: z.string().datetime().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  venueMapUrl: z.string().url().optional(),
  colorPalette: z.record(z.string()).optional(),
  fontFamily: z.string().optional(),
  musicTrackId: z.string().uuid().optional(),
})
output: z.object({ success: z.boolean() })
```

### `project.publish`
**Type:** Mutation  
**Auth:** Authenticated (owner)  
**Side Effects:** Build static site → deploy to R2 → set publishedAt + expiresAt

```typescript
input: z.object({ id: z.string().uuid() })
output: z.object({
  publicUrl: z.string().url(),  // https://lovestory.app/i/{slug}
  qrCodeUrl: z.string().url(),
})
```

### `project.unpublish`
**Type:** Mutation  
**Auth:** Authenticated (owner)

### `project.delete`
**Type:** Mutation  
**Auth:** Authenticated (owner)  
**Side Effects:** Delete from R2, cascade delete guests/rsvps/wishes/gifts

### `project.getAnalytics`
**Type:** Query  
**Auth:** Authenticated (owner)

```typescript
input: z.object({ id: z.string().uuid() })
output: z.object({
  totalViews: z.number(),
  viewsToday: z.number(),
  viewsThisWeek: z.number(),
  rsvpStats: z.object({
    confirmed: z.number(),
    declined: z.number(),
    pending: z.number(),
  }),
  wishesCount: z.number(),
  giftsTotal: z.number(),
})
```

---

## 4. Router: `template`

### `template.list`
**Type:** Query  
**Auth:** Public  

```typescript
input: z.object({
  category: z.enum(['wedding', 'birthday', 'anniversary', 'event']).optional(),
  tier: z.enum(['free', 'basic', 'premium']).optional(),
  style: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
})
output: z.object({
  templates: z.array(TemplateSchema),
  total: z.number(),
})
```

### `template.getById`
**Type:** Query  
**Auth:** Public

```typescript
input: z.object({ id: z.string().uuid() })
output: TemplateDetailSchema  // Includes full preview data
```

---

## 5. Router: `video`

### `video.generate`
**Type:** Mutation  
**Auth:** Authenticated  
**Side Effects:** Check credits → enqueue BullMQ job → deduct credit

```typescript
input: z.object({
  projectId: z.string().uuid().optional(), // Link to invitation
  templatePreset: z.enum(['cinematic', 'romantic', 'modern', 'vintage', 'traditional']),
  photos: z.array(z.string().uuid()).min(5).max(20),  // media_asset IDs
  musicTrackId: z.string().uuid(),
  coupleInfo: z.object({
    groomName: z.string(),
    brideName: z.string(),
    weddingDate: z.string(),
    howWeMet: z.string().optional(),
  }),
  resolution: z.enum(['720p', '1080p', '4k']).default('1080p'),
})
output: z.object({
  videoId: z.string().uuid(),
  jobId: z.string(),
  estimatedTime: z.number(), // seconds
  creditsRemaining: z.number(),
})
```

### `video.getStatus`
**Type:** Query  
**Auth:** Authenticated  

```typescript
input: z.object({ videoId: z.string().uuid() })
output: z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'queued', 'processing', 'encoding', 'complete', 'failed']),
  progress: z.number().min(0).max(100),
  previewUrl: z.string().url().nullable(),
  outputUrl: z.string().url().nullable(),
  thumbnailUrl: z.string().url().nullable(),
  errorMessage: z.string().nullable(),
  estimatedTimeRemaining: z.number().nullable(),
})
```

### `video.list`
**Type:** Query  
**Auth:** Authenticated

```typescript
input: z.object({
  projectId: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(20).default(10),
})
output: z.object({
  videos: z.array(VideoSchema),
  total: z.number(),
})
```

### `video.delete`
**Type:** Mutation  
**Auth:** Authenticated  
**Side Effects:** Delete from R2

---

## 6. Router: `guest`

### `guest.list`
**Type:** Query  
**Auth:** Authenticated

```typescript
input: z.object({
  projectId: z.string().uuid(),
  groupName: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
})
output: z.object({
  guests: z.array(GuestSchema),
  total: z.number(),
})
```

### `guest.create`
**Type:** Mutation  

```typescript
input: z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  groupName: z.string().optional(),
})
output: z.object({
  guest: GuestSchema,
  personalLink: z.string().url(),
})
```

### `guest.bulkImport`
**Type:** Mutation  
**Description:** Import from CSV

```typescript
input: z.object({
  projectId: z.string().uuid(),
  guests: z.array(z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    groupName: z.string().optional(),
  })).min(1).max(500),
})
output: z.object({
  imported: z.number(),
  skipped: z.number(),
  errors: z.array(z.string()),
})
```

### `guest.exportCsv`
**Type:** Query  
**Auth:** Authenticated (Pro+ plan required)

### RSVP Sub-routes

### `guest.rsvp.list`
```typescript
input: z.object({ projectId: z.string().uuid() })
output: z.object({
  rsvps: z.array(RsvpSchema),
  stats: z.object({ confirmed: z.number(), declined: z.number(), maybe: z.number() }),
})
```

### Wishes Sub-routes

### `guest.wishes.list`
```typescript
input: z.object({
  projectId: z.string().uuid(),
  approved: z.boolean().optional(),
})
output: z.object({ wishes: z.array(WishSchema) })
```

### `guest.wishes.moderate`
```typescript
input: z.object({
  wishId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'delete']),
})
```

### Gifts Sub-routes

### `guest.gifts.list`
```typescript
input: z.object({ projectId: z.string().uuid() })
output: z.object({
  gifts: z.array(GiftSchema),
  totalAmount: z.number(),
})
```

---

## 7. Router: `billing`

### `billing.getCurrentPlan`
**Type:** Query  

```typescript
output: z.object({
  plan: PlanSchema,
  expiresAt: z.string().datetime().nullable(),
  credits: z.number(),
  usage: z.object({
    projectsUsed: z.number(),
    projectsLimit: z.number(),
    videosThisMonth: z.number(),
    videosLimit: z.number(),
  }),
})
```

### `billing.createOrder`
**Type:** Mutation  

```typescript
input: z.object({
  type: z.enum(['subscription', 'credit_pack']),
  planId: z.string().uuid().optional(),       // For subscription
  creditPackId: z.string().optional(),          // For credits
})
output: z.object({
  orderCode: z.string(),
  checkoutUrl: z.string().url(),  // PayOS checkout URL
  amount: z.number(),
})
```

### `billing.getOrderHistory`
**Type:** Query

```typescript
output: z.object({
  orders: z.array(OrderSchema),
})
```

---

## 8. Router: `media`

### `media.getUploadUrl`
**Type:** Mutation  
**Description:** Get presigned R2 upload URL

```typescript
input: z.object({
  fileName: z.string(),
  fileType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'audio/mpeg', 'audio/wav']),
  fileSize: z.number().max(20 * 1024 * 1024), // 20MB max
  projectId: z.string().uuid().optional(),
})
output: z.object({
  uploadUrl: z.string().url(),   // Presigned PUT URL
  assetId: z.string().uuid(),
  storageUrl: z.string(),        // Final R2 path
})
```

### `media.confirmUpload`
**Type:** Mutation  
**Description:** Confirm upload complete, trigger thumbnail generation

```typescript
input: z.object({ assetId: z.string().uuid() })
output: z.object({
  asset: MediaAssetSchema,
  thumbnailUrl: z.string().url().nullable(),
})
```

### `media.delete`
**Type:** Mutation

### `media.listMusicLibrary`
**Type:** Query  
**Auth:** Public

```typescript
input: z.object({
  mood: z.enum(['romantic', 'upbeat', 'classical', 'cinematic']).optional(),
})
output: z.object({
  tracks: z.array(MusicTrackSchema),
})
```

---

## 9. Edge API (Cloudflare Workers) — REST

### `POST /api/rsvp` (rsvp-submit Worker)

```typescript
// Rate limit: 5 requests per IP per minute
Request: {
  projectId: string;
  guestName: string;
  status: 'confirmed' | 'declined' | 'maybe';
  guestsCount: number;
  dietaryNotes?: string;
}
Response: { success: boolean; message: string }
```

### `POST /api/wish` (rsvp-submit Worker)

```typescript
Request: {
  projectId: string;
  guestName: string;
  message: string;
}
Response: { success: boolean }
```

### `POST /api/gift` (rsvp-submit Worker)

```typescript
Request: {
  projectId: string;
  guestName: string;
  amount: number;
  note?: string;
}
Response: { success: boolean }
```

### `GET /i/{slug}` (site-serve Worker)

Serves the published static invitation page from R2.
- Check view quota → increment counter → return HTML
- If quota exceeded → return "upgrade" page

---

## 10. Internal Webhook API (Worker → Backend)

### `POST /api/internal/webhook/video-complete`

```typescript
Headers: { 'x-internal-secret': string }
Body: {
  videoId: string;
  status: 'complete' | 'failed';
  outputUrl?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  renderDurationMs?: number;
  errorMessage?: string;
}
```

### `POST /api/internal/webhook/build-complete`

```typescript
Headers: { 'x-internal-secret': string }
Body: {
  projectId: string;
  status: 'complete' | 'failed';
  publicUrl?: string;
  errorMessage?: string;
}
```

### `POST /api/webhook/payos` (PayOS callback)

```typescript
// Verified with PayOS signature
Body: {
  code: string;
  data: {
    orderCode: number;
    amount: number;
    status: string;
    // ...PayOS fields
  };
  signature: string;
}
```

---

## 11. Shared Zod Schemas

All schemas defined in `packages/shared/src/schemas/`:

```typescript
// packages/shared/src/schemas/project.ts
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'archived', 'expired']),
  groomName: z.string().nullable(),
  brideName: z.string().nullable(),
  weddingDate: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  viewCount: z.number(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
});

// Similar for: VideoSchema, GuestSchema, RsvpSchema, WishSchema,
//              GiftSchema, OrderSchema, PlanSchema, MusicTrackSchema,
//              TemplateSchema, MediaAssetSchema
```

---

## 12. Error Response Format

```typescript
// All tRPC errors follow standard tRPC error handling
// Custom error codes:
{
  code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' |
        'CONFLICT' | 'TOO_MANY_REQUESTS' | 'INTERNAL_SERVER_ERROR',
  message: string,        // User-friendly message (Vietnamese)
  cause?: {
    field?: string,       // Which field caused the error
    limit?: number,       // What limit was exceeded
    remaining?: number,   // How much is remaining
  }
}
```
