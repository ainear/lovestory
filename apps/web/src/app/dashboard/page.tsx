import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            {/* Welcome Card */}
            <div
                style={{
                    background: "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(192,132,252,0.08))",
                    borderRadius: 20,
                    padding: "28px 32px",
                    marginBottom: 28,
                    border: "1px solid rgba(192,132,252,0.15)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            color: "#fff",
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#1f2937" }}>
                            Chào {user?.user_metadata?.full_name || user?.email?.split("@")[0]}! 👋
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>
                            Bắt đầu tạo thiệp cưới đẹp với LoveStory
                        </p>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                        <span
                            style={{
                                padding: "6px 16px",
                                borderRadius: 20,
                                background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                                color: "#0369a1",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            ⭐ Free Plan
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 16 }}>
                📈 Thống kê sử dụng
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
                <StatCard icon="🌐" label="Thiệp đã tạo" value={0} max={1} color="#3b82f6" />
                <StatCard icon="📸" label="Hình ảnh" value={0} max={10} color="#8b5cf6" />
                <StatCard icon="👁️" label="Lượt xem" value={0} max={300} color="#ec4899" />
            </div>

            {/* Quick Actions */}
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 16 }}>
                🚀 Bắt đầu nhanh
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                <ActionCard
                    icon="✏️"
                    title="Tạo thiệp mới"
                    description="Chọn mẫu và bắt đầu thiết kế thiệp cưới"
                    href="/templates"
                    gradient="linear-gradient(135deg, #ff6b9d, #c084fc)"
                />
                <ActionCard
                    icon="🎬"
                    title="Tạo video AI"
                    description="Upload ảnh và tạo video cinematic bằng AI"
                    href="/dashboard/video"
                    gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
                />
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    max,
    color,
}: {
    icon: string;
    label: string;
    value: number;
    max: number;
    color: string;
}) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #e8e8ec",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: "0 0 8px" }}>
                {value} <span style={{ fontSize: 14, fontWeight: 400, color: "#9ca3af" }}>/ {max}</span>
            </p>
            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 3, background: "#f3f4f6" }}>
                <div
                    style={{
                        height: "100%",
                        borderRadius: 3,
                        background: color,
                        width: `${Math.min(percentage, 100)}%`,
                        transition: "width 0.5s ease",
                    }}
                />
            </div>
        </div>
    );
}

function ActionCard({
    icon,
    title,
    description,
    href,
    gradient,
}: {
    icon: string;
    title: string;
    description: string;
    href: string;
    gradient: string;
}) {
    return (
        <a
            href={href}
            style={{
                display: "block",
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #e8e8ec",
                textDecoration: "none",
                transition: "all 0.2s",
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    marginBottom: 12,
                }}
            >
                {icon}
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>{title}</h4>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{description}</p>
        </a>
    );
}
