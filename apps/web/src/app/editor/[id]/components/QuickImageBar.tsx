"use client";

import { useRef, useState } from "react";
import { ImageIcon, Plus, ChevronDown, ChevronRight, X } from "lucide-react";
import type { CanvasElement } from "./useCanvasReducer";

interface QuickImageBarProps {
    elements: CanvasElement[];
    selectedId: string | null;
    onSelectElement: (id: string) => void;
    onReplaceImage: (id: string, src: string) => void;
    onAddImage: (src: string, file: File) => void;
}

export function QuickImageBar({ elements, selectedId, onSelectElement, onReplaceImage, onAddImage }: QuickImageBarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pendingReplaceId = useRef<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    const imageEls = elements.filter(el => el.type === "image");
    if (imageEls.length === 0) return null;

    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        onAddImage(url, file);
        e.target.value = "";
    };

    const handleThumbnailClick = (el: CanvasElement) => {
        onSelectElement(el.id);
        if (el.id === selectedId) {
            pendingReplaceId.current = el.id;
            replaceInputRef.current?.click();
        }
    };

    const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pendingReplaceId.current) return;
        const url = URL.createObjectURL(file);
        onReplaceImage(pendingReplaceId.current, url);
        pendingReplaceId.current = null;
        e.target.value = "";
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 180, behavior: "smooth" });
    };

    return (
        <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid #e5e7eb",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
        }}>
            {/* Header row with toggle */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 12px 2px",
            }}>
                <button
                    onClick={() => setCollapsed(v => !v)}
                    style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 11, fontWeight: 700, color: "#6b7280",
                        letterSpacing: 0.4, textTransform: "uppercase", padding: 0,
                    }}
                >
                    <ImageIcon size={11} />
                    Thay ảnh nhanh
                    <ChevronDown
                        size={12}
                        style={{
                            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            color: "#9ca3af",
                        }}
                    />
                </button>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{imageEls.length} ảnh</span>
            </div>

            {/* Thumbnails row */}
            {!collapsed && (
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <div
                        ref={scrollRef}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "4px 12px 8px",
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            flex: 1,
                        }}
                    >
                        {imageEls.map(el => {
                            const isSelected = el.id === selectedId;
                            const src = el.props.src;
                            return (
                                <div key={el.id} style={{ position: "relative", flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleThumbnailClick(el)}
                                        title={isSelected ? "Click lần 2 để đổi ảnh" : "Click để chọn"}
                                        style={{
                                            width: 42, height: 42,
                                            borderRadius: 8,
                                            border: isSelected ? "2.5px solid #ff6b9d" : "1.5px solid #e5e7eb",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            background: "#f3f4f6",
                                            padding: 0,
                                            transition: "all 0.15s",
                                            boxShadow: isSelected ? "0 0 0 3px rgba(255,107,157,0.15)" : "none",
                                        }}
                                    >
                                        {src ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db" }}>
                                                <ImageIcon size={14} />
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div style={{
                                                position: "absolute", inset: 0,
                                                background: "rgba(255,107,157,0.12)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 8, fontWeight: 800, color: "#ff6b9d",
                                                letterSpacing: 0.5,
                                            }}>ĐỔI</div>
                                        )}
                                    </button>
                                    {/* Delete × on hover */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); /* TODO: dispatch delete */ }}
                                        title="Xóa ảnh"
                                        style={{
                                            position: "absolute", top: -4, right: -4,
                                            width: 16, height: 16, borderRadius: "50%",
                                            background: "#ef4444", border: "1.5px solid #fff",
                                            cursor: "pointer", padding: 0,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            opacity: 0.7, transition: "opacity 0.15s",
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"; }}
                                    >
                                        <X size={9} color="#fff" />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Add new image */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Thêm ảnh mới"
                            style={{
                                width: 42, height: 42, minWidth: 42,
                                borderRadius: 8,
                                border: "1.5px dashed #d1d5db",
                                background: "#f9fafb",
                                cursor: "pointer",
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                gap: 1, color: "#9ca3af",
                                flexShrink: 0,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff6b9d"; (e.currentTarget as HTMLButtonElement).style.color = "#ff6b9d"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Overflow scroll arrow */}
                    {imageEls.length > 5 && (
                        <button
                            onClick={scrollRight}
                            style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "rgba(255,255,255,0.9)",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                                zIndex: 2,
                            }}
                        >
                            <ChevronRight size={14} color="#6b7280" />
                        </button>
                    )}
                </div>
            )}

            {/* Hidden file inputs */}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddFile} />
            <input ref={replaceInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReplaceFile} />
        </div>
    );
}
