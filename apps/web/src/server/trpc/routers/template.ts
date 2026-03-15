import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getUserPlan, assertPremiumAccess } from "../middleware/feature-gate";

export const templateRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          tier: z.enum(["basic", "premium"]).optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(12),
        })
        .optional(),
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

      if (!data) return null;

      // Premium template gating: if authenticated user requests a PREMIUM
      // template, verify they have premium access. Public/anonymous access
      // is allowed (for preview/SEO) but the tier info is returned so the
      // client can show the lock UI.
      if (data.tier === "PREMIUM" && ctx.user?.id) {
        const { limits } = await getUserPlan(ctx.supabase, ctx.user.id);
        assertPremiumAccess(limits, data.name || "Premium template");
      }

      return data;
    }),
});
