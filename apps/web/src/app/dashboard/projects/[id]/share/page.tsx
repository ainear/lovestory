"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function SharePage() {
    const params = useParams();
    const projectId = params.id as string;
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("projects")
                .select("*")
                .eq("id", projectId)
                .single();
            setProject(data);
            setLoading(false);
        }
        load();
    }, [projectId]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7" }}>
                ⏳ Đang tải...
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7" }}>
                ❌ Không tìm thấy thiệp
            </div>
        );
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = `${baseUrl}/i/${project.slug}`;
    const title = `${project.groom_name || "Chú rể"} & ${project.bride_name || "Cô dâu"}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inviteUrl)}&bgcolor=ffffff&color=831843`;

    function copyLink() {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function shareNative() {
        if (navigator.share) {
            navigator.share({
                title: `Thiệp mời: ${title}`,
                text: `Trân trọng kính mời bạn đến dự lễ cưới của ${title}`,
                url: inviteUrl,
            });
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf2f8, #fce7f3, #fff1f2)", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Header */}
            <div style={{ padding: "24px", maxWidth: 600, margin: "0 auto" }}>
                <Link href="/dashboard/projects" style={{ color: "#be185d", textDecoration: "none", fontSize: 13, display: "inline-flex", gap: 6 }}>
                    ← Về thiệp của tôi
                </Link>
            </div>

            {/* Share Card */}
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 60px" }}>
                <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    {/* Title */}
                    <div style={{ background: "linear-gradient(135deg, #831843, #be185d)", padding: "32px 28px", textAlign: "center" }}>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 3, margin: "0 0 8px" }}>
                            Chia sẻ thiệp mời
                        </p>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
                            💌 {title}
                        </h1>
                        {project.wedding_date && (
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
                                📅 {new Date(project.wedding_date).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        )}
                    </div>

                    {/* QR Code */}
                    <div style={{ padding: "32px 28px", textAlign: "center" }}>
                        <div style={{ display: "inline-block", padding: 16, background: "#fff", borderRadius: 16, border: "2px solid #fce7f3", boxShadow: "0 4px 20px rgba(190,24,93,0.08)" }}>
                            <img src={qrUrl} alt="QR Code" width={200} height={200} style={{ display: "block", borderRadius: 8 }} />
                        </div>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
                            Quét mã QR để xem thiệp mời
                        </p>
                    </div>

                    {/* Link */}
                    <div style={{ padding: "0 28px 24px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                readOnly
                                value={inviteUrl}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                    color: "#374151",
                                    background: "#f9fafb",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={copyLink}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: 12,
                                    border: "none",
                                    background: copied ? "#059669" : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s",
                                }}
                            >
                                {copied ? "✅ Đã copy!" : "📋 Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <div style={{ padding: "0 28px 32px" }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
                            Chia sẻ qua
                        </p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {/* Native Share */}
                            <button
                                onClick={shareNative}
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                    background: "#fff",
                                    fontSize: 13,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    color: "#374151",
                                }}
                            >
                                📤 Chia sẻ
                            </button>

                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`}
                                target="_blank"
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 12,
                                    background: "#1877f2",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                📘 Facebook
                            </a>

                            {/* Zalo */}
                            <a
                                href={`https://zalo.me/share?url=${encodeURIComponent(inviteUrl)}`}
                                target="_blank"
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 12,
                                    background: "#0068ff",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                💬 Zalo
                            </a>

                            {/* Messenger */}
                            <a
                                href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(inviteUrl)}&app_id=0&redirect_uri=${encodeURIComponent(inviteUrl)}`}
                                target="_blank"
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #00c6ff, #0078ff)",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                💬 Messenger
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ padding: "20px 28px", background: "#f9fafb", borderTop: "1px solid #f3f4f6", display: "flex", gap: 24, justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 20, fontWeight: 700, color: "#831843", margin: 0 }}>{project.view_count || 0}</p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Lượt xem</p>
                        </div>
                        <div style={{ width: 1, background: "#e5e7eb" }} />
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 20, fontWeight: 700, color: "#831843", margin: 0 }}>{project.status === "published" ? "🟢" : "📝"}</p>
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{project.status === "published" ? "Đã xuất bản" : "Bản nháp"}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                    <Link
                        href={`/i/${project.slug}`}
                        target="_blank"
                        style={{
                            flex: 1,
                            padding: "14px 24px",
                            borderRadius: 14,
                            background: "#fff",
                            color: "#831843",
                            fontSize: 14,
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                            border: "1px solid #fce7f3",
                        }}
                    >
                        👁️ Xem thiệp
                    </Link>
                    <Link
                        href={`/editor/${project.id}`}
                        style={{
                            flex: 1,
                            padding: "14px 24px",
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                        }}
                    >
                        ✏️ Chỉnh sửa
                    </Link>
                </div>
            </div>
        </div>
    );
}
