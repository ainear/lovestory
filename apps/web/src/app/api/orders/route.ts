import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { PLAN_PRICES } from "@/config/plans";
import { checkRateLimit } from "@/lib/rate-limit";

const SEPAY_MERCHANT_ID = process.env.SEPAY_MERCHANT_ID!;
const SEPAY_SECRET_KEY = process.env.SEPAY_SECRET_KEY!;
const SEPAY_SANDBOX = process.env.SEPAY_SANDBOX !== "false"; // Set SEPAY_SANDBOX=false in production env
const SEPAY_CHECKOUT_URL = SEPAY_SANDBOX
  ? "https://pay-sandbox.sepay.vn/v1/checkout/init"
  : "https://pay.sepay.vn/v1/checkout/init";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://7app.online";

interface CreateOrderBody {
  plan: "basic" | "premium";
  orderCode: string;
}

function generateSignature(params: Record<string, string>): string {
  // Sort params alphabetically by key, concatenate key=value&, then HMAC-SHA256
  const sortedKeys = Object.keys(params).sort();
  const signString = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  return crypto
    .createHmac("sha256", SEPAY_SECRET_KEY)
    .update(signString)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 orders/min per user (prevent spam orders)
    const rl = checkRateLimit(`order:${user.id}`, { limit: 5, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu, vui lòng thử lại sau" },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const body: CreateOrderBody = await req.json();
    const { plan, orderCode } = body;

    if (!plan || !orderCode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Validate orderCode format to prevent injection in URLs and descriptions
    const ORDER_CODE_RE = /^[A-Z0-9]{6,32}$/i;
    if (!ORDER_CODE_RE.test(orderCode)) {
      return NextResponse.json(
        { error: "Invalid order code" },
        { status: 400 },
      );
    }

    // SEC-04: Look up authoritative price server-side; ignore any client-sent amount
    const amount = PLAN_PRICES[plan];
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // 1. Save order to Supabase
    const { error: dbError } = await supabase.from("orders").insert({
      user_id: user.id,
      plan,
      amount,
      order_code: orderCode,
      status: "pending",
      payment_method: "sepay",
    });

    if (dbError) {
      console.error("Order DB error:", dbError.message);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    // 2. Create SePay Payment Gateway checkout
    const planName = plan === "basic" ? "LoveStory Basic" : "LoveStory Premium";
    const checkoutParams: Record<string, string> = {
      merchant: SEPAY_MERCHANT_ID,
      currency: "VND",
      order_amount: String(amount),
      operation: "PURCHASE",
      order_description: `${planName} - ${orderCode}`,
      order_invoice_number: orderCode,
      success_url: `${APP_URL}/checkout/success?code=${orderCode}`,
      error_url: `${APP_URL}/checkout?error=payment_failed`,
      cancel_url: `${APP_URL}/checkout?error=cancelled`,
    };

    // Generate HMAC-SHA256 signature
    checkoutParams.signature = generateSignature(checkoutParams);

    // 3. POST to SePay checkout/init
    const sepayRes = await fetch(SEPAY_CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(checkoutParams).toString(),
    });

    // SePay returns a redirect URL or we get the checkout URL
    if (sepayRes.redirected) {
      return NextResponse.json({
        success: true,
        checkoutUrl: sepayRes.url,
      });
    }

    // If not redirected, check response
    const responseUrl =
      sepayRes.url ||
      `${SEPAY_CHECKOUT_URL}?${new URLSearchParams(checkoutParams).toString()}`;

    // Strip signature from client-facing response to prevent crypto material leak
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signature: _sig, ...safeFormData } = checkoutParams;

    return NextResponse.json({
      success: true,
      checkoutUrl: responseUrl,
      // Fallback: provide form data for client-side form submit
      formAction: SEPAY_CHECKOUT_URL,
      formData: safeFormData,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
