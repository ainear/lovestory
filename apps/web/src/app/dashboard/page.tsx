import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Load real stats
    let projectCount = 0;
    let totalViews = 0;
    let totalRsvps = 0;
    let totalWishes = 0;
    let maxProjects = 1; // free plan default

    if (user) {
        // Get subscription
        const { data: sub } = await supabase
            .from("subscriptions")
            .select("plan")
            .eq("user_id", user.id)
            .single();

        if (sub?.plan === "basic") maxProjects = 5;
        else if (sub?.plan === "premium") maxProjects = 999;

        const { data: projects } = await supabase
            .from("projects")
            .select("id, view_count")
            .eq("user_id", user.id);

        if (projects && projects.length > 0) {
            projectCount = projects.length;
            totalViews = projects.reduce((sum, p) => sum + (p.view_count || 0), 0);
            const projectIds = projects.map((p) => p.id);

            const [{ count: rsvpCount }, { count: wishCount }] = await Promise.all([
                supabase.from("rsvps").select("*", { count: "exact", head: true }).in("project_id", projectIds),
                supabase.from("wishes").select("*", { count: "exact", head: true }).in("project_id", projectIds),
            ]);
            totalRsvps = rsvpCount || 0;
            totalWishes = wishCount || 0;
        }
    }

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "bạn";

    return (
        <div>
            {/* Welcome */}
            <div
                style={{
                    background: "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(192,132,252,0.08))",
                    borderRadius: 20,
                    padding: 32,
                    marginBottom: 24,
                    border: "1px solid rgba(192,132,252,0.12)",
                }}
            >
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                    Xin chào, {displayName}! 👋
                </h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                    Quản lý thiệp cưới và theo dõi hoạt động của bạn
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                {[
                    { icon: "💌", label: "Thiệp", value: projectCount, max: maxProjects === 999 ? null : maxProjects, color: "#ec4899" },
                    { icon: "👁️", label: "Lượt xem", value: totalViews, max: null, color: "#3b82f6" },
                    { icon: "✅", label: "RSVP", value: totalRsvps, max: null, color: "#10b981" },
                    { icon: "💬", label: "Lời chúc", value: totalWishes, max: null, color: "#8b5cf6" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 20,
                            border: "1px solid #e8e8ec",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ fontSize: 32, fontWeight: 700, color: stat.color, margin: "0 0 4px" }}>
                            {stat.value}
                        </p>
                        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                            {stat.icon} {stat.label}
                            {stat.max && <span style={{ fontSize: 11, color: "#9ca3af" }}> / {stat.max}</span>}
                        </p>
                    </div>
                ))}
            </div>

            {/* Upgrade CTA for free/basic users */}
            {maxProjects < 999 && (
                <div
                    style={{
                        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
                        borderRadius: 20,
                        padding: "24px 28px",
                        marginBottom: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>
                            ⭐ Gói hiện tại: <span style={{ color: "#fbbf24" }}>{maxProjects === 1 ? "Free" : "Basic"}</span>
                        </p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                            Nâng cấp để mở khóa {maxProjects === 1 ? "bỏ watermark, nhạc nền, RSVP" : "thiệp không giới hạn, Video AI"}
                        </p>
                    </div>
                    <Link
                        href="/checkout"
                        style={{
                            padding: "10px 24px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        🚀 Nâng cấp ngay
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>⚡ Hành động nhanh</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
                <Link
                    href="/templates"
                    style={{
                        display: "block",
                        padding: 24,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff",
                        textDecoration: "none",
                    }}
                >
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>🎨</p>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Tạo thiệp mới</p>
                    <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>Chọn mẫu và bắt đầu</p>
                </Link>
                <Link
                    href="/dashboard/projects"
                    style={{
                        display: "block",
                        padding: 24,
                        borderRadius: 16,
                        background: "#fff",
                        border: "1px solid #e8e8ec",
                        color: "#374151",
                        textDecoration: "none",
                    }}
                >
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>📋</p>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Quản lý thiệp</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Xem và chỉnh sửa</p>
                </Link>
            </div>

            {/* Tips for new users */}
            {projectCount === 0 && (
                <div style={{
                    background: "#eff6ff",
                    borderRadius: 16,
                    padding: "24px 28px",
                    border: "1px solid #bfdbfe",
                }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e40af", margin: "0 0 12px" }}>💡 Bắt đầu tạo thiệp đầu tiên</h3>
                    <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                            "Chọn mẫu thiệp yêu thích từ bộ sưu tập 50+ template",
                            "Điền thông tin: tên cô dâu & chú rể, ngày cưới, địa điểm",
                            "Upload ảnh cưới và tùy chỉnh nội dung",
                            "Xuất bản & chia sẻ link cho khách mời qua Zalo, Facebook",
                        ].map((tip, i) => (
                            <li key={i} style={{ fontSize: 13, color: "#1e40af", lineHeight: 1.6 }}>{tip}</li>
                        ))}
                    </ol>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    div[style*="gridTemplateColumns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
                    div[style*="gridTemplateColumns: repeat(2"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
