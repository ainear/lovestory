"use client";

import { useRef, useCallback } from "react";
import type { CanvasElement } from "./useCanvasReducer";

interface SelectionBoxProps {
    element: CanvasElement;
    zoom: number;
    onMove: (id: string, x: number, y: number) => void;
    onResize: (id: string, x: number, y: number, w: number, h: number) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onBringForward: (id: string) => void;
    onSendBackward: (id: string) => void;
}

const HANDLES = [
    { id: "nw", cursor: "nw-resize", top: -5, left: -5 },
    { id: "n", cursor: "n-resize", top: -5, left: "50%", xOff: -5 },
    { id: "ne", cursor: "ne-resize", top: -5, right: -5 },
    { id: "e", cursor: "e-resize", top: "50%", right: -5, yOff: -5 },
    { id: "se", cursor: "se-resize", bottom: -5, right: -5 },
    { id: "s", cursor: "s-resize", bottom: -5, left: "50%", xOff: -5 },
    { id: "sw", cursor: "sw-resize", bottom: -5, left: -5 },
    { id: "w", cursor: "w-resize", top: "50%", left: -5, yOff: -5 },
];

export function SelectionBox({
    element, zoom, onMove, onResize, onDelete, onDuplicate, onBringForward, onSendBackward
}: SelectionBoxProps) {
    const scale = zoom / 100;
    const isDragging = useRef(false);
    const dragStart = useRef({ mouseX: 0, mouseY: 0, elX: 0, elY: 0 });
    const resizeRef = useRef({ handle: "", startX: 0, startY: 0, origX: 0, origY: 0, origW: 0, origH: 0 });

    const handleMovePointerDown = useCallback((e: React.PointerEvent) => {
        if ((e.target as HTMLElement).dataset.handle) return;
        e.stopPropagation();
        isDragging.current = true;
        dragStart.current = {
            mouseX: e.clientX, mouseY: e.clientY,
            elX: element.x, elY: element.y,
        };
        const onMove_ = (ev: PointerEvent) => {
            if (!isDragging.current) return;
            const dx = (ev.clientX - dragStart.current.mouseX) / scale;
            const dy = (ev.clientY - dragStart.current.mouseY) / scale;
            const newX = Math.max(0, dragStart.current.elX + dx);
            const newY = Math.max(0, dragStart.current.elY + dy);
            onMove(element.id, newX, newY);
        };
        const onUp = () => {
            isDragging.current = false;
            window.removeEventListener("pointermove", onMove_);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove_);
        window.addEventListener("pointerup", onUp);
    }, [element.id, element.x, element.y, onMove, scale]);

    const handleResizePointerDown = useCallback((e: React.PointerEvent, handleId: string) => {
        e.stopPropagation();
        e.preventDefault();
        resizeRef.current = {
            handle: handleId,
            startX: e.clientX, startY: e.clientY,
            origX: element.x, origY: element.y,
            origW: element.width, origH: element.height,
        };
        const onMove_ = (ev: PointerEvent) => {
            const { handle, startX, startY, origX, origY, origW, origH } = resizeRef.current;
            const dx = (ev.clientX - startX) / scale;
            const dy = (ev.clientY - startY) / scale;
            let x = origX, y = origY, w = origW, h = origH;
            if (handle.includes("e")) w = Math.max(40, origW + dx);
            if (handle.includes("s")) h = Math.max(20, origH + dy);
            if (handle.includes("w")) { w = Math.max(40, origW - dx); x = origX + origW - w; }
            if (handle.includes("n")) { h = Math.max(20, origH - dy); y = origY + origH - h; }
            onResize(element.id, x, y, w, h);
        };
        const onUp = () => {
            window.removeEventListener("pointermove", onMove_);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove_);
        window.addEventListener("pointerup", onUp);
    }, [element, onResize, scale]);

    return (
        <div
            onPointerDown={handleMovePointerDown}
            style={{
                position: "absolute",
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                height: element.height * scale,
                border: "2px solid #3b82f6",
                cursor: "move",
                zIndex: element.zIndex * 10 + 999,
                userSelect: "none",
                touchAction: "none",
            }}
        >
            {/* Resize handles */}
            {HANDLES.map(h => (
                <div
                    key={h.id}
                    data-handle={h.id}
                    onPointerDown={(e) => handleResizePointerDown(e, h.id)}
                    style={{
                        position: "absolute",
                        width: 10, height: 10,
                        background: "#fff",
                        border: "2px solid #3b82f6",
                        borderRadius: 2,
                        cursor: h.cursor,
                        top: h.top !== undefined ? h.top : undefined,
                        bottom: (h as Record<string, unknown>).bottom !== undefined ? (h as Record<string, unknown>).bottom as number : undefined,
                        left: h.left !== undefined ? h.left : undefined,
                        right: (h as Record<string, unknown>).right !== undefined ? (h as Record<string, unknown>).right as number : undefined,
                        transform: `translate(${(h as Record<string, unknown>).xOff ? (h as Record<string, unknown>).xOff : 0}px, ${(h as Record<string, unknown>).yOff ? (h as Record<string, unknown>).yOff : 0}px)`,
                        zIndex: 9999,
                        touchAction: "none",
                    }}
                />
            ))}

            {/* Floating toolbar */}
            <div style={{
                position: "absolute",
                top: -38,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#1f2937",
                borderRadius: 8,
                padding: "4px 6px",
                display: "flex",
                gap: 2,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                zIndex: 9999,
            }}>
                {[
                    { label: "⬆", title: "Lên trước", onClick: () => onBringForward(element.id) },
                    { label: "⬇", title: "Xuống sau", onClick: () => onSendBackward(element.id) },
                    { label: "⧉", title: "Nhân đôi", onClick: () => onDuplicate(element.id) },
                    { label: "✕", title: "Xóa", onClick: () => onDelete(element.id) },
                ].map(btn => (
                    <button
                        key={btn.label}
                        title={btn.title}
                        onPointerDown={(e) => { e.stopPropagation(); btn.onClick(); }}
                        style={{
                            width: 26, height: 26,
                            background: btn.label === "✕" ? "#ef4444" : "rgba(255,255,255,0.1)",
                            border: "none", borderRadius: 6,
                            color: "#fff", fontSize: 12,
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
