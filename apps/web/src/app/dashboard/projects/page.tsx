import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

const STATUS_MAP = {
    draft: { label: "Bản nháp", color: "#9ca3af", bg: "#f3f4f6" },
    published: { label: "Đã xuất bản", color: "#059669", bg: "#ecfdf5" },
    archived: { label: "Lưu trữ", color: "#d97706", bg: "#fffbeb" },
};

export default async function ProjectsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let projects: any[] = [];
    if (user) {
        const { data } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        projects = data || [];
    }

    // Load RSVP/wish counts per project
    const projectsWithCounts = await Promise.all(
        projects.map(async (p) => {
            const [{ count: rsvpCount }, { count: wishCount }] = await Promise.all([
                supabase.from("rsvps").select("*", { count: "exact", head: true }).eq("project_id", p.id),
                supabase.from("wishes").select("*", { count: "exact", head: true }).eq("project_id", p.id),
            ]);
            return { ...p, rsvpCount: rsvpCount || 0, wishCount: wishCount || 0 };
        })
    );

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0 }}>💌 Thiệp của tôi</h2>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{projects.length} thiệp</p>
                </div>
                <Link
                    href="/templates"
                    style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    ✨ Tạo thiệp mới
                </Link>
            </div>

            {projectsWithCounts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px" }}>
                    <p style={{ fontSize: 48, marginBottom: 16 }}>💌</p>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", margin: "0 0 8px" }}>Chưa có thiệp nào</h3>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>Bắt đầu tạo thiệp cưới đầu tiên</p>
                    <Link
                        href="/templates"
                        style={{
                            display: "inline-block",
                            padding: "12px 24px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        🎨 Chọn mẫu thiệp
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {projectsWithCounts.map((project) => {
                        const statusInfo = STATUS_MAP[project.status as keyof typeof STATUS_MAP] || STATUS_MAP.draft;
                        return (
                            <div
                                key={project.id}
                                style={{
                                    background: "#fff",
                                    borderRadius: 16,
                                    border: "1px solid #e8e8ec",
                                    padding: 24,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 20,
                                }}
                            >
                                <div
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 14,
                                        background: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 32,
                                        flexShrink: 0,
                                    }}
                                >
                                    🌹
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: 0 }}>{project.title}</h3>
                                        <span
                                            style={{
                                                padding: "2px 10px",
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: statusInfo.color,
                                                background: statusInfo.bg,
                                            }}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 8px" }}>
                                        {project.groom_name && project.bride_name
                                            ? `${project.groom_name} & ${project.bride_name}`
                                            : "Chưa nhập tên"}{" "}
                                        · {new Date(project.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                    <div style={{ display: "flex", gap: 16 }}>
                                        <span style={{ fontSize: 13, color: "#6b7280" }}>👁️ {project.view_count} lượt xem</span>
                                        <span style={{ fontSize: 13, color: "#6b7280" }}>✅ {project.rsvpCount} RSVP</span>
                                        <span style={{ fontSize: 13, color: "#6b7280" }}>💬 {project.wishCount} lời chúc</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                    {project.status === "published" && (
                                        <>
                                            <Link
                                                href={`/i/${project.slug}`}
                                                target="_blank"
                                                style={{
                                                    padding: "8px 14px",
                                                    borderRadius: 8,
                                                    border: "1px solid #e5e7eb",
                                                    background: "#fff",
                                                    color: "#6b7280",
                                                    fontSize: 12,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                👁️ Xem
                                            </Link>
                                            <Link
                                                href={`/dashboard/projects/${project.id}/share`}
                                                style={{
                                                    padding: "8px 14px",
                                                    borderRadius: 8,
                                                    border: "1px solid #fce7f3",
                                                    background: "#fff5f8",
                                                    color: "#be185d",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                📤 Share
                                            </Link>
                                        </>
                                    )}
                                    <Link
                                        href={`/editor/${project.id}`}
                                        style={{
                                            padding: "8px 14px",
                                            borderRadius: 8,
                                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            textDecoration: "none",
                                        }}
                                    >
                                        ✏️ Sửa
                                    </Link>
                                    <DeleteButton projectId={project.id} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
