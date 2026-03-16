import { createClient as createServerClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL environment variable is not set");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  // Auth check — must be admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, plan } = await req.json();
  if (!userId || !["free", "basic", "premium"].includes(plan)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // Use service role to manage subscriptions
  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

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
