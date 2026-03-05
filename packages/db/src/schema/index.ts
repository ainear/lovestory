import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    integer,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

// ── Enums ──
export const planTierEnum = pgEnum("plan_tier", [
    "free",
    "basic",
    "premium",
]);

export const projectStatusEnum = pgEnum("project_status", [
    "draft",
    "published",
    "archived",
]);

export const templateCategoryEnum = pgEnum("template_category", [
    "wedding",
    "birthday",
    "graduation",
    "event",
    "anniversary",
    "wish",
    "other",
]);

export const templateTierEnum = pgEnum("template_tier", [
    "basic",
    "premium",
]);

export const authMethodEnum = pgEnum("auth_method", [
    "email",
    "google",
    "facebook",
]);

export const rsvpStatusEnum = pgEnum("rsvp_status", [
    "confirmed",
    "declined",
    "maybe",
]);

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "paid",
    "failed",
    "refunded",
]);

export const orderTypeEnum = pgEnum("order_type", [
    "plan_upgrade",
    "addon",
    "full_service",
]);

export const mediaTypeEnum = pgEnum("media_type", ["image", "music"]);

// ── Users ──
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 100 }),
    phone: varchar("phone", { length: 20 }),
    bio: text("bio"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    birthDate: varchar("birth_date", { length: 20 }),
    planTier: planTierEnum("plan_tier").notNull().default("free"),
    authMethod: authMethodEnum("auth_method").notNull().default("email"),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Templates ──
export const templates = pgTable("templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    category: templateCategoryEnum("category").notNull().default("wedding"),
    tier: templateTierEnum("tier").notNull().default("basic"),
    layoutJson: text("layout_json").notNull().default("{}"),
    usageCount: integer("usage_count").notNull().default(0),
    likesCount: integer("likes_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Projects (User Invitations) ──
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    templateId: uuid("template_id").references(() => templates.id),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    status: projectStatusEnum("status").notNull().default("draft"),
    layoutJson: text("layout_json").notNull().default("{}"),
    category: varchar("category", { length: 50 }),
    isPublic: boolean("is_public").notNull().default(false),
    publishedAt: timestamp("published_at"),
    publishedUrl: varchar("published_url", { length: 500 }),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Media Assets ──
export const mediaAssets = pgTable("media_assets", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
        onDelete: "set null",
    }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileType: mediaTypeEnum("file_type").notNull(),
    fileSize: integer("file_size").notNull(),
    storageUrl: varchar("storage_url", { length: 500 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Wishes (Lời chúc) ──
export const wishes = pgTable("wishes", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    guestName: varchar("guest_name", { length: 100 }).notNull(),
    message: text("message").notNull(),
    emoji: varchar("emoji", { length: 10 }),
    isApproved: boolean("is_approved").notNull().default(true),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── RSVPs ──
export const rsvps = pgTable("rsvps", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    guestName: varchar("guest_name", { length: 100 }).notNull(),
    status: rsvpStatusEnum("status").notNull(),
    guestCount: integer("guest_count").notNull().default(1),
    notes: text("notes"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Gifts (Quà tặng) ──
export const gifts = pgTable("gifts", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    guestName: varchar("guest_name", { length: 100 }),
    amount: integer("amount").notNull().default(0),
    note: text("note"),
    method: varchar("method", { length: 50 }).default("bank_transfer"),
    confirmed: boolean("confirmed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Orders (Billing) ──
export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    type: orderTypeEnum("type").notNull(),
    planTier: planTierEnum("plan_tier"),
    amount: integer("amount").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    paymentRef: varchar("payment_ref", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Page Views (Analytics) ──
export const pageViews = pgTable("page_views", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 500 }),
    referrer: varchar("referrer", { length: 500 }),
    country: varchar("country", { length: 10 }),
    viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});
