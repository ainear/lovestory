"use client";

import { useRef } from "react";
import { ImageIcon, Plus } from "lucide-react";
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
    const pendingReplaceId = useRef<string | null>(null);

    // Only show image elements that have a src
    const imageEls = elements.filter(el => el.type === "image");

    if (imageEls.length === 0) return null;

    const handleAddClick = () => fileInputRef.current?.click();

    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        onAddImage(url, file);
        e.target.value = "";
    };

    const handleThumbnailClick = (el: CanvasElement) => {
        onSelectElement(el.id);
        // If already selected → trigger replace
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

    return (
        <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(8px)",
            borderTop: "1px solid #e5e7eb",
            boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
        }}>
            <div style={{
                display: "flex", alignItems: "center", gap: 0,
                padding: "6px 10px",
                overflowX: "auto",
                scrollbarWidth: "none",
            }}>
                {/* Label */}
                <div style={{
                    fontSize: 10, fontWeight: 700, color: "#9ca3af",
                    letterSpacing: 0.5, textTransform: "uppercase",
                    whiteSpace: "nowrap", marginRight: 8,
                    display: "flex", alignItems: "center", gap: 4,
                }}>
                    <ImageIcon size={11} />
                    Thay ảnh nhanh
                </div>

                {/* Image thumbnails */}
                {imageEls.map(el => {
                    const isSelected = el.id === selectedId;
                    const src = el.props.src;
                    return (
                        <button
                            key={el.id}
                            onClick={() => handleThumbnailClick(el)}
                            title={isSelected ? "Click lần 2 để đổi ảnh" : "Click để chọn ảnh này"}
                            style={{
                                width: 52, height: 52,
                                minWidth: 52,
                                borderRadius: 8,
                                border: isSelected ? "2.5px solid #ff6b9d" : "2px solid #e5e7eb",
                                overflow: "hidden",
                                cursor: "pointer",
                                background: "#f3f4f6",
                                padding: 0,
                                marginRight: 6,
                                position: "relative",
                                flexShrink: 0,
                                transition: "all 0.15s",
                                boxShadow: isSelected ? "0 0 0 3px rgba(255,107,157,0.2)" : "none",
                            }}
                        >
                            {src ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={src} alt=""
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db" }}>
                                    <ImageIcon size={16} />
                                </div>
                            )}
                            {/* "Đổi ảnh" hover overlay */}
                            {isSelected && (
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "rgba(255,107,157,0.15)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 9, fontWeight: 700, color: "#ff6b9d",
                                }}>
                                    ĐỔI
                                </div>
                            )}
                        </button>
                    );
                })}

                {/* Add new image button */}
                <button
                    onClick={handleAddClick}
                    title="Thêm ảnh mới"
                    style={{
                        width: 52, height: 52, minWidth: 52,
                        borderRadius: 8,
                        border: "2px dashed #d1d5db",
                        background: "#f9fafb",
                        cursor: "pointer",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 2, color: "#9ca3af",
                        flexShrink: 0,
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff6b9d"; (e.currentTarget as HTMLButtonElement).style.color = "#ff6b9d"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; }}
                >
                    <Plus size={16} />
                    <span style={{ fontSize: 9, fontWeight: 700 }}>THÊM</span>
                </button>
            </div>

            {/* Hidden file inputs */}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddFile} />
            <input ref={replaceInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReplaceFile} />
        </div>
    );
}
