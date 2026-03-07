import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
    planGatedProcedure,
    assertCanGenerateVideo,
} from "../middleware/feature-gate";

export const videoRouter = router({
    /**
     * Start video generation — uploads photos, creates DB record, triggers FFmpeg.
     */
    generate: planGatedProcedure
        .input(
            z.object({
                projectId: z.string().uuid().optional(),
                photoUrls: z.array(z.string().url()).min(3).max(20),
                style: z.enum(["cinematic", "romantic", "vintage", "modern"]),
                music: z.enum(["romantic", "acoustic", "orchestra", "none"]),
                duration: z.enum(["15", "30", "60"]),
                coupleInfo: z
                    .object({
                        groomName: z.string().optional(),
                        brideName: z.string().optional(),
                        weddingDate: z.string().optional(),
                        howWeMet: z.string().optional(),
                    })
                    .optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Check video credit limit
            await assertCanGenerateVideo(
                ctx.supabase,
                ctx.user.id,
                ctx.plan.limits,
            );

            // Create video record in DB
            const { data: video, error } = await ctx.supabase
                .from("videos")
                .insert({
                    user_id: ctx.user.id,
                    project_id: input.projectId || null,
                    template_preset: input.style,
                    status: "processing",
                    progress: 0,
                    resolution: ctx.plan.limits.maxVideoResolution,
                    has_watermark: ctx.plan.limits.hasWatermark,
                    config: {
                        photoUrls: input.photoUrls,
                        music: input.music,
                        duration: parseInt(input.duration),
                        coupleInfo: input.coupleInfo || {},
                    },
                })
                .select("id")
                .single();

            if (error) throw new Error(error.message);

            // Trigger video generation via internal API
            // Using fire-and-forget pattern — video gen runs async
            const baseUrl =
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

            fetch(`${baseUrl}/api/video/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    videoId: video.id,
                    ...input,
                    resolution: ctx.plan.limits.maxVideoResolution,
                    hasWatermark: ctx.plan.limits.hasWatermark,
                }),
            }).catch((err) => {
                console.error("Failed to trigger video generation:", err);
            });

            return {
                videoId: video.id,
                status: "processing",
            };
        }),

    /**
     * Get video generation status — used for polling from the UI.
     */
    getStatus: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const { data } = await ctx.supabase
                .from("videos")
                .select(
                    "id, status, progress, preview_url, output_url, thumbnail_url, error_message, duration_seconds, created_at",
                )
                .eq("id", input.videoId)
                .eq("user_id", ctx.user.id)
                .single();

            if (!data) throw new Error("Video không tồn tại");

            return data;
        }),

    /**
     * List all videos for the current user.
     */
    list: protectedProcedure.query(async ({ ctx }) => {
        const { data } = await ctx.supabase
            .from("videos")
            .select(
                "id, template_preset, status, progress, thumbnail_url, output_url, duration_seconds, created_at",
            )
            .eq("user_id", ctx.user.id)
            .order("created_at", { ascending: false })
            .limit(50);

        return data || [];
    }),
});
