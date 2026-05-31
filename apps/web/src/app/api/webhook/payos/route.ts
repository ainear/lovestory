import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { sendPaymentConfirmedEmail } from "@/server/services/email";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY!;

function verifyPayOSWebhook(data: any, signature: string, checksumKey: string): boolean {
  try {
    // 1. Sort data object keys alphabetically
    const sortedKeys = Object.keys(data).sort();
    
    // 2. Map to key=value and join with &
    const signString = sortedKeys.map((k) => `${k}=${data[k]}`).join("&");
    
    // 3. Generate HMAC-SHA256 signature
    const computedSignature = crypto
      .createHmac("sha256", checksumKey)
      .update(signString)
      .digest("hex");
    
    // 4. Compare received signature with computed one securely
    const receivedBuffer = Buffer.from(signature, "hex");
    const computedBuffer = Buffer.from(computedSignature, "hex");
    
    if (receivedBuffer.length !== computedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(receivedBuffer, computedBuffer);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, desc, data, signature } = body;

    if (!data || !signature) {
      return NextResponse.json({ error: "Missing webhook data" }, { status: 400 });
    }

    // 1. Verify PayOS Webhook signature
    const isValid = verifyPayOSWebhook(data, signature, PAYOS_CHECKSUM_KEY);
    if (!isValid) {
      console.warn("PayOS webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Only process if PayOS returns success code "00"
    if (code !== "00" || desc !== "success") {
      return NextResponse.json({ success: true, message: "Transaction status is not success" });
    }

    const { orderCode, amount, reference } = data;
    const orderCodeStr = String(orderCode);

    // Use service role client to bypass RLS and perform backend activation
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 3. Find the pending order
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_code", orderCodeStr)
      .eq("status", "pending")
      .single();

    if (findError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Idempotency: prevent processing same transaction reference twice
    if (reference) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("sepay_transaction_id", String(reference))
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ success: true, message: "Duplicate webhook processed" });
      }
    }

    // 5. Verify the amount matches
    if (amount < order.amount) {
      return NextResponse.json({ error: "Insufficient amount paid" }, { status: 400 });
    }

    // 6. Update order status to paid
    await supabase
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        sepay_transaction_id: String(reference || ""),
      })
      .eq("id", order.id);

    // 7. Upsert subscription package for user
    await supabase.from("subscriptions").upsert(
      {
        user_id: order.user_id,
        plan: order.plan,
        order_id: order.id,
        started_at: new Date().toISOString(),
        expires_at: null, // Lifetime activation
      },
      { onConflict: "user_id" },
    );

    // 8. Fire-and-forget: Send payment-confirmed email
    supabase.auth.admin
      .getUserById(order.user_id)
      .then(({ data: userData }) => {
        const email = userData?.user?.email;
        const name =
          userData?.user?.user_metadata?.full_name || email?.split("@")[0] || "bạn";
        if (email) {
          sendPaymentConfirmedEmail(email, name, order.plan).catch((e) =>
            console.warn("[Email] payment-confirmed failed:", e),
          );
        }
      })
      .catch(() => {
        /* non-blocking */
      });

    return NextResponse.json({ success: true, orderCode: orderCodeStr });
  } catch (err) {
    console.error("PayOS webhook handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
