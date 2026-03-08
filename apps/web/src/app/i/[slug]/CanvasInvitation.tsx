"use client";

/**
 * CanvasInvitation — renders a canvas_json blob as a scrollable, public invitation.
 * This is the output view from the Visual Canvas Editor.
 * Elements are rendered with position:absolute inside a 390px-wide card, full-height.
 */

import { useMemo } from "react";

export interface CanvasElementData {
    id: string;
    type: "text" | "image" | "sticker" | "shape";
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    zIndex: number;
    locked: boolean;
    props: {
        // text
        text?: string;
        fontSize?: number;
        fontFamily?: string;
        color?: string;
        textAlign?: "left" | "center" | "right";
        fontWeight?: "normal" | "bold";
        fontStyle?: "normal" | "italic";
        lineHeight?: number;
        // image
        src?: string;
        objectFit?: "cover" | "contain";
        borderRadius?: number;
        opacity?: number;
    };
}

export interface CanvasData {
    version: number;
    canvas: { width: number; height: number; bg: string };
    elements: CanvasElementData[];
}

interface CanvasInvitationProps {
    canvasJson: string;
    guestName?: string;
}

function parseCanvasJson(raw: string): CanvasData | null {
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function CanvasInvitation({ canvasJson, guestName }: CanvasInvitationProps) {
    const data = useMemo(() => parseCanvasJson(canvasJson), [canvasJson]);

    if (!data) return null;

    const { canvas, elements } = data;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const CARD_WIDTH = 390;

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 0 48px",
        }}>
            {/* Google Fonts preload */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;1,400&family=Inter:wght@400;600;700&display=swap');
            `}</style>

            {/* Guest name banner */}
            {guestName && (
                <div style={{
                    marginBottom: 16,
                    background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                    color: "#fff",
                    padding: "8px 24px",
                    borderRadius: 24,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: "0 4px 12px rgba(255,107,157,0.35)",
                }}>
                    💌 Kính gửi: {guestName}
                </div>
            )}

            {/* Canvas card */}
            <div style={{
                position: "relative",
                width: CARD_WIDTH,
                minHeight: canvas.height,
                background: canvas.bg,
                boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
                borderRadius: 8,
                overflow: "visible",
            }}>
                {sorted.map((el) => {
                    if (el.type === "text") {
                        const p = el.props;
                        return (
                            <div
                                key={el.id}
                                style={{
                                    position: "absolute",
                                    left: el.x,
                                    top: el.y,
                                    width: el.width,
                                    minHeight: el.height,
                                    zIndex: el.zIndex,
                                    opacity: el.opacity,
                                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                                    fontSize: p.fontSize ?? 24,
                                    fontFamily: p.fontFamily ?? "serif",
                                    color: p.color ?? "#1f2937",
                                    textAlign: p.textAlign ?? "center",
                                    fontWeight: p.fontWeight ?? "normal",
                                    fontStyle: p.fontStyle ?? "normal",
                                    lineHeight: p.lineHeight ?? 1.4,
                                    padding: "2px 4px",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    boxSizing: "border-box",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                }}
                            >
                                {p.text ?? ""}
                            </div>
                        );
                    }

                    if (el.type === "image") {
                        const p = el.props;
                        if (!p.src) return null;
                        return (
                            <div
                                key={el.id}
                                style={{
                                    position: "absolute",
                                    left: el.x,
                                    top: el.y,
                                    width: el.width,
                                    height: el.height,
                                    zIndex: el.zIndex,
                                    borderRadius: p.borderRadius ?? 12,
                                    overflow: "hidden",
                                    opacity: p.opacity ?? el.opacity,
                                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={p.src}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: p.objectFit ?? "cover",
                                        display: "block",
                                    }}
                                />
                            </div>
                        );
                    }

                    return null;
                })}
            </div>

            {/* Bottom share bar */}
            <div style={{
                marginTop: 24, display: "flex", gap: 12, alignItems: "center",
            }}>
                <button
                    onClick={() => navigator.share?.({ url: window.location.href })}
                    style={{
                        padding: "10px 20px", borderRadius: 12,
                        background: "linear-gradient(135deg, #ff6b9d, #c084fc)",
                        border: "none", color: "#fff", fontSize: 14,
                        fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: "0 4px 12px rgba(255,107,157,0.3)",
                    }}
                >
                    💌 Chia sẻ thiệp
                </button>
                <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                    style={{
                        padding: "10px 16px", borderRadius: 12,
                        background: "#fff", border: "1px solid #e5e7eb",
                        color: "#374151", fontSize: 14, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    🔗 Sao chép link
                </button>
            </div>
        </div>
    );
}
