import { createClient } from "@/lib/supabase/server";

// Sprint 8: RSVP Dashboard — reads from rsvp_responses table
// Schema: { id, project_id, guest_name, attending(bool), guest_count, note, created_at }

interface RsvpRow {
    id: string;
    project_id: string;
    guest_name: string;
    attending: boolean;
    guest_count: number;
    note: string | null;
    created_at: string;
}

interface ProjectRow { id: string; title: string | null; slug: string | null; }

export default async function RsvpPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let rsvps: RsvpRow[] = [];
    let projects: ProjectRow[] = [];

    if (user) {
        const { data: proj } = await supabase
            .from("projects")
            .select("id, title, slug")
            .eq("user_id", user.id);
        projects = proj || [];
        const projectIds = projects.map((p) => p.id);

        if (projectIds.length > 0) {
            const { data } = await supabase
                .from("rsvp_responses")
                .select("*")
                .in("project_id", projectIds)
                .order("created_at", { ascending: false });
            rsvps = (data as RsvpRow[]) || [];
        }
    }

    const attending = rsvps.filter((r) => r.attending === true);
    const notAttending = rsvps.filter((r) => r.attending === false);
    const totalGuests = attending.reduce((sum, r) => sum + (r.guest_count || 1), 0);

    // Group by project for the export link
    const firstProjectId = rsvps[0]?.project_id;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--dash-text)", margin: 0 }}>📝 Xác nhận tham dự (RSVP)</h2>
                    <p style={{ fontSize: 14, color: "var(--dash-text-secondary)", margin: "4px 0 0" }}>
                        {rsvps.length} phản hồi từ {projects.length} thiệp cưới
                    </p>
                </div>
                {rsvps.length > 0 && firstProjectId && (
                    <a
                        href={`/api/guests/export?projectId=${firstProjectId}`}
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

            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                    { icon: "📊", label: "Tổng phản hồi", value: rsvps.length, color: "#3b82f6" },
                    { icon: "💕", label: "Sẽ tham dự", value: attending.length, color: "#059669" },
                    { icon: "😔", label: "Không đến", value: notAttending.length, color: "#dc2626" },
                    { icon: "👥", label: "Tổng khách đến", value: totalGuests, color: "#8b5cf6" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "var(--dash-card)", borderRadius: 12, padding: 16, border: "1px solid var(--dash-border)", textAlign: "center" }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                        <p style={{ fontSize: 11, color: "var(--dash-text-muted)", margin: 0 }}>{s.icon} {s.label}</p>
                    </div>
                ))}
            </div>

            {/* Attendance bar */}
            {rsvps.length > 0 && (
                <div style={{ background: "var(--dash-card)", borderRadius: 12, padding: "14px 20px", border: "1px solid var(--dash-border)", marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>💕 Tham dự: {attending.length}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>😔 Không đến: {notAttending.length}</span>
                    </div>
                    <div style={{ height: 8, background: "#f3f4f6", borderRadius: 8, overflow: "hidden" }}>
                        <div style={{
                            height: "100%", borderRadius: 8,
                            background: "linear-gradient(90deg, #059669, #10b981)",
                            width: `${rsvps.length > 0 ? (attending.length / rsvps.length) * 100 : 0}%`,
                            transition: "width .5s ease",
                        }} />
                    </div>
                </div>
            )}

            {/* Table / Empty state */}
            {rsvps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px", background: "var(--dash-card-hover)", borderRadius: 16 }}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>📝</p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "var(--dash-text)", marginBottom: 6 }}>Chưa có RSVP nào</p>
                    <p style={{ fontSize: 14, color: "var(--dash-text-secondary)", margin: 0 }}>
                        Chia sẻ link thiệp cưới để khách xác nhận tham dự
                    </p>
                </div>
            ) : (
                <div style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--dash-card-hover)" }}>
                                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Khách mời</th>
                                <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Trả lời</th>
                                <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Số người</th>
                                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Lời nhắn</th>
                                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rsvps.map((rsvp) => (
                                <tr key={rsvp.id} style={{ borderTop: "1px solid var(--dash-border-light)" }}>
                                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--dash-text)" }}>
                                        {rsvp.guest_name}
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                                        <span style={{
                                            padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            color: rsvp.attending ? "#059669" : "#dc2626",
                                            background: rsvp.attending ? "#ecfdf5" : "#fef2f2",
                                        }}>
                                            {rsvp.attending ? "💕 Tham dự" : "😔 Không đến"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--dash-text)" }}>
                                        {rsvp.attending ? (rsvp.guest_count || 1) : "—"}
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--dash-text-secondary)", maxWidth: 200 }}>
                                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {rsvp.note || <span style={{ color: "var(--dash-text-muted)", fontStyle: "italic" }}>—</span>}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "right", fontSize: 12, color: "var(--dash-text-muted)" }}>
                                        {new Date(rsvp.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
