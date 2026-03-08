import { createClient as createServerClient } from "@supabase/supabase-js";

export default async function AdminLogsPage() {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get recent users (last 20 registrations)
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 20 });
    const recentUsers = (authData?.users || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

    // Get recent projects
    const { data: recentProjects } = await supabase
        .from("projects")
        .select("id, title, user_id, created_at, status, template")
        .order("created_at", { ascending: false })
        .limit(10);

    // Get recent orders
    const { data: recentOrders } = await supabase
        .from("orders")
        .select("id, order_code, plan, amount, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

    // Build unified activity log
    type LogEntry = {
        type: "user" | "project" | "order";
        icon: string;
        label: string;
        detail: string;
        time: string;
        raw: Date;
    };

    const logs: LogEntry[] = [
        ...recentUsers.map((u) => ({
            type: "user" as const,
            icon: "👤",
            label: "Đăng ký mới",
            detail: u.email || "unknown",
            time: new Date(u.created_at).toLocaleString("vi-VN"),
            raw: new Date(u.created_at),
        })),
        ...(recentProjects || []).map((p: { id: string; title: string; user_id: string; created_at: string; status: string; template: string }) => ({
            type: "project" as const,
            icon: p.status === "published" ? "🟢" : "📝",
            label: p.status === "published" ? "Xuất bản thiệp" : "Tạo thiệp mới",
            detail: p.title || `Template: ${p.template}`,
            time: new Date(p.created_at).toLocaleString("vi-VN"),
            raw: new Date(p.created_at),
        })),
        ...(recentOrders || []).map((o: { id: string; order_code: string; plan: string; amount: number; status: string; created_at: string }) => ({
            type: "order" as const,
            icon: o.status === "paid" ? "💰" : "⏳",
            label: o.status === "paid" ? "Thanh toán thành công" : "Đơn hàng mới",
            detail: `${o.order_code} · ${o.plan} · ${(o.amount || 0).toLocaleString("vi-VN")}₫`,
            time: new Date(o.created_at).toLocaleString("vi-VN"),
            raw: new Date(o.created_at),
        })),
    ].sort((a, b) => b.raw.getTime() - a.raw.getTime());

    const typeColors = {
        user: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
        project: { bg: "rgba(139,92,246,0.15)", color: "#8b5cf6" },
        order: { bg: "rgba(16,185,129,0.15)", color: "#10b981" },
    };

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>📋 Activity Logs</h2>

            {/* Stats summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                    { icon: "👤", label: "Users mới (10)", count: recentUsers.length, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
                    { icon: "💌", label: "Thiệp gần đây", count: (recentProjects || []).length, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
                    { icon: "💳", label: "Đơn hàng gần đây", count: (recentOrders || []).length, color: "#10b981", bg: "rgba(16,185,129,0.15)" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: "0 0 4px" }}>{s.count}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{s.icon} {s.label}</p>
                    </div>
                ))}
            </div>

            {/* Activity Timeline */}
            <div style={{ background: "#1e293b", borderRadius: 14, border: "1px solid #334155", overflow: "hidden" }}>
                {logs.length === 0 ? (
                    <p style={{ padding: 32, textAlign: "center", color: "#64748b" }}>Chưa có hoạt động</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {logs.map((log, i) => {
                            const tc = typeColors[log.type];
                            return (
                                <div
                                    key={i}
                                    style={{
                                        padding: "14px 20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        borderBottom: i < logs.length - 1 ? "1px solid #1e293b" : "none",
                                    }}
                                >
                                    <span style={{ fontSize: 20, width: 36, height: 36, borderRadius: 8, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {log.icon}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0", margin: "0 0 2px" }}>{log.label}</p>
                                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{log.detail}</p>
                                    </div>
                                    <span style={{
                                        padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                                        background: tc.bg, color: tc.color, textTransform: "uppercase",
                                    }}>
                                        {log.type}
                                    </span>
                                    <span style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{log.time}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
