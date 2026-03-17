# Sprint 65: Premium System — Design Doc

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement CineLove-clone premium system with 3 tiers (Free/Basic/Premium), Manual QR payment, feature gating, and admin order management.

**Architecture:** Supabase migration for orders table + projects.plan column. Feature gating via server-side checks. QR payment with env-var bank config. Admin dashboard for order confirmation.

**Tech Stack:** Next.js, Supabase (DB + Auth), VietQR-style static QR

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tiers | 3 (Free/Basic/Premium) | Clone CineLove exactly |
| Payment | Manual QR (static) | Simple, env vars for bank info |
| Watermark | No watermark | Limit views/images/cards instead |
| Bank config | Env vars | Easy to change, no leak in source |
| DB | New orders table + projects.plan | Track payment history |

---

## Pricing Tiers (Clone CineLove 1:1)

| Feature | Free (0đ) | Basic (199,000đ) | Premium (299,000đ) |
|---------|-----------|-------------------|---------------------|
| Cards | 1 | 3 | 5 |
| Storage duration | 6 tháng | 2 năm | 5 năm |
| Image uploads | 10 | 50 | 100 |
| Views/month | 300 | 10,000 | 50,000 |
| Templates | Basic only | Basic | Basic + Premium |
| Album widget | No | Yes | Yes |
| YouTube embed | No | Yes | Yes |
| Custom fonts upload | No | No | Yes |
| Custom forms | No | No | Yes |
| Music library | Yes | Yes | Yes |
| RSVP | Yes | Yes | Yes |
| QR Bank | Yes | Yes | Yes |
| Effects/animations | Yes | Yes | Yes |

---

## Database Schema

### New table: `orders`
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'premium')),
  amount INTEGER NOT NULL, -- in VND
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_ref TEXT, -- bank transfer reference
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES auth.users(id)
);
```

### Alter table: `projects`
```sql
ALTER TABLE projects ADD COLUMN plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium'));
ALTER TABLE projects ADD COLUMN plan_expires_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN max_views INTEGER DEFAULT 300;
ALTER TABLE projects ADD COLUMN max_images INTEGER DEFAULT 10;
```

---

## Payment Flow

1. User clicks "Nâng cấp" in editor or dashboard
2. PricingModal shows 3 tiers with prices
3. User selects plan → shows QR code with bank info
4. Bank info from env vars: `PAYMENT_BANK_NAME`, `PAYMENT_BANK_ACCOUNT`, `PAYMENT_BANK_HOLDER`
5. User transfers money, enters transaction reference
6. System creates order (status: pending)
7. Admin sees pending orders in `/dashboard/admin/orders`
8. Admin confirms → order.status = confirmed, project.plan updated
9. Email notification sent to user

---

## Feature Gating

### Editor-side (client)
- Template picker: show lock icon on Premium templates for Free users
- Image upload: check count against `project.max_images`
- Album/YouTube widget: show upgrade prompt for Free users
- Custom font upload: show upgrade prompt for Free/Basic users

### Viewer-side (server)
- `/api/views` route: check `project.view_count` against `project.max_views`
- When limit reached: show "Thiệp đã hết lượt xem" + upgrade CTA
- Admin override: skip limit for admin users

### Project creation
- Check user's project count against plan limit (1/3/5)
- Show upgrade prompt when limit reached

---

## Components

### PricingModal
- 3-column comparison table
- "Chọn gói" buttons
- QR code display with bank info
- Transaction reference input
- Submit order button

### Admin Orders Dashboard
- `/dashboard/admin/orders` (admin-only route)
- Table: user, plan, amount, date, status
- Confirm/Cancel buttons
- Filter by status

### Upgrade CTA
- Reusable component shown when feature is gated
- "Nâng cấp để mở khóa" with plan comparison

---

**Created:** 2026-03-16
**Status:** Approved
