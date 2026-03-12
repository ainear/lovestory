"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import type { CanvasElement, CanvasSection as SectionType, Action } from "./useCanvasReducer";
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
    dispatch: (action: Action) => void;
}

export function Canvas({ width, height, background, sections, elements, selectedId, zoom, dispatch }: CanvasProps) {
    const scale = zoom / 100;
    const canvasW = width * scale;

    const [editingId, setEditingId] = useState<string | null>(null);

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
            {/* All elements rendered at absolute position — NO section boundaries */}
            {sorted.map(el => {
                if (el.type === "text") {
                    return (
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
                if (el.type === "widget") {
                    return (
                        <WidgetElement
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
        </div>
    );
}
