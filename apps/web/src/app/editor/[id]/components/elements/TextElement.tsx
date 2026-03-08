"use client";

import { useRef, useState, useCallback } from "react";
import type { CanvasElement } from "../useCanvasReducer";

interface TextElementProps {
    element: CanvasElement;
    zoom: number;
    isSelected: boolean;
    onSelect: () => void;
    onUpdateText: (id: string, text: string) => void;
    onUpdateProps: (id: string, changes: Partial<CanvasElement>) => void;
}

export function TextElement({ element, zoom, isSelected, onSelect, onUpdateText, onUpdateProps }: TextElementProps) {
    const scale = zoom / 100;
    const [editing, setEditing] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const p = element.props;

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
        setTimeout(() => {
            if (ref.current) {
                ref.current.focus();
                const range = document.createRange();
                range.selectNodeContents(ref.current);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        }, 0);
    }, []);

    const handleBlur = useCallback(() => {
        setEditing(false);
        if (ref.current) {
            const newText = ref.current.innerText || "";
            onUpdateText(element.id, newText);
        }
    }, [element.id, onUpdateText]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setEditing(false);
            ref.current?.blur();
        }
    }, []);

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onDoubleClick={handleDoubleClick}
            style={{
                position: "absolute",
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                minHeight: element.height * scale,
                zIndex: element.zIndex * 10,
                cursor: editing ? "text" : "pointer",
                opacity: element.opacity,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            }}
        >
            <div
                ref={ref}
                contentEditable={editing}
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                    width: "100%",
                    minHeight: "100%",
                    fontSize: (p.fontSize ?? 24) * scale,
                    fontFamily: p.fontFamily ?? "'Dancing Script', cursive",
                    color: p.color ?? "#831843",
                    textAlign: p.textAlign ?? "center",
                    fontWeight: p.fontWeight ?? "normal",
                    fontStyle: p.fontStyle ?? "normal",
                    lineHeight: p.lineHeight ?? 1.4,
                    outline: editing ? "1px dashed #3b82f6" : "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    padding: "2px 4px",
                    borderRadius: 2,
                    boxSizing: "border-box",
                    background: "transparent",
                }}
            >
                {p.text ?? "Nhấn để chỉnh sửa"}
            </div>
        </div>
    );
}
