import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f0f2f5",
                fontFamily: "'Inter', -apple-system, sans-serif",
            }}
        >
            {/* Sidebar */}
            <aside
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 240,
                    height: "100vh",
                    background: "#fff",
                    borderRight: "1px solid #e5e7eb",
                    padding: "24px 16px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: 32,
                    }}
                >
                    ❤️ LoveStory
                </h1>

                <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <SidebarGroup label="HOME">
                        <SidebarLink href="/dashboard" icon="📊" label="Tổng quan" active />
                        <SidebarLink href="/dashboard/my-plan" icon="⭐" label="Gói dịch vụ" />
                        <SidebarLink href="/templates" icon="✏️" label="Tạo thiết kế" />
                    </SidebarGroup>

                    <SidebarGroup label="THIẾT KẾ CỦA TÔI">
                        <SidebarLink href="/pages" icon="💌" label="Thiệp online" />
                    </SidebarGroup>

                    <SidebarGroup label="QUÀ TẶNG & LỜI CHÚC">
                        <SidebarLink href="/dashboard/wishes" icon="💬" label="Lời chúc" />
                        <SidebarLink href="/dashboard/gifts" icon="🎁" label="Quà tặng" />
                    </SidebarGroup>

                    <SidebarGroup label="TÀI KHOẢN">
                        <SidebarLink href="/dashboard/profile" icon="👤" label="Thông tin cá nhân" />
                    </SidebarGroup>
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <form action="/auth/signout" method="POST">
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "10px 16px",
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                background: "transparent",
                                color: "#6b7280",
                                fontSize: 13,
                                cursor: "pointer",
                            }}
                        >
                            🚪 Đăng xuất
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: 240, padding: 32 }}>
                {/* User Card */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(255,107,157,0.1), rgba(192,132,252,0.1))",
                        borderRadius: 20,
                        padding: 32,
                        marginBottom: 32,
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            color: "#fff",
                            fontWeight: 700,
                        }}
                    >
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#1f2937" }}>
                            {user.user_metadata?.full_name || user.email?.split("@")[0]}
                        </h2>
                        <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: 14 }}>{user.email}</p>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "2px 10px",
                                borderRadius: 20,
                                background: "#e0f2fe",
                                color: "#0284c7",
                                fontSize: 12,
                                fontWeight: 600,
                                marginTop: 8,
                            }}
                        >
                            Free
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", marginBottom: 16 }}>
                    📈 Thống kê sử dụng
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    <StatCard icon="🌐" label="Website" value="0 / 1" />
                    <StatCard icon="📸" label="Hình ảnh" value="0 / 10" />
                    <StatCard icon="👁️" label="Lượt xem" value="0 / 300" />
                </div>
            </main>
        </div>
    );
}

function SidebarGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, margin: "0 0 8px 8px" }}>
                {label}
            </p>
            {children}
        </div>
    );
}

function SidebarLink({
    href,
    icon,
    label,
    active = false,
}: {
    href: string;
    icon: string;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 14,
                color: active ? "#fff" : "#4b5563",
                background: active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
            }}
        >
            <span>{icon}</span>
            {label}
        </Link>
    );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #e5e7eb",
            }}
        >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "4px 0 0" }}>{value}</p>
        </div>
    );
}
