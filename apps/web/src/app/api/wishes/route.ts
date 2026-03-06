import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Strip HTML tags & trim to prevent XSS */
function sanitize(str: string, maxLen = 500): string {
    return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { projectId, guestName, message, emoji } = body;

        if (!projectId || !guestName || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("wishes")
            .insert({
                project_id: projectId,
                guest_name: sanitize(guestName, 100),
                message: sanitize(message, 1000),
                emoji: sanitize(emoji || "❤️", 10),
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

export async function GET(req: NextRequest) {
    try {
        const projectId = req.nextUrl.searchParams.get("projectId");
        if (!projectId) {
            return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data } = await supabase
            .from("wishes")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false })
            .limit(50);

        return NextResponse.json({ data: data || [] });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
