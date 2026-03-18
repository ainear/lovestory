import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    // Support both JSON body (client default) and searchParams (legacy)
    let projectId = searchParams.get("id");
    if (!projectId) {
      try {
        const body = await request.json();
        projectId = body.projectId ?? body.id ?? null;
      } catch {
        // body not JSON, projectId stays null
      }
    }


    if (!projectId) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 },
      );
    }

    // Verify ownership
    const { data: project } = await supabase
      .from("projects")
      .select("id, user_id")
      .eq("id", projectId)
      .single();

    if (!project || project.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete related data first (RLS handles ownership)
    await supabase.from("wishes").delete().eq("project_id", projectId);
    await supabase.from("rsvp_responses").delete().eq("project_id", projectId);

    // Delete project
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Project delete error:", error.message);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
