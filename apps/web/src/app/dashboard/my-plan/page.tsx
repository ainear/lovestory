import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const PLAN_CONFIG = {
    free: { name: "🆓 Miễn phí", color: "#6b7280", bg: "#f3f4f6", price: "0₫", maxProjects: 1, maxPhotos: 10, features: ["1 thiệp online", "10 hình ảnh", "300 lượt xem", "Watermark LoveStory"] },
    basic: { name: "⭐ Basic", color: "#7c3aed", bg: "#f5f3ff", price: "199.000₫", maxProjects: 5, maxPhotos: 50, features: ["5 thiệp online", "50 hình ảnh", "Không giới hạn lượt xem", "Bỏ watermark", "Nhạc nền tùy chọn", "RSVP + Lời chúc"] },
    premium: { name: "👑 Premium", color: "#d97706", bg: "#fffbeb", price: "299.000₫", maxProjects: 999, maxPhotos: 100, features: ["Không giới hạn thiệp", "100 hình ảnh", "Mẫu Premium", "Video AI cinematic", "Tên miền riêng", "Hỗ trợ VIP 24/7"] },
};

export default async function MyPlanPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let currentPlan = "free";
    if (user) {
        const { data } = await supabase
            .from("subscriptions")
            .select("plan")
            .eq("user_id", user.id)
            .single();
        if (data) currentPlan = data.plan;
    }

    const plan = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 24px" }}>⭐ Gói dịch vụ</h2>

            {/* Current Plan */}
            <div style={{ background: "linear-gradient(135deg, rgba(255,107,157,0.06), rgba(192,132,252,0.06))", borderRadius: 20, padding: 32, border: "1px solid rgba(192,132,252,0.12)", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>Gói hiện tại</p>
                        <h3 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: 0 }}>{plan.name}</h3>
                    </div>
                    <span style={{ padding: "6px 16px", borderRadius: 10, fontSize: 14, fontWeight: 700, color: plan.color, background: plan.bg }}>{plan.price}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {plan.features.map((f, i) => (
                        <li key={i} style={{ fontSize: 13, color: "#4b5563", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#10b981" }}>✓</span> {f}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Upgrade */}
            {currentPlan === "free" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {(["basic", "premium"] as const).map((p) => {
                        const info = PLAN_CONFIG[p];
                        return (
                            <div key={p} style={{ background: "#fff", borderRadius: 16, border: p === "basic" ? "2px solid #c084fc" : "1px solid #e8e8ec", padding: 24, position: "relative" }}>
                                {p === "basic" && <div style={{ position: "absolute", top: -10, right: 16, padding: "3px 10px", borderRadius: 8, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff", fontSize: 10, fontWeight: 700 }}>🔥 PHỔ BIẾN</div>}
                                <p style={{ fontSize: 14, fontWeight: 600, color: info.color, margin: "0 0 4px" }}>{info.name}</p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: "#1f2937", margin: "0 0 16px" }}>{info.price}</p>
                                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                                    {info.features.map((f, i) => (
                                        <li key={i} style={{ fontSize: 12, color: "#4b5563" }}>✓ {f}</li>
                                    ))}
                                </ul>
                                <Link href="/checkout" style={{ display: "block", padding: "10px 16px", borderRadius: 10, background: p === "basic" ? "linear-gradient(135deg, #ff6b9d, #c084fc)" : "#fff", border: p === "basic" ? "none" : "1px solid #e5e7eb", color: p === "basic" ? "#fff" : "#374151", fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
                                    Chọn gói {info.name}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
