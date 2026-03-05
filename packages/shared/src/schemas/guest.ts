import { z } from "zod";

// ── Wish (Lời chúc) ──
export const wishSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    guestName: z.string().min(1).max(100),
    message: z.string().min(1).max(500),
    emoji: z.string().max(10).optional(),
    isApproved: z.boolean().default(true),
    createdAt: z.string().datetime(),
});

export const createWishSchema = z.object({
    projectId: z.string().uuid(),
    guestName: z.string().min(1).max(100),
    message: z.string().min(1).max(500),
    emoji: z.string().max(10).optional(),
});

export type Wish = z.infer<typeof wishSchema>;
export type CreateWish = z.infer<typeof createWishSchema>;

// ── RSVP ──
export const rsvpSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    guestName: z.string().min(1).max(100),
    status: z.enum(["confirmed", "declined", "maybe"]),
    guestCount: z.number().int().min(1).max(20).default(1),
    notes: z.string().max(300).optional(),
    createdAt: z.string().datetime(),
});

export const createRsvpSchema = z.object({
    projectId: z.string().uuid(),
    guestName: z.string().min(1).max(100),
    status: z.enum(["confirmed", "declined", "maybe"]),
    guestCount: z.number().int().min(1).max(20).default(1),
    notes: z.string().max(300).optional(),
});

export type Rsvp = z.infer<typeof rsvpSchema>;
export type CreateRsvp = z.infer<typeof createRsvpSchema>;

// ── Gift (Quà tặng) ──
export const giftSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    guestName: z.string().min(1).max(100).optional(),
    amount: z.number().int().min(0),
    note: z.string().max(300).optional(),
    method: z.string().default("bank_transfer"),
    confirmed: z.boolean().default(false),
    createdAt: z.string().datetime(),
});

export const createGiftSchema = z.object({
    projectId: z.string().uuid(),
    guestName: z.string().min(1).max(100).optional(),
    amount: z.number().int().min(0),
    note: z.string().max(300).optional(),
    method: z.string().default("bank_transfer"),
});

export type Gift = z.infer<typeof giftSchema>;
export type CreateGift = z.infer<typeof createGiftSchema>;
