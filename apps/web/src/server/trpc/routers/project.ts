import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const projectRouter = router({
    list: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Query from database
        return [];
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            // TODO: Query from database
            return null;
        }),

    create: protectedProcedure
        .input(
            z.object({
                templateId: z.string().uuid(),
                title: z.string().min(1).max(200),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: Insert into database
            return { id: "stub", ...input };
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
            // TODO: Update in database
            return { success: true };
        }),

    publish: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            // TODO: Publish invitation
            return { url: `https://lovestory.app/i/stub-slug` };
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            // TODO: Delete from database
            return { success: true };
        }),
});
