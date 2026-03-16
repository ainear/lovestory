import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getUserPlan,
  assertCanGenerateVideo,
} from "@/server/trpc/middleware/feature-gate";

/**
 * POST /api/video/start
 * Creates a video record and triggers async FFmpeg generation.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để tạo video" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { photoUrls, style, music, duration } = body;

    if (!photoUrls || photoUrls.length < 3) {
      return NextResponse.json(
        { error: "Cần tối thiểu 3 ảnh" },
        { status: 400 },
      );
    }

    // Check plan limits
    const { limits } = await getUserPlan(supabase, user.id);
    try {
      await assertCanGenerateVideo(supabase, user.id, limits);
    } catch (err) {
      console.error(
        "[Video API] Error:",
        err instanceof Error ? err.message : err,
      );
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    // Create video record
    const { data: video, error: dbError } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        template_preset: style || "cinematic",
        status: "processing",
        progress: 0,
        resolution: limits.maxVideoResolution,
        has_watermark: limits.hasWatermark,
        config: {
          photoUrls,
          music: music || "none",
          duration: parseInt(duration || "30"),
        },
      })
      .select("id")
      .single();

    if (dbError || !video) {
      return NextResponse.json(
        { error: "Không thể tạo video record" },
        { status: 500 },
      );
    }

    // Trigger async FFmpeg generation (fire-and-forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    fetch(`${baseUrl}/api/video/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // B2 fix: S2S auth so C3 guard in /api/video/generate passes
        ...(process.env.INTERNAL_API_SECRET
          ? { Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}` }
          : {}),
      },
      body: JSON.stringify({
        videoId: video.id,
        photoUrls,
        style: style || "cinematic",
        music: music || "none",
        duration: duration || "30",
        resolution: limits.maxVideoResolution,
        hasWatermark: limits.hasWatermark,
      }),
    }).catch((err) => {
      console.error("Failed to trigger video generation:", err);
    });

    return NextResponse.json({
      videoId: video.id,
      status: "processing",
    });
  } catch (err) {
    console.error("Video start error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
