import { z } from "zod";

export const orderSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.enum(["plan_upgrade", "addon", "full_service"]),
    planTier: z.enum(["free", "basic", "premium"]).optional(),
    amount: z.number().int().min(0),
    status: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
    paymentMethod: z.string().optional(),
    paymentRef: z.string().optional(),
    createdAt: z.string().datetime(),
});

export const createOrderSchema = z.object({
    type: z.enum(["plan_upgrade", "addon", "full_service"]),
    planTier: z.enum(["free", "basic", "premium"]).optional(),
    amount: z.number().int().min(0),
});

export type Order = z.infer<typeof orderSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
