import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const PLAN_LIMITS = {
    free: { maxProjects: 1, maxPhotos: 10, maxViews: 300 },
    basic: { maxProjects: 5, maxPhotos: 50, maxViews: 5000 },
    premium: { maxProjects: 999, maxPhotos: 100, maxViews: 999999 },
} as const;

const PLAN_PRICES = {
    basic: 99000,
    premium: 199000,
} as const;

export const billingRouter = router({
    getMyPlan: protectedProcedure.query(async ({ ctx }) => {
        const { data: sub } = await ctx.supabase
            .from("subscriptions")
            .select("plan, expires_at")
            .eq("user_id", ctx.user.id)
            .single();

        const tier = (sub?.plan || "free") as keyof typeof PLAN_LIMITS;
        const limits = PLAN_LIMITS[tier] || PLAN_LIMITS.free;

        return {
            tier,
            expiresAt: sub?.expires_at || null,
            ...limits,
        };
    }),

    createOrder: protectedProcedure
        .input(
            z.object({
                planTier: z.enum(["basic", "premium"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const price = PLAN_PRICES[input.planTier];
            const orderCode = `LS${Date.now().toString(36).toUpperCase()}`;

            const { data, error } = await ctx.supabase
                .from("orders")
                .insert({
                    user_id: ctx.user.id,
                    order_code: orderCode,
                    plan: input.planTier,
                    amount: price,
                    status: "pending",
                    payment_method: "sepay",
                })
                .select()
                .single();

            if (error) throw new Error(error.message);

            return {
                orderId: data.id,
                orderCode,
                amount: price,
                // Payment URL would come from PayOS/SePay integration
                paymentUrl: `/payment/${orderCode}`,
            };
        }),

    getOrders: protectedProcedure.query(async ({ ctx }) => {
        const { data } = await ctx.supabase
            .from("orders")
            .select("*")
            .eq("user_id", ctx.user.id)
            .order("created_at", { ascending: false })
            .limit(20);

        return data || [];
    }),
});
