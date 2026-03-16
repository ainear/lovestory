// Single source of truth for pricing tiers — matches CineLove exactly.

export type PlanId = "free" | "basic" | "premium";

export interface PlanFeatures {
  albumWidget: boolean;
  youtubeEmbed: boolean;
  customFonts: boolean;
  customForms: boolean;
  premiumTemplates: boolean;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number; // VND, 0 for free
  maxCards: number;
  maxImages: number;
  maxViewsPerMonth: number;
  storageDuration: string;
  storageDays: number;
  features: PlanFeatures;
  badge?: string;
}

const FREE_PLAN: PlanConfig = {
  id: "free",
  name: "Free",
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
};

const BASIC_PLAN: PlanConfig = {
  id: "basic",
  name: "Basic",
  price: 199_000,
  maxCards: 3,
  maxImages: 50,
  maxViewsPerMonth: 10_000,
  storageDuration: "2 năm",
  storageDays: 730,
  features: {
    albumWidget: true,
    youtubeEmbed: true,
    customFonts: false,
    customForms: false,
    premiumTemplates: false,
  },
  badge: "Phổ biến",
};

const PREMIUM_PLAN: PlanConfig = {
  id: "premium",
  name: "Premium",
  price: 299_000,
  maxCards: 5,
  maxImages: 100,
  maxViewsPerMonth: 50_000,
  storageDuration: "5 năm",
  storageDays: 1825,
  features: {
    albumWidget: true,
    youtubeEmbed: true,
    customFonts: true,
    customForms: true,
    premiumTemplates: true,
  },
  badge: "VIP",
};

/** All plans indexed by id */
export const PLANS: Record<PlanId, PlanConfig> = {
  free: FREE_PLAN,
  basic: BASIC_PLAN,
  premium: PREMIUM_PLAN,
} as const;

/** Ordered list of plan ids (cheapest first) */
export const PLAN_IDS: PlanId[] = ["free", "basic", "premium"];

/** Server-side price verification — only paid plans */
export const PLAN_PRICES: Record<string, number> = {
  basic: BASIC_PLAN.price,
  premium: PREMIUM_PLAN.price,
};

/** Format VND price for display, e.g. 199000 → "199.000đ", 0 → "Miễn phí" */
export function formatPrice(amount: number): string {
  if (amount === 0) return "Miễn phí";
  return `${amount.toLocaleString("vi-VN")}đ`;
}
