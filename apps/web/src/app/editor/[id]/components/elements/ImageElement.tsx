"use client";

import type { CanvasElement } from "../useCanvasReducer";
import { useScrollObserver } from "../useScrollObserver";

interface ImageElementProps {
    element: CanvasElement;
    zoom: number;
    isSelected: boolean;
    onSelect: () => void;
}

export function ImageElement({ element, zoom, isSelected, onSelect }: ImageElementProps) {
    const scale = zoom / 100;
    const p = element.props;

    const { ref: observerRef, hasIntersected } = useScrollObserver();

    // Build combined CSS filter from per-channel sliders + preset
    const brightness = p.brightness ?? 100;
    const contrast = p.contrast ?? 100;
    const saturation = p.saturation ?? 100;
    const hasAdjustments = brightness !== 100 || contrast !== 100 || saturation !== 100;
    const presetFilter = p.filter ?? "";
    const filterCss = [
        hasAdjustments ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` : "",
        presetFilter,
    ].filter(Boolean).join(" ") || undefined;

    // Loop animation
    const animationStyle: React.CSSProperties = {};
    const loop = element.animation?.loop;
    if (loop === "pulse") {
        animationStyle.animation = "el-pulse 2s ease-in-out infinite";
    } else if (loop === "float") {
        animationStyle.animation = "el-float 3s ease-in-out infinite";
    } else if (loop === "shake") {
        animationStyle.animation = "el-shake 0.5s ease-in-out infinite";
    }

    const entrance = element.animation?.entrance;
    const hasEntrance = entrance && entrance !== "none";
    const entranceClass = hasEntrance && hasIntersected ? `animate-entrance-${entrance}` : "";
    const shouldHideImage = hasEntrance && !hasIntersected;

    return (
        <div
            data-element-id={element.id}
            ref={observerRef}
            className={entranceClass}
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
                opacity: shouldHideImage ? 0 : element.opacity,
                cursor: "pointer",
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                background: p.src ? undefined : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                border: (p.borderWidth ?? 0) > 0 ? `${(p.borderWidth ?? 0) * scale}px solid ${p.borderColor ?? "#ffffff"}` : undefined,
                ...animationStyle,
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
                        filter: filterCss,
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
