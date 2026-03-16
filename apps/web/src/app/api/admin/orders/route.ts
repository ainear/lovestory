import { createClient as createServerClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function verifyAdmin() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    return { error: "Server misconfigured", status: 500 };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return { error: "Unauthorized", status: 403 };
  }

  return { user };
}

function getAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const adminClient = getAdminClient();

  let query = adminClient
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && ["pending", "paid", "cancelled"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error("Admin orders fetch error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }

  // Fetch user info from auth.users for each unique user_id
  const userIds = [
    ...new Set((orders ?? []).map((o: { user_id: string }) => o.user_id)),
  ];
  const userMap = new Map<
    string,
    { email: string; full_name: string | null }
  >();

  // Batch fetch users via admin API
  const { data: authData } = await adminClient.auth.admin.listUsers({
    perPage: 1000,
  });
  if (authData?.users) {
    for (const u of authData.users) {
      if (userIds.includes(u.id)) {
        userMap.set(u.id, {
          email: u.email ?? "N/A",
          full_name: (u.user_metadata?.full_name as string | undefined) ?? null,
        });
      }
    }
  }

  // Attach user info to orders
  const enrichedOrders = (orders ?? []).map(
    (o: { user_id: string; [key: string]: unknown }) => ({
      ...o,
      user: userMap.get(o.user_id) ?? { email: "N/A", full_name: null },
    }),
  );

  return NextResponse.json({ orders: enrichedOrders });
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const { orderId, action } = body as {
    orderId: string;
    action: "confirm" | "cancel";
  };

  if (!orderId || !["confirm", "cancel"].includes(action)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const adminClient = getAdminClient();

  // Fetch the order first
  const { data: order, error: findError } = await adminClient
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (findError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Order is not pending" },
      { status: 400 },
    );
  }

  if (action === "confirm") {
    // Update order status to paid
    const { error: updateError } = await adminClient
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Admin order confirm error:", updateError.message);
      return NextResponse.json(
        { error: "Failed to confirm order" },
        { status: 500 },
      );
    }

    // Upsert subscription (same pattern as webhook)
    const { error: subError } = await adminClient.from("subscriptions").upsert(
      {
        user_id: order.user_id,
        plan: order.plan,
        order_id: order.id,
        started_at: new Date().toISOString(),
        expires_at: null, // Lifetime for now
      },
      { onConflict: "user_id" },
    );

    if (subError) {
      console.error("Admin subscription upsert error:", subError.message);
      return NextResponse.json(
        { error: "Order confirmed but subscription failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, status: "paid" });
  }

  // action === "cancel"
  const { error: cancelError } = await adminClient
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (cancelError) {
    console.error("Admin order cancel error:", cancelError.message);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, status: "cancelled" });
}
