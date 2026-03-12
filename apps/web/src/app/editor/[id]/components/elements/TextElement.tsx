"use client";

import { useRef, useEffect, useCallback } from "react";
import type { CanvasElement } from "../useCanvasReducer";
import { useScrollObserver } from "../useScrollObserver";

interface TextElementProps {
    element: CanvasElement;
    zoom: number;
    isSelected: boolean;
    isEditing: boolean;              // controlled from Canvas
    onSelect: () => void;
    onDoubleClick: () => void;       // notify Canvas to activate editing
    onFinishEditing: () => void;     // notify Canvas editing is done
    onUpdateText: (id: string, text: string) => void;
    onUpdateProps: (id: string, changes: Partial<CanvasElement>) => void;
}

export function TextElement({
    element, zoom, isSelected, isEditing,
    onSelect, onDoubleClick, onFinishEditing, onUpdateText, onUpdateProps
}: TextElementProps) {
    const scale = zoom / 100;
    const ref = useRef<HTMLDivElement>(null);
    const p = element.props;

    const { ref: observerRef, hasIntersected } = useScrollObserver();

    // When isEditing activates externally, focus + select all text
    useEffect(() => {
        if (isEditing && ref.current) {
            const el = ref.current;
            el.contentEditable = "true";
            // Need setTimeout so browser processes the contentEditable DOM change first
            setTimeout(() => {
                el.focus();
                try {
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    const sel = window.getSelection();
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                } catch {
                    // Non-fatal: cursor will still be placed by browser default
                }
            }, 10);
        } else if (!isEditing && ref.current) {
            ref.current.contentEditable = "false";
            ref.current.blur();
        }
    }, [isEditing]);


    const handleBlur = useCallback(() => {
        if (ref.current) {
            const newText = ref.current.innerText || "";
            onUpdateText(element.id, newText);
        }
        onFinishEditing();
    }, [element.id, onUpdateText, onFinishEditing]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            if (ref.current) {
                const newText = ref.current.innerText || "";
                onUpdateText(element.id, newText);
            }
            onFinishEditing();
            ref.current?.blur();
        }
        // Prevent Enter from propagating to canvas shortcuts
        if (e.key === "Enter" && !e.shiftKey) {
            e.stopPropagation();
        }
        e.stopPropagation(); // prevent arrow keys from nudging while typing
    }, [element.id, onUpdateText, onFinishEditing]);

    // Build textShadow CSS
    const shadow = p.textShadow;
    const textShadowCss = shadow?.active
        ? `${shadow.x ?? 2}px ${shadow.y ?? 2}px ${shadow.blur ?? 4}px ${shadow.color ?? "rgba(0,0,0,0.4)"}`
        : undefined;

    // Build loop animation CSS
    const animationStyle: React.CSSProperties = {};
    const loop = element.animation?.loop;
    if (loop === "pulse") {
        animationStyle.animation = "el-pulse 2s ease-in-out infinite";
    } else if (loop === "float") {
        animationStyle.animation = "el-float 3s ease-in-out infinite";
    } else if (loop === "shake") {
        animationStyle.animation = "el-shake 0.5s ease-in-out infinite";
    }

    const entrance = element.animation?.entrance;
    const hasEntrance = entrance && entrance !== "none";
    const entranceClass = hasEntrance && hasIntersected ? `animate-entrance-${entrance}` : "";
    const shouldHideText = hasEntrance && !hasIntersected;

    return (
        <div
            ref={observerRef}
            className={entranceClass}
            onClick={(e) => { e.stopPropagation(); if (!isEditing) onSelect(); }}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
            style={{
                position: "absolute",
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                minHeight: element.height * scale,
                zIndex: element.zIndex * 10,
                cursor: isEditing ? "text" : "pointer",
                opacity: shouldHideText ? 0 : element.opacity,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                // while editing, sit above SelectionBox's z-space
                ...(isEditing ? { zIndex: element.zIndex * 10 + 10000 } : {}),
                ...animationStyle,
            }}
        >
            <div
                ref={ref}
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                    width: "100%",
                    minHeight: "100%",
                    fontSize: (p.fontSize ?? 24) * scale,
                    fontFamily: p.fontFamily ?? "'Dancing Script', cursive",
                    // Gradient text: if color starts with gradient syntax, use background-clip
                    ...(typeof p.color === "string" && (p.color.startsWith("linear-gradient") || p.color.startsWith("radial-gradient"))
                        ? {
                            background: p.color,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }
                        : {
                            color: p.color ?? "#831843",
                            background: p.backgroundColor ?? "transparent",
                        }
                    ),
                    textAlign: p.textAlign ?? "center",
                    fontWeight: p.fontWeight ?? "normal",
                    fontStyle: p.fontStyle ?? "normal",
                    textDecoration: p.textDecoration ?? "none",
                    lineHeight: p.lineHeight ?? 1.4,
                    letterSpacing: p.letterSpacing !== undefined ? `${p.letterSpacing * scale}px` : undefined,
                    textShadow: textShadowCss,
                    outline: isEditing ? "2px dashed #3b82f6" : "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    padding: "2px 4px",
                    borderRadius: 2,
                    boxSizing: "border-box",
                    userSelect: isEditing ? "text" : "none",
                }}
            >
                {p.text ?? "Nhấn đúp để chỉnh sửa"}
            </div>
        </div>
    );
}
