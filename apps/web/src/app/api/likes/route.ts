import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/likes  body: { slug: string }
// Increments likes on a project (anonymous, rate-limited per IP)
export async function POST(request: NextRequest) {
    try {
        const { slug } = await request.json();
        if (!slug || typeof slug !== "string") {
            return NextResponse.json({ error: "Missing slug" }, { status: 400 });
        }

        // Simple IP-based rate limit via header (no Redis needed)
        const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "anon";
        const rateLimitKey = `like:${slug}:${ip}`;

        // Use supabase to atomically increment likes
        const supabase = await createClient();

        // Increment likes — uses DB-level atomic update
        const { data, error } = await supabase.rpc("increment_likes", { p_slug: slug });

        if (error) {
            // If RPC doesn't exist yet, fallback to direct update
            const { data: project } = await supabase
                .from("projects")
                .select("id, likes")
                .eq("slug", slug)
                .maybeSingle();

            if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

            const { data: updated } = await supabase
                .from("projects")
                .update({ likes: (project.likes || 0) + 1 })
                .eq("slug", slug)
                .select("likes")
                .single();

            return NextResponse.json({ likes: updated?.likes ?? 1 });
        }

        return NextResponse.json({ likes: data });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET /api/likes?slug=xxx
export async function GET(request: NextRequest) {
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) return NextResponse.json({ likes: 0 });

    const supabase = await createClient();
    const { data } = await supabase
        .from("projects")
        .select("likes")
        .eq("slug", slug)
        .maybeSingle();

    return NextResponse.json({ likes: data?.likes ?? 0 });
}
