import { createClient as createServerClient } from "@supabase/supabase-js";
import type { Order } from "@/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function AdminDashboard() {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Parallel queries for all stats
    const [
        { count: totalUsers },
        { count: totalOrders },
        { count: paidOrders },
        { count: totalProjects },
        { count: totalSubscriptions },
        { data: recentOrders },
        { data: revenueData },
    ] = await Promise.all([
        supabase.from("users_view").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("orders").select("amount").eq("status", "paid"),
    ]);

    const totalRevenue = (revenueData || []).reduce((sum: number, o: { amount?: number }) => sum + (o.amount || 0), 0);

    const stats = [
        { label: "Tổng Users", value: totalUsers || 0, icon: "👥", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
        { label: "Tổng Đơn hàng", value: totalOrders || 0, icon: "💳", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
        { label: "Đã thanh toán", value: paidOrders || 0, icon: "✅", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
        { label: "Doanh thu", value: `${(totalRevenue / 1000).toFixed(0)}K₫`, icon: "💰", color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
        { label: "Thiệp tạo", value: totalProjects || 0, icon: "💌", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
        { label: "Subscribers", value: totalSubscriptions || 0, icon: "⭐", color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 24px" }}>📊 Admin Dashboard</h2>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
                {stats.map((s, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#1e293b",
                            borderRadius: 16,
                            padding: 24,
                            border: "1px solid #334155",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</span>
                            <span style={{ fontSize: 24, width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</span>
                        </div>
                        <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e2e8f0", margin: "0 0 12px" }}>🕐 Đơn hàng gần đây</h3>
            <div style={{ background: "#1e293b", borderRadius: 14, border: "1px solid #334155", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #334155" }}>
                            {["Mã đơn", "Gói", "Số tiền", "Trạng thái", "Ngày"].map((h) => (
                                <th key={h} style={{ padding: "12px 16px", fontSize: 12, color: "#64748b", textAlign: "left", fontWeight: 600 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(recentOrders || []).map((order: Order) => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                <td style={{ padding: "12px 16px", fontSize: 13, color: "#e2e8f0", fontFamily: "monospace" }}>{order.order_code}</td>
                                <td style={{ padding: "12px 16px", fontSize: 13, color: "#e2e8f0" }}>{order.plan === "basic" ? "⭐ Basic" : "👑 Premium"}</td>
                                <td style={{ padding: "12px 16px", fontSize: 13, color: "#e2e8f0" }}>{(order.amount || 0).toLocaleString("vi-VN")}₫</td>
                                <td style={{ padding: "12px 16px" }}>
                                    <span style={{
                                        padding: "3px 10px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: order.status === "paid" ? "#10b981" : "#f59e0b",
                                        background: order.status === "paid" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                                    }}>
                                        {order.status === "paid" ? "✅ Paid" : "⏳ Pending"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                        ))}
                        {(!recentOrders || recentOrders.length === 0) && (
                            <tr>
                                <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#64748b", fontSize: 13 }}>Chưa có đơn hàng</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
