import { createClient } from "@/lib/supabase/server";
import type { Rsvp } from "@/types/database";

const STATUS_CONFIG = {
    confirmed: { label: "✅ Tham dự", color: "#059669", bg: "#ecfdf5" },
    maybe: { label: "🤔 Có thể", color: "#d97706", bg: "#fffbeb" },
    declined: { label: "❌ Không", color: "#dc2626", bg: "#fef2f2" },
};

export default async function RsvpPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let rsvps: Rsvp[] = [];
    if (user) {
        const { data: projects } = await supabase
            .from("projects")
            .select("id")
            .eq("user_id", user.id);
        const projectIds = (projects || []).map((p) => p.id);

        if (projectIds.length > 0) {
            const { data } = await supabase
                .from("rsvps")
                .select("*")
                .in("project_id", projectIds)
                .order("created_at", { ascending: false });
            rsvps = data || [];
        }
    }

    const confirmed = rsvps.filter((r) => r.status === "confirmed");
    const totalGuests = confirmed.reduce((sum: number, r) => sum + (r.guest_count || 0), 0);

    return (
        <div>
            <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--dash-text)", margin: 0 }}>✅ Xác nhận tham dự</h2>
                    <p style={{ fontSize: 14, color: "var(--dash-text-secondary)", margin: "4px 0 0" }}>{rsvps.length} phản hồi</p>
                </div>
                {rsvps.length > 0 && (
                    <a
                        href={`/api/guests/export?projectId=${rsvps[0]?.project_id}`}
                        download
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "8px 16px", borderRadius: 8, border: "1px solid var(--dash-border)",
                            background: "var(--dash-card)", color: "var(--dash-text)", fontSize: 12, fontWeight: 500,
                            textDecoration: "none", flexShrink: 0,
                        }}
                    >
                        📥 Xuất CSV
                    </a>
                )}
            </div>


            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                    { icon: "📊", label: "Tổng phản hồi", value: rsvps.length, color: "#3b82f6" },
                    { icon: "✅", label: "Tham dự", value: confirmed.length, color: "#059669" },
                    { icon: "👥", label: "Tổng khách", value: totalGuests, color: "#8b5cf6" },
                    { icon: "🤔", label: "Có thể", value: rsvps.filter((r) => r.status === "maybe").length, color: "#d97706" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "var(--dash-card)", borderRadius: 12, padding: 16, border: "1px solid var(--dash-border)", textAlign: "center" }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                        <p style={{ fontSize: 12, color: "var(--dash-text-muted)", margin: 0 }}>{s.icon} {s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            {rsvps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 24px", background: "var(--dash-card-hover)", borderRadius: 16 }}>
                    <p style={{ fontSize: 36, marginBottom: 8 }}>✅</p>
                    <p style={{ fontSize: 14, color: "var(--dash-text-secondary)", margin: 0 }}>Chưa có RSVP nào. Chia sẻ link thiệp để nhận xác nhận!</p>
                </div>
            ) : (
                <div style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--dash-card-hover)" }}>
                                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Khách mời</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Trạng thái</th>
                                <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Số khách</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>SĐT</th>
                                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rsvps.map((rsvp) => {
                                const config = STATUS_CONFIG[rsvp.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.confirmed;
                                return (
                                    <tr key={rsvp.id} style={{ borderTop: "1px solid var(--dash-border-light)" }}>
                                        <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 500, color: "var(--dash-text)" }}>{rsvp.guest_name}</td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: config.color, background: config.bg }}>
                                                {config.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, color: "var(--dash-text)" }}>{rsvp.guest_count}</td>
                                        <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--dash-text-secondary)" }}>{rsvp.phone || "—"}</td>
                                        <td style={{ padding: "14px 20px", textAlign: "right", fontSize: 12, color: "var(--dash-text-muted)" }}>
                                            {new Date(rsvp.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
