"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditorContext } from "./useEditorState";
import { SelectionOverlay } from "./SelectionOverlay";
import { ElementToolbar } from "./ElementToolbar";
import type { CanvasElement, TextProps, ImageProps } from "./types";

/** Sanitize paste to plain text only — prevents XSS via pasted HTML */
function handlePastePlainText(e: React.ClipboardEvent) {
  e.preventDefault();
  const text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
}

/** Render a single text element */
function TextElement({
  el,
  isEditing,
  onStartEdit,
}: {
  el: CanvasElement;
  isEditing: boolean;
  onStartEdit: () => void;
}) {
  const p = el.props as TextProps;
  const { dispatch } = useEditorContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      // Place cursor at end of text
      const sel = window.getSelection();
      if (sel && ref.current.childNodes.length > 0) {
        sel.selectAllChildren(ref.current);
        sel.collapseToEnd();
      }
    }
  }, [isEditing]);

  const handleBlur = useCallback(() => {
    if (!ref.current) return;
    const newText = ref.current.innerText;
    dispatch({ type: "SNAPSHOT" });
    dispatch({ type: "UPDATE_PROPS", id: el.id, props: { text: newText } });
  }, [dispatch, el.id]);

  return (
    <div
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={isEditing ? handleBlur : undefined}
      onPaste={isEditing ? handlePastePlainText : undefined}
      onDoubleClick={onStartEdit}
      style={{
        width: "100%",
        height: "100%",
        fontFamily: p.fontFamily,
        fontSize: p.fontSize,
        fontWeight: p.fontWeight,
        fontStyle: p.fontStyle,
        color: p.color,
        backgroundColor: p.backgroundColor || "transparent",
        textAlign: p.textAlign,
        lineHeight: p.lineHeight,
        letterSpacing: p.letterSpacing,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        userSelect: isEditing ? "text" : "none",
        outline: "none",
        cursor: isEditing ? "text" : "inherit",
      }}
    >
      {p.text}
    </div>
  );
}

/** Render a single image element */
function ImageElement({ el }: { el: CanvasElement }) {
  const p = el.props as ImageProps;
  return (
    <img
      src={p.src}
      alt=""
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit: p.objectFit,
        borderRadius: "inherit",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
      }}
    />
  );
}

/** Render a single canvas element wrapper (absolute positioned) */
function CanvasElementWrapper({
  el,
  isSelected,
  onSelect,
}: {
  el: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = useCallback(() => {
    if (el.locked || el.type !== "text") return;
    setIsEditing(true);
  }, [el.locked, el.type]);

  // Exit editing when element is deselected
  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
    }
  }, [isSelected]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (el.locked) return;
      e.stopPropagation();
      onSelect(el.id);
    },
    [el.id, el.locked, onSelect],
  );

  const shadow = el.shadow
    ? `${el.shadow.offsetX}px ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.spread}px ${el.shadow.color}`
    : "none";

  return (
    <div
      data-element-id={el.id}
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        top: el.top,
        left: el.left,
        width: el.width,
        height: el.height === "auto" ? "auto" : el.height,
        zIndex: el.zIndex,
        opacity: el.opacity,
        borderRadius: el.borderRadius,
        border:
          el.border.width > 0
            ? `${el.border.width}px ${el.border.style} ${el.border.color}`
            : "none",
        boxShadow: shadow,
        transform: `rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY})`,
        cursor: isEditing ? "text" : el.locked ? "default" : "move",
        outline: isSelected ? "2px dashed #3b82f6" : "none",
        outlineOffset: 2,
        boxSizing: "border-box",
        display: el.visible ? "block" : "none",
      }}
    >
      {el.type === "text" && (
        <TextElement
          el={el}
          isEditing={isEditing}
          onStartEdit={handleStartEdit}
        />
      )}
      {(el.type === "image" || el.type === "sticker") && (
        <ImageElement el={el} />
      )}
    </div>
  );
}

/** Main canvas renderer */
export function CanvasRenderer() {
  const { state, dispatch } = useEditorContext();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (id: string) => {
      dispatch({ type: "SELECT", id });
    },
    [dispatch],
  );

  const handleCanvasClick = useCallback(
    (e: React.PointerEvent) => {
      if (e.target === canvasRef.current) {
        dispatch({ type: "SELECT", id: null });
      }
    },
    [dispatch],
  );

  const sortedElements = useMemo(
    () => [...state.elements].sort((a, b) => a.zIndex - b.zIndex),
    [state.elements],
  );

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        paddingTop: 56,
        paddingBottom: 200,
        background: "#e5e7eb",
      }}
    >
      <div
        ref={canvasRef}
        onPointerDown={handleCanvasClick}
        style={{
          position: "relative",
          width: state.canvasWidth,
          minHeight: state.canvasHeight,
          background: state.canvasBackground,
          transform: `scale(${state.zoom})`,
          transformOrigin: "top center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        {sortedElements.map((el) => (
          <CanvasElementWrapper
            key={el.id}
            el={el}
            isSelected={state.selectedId === el.id}
            onSelect={handleSelect}
          />
        ))}
        <SelectionOverlay />
        <ElementToolbar />
      </div>
    </div>
  );
}
