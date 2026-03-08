"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Seed template data (sẽ chuyển sang DB sau)
const TEMPLATES = [
    { id: "1", slug: "rose-garden", name: "Rose Garden", category: "wedding", tier: "basic" as const, color: "#ff6b9d", emoji: "🌹", pattern: "petals", usageCount: 1234, desc: "Hoa hồng lãng mạn, tone hồng nhẹ nhàng" },
    { id: "2", slug: "midnight-romance", name: "Midnight Romance", category: "wedding", tier: "premium" as const, color: "#6366f1", emoji: "🌙", pattern: "stars", usageCount: 897, desc: "Đêm tím huyền bí, sang trọng" },
    { id: "3", slug: "golden-hour", name: "Golden Hour", category: "wedding", tier: "basic" as const, color: "#f59e0b", emoji: "🌅", pattern: "bokeh", usageCount: 2045, desc: "Ánh vàng hoàng hôn, ấm áp" },
    { id: "4", slug: "cherry-blossom", name: "Cherry Blossom", category: "wedding", tier: "premium" as const, color: "#ec4899", emoji: "🌸", pattern: "petals", usageCount: 765, desc: "Hoa anh đào, dịu dàng Nhật Bản" },
    { id: "5", slug: "beach-sunset", name: "Beach Sunset", category: "wedding", tier: "basic" as const, color: "#0ea5e9", emoji: "🏖️", pattern: "waves", usageCount: 1567, desc: "Biển xanh, thoải mái và tươi trẻ" },
    { id: "6", slug: "vintage-love", name: "Vintage Love", category: "wedding", tier: "basic" as const, color: "#78716c", emoji: "📜", pattern: "lace", usageCount: 934, desc: "Cổ điển, tinh tế kiểu Châu Âu" },
    { id: "7", slug: "modern-minimalist", name: "Modern Minimalist", category: "wedding", tier: "premium" as const, color: "#1f2937", emoji: "◼️", pattern: "lines", usageCount: 1189, desc: "Tối giản, hiện đại, đẳng cấp" },
    { id: "8", slug: "tropical-paradise", name: "Tropical Paradise", category: "wedding", tier: "basic" as const, color: "#10b981", emoji: "🌴", pattern: "leaves", usageCount: 678, desc: "Nhiệt đới xanh mướt, tươi vui" },
    { id: "9", slug: "happy-birthday", name: "Happy Birthday", category: "birthday", tier: "basic" as const, color: "#f43f5e", emoji: "🎂", pattern: "confetti", usageCount: 2345, desc: "Rực rỡ, vui tươi sinh nhật" },
    { id: "10", slug: "graduation-cap", name: "Graduation Day", category: "graduation", tier: "basic" as const, color: "#8b5cf6", emoji: "🎓", pattern: "stars", usageCount: 456, desc: "Tốt nghiệp trang trọng" },
    { id: "11", slug: "party-night", name: "Party Night", category: "event", tier: "premium" as const, color: "#a855f7", emoji: "🎉", pattern: "confetti", usageCount: 789, desc: "Party sôi động ánh đèn neon" },
    { id: "12", slug: "lien-hoan", name: "Liên Hoan Gia Đình", category: "event", tier: "basic" as const, color: "#ef4444", emoji: "👨‍👩‍👧‍👦", pattern: "dots", usageCount: 321, desc: "Ấm áp, vui vẻ phong cách gia đình" },
    { id: "13", slug: "autumn-leaves", name: "Autumn Leaves", category: "wedding", tier: "basic" as const, color: "#d97706", emoji: "🍂", pattern: "leaves", usageCount: 412, desc: "Mùa thu lá vàng, ấm áp" },
    { id: "14", slug: "ocean-blue", name: "Ocean Blue", category: "wedding", tier: "premium" as const, color: "#0284c7", emoji: "🌊", pattern: "waves", usageCount: 583, desc: "Đại dương sâu thẳm, thanh lịch" },
    { id: "15", slug: "lavender-dream", name: "Lavender Dream", category: "wedding", tier: "basic" as const, color: "#9333ea", emoji: "💜", pattern: "petals", usageCount: 739, desc: "Hoa oải hương, mơ màng Pháp" },
    { id: "16", slug: "do-truyen-thong", name: "Đỏ Truyền Thống", category: "wedding", tier: "basic" as const, color: "#dc2626", emoji: "🏮", pattern: "dots", usageCount: 1102, desc: "Truyền thống Á Đông, đỏ may mắn" },
    { id: "17", slug: "forest-green", name: "Forest Green", category: "wedding", tier: "premium" as const, color: "#16a34a", emoji: "🌿", pattern: "leaves", usageCount: 298, desc: "Rừng xanh tươi, gần gũi thiên nhiên" },
    { id: "18", slug: "peach-blossom", name: "Peach Blossom", category: "wedding", tier: "basic" as const, color: "#fb923c", emoji: "🌼", pattern: "petals", usageCount: 867, desc: "Hoa đào mùa xuân nhẹ nhàng" },
    { id: "19", slug: "royal-navy", name: "Royal Navy", category: "event", tier: "premium" as const, color: "#1e3a5f", emoji: "👑", pattern: "stars", usageCount: 445, desc: "Hoàng gia sang trọng, uy nghiêm" },
    { id: "20", slug: "dusty-rose", name: "Dusty Rose", category: "wedding", tier: "basic" as const, color: "#be185d", emoji: "🥀", pattern: "lace", usageCount: 623, desc: "Hồng bụi, cổ điển romantique" },
    { id: "21", slug: "celebration-gold", name: "Celebration Gold", category: "event", tier: "premium" as const, color: "#ca8a04", emoji: "✨", pattern: "bokeh", usageCount: 511, desc: "Vàng rực rỡ, tiệc xa xỉ" },
    { id: "22", slug: "crystal-white", name: "Crystal White", category: "wedding", tier: "basic" as const, color: "#94a3b8", emoji: "💍", pattern: "lace", usageCount: 734, desc: "Trắng tinh khôi, thuần khiết" },
];

const CATEGORIES = [
    { key: "all", label: "Tất cả" },
    { key: "wedding", label: "💒 Đám cưới" },
    { key: "birthday", label: "🎂 Sinh nhật" },
    { key: "graduation", label: "🎓 Tốt nghiệp" },
    { key: "event", label: "🎉 Sự kiện" },
];

// Mini invitation card preview for modal
function InvitationCardPreview({ template }: { template: typeof TEMPLATES[0] }) {
    const patterns: Record<string, string> = {
        petals: "🌸🌺🌸🌺",
        stars: "✦ ✧ ✦ ✧",
        bokeh: "✦ • ✦",
        waves: "〰〰〰",
        lace: "✿ ❀ ✿",
        lines: "— — —",
        leaves: "🍃 🌿 🍃",
        confetti: "🎊 🎉 🎊",
        dots: "• • •",
    };

    const isDark = ["midnight-romance", "modern-minimalist", "royal-navy"].includes(template.slug);
    const bg = isDark
        ? `linear-gradient(160deg, ${template.color}cc 0%, #0f0c29 100%)`
        : `linear-gradient(160deg, ${template.color}18 0%, ${template.color}38 50%, ${template.color}15 100%)`;
    const textColor = isDark ? "#fff" : "#1f2937";
    const subColor = isDark ? "rgba(255,255,255,0.6)" : template.color;

    return (
        <div style={{
            background: bg,
            borderRadius: 16,
            padding: "28px 20px 20px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {/* Decorative top pattern */}
            <div style={{
                position: "absolute", top: 10, left: 0, right: 0,
                fontSize: 11, opacity: 0.4, letterSpacing: 6,
                color: isDark ? "#fff" : template.color,
            }}>
                {patterns[template.pattern] || "✦ ✧ ✦"}
            </div>

            {/* Big emoji */}
            <div style={{ fontSize: 44, marginBottom: 12, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
                {template.emoji}
            </div>

            <p style={{ fontSize: 9, letterSpacing: 5, color: subColor, margin: "0 0 10px", textTransform: "uppercase", opacity: 0.8 }}>
                {template.category === "wedding" ? "WE ARE GETTING MARRIED" : template.category === "birthday" ? "HAPPY BIRTHDAY" : "YOU ARE INVITED"}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 300, color: textColor, fontStyle: "italic", margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>
                Nguyễn Văn
            </h2>
            <p style={{ fontSize: 16, color: subColor, margin: "0 0 6px" }}>&amp;</p>
            <h2 style={{ fontSize: 22, fontWeight: 300, color: textColor, fontStyle: "italic", margin: "0 0 16px", fontFamily: "'Georgia', serif" }}>
                Trần Thị Mai
            </h2>

            <div style={{
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : template.color + "30"}`,
                paddingTop: 12,
                width: "100%",
            }}>
                <p style={{ fontSize: 11, color: subColor, margin: "0 0 2px", letterSpacing: 1 }}>15 · 06 · 2026</p>
                <p style={{ fontSize: 10, color: isDark ? "rgba(255,255,255,0.5)" : "#6b7280", margin: 0 }}>Diamond Palace, TP.HCM</p>
            </div>

            {/* Bottom decorative pattern */}
            <div style={{
                position: "absolute", bottom: 10, left: 0, right: 0,
                fontSize: 11, opacity: 0.4, letterSpacing: 6,
                color: isDark ? "#fff" : template.color,
            }}>
                {patterns[template.pattern] || "✦ ✧ ✦"}
            </div>
        </div>
    );
}

// Animated confetti rain for modal header
function ConfettiRain({ color }: { color: string }) {
    const [dots] = useState(() =>
        Array.from({ length: 12 }, (_, i) => ({
            left: `${(i * 8.5) % 100}%`,
            delay: `${(i * 0.15) % 1.5}s`,
            dur: `${1.8 + (i % 4) * 0.3}s`,
            size: 4 + (i % 3) * 2,
        }))
    );
    return (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            {dots.map((d, i) => (
                <div key={i} style={{
                    position: "absolute",
                    top: "-10px",
                    left: d.left,
                    width: d.size,
                    height: d.size,
                    borderRadius: "50%",
                    background: color,
                    opacity: 0.5,
                    animation: `confettiFall ${d.dur} ${d.delay} linear infinite`,
                }} />
            ))}
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(-10px) rotate(0deg); opacity: 0.6; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTier, setActiveTier] = useState<"all" | "basic" | "premium">("all");
    const [previewTemplate, setPreviewTemplate] = useState<(typeof TEMPLATES)[0] | null>(null);
    const [search, setSearch] = useState("");
    const [hovered, setHovered] = useState<string | null>(null);

    // Keyboard close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setPreviewTemplate(null); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const filtered = TEMPLATES.filter((t) => {
        if (activeCategory !== "all" && t.category !== activeCategory) return false;
        if (activeTier !== "all" && t.tier !== activeTier) return false;
        if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* ── Header ── */}
            <div style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", padding: "48px 0 40px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                    <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                        ← Về Dashboard
                    </Link>
                    <h1 style={{ fontSize: 34, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                        ✨ Bộ sưu tập mẫu thiệp
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, margin: "0 0 24px" }}>
                        {filtered.length} mẫu đẹp — chọn 1 click để tạo ngay
                    </p>

                    {/* Search */}
                    <div style={{ position: "relative", maxWidth: 380, marginBottom: 20 }}>
                        <input
                            placeholder="🔍 Tìm theo tên, phong cách..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 16px", borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.15)",
                                background: "rgba(255,255,255,0.1)", color: "#fff",
                                fontSize: 13, outline: "none", boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Category Tabs */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {CATEGORIES.map((cat) => (
                            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                                padding: "8px 18px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 500,
                                cursor: "pointer", transition: "all 0.2s",
                                background: activeCategory === cat.key ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)",
                                color: activeCategory === cat.key ? "#fff" : "rgba(255,255,255,0.6)",
                                backdropFilter: "blur(10px)",
                            }}>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Tier Filter */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        {(["all", "basic", "premium"] as const).map((tier) => (
                            <button key={tier} onClick={() => setActiveTier(tier)} style={{
                                padding: "6px 14px", borderRadius: 8,
                                border: activeTier === tier ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                fontSize: 12, fontWeight: 500, cursor: "pointer",
                                background: activeTier === tier ? "rgba(192,132,252,0.15)" : "transparent",
                                color: activeTier === tier ? "#c084fc" : "rgba(255,255,255,0.5)",
                            }}>
                                {tier === "all" ? "Tất cả" : tier === "basic" ? "BASIC" : "⭐ PREMIUM"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Template Grid ── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
                        <p style={{ fontSize: 48, margin: "0 0 12px" }}>🔍</p>
                        <p style={{ fontSize: 16 }}>Không tìm thấy mẫu phù hợp</p>
                    </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                    {filtered.map((template) => {
                        const isHov = hovered === template.id;
                        const isDark = ["midnight-romance", "modern-minimalist", "royal-navy"].includes(template.slug);
                        return (
                            <div
                                key={template.id}
                                onClick={() => setPreviewTemplate(template)}
                                onMouseEnter={() => setHovered(template.id)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    background: "#fff", borderRadius: 20,
                                    overflow: "hidden", border: "1px solid #e8e8ec",
                                    cursor: "pointer",
                                    transform: isHov ? "translateY(-4px) scale(1.01)" : "none",
                                    boxShadow: isHov ? `0 16px 40px ${template.color}30` : "0 1px 3px rgba(0,0,0,0.06)",
                                    transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    height: 190,
                                    background: isDark
                                        ? `linear-gradient(135deg, ${template.color}cc 0%, #0f0c29 100%)`
                                        : `linear-gradient(135deg, ${template.color}18, ${template.color}45)`,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    position: "relative", gap: 8,
                                }}>
                                    <div style={{ fontSize: 52, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
                                        {template.emoji}
                                    </div>
                                    <div style={{
                                        fontSize: 9, letterSpacing: 4, fontWeight: 500,
                                        color: isDark ? "rgba(255,255,255,0.6)" : template.color,
                                        textTransform: "uppercase",
                                    }}>
                                        {template.category === "wedding" ? "WEDDING" : template.category === "birthday" ? "BIRTHDAY" : template.category.toUpperCase()}
                                    </div>

                                    {/* Tier Badge */}
                                    <span style={{
                                        position: "absolute", top: 12, right: 12,
                                        padding: "3px 10px", borderRadius: 6,
                                        fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                                        background: template.tier === "premium" ? "linear-gradient(135deg, #f59e0b, #f97316)" : "#e5e7eb",
                                        color: template.tier === "premium" ? "#fff" : "#6b7280",
                                    }}>
                                        {template.tier === "premium" ? "⭐ PREMIUM" : "BASIC"}
                                    </span>

                                    {/* Hover: preview button */}
                                    {isHov && (
                                        <div style={{
                                            position: "absolute", inset: 0,
                                            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            borderRadius: 0,
                                            animation: "fadeIn 0.15s ease",
                                        }}>
                                            <div style={{
                                                padding: "10px 20px", borderRadius: 24,
                                                background: "rgba(255,255,255,0.95)",
                                                fontSize: 13, fontWeight: 700, color: "#1f2937",
                                            }}>
                                                👁 Xem trước
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0 }}>
                                            {template.name}
                                        </h3>
                                        <div style={{
                                            width: 8, height: 8, borderRadius: "50%",
                                            background: template.color, flexShrink: 0,
                                        }} />
                                    </div>
                                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px", lineHeight: 1.4 }}>
                                        {template.desc}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#c4b5fd", margin: 0 }}>
                                        {template.usageCount.toLocaleString()} lượt dùng
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Preview Modal ── */}
            {previewTemplate && (
                <div
                    onClick={() => setPreviewTemplate(null)}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
                        zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
                        animation: "fadeIn 0.2s ease",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: 28,
                            width: "100%", maxWidth: 500,
                            overflow: "hidden",
                            boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
                            animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                        }}
                    >
                        {/* Card Preview */}
                        <div style={{ position: "relative", padding: "20px 20px 0" }}>
                            <ConfettiRain color={previewTemplate.color} />
                            <InvitationCardPreview template={previewTemplate} />
                        </div>

                        {/* Details */}
                        <div style={{ padding: "20px 24px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <span style={{ fontSize: 28 }}>{previewTemplate.emoji}</span>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                                        {previewTemplate.name}
                                    </h2>
                                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{previewTemplate.desc}</p>
                                </div>
                                <span style={{
                                    marginLeft: "auto", padding: "4px 12px", borderRadius: 8,
                                    fontSize: 11, fontWeight: 700,
                                    background: previewTemplate.tier === "premium" ? "linear-gradient(135deg,#f59e0b,#f97316)" : "#f3f4f6",
                                    color: previewTemplate.tier === "premium" ? "#fff" : "#6b7280",
                                }}>
                                    {previewTemplate.tier === "premium" ? "⭐ PREMIUM" : "BASIC"}
                                </span>
                            </div>

                            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 20px" }}>
                                {previewTemplate.usageCount.toLocaleString()} người đã sử dụng mẫu này
                            </p>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 10 }}>
                                <Link
                                    href={`/editor/new?template=${previewTemplate.slug}`}
                                    style={{
                                        flex: 1, padding: "14px 20px", borderRadius: 16,
                                        background: `linear-gradient(135deg, ${previewTemplate.color}, ${previewTemplate.color}cc)`,
                                        color: "#fff", fontSize: 15, fontWeight: 700,
                                        textAlign: "center", textDecoration: "none",
                                        boxShadow: `0 6px 20px ${previewTemplate.color}40`,
                                        display: "block",
                                    }}
                                >
                                    ✨ Dùng mẫu này
                                </Link>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    style={{
                                        padding: "14px 18px", borderRadius: 16,
                                        border: "1px solid #e5e7eb", background: "#fff",
                                        color: "#6b7280", fontSize: 13, cursor: "pointer",
                                    }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity:0; transform: translateY(20px) scale(0.96) } to { opacity:1; transform: translateY(0) scale(1) } }
            `}</style>
        </div>
    );
}
