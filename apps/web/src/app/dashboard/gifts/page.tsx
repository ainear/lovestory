import { createClient } from "@/lib/supabase/server";

export default async function GiftsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let gifts: any[] = [];
    if (user) {
        const { data: projects } = await supabase
            .from("projects")
            .select("id")
            .eq("user_id", user.id);
        const projectIds = (projects || []).map((p: any) => p.id);

        if (projectIds.length > 0) {
            const { data } = await supabase
                .from("gifts")
                .select("*")
                .in("project_id", projectIds)
                .order("created_at", { ascending: false });
            gifts = data || [];
        }
    }

    const totalAmount = gifts.reduce((sum: number, g: any) => sum + (g.amount || 0), 0);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>🎁 Quà tặng</h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{gifts.length} món quà</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                <div style={{ background: "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(192,132,252,0.08))", borderRadius: 16, padding: 24, border: "1px solid rgba(192,132,252,0.15)", textAlign: "center" }}>
                    <p style={{ fontSize: 32, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>{totalAmount.toLocaleString("vi-VN")}₫</p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>💰 Tổng nhận</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8e8ec", textAlign: "center" }}>
                    <p style={{ fontSize: 32, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>{gifts.length}</p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>🎁 Tổng quà</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8e8ec", textAlign: "center" }}>
                    <p style={{ fontSize: 32, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>{gifts.length > 0 ? Math.round(totalAmount / gifts.length).toLocaleString("vi-VN") : 0}₫</p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>📊 Trung bình</p>
                </div>
            </div>

            {/* Gift List */}
            {gifts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 24px", background: "#f9fafb", borderRadius: 16 }}>
                    <p style={{ fontSize: 36, marginBottom: 8 }}>🎁</p>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Chưa có quà tặng nào.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {gifts.map((gift) => (
                        <div key={gift.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8ec", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎁</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{gift.guest_name}</span>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>+{(gift.amount || 0).toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>{gift.message || "Không có lời nhắn"} · {gift.method === "bank" ? "🏦 CK" : "💵 Mặt"}</span>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(gift.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
