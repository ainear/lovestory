import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const STYLE_LABELS: Record<string, string> = {
    cinematic: "🎬 Cinematic",
    romantic: "💕 Romantic",
    vintage: "🎞️ Vintage",
    modern: "✨ Modern",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "Chờ", color: "#6b7280", bg: "#f3f4f6" },
    processing: { label: "Đang xử lý", color: "#f59e0b", bg: "#fffbeb" },
    encoding: { label: "Encoding", color: "#3b82f6", bg: "#eff6ff" },
    complete: { label: "Hoàn thành", color: "#10b981", bg: "#ecfdf5" },
    failed: { label: "Lỗi", color: "#ef4444", bg: "#fef2f2" },
};

export default async function VideosPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: videos } = await supabase
        .from("videos")
        .select("id, template_preset, status, progress, thumbnail_url, output_url, duration_seconds, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

    const list = videos || [];

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>🎬 Video của tôi</h2>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Quản lý và tải về các video AI đã tạo</p>
                </div>
                <Link
                    href="/ai-video"
                    style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                    }}
                >
                    + Tạo video mới
                </Link>
            </div>

            {/* Empty state */}
            {list.length === 0 && (
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "60px 40px",
                    textAlign: "center",
                    border: "1px solid #e8e8ec",
                }}>
                    <p style={{ fontSize: 56, margin: "0 0 16px" }}>🎬</p>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 8px" }}>Chưa có video nào</h3>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>
                        Hãy tạo video AI đầu tiên của bạn — chỉ cần upload 3+ ảnh và AI sẽ làm phần còn lại!
                    </p>
                    <Link
                        href="/ai-video"
                        style={{
                            display: "inline-block",
                            padding: "12px 28px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        🎬 Tạo AI Video ngay
                    </Link>
                </div>
            )}

            {/* Video Grid */}
            {list.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                    {list.map((video) => {
                        const s = STATUS_CONFIG[video.status] || STATUS_CONFIG.pending;
                        const style = STYLE_LABELS[video.template_preset] || video.template_preset;
                        const date = new Date(video.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                        });

                        return (
                            <div
                                key={video.id}
                                style={{
                                    background: "#fff",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    border: "1px solid #e8e8ec",
                                    transition: "box-shadow 0.2s",
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    position: "relative",
                                    aspectRatio: "16/9",
                                    background: "linear-gradient(135deg, #0f0c29, #302b63)",
                                    overflow: "hidden",
                                }}>
                                    {video.thumbnail_url ? (
                                        <img
                                            src={video.thumbnail_url}
                                            alt="Video thumbnail"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "100%",
                                            flexDirection: "column",
                                            gap: 8,
                                        }}>
                                            {video.status === "processing" || video.status === "encoding" ? (
                                                <>
                                                    <div style={{
                                                        width: 40, height: 40, borderRadius: "50%",
                                                        border: "3px solid rgba(255,255,255,0.3)",
                                                        borderTopColor: "#fff",
                                                        animation: "spin 1s linear infinite",
                                                    }} />
                                                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: 0 }}>
                                                        {video.progress}%
                                                    </p>
                                                </>
                                            ) : (
                                                <p style={{ fontSize: 36, margin: 0 }}>🎬</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Progress bar for processing */}
                                    {(video.status === "processing" || video.status === "encoding") && (
                                        <div style={{
                                            position: "absolute", bottom: 0, left: 0, right: 0,
                                            height: 3, background: "rgba(255,255,255,0.2)",
                                        }}>
                                            <div style={{
                                                height: "100%", width: `${video.progress}%`,
                                                background: "linear-gradient(90deg, #ff6b9d, #c084fc)",
                                                transition: "width 0.5s",
                                            }} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{style}</span>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600,
                                            color: s.color, background: s.bg,
                                            padding: "2px 8px", borderRadius: 6,
                                        }}>
                                            {s.label}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>
                                        {date}
                                        {video.duration_seconds ? ` · ${video.duration_seconds}s` : ""}
                                    </p>

                                    {/* Actions */}
                                    {video.status === "complete" && video.output_url && (
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <a
                                                href={video.output_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                                    color: "#fff", textDecoration: "none", textAlign: "center",
                                                }}
                                            >
                                                ▶️ Xem
                                            </a>
                                            <a
                                                href={video.output_url}
                                                download
                                                style={{
                                                    flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                                    background: "#f3f4f6", color: "#374151",
                                                    textDecoration: "none", textAlign: "center",
                                                }}
                                            >
                                                ⬇️ Tải
                                            </a>
                                        </div>
                                    )}
                                    {video.status === "failed" && (
                                        <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>
                                            ❌ Tạo video thất bại. <Link href="/ai-video" style={{ color: "#c084fc" }}>Thử lại</Link>
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    div[style*="repeat(auto-fill"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
