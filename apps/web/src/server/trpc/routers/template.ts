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
        .query(async ({ input }) => {
            // TODO: Query from database
            return { templates: [], total: 0 };
        }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
            // TODO: Query from database
            return null;
        }),
});
