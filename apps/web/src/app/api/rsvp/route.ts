import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { projectId, guestName, status, guestCount, phone } = body;

        if (!projectId || !guestName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("rsvps")
            .insert({
                project_id: projectId,
                guest_name: guestName,
                status: status || "confirmed",
                guest_count: guestCount || 1,
                phone: phone || "",
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
