"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────────
   TEMPLATE DATA (seed — will move to DB later)
   ────────────────────────────────────────────── */
const TEMPLATES = [
    { id: "1", slug: "rose-garden", name: "Rose Garden", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop", usageCount: 1234, desc: "Hoa hồng lãng mạn, tone hồng nhẹ nhàng" },
    { id: "2", slug: "midnight-romance", name: "Midnight Romance", category: "wedding", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=600&fit=crop", usageCount: 897, desc: "Đêm tím huyền bí, sang trọng" },
    { id: "3", slug: "golden-hour", name: "Golden Hour", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=600&fit=crop", usageCount: 2045, desc: "Ánh vàng hoàng hôn, ấm áp" },
    { id: "4", slug: "cherry-blossom", name: "Cherry Blossom", category: "wedding", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=600&fit=crop", usageCount: 765, desc: "Hoa anh đào, dịu dàng Nhật Bản" },
    { id: "5", slug: "beach-sunset", name: "Beach Sunset", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=400&h=600&fit=crop", usageCount: 1567, desc: "Biển xanh, thoải mái và tươi trẻ" },
    { id: "6", slug: "vintage-love", name: "Vintage Love", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=400&h=600&fit=crop", usageCount: 934, desc: "Cổ điển, tinh tế kiểu Châu Âu" },
    { id: "7", slug: "modern-minimalist", name: "Modern Minimalist", category: "wedding", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop", usageCount: 1189, desc: "Tối giản, hiện đại, đẳng cấp" },
    { id: "8", slug: "tropical-paradise", name: "Tropical Paradise", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=600&fit=crop", usageCount: 678, desc: "Nhiệt đới xanh mướt, tươi vui" },
    { id: "9", slug: "happy-birthday", name: "Happy Birthday", category: "birthday", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=600&fit=crop", usageCount: 2345, desc: "Rực rỡ, vui tươi sinh nhật" },
    { id: "10", slug: "graduation-cap", name: "Graduation Day", category: "graduation", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&h=600&fit=crop", usageCount: 456, desc: "Tốt nghiệp trang trọng" },
    { id: "11", slug: "party-night", name: "Party Night", category: "event", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=400&h=600&fit=crop", usageCount: 789, desc: "Party sôi động ánh đèn neon" },
    { id: "12", slug: "lien-hoan", name: "Liên Hoan Gia Đình", category: "event", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=600&fit=crop", usageCount: 321, desc: "Ấm áp, vui vẻ phong cách gia đình" },
    { id: "13", slug: "autumn-leaves", name: "Autumn Leaves", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=600&fit=crop", usageCount: 412, desc: "Mùa thu lá vàng, ấm áp" },
    { id: "14", slug: "ocean-blue", name: "Ocean Blue", category: "wedding", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=600&fit=crop", usageCount: 583, desc: "Đại dương sâu thẳm, thanh lịch" },
    { id: "15", slug: "lavender-dream", name: "Lavender Dream", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&h=600&fit=crop", usageCount: 739, desc: "Hoa oải hương, mơ màng Pháp" },
    { id: "16", slug: "do-truyen-thong", name: "Đỏ Truyền Thống", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=400&h=600&fit=crop", usageCount: 1102, desc: "Truyền thống Á Đông, đỏ may mắn" },
    { id: "17", slug: "forest-green", name: "Forest Green", category: "wedding", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=600&fit=crop", usageCount: 298, desc: "Rừng xanh tươi, gần gũi thiên nhiên" },
    { id: "18", slug: "peach-blossom", name: "Peach Blossom", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=600&fit=crop", usageCount: 867, desc: "Hoa đào mùa xuân nhẹ nhàng" },
    { id: "19", slug: "royal-navy", name: "Royal Navy", category: "event", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&h=600&fit=crop", usageCount: 445, desc: "Hoàng gia sang trọng, uy nghiêm" },
    { id: "20", slug: "dusty-rose", name: "Dusty Rose", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", usageCount: 623, desc: "Hồng bụi, cổ điển romantique" },
    { id: "21", slug: "celebration-gold", name: "Celebration Gold", category: "event", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=600&fit=crop", usageCount: 511, desc: "Vàng rực rỡ, tiệc xa xỉ" },
    { id: "22", slug: "crystal-white", name: "Crystal White", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=600&fit=crop", usageCount: 734, desc: "Trắng tinh khôi, thuần khiết" },
    { id: "23", slug: "sunset-blush", name: "Sunset Blush", category: "wedding", tier: "basic" as const, thumbnail: "https://images.unsplash.com/photo-1519657337289-077653f724ed?w=400&h=600&fit=crop", usageCount: 892, desc: "Tone cam hồng hoàng hôn" },
    { id: "24", slug: "noir-elegance", name: "Noir Elegance", category: "wedding", tier: "premium" as const, thumbnail: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=400&h=600&fit=crop", usageCount: 356, desc: "Đen trắng sang trọng, luxury" },
];

const CATEGORIES = [
    { key: "all", label: "Tất cả" },
    { key: "wedding", label: "Thiệp cưới" },
    { key: "birthday", label: "Thiệp sinh nhật" },
    { key: "graduation", label: "Thiệp tốt nghiệp" },
    { key: "event", label: "Sự kiện" },
];

/* ──────────────────
   TEMPLATE CARD
   ────────────────── */
function TemplateCard({
    template,
    onPreview,
}: {
    template: (typeof TEMPLATES)[0];
    onPreview: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer fade-in
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add("card-visible"); obs.unobserve(el); } },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className="card-animate"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                background: "#fff",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
                transform: hovered ? "translateY(-3px)" : "none",
            }}
            onClick={onPreview}
        >
            {/* Thumbnail */}
            <div style={{ position: "relative", paddingBottom: "140%", overflow: "hidden" }}>
                <img
                    src={template.thumbnail}
                    alt={template.name}
                    loading="lazy"
                    style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                    }}
                />

                {/* BASIC / PREMIUM Badge */}
                <span style={{
                    position: "absolute", top: 8, left: 8, zIndex: 2,
                    padding: "3px 8px", borderRadius: 4,
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    background: template.tier === "premium" ? "#9333EA" : "#3B82F6",
                    color: "#fff",
                }}>
                    {template.tier === "premium" ? "PREMIUM" : "BASIC"}
                </span>

                {/* Hover Overlay — cinelove style */}
                {hovered && (
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 3,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "flex-end",
                        padding: "16px 12px",
                        animation: "fadeIn 0.15s ease",
                    }}>
                        {/* Top-right: heart + views */}
                        <div style={{
                            position: "absolute", top: 8, right: 8,
                            display: "flex", gap: 8, alignItems: "center",
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); /* TODO: save to favorites */ }}
                                style={{
                                    width: 30, height: 30, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.9)", border: "none",
                                    cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 14,
                                }}
                                title="Yêu thích"
                            >
                                ♡
                            </button>
                            <span style={{
                                fontSize: 11, color: "#fff",
                                background: "rgba(0,0,0,0.45)",
                                padding: "3px 8px", borderRadius: 10,
                                fontWeight: 500,
                            }}>
                                {template.usageCount.toLocaleString()}
                            </span>
                        </div>

                        {/* Center: "Xem mẫu" button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onPreview(); }}
                            style={{
                                padding: "10px 24px", borderRadius: 8,
                                background: "#fff", border: "none",
                                fontSize: 13, fontWeight: 600, color: "#1f2937",
                                cursor: "pointer", marginBottom: 4,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                        >
                            Xem mẫu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ──────────────────
   PREVIEW MODAL
   ────────────────── */
function PreviewModal({
    template,
    onClose,
}: {
    template: (typeof TEMPLATES)[0];
    onClose: () => void;
}) {
    // Keyboard close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                zIndex: 50, display: "flex",
                alignItems: "center", justifyContent: "center",
                padding: 24,
                animation: "fadeIn 0.2s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 20,
                    width: "100%", maxWidth: 420,
                    maxHeight: "90vh",
                    overflow: "hidden",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
                    animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    display: "flex", flexDirection: "column",
                }}
            >
                {/* Preview Image */}
                <div style={{ position: "relative", width: "100%", paddingBottom: "140%", flexShrink: 0 }}>
                    <img
                        src={template.thumbnail}
                        alt={template.name}
                        style={{
                            position: "absolute", inset: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute", top: 12, right: 12,
                            width: 32, height: 32, borderRadius: "50%",
                            background: "rgba(0,0,0,0.5)", border: "none",
                            color: "#fff", fontSize: 16, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >
                        ✕
                    </button>

                    {/* Badge */}
                    <span style={{
                        position: "absolute", top: 12, left: 12,
                        padding: "4px 10px", borderRadius: 6,
                        fontSize: 11, fontWeight: 700,
                        background: template.tier === "premium" ? "#9333EA" : "#3B82F6",
                        color: "#fff",
                    }}>
                        {template.tier === "premium" ? "PREMIUM" : "BASIC"}
                    </span>
                </div>

                {/* Info + Actions */}
                <div style={{ padding: "16px 20px 20px" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>
                        {template.name}
                    </h2>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.4 }}>
                        {template.desc}
                    </p>

                    <div style={{ display: "flex", gap: 10 }}>
                        <Link
                            href={`/editor/new?template=${template.slug}`}
                            style={{
                                flex: 1, padding: "12px 0", borderRadius: 10,
                                background: "#EF7E90",
                                color: "#fff", fontSize: 14, fontWeight: 700,
                                textAlign: "center", textDecoration: "none",
                                display: "block",
                            }}
                        >
                            Dùng thử
                        </Link>
                        <Link
                            href={`/i/preview/${template.slug}`}
                            style={{
                                flex: 1, padding: "12px 0", borderRadius: 10,
                                border: "1px solid #e5e7eb", background: "#fff",
                                color: "#374151", fontSize: 14, fontWeight: 600,
                                textAlign: "center", textDecoration: "none",
                                display: "block",
                            }}
                        >
                            Xem trực tiếp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────
   MAIN PAGE
   ────────────────── */
export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTier, setActiveTier] = useState<"all" | "basic" | "premium">("all");
    const [previewTemplate, setPreviewTemplate] = useState<(typeof TEMPLATES)[0] | null>(null);

    const filtered = TEMPLATES.filter((t) => {
        if (activeCategory !== "all" && t.category !== activeCategory) return false;
        if (activeTier !== "all" && t.tier !== activeTier) return false;
        return true;
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* ── Navbar ── */}
            <nav style={{
                background: "#fff",
                borderBottom: "1px solid #eee",
                padding: "12px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 40,
            }}>
                <Link href="/" style={{
                    display: "flex", alignItems: "center", gap: 8,
                    textDecoration: "none", color: "#EF7E90",
                    fontSize: 20, fontWeight: 700,
                }}>
                    <span style={{ fontSize: 24 }}>💌</span> 7app
                </Link>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <Link href="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Trang chủ</Link>
                    <Link href="/templates" style={{ fontSize: 13, color: "#EF7E90", fontWeight: 600, textDecoration: "none" }}>Mẫu thiệp</Link>
                    <Link href="/blog" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Blog</Link>
                    <Link href="/dashboard" style={{
                        padding: "8px 18px", borderRadius: 8,
                        background: "#EF7E90", color: "#fff",
                        fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}>
                        Tạo thiệp
                    </Link>
                </div>
            </nav>

            {/* ── Page Header ── */}
            <div style={{
                textAlign: "center",
                padding: "48px 24px 32px",
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
            }}>
                <h1 style={{
                    fontSize: 32, fontWeight: 700, color: "#1f2937",
                    margin: "0 0 8px",
                }}>
                    Mẫu thiệp online đẹp
                </h1>
                <p style={{
                    fontSize: 15, color: "#6b7280",
                    margin: "0 0 24px", maxWidth: 500, marginInline: "auto",
                }}>
                    Khám phá bộ sưu tập mẫu thiệp điện tử đa dạng: cưới, sinh nhật, sự kiện, kỷ niệm từ 7app
                </p>

                {/* Category Pills + Tier Filter */}
                <div style={{
                    display: "flex", gap: 8, justifyContent: "center",
                    flexWrap: "wrap", marginBottom: 12,
                }}>
                    {CATEGORIES.map((cat) => (
                        <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                            padding: "8px 18px", borderRadius: 20,
                            border: "1px solid " + (activeCategory === cat.key ? "#EF7E90" : "#e5e7eb"),
                            fontSize: 13, fontWeight: activeCategory === cat.key ? 600 : 400,
                            cursor: "pointer",
                            background: activeCategory === cat.key ? "#EF7E90" : "#fff",
                            color: activeCategory === cat.key ? "#fff" : "#4b5563",
                            transition: "all 0.2s",
                        }}>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Breadcrumb + Tier filter row */}
                <div style={{
                    maxWidth: 1200, margin: "0 auto", padding: "0 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                        ☆ Trang chủ / Mẫu thiệp
                    </p>
                    <select
                        value={activeTier}
                        onChange={(e) => setActiveTier(e.target.value as "all" | "basic" | "premium")}
                        style={{
                            padding: "6px 12px", borderRadius: 8,
                            border: "1px solid #e5e7eb", fontSize: 12,
                            color: "#6b7280", background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <option value="all">Tất cả gói</option>
                        <option value="basic">BASIC</option>
                        <option value="premium">PREMIUM</option>
                    </select>
                </div>
            </div>

            {/* ── Template Grid (6-col desktop) ── */}
            <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px 16px 60px" }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
                        <p style={{ fontSize: 48, margin: "0 0 12px" }}>🔍</p>
                        <p style={{ fontSize: 16 }}>Không tìm thấy mẫu phù hợp</p>
                    </div>
                )}
                <div className="templates-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 14,
                }}>
                    {filtered.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onPreview={() => setPreviewTemplate(template)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <footer style={{
                borderTop: "1px solid #eee", background: "#fff",
                padding: "24px", textAlign: "center",
            }}>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                    © 2026 7app.online — Thiệp mời trực tuyến đẹp nhất Việt Nam
                </p>
            </footer>

            {/* ── Preview Modal ── */}
            {previewTemplate && (
                <PreviewModal
                    template={previewTemplate}
                    onClose={() => setPreviewTemplate(null)}
                />
            )}

            {/* ── CSS Animations + Responsive ── */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }

                .card-animate {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
                }
                .card-visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                /* Responsive grid */
                @media (max-width: 1200px) {
                    div[style*="grid-template-columns: repeat(6"] {
                        /* handled via style override below */
                    }
                }
            `}</style>

            {/* Responsive override via <style> for grid columns */}
            <style>{`
                @media (max-width: 480px) {
                    .templates-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
                    nav { padding: 10px 16px !important; }
                    nav > div:last-child > a:not(:last-child) { display: none !important; }
                }
                @media (min-width: 481px) and (max-width: 768px) {
                    .templates-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (min-width: 769px) and (max-width: 1024px) {
                    .templates-grid { grid-template-columns: repeat(4, 1fr) !important; }
                }
            `}</style>
        </div>
    );
}
