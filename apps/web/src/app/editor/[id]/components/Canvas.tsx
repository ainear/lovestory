"use client";

import { useCallback, useEffect } from "react";
import type { CanvasElement, Action } from "./useCanvasReducer";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { SelectionBox } from "./SelectionBox";

interface CanvasProps {
    width: number;
    height: number;
    background: string;
    elements: CanvasElement[];
    selectedId: string | null;
    zoom: number;
    dispatch: (action: Action) => void;
}

export function Canvas({ width, height, background, elements, selectedId, zoom, dispatch }: CanvasProps) {
    const scale = zoom / 100;
    const canvasW = width * scale;
    const canvasH = height * scale;

    const handleCanvasClick = useCallback(() => {
        dispatch({ type: "SELECT", id: null });
    }, [dispatch]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Catch only if canvas is focused, not inside an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable) return;

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
            // Arrow nudge
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
    }, [selectedId, elements, dispatch]);

    const selectedEl = elements.find(e => e.id === selectedId) ?? null;

    // Sort by zIndex for rendering
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    return (
        <div
            style={{
                position: "relative",
                width: canvasW,
                height: canvasH,
                background,
                boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                borderRadius: 4,
                overflow: "hidden",
                flexShrink: 0,
                cursor: "default",
            }}
            onClick={handleCanvasClick}
        >
            {/* Background layer */}
            <div style={{ position: "absolute", inset: 0, background, zIndex: 0 }} />

            {/* Element render */}
            {sorted.map(el => {
                if (el.type === "text") {
                    return (
                        <TextElement
                            key={el.id}
                            element={el}
                            zoom={zoom}
                            isSelected={el.id === selectedId}
                            onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                            onUpdateText={(id, text) => dispatch({
                                type: "UPDATE_ELEMENT", id,
                                changes: { props: { ...el.props, text } },
                            })}
                            onUpdateProps={(id, changes) => dispatch({ type: "UPDATE_ELEMENT", id, changes })}
                        />
                    );
                }
                if (el.type === "image") {
                    return (
                        <ImageElement
                            key={el.id}
                            element={el}
                            zoom={zoom}
                            isSelected={el.id === selectedId}
                            onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                        />
                    );
                }
                return null;
            })}

            {/* Selection overlay (rendered on top of all elements) */}
            {selectedEl && (
                <SelectionBox
                    element={selectedEl}
                    zoom={zoom}
                    onMove={(id, x, y) => dispatch({ type: "MOVE", id, x, y })}
                    onResize={(id, x, y, w, h) => dispatch({ type: "RESIZE", id, x, y, width: w, height: h })}
                    onDelete={(id) => dispatch({ type: "DELETE_ELEMENT", id })}
                    onDuplicate={(id) => dispatch({ type: "DUPLICATE", id })}
                    onBringForward={(id) => dispatch({ type: "BRING_FORWARD", id })}
                    onSendBackward={(id) => dispatch({ type: "SEND_BACKWARD", id })}
                />
            )}
        </div>
    );
}
