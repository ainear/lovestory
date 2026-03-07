import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardNav } from "./_components/DashboardNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Load real subscription
    const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();
    const planLabel = sub?.plan === "premium" ? "👑 Premium" : sub?.plan === "basic" ? "⭐ Basic" : "🆓 Free";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7" }}>
            {/* Mobile Toggle */}
            <input type="checkbox" id="sidebar-toggle" />
            <label htmlFor="sidebar-toggle" className="mobile-hamburger">☰</label>
            <label htmlFor="sidebar-toggle" className="sidebar-overlay" />

            {/* Sidebar */}
            <aside
                className="dashboard-sidebar"
                style={{
                    width: 260,
                    background: "#fff",
                    borderRight: "1px solid #e8e8ec",
                    padding: "20px 0",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    zIndex: 40,
                }}
            >
                {/* Logo */}
                <div style={{ padding: "0 24px", marginBottom: 28 }}>
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>
                        <h1
                            style={{
                                fontSize: 26,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                margin: 0,
                                letterSpacing: -0.5,
                            }}
                        >
                            ❤️ LoveStory
                        </h1>
                    </Link>
                </div>

                {/* Nav */}
                <DashboardNav />

                {/* User Card */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid #e8e8ec" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "#f9fafb",
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 14,
                                flexShrink: 0,
                            }}
                        >
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user.user_metadata?.full_name || user.email?.split("@")[0]}
                            </p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {planLabel}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logout + Admin */}
                <div style={{ padding: "12px 16px", borderTop: "1px solid #e8e8ec" }}>
                    {user.email === process.env.ADMIN_EMAIL && (
                        <Link href="/admin" style={{ display: "block", padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#f43f5e", textDecoration: "none", marginBottom: 6, fontWeight: 600 }}>
                            🛡️ Admin Panel
                        </Link>
                    )}
                    <form action="/auth/signout" method="GET">
                        <button type="submit" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff5f5", color: "#ef4444", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                            🚪 Đăng xuất
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className="dashboard-main"
                style={{
                    flex: 1,
                    marginLeft: 260,
                    padding: "28px 32px",
                    minHeight: "100vh",
                }}
            >
                {children}
            </main>
        </div>
    );
}
