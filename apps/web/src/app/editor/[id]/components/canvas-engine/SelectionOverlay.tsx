"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";

/**
 * SelectionOverlay — Free Transform handles
 * Sprint 3B upgrades:
 *  - 12px premium circular handles (better touch targets)
 *  - Shift+drag = aspect-ratio locked resize
 *  - Deferred SNAPSHOT (on first move, not mousedown) = clean undo history
 *  - Shift+rotate = snap to 15° increments
 *  - Premium handle styles (blue filled circles, white border)
 *  - Corner handles larger than edge handles
 *  - Rotate handle with gradient + line connector
 */

const CORNER_HANDLE_SIZE = 12;
const EDGE_HANDLE_SIZE = 9;
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type HandleDir = (typeof HANDLES)[number];

const isCorner = (dir: HandleDir) =>
  dir === "nw" || dir === "ne" || dir === "se" || dir === "sw";

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
  const corner = isCorner(dir);
  const half = -(corner ? CORNER_HANDLE_SIZE : EDGE_HANDLE_SIZE) / 2;
  switch (dir) {
    case "nw": return { top: half, left: half };
    case "n":  return { top: half, left: "50%", marginLeft: half };
    case "ne": return { top: half, right: half };
    case "e":  return { top: "50%", right: half, marginTop: half };
    case "se": return { bottom: half, right: half };
    case "s":  return { bottom: half, left: "50%", marginLeft: half };
    case "sw": return { bottom: half, left: half };
    case "w":  return { top: "50%", left: half, marginTop: half };
  }
}

export function SelectionOverlay() {
  const { state, dispatch } = useEditorContext();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Resize state
  const resizeRef = useRef<{
    dir: HandleDir;
    startX: number;
    startY: number;
    origTop: number;
    origLeft: number;
    origWidth: number;
    origHeight: number;
    snapshotTaken: boolean;
  } | null>(null);

  // Rotate state  
  const rotateRef = useRef<{
    active: boolean;
    snapshotTaken: boolean;
  }>({ active: false, snapshotTaken: false });

  // ── UP — must be before early return to satisfy Rules of Hooks ──────────────
  const handlePointerUp = useCallback(() => {
    resizeRef.current = null;
    rotateRef.current = { active: false, snapshotTaken: false };
  }, []);

  const el = state.elements.find((e) => e.id === state.selectedId);
  if (!el) return null;

  const elHeight = typeof el.height === "number" ? el.height : 40;
  const zoom = state.zoom; // decimal (e.g., 0.75)

  // ── RESIZE ─────────────────────────────────────────────────────────────────
  const handleResizeDown = (dir: HandleDir, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origTop: el.top,
      origLeft: el.left,
      origWidth: el.width,
      origHeight: elHeight,
      snapshotTaken: false, // defer SNAPSHOT to first move
    };
  };

  // ── ROTATE ─────────────────────────────────────────────────────────────────
  const handleRotateDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    rotateRef.current = { active: true, snapshotTaken: false };
  };

  // ── MOVE (shared) ──────────────────────────────────────────────────────────
  const handlePointerMove = (e: React.PointerEvent) => {
    // ── ROTATE mode ──
    if (rotateRef.current.active) {
      if (!overlayRef.current) return;

      // Defer snapshot
      if (!rotateRef.current.snapshotTaken) {
        dispatch({ type: "SNAPSHOT" });
        rotateRef.current.snapshotTaken = true;
      }

      const rect = overlayRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) *
          (180 / Math.PI) + 90;

      // Shift key → snap to 15° increments
      if (e.shiftKey) {
        angle = Math.round(angle / 15) * 15;
      }

      dispatch({
        type: "UPDATE_ELEMENT",
        id: el.id,
        patch: { rotation: angle },
      });
      return;
    }

    // ── RESIZE mode ──
    if (!resizeRef.current) return;

    const {
      dir,
      startX,
      startY,
      origTop,
      origLeft,
      origWidth,
      origHeight,
    } = resizeRef.current;

    // Defer snapshot to first actual move
    if (!resizeRef.current.snapshotTaken) {
      dispatch({ type: "SNAPSHOT" });
      resizeRef.current.snapshotTaken = true;
    }

    // Convert screen delta → canvas delta (divide by css transform scale)
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;

    let newTop = origTop;
    let newLeft = origLeft;
    let newWidth = origWidth;
    let newHeight: number | "auto" = origHeight;

    // Raw resize delta
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

    // Shift key → aspect-ratio lock (only on corner handles)
    if (e.shiftKey && isCorner(dir) && typeof newHeight === "number") {
      const aspect = origWidth / origHeight;
      if (Math.abs(dx) < Math.abs(dy)) {
        // Height is driving → adjust width
        newWidth = Math.max(20, (newHeight as number) * aspect);
        if (dir.includes("w")) {
          newLeft = origLeft + (origWidth - newWidth);
        }
      } else {
        // Width is driving → adjust height
        newHeight = Math.max(20, newWidth / aspect);
        if (dir.includes("n")) {
          newTop = origTop + (origHeight - (newHeight as number));
        }
      }
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      id: el.id,
      patch: { top: newTop, left: newLeft, width: newWidth, height: newHeight },
    });
  };

  // ── UP — moved before early return (see top of component) ─────────────────

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={overlayRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute",
        top: el.top - 2,
        left: el.left - 2,
        width: el.width + 4,
        height: elHeight + 4,
        zIndex: 99999,
        pointerEvents: "none",
        transform: `rotate(${el.rotation ?? 0}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* ── Selection border ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1.5px solid #3b82f6",
          borderRadius: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── 8 Resize handles ── */}
      {HANDLES.map((dir) => {
        const size = isCorner(dir) ? CORNER_HANDLE_SIZE : EDGE_HANDLE_SIZE;
        return (
          <div
            key={dir}
            onPointerDown={(e) => handleResizeDown(dir, e)}
            title="Resize (Shift = aspect lock)"
            style={{
              position: "absolute",
              ...handlePosition(dir),
              width: size,
              height: size,
              background: isCorner(dir) ? "#3b82f6" : "#fff",
              border: `2px solid #3b82f6`,
              borderRadius: isCorner(dir) ? "50%" : 2,
              cursor: HANDLE_CURSORS[dir],
              pointerEvents: "auto",
              zIndex: 2,
              boxShadow: "0 1px 4px rgba(59,130,246,0.4)",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          />
        );
      })}

      {/* ── Rotate connector line ── */}
      <div
        style={{
          position: "absolute",
          top: -22,
          left: "50%",
          width: 1,
          height: 22,
          background: "linear-gradient(180deg, transparent, #3b82f6)",
          pointerEvents: "none",
        }}
      />

      {/* ── Rotate handle ── */}
      <div
        onPointerDown={handleRotateDown}
        title="Rotate (Shift = snap 15°)"
        style={{
          position: "absolute",
          top: -36,
          left: "50%",
          marginLeft: -8,
          width: 16,
          height: 16,
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          border: "2px solid #fff",
          borderRadius: "50%",
          cursor: "grab",
          pointerEvents: "auto",
          zIndex: 2,
          boxShadow: "0 2px 8px rgba(99,102,241,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
          color: "#fff",
        }}
      >
        ↻
      </div>
    </div>
  );
}
