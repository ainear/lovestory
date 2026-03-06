import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 50) + "-" + Math.random().toString(36).slice(2, 8);
}

export const projectRouter = router({
    list: protectedProcedure.query(async ({ ctx }) => {
        const { data } = await ctx.supabase
            .from("projects")
            .select("*")
            .eq("user_id", ctx.user.id)
            .order("created_at", { ascending: false });

        return data || [];
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const { data } = await ctx.supabase
                .from("projects")
                .select("*")
                .eq("id", input.id)
                .eq("user_id", ctx.user.id)
                .single();

            return data || null;
        }),

    create: protectedProcedure
        .input(
            z.object({
                templateId: z.string(),
                title: z.string().min(1).max(200),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const slug = generateSlug(input.title);

            const { data, error } = await ctx.supabase
                .from("projects")
                .insert({
                    user_id: ctx.user.id,
                    template_id: input.templateId,
                    template: input.templateId,
                    title: input.title,
                    slug,
                    status: "draft",
                    groom_name: "",
                    bride_name: "",
                    view_count: 0,
                })
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1).max(200).optional(),
                layoutJson: z.record(z.unknown()).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updates } = input;
            const updateData: Record<string, unknown> = {};
            if (updates.title) updateData.title = updates.title;
            if (updates.layoutJson) updateData.layout_json = updates.layoutJson;

            const { error } = await ctx.supabase
                .from("projects")
                .update(updateData)
                .eq("id", id)
                .eq("user_id", ctx.user.id);

            if (error) throw new Error(error.message);
            return { success: true };
        }),

    publish: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from("projects")
                .update({ status: "published" })
                .eq("id", input.id)
                .eq("user_id", ctx.user.id)
                .select("slug")
                .single();

            if (error) throw new Error(error.message);
            return { url: `/i/${data.slug}` };
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from("projects")
                .delete()
                .eq("id", input.id)
                .eq("user_id", ctx.user.id);

            if (error) throw new Error(error.message);
            return { success: true };
        }),
});
