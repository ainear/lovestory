"use client";

import { useCallback, useEffect, useState } from "react";
import type { CanvasElement, CanvasSection as SectionType, Action } from "./useCanvasReducer";
import { CanvasSection } from "./CanvasSection";

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

    // editingId: which text element is currently in inline-edit mode
    const [editingId, setEditingId] = useState<string | null>(null);

    // Stop editing when selection changes to a different element or clears
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
            // Don't intercept if inline editing is active
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
    }, [selectedId, elements, dispatch, editingId]);

    const selectedEl = elements.find(e => e.id === selectedId) ?? null;

    // Sort by zIndex for rendering
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    return (
        <div
            style={{
                position: "relative",
                width: canvasW,
                // height is determined by the total height of sections
                display: "flex",
                flexDirection: "column",
                background,
                boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                borderRadius: 4,
                overflow: "hidden",
                flexShrink: 0,
                cursor: "default",
            }}
        >
            {sections.map(section => (
                <CanvasSection
                    key={section.id}
                    section={section}
                    elements={elements.filter(e => e.sectionId === section.id)}
                    selectedId={selectedId}
                    editingId={editingId}
                    zoom={zoom}
                    dispatch={dispatch}
                    setEditingId={setEditingId}
                    handleDoubleClick={handleDoubleClick}
                    onClick={handleCanvasClick}
                />
            ))}
        </div>
    );
}
