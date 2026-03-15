"use client";

import React from "react";
import { useNode, useEditor, UserComponent } from "@craftjs/core";

/* ══════════════════════════════════════════
   CraftShape — Basic geometric shapes via SVG
   Types: rectangle, circle, triangle, star, heart, line, diamond
   ══════════════════════════════════════════ */

interface CraftShapeProps {
    shapeType: string;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    rotation: number;
}

const SHAPE_TYPES = [
    { id: "rectangle", label: "Hình chữ nhật", icon: "▬" },
    { id: "circle", label: "Hình tròn", icon: "●" },
    { id: "triangle", label: "Tam giác", icon: "▲" },
    { id: "star", label: "Ngôi sao", icon: "★" },
    { id: "heart", label: "Trái tim", icon: "♥" },
    { id: "line", label: "Đường thẳng", icon: "—" },
    { id: "diamond", label: "Kim cương", icon: "◆" },
] as const;

function renderShapeSvg(shapeType: string, fill: string, stroke: string, strokeWidth: number): string {
    switch (shapeType) {
        case "rectangle":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="${strokeWidth}" y="${strokeWidth}" width="${100 - strokeWidth * 2}" height="${100 - strokeWidth * 2}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
        case "circle":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="${48 - strokeWidth}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
        case "triangle":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,95 5,95" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`;
        case "star":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`;
        case "heart":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 88 C30 65 8 50 8 30 C8 15 18 8 28 8 C36 8 44 14 50 22 C56 14 64 8 72 8 C82 8 92 15 92 30 C92 50 70 65 50 88Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
        case "line":
            return `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="10" x2="195" y2="10" stroke="${stroke || fill}" stroke-width="${Math.max(strokeWidth, 2)}" stroke-linecap="round"/></svg>`;
        case "diamond":
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`;
        default:
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="96" height="96" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    }
}

export const CraftShape: UserComponent<CraftShapeProps> = ({
    shapeType, fill, stroke, strokeWidth, opacity, rotation,
}) => {
    const {
        connectors: { connect, drag },
        selected,
        id,
    } = useNode((state) => ({
        selected: state.events.selected,
    }));

    const { actions: editorActions, query } = useEditor();

    const svgStr = renderShapeSvg(shapeType, fill, stroke, strokeWidth);

    const handleDuplicate = React.useCallback(() => {
        try {
            const node = query.node(id).get();
            const parentId = node.data.parent;
            if (!parentId) return;
            const freshNode = query.createNode(
                React.createElement(CraftShape, { ...node.data.props } as CraftShapeProps)
            );
            editorActions.add(freshNode, parentId);
        } catch { /* noop */ }
    }, [id, query, editorActions]);

    const handleDelete = React.useCallback(() => {
        try { editorActions.delete(id); } catch { /* noop */ }
    }, [id, editorActions]);

    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            style={{
                position: "relative",
                cursor: selected ? "move" : "pointer",
                opacity,
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                transition: "outline 0.15s",
            }}
        >
            <div dangerouslySetInnerHTML={{ __html: svgStr }} style={{ width: "100%", height: "100%" }} />

            {/* ── Floating Toolbar ── */}
            {selected && (
                <>
                    <div style={{
                        position: "absolute", inset: -2,
                        border: "2px dashed #3b82f6",
                        borderRadius: 4,
                        pointerEvents: "none",
                    }} />
                    <div
                        style={{
                            position: "absolute", top: -36, left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex", gap: 2,
                            background: "#1f2937",
                            borderRadius: 8,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                            padding: "4px 6px",
                            zIndex: 20,
                            whiteSpace: "nowrap",
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <button onClick={handleDuplicate} style={toolbarBtn} title="Nhân bản">📋</button>
                        <button onClick={handleDelete} style={{ ...toolbarBtn, color: "#fca5a5" }} title="Xóa">🗑️</button>
                    </div>
                </>
            )}
        </div>
    );
};

/* ── Settings Panel ── */
function CraftShapeSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode((n) => ({ props: n.data.props as CraftShapeProps }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "8px 0" }}>
            {/* Shape type selector */}
            <div style={sectionStyle}>
                <p style={sectionLabel}>Loại hình</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                    {SHAPE_TYPES.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setProp((p: CraftShapeProps) => { p.shapeType = s.id; })}
                            style={{
                                ...shapeBtn,
                                background: props.shapeType === s.id ? "#3b82f6" : "#f9fafb",
                                color: props.shapeType === s.id ? "#fff" : "#374151",
                                borderColor: props.shapeType === s.id ? "#3b82f6" : "#e5e7eb",
                            }}
                            title={s.label}
                        >
                            {s.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fill color */}
            <div style={sectionStyle}>
                <p style={sectionLabel}>Màu sắc</p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <label style={colorLabel}>
                        Tô màu
                        <input
                            type="color"
                            value={props.fill}
                            onChange={(e) => setProp((p: CraftShapeProps) => { p.fill = e.target.value; })}
                            style={colorInput}
                        />
                    </label>
                    <label style={colorLabel}>
                        Viền
                        <input
                            type="color"
                            value={props.stroke}
                            onChange={(e) => setProp((p: CraftShapeProps) => { p.stroke = e.target.value; })}
                            style={colorInput}
                        />
                    </label>
                </div>
            </div>

            {/* Stroke width */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={sliderLabel}>Độ rộng viền</span>
                <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={props.strokeWidth}
                    onChange={(e) => setProp((p: CraftShapeProps) => { p.strokeWidth = Number(e.target.value); })}
                    style={{ flex: 1, accentColor: "#3b82f6" }}
                />
                <span style={valueLabel}>{props.strokeWidth}px</span>
            </div>

            {/* Opacity */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={sliderLabel}>Trong suốt</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(props.opacity * 100)}
                    onChange={(e) => setProp((p: CraftShapeProps) => { p.opacity = Number(e.target.value) / 100; })}
                    style={{ flex: 1, accentColor: "#3b82f6" }}
                />
                <span style={valueLabel}>{Math.round(props.opacity * 100)}%</span>
            </div>

            {/* Rotation */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={sliderLabel}>Xoay</span>
                <input
                    type="number"
                    min={0}
                    max={360}
                    value={props.rotation}
                    onChange={(e) => setProp((p: CraftShapeProps) => { p.rotation = Number(e.target.value) % 360; })}
                    style={{
                        width: 60, padding: "4px 6px", border: "1px solid #e5e7eb",
                        borderRadius: 6, fontSize: 12, textAlign: "center",
                    }}
                />
                <span style={valueLabel}>{props.rotation}°</span>
            </div>
        </div>
    );
}

CraftShape.craft = {
    displayName: "CraftShape",
    props: {
        shapeType: "rectangle",
        fill: "#f9a8d4",
        stroke: "#ec4899",
        strokeWidth: 2,
        opacity: 1,
        rotation: 0,
    },
    related: {
        settings: CraftShapeSettings,
    },
};

/* ── Styles ── */
const toolbarBtn: React.CSSProperties = {
    padding: "4px 8px", borderRadius: 6,
    border: "none", background: "transparent",
    cursor: "pointer", fontSize: 14, color: "#fff",
};
const sectionStyle: React.CSSProperties = {
    background: "#fafafa", borderRadius: 8, padding: 12,
    border: "1px solid #f0f0f0",
};
const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "#374151", margin: "0 0 8px",
    textTransform: "uppercase", letterSpacing: 0.8,
};
const shapeBtn: React.CSSProperties = {
    padding: "8px", borderRadius: 8, border: "1px solid #e5e7eb",
    cursor: "pointer", fontSize: 16, fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
};
const colorLabel: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 11, color: "#6b7280", fontWeight: 600,
};
const colorInput: React.CSSProperties = {
    width: 28, height: 28, border: "1px solid #e5e7eb",
    borderRadius: 6, cursor: "pointer",
};
const sliderLabel: React.CSSProperties = {
    fontSize: 11, color: "#6b7280", fontWeight: 600, minWidth: 75,
};
const valueLabel: React.CSSProperties = {
    fontSize: 11, color: "#9ca3af", minWidth: 35,
};
