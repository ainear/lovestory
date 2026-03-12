"use client";

// Decorative stickers for wedding invitations
// Using emoji + SVG-based stickers rendered as text elements on canvas

export interface StickerDef {
    id: string;
    emoji: string;
    label: string;
    category: "flowers" | "hearts" | "decor" | "ribbon";
    fontSize: number;
}

export const STICKERS: StickerDef[] = [
    // Flowers
    { id: "s1", emoji: "🌸", label: "Hoa anh đào", category: "flowers", fontSize: 48 },
    { id: "s2", emoji: "🌹", label: "Hoa hồng", category: "flowers", fontSize: 48 },
    { id: "s3", emoji: "🌺", label: "Hoa đỏ", category: "flowers", fontSize: 48 },
    { id: "s4", emoji: "💐", label: "Bó hoa", category: "flowers", fontSize: 48 },
    { id: "s5", emoji: "🌼", label: "Hoa cúc", category: "flowers", fontSize: 48 },
    { id: "s6", emoji: "🌷", label: "Hoa tulip", category: "flowers", fontSize: 48 },
    { id: "s7", emoji: "🌿", label: "Lá xanh", category: "flowers", fontSize: 48 },
    { id: "s8", emoji: "🍃", label: "Lá", category: "flowers", fontSize: 48 },
    // Hearts
    { id: "s9", emoji: "💕", label: "Hai tim", category: "hearts", fontSize: 48 },
    { id: "s10", emoji: "💖", label: "Tim hồng", category: "hearts", fontSize: 48 },
    { id: "s11", emoji: "💝", label: "Tim đỏ", category: "hearts", fontSize: 48 },
    { id: "s12", emoji: "💌", label: "Thư tình", category: "hearts", fontSize: 48 },
    { id: "s13", emoji: "🫶", label: "Hand heart", category: "hearts", fontSize: 48 },
    { id: "s14", emoji: "💍", label: "Nhẫn", category: "hearts", fontSize: 48 },
    // Decor
    { id: "s15", emoji: "✨", label: "Sparkle", category: "decor", fontSize: 48 },
    { id: "s16", emoji: "🕊️", label: "Chim bồ câu", category: "decor", fontSize: 48 },
    { id: "s17", emoji: "🥂", label: "Champagne", category: "decor", fontSize: 48 },
    { id: "s18", emoji: "🍾", label: "Champagne bottle", category: "decor", fontSize: 48 },
    { id: "s19", emoji: "🎊", label: "Confetti", category: "decor", fontSize: 48 },
    { id: "s20", emoji: "🎀", label: "Nơ", category: "decor", fontSize: 48 },
    // Ribbon/decoration
    { id: "s21", emoji: "🕯️", label: "Nến", category: "ribbon", fontSize: 48 },
    { id: "s22", emoji: "🏮", label: "Đèn lồng", category: "ribbon", fontSize: 48 },
    { id: "s23", emoji: "⭐", label: "Sao", category: "ribbon", fontSize: 48 },
    { id: "s24", emoji: "🌙", label: "Trăng", category: "ribbon", fontSize: 48 },
];

const STICKER_CATEGORIES = [
    { key: "flowers", label: "🌸 Hoa" },
    { key: "hearts", label: "💕 Tim" },
    { key: "decor", label: "✨ Trang trí" },
    { key: "ribbon", label: "🎀 Phụ kiện" },
];

import { useState } from "react";
import type { CanvasElement } from "../useCanvasReducer";

interface StickerPanelProps {
    onAddSticker: (element: Omit<CanvasElement, "id" | "zIndex" | "sectionId">) => void;
}

export function StickerPanel({ onAddSticker }: StickerPanelProps) {
    const [activeCategory, setActiveCategory] = useState<string>("flowers");
    const filtered = STICKERS.filter(s => s.category === activeCategory);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                Sticker & Trang trí
            </p>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {STICKER_CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                        padding: "5px 10px", borderRadius: 6, border: "none",
                        fontSize: 11, cursor: "pointer", fontWeight: 500,
                        background: activeCategory === cat.key ? "#fdf2f8" : "#f3f4f6",
                        color: activeCategory === cat.key ? "#be185d" : "#6b7280",
                        borderBottom: activeCategory === cat.key ? "2px solid #ff6b9d" : "2px solid transparent",
                    }}>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Sticker grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {filtered.map(sticker => (
                    <button
                        key={sticker.id}
                        title={sticker.label}
                        onClick={() => onAddSticker({
                            type: "text",
                            x: 150, y: 200,
                            width: 80, height: 80,
                            rotation: 0, opacity: 1, locked: false,
                            props: {
                                text: sticker.emoji,
                                fontSize: 48,
                                fontFamily: "sans-serif",
                                color: "#000",
                                textAlign: "center",
                                fontWeight: "normal",
                                fontStyle: "normal",
                                lineHeight: 1,
                            },
                        })}
                        style={{
                            width: "100%", aspectRatio: "1", borderRadius: 10,
                            border: "1px solid #f3f4f6",
                            background: "#fafafa", cursor: "pointer",
                            fontSize: 28, display: "flex", alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fdf2f8"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        {sticker.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}
