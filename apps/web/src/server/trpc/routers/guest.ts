import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const guestRouter = router({
    // Public — guests can submit wishes without auth
    submitWish: publicProcedure
        .input(
            z.object({
                projectId: z.string().uuid(),
                guestName: z.string().min(1).max(100),
                message: z.string().min(1).max(500),
                emoji: z.string().max(10).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            // TODO: Insert into database + rate limit
            return { success: true };
        }),

    getWishes: publicProcedure
        .input(z.object({ projectId: z.string().uuid() }))
        .query(async ({ input }) => {
            // TODO: Query from database
            return [];
        }),

    // Public — RSVP without auth
    submitRsvp: publicProcedure
        .input(
            z.object({
                projectId: z.string().uuid(),
                guestName: z.string().min(1).max(100),
                status: z.enum(["confirmed", "declined", "maybe"]),
                guestCount: z.number().min(1).max(20).default(1),
                notes: z.string().max(300).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            // TODO: Insert into database + rate limit
            return { success: true };
        }),

    // Protected — owner views
    listRsvps: protectedProcedure
        .input(z.object({ projectId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            // TODO: Query from database, verify ownership
            return [];
        }),

    listGifts: protectedProcedure
        .input(z.object({ projectId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            // TODO: Query from database, verify ownership
            return [];
        }),
});
