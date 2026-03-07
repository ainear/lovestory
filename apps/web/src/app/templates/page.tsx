"use client";

import { useState } from "react";
import Link from "next/link";

// Seed template data (sẽ chuyển sang DB sau)
const TEMPLATES = [
    {
        id: "1",
        slug: "rose-garden",
        name: "Rose Garden",
        category: "wedding",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#ff6b9d",
        emoji: "🌹",
        usageCount: 1234,
    },
    {
        id: "2",
        slug: "midnight-romance",
        name: "Midnight Romance",
        category: "wedding",
        tier: "premium" as const,
        thumbnailUrl: "",
        color: "#6366f1",
        emoji: "🌙",
        usageCount: 897,
    },
    {
        id: "3",
        slug: "golden-hour",
        name: "Golden Hour",
        category: "wedding",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#f59e0b",
        emoji: "🌅",
        usageCount: 2045,
    },
    {
        id: "4",
        slug: "cherry-blossom",
        name: "Cherry Blossom",
        category: "wedding",
        tier: "premium" as const,
        thumbnailUrl: "",
        color: "#ec4899",
        emoji: "🌸",
        usageCount: 765,
    },
    {
        id: "5",
        slug: "beach-sunset",
        name: "Beach Sunset",
        category: "wedding",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#0ea5e9",
        emoji: "🏖️",
        usageCount: 1567,
    },
    {
        id: "6",
        slug: "vintage-love",
        name: "Vintage Love",
        category: "wedding",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#78716c",
        emoji: "📜",
        usageCount: 934,
    },
    {
        id: "7",
        slug: "modern-minimalist",
        name: "Modern Minimalist",
        category: "wedding",
        tier: "premium" as const,
        thumbnailUrl: "",
        color: "#1f2937",
        emoji: "◼️",
        usageCount: 1189,
    },
    {
        id: "8",
        slug: "tropical-paradise",
        name: "Tropical Paradise",
        category: "wedding",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#10b981",
        emoji: "🌴",
        usageCount: 678,
    },
    {
        id: "9",
        slug: "happy-birthday",
        name: "Happy Birthday",
        category: "birthday",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#f43f5e",
        emoji: "🎂",
        usageCount: 2345,
    },
    {
        id: "10",
        slug: "graduation-cap",
        name: "Graduation Day",
        category: "graduation",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#8b5cf6",
        emoji: "🎓",
        usageCount: 456,
    },
    {
        id: "11",
        slug: "party-night",
        name: "Party Night",
        category: "event",
        tier: "premium" as const,
        thumbnailUrl: "",
        color: "#a855f7",
        emoji: "🎉",
        usageCount: 789,
    },
    {
        id: "12",
        slug: "lien-hoan",
        name: "Liên Hoan Gia Đình",
        category: "event",
        tier: "basic" as const,
        thumbnailUrl: "",
        color: "#ef4444",
        emoji: "👨\u200d👩\u200d👧\u200d👦",
        usageCount: 321,
    },
    // ── Sprint K: 10 mẫu mới ──
    { id: "13", slug: "autumn-leaves", name: "Autumn Leaves", category: "wedding", tier: "basic" as const, thumbnailUrl: "", color: "#d97706", emoji: "🍂", usageCount: 412 },
    { id: "14", slug: "ocean-blue", name: "Ocean Blue", category: "wedding", tier: "premium" as const, thumbnailUrl: "", color: "#0284c7", emoji: "🌊", usageCount: 583 },
    { id: "15", slug: "lavender-dream", name: "Lavender Dream", category: "wedding", tier: "basic" as const, thumbnailUrl: "", color: "#9333ea", emoji: "💜", usageCount: 739 },
    { id: "16", slug: "do-truyen-thong", name: "Đỏ Truyền Thống", category: "wedding", tier: "basic" as const, thumbnailUrl: "", color: "#dc2626", emoji: "🏮", usageCount: 1102 },
    { id: "17", slug: "forest-green", name: "Forest Green", category: "wedding", tier: "premium" as const, thumbnailUrl: "", color: "#16a34a", emoji: "🌿", usageCount: 298 },
    { id: "18", slug: "peach-blossom", name: "Peach Blossom", category: "wedding", tier: "basic" as const, thumbnailUrl: "", color: "#fb923c", emoji: "🌼", usageCount: 867 },
    { id: "19", slug: "royal-navy", name: "Royal Navy", category: "event", tier: "premium" as const, thumbnailUrl: "", color: "#1e3a5f", emoji: "👑", usageCount: 445 },
    { id: "20", slug: "dusty-rose", name: "Dusty Rose", category: "wedding", tier: "basic" as const, thumbnailUrl: "", color: "#be185d", emoji: "🥀", usageCount: 623 },
    { id: "21", slug: "celebration-gold", name: "Celebration Gold", category: "event", tier: "premium" as const, thumbnailUrl: "", color: "#ca8a04", emoji: "✨", usageCount: 511 },
    { id: "22", slug: "crystal-white", name: "Crystal White", category: "wedding", tier: "basic" as const, thumbnailUrl: "", color: "#94a3b8", emoji: "💍", usageCount: 734 },
];


const CATEGORIES = [
    { key: "all", label: "Tất cả", icon: "🎨" },
    { key: "wedding", label: "Đám cưới", icon: "💒" },
    { key: "birthday", label: "Sinh nhật", icon: "🎂" },
    { key: "graduation", label: "Tốt nghiệp", icon: "🎓" },
    { key: "event", label: "Sự kiện", icon: "🎉" },
];

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
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f5f7",
                fontFamily: "'Inter', -apple-system, sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                    padding: "48px 0 40px",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                    <Link
                        href="/dashboard"
                        style={{
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 16,
                        }}
                    >
                        ← Về Dashboard
                    </Link>
                    <h1
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "#fff",
                            margin: "0 0 8px",
                        }}
                    >
                        ✏️ Chọn mẫu thiệp
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, margin: 0 }}>
                        {filtered.length} mẫu thiệp đẹp dành cho bạn
                    </p>

                    {/* Category Tabs */}
                    <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: 20,
                                    border: "none",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    background:
                                        activeCategory === cat.key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                                    color: activeCategory === cat.key ? "#fff" : "rgba(255,255,255,0.6)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Tier Filter */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        {(["all", "basic", "premium"] as const).map((tier) => (
                            <button
                                key={tier}
                                onClick={() => setActiveTier(tier)}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: 8,
                                    border:
                                        activeTier === tier
                                            ? "1px solid rgba(192,132,252,0.5)"
                                            : "1px solid rgba(255,255,255,0.1)",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    background:
                                        activeTier === tier ? "rgba(192,132,252,0.15)" : "transparent",
                                    color:
                                        activeTier === tier ? "#c084fc" : "rgba(255,255,255,0.5)",
                                }}
                            >
                                {tier === "all" ? "Tất cả" : tier === "basic" ? "BASIC" : "⭐ PREMIUM"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Template Grid */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: 20,
                    }}
                >
                    {filtered.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => setPreviewTemplate(template)}
                            style={{
                                background: "#fff",
                                borderRadius: 16,
                                overflow: "hidden",
                                border: "1px solid #e8e8ec",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}
                        >
                            {/* Thumbnail */}
                            <div
                                style={{
                                    height: 200,
                                    background: `linear-gradient(135deg, ${template.color}22, ${template.color}44)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 64,
                                    position: "relative",
                                }}
                            >
                                {template.emoji}
                                {/* Tier Badge */}
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        padding: "3px 10px",
                                        borderRadius: 6,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                        background:
                                            template.tier === "premium"
                                                ? "linear-gradient(135deg, #f59e0b, #f97316)"
                                                : "#e5e7eb",
                                        color: template.tier === "premium" ? "#fff" : "#6b7280",
                                    }}
                                >
                                    {template.tier === "premium" ? "⭐ PREMIUM" : "BASIC"}
                                </span>
                            </div>

                            {/* Info */}
                            <div style={{ padding: 16 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>
                                    {template.name}
                                </h3>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                        {template.usageCount.toLocaleString()} lượt dùng
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div
                    onClick={() => setPreviewTemplate(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        zIndex: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 24,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            borderRadius: 24,
                            width: "100%",
                            maxWidth: 560,
                            overflow: "hidden",
                            boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
                        }}
                    >
                        {/* Preview Area */}
                        <div
                            style={{
                                height: 320,
                                background: `linear-gradient(135deg, ${previewTemplate.color}22, ${previewTemplate.color}55)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 96,
                            }}
                        >
                            {previewTemplate.emoji}
                        </div>

                        {/* Details */}
                        <div style={{ padding: "24px 28px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: 0, flex: 1 }}>
                                    {previewTemplate.name}
                                </h2>
                                <span
                                    style={{
                                        padding: "4px 12px",
                                        borderRadius: 8,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        background:
                                            previewTemplate.tier === "premium"
                                                ? "linear-gradient(135deg, #f59e0b, #f97316)"
                                                : "#e5e7eb",
                                        color: previewTemplate.tier === "premium" ? "#fff" : "#6b7280",
                                    }}
                                >
                                    {previewTemplate.tier === "premium" ? "⭐ PREMIUM" : "BASIC"}
                                </span>
                            </div>
                            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 24px" }}>
                                {previewTemplate.usageCount.toLocaleString()} người đã sử dụng mẫu này
                            </p>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 12 }}>
                                <Link
                                    href={`/editor/new?template=${previewTemplate.slug}`}
                                    style={{
                                        flex: 1,
                                        padding: "14px 24px",
                                        borderRadius: 14,
                                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                        color: "#fff",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        textAlign: "center",
                                        textDecoration: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✨ Dùng mẫu này
                                </Link>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    style={{
                                        padding: "14px 20px",
                                        borderRadius: 14,
                                        border: "1px solid #e5e7eb",
                                        background: "#fff",
                                        color: "#6b7280",
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
