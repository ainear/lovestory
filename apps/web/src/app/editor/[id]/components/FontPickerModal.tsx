"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, Upload } from "lucide-react";

// 30 curated fonts for wedding invitations
export const SYSTEM_FONTS = [
    { name: "Dancing Script", label: "Dancing Script", category: "Script" },
    { name: "Great Vibes", label: "Great Vibes", category: "Script" },
    { name: "Pacifico", label: "Pacifico", category: "Script" },
    { name: "Sacramento", label: "Sacramento", category: "Script" },
    { name: "Satisfy", label: "Satisfy", category: "Script" },
    { name: "Pinyon Script", label: "Pinyon Script", category: "Script" },
    { name: "Allura", label: "Allura", category: "Script" },
    { name: "Alex Brush", label: "Alex Brush", category: "Script" },
    { name: "Cormorant Garamond", label: "Cormorant Garamond", category: "Serif" },
    { name: "Playfair Display", label: "Playfair Display", category: "Serif" },
    { name: "EB Garamond", label: "EB Garamond", category: "Serif" },
    { name: "Lora", label: "Lora", category: "Serif" },
    { name: "Libre Baskerville", label: "Libre Baskerville", category: "Serif" },
    { name: "Merriweather", label: "Merriweather", category: "Serif" },
    { name: "Georgia", label: "Georgia", category: "Serif" },
    { name: "Inter", label: "Inter", category: "Sans-serif" },
    { name: "Poppins", label: "Poppins", category: "Sans-serif" },
    { name: "Montserrat", label: "Montserrat", category: "Sans-serif" },
    { name: "Raleway", label: "Raleway", category: "Sans-serif" },
    { name: "Nunito", label: "Nunito", category: "Sans-serif" },
    { name: "Roboto", label: "Roboto", category: "Sans-serif" },
    { name: "Josefin Sans", label: "Josefin Sans", category: "Sans-serif" },
    { name: "Cinzel", label: "Cinzel", category: "Display" },
    { name: "Uncial Antiqua", label: "Uncial Antiqua", category: "Display" },
    { name: "Philosopher", label: "Philosopher", category: "Serif" },
];

// Load all fonts at startup
const FONT_IMPORT_URL =
    "https://fonts.googleapis.com/css2?family=" +
    SYSTEM_FONTS.map(f => encodeURIComponent(f.name).replace(/%20/g, "+")).join("&family=") +
    "&display=swap";

interface FontPickerModalProps {
    currentFont: string;
    onSelect: (font: string) => void;
    onClose: () => void;
}

export function FontPickerModal({ currentFont, onSelect, onClose }: FontPickerModalProps) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"system" | "mine">("system");
    const searchRef = useRef<HTMLInputElement>(null);

    // Inject Google Fonts link
    useEffect(() => {
        if (!document.getElementById("gf-font-picker-link")) {
            const link = document.createElement("link");
            link.id = "gf-font-picker-link";
            link.rel = "stylesheet";
            link.href = FONT_IMPORT_URL;
            document.head.appendChild(link);
        }
        // focus search on open
        setTimeout(() => searchRef.current?.focus(), 100);
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return SYSTEM_FONTS.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }, [search]);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(filtered.map(f => f.category)));
        return cats;
    }, [filtered]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 99998,
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(2px)",
                }}
            />

            {/* Modal */}
            <div style={{
                position: "fixed",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 99999,
                width: 400, maxHeight: "80vh",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
                display: "flex", flexDirection: "column",
                overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    padding: "16px 20px 12px",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Phông chữ</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6 }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", padding: "10px 20px 0", gap: 4 }}>
                    {(["system", "mine"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
                                cursor: "pointer", fontSize: 13, fontWeight: 600,
                                background: activeTab === tab ? "#ff6b9d" : "#f3f4f6",
                                color: activeTab === tab ? "#fff" : "#6b7280",
                                transition: "all 0.15s",
                            }}
                        >
                            {tab === "system" ? "Hệ thống" : "Của tôi"}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ padding: "12px 20px 8px" }}>
                    <div style={{ position: "relative" }}>
                        <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Tìm tên font chữ..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: "100%", padding: "8px 12px 8px 32px",
                                border: "1px solid #e5e7eb", borderRadius: 8,
                                fontSize: 13, color: "#374151", outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                </div>

                {/* Font List */}
                {activeTab === "system" ? (
                    <div style={{ overflowY: "auto", flex: 1, padding: "0 12px 12px" }}>
                        {categories.map(cat => (
                            <div key={cat}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase", padding: "10px 8px 4px" }}>
                                    {cat}
                                </div>
                                {filtered.filter(f => f.category === cat).map(font => (
                                    <button
                                        key={font.name}
                                        onClick={() => { onSelect(font.name); onClose(); }}
                                        style={{
                                            width: "100%", padding: "10px 12px",
                                            display: "flex", flexDirection: "column", gap: 2,
                                            border: "none", borderRadius: 8, cursor: "pointer",
                                            background: currentFont === font.name ? "#fff0f6" : "transparent",
                                            outline: currentFont === font.name ? "2px solid #ff6b9d" : "none",
                                            textAlign: "left", transition: "background 0.1s",
                                        }}
                                        onMouseEnter={e => { if (currentFont !== font.name) (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb"; }}
                                        onMouseLeave={e => { if (currentFont !== font.name) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                                    >
                                        <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "Inter, sans-serif" }}>{font.label}</span>
                                        <span style={{
                                            fontSize: 22,
                                            fontFamily: `'${font.name}', serif`,
                                            color: "#1f2937", lineHeight: 1.2,
                                        }}>
                                            Thiệp cưới của chúng tôi
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 13 }}>
                                Không tìm thấy font nào
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff0f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Upload size={24} color="#ff6b9d" />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#111827" }}>Tải lên phông chữ</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Hỗ trợ định dạng .TTF, .OTF, .WOFF</p>
                        </div>
                        <button style={{
                            padding: "10px 24px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                        }}>
                            Chọn file font
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
