"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";

const HANDLE_SIZE = 8;
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type HandleDir = (typeof HANDLES)[number];

const HANDLE_CURSORS: Record<HandleDir, string> = {
  nw: "nw-resize",
  n: "n-resize",
  ne: "ne-resize",
  e: "e-resize",
  se: "se-resize",
  s: "s-resize",
  sw: "sw-resize",
  w: "w-resize",
};

function handlePosition(dir: HandleDir): React.CSSProperties {
  const half = -HANDLE_SIZE / 2;
  switch (dir) {
    case "nw":
      return { top: half, left: half };
    case "n":
      return { top: half, left: "50%", marginLeft: half };
    case "ne":
      return { top: half, right: half };
    case "e":
      return { top: "50%", right: half, marginTop: half };
    case "se":
      return { bottom: half, right: half };
    case "s":
      return { bottom: half, left: "50%", marginLeft: half };
    case "sw":
      return { bottom: half, left: half };
    case "w":
      return { top: "50%", left: half, marginTop: half };
  }
}

export function SelectionOverlay() {
  const { state, dispatch } = useEditorContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef(false);
  const resizeRef = useRef<{
    dir: HandleDir;
    startX: number;
    startY: number;
    origTop: number;
    origLeft: number;
    origWidth: number;
    origHeight: number;
  } | null>(null);

  const el = state.elements.find((e) => e.id === state.selectedId);
  if (!el) return null;

  const elHeight = el.height === "auto" ? 40 : el.height;

  const handleResizeDown = (dir: HandleDir, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dispatch({ type: "SNAPSHOT" });
    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origTop: el.top,
      origLeft: el.left,
      origWidth: el.width,
      origHeight: typeof el.height === "number" ? el.height : 100,
    };
  };

  const handleRotateDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dispatch({ type: "SNAPSHOT" });
    rotateRef.current = true;
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (rotateRef.current) {
      if (!overlayRef.current) return;
      const rect = overlayRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) +
        90;
      dispatch({
        type: "UPDATE_ELEMENT",
        id: el.id,
        patch: { rotation: angle },
      });
      return;
    }
    if (!resizeRef.current) return;
    const { dir, startX, startY, origTop, origLeft, origWidth, origHeight } =
      resizeRef.current;
    const zoom = state.zoom;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;

    let newTop = origTop;
    let newLeft = origLeft;
    let newWidth = origWidth;
    let newHeight: number | "auto" = origHeight;

    if (dir.includes("e")) newWidth = Math.max(20, origWidth + dx);
    if (dir.includes("w")) {
      newWidth = Math.max(20, origWidth - dx);
      newLeft = origLeft + (origWidth - newWidth);
    }
    if (dir.includes("s")) newHeight = Math.max(20, origHeight + dy);
    if (dir.includes("n")) {
      newHeight = Math.max(20, origHeight - dy);
      newTop = origTop + (origHeight - (newHeight as number));
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      id: el.id,
      patch: { top: newTop, left: newLeft, width: newWidth, height: newHeight },
    });
  };

  const handleResizeUp = () => {
    resizeRef.current = null;
    rotateRef.current = false;
  };

  return (
    <div
      ref={overlayRef}
      onPointerMove={handleResizeMove}
      onPointerUp={handleResizeUp}
      style={{
        position: "absolute",
        top: el.top - 1,
        left: el.left - 1,
        width: el.width + 2,
        height: (typeof elHeight === "number" ? elHeight : 40) + 2,
        zIndex: 99999,
        pointerEvents: "none",
        transform: `rotate(${el.rotation}deg)`,
      }}
    >
      {/* Dashed border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "2px dashed #3b82f6",
          pointerEvents: "none",
        }}
      />

      {/* 8 resize handles */}
      {HANDLES.map((dir) => (
        <div
          key={dir}
          onPointerDown={(e) => handleResizeDown(dir, e)}
          style={{
            position: "absolute",
            ...handlePosition(dir),
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            background: "#fff",
            border: "2px solid #3b82f6",
            borderRadius: 2,
            cursor: HANDLE_CURSORS[dir],
            pointerEvents: "auto",
            zIndex: 1,
          }}
        />
      ))}

      {/* Rotate handle (above element) */}
      <div
        onPointerDown={handleRotateDown}
        style={{
          position: "absolute",
          top: -28,
          left: "50%",
          marginLeft: -6,
          width: 12,
          height: 12,
          background: "#fff",
          border: "2px solid #3b82f6",
          borderRadius: "50%",
          cursor: "grab",
          pointerEvents: "auto",
          zIndex: 1,
        }}
      />
      {/* Line from rotate handle to element */}
      <div
        style={{
          position: "absolute",
          top: -16,
          left: "50%",
          width: 1,
          height: 16,
          background: "#3b82f6",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
