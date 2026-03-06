import { createClient } from "@/lib/supabase/server";
import type { Wish } from "@/types/database";

export default async function WishesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let wishes: Wish[] = [];
    if (user) {
        // Get user's project IDs first
        const { data: projects } = await supabase
            .from("projects")
            .select("id")
            .eq("user_id", user.id);
        const projectIds = (projects || []).map((p) => p.id);

        if (projectIds.length > 0) {
            const { data } = await supabase
                .from("wishes")
                .select("*")
                .in("project_id", projectIds)
                .order("created_at", { ascending: false });
            wishes = data || [];
        }
    }

    const todayCount = wishes.filter((w) => new Date(w.created_at).toDateString() === new Date().toDateString()).length;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>💬 Lời chúc</h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{wishes.length} lời chúc từ khách mời</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                    { icon: "💬", label: "Tổng", value: wishes.length },
                    { icon: "❤️", label: "Yêu thích", value: wishes.filter((w) => w.emoji === "❤️").length },
                    { icon: "🎉", label: "Chúc mừng", value: wishes.filter((w) => w.emoji === "🎉").length },
                    { icon: "📅", label: "Hôm nay", value: todayCount },
                ].map((s, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e8e8ec", textAlign: "center" }}>
                        <p style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 2px" }}>{s.value}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{s.icon} {s.label}</p>
                    </div>
                ))}
            </div>

            {/* Wishes List */}
            {wishes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 24px", background: "#f9fafb", borderRadius: 16 }}>
                    <p style={{ fontSize: 36, marginBottom: 8 }}>💬</p>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Chưa có lời chúc nào. Chia sẻ link thiệp để nhận lời chúc!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {wishes.map((wish) => (
                        <div
                            key={wish.id}
                            style={{
                                background: "#fff",
                                borderRadius: 14,
                                border: "1px solid #e8e8ec",
                                padding: 20,
                                display: "flex",
                                gap: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    flexShrink: 0,
                                }}
                            >
                                {wish.emoji || "❤️"}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{wish.guest_name}</span>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                        {new Date(wish.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                                <p style={{ fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>{wish.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
