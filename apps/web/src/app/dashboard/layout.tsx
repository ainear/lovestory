import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardNav } from "./_components/DashboardNav";
import { ThemeToggle } from "./_components/ThemeToggle";

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
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--dash-bg)" }}>
            {/* Mobile Toggle */}
            <input type="checkbox" id="sidebar-toggle" />
            <label htmlFor="sidebar-toggle" className="mobile-hamburger">☰</label>
            <label htmlFor="sidebar-toggle" className="sidebar-overlay" />

            {/* Sidebar */}
            <aside
                className="dashboard-sidebar"
                style={{
                    width: 260,
                    background: "var(--dash-sidebar)",
                    borderRight: "1px solid var(--dash-border)",
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
                {/* Logo + Theme Toggle */}
                <div style={{ padding: "0 24px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                    <ThemeToggle />
                </div>

                {/* Nav */}
                <DashboardNav />

                {/* User Card */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid var(--dash-border)" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "var(--dash-user-bg)",
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
                            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dash-text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user.user_metadata?.full_name || user.email?.split("@")[0]}
                            </p>
                            <p style={{ fontSize: 11, color: "var(--dash-text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {planLabel}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logout + Admin */}
                <div style={{ padding: "12px 16px", borderTop: "1px solid var(--dash-border)" }}>
                    {user.email === process.env.ADMIN_EMAIL && (
                        <Link href="/admin" style={{ display: "block", padding: "8px 12px", borderRadius: 8, fontSize: 12, color: "#f43f5e", textDecoration: "none", marginBottom: 6, fontWeight: 600 }}>
                            🛡️ Admin Panel
                        </Link>
                    )}
                    <form action="/auth/signout" method="GET">
                        <button type="submit" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--dash-danger-border)", background: "var(--dash-danger-bg)", color: "var(--dash-danger-text)", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
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
