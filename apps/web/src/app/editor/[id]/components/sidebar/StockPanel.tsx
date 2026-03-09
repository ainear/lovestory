"use client";

import { useState, useEffect, useCallback } from "react";

// Wedding-themed stock photos from Unsplash (free, no API key needed for demo)
const STOCK_CATEGORIES = [
    { key: "wedding", label: "💒 Đám cưới" },
    { key: "flowers", label: "🌸 Hoa" },
    { key: "couple", label: "💕 Couple" },
    { key: "bokeh", label: "✨ Bokeh" },
];

// Curated free Unsplash photos by category (using public Unsplash source URLs)
const STOCK_PHOTOS: Record<string, { id: string; url: string; thumb: string; credit: string }[]> = {
    wedding: [
        { id: "w1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200", credit: "Photos by Unsplash" },
        { id: "w2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", thumb: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200", credit: "Photos by Unsplash" },
        { id: "w3", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800", thumb: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200", credit: "Photos by Unsplash" },
        { id: "w4", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800", thumb: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=200", credit: "Photos by Unsplash" },
        { id: "w5", url: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=800", thumb: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=200", credit: "Photos by Unsplash" },
        { id: "w6", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800", thumb: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=200", credit: "Photos by Unsplash" },
        { id: "w7", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800", thumb: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200", credit: "Photos by Unsplash" },
        { id: "w8", url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", thumb: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200", credit: "Photos by Unsplash" },
    ],
    flowers: [
        { id: "f1", url: "https://images.unsplash.com/photo-1490750967868-88df5691cc35?w=800", thumb: "https://images.unsplash.com/photo-1490750967868-88df5691cc35?w=200", credit: "Photos by Unsplash" },
        { id: "f2", url: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800", thumb: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=200", credit: "Photos by Unsplash" },
        { id: "f3", url: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800", thumb: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=200", credit: "Photos by Unsplash" },
        { id: "f4", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800", thumb: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200", credit: "Photos by Unsplash" },
        { id: "f5", url: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800", thumb: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=200", credit: "Photos by Unsplash" },
        { id: "f6", url: "https://images.unsplash.com/photo-1487530811015-780c5b3ac781?w=800", thumb: "https://images.unsplash.com/photo-1487530811015-780c5b3ac781?w=200", credit: "Photos by Unsplash" },
    ],
    couple: [
        { id: "c1", url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800", thumb: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=200", credit: "Photos by Unsplash" },
        { id: "c2", url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800", thumb: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200", credit: "Photos by Unsplash" },
        { id: "c3", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800", thumb: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200", credit: "Photos by Unsplash" },
        { id: "c4", url: "https://images.unsplash.com/photo-1612595988889-aac75c143f61?w=800", thumb: "https://images.unsplash.com/photo-1612595988889-aac75c143f61?w=200", credit: "Photos by Unsplash" },
        { id: "c5", url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800", thumb: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=200", credit: "Photos by Unsplash" },
        { id: "c6", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800", thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200", credit: "Photos by Unsplash" },
    ],
    bokeh: [
        { id: "b1", url: "https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?w=800", thumb: "https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?w=200", credit: "Photos by Unsplash" },
        { id: "b2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", credit: "Photos by Unsplash" },
        { id: "b3", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", thumb: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200", credit: "Photos by Unsplash" },
        { id: "b4", url: "https://images.unsplash.com/photo-1531147646552-1b2d8b0a2a9b?w=800", thumb: "https://images.unsplash.com/photo-1531147646552-1b2d8b0a2a9b?w=200", credit: "Photos by Unsplash" },
    ],
};

interface StockPanelProps {
    onAddImage: (url: string) => void;
}

export function StockPanel({ onAddImage }: StockPanelProps) {
    const [activeCategory, setActiveCategory] = useState("wedding");
    const [loaded, setLoaded] = useState<Set<string>>(new Set());
    const photos = STOCK_PHOTOS[activeCategory] ?? [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                Ảnh Stock miễn phí
            </p>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {STOCK_CATEGORIES.map(cat => (
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

            {/* Photo grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {photos.map(photo => (
                    <div
                        key={photo.id}
                        onClick={() => onAddImage(photo.url)}
                        style={{
                            borderRadius: 8, overflow: "hidden",
                            cursor: "pointer", aspectRatio: "3/2",
                            background: "#f3f4f6", position: "relative",
                        }}
                        title="Click để thêm vào thiệp"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={photo.thumb}
                            alt=""
                            loading="lazy"
                            onLoad={() => setLoaded(s => new Set([...s, photo.id]))}
                            style={{
                                width: "100%", height: "100%", objectFit: "cover",
                                display: "block",
                                opacity: loaded.has(photo.id) ? 1 : 0,
                                transition: "opacity 0.3s",
                            }}
                        />
                        {!loaded.has(photo.id) && (
                            <div style={{
                                position: "absolute", inset: 0,
                                background: "linear-gradient(135deg, #f3e8ff, #fce7f3)",
                                animation: "shimmer 1.5s ease-in-out infinite",
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0, textAlign: "center" }}>
                📷 Ảnh từ Unsplash — miễn phí thương mại
            </p>

            <style>{`
                @keyframes shimmer {
                    0%,100% { opacity: 0.6 }
                    50% { opacity: 1 }
                }
            `}</style>
        </div>
    );
}
