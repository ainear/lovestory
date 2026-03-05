import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const billingRouter = router({
    getMyPlan: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Query user plan from database
        return {
            tier: "free" as const,
            maxProjects: 1,
            maxPhotos: 10,
            maxViews: 300,
        };
    }),

    createOrder: protectedProcedure
        .input(
            z.object({
                planTier: z.enum(["basic", "premium"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: Create PayOS order
            return { orderId: "stub", paymentUrl: "" };
        }),

    getOrders: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Query orders from database
        return [];
    }),
});
