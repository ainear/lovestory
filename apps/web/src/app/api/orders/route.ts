import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { PLAN_PRICES } from "@/config/plans";
import { checkRateLimit } from "@/lib/rate-limit";

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID!;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY!;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY!;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://7app.online";

interface CreateOrderBody {
  plan: "basic" | "premium";
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
    const { plan } = body;

    if (!plan) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // SEC-04: Look up authoritative price server-side; ignore any client-sent amount
    const amount = PLAN_PRICES[plan];
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // PayOS requires orderCode as integer (using Date.now() for unique safe integer)
    const orderCodeNumber = Date.now();
    const orderCodeStr = String(orderCodeNumber);

    // 1. Save order to Supabase
    const { error: dbError } = await supabase.from("orders").insert({
      user_id: user.id,
      plan,
      amount,
      order_code: orderCodeStr,
      status: "pending",
      payment_method: "payos",
    });

    if (dbError) {
      console.error("Order DB error:", dbError.message);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    // 2. Prepare parameters for PayOS Payment Request
    const returnUrl = `${APP_URL}/checkout/success?code=${orderCodeStr}`;
    const cancelUrl = `${APP_URL}/checkout?error=cancelled`;
    
    // PayOS description: max 25 characters, alphanumeric & dashes only (no spaces for cleaner banking format)
    const description = `LS-${plan === "basic" ? "Basic" : "Premium"}-${orderCodeStr}`.slice(0, 25);

    // 3. Generate PayOS HMAC-SHA256 signature
    // Required fields sorted alphabetically: amount, cancelUrl, description, orderCode, returnUrl
    const signString = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCodeNumber}&returnUrl=${returnUrl}`;
    const signature = crypto
      .createHmac("sha256", PAYOS_CHECKSUM_KEY)
      .update(signString)
      .digest("hex");

    // 4. POST to PayOS API merchant
    const payosRes = await fetch("https://api-merchant.payos.vn/v2/payment-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": PAYOS_CLIENT_ID,
        "x-api-key": PAYOS_API_KEY,
      },
      body: JSON.stringify({
        orderCode: orderCodeNumber,
        amount,
        description,
        cancelUrl,
        returnUrl,
        signature,
      }),
    });

    const payosData = await payosRes.json();

    if (payosData.code === "00" && payosData.data?.checkoutUrl) {
      return NextResponse.json({
        success: true,
        checkoutUrl: payosData.data.checkoutUrl,
      });
    } else {
      console.error("PayOS API error response:", payosData);
      return NextResponse.json(
        { error: payosData.desc || "Không thể tạo liên kết thanh toán PayOS" },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
