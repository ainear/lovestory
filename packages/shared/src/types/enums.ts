// Plan tiers
export const PLAN_TIER = {
    FREE: "free",
    BASIC: "basic",
    PREMIUM: "premium",
} as const;

export type PlanTier = (typeof PLAN_TIER)[keyof typeof PLAN_TIER];

// Project statuses
export const PROJECT_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived",
} as const;

export type ProjectStatus =
    (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

// Template categories
export const TEMPLATE_CATEGORY = {
    WEDDING: "wedding",
    BIRTHDAY: "birthday",
    GRADUATION: "graduation",
    EVENT: "event",
    ANNIVERSARY: "anniversary",
    WISH: "wish",
    OTHER: "other",
} as const;

export type TemplateCategory =
    (typeof TEMPLATE_CATEGORY)[keyof typeof TEMPLATE_CATEGORY];

// Template tiers
export const TEMPLATE_TIER = {
    BASIC: "basic",
    PREMIUM: "premium",
} as const;

export type TemplateTier =
    (typeof TEMPLATE_TIER)[keyof typeof TEMPLATE_TIER];

// Auth methods
export const AUTH_METHOD = {
    EMAIL: "email",
    GOOGLE: "google",
    FACEBOOK: "facebook",
} as const;

export type AuthMethod = (typeof AUTH_METHOD)[keyof typeof AUTH_METHOD];

// RSVP statuses
export const RSVP_STATUS = {
    CONFIRMED: "confirmed",
    DECLINED: "declined",
    MAYBE: "maybe",
} as const;

export type RsvpStatus = (typeof RSVP_STATUS)[keyof typeof RSVP_STATUS];

// Order statuses
export const ORDER_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
} as const;

export type OrderStatus =
    (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Order types
export const ORDER_TYPE = {
    PLAN_UPGRADE: "plan_upgrade",
    ADDON: "addon",
    FULL_SERVICE: "full_service",
} as const;

export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];

// Media types
export const MEDIA_TYPE = {
    IMAGE: "image",
    MUSIC: "music",
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];
