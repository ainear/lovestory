"use client";

import type { CanvasElement } from "../useCanvasReducer";

interface ImageElementProps {
    element: CanvasElement;
    zoom: number;
    isSelected: boolean;
    onSelect: () => void;
}

export function ImageElement({ element, zoom, isSelected, onSelect }: ImageElementProps) {
    const scale = zoom / 100;
    const p = element.props;

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            style={{
                position: "absolute",
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                height: element.height * scale,
                zIndex: element.zIndex * 10,
                borderRadius: (p.borderRadius ?? 12) * scale,
                overflow: "hidden",
                opacity: p.opacity ?? element.opacity,
                cursor: "pointer",
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                background: p.src ? undefined : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
            }}
        >
            {p.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={p.src}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: p.objectFit ?? "cover",
                        display: "block",
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                    draggable={false}
                />
            ) : (
                <div style={{
                    width: "100%", height: "100%",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 8, color: "#9ca3af",
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span style={{ fontSize: 11 * scale }}>Nhấn để thêm ảnh</span>
                </div>
            )}
        </div>
    );
}
