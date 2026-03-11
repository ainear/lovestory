import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get("code");
        if (!code) {
            return NextResponse.json({ error: "Missing code" }, { status: 400 });
        }

        const supabase = await createClient();
        // B1 fix: require auth to prevent IDOR on order status polling
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data } = await supabase
            .from("orders")
            .select("status, plan")
            .eq("order_code", code)
            .eq("user_id", user.id)  // ownership guard
            .maybeSingle();

        return NextResponse.json({ status: data?.status || "pending", plan: data?.plan });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
