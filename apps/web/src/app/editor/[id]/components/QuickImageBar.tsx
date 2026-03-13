"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import type { CanvasElement } from "./useCanvasReducer";

interface QuickImageBarProps {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelectElement: (id: string) => void;
    onReplaceImage: (id: string, src: string) => void;
    onAddImage: (src: string, file: File) => void;
}

export function QuickImageBar({ elements, selectedId, onSelectElement, onReplaceImage }: QuickImageBarProps) {
    const replaceInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pendingReplaceId = useRef<string | null>(null);
    const [expanded, setExpanded] = useState(true);

    const imageEls = elements.filter(el => el.type === "image");
    if (imageEls.length === 0) return null;

    const handleThumbnailClick = (el: CanvasElement) => {
        onSelectElement(el.id);
        // Single click = select + open file picker for replace
        pendingReplaceId.current = el.id;
        replaceInputRef.current?.click();
    };

    const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pendingReplaceId.current) return;
        const url = URL.createObjectURL(file);
        onReplaceImage(pendingReplaceId.current, url);
        pendingReplaceId.current = null;
        e.target.value = "";
    };

    const scroll = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
    };

    return (
        <div style={{
            position: "absolute",
            bottom: 12, left: 80,
            zIndex: 50,
        }}>
            {/* Toggle button — Cinelove style */}
            <button
                onClick={() => setExpanded(v => !v)}
                style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.95)", border: "1px solid #e5e7eb",
                    borderRadius: expanded ? "10px 10px 0 0" : 10,
                    padding: "7px 14px", cursor: "pointer",
                    fontSize: 13, fontWeight: 600, color: "#374151",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s ease",
                }}
            >
                Thay ảnh nhanh
                <ChevronDown
                    size={14}
                    style={{
                        transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: "transform 0.2s ease",
                        color: "#9ca3af",
                    }}
                />
            </button>

            {/* Thumbnail carousel — Cinelove style */}
            {expanded && (
                <div style={{
                    display: "flex", alignItems: "center",
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "0 10px 10px 10px",
                    border: "1px solid #e5e7eb",
                    borderTop: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    padding: "8px 4px",
                    position: "relative",
                }}>
                    {/* Left scroll */}
                    <button
                        onClick={() => scroll("left")}
                        style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "#fff", border: "1px solid #e5e7eb",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, marginLeft: 2, marginRight: 2,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}
                    >
                        <ChevronLeft size={14} color="#6b7280" />
                    </button>

                    {/* Scrollable thumbnails */}
                    <div
                        ref={scrollRef}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            maxWidth: 480,
                        }}
                    >
                        {imageEls.map(el => {
                            const isSelected = el.id === selectedId;
                            const src = el.props.src;
                            return (
                                <button
                                    key={el.id}
                                    onClick={() => handleThumbnailClick(el)}
                                    title="Click để thay ảnh"
                                    style={{
                                        width: 80, height: 72, minWidth: 80,
                                        borderRadius: 8,
                                        border: isSelected ? "2.5px solid #ff6b9d" : "1.5px solid #e5e7eb",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        background: "#f3f4f6",
                                        padding: 0,
                                        transition: "all 0.15s",
                                        boxShadow: isSelected ? "0 0 0 3px rgba(255,107,157,0.15)" : "none",
                                        position: "relative",
                                        flexShrink: 0,
                                    }}
                                >
                                    {src ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 20 }}>
                                            🖼️
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "rgba(0,0,0,0.3)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        opacity: 0, transition: "opacity 0.15s",
                                        borderRadius: 6,
                                    }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}
                                    >
                                        <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.5, textTransform: "uppercase" }}>Đổi ảnh</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right scroll */}
                    <button
                        onClick={() => scroll("right")}
                        style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "#fff", border: "1px solid #e5e7eb",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, marginLeft: 2, marginRight: 2,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}
                    >
                        <ChevronRight size={14} color="#6b7280" />
                    </button>
                </div>
            )}

            {/* Hidden file input for replace */}
            <input ref={replaceInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReplaceFile} />
        </div>
    );
}
