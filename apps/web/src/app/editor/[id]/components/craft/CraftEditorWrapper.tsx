"use client";

import React, { useCallback, useState } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { CraftText } from "./CraftText";
import { CraftImage } from "./CraftImage";
import { CraftContainer, RootContainer } from "./CraftContainer";

/* ── CraftEditorWrapper ──
 * Main entry point that wraps everything in craft.js Editor context.
 * Provides: Toolbox, SettingsPanel, serialization, and the Frame/Canvas.
 *
 * This replaces the old custom Canvas.tsx rendering approach.
 */

interface CraftEditorWrapperProps {
    initialJson?: string;
    background: string;
    onSerialize?: (json: string) => void;
}

export function CraftEditorWrapper({ initialJson, background, onSerialize }: CraftEditorWrapperProps) {
    return (
        <Editor
            resolver={{ CraftText, CraftImage, CraftContainer, RootContainer }}
            enabled={true}
            onRender={RenderNode}
        >
            <CraftEditorInner initialJson={initialJson} background={background} onSerialize={onSerialize} />
        </Editor>
    );
}

/* ── Internal component with access to useEditor ── */
function CraftEditorInner({ initialJson, background, onSerialize }: CraftEditorWrapperProps) {
    const { actions, query, connectors, selected, enabled } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected: { id: string; name: string; settings: React.ComponentType | null; isDeletable: boolean } | undefined;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId]?.data?.name || "Unknown",
                settings: state.nodes[currentNodeId]?.related?.settings || null,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }

        return { selected, enabled: state.options.enabled };
    });

    // Serialize current state
    const handleSerialize = useCallback(() => {
        const json = query.serialize();
        onSerialize?.(json);
        return json;
    }, [query, onSerialize]);

    return (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* ── Canvas Area ── */}
            <div style={{
                flex: 1,
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                padding: "24px 0",
                background: "#e5e7eb",
            }}>
                <div style={{
                    width: 390,
                    minHeight: 5000,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                }}>
                    <Frame>
                        <Element
                            canvas
                            is={RootContainer}
                            background={background}
                        >
                            {/* Default template content — sections */}
                            <Element canvas is={CraftContainer} background="transparent" padding={20} minHeight={400} gap={12}>
                                <CraftText text="Le Thanh Hon" fontSize={22} fontFamily="'Cormorant Garamond', serif" fontWeight="normal" fontStyle="italic" color="#9f1239" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={1} />
                            </Element>

                            <Element canvas is={CraftContainer} background="transparent" padding={16} minHeight={200} gap={8}>
                                <CraftText text="Ten Chu Re" fontSize={36} fontFamily="'Dancing Script', cursive" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.2} letterSpacing={0} opacity={1} />
                                <CraftText text="&" fontSize={24} fontFamily="'Playfair Display', serif" fontWeight="normal" fontStyle="italic" color="#f472b6" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={0.8} />
                                <CraftText text="Ten Co Dau" fontSize={36} fontFamily="'Dancing Script', cursive" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.2} letterSpacing={0} opacity={1} />
                            </Element>

                            <Element canvas is={CraftContainer} background="transparent" padding={16} minHeight={280} gap={8} flexDirection="row">
                                <CraftImage src="/placeholder-groom.png" objectFit="cover" borderRadius={14} borderWidth={2} borderColor="#f9a8d4" opacity={1} shadow={false} />
                                <CraftImage src="/placeholder-bride.png" objectFit="cover" borderRadius={14} borderWidth={2} borderColor="#f9a8d4" opacity={1} shadow={false} />
                            </Element>

                            <Element canvas is={CraftContainer} background="transparent" padding={20} minHeight={150} gap={8}>
                                <CraftText text="Chu Nhat, 28 . 05 . 2026" fontSize={26} fontFamily="'Cormorant Garamond', serif" fontWeight="bold" fontStyle="normal" color="#831843" textAlign="center" lineHeight={1.3} letterSpacing={0} opacity={1} />
                                <CraftText text="Luc 10:00 sang" fontSize={16} fontFamily="'Lora', serif" fontWeight="normal" fontStyle="italic" color="#9f1239" textAlign="center" lineHeight={1.4} letterSpacing={0} opacity={0.85} />
                            </Element>
                        </Element>
                    </Frame>
                </div>
            </div>

            {/* ── Right Settings Panel ── */}
            <div style={{
                width: 260,
                background: "#fff",
                borderLeft: "1px solid #e5e7eb",
                overflowY: "auto",
                padding: 16,
                flexShrink: 0,
            }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
                    Tuy chinh
                </h3>

                {selected ? (
                    <div>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px" }}>
                            <span style={{
                                background: "#3b82f6", color: "#fff", fontSize: 10,
                                padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                            }}>
                                {selected.name}
                            </span>
                        </p>

                        {/* Render component-specific settings */}
                        {selected.settings && React.createElement(selected.settings)}

                        {/* Delete button */}
                        {selected.isDeletable && (
                            <button
                                onClick={() => actions.delete(selected.id)}
                                style={{
                                    width: "100%", padding: "8px 14px", borderRadius: 8,
                                    border: "1px solid #fca5a5", background: "#fef2f2",
                                    color: "#dc2626", fontSize: 12, fontWeight: 600,
                                    cursor: "pointer", marginTop: 16,
                                }}
                            >
                                🗑️ Xoa phan tu
                            </button>
                        )}
                    </div>
                ) : (
                    <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
                        Click vao phan tu de chinh sua
                    </p>
                )}

                {/* Serialize button for saving */}
                <button
                    onClick={handleSerialize}
                    style={{
                        width: "100%", padding: "8px 14px", borderRadius: 8,
                        border: "1px solid #e5e7eb", background: "#f9fafb",
                        color: "#374151", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", marginTop: 24,
                    }}
                >
                    💾 Luu trang thai
                </button>
            </div>
        </div>
    );
}

/* ── Custom Render Node — adds hover indicator ── */
function RenderNode({ render }: { render: React.ReactElement }) {
    return <>{render}</>;
}
