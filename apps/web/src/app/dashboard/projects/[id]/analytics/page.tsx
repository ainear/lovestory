"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function ProjectAnalyticsPage() {
    const params = useParams();
    const projectId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<any>(null);
    const [rsvps, setRsvps] = useState<any[]>([]);
    const [wishes, setWishes] = useState<any[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [projectRes, rsvpRes, wishRes] = await Promise.all([
                supabase.from("projects").select("*").eq("id", projectId).eq("user_id", user.id).single(),
                supabase.from("rsvps").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
                supabase.from("wishes").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
            ]);

            setProject(projectRes.data);
            setRsvps(rsvpRes.data || []);
            setWishes(wishRes.data || []);
            setLoading(false);
        }
        load();
    }, [projectId]);

    if (loading) {
        return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 18, color: "#6b7280" }}>⏳ Đang tải...</div>;
    }

    if (!project) {
        return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 18, color: "#6b7280" }}>❌ Không tìm thấy thiệp</div>;
    }

    const attendingCount = rsvps.filter(r => r.status === "attending").length;
    const maybeCount = rsvps.filter(r => r.status === "maybe").length;
    const declinedCount = rsvps.filter(r => r.status === "declined").length;
    const totalGuests = rsvps.filter(r => r.status === "attending").reduce((sum, r) => sum + (r.guest_count || 1), 0);
    const title = `${project.groom_name || "Chú rể"} & ${project.bride_name || "Cô dâu"}`;

    const stats = [
        { label: "Lượt xem", value: project.view_count || 0, icon: "👁️", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Tham dự", value: attendingCount, icon: "✅", color: "#10b981", bg: "#ecfdf5" },
        { label: "Có thể", value: maybeCount, icon: "🤔", color: "#f59e0b", bg: "#fffbeb" },
        { label: "Không đến", value: declinedCount, icon: "❌", color: "#ef4444", bg: "#fef2f2" },
        { label: "Tổng khách", value: totalGuests, icon: "👥", color: "#8b5cf6", bg: "#f5f3ff" },
        { label: "Lời chúc", value: wishes.length, icon: "💬", color: "#ec4899", bg: "#fdf2f8" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                    <div>
                        <Link href="/dashboard/projects" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13, display: "inline-flex", gap: 6, marginBottom: 8 }}>
                            ← Về thiệp của tôi
                        </Link>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                            📊 Analytics: {title}
                        </h1>
                        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>
                            {project.status === "published" ? "🟢 Đã xuất bản" : "📝 Bản nháp"} · Mẫu: {(project.template || "rose-garden").replace(/-/g, " ")}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Link href={`/i/${project.slug}`} target="_blank" style={{
                            padding: "8px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff",
                            color: "#374151", fontSize: 13, textDecoration: "none",
                        }}>
                            👁️ Xem thiệp
                        </Link>
                        <Link href={`/dashboard/projects/${project.id}/share`} style={{
                            padding: "8px 16px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff",
                            fontSize: 13, fontWeight: 600, textDecoration: "none",
                        }}>
                            📤 Chia sẻ
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</span>
                                <span style={{ fontSize: 20, width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</span>
                            </div>
                            <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* RSVP Table */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 24, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>✅ Xác nhận tham dự ({rsvps.length})</h3>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                                {["Tên", "Trạng thái", "Số khách", "Ngày"].map(h => (
                                    <th key={h} style={{ padding: "10px 16px", fontSize: 11, color: "#9ca3af", textAlign: "left", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rsvps.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#1f2937", fontWeight: 500 }}>{r.guest_name || "Khách"}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                            color: r.status === "attending" ? "#10b981" : r.status === "maybe" ? "#f59e0b" : "#ef4444",
                                            background: r.status === "attending" ? "#ecfdf5" : r.status === "maybe" ? "#fffbeb" : "#fef2f2",
                                        }}>
                                            {r.status === "attending" ? "✅ Tham dự" : r.status === "maybe" ? "🤔 Có thể" : "❌ Không"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#6b7280" }}>{r.guest_count || 1}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#9ca3af" }}>{new Date(r.created_at).toLocaleDateString("vi-VN")}</td>
                                </tr>
                            ))}
                            {rsvps.length === 0 && (
                                <tr><td colSpan={4} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Chưa có ai xác nhận</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Wishes Table */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>💬 Lời chúc ({wishes.length})</h3>
                    </div>
                    <div style={{ maxHeight: 400, overflow: "auto" }}>
                        {wishes.map((w, i) => (
                            <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{w.guest_name || "Khách"}</span>
                                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(w.created_at).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, margin: 0 }}>{w.message}</p>
                                {w.emoji && <span style={{ fontSize: 20, marginTop: 4, display: "inline-block" }}>{w.emoji}</span>}
                            </div>
                        ))}
                        {wishes.length === 0 && (
                            <div style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Chưa có lời chúc</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
