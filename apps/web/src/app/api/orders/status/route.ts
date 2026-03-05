import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get("code");
        if (!code) {
            return NextResponse.json({ error: "Missing code" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data } = await supabase
            .from("orders")
            .select("status, plan")
            .eq("order_code", code)
            .single();

        return NextResponse.json({ status: data?.status || "pending", plan: data?.plan });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
