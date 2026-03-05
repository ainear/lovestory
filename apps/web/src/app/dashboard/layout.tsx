import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7" }}>
            {/* Sidebar */}
            <aside
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
                <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                    <NavGroup label="HOME">
                        <NavItem href="/dashboard" icon="📊" label="Tổng quan" />
                        <NavItem href="/dashboard/my-plan" icon="⭐" label="Gói dịch vụ" />
                        <NavItem href="/templates" icon="✏️" label="Tạo thiết kế" />
                    </NavGroup>

                    <NavGroup label="THIỆP CỦA TÔI">
                        <NavItem href="/dashboard/projects" icon="💌" label="Thiệp online" />
                    </NavGroup>

                    <NavGroup label="KHÁCH MỜI">
                        <NavItem href="/dashboard/wishes" icon="💬" label="Lời chúc" />
                        <NavItem href="/dashboard/rsvp" icon="✅" label="Xác nhận tham dự" />
                        <NavItem href="/dashboard/gifts" icon="🎁" label="Quà tặng" />
                    </NavGroup>

                    <NavGroup label="TÀI KHOẢN">
                        <NavItem href="/dashboard/profile" icon="👤" label="Thông tin cá nhân" />
                    </NavGroup>
                </nav>

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
                            <p
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#1f2937",
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {user.user_metadata?.full_name || user.email?.split("@")[0]}
                            </p>
                            <p
                                style={{
                                    fontSize: 11,
                                    color: "#9ca3af",
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Free Plan
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
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

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <p
                style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#b0b0bb",
                    letterSpacing: 1.2,
                    margin: "0 0 6px 12px",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>{children}</div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 10,
                fontSize: 14,
                color: "#4b5563",
                textDecoration: "none",
                transition: "all 0.15s",
            }}
        >
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
