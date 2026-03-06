import { createClient as createServerClient } from "@supabase/supabase-js";
import type { Order } from "@/types/database";

export default async function AdminOrdersPage() {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    const totalRevenue = (orders || [])
        .filter((o: Order) => o.status === "paid")
        .reduce((sum: number, o: Order) => sum + (o.amount || 0), 0);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>💳 Quản lý đơn hàng</h2>
                <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                        💰 {(totalRevenue / 1000).toFixed(0)}K₫
                    </span>
                    <span style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 13, fontWeight: 600 }}>
                        📦 {(orders || []).length} đơn
                    </span>
                </div>
            </div>

            <div style={{ background: "#1e293b", borderRadius: 14, border: "1px solid #334155", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #334155" }}>
                            {["Mã đơn", "User ID", "Gói", "Số tiền", "Phương thức", "Trạng thái", "Ngày tạo", "Thanh toán"].map((h) => (
                                <th key={h} style={{ padding: "12px 14px", fontSize: 11, color: "#64748b", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(orders || []).map((order: Order) => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#e2e8f0", fontFamily: "monospace" }}>{order.order_code}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{order.user_id?.slice(0, 8)}...</td>
                                <td style={{ padding: "12px 14px", fontSize: 13, color: "#e2e8f0" }}>{order.plan === "basic" ? "⭐ Basic" : "👑 Premium"}</td>
                                <td style={{ padding: "12px 14px", fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{(order.amount || 0).toLocaleString("vi-VN")}₫</td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#94a3b8" }}>{order.payment_method || "sepay"}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <span style={{
                                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                        color: order.status === "paid" ? "#10b981" : order.status === "pending" ? "#f59e0b" : "#ef4444",
                                        background: order.status === "paid" ? "rgba(16,185,129,0.15)" : order.status === "pending" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                                    }}>
                                        {order.status === "paid" ? "✅ Paid" : order.status === "pending" ? "⏳ Pending" : "❌ Failed"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#64748b" }}>
                                    {new Date(order.created_at).toLocaleString("vi-VN")}
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#64748b" }}>
                                    {order.paid_at ? new Date(order.paid_at).toLocaleString("vi-VN") : "—"}
                                </td>
                            </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#64748b" }}>Chưa có đơn hàng</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
