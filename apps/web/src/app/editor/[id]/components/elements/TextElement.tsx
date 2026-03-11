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

    // Build textShadow CSS
    const shadow = p.textShadow;
    const textShadowCss = shadow?.active
        ? `${shadow.x ?? 2}px ${shadow.y ?? 2}px ${shadow.blur ?? 4}px ${shadow.color ?? "rgba(0,0,0,0.4)"}`
        : undefined;

    // Build animation class
    const animationStyle: React.CSSProperties = {};
    const loop = element.animation?.loop;
    if (loop === "pulse") {
        animationStyle.animation = "el-pulse 2s ease-in-out infinite";
    } else if (loop === "float") {
        animationStyle.animation = "el-float 3s ease-in-out infinite";
    } else if (loop === "shake") {
        animationStyle.animation = "el-shake 0.5s ease-in-out infinite";
    }

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
                ...animationStyle,
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
                    backgroundColor: p.backgroundColor ?? "transparent",
                    textAlign: p.textAlign ?? "center",
                    fontWeight: p.fontWeight ?? "normal",
                    fontStyle: p.fontStyle ?? "normal",
                    textDecoration: p.textDecoration ?? "none",
                    lineHeight: p.lineHeight ?? 1.4,
                    letterSpacing: p.letterSpacing !== undefined ? `${p.letterSpacing * scale}px` : undefined,
                    textShadow: textShadowCss,
                    outline: editing ? "1px dashed #3b82f6" : "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    padding: "2px 4px",
                    borderRadius: 2,
                    boxSizing: "border-box",
                    background: p.backgroundColor ?? "transparent",
                }}
            >
                {p.text ?? "Nhấn để chỉnh sửa"}
            </div>
        </div>
    );
}
