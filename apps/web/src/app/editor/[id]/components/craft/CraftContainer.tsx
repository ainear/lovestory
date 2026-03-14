"use client";

import React from "react";
import { useNode, Element, UserComponent } from "@craftjs/core";

/* ── Craft.js Container / Section Component ──
 * Droppable region for text, images, widgets
 * Styled with background, padding, alignment
 */

interface CraftContainerProps {
    background: string;
    padding: number;
    minHeight: number;
    flexDirection: "column" | "row";
    alignItems: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
    gap: number;
    children?: React.ReactNode;
}

export const CraftContainer: UserComponent<CraftContainerProps> = ({
    background, padding, minHeight, flexDirection, alignItems, justifyContent, gap, children,
}) => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            style={{
                background,
                padding,
                minHeight,
                display: "flex",
                flexDirection,
                alignItems,
                justifyContent,
                gap,
                width: "100%",
                outline: selected ? "2px dashed #3b82f6" : "none",
                outlineOffset: -2,
                borderRadius: 4,
                transition: "outline 0.15s",
                cursor: selected ? "move" : "default",
            }}
        >
            {children}
        </div>
    );
};

CraftContainer.craft = {
    displayName: "Section",
    props: {
        background: "transparent",
        padding: 16,
        minHeight: 100,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 8,
    },
    rules: {
        canDrag: () => true,
    },
    related: {
        settings: CraftContainerSettings,
    },
};

/* ── Settings panel for Container ── */
function CraftContainerSettings() {
    const {
        actions: { setProp },
        background, padding, minHeight, gap,
    } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
        minHeight: node.data.props.minHeight,
        gap: node.data.props.gap,
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            {/* Background */}
            <label style={labelStyle}>
                Nền
                <input
                    type="color" value={background === "transparent" ? "#ffffff" : background}
                    onChange={(e) => setProp((p: CraftContainerProps) => { p.background = e.target.value; })}
                />
            </label>

            {/* Padding */}
            <label style={labelStyle}>
                Padding
                <input
                    type="range" min={0} max={64} value={padding}
                    onChange={(e) => setProp((p: CraftContainerProps) => { p.padding = Number(e.target.value); })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{padding}px</span>
            </label>

            {/* Min Height */}
            <label style={labelStyle}>
                Chiều cao tối thiểu
                <input
                    type="range" min={50} max={800} step={10} value={minHeight}
                    onChange={(e) => setProp((p: CraftContainerProps) => { p.minHeight = Number(e.target.value); })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{minHeight}px</span>
            </label>

            {/* Gap */}
            <label style={labelStyle}>
                Khoảng cách
                <input
                    type="range" min={0} max={48} value={gap}
                    onChange={(e) => setProp((p: CraftContainerProps) => { p.gap = Number(e.target.value); })}
                    style={{ width: "100%" }}
                />
                <span style={valueStyle}>{gap}px</span>
            </label>
        </div>
    );
}

/* ── Root Canvas Container — top-level drop zone ── */
export const RootContainer: UserComponent<{ background: string; children?: React.ReactNode }> = ({
    background, children,
}) => {
    const {
        connectors: { connect },
    } = useNode();

    return (
        <div
            ref={(ref) => { if (ref) connect(ref); }}
            style={{
                width: 390,
                minHeight: 5000,
                background,
                margin: "0 auto",
                position: "relative",
            }}
        >
            {children}
        </div>
    );
};

RootContainer.craft = {
    displayName: "Canvas",
    props: {
        background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
    },
    rules: {
        canDrag: () => false,
    },
};

const labelStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 4,
    fontSize: 12, fontWeight: 600, color: "#6b7280",
};
const valueStyle: React.CSSProperties = { fontSize: 11, color: "#9ca3af", fontWeight: 400 };
