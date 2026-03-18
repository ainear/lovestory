import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Order } from "@/types/database";

const PLAN_CONFIG = {
    free: { name: "🆓 Miễn phí", color: "#6b7280", bg: "#f3f4f6", maxProjects: 1, maxPhotos: 10 },
    basic: { name: "⭐ Basic", color: "#7c3aed", bg: "#f5f3ff", maxProjects: 5, maxPhotos: 50 },
    premium: { name: "👑 Premium", color: "#d97706", bg: "#fffbeb", maxProjects: 999, maxPhotos: 100 },
};

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get subscription
    let currentPlan = "free";
    let subscription: { plan: string; expires_at: string | null; started_at?: string; orders?: Order[] } | null = null;
    if (user) {
        const { data } = await supabase
            .from("subscriptions")
            .select("*, orders(*)")
            .eq("user_id", user.id)
            .maybeSingle();
        if (data) {
            subscription = data;
            currentPlan = data.plan;
        }
    }

    // Get order history
    let orders: Order[] = [];
    if (user) {
        const { data } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);
        orders = data || [];
    }

    const planInfo = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
    const avatar = user?.user_metadata?.avatar_url;

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 24px" }}>👤 Hồ sơ</h2>

            {/* Profile Card */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8ec", padding: 32, display: "flex", gap: 24, marginBottom: 24 }}>
                <div
                    style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: avatar ? `url(${avatar}) center/cover` : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff",
                        flexShrink: 0,
                    }}
                >
                    {!avatar && (displayName?.[0]?.toUpperCase() || "?")}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>{displayName}</h3>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 12px" }}>{user?.email}</p>
                    <span
                        style={{
                            display: "inline-block",
                            padding: "4px 14px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            color: planInfo.color,
                            background: planInfo.bg,
                        }}
                    >
                        {planInfo.name}
                    </span>
                </div>
                {currentPlan === "free" && (
                    <Link
                        href="/checkout"
                        style={{
                            alignSelf: "center",
                            padding: "10px 20px",
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 600,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                        }}
                    >
                        ⬆️ Nâng cấp
                    </Link>
                )}
            </div>

            {/* Plan Details */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8ec", padding: 20 }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>📋 Giới hạn thiệp</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                        {planInfo.maxProjects === 999 ? "∞" : planInfo.maxProjects}
                    </p>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8ec", padding: 20 }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>📷 Giới hạn ảnh</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: 0 }}>{planInfo.maxPhotos}</p>
                </div>
            </div>

            {/* Subscription Info */}
            {subscription && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8ec", padding: 24, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>📋 Thông tin gói</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#6b7280" }}>Gói hiện tại</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{planInfo.name}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#6b7280" }}>Kích hoạt</span>
                            <span style={{ fontSize: 13, color: "#1f2937" }}>
                                {subscription.started_at ? new Date(subscription.started_at).toLocaleDateString("vi-VN") : "—"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#6b7280" }}>Hạn sử dụng</span>
                            <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>Vĩnh viễn</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Order History */}
            {orders.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8ec", padding: 24, marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>🧾 Lịch sử thanh toán</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {orders.map((order) => (
                            <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: "#1f2937", margin: "0 0 2px" }}>
                                        {order.plan === "basic" ? "⭐ Basic" : "👑 Premium"} — {order.order_code}
                                    </p>
                                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                                        {new Date(order.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: "0 0 2px" }}>
                                        {(order.amount || 0).toLocaleString("vi-VN")}₫
                                    </p>
                                    <span
                                        style={{
                                            padding: "2px 8px",
                                            borderRadius: 6,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: order.status === "paid" ? "#059669" : order.status === "pending" ? "#d97706" : "#dc2626",
                                            background: order.status === "paid" ? "#ecfdf5" : order.status === "pending" ? "#fffbeb" : "#fef2f2",
                                        }}
                                    >
                                        {order.status === "paid" ? "✅ Đã TT" : order.status === "pending" ? "⏳ Chờ" : "❌ Hủy"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sign Out */}
            <Link
                href="/auth/signout"
                style={{
                    display: "block",
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "1px solid #fecaca",
                    background: "#fff",
                    color: "#dc2626",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                    textDecoration: "none",
                }}
            >
                🚪 Đăng xuất
            </Link>
        </div>
    );
}
