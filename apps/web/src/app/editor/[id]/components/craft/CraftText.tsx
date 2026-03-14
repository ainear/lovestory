"use client";

import React, { useCallback } from "react";
import { useNode, UserComponent } from "@craftjs/core";

/* ── Craft.js Text Component ──
 * Fully editable: drag, resize, inline edit
 * Controlled via useNode hooks + setProp
 */

interface CraftTextProps {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    textAlign: "left" | "center" | "right";
    lineHeight: number;
    letterSpacing: number;
    opacity: number;
}

export const CraftText: UserComponent<CraftTextProps> = ({
    text, fontSize, fontFamily, fontWeight, fontStyle, color,
    textAlign, lineHeight, letterSpacing, opacity,
}) => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp },
    } = useNode((state) => ({
        selected: state.events.selected,
    }));

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        const newText = (e.target as HTMLElement).innerText;
        setProp((props: CraftTextProps) => {
            props.text = newText;
        });
    }, [setProp]);

    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            style={{
                padding: "4px 8px",
                cursor: selected ? "move" : "pointer",
                outline: selected ? "2px solid #3b82f6" : "none",
                outlineOffset: 2,
                borderRadius: 4,
                minHeight: 24,
                position: "relative",
                transition: "outline 0.15s",
            }}
        >
            <div
                contentEditable={selected}
                suppressContentEditableWarning
                onInput={handleInput}
                style={{
                    fontSize,
                    fontFamily,
                    fontWeight,
                    fontStyle,
                    color,
                    textAlign,
                    lineHeight,
                    letterSpacing,
                    opacity,
                    outline: "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            >
                {text}
            </div>
        </div>
    );
};

CraftText.craft = {
    displayName: "Text",
    props: {
        text: "Nhập nội dung",
        fontSize: 16,
        fontFamily: "'Inter', sans-serif",
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#1f2937",
        textAlign: "center" as const,
        lineHeight: 1.5,
        letterSpacing: 0,
        opacity: 1,
    },
    related: {
        settings: CraftTextSettings,
    },
};

/* ── Settings panel rendered when text is selected ── */
function CraftTextSettings() {
    const {
        actions: { setProp },
        fontSize, fontFamily, fontWeight, color, textAlign, opacity,
    } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        fontFamily: node.data.props.fontFamily,
        fontWeight: node.data.props.fontWeight,
        color: node.data.props.color,
        textAlign: node.data.props.textAlign,
        opacity: node.data.props.opacity,
    }));

    const FONTS = [
        "'Inter', sans-serif",
        "'Dancing Script', cursive",
        "'Great Vibes', cursive",
        "'Playfair Display', serif",
        "'Cormorant Garamond', serif",
        "'Lora', serif",
        "'Pacifico', cursive",
        "'Be Vietnam Pro', sans-serif",
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            {/* Font Size */}
            <label style={labelStyle}>
                Cỡ chữ
                <input
                    type="range" min={8} max={72} value={fontSize}
                    onChange={(e) => setProp((p: CraftTextProps) => { p.fontSize = Number(e.target.value); })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{fontSize}px</span>
            </label>

            {/* Font Family */}
            <label style={labelStyle}>
                Font
                <select
                    value={fontFamily}
                    onChange={(e) => setProp((p: CraftTextProps) => { p.fontFamily = e.target.value; })}
                    style={selectStyle}
                >
                    {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f.split("'")[1] || f}</option>)}
                </select>
            </label>

            {/* Color */}
            <label style={labelStyle}>
                Màu chữ
                <input
                    type="color" value={color}
                    onChange={(e) => setProp((p: CraftTextProps) => { p.color = e.target.value; })}
                />
            </label>

            {/* Weight */}
            <label style={labelStyle}>
                Đậm
                <select
                    value={fontWeight}
                    onChange={(e) => setProp((p: CraftTextProps) => { p.fontWeight = e.target.value; })}
                    style={selectStyle}
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="100">Thin</option>
                    <option value="300">Light</option>
                    <option value="500">Medium</option>
                    <option value="700">Bold</option>
                    <option value="900">Black</option>
                </select>
            </label>

            {/* Alignment */}
            <label style={labelStyle}>
                Căn lề
                <div style={{ display: "flex", gap: 4 }}>
                    {(["left", "center", "right"] as const).map(a => (
                        <button
                            key={a}
                            onClick={() => setProp((p: CraftTextProps) => { p.textAlign = a; })}
                            style={{
                                ...btnStyle,
                                background: textAlign === a ? "#3b82f6" : "#f3f4f6",
                                color: textAlign === a ? "#fff" : "#374151",
                            }}
                        >
                            {a === "left" ? "◀" : a === "center" ? "◆" : "▶"}
                        </button>
                    ))}
                </div>
            </label>

            {/* Opacity */}
            <label style={labelStyle}>
                Độ mờ
                <input
                    type="range" min={0} max={100} value={Math.round(opacity * 100)}
                    onChange={(e) => setProp((p: CraftTextProps) => { p.opacity = Number(e.target.value) / 100; })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{Math.round(opacity * 100)}%</span>
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
const btnStyle: React.CSSProperties = {
    padding: "6px 12px", borderRadius: 6, border: "none",
    cursor: "pointer", fontSize: 11, fontWeight: 600,
};
