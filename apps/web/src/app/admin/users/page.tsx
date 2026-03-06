import { createClient as createServerClient } from "@supabase/supabase-js";
import type { Subscription } from "@/types/database";

export default async function AdminUsersPage() {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get users from auth.users via admin API
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 50 });
    const users = authData?.users || [];

    // Get subscriptions for all users
    const { data: subs } = await supabase.from("subscriptions").select("*");
    const subMap = new Map((subs || []).map((s: Subscription) => [s.user_id, s]));

    // Get project counts
    const { data: projects } = await supabase.from("projects").select("user_id");
    const projectCounts = new Map<string, number>();
    (projects || []).forEach((p: { user_id: string }) => {
        projectCounts.set(p.user_id, (projectCounts.get(p.user_id) || 0) + 1);
    });

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>👥 Quản lý Users</h2>
                <span style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 13, fontWeight: 600 }}>
                    {users.length} users
                </span>
            </div>

            <div style={{ background: "#1e293b", borderRadius: 14, border: "1px solid #334155", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #334155" }}>
                            {["Avatar", "Email", "Tên", "Gói", "Thiệp", "Provider", "Đăng ký"].map((h) => (
                                <th key={h} style={{ padding: "12px 14px", fontSize: 11, color: "#64748b", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const sub = subMap.get(user.id) as Subscription | undefined;
                            const plan = sub?.plan || "free";
                            const projectCount = projectCounts.get(user.id) || 0;
                            const avatar = user.user_metadata?.avatar_url;
                            const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
                            const provider = user.app_metadata?.provider || "email";

                            return (
                                <tr key={user.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                    <td style={{ padding: "10px 14px" }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: avatar ? `url(${avatar}) center/cover` : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700,
                                        }}>
                                            {!avatar && (name[0]?.toUpperCase() || "?")}
                                        </div>
                                    </td>
                                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#e2e8f0" }}>{user.email}</td>
                                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#cbd5e1" }}>{name}</td>
                                    <td style={{ padding: "10px 14px" }}>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                            color: plan === "premium" ? "#f59e0b" : plan === "basic" ? "#8b5cf6" : "#64748b",
                                            background: plan === "premium" ? "rgba(245,158,11,0.15)" : plan === "basic" ? "rgba(139,92,246,0.15)" : "rgba(100,116,139,0.15)",
                                        }}>
                                            {plan === "premium" ? "👑 Premium" : plan === "basic" ? "⭐ Basic" : "🆓 Free"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#e2e8f0" }}>{projectCount}</td>
                                    <td style={{ padding: "10px 14px" }}>
                                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: "rgba(100,116,139,0.2)", color: "#94a3b8" }}>
                                            {provider}
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#64748b" }}>
                                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                                    </td>
                                </tr>
                            );
                        })}
                        {users.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#64748b" }}>Chưa có users</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
