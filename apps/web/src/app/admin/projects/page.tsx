import { createClient as createServerClient } from "@supabase/supabase-js";
import type { Project } from "@/types/database";

export default async function AdminProjectsPage() {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: projects, count: totalProjects } = await supabase
        .from("projects")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(50);

    const published = (projects || []).filter((p: Project) => p.status === "published").length;
    const drafts = (projects || []).filter((p: Project) => p.status === "draft").length;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>💌 Quản lý Thiệp</h2>
                <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                        🟢 {published} published
                    </span>
                    <span style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontSize: 13, fontWeight: 600 }}>
                        📝 {drafts} drafts
                    </span>
                    <span style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(139,92,246,0.15)", color: "#8b5cf6", fontSize: 13, fontWeight: 600 }}>
                        📦 {totalProjects || 0} total
                    </span>
                </div>
            </div>

            <div style={{ background: "#1e293b", borderRadius: 14, border: "1px solid #334155", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #334155" }}>
                            {["Tiêu đề", "Template", "Slug", "Views", "Status", "Ngày tạo"].map((h) => (
                                <th key={h} style={{ padding: "12px 14px", fontSize: 11, color: "#64748b", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(projects || []).map((p: Project) => (
                            <tr key={p.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                <td style={{ padding: "12px 14px" }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", margin: "0 0 2px" }}>{p.title || "Untitled"}</p>
                                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{p.groom_name && p.bride_name ? `${p.groom_name} & ${p.bride_name}` : ""}</p>
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(100,116,139,0.2)", color: "#94a3b8" }}>
                                        {p.template || "—"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{p.slug?.slice(0, 20)}{p.slug?.length > 20 ? "..." : ""}</td>
                                <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600, color: "#3b82f6" }}>{p.view_count || 0}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <span style={{
                                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                        color: p.status === "published" ? "#10b981" : "#f59e0b",
                                        background: p.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                                    }}>
                                        {p.status === "published" ? "🟢 Live" : "📝 Draft"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#64748b" }}>
                                    {new Date(p.created_at).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                        ))}
                        {(!projects || projects.length === 0) && (
                            <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#64748b" }}>Chưa có thiệp nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
