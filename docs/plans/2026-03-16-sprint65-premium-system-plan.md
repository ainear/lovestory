# Sprint 65: Premium System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement CineLove-clone premium system: unify 3 tiers (Free/Basic/Premium), feature gating, admin order management. Leverage existing SePay + orders/subscriptions infrastructure.

**Architecture:** Single plan-config source of truth → subscription React context → feature gating hooks → UI enforcement. Existing SePay payment flow stays, pricing page updated to 3 tiers matching CineLove exactly.

**Tech Stack:** Next.js App Router, Supabase (DB + Auth + RLS), SePay (existing)

---

## Existing Infrastructure (DO NOT recreate)

- `orders` table: id, user_id, order_code, plan, amount, status, payment_method, sepay_transaction_id, paid_at, created_at
- `subscriptions` table: id, user_id (UNIQUE), plan (free/basic/premium), order_id, started_at, expires_at
- `/api/orders/route.ts`: Creates orders, generates SePay checkout URL, server-side price verification
- `/api/webhook/sepay/route.ts`: Auto-confirms payment, upserts subscription
- `/app/checkout/page.tsx`: Working checkout with SePay redirect
- `/api/admin/subscription/route.ts`: Admin can change user plan

---

## Task 1: Create unified plan config (single source of truth)

**Files:**
- Create: `apps/web/src/config/plans.ts`

**Why:** Currently plan info scattered across pricing page (4 tiers), checkout (2 tiers), orders API (2 tiers), design doc (3 tiers). Need ONE canonical definition.

**Step 1: Create plan config file**

```typescript
// apps/web/src/config/plans.ts

export type PlanId = "free" | "basic" | "premium";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number; // VND, 0 for free
  maxCards: number;
  maxImages: number;
  maxViewsPerMonth: number;
  storageDuration: string; // display string
  storageDays: number; // for expiry calc
  features: {
    albumWidget: boolean;
    youtubeEmbed: boolean;
    customFonts: boolean;
    customForms: boolean;
    premiumTemplates: boolean;
  };
  badge?: string; // e.g. "🔥 Phổ biến"
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Miễn phí",
    price: 0,
    maxCards: 1,
    maxImages: 10,
    maxViewsPerMonth: 300,
    storageDuration: "6 tháng",
    storageDays: 180,
    features: {
      albumWidget: false,
      youtubeEmbed: false,
      customFonts: false,
      customForms: false,
      premiumTemplates: false,
    },
  },
  basic: {
    id: "basic",
    name: "Basic",
    price: 199000,
    maxCards: 3,
    maxImages: 50,
    maxViewsPerMonth: 10000,
    storageDuration: "2 năm",
    storageDays: 730,
    badge: "🔥 Phổ biến",
    features: {
      albumWidget: true,
      youtubeEmbed: true,
      customFonts: false,
      customForms: false,
      premiumTemplates: false,
    },
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 299000,
    maxCards: 5,
    maxImages: 100,
    maxViewsPerMonth: 50000,
    storageDuration: "5 năm",
    storageDays: 1825,
    badge: "💎 VIP",
    features: {
      albumWidget: true,
      youtubeEmbed: true,
      customFonts: true,
      customForms: true,
      premiumTemplates: true,
    },
  },
};

export const PLAN_IDS: PlanId[] = ["free", "basic", "premium"];

/** Server-side authoritative prices (used in /api/orders) */
export const PLAN_PRICES: Record<string, number> = {
  basic: 199000,
  premium: 299000,
};

/** Format VND price */
export function formatPrice(amount: number): string {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}
```

**Step 2: Verify file created correctly**

Run: `cat apps/web/src/config/plans.ts | head -5`

**Step 3: Commit**

```bash
git add apps/web/src/config/plans.ts
git commit -m "feat(sprint65): add unified plan config — single source of truth for 3 tiers"
```

---

## Task 2: Create subscription context provider + hook

**Files:**
- Create: `apps/web/src/contexts/SubscriptionContext.tsx`
- Modify: `apps/web/src/app/editor/[id]/layout.tsx` or appropriate layout — wrap with provider

**Why:** Editor components need to know user's current plan to gate features. A React context avoids prop drilling and repeated DB queries.

**Step 1: Create SubscriptionContext**

```typescript
// apps/web/src/contexts/SubscriptionContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { PlanId, PLANS, PlanConfig } from "@/config/plans";

interface SubscriptionState {
  plan: PlanId;
  config: PlanConfig;
  loading: boolean;
  /** Check if a specific feature is available */
  hasFeature: (feature: keyof PlanConfig["features"]) => boolean;
  /** Check if user can upload more images */
  canUploadImages: (currentCount: number) => boolean;
  /** Check if user can create more cards/projects */
  canCreateProject: (currentCount: number) => boolean;
}

const SubscriptionContext = createContext<SubscriptionState>({
  plan: "free",
  config: PLANS.free,
  loading: true,
  hasFeature: () => false,
  canUploadImages: () => false,
  canCreateProject: () => false,
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();

      if (data?.plan && (data.plan === "basic" || data.plan === "premium")) {
        setPlan(data.plan);
      }
      setLoading(false);
    }

    fetchSubscription();
  }, []);

  const config = PLANS[plan];

  const value: SubscriptionState = {
    plan,
    config,
    loading,
    hasFeature: (feature) => config.features[feature],
    canUploadImages: (currentCount) => currentCount < config.maxImages,
    canCreateProject: (currentCount) => currentCount < config.maxCards,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
```

**Step 2: Find the editor layout and wrap with provider**

Look for `apps/web/src/app/editor/[id]/layout.tsx` or the closest layout. If none exists, wrap in the editor page component.

**Step 3: Commit**

```bash
git add apps/web/src/contexts/SubscriptionContext.tsx
git commit -m "feat(sprint65): add SubscriptionContext provider + useSubscription hook"
```

---

## Task 3: Create UpgradeCTA reusable component

**Files:**
- Create: `apps/web/src/components/UpgradeCTA.tsx`

**Why:** Multiple places need to show "upgrade to unlock" prompt. DRY.

**Step 1: Create component**

```typescript
// apps/web/src/components/UpgradeCTA.tsx
"use client";

import Link from "next/link";
import { PlanId } from "@/config/plans";

interface UpgradeCTAProps {
  feature: string; // e.g. "Album ảnh", "YouTube embed"
  requiredPlan: PlanId;
  className?: string;
  compact?: boolean; // inline vs full card
}

export function UpgradeCTA({ feature, requiredPlan, className = "", compact = false }: UpgradeCTAProps) {
  const planLabel = requiredPlan === "premium" ? "Premium" : "Basic";

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm text-amber-600 ${className}`}>
        <span>🔒</span>
        <span>Nâng cấp lên {planLabel} để mở khóa {feature}</span>
        <Link href="/pricing" className="underline font-medium hover:text-amber-700">
          Xem gói
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50 p-4 text-center ${className}`}>
      <div className="text-2xl mb-2">🔒</div>
      <h3 className="font-semibold text-amber-900 mb-1">
        {feature}
      </h3>
      <p className="text-sm text-amber-700 mb-3">
        Tính năng này yêu cầu gói {planLabel} trở lên
      </p>
      <Link
        href="/pricing"
        className="inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
      >
        Nâng cấp ngay
      </Link>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/UpgradeCTA.tsx
git commit -m "feat(sprint65): add reusable UpgradeCTA component"
```

---

## Task 4: Update pricing page — 3 tiers matching CineLove

**Files:**
- Modify: `apps/web/src/app/pricing/page.tsx`

**Why:** Currently shows 4 inconsistent tiers (Free/Basic/Pro/Premium with wrong prices). Must match CineLove exactly with 3 tiers using PLANS config.

**Step 1: Rewrite pricing page using PLANS config**

Replace the hardcoded plans array with data from `@/config/plans`. Show 3-column comparison table with:
- Plan name + price + badge
- Feature comparison rows (all features from design doc)
- "Chọn gói" CTA buttons linking to `/checkout?plan=basic` or `/checkout?plan=premium`
- Free tier shows "Đang dùng" or "Bắt đầu miễn phí"

Key comparison rows:
| Feature | Free | Basic | Premium |
|---------|------|-------|---------|
| Số thiệp | 1 | 3 | 5 |
| Thời gian lưu | 6 tháng | 2 năm | 5 năm |
| Ảnh tải lên | 10 | 50 | 100 |
| Lượt xem/tháng | 300 | 10,000 | 50,000 |
| Album ảnh | ❌ | ✅ | ✅ |
| YouTube embed | ❌ | ✅ | ✅ |
| Font chữ tùy chỉnh | ❌ | ❌ | ✅ |
| Form tùy chỉnh | ❌ | ❌ | ✅ |
| Mẫu Premium | ❌ | ❌ | ✅ |
| Nhạc nền | ✅ | ✅ | ✅ |
| RSVP | ✅ | ✅ | ✅ |
| QR Bank | ✅ | ✅ | ✅ |
| Hiệu ứng | ✅ | ✅ | ✅ |

**Step 2: Verify page renders**

Run: `cd apps/web && npx next build --no-lint 2>&1 | tail -5` (or dev server check)

**Step 3: Commit**

```bash
git add apps/web/src/app/pricing/page.tsx
git commit -m "feat(sprint65): rewrite pricing page — 3 tiers matching CineLove exactly"
```

---

## Task 5: Update orders API to use plan config

**Files:**
- Modify: `apps/web/src/app/api/orders/route.ts`

**Why:** Currently has hardcoded `{ basic: 199000, premium: 299000 }`. Use `PLAN_PRICES` from config.

**Step 1: Replace hardcoded prices with import**

```typescript
import { PLAN_PRICES } from "@/config/plans";
// Remove: const PRICES = { basic: 199000, premium: 299000 };
// Replace references to PRICES with PLAN_PRICES
```

**Step 2: Commit**

```bash
git add apps/web/src/app/api/orders/route.ts
git commit -m "refactor(sprint65): orders API uses unified PLAN_PRICES config"
```

---

## Task 6: Gate image uploads by plan

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/sidebar/ImageTab.tsx`

**Why:** Currently hardcoded to 10 images. Must be dynamic: Free=10, Basic=50, Premium=100.

**Step 1: Replace hardcoded limit with subscription context**

```typescript
import { useSubscription } from "@/contexts/SubscriptionContext";

// Inside component:
const { config, canUploadImages } = useSubscription();

// Replace: const MAX_IMAGES = 10;
// With: const MAX_IMAGES = config.maxImages;

// Update counter display: "X / {MAX_IMAGES}"
// Update upload check: if (!canUploadImages(images.length)) { show upgrade prompt }
```

**Step 2: Show UpgradeCTA when limit reached (instead of just disabling)**

When user hits their limit, show inline UpgradeCTA with compact mode.

**Step 3: Commit**

```bash
git add apps/web/src/app/editor/[id]/components/sidebar/ImageTab.tsx
git commit -m "feat(sprint65): dynamic image upload limits per plan tier"
```

---

## Task 7: Mark templates with tier + gate in template picker

**Files:**
- Modify: `apps/web/src/server/data/template-presets.ts` — add `tier` field
- Modify: Template picker component (find the component that lists templates)

**Why:** Premium templates should be locked for Free users. CineLove shows lock icon on premium templates.

**Step 1: Add tier field to template type and data**

In the template presets file, add `tier?: "basic" | "premium"` to the template type. Default is accessible to all (free). Mark ~20% of templates as "premium".

**Step 2: In template picker, show lock icon on gated templates**

```typescript
import { useSubscription } from "@/contexts/SubscriptionContext";

// For each template card:
const isLocked = template.tier === "premium" && !hasFeature("premiumTemplates");
// Show 🔒 overlay if locked
// On click: show UpgradeCTA instead of selecting template
```

**Step 3: Commit**

```bash
git add apps/web/src/server/data/template-presets.ts
git commit -m "feat(sprint65): mark templates with tier + gate premium templates"
```

---

## Task 8: Gate editor widgets (Album, YouTube, Custom Forms)

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/sidebar/` — find the panels that add these widgets
- Modify: Widget add handlers in the editor

**Why:** Free users cannot add Album widget or YouTube embed. Only Premium gets custom forms.

**Step 1: Find widget add locations**

Look for where CraftPhotoAlbum, CraftYouTube, CraftFormBuilder are added to canvas. Gate each with:

```typescript
const { hasFeature } = useSubscription();

// Before adding album widget:
if (!hasFeature("albumWidget")) {
  // Show UpgradeCTA instead
  return;
}
```

**Step 2: Show lock overlay on widget buttons in sidebar**

In the Plugins/Widgets tab of the sidebar, show 🔒 icon on gated widgets with tooltip "Nâng cấp để mở khóa".

**Step 3: Commit**

```bash
git commit -m "feat(sprint65): gate Album/YouTube/CustomForms widgets by plan"
```

---

## Task 9: Add view counting + limit enforcement

**Files:**
- Create: `apps/web/src/app/api/views/route.ts` — API to increment + check view count
- Modify: Viewer page (the public invitation viewer) — call view API on load
- Create: `apps/web/src/app/limit-reached/page.tsx` — "Thiệp đã hết lượt xem" page

**Why:** CineLove limits views per month: Free=300, Basic=10k, Premium=50k.

**Step 1: Create view counting API**

```typescript
// POST /api/views
// Body: { projectId: string }
// Logic:
// 1. Get project's subscription plan
// 2. Count views this month for project
// 3. If under limit: increment, return { allowed: true }
// 4. If over limit: return { allowed: false, limit: X, current: Y }
```

This requires a `project_views` table or a simple counter. Options:
- Add `view_count` and `view_count_reset_at` columns to projects table
- OR create a lightweight `project_views` table

Recommended: Add columns to projects table (simpler):

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count_reset_at TIMESTAMPTZ DEFAULT now();
```

**Step 2: Create Supabase migration**

Create migration file: `supabase/migrations/20260316_sprint65_view_counts.sql`

```sql
-- Add view counting columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count_reset_at TIMESTAMPTZ DEFAULT now();
```

**Step 3: Create limit-reached page**

Simple page showing "Thiệp này đã hết lượt xem trong tháng" with upgrade CTA.

**Step 4: In viewer page, check view limit before rendering**

On server side, before rendering the invitation:
1. Get project + owner's subscription
2. Check view_count vs plan limit
3. If exceeded: redirect to limit-reached page
4. If ok: increment view_count, render normally

**Step 5: Commit**

```bash
git add supabase/migrations/20260316_sprint65_view_counts.sql
git add apps/web/src/app/api/views/route.ts
git add apps/web/src/app/limit-reached/page.tsx
git commit -m "feat(sprint65): view counting + monthly limit enforcement per plan"
```

---

## Task 10: Admin orders dashboard

**Files:**
- Create: `apps/web/src/app/dashboard/admin/orders/page.tsx`

**Why:** Admin needs to see all orders, filter by status, manually confirm/cancel orders (for bank transfer cases).

**Step 1: Create admin orders page**

```typescript
// Server component that fetches orders with user info
// - Table columns: Order code, User email, Plan, Amount, Status, Date, Actions
// - Filter tabs: All / Pending / Paid / Cancelled
// - Action buttons: Confirm (sets status=paid, upserts subscription) / Cancel
// - Uses existing /api/admin/subscription endpoint for plan changes
```

**Step 2: Add confirm/cancel API**

Create: `apps/web/src/app/api/admin/orders/route.ts`

```typescript
// PATCH /api/admin/orders
// Body: { orderId: string, action: "confirm" | "cancel" }
// Auth: admin email check
// confirm: update order status=paid, upsert subscription
// cancel: update order status=cancelled
```

**Step 3: Commit**

```bash
git add apps/web/src/app/dashboard/admin/orders/page.tsx
git add apps/web/src/app/api/admin/orders/route.ts
git commit -m "feat(sprint65): admin orders dashboard with confirm/cancel actions"
```

---

## Task 11: Project creation limit enforcement

**Files:**
- Modify: `apps/web/src/app/editor/new/page.tsx` (or project creation flow)

**Why:** Free=1 card, Basic=3, Premium=5. Must check before allowing new project.

**Step 1: In project creation flow, count user's existing projects**

```typescript
// Before creating new project:
const { data: projects } = await supabase
  .from("projects")
  .select("id")
  .eq("user_id", user.id);

const { config } = useSubscription(); // or fetch server-side
if (projects.length >= config.maxCards) {
  // Show upgrade prompt
  return;
}
```

**Step 2: Commit**

```bash
git commit -m "feat(sprint65): enforce project creation limits per plan"
```

---

## Task 12: Wire SubscriptionProvider into app

**Files:**
- Modify: `apps/web/src/app/editor/[id]/layout.tsx` or editor page component

**Why:** All editor components need subscription context. Provider must wrap the editor tree.

**Step 1: Find editor layout/page and wrap with SubscriptionProvider**

```typescript
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export default function EditorLayout({ children }) {
  return (
    <SubscriptionProvider>
      {children}
    </SubscriptionProvider>
  );
}
```

**Step 2: Verify by checking that useSubscription works in child components**

**Step 3: Commit**

```bash
git commit -m "feat(sprint65): wire SubscriptionProvider into editor layout"
```

---

## Execution Order

Tasks can be grouped:

**Foundation (sequential):**
1. Task 1: Plan config
2. Task 2: Subscription context
3. Task 3: UpgradeCTA component
4. Task 12: Wire provider

**Feature gating (parallel after foundation):**
5. Task 6: Image upload limits
6. Task 7: Template gating
7. Task 8: Widget gating
8. Task 11: Project creation limits

**Pages & APIs (parallel after foundation):**
9. Task 4: Pricing page
10. Task 5: Orders API refactor
11. Task 9: View counting
12. Task 10: Admin dashboard

---

**Created:** 2026-03-16
**Status:** Ready for execution
