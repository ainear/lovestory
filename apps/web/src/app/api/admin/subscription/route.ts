import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getAdminClient } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const result = await verifyAdmin();
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const { userId, plan } = await req.json();
  if (!userId || !["free", "basic", "premium"].includes(plan)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // Use service role to manage subscriptions
  const adminClient = getAdminClient();

  if (plan === "free") {
    // Delete subscription row (= free plan)
    await adminClient.from("subscriptions").delete().eq("user_id", userId);
  } else {
    // Upsert subscription
    const { error } = await adminClient
      .from("subscriptions")
      .upsert({ user_id: userId, plan }, { onConflict: "user_id" });
    if (error) {
      console.error("Admin subscription upsert error:", error.message);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true, plan });
}
