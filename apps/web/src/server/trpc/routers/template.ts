import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const templateRouter = router({
    list: publicProcedure
        .input(
            z.object({
                category: z.string().optional(),
                tier: z.enum(["basic", "premium"]).optional(),
                page: z.number().min(1).default(1),
                limit: z.number().min(1).max(50).default(12),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1;
            const limit = input?.limit ?? 12;
            const offset = (page - 1) * limit;

            let query = ctx.supabase
                .from("templates")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (input?.category) {
                query = query.eq("category", input.category);
            }
            if (input?.tier) {
                query = query.eq("tier", input.tier);
            }

            const { data, count } = await query;

            return {
                templates: data || [],
                total: count || 0,
                page,
                limit,
            };
        }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data } = await ctx.supabase
                .from("templates")
                .select("*")
                .eq("slug", input.slug)
                .single();

            return data || null;
        }),
});
