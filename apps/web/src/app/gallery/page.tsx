import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Khám phá thiệp cưới — LoveStory",
    description: "Khám phá những thiệp cưới đẹp nhất được tạo bởi LoveStory. Tìm cảm hứng cho ngày trọng đại của bạn.",
};

export const revalidate = 300; // 5 min cache

export default async function GalleryPage() {
    const supabase = await createClient();

    // Load published invitations for public showcase
    const { data: invitations } = await supabase
        .from("projects")
        .select("id, slug, groom_name, bride_name, wedding_date, template, cover_image, view_count")
        .eq("status", "published")
        .order("view_count", { ascending: false })
        .limit(24);

    const cards = invitations || [];

    const TEMPLATE_COLORS: Record<string, string> = {
        "rose-garden": "linear-gradient(135deg, #fce7f3, #ffe4e6)",
        "midnight-romance": "linear-gradient(135deg, #1e1b4b, #312e81)",
        "golden-hour": "linear-gradient(135deg, #fef3c7, #fde68a)",
        "forest-green": "linear-gradient(135deg, #d1fae5, #a7f3d0)",
        "ocean-blue": "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        "classic-red": "linear-gradient(135deg, #fee2e2, #fecaca)",
        "lavender-dream": "linear-gradient(135deg, #ede9fe, #ddd6fe)",
        "peach-blossom": "linear-gradient(135deg, #ffedd5, #fed7aa)",
    };

    const TEMPLATE_ACCENT: Record<string, string> = {
        "rose-garden": "#ec4899",
        "midnight-romance": "#a78bfa",
        "golden-hour": "#d97706",
        "forest-green": "#059669",
        "ocean-blue": "#3b82f6",
        "classic-red": "#dc2626",
        "lavender-dream": "#7c3aed",
        "peach-blossom": "#ea580c",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
            {/* Header */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                        <span style={{ fontSize: 22 }}>💕</span>
                        <span style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            LoveStory
                        </span>
                    </Link>
                    <div style={{ display: "flex", gap: 12 }}>
                        <Link href="/templates" style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                            Mẫu thiệp
                        </Link>
                        <Link href="/login" style={{ padding: "8px 20px", borderRadius: 8, background: "linear-gradient(135deg, #ff6b9d, #c084fc)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                            Tạo thiệp miễn phí
                        </Link>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
                {/* Headline */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ fontSize: 12, color: "#ec4899", fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 12px" }}>
                        ✨ Inspired by Love
                    </p>
                    <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1f2937", margin: "0 0 12px", lineHeight: 1.2 }}>
                        Khám phá thiệp cưới <br />
                        <span style={{ background: "linear-gradient(135deg, #ff6b9d, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            được yêu thích nhất
                        </span>
                    </h1>
                    <p style={{ fontSize: 16, color: "#6b7280", margin: 0 }}>
                        Tìm cảm hứng từ {cards.length > 0 ? `${cards.length}+ ` : ""}thiệp cưới thực tế được tạo bởi cộng đồng LoveStory
                    </p>
                </div>

                {cards.length === 0 ? (
                    /* Empty State */
                    <div style={{ textAlign: "center", padding: "80px 24px" }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>💌</div>
                        <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1f2937", margin: "0 0 8px" }}>Chưa có thiệp nào</h2>
                        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>Hãy là người đầu tiên tạo và chia sẻ thiệp cưới của bạn!</p>
                        <Link href="/templates" style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "12px 28px", borderRadius: 12,
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none",
                            boxShadow: "0 8px 24px rgba(255,107,157,0.3)",
                        }}>
                            Tạo thiệp ngay
                        </Link>
                    </div>
                ) : (
                    /* Gallery Grid */
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                        {cards.map((inv) => {
                            const bg = TEMPLATE_COLORS[inv.template] || TEMPLATE_COLORS["rose-garden"];
                            const accent = TEMPLATE_ACCENT[inv.template] || "#ec4899";
                            const names = [inv.groom_name, inv.bride_name].filter(Boolean).join(" & ") || "Cặp đôi";
                            const date = inv.wedding_date
                                ? new Date(inv.wedding_date).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })
                                : "";
                            return (
                                <Link key={inv.id} href={`/i/${inv.slug}`} target="_blank"
                                    style={{ textDecoration: "none", display: "block", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s", background: "#fff" }}>
                                    {/* Card preview */}
                                    <div style={{ height: 200, background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                                        {inv.cover_image ? (
                                            <Image
                                                src={inv.cover_image!}
                                                alt={names}
                                                width={400}
                                                height={200}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                priority={false}
                                            />
                                        ) : (
                                            <div style={{ textAlign: "center", padding: 24 }}>
                                                <p style={{ fontSize: 11, color: accent, letterSpacing: 3, margin: "0 0 8px", fontWeight: 600 }}>SAVE THE DATE</p>
                                                <p style={{ fontSize: 20, color: accent, fontStyle: "italic", margin: 0, fontWeight: 300 }}>{names}</p>
                                                {date && <p style={{ fontSize: 11, color: accent, margin: "8px 0 0", opacity: 0.7 }}>{date}</p>}
                                            </div>
                                        )}
                                        {/* View count badge */}
                                        {(inv.view_count || 0) > 10 && (
                                            <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: "3px 8px", fontSize: 10, color: "#fff", backdropFilter: "blur(4px)" }}>
                                                👁️ {inv.view_count}
                                            </div>
                                        )}
                                    </div>
                                    {/* Card footer */}
                                    <div style={{ padding: "14px 16px", borderTop: "1px solid #f3f4f6" }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {names}
                                        </p>
                                        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{date || "Ngày trọng đại"}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                <div style={{
                    marginTop: 64, textAlign: "center",
                    padding: 48, borderRadius: 24,
                    background: "linear-gradient(135deg, rgba(255,107,157,0.06), rgba(192,132,252,0.06))",
                    border: "1px solid rgba(192,132,252,0.15)",
                }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 8px" }}>
                        Sẵn sàng tạo thiệp của bạn?
                    </h2>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>
                        Miễn phí • Không cần thẻ tín dụng • Xuất bản ngay
                    </p>
                    <Link href="/login" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "14px 32px", borderRadius: 14,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none",
                        boxShadow: "0 8px 32px rgba(255,107,157,0.35)",
                    }}>
                        💌 Tạo thiệp cưới miễn phí
                    </Link>
                </div>
            </div>
        </div>
    );
}
