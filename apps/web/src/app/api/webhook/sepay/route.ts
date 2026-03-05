import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";

// SePay webhook handler
// SePay sends POST request when a bank transfer is detected
// Webhook payload includes: transferAmount, content (chứa orderCode), etc.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
    try {
        // Verify SePay webhook (optional: check API key header)
        const apiKey = req.headers.get("Authorization");
        const expectedKey = process.env.SEPAY_WEBHOOK_SECRET;

        if (expectedKey && apiKey !== `Bearer ${expectedKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // SePay webhook payload structure:
        // { id, gateway, transactionDate, accountNumber, transferType, 
        //   transferAmount, accumulated, code, content, referenceCode, description }
        const { transferAmount, content, id: transactionId } = body;

        if (!content || !transferAmount) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Extract order code from transfer content
        // Content format usually: "LS..." or contains "LS..."
        const orderCodeMatch = content.match(/LS[A-Z0-9]+/i);
        if (!orderCodeMatch) {
            return NextResponse.json({ error: "No order code found" }, { status: 400 });
        }

        const orderCode = orderCodeMatch[0].toUpperCase();

        // Use service role to bypass RLS
        const supabase = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        // Find the pending order
        const { data: order, error: findError } = await supabase
            .from("orders")
            .select("*")
            .eq("order_code", orderCode)
            .eq("status", "pending")
            .single();

        if (findError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Verify amount matches
        if (transferAmount < order.amount) {
            return NextResponse.json({ error: "Insufficient amount" }, { status: 400 });
        }

        // Update order status to paid
        await supabase
            .from("orders")
            .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                sepay_transaction_id: String(transactionId || ""),
            })
            .eq("id", order.id);

        // Upsert subscription
        await supabase
            .from("subscriptions")
            .upsert({
                user_id: order.user_id,
                plan: order.plan,
                order_id: order.id,
                started_at: new Date().toISOString(),
                expires_at: null, // Lifetime for now
            }, { onConflict: "user_id" });

        return NextResponse.json({ success: true, orderCode });
    } catch (err) {
        console.error("Webhook error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
