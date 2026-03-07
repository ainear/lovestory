import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc";

/**
 * Plan limits used for feature gating across the app.
 * Matches the `plans` table in DATABASE_SCHEMA.md.
 */
export const PLAN_LIMITS = {
    free: {
        maxProjects: 1,
        maxPhotos: 10,
        maxViews: 300,
        monthlyVideoCredits: 0,
        maxVideoResolution: "720p" as const,
        hasWatermark: true,
        hasPremiumTemplates: false,
        hasAiLoveStory: false,
    },
    basic: {
        maxProjects: 5,
        maxPhotos: 50,
        maxViews: 5000,
        monthlyVideoCredits: 5,
        maxVideoResolution: "1080p" as const,
        hasWatermark: false,
        hasPremiumTemplates: false,
        hasAiLoveStory: true,
    },
    premium: {
        maxProjects: 999,
        maxPhotos: 100,
        maxViews: 999999,
        monthlyVideoCredits: 30,
        maxVideoResolution: "4k" as const,
        hasWatermark: false,
        hasPremiumTemplates: true,
        hasAiLoveStory: true,
    },
} as const;

export type PlanTier = keyof typeof PLAN_LIMITS;

/**
 * Get the current user's plan tier from their subscription.
 */
export async function getUserPlan(
    supabase: ReturnType<typeof Object>,
    userId: string,
): Promise<{ tier: PlanTier; limits: (typeof PLAN_LIMITS)[PlanTier] }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: sub } = await (supabase as any)
        .from("subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

    const tier = (sub?.plan || "free") as PlanTier;
    const limits = PLAN_LIMITS[tier] || PLAN_LIMITS.free;
    return { tier, limits };
}

/**
 * Protected procedure that also loads the user's plan into context.
 * Use this for any mutation that needs plan-based gating.
 */
export const planGatedProcedure = protectedProcedure.use(
    async ({ ctx, next }) => {
        const { tier, limits } = await getUserPlan(ctx.supabase, ctx.user.id);
        return next({
            ctx: {
                ...ctx,
                plan: { tier, limits },
            },
        });
    },
);

/**
 * Check if user can create more projects based on their plan.
 */
export async function assertCanCreateProject(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    userId: string,
    limits: (typeof PLAN_LIMITS)[PlanTier],
): Promise<void> {
    const { count } = await supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

    if ((count || 0) >= limits.maxProjects) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: `Gói hiện tại cho phép tối đa ${limits.maxProjects} thiệp. Vui lòng nâng cấp để tạo thêm!`,
        });
    }
}

/**
 * Check if user has video credits remaining.
 */
export async function assertCanGenerateVideo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    userId: string,
    limits: (typeof PLAN_LIMITS)[PlanTier],
): Promise<void> {
    if (limits.monthlyVideoCredits <= 0) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message:
                "Gói Free không bao gồm tạo video AI. Nâng cấp lên Basic hoặc Premium để sử dụng!",
        });
    }

    // Count videos created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());

    if ((count || 0) >= limits.monthlyVideoCredits) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: `Bạn đã dùng hết ${limits.monthlyVideoCredits} video/tháng. Nâng cấp gói để tạo thêm!`,
        });
    }
}
