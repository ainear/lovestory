# API_DISCOVERY.md — CineLove Observed API Endpoints

## Base URLs
- **API Server:** `https://api.cinelove.me`
- **Image CDN:** `https://img.cinelove.me`
- **Main Web:** `https://cinelove.me` (Next.js SSR)

---

## Authentication

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/login` | Email/password login |
| `POST` | `/auth/register` | Account creation |
| `POST` | `/auth/google` | Google OAuth |
| `POST` | `/auth/facebook` | Facebook OAuth |
| `GET` | `/auth/me` | Get current user profile |
| `POST` | `/auth/refresh` | Refresh JWT token |

---

## User & Plan

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/addons/user/usage` | Get usage stats (views, photos, websites, add-ons) |
| `GET` | `/users/dashboard-stats` | Dashboard overview statistics |
| `PUT` | `/users/profile` | Update user profile (name, phone, bio) |
| `PUT` | `/users/avatar` | Upload/update avatar |
| `PUT` | `/users/password` | Change password |

---

## Templates

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/templates` | List all templates (with filters) |
| `GET` | `/templates/[id]` | Get single template details |
| `POST` | `/templates/[id]/usages` | Increment template usage count on use |
| `GET` | `/templates/categories` | List template categories |

**Query Params for List:**
- `category`: Wedding, Birthday, Graduation, Event, Anniversary, etc.
- `package`: BASIC, PREMIUM
- `page`, `limit`: Pagination

---

## Projects (Invitations)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/projects` | List user's projects |
| `GET` | `/projects/[id]` | Get project detail + layout JSON |
| `POST` | `/projects` | Create new project from template |
| `PUT` | `/projects/[id]` | Update project (auto-save content) |
| `DELETE` | `/projects/[id]` | Delete project |
| `POST` | `/projects/[id]/publish` | Publish invitation |
| `POST` | `/projects/[id]/unpublish` | Unpublish invitation |

---

## File Upload

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/file-upload/image` | Upload image file |
| `GET` | `/file-upload/user/images` | List user's uploaded images |
| `DELETE` | `/file-upload/[id]` | Delete uploaded file |
| `POST` | `/file-upload/music` | Upload custom music track |

**Upload Details:**
- Storage limit: 5GB per user
- Supported formats: JPEG, PNG, WEBP (images), MP3 (music)
- Images served from: `https://img.cinelove.me/uploads/...`

---

## Guest Interactions (Public API — No Auth Required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/wishes` | Submit a blessing/wish on invitation |
| `GET` | `/api/wishes/[projectId]` | Get wishes for an invitation |
| `POST` | `/api/rsvp` | Submit RSVP response |
| `GET` | `/api/rsvp/[projectId]` | Get RSVP responses |
| `POST` | `/api/gifts` | Record a gift |
| `GET` | `/api/gifts/[projectId]` | Get gift records |
| `POST` | `/api/views/increment` | Increment view counter |

---

## Billing & Plans

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/plans` | List available plans |
| `POST` | `/orders` | Create order for plan/add-on |
| `GET` | `/orders/history` | Order history |
| `POST` | `/payments/webhook` | Payment gateway callback |

---

## Next.js Data Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/_next/data/[buildId]/editor-template/[id].json` | SSR data for editor page |
| `GET` | `/_next/data/[buildId]/template/[slug].json` | SSR data for template preview |
| `GET` | `/_next/data/[buildId]/pricing-plans.json` | SSR data for pricing page |

---

## Response Format

```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Success"
}

// Error format
{
  "success": false,
  "error": {
    "code": "PLAN_LIMIT_EXCEEDED",
    "message": "Bạn đã hết lượt xem, vui lòng nâng cấp gói"
  }
}
```
