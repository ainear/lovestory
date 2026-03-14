"use client";

import React, { useRef, useCallback } from "react";
import { useNode, UserComponent } from "@craftjs/core";

/* ── Craft.js Image Component ──
 * Drag-drop, resize, click-to-replace image
 * Supports upload via file input or URL
 */

interface CraftImageProps {
    src: string;
    objectFit: "cover" | "contain" | "fill";
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    opacity: number;
    shadow: boolean;
}

export const CraftImage: UserComponent<CraftImageProps> = ({
    src, objectFit, borderRadius, borderWidth, borderColor, opacity, shadow,
}) => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp },
    } = useNode((state) => ({
        selected: state.events.selected,
    }));

    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Create local preview immediately
        const localUrl = URL.createObjectURL(file);
        setProp((p: CraftImageProps) => { p.src = localUrl; });
        // TODO: Upload to S3/Supabase storage and replace with permanent URL
        e.target.value = "";
    }, [setProp]);

    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            style={{
                position: "relative",
                cursor: selected ? "move" : "pointer",
                outline: selected ? "2px solid #3b82f6" : "none",
                outlineOffset: 2,
                borderRadius: borderRadius + 2,
                transition: "outline 0.15s",
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src || "/placeholder-couple.png"}
                alt="Template image"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit,
                    borderRadius,
                    border: `${borderWidth}px solid ${borderColor}`,
                    opacity,
                    boxShadow: shadow ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
                    display: "block",
                }}
                onDoubleClick={() => fileRef.current?.click()}
            />

            {/* Replace overlay on select */}
            {selected && (
                <button
                    onClick={() => fileRef.current?.click()}
                    style={{
                        position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                        padding: "4px 12px", borderRadius: 6, border: "none",
                        background: "rgba(0,0,0,0.6)", color: "#fff",
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    📷 Thay ảnh
                </button>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </div>
    );
};

CraftImage.craft = {
    displayName: "Image",
    props: {
        src: "/placeholder-couple.png",
        objectFit: "cover" as const,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#f9a8d4",
        opacity: 1,
        shadow: false,
    },
    related: {
        settings: CraftImageSettings,
    },
};

/* ── Settings panel for Image ── */
function CraftImageSettings() {
    const {
        actions: { setProp },
        borderRadius, borderWidth, borderColor, objectFit, opacity, shadow,
    } = useNode((node) => ({
        borderRadius: node.data.props.borderRadius,
        borderWidth: node.data.props.borderWidth,
        borderColor: node.data.props.borderColor,
        objectFit: node.data.props.objectFit,
        opacity: node.data.props.opacity,
        shadow: node.data.props.shadow,
    }));

    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            {/* Replace Image */}
            <button
                onClick={() => fileRef.current?.click()}
                style={{
                    padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                    background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: "#374151",
                }}
            >
                📷 Thay ảnh mới
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const url = URL.createObjectURL(file);
                        setProp((p: CraftImageProps) => { p.src = url; });
                    }
                    e.target.value = "";
                }}
                style={{ display: "none" }}
            />

            {/* Border Radius */}
            <label style={labelStyle}>
                Bo góc
                <input
                    type="range" min={0} max={50} value={borderRadius}
                    onChange={(e) => setProp((p: CraftImageProps) => { p.borderRadius = Number(e.target.value); })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{borderRadius}px</span>
            </label>

            {/* Border Width */}
            <label style={labelStyle}>
                Viền
                <input
                    type="range" min={0} max={10} value={borderWidth}
                    onChange={(e) => setProp((p: CraftImageProps) => { p.borderWidth = Number(e.target.value); })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{borderWidth}px</span>
            </label>

            {/* Border Color */}
            <label style={labelStyle}>
                Màu viền
                <input
                    type="color" value={borderColor}
                    onChange={(e) => setProp((p: CraftImageProps) => { p.borderColor = e.target.value; })}
                />
            </label>

            {/* Fit Mode */}
            <label style={labelStyle}>
                Kiểu hiển thị
                <select
                    value={objectFit}
                    onChange={(e) => setProp((p: CraftImageProps) => { p.objectFit = e.target.value as "cover" | "contain" | "fill"; })}
                    style={selectStyle}
                >
                    <option value="cover">Cover (lấp đầy)</option>
                    <option value="contain">Contain (vừa khung)</option>
                    <option value="fill">Fill (kéo giãn)</option>
                </select>
            </label>

            {/* Opacity */}
            <label style={labelStyle}>
                Độ mờ
                <input
                    type="range" min={0} max={100} value={Math.round(opacity * 100)}
                    onChange={(e) => setProp((p: CraftImageProps) => { p.opacity = Number(e.target.value) / 100; })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{Math.round(opacity * 100)}%</span>
            </label>

            {/* Shadow */}
            <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <input
                    type="checkbox" checked={shadow}
                    onChange={(e) => setProp((p: CraftImageProps) => { p.shadow = e.target.checked; })}
                />
                Bóng đổ
            </label>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 4,
    fontSize: 12, fontWeight: 600, color: "#6b7280",
};
const valueStyle: React.CSSProperties = { fontSize: 11, color: "#9ca3af", fontWeight: 400 };
const selectStyle: React.CSSProperties = {
    padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb",
    fontSize: 12, background: "#fff",
};
