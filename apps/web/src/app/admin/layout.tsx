import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@7app.online").trim();

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Guard: must be logged in AND be admin
    if (!user || user.email !== ADMIN_EMAIL) {
        redirect("/dashboard");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
            {/* Admin Sidebar */}
            <aside
                style={{
                    width: 240,
                    background: "#1e293b",
                    borderRight: "1px solid #334155",
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
                <div style={{ padding: "0 20px", marginBottom: 28 }}>
                    <Link href="/admin" style={{ textDecoration: "none" }}>
                        <h1
                            style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: "#f43f5e",
                                margin: 0,
                                letterSpacing: -0.5,
                            }}
                        >
                            🛡️ Admin Panel
                        </h1>
                    </Link>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>LoveStory Management</p>
                </div>

                <nav style={{ flex: 1, padding: "0 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                    <AdminNavItem href="/admin" icon="📊" label="Dashboard" />
                    <AdminNavItem href="/admin/users" icon="👥" label="Users" />
                    <AdminNavItem href="/admin/orders" icon="💳" label="Đơn hàng" />
                    <AdminNavItem href="/admin/projects" icon="💌" label="Thiệp" />
                    <AdminNavItem href="/admin/blog" icon="📝" label="Blog Posts" />
                    <AdminNavItem href="/admin/logs" icon="📋" label="Activity Logs" />

                    <div style={{ marginTop: "auto", padding: "16px 12px", borderTop: "1px solid #334155" }}>
                        <Link href="/dashboard" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                            ← Về Dashboard
                        </Link>
                    </div>
                </nav>
            </aside>

            <main
                style={{
                    flex: 1,
                    marginLeft: 240,
                    padding: "28px 32px",
                    minHeight: "100vh",
                    color: "#e2e8f0",
                }}
            >
                {children}
            </main>
        </div>
    );
}

function AdminNavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 14,
                color: "#cbd5e1",
                textDecoration: "none",
            }}
        >
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
