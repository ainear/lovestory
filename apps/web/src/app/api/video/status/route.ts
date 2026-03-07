import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/video/status?id=<videoId>
 * Returns current video generation status for polling.
 */
export async function GET(req: NextRequest) {
    const videoId = req.nextUrl.searchParams.get("id");
    if (!videoId) {
        return NextResponse.json(
            { error: "Missing video ID" },
            { status: 400 },
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    const { data } = await supabase
        .from("videos")
        .select(
            "id, status, progress, output_url, preview_url, thumbnail_url, error_message, duration_seconds",
        )
        .eq("id", videoId)
        .eq("user_id", user.id)
        .single();

    if (!data) {
        return NextResponse.json(
            { error: "Video not found" },
            { status: 404 },
        );
    }

    return NextResponse.json(data);
}
