import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
    PLAN_LIMITS,
    type PlanTier,
} from "../middleware/feature-gate";
import crypto from "crypto";

const PLAN_PRICES: Record<string, number> = {
    basic: 199000,
    premium: 299000,
};

const SEPAY_MERCHANT_ID = process.env.SEPAY_MERCHANT_ID || "";
const SEPAY_SECRET_KEY = process.env.SEPAY_SECRET_KEY || "";
const SEPAY_SANDBOX = !process.env.SEPAY_MERCHANT_ID?.startsWith("SP-");
const SEPAY_CHECKOUT_URL = SEPAY_SANDBOX
    ? "https://pay-sandbox.sepay.vn/v1/checkout/init"
    : "https://pay.sepay.vn/v1/checkout/init";

const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL || "https://7app.online";

function generateSignature(params: Record<string, string>): string {
    const sortedKeys = Object.keys(params).sort();
    const signString = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
    return crypto
        .createHmac("sha256", SEPAY_SECRET_KEY)
        .update(signString)
        .digest("hex");
}

export const billingRouter = router({
    getMyPlan: protectedProcedure.query(async ({ ctx }) => {
        const { data: sub } = await ctx.supabase
            .from("subscriptions")
            .select("plan, expires_at")
            .eq("user_id", ctx.user.id)
            .maybeSingle();

        const tier = (sub?.plan || "free") as PlanTier;
        const limits = PLAN_LIMITS[tier] || PLAN_LIMITS.free;

        return {
            tier,
            expiresAt: sub?.expires_at || null,
            ...limits,
        };
    }),

    createOrder: protectedProcedure
        .input(
            z.object({
                planTier: z.enum(["basic", "premium"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const price = PLAN_PRICES[input.planTier];
            const orderCode = `LS${Date.now().toString(36).toUpperCase()}`;

            // 1. Save order to DB
            const { data, error } = await ctx.supabase
                .from("orders")
                .insert({
                    user_id: ctx.user.id,
                    order_code: orderCode,
                    plan: input.planTier,
                    amount: price,
                    status: "pending",
                    payment_method: "sepay",
                })
                .select()
                .single();

            if (error) throw new Error(error.message);

            // 2. Build SePay checkout params
            const planName =
                input.planTier === "basic"
                    ? "LoveStory Basic"
                    : "LoveStory Premium";

            const checkoutParams: Record<string, string> = {
                merchant: SEPAY_MERCHANT_ID,
                currency: "VND",
                order_amount: String(price),
                operation: "PURCHASE",
                order_description: `${planName} - ${orderCode}`,
                order_invoice_number: orderCode,
                success_url: `${APP_URL}/checkout/success?code=${orderCode}`,
                error_url: `${APP_URL}/checkout?error=payment_failed`,
                cancel_url: `${APP_URL}/checkout?error=cancelled`,
            };

            // 3. Generate HMAC-SHA256 signature
            checkoutParams.signature = generateSignature(checkoutParams);

            // 4. Call SePay to get checkout URL
            let checkoutUrl = "";
            try {
                const sepayRes = await fetch(SEPAY_CHECKOUT_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(checkoutParams).toString(),
                    redirect: "manual",
                });

                // SePay typically returns a 302 redirect
                if (
                    sepayRes.status === 302 ||
                    sepayRes.status === 301
                ) {
                    checkoutUrl =
                        sepayRes.headers.get("Location") || "";
                }

                // If direct response, try to parse
                if (!checkoutUrl) {
                    checkoutUrl = `${SEPAY_CHECKOUT_URL}?${new URLSearchParams(checkoutParams).toString()}`;
                }
            } catch {
                // Fallback: construct checkout URL for form submit
                checkoutUrl = `${SEPAY_CHECKOUT_URL}?${new URLSearchParams(checkoutParams).toString()}`;
            }

            return {
                orderId: data.id,
                orderCode,
                amount: price,
                checkoutUrl,
                formAction: SEPAY_CHECKOUT_URL,
                formData: checkoutParams,
            };
        }),

    getOrders: protectedProcedure.query(async ({ ctx }) => {
        const { data } = await ctx.supabase
            .from("orders")
            .select("*")
            .eq("user_id", ctx.user.id)
            .order("created_at", { ascending: false })
            .limit(20);

        return data || [];
    }),

    /**
     * Check order status — used by checkout success polling.
     */
    checkOrderStatus: protectedProcedure
        .input(z.object({ orderCode: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data } = await ctx.supabase
                .from("orders")
                .select("status, plan, paid_at")
                .eq("order_code", input.orderCode)
                .eq("user_id", ctx.user.id)
                .single();

            return {
                status: data?.status || "not_found",
                plan: data?.plan || null,
                paidAt: data?.paid_at || null,
            };
        }),
});
