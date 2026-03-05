import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
    getSession: publicProcedure.query(async ({ ctx }) => {
        return {
            user: ctx.user
                ? {
                    id: ctx.user.id,
                    email: ctx.user.email,
                    name: ctx.user.user_metadata?.full_name || null,
                    avatarUrl: ctx.user.user_metadata?.avatar_url || null,
                }
                : null,
        };
    }),

    updateProfile: protectedProcedure
        .input(
            z.object({
                fullName: z.string().min(1).max(100).optional(),
                phone: z.string().max(20).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase.auth.updateUser({
                data: {
                    full_name: input.fullName,
                    phone: input.phone,
                },
            });

            if (error) throw error;
            return { success: true };
        }),
});
