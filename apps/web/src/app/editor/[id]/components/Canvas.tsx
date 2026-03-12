"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import type { CanvasElement, CanvasSection as SectionType, Action, ParticleEffect } from "./useCanvasReducer";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { WidgetElement } from "./elements/WidgetElement";
import { SelectionBox } from "./SelectionBox";

interface CanvasProps {
    width: number;
    height: number;
    background: string;
    sections: SectionType[];
    elements: CanvasElement[];
    selectedId: string | null;
    zoom: number;
    particleEffect: ParticleEffect;
    showGrid?: boolean;
    dispatch: (action: Action) => void;
}

export function Canvas({ width, height, background, sections, elements, selectedId, zoom, particleEffect, showGrid, dispatch }: CanvasProps) {
    const scale = zoom / 100;
    const canvasW = width * scale;

    const [editingId, setEditingId] = useState<string | null>(null);
    // Sprint 23: Hover highlight
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        if (editingId && editingId !== selectedId) {
            setEditingId(null);
        }
    }, [selectedId, editingId]);

    const handleCanvasClick = useCallback(() => {
        setEditingId(null);
        dispatch({ type: "SELECT", id: null });
    }, [dispatch]);

    const handleDoubleClick = useCallback((id: string, type: string) => {
        if (type === "text") {
            setEditingId(id);
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (editingId) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable) return;

            if (e.key === "Escape") {
                setEditingId(null);
                return;
            }
            if (e.key === "Delete" || e.key === "Backspace") {
                if (selectedId) dispatch({ type: "DELETE_ELEMENT", id: selectedId });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                dispatch({ type: "UNDO" });
            }
            if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault();
                dispatch({ type: "REDO" });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();
                if (selectedId) dispatch({ type: "DUPLICATE", id: selectedId });
            }
            if (selectedId && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                const el = elements.find(el => el.id === selectedId);
                if (!el) return;
                const step = e.shiftKey ? 10 : 1;
                const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
                const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
                dispatch({ type: "MOVE", id: selectedId, x: el.x + dx, y: el.y + dy });
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedId, elements, dispatch, editingId]);

    const selectedEl = elements.find(e => e.id === selectedId) ?? null;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // Auto-compute canvas height: max bottom edge of all elements + padding, minimum = height prop
    const computedHeight = useMemo(() => {
        if (elements.length === 0) return height;
        const maxBottom = Math.max(...elements.map(el => el.y + el.height));
        return Math.max(height, maxBottom + 100); // 100px padding at bottom
    }, [elements, height]);

    return (
        <div
            onClick={handleCanvasClick}
            onMouseMove={(e) => {
                const target = (e.target as HTMLElement).closest("[data-element-id]");
                setHoveredId(target ? target.getAttribute("data-element-id") : null);
            }}
            onMouseLeave={() => setHoveredId(null)}
            style={{
                position: "relative",
                width: canvasW,
                height: computedHeight * scale,
                background,
                boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                borderRadius: 4,
                overflow: "hidden",
                flexShrink: 0,
                cursor: "default",
            }}
        >
            {/* Sprint 22: Grid overlay */}
            {showGrid && (
                <div style={{
                    position: "absolute", inset: 0, zIndex: 9980, pointerEvents: "none",
                    backgroundImage: "radial-gradient(circle, #cbd5e1 0.8px, transparent 0.8px)",
                    backgroundSize: `${20 * scale}px ${20 * scale}px`,
                    opacity: 0.5,
                }} />
            )}
            {/* All elements rendered at absolute position — NO section boundaries */}
            {sorted.map(el => {
                const isHovered = el.id === hoveredId && el.id !== selectedId;
                return (
                    <div key={el.id} style={{ position: "contents" as never }}>
                        {isHovered && (
                            <div style={{
                                position: "absolute",
                                left: el.x * scale - 1, top: el.y * scale - 1,
                                width: el.width * scale + 2, height: el.height * scale + 2,
                                border: "1.5px dashed #3b82f6",
                                borderRadius: 4, pointerEvents: "none", zIndex: 9970,
                                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                                transformOrigin: "center center",
                            }} />
                        )}
                        {el.type === "text" && (
                            <TextElement
                                key={el.id}
                                element={el}
                                zoom={zoom}
                                isSelected={el.id === selectedId}
                                isEditing={el.id === editingId}
                                onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                                onDoubleClick={() => handleDoubleClick(el.id, "text")}
                                onFinishEditing={() => setEditingId(null)}
                                onUpdateText={(id, text) => dispatch({
                                    type: "UPDATE_ELEMENT", id,
                                    changes: { props: { ...el.props, text } },
                                })}
                                onUpdateProps={(id, changes) => dispatch({ type: "UPDATE_ELEMENT", id, changes })}
                            />
                        )}
                        {el.type === "image" && (
                            <ImageElement
                                key={el.id}
                                element={el}
                                zoom={zoom}
                                isSelected={el.id === selectedId}
                                onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                            />
                        )}
                        {el.type === "widget" && (
                            <WidgetElement
                                key={el.id}
                                element={el}
                                zoom={zoom}
                                isSelected={el.id === selectedId}
                                onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                            />
                        )}
                    </div>
                );
            })}
            {/* Sprint 20: Center alignment guides */}
            {selectedEl && (() => {
                const elCenterX = (selectedEl.x + selectedEl.width / 2) * scale;
                const elCenterY = (selectedEl.y + selectedEl.height / 2) * scale;
                const canvasCenterX = (width / 2) * scale;
                const threshold = 3 * scale;
                const showVertical = Math.abs(elCenterX - canvasCenterX) < threshold;
                const showHorizontal = Math.abs(selectedEl.x * scale) < threshold || Math.abs((selectedEl.x + selectedEl.width) * scale - canvasW) < threshold;
                return (
                    <>
                        {showVertical && (
                            <div style={{
                                position: "absolute", left: canvasCenterX, top: 0,
                                width: 1, height: "100%",
                                borderLeft: "1px dashed #06b6d4",
                                pointerEvents: "none", zIndex: 9990, opacity: 0.7,
                            }} />
                        )}
                        {showHorizontal && (
                            <div style={{
                                position: "absolute", left: 0, top: elCenterY,
                                width: "100%", height: 1,
                                borderTop: "1px dashed #06b6d4",
                                pointerEvents: "none", zIndex: 9990, opacity: 0.7,
                            }} />
                        )}
                    </>
                );
            })()}

            {/* Selection overlay */}
            {selectedEl && !editingId && (
                <SelectionBox
                    element={selectedEl}
                    zoom={zoom}
                    onMove={(id, x, y) => dispatch({ type: "MOVE", id, x, y })}
                    onResize={(id, x, y, w, h) => dispatch({ type: "RESIZE", id, x, y, width: w, height: h })}
                    onDelete={(id) => dispatch({ type: "DELETE_ELEMENT", id })}
                    onDuplicate={(id) => dispatch({ type: "DUPLICATE", id })}
                    onBringForward={(id) => dispatch({ type: "BRING_FORWARD", id })}
                    onSendBackward={(id) => dispatch({ type: "SEND_BACKWARD", id })}
                    onDoubleClick={() => handleDoubleClick(selectedEl.id, selectedEl.type)}
                />
            )}

            {/* Particle effects overlay */}
            {particleEffect !== "none" && <ParticleOverlay effect={particleEffect} />}
        </div>
    );
}

// ── CSS Particle Overlay ──
const PARTICLE_CONFIG: Record<Exclude<ParticleEffect, "none">, { chars: string[]; count: number; color: string }> = {
    hearts: { chars: ["❤️", "💕", "💗", "💖", "♥"], count: 20, color: "" },
    petals: { chars: ["🌸", "🩷", "✿", "❀", "🪷"], count: 24, color: "" },
    bokeh: { chars: ["●", "●", "●", "●"], count: 18, color: "rgba(255,255,255,0.3)" },
    snow: { chars: ["❄", "❅", "❆", "✦"], count: 22, color: "" },
};

function ParticleOverlay({ effect }: { effect: Exclude<ParticleEffect, "none"> }) {
    const { chars, count, color } = PARTICLE_CONFIG[effect];
    useEffect(() => {
        if (document.getElementById("particle-keyframes")) return;
        const style = document.createElement("style");
        style.id = "particle-keyframes";
        style.textContent = `
            @keyframes particle-fall { 0% { transform: translateY(-40px) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.8; } 100% { transform: translateY(calc(100vh + 40px)) rotate(360deg); opacity: 0; } }
            @keyframes particle-sway { 0%,100% { margin-left: 0; } 50% { margin-left: 30px; } }
        `;
        document.head.appendChild(style);
    }, []);

    const particles = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            char: chars[i % chars.length],
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 8}s`,
            duration: `${6 + Math.random() * 6}s`,
            size: 10 + Math.random() * 14,
            swayDuration: `${3 + Math.random() * 4}s`,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effect]);

    return (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9999 }}>
            {particles.map((p, i) => (
                <span key={i} style={{
                    position: "absolute",
                    left: p.left, top: "-30px",
                    fontSize: p.size,
                    color: color || undefined,
                    animation: `particle-fall ${p.duration} ${p.delay} infinite linear, particle-sway ${p.swayDuration} ${p.delay} infinite ease-in-out`,
                    filter: effect === "bokeh" ? "blur(2px)" : undefined,
                    opacity: effect === "bokeh" ? 0.4 : 0.8,
                }}>{p.char}</span>
            ))}
        </div>
    );
}
