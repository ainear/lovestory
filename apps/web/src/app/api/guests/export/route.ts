import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

// GET /api/guests/export?projectId=xxx
// Downloads RSVPs + guests as CSV
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
        return new Response("Missing projectId", { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Verify ownership
    const { data: project } = await supabase
        .from("projects")
        .select("id, groom_name, bride_name, slug")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (!project) {
        return new Response("Not found", { status: 404 });
    }

    // Fetch RSVPs
    const { data: rsvps } = await supabase
        .from("rsvps")
        .select("guest_name, status, guest_count, phone, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

    // Fetch guest list
    const { data: guests } = await supabase
        .from("guests")
        .select("name, email, phone, status, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

    // Build CSV
    const rows: string[] = [
        "Loại,Tên khách,Email,Điện thoại,Trạng thái,Số người,Ngày",
    ];

    // Add RSVP rows
    for (const r of rsvps || []) {
        const statusLabel = r.status === "confirmed" ? "Tham dự" : r.status === "declined" ? "Vắng mặt" : "Có thể";
        const date = new Date(r.created_at).toLocaleDateString("vi-VN");
        rows.push(`RSVP,"${r.guest_name}",,${r.phone || ""},${statusLabel},${r.guest_count || 1},${date}`);
    }

    // Add guest list rows
    for (const g of guests || []) {
        const statusLabel = g.status === "confirmed" ? "Tham dự" : g.status === "declined" ? "Vắng mặt" : "Mời";
        const date = new Date(g.created_at).toLocaleDateString("vi-VN");
        rows.push(`Danh sách mời,"${g.name}",${g.email || ""},${g.phone || ""},${statusLabel},,${date}`);
    }

    const csv = rows.join("\n");
    const filename = `danh-sach-khach-${project.slug || projectId}.csv`;

    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
