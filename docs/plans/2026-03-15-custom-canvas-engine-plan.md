# Custom Canvas Engine — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace CraftJS flexbox-container editor with custom absolute-positioning canvas engine matching CineLove 1:1.

**Architecture:** Flat element list rendered as `position: absolute` divs inside a 500px-wide relative canvas. State managed via `useReducer` + `useContext`. Pointer events for drag/resize/rotate. Existing sidebar & right panel UI reused with new data bindings.

**Tech Stack:** React 19, Next.js 15, TypeScript, Pointer Events API, Supabase (save/load)

**Design Doc:** `docs/plans/2026-03-15-custom-canvas-engine-design.md`

---

## Phase 1: Core Engine — Canvas + Elements + Drag

### Task 1: Data Model & Types

**Files:**
- Create: `src/app/editor/[id]/components/canvas/types.ts`

**Step 1: Create the CanvasElement type and EditorState**

```typescript
// types.ts
export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "sticker" | "widget";
  top: number;
  left: number;
  width: number;
  height: number | "auto";
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
  borderRadius: number;
  border: { width: number; color: string; style: string };
  shadow: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
  } | null;
  entrance: { type: string; duration: number; delay: number } | null;
  continuous: { type: string; duration: number } | null;
  props: TextProps | ImageProps | ShapeProps | WidgetProps;
}

export interface TextProps {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  backgroundColor: string;
  textAlign: "left" | "center" | "right" | "justify";
  lineHeight: number;
  letterSpacing: number;
}

export interface ImageProps {
  src: string;
  objectFit: "cover" | "contain" | "fill";
  crop: { x: number; y: number; width: number; height: number } | null;
}

export interface ShapeProps {
  shapeType: "rectangle" | "circle" | "line" | "star" | "heart";
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface WidgetProps {
  widgetType:
    | "countdown" | "calendar" | "map" | "rsvp" | "qrbox"
    | "album" | "envelope" | "youtube" | "callbutton"
    | "guestname" | "formbuilder";
  config: Record<string, unknown>;
}

export type EditorAction =
  | { type: "SET_ELEMENTS"; elements: CanvasElement[] }
  | { type: "SELECT"; id: string | null }
  | { type: "MULTI_SELECT"; ids: string[] }
  | { type: "UPDATE_ELEMENT"; id: string; patch: Partial<CanvasElement> }
  | { type: "UPDATE_PROPS"; id: string; props: Partial<CanvasElement["props"]> }
  | { type: "ADD_ELEMENT"; element: CanvasElement }
  | { type: "DELETE_ELEMENT"; id: string }
  | { type: "REORDER"; id: string; direction: "front" | "back" | "up" | "down" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_CANVAS"; width: number; height: number; background: string }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SNAPSHOT" }; // push current state to undo stack

export interface EditorState {
  elements: CanvasElement[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  selectedId: string | null;
  multiSelectIds: string[];
  zoom: number;
  undoStack: CanvasElement[][];
  redoStack: CanvasElement[][];
}

/** Factory: create default text element */
export function createTextElement(
  id: string,
  top: number,
  left: number,
  text: string,
  overrides?: Partial<CanvasElement>,
): CanvasElement {
  return {
    id,
    type: "text",
    top,
    left,
    width: 200,
    height: "auto",
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    opacity: 1,
    borderRadius: 0,
    border: { width: 0, color: "transparent", style: "solid" },
    shadow: null,
    entrance: null,
    continuous: null,
    props: {
      text,
      fontFamily: "'Playfair Display', serif",
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#1f2937",
      backgroundColor: "transparent",
      textAlign: "center",
      lineHeight: 1.4,
      letterSpacing: 0,
    } as TextProps,
    ...overrides,
  };
}

/** Factory: create default image element */
export function createImageElement(
  id: string,
  top: number,
  left: number,
  src: string,
  overrides?: Partial<CanvasElement>,
): CanvasElement {
  return {
    id,
    type: "image",
    top,
    left,
    width: 300,
    height: 200,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    opacity: 1,
    borderRadius: 12,
    border: { width: 0, color: "transparent", style: "solid" },
    shadow: null,
    entrance: null,
    continuous: null,
    props: {
      src,
      objectFit: "cover",
      crop: null,
    } as ImageProps,
    ...overrides,
  };
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: PASS (no errors)

**Step 3: Commit**

```bash
git add src/app/editor/[id]/components/canvas/types.ts
git commit -m "feat(canvas-engine): Task 1 — data model & types"
```

---

### Task 2: Editor State Reducer + Context

**Files:**
- Create: `src/app/editor/[id]/components/canvas/useEditorState.ts`

**Step 1: Implement the reducer and context provider**

```typescript
// useEditorState.ts
"use client";
import { createContext, useContext, useReducer, useCallback, type Dispatch } from "react";
import type { EditorState, EditorAction, CanvasElement } from "./types";

const MAX_UNDO = 50;

const initialState: EditorState = {
  elements: [],
  canvasWidth: 500,
  canvasHeight: 7300,
  canvasBackground: "#f8f3eb",
  selectedId: null,
  multiSelectIds: [],
  zoom: 1,
  undoStack: [],
  redoStack: [],
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_ELEMENTS":
      return { ...state, elements: action.elements };

    case "SELECT":
      return { ...state, selectedId: action.id, multiSelectIds: [] };

    case "MULTI_SELECT":
      return { ...state, multiSelectIds: action.ids, selectedId: null };

    case "UPDATE_ELEMENT": {
      const elements = state.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.patch } : el,
      );
      return { ...state, elements };
    }

    case "UPDATE_PROPS": {
      const elements = state.elements.map((el) =>
        el.id === action.id
          ? { ...el, props: { ...el.props, ...action.props } }
          : el,
      );
      return { ...state, elements };
    }

    case "ADD_ELEMENT":
      return {
        ...state,
        elements: [...state.elements, action.element],
        selectedId: action.element.id,
      };

    case "DELETE_ELEMENT": {
      const elements = state.elements.filter((el) => el.id !== action.id);
      const selectedId = state.selectedId === action.id ? null : state.selectedId;
      return { ...state, elements, selectedId };
    }

    case "REORDER": {
      const idx = state.elements.findIndex((el) => el.id === action.id);
      if (idx === -1) return state;
      const maxZ = Math.max(...state.elements.map((el) => el.zIndex), 0);
      const minZ = Math.min(...state.elements.map((el) => el.zIndex), 0);
      const el = state.elements[idx];

      let newZ = el.zIndex;
      if (action.direction === "front") newZ = maxZ + 1;
      else if (action.direction === "back") newZ = Math.max(minZ - 1, 0);
      else if (action.direction === "up") newZ = el.zIndex + 1;
      else if (action.direction === "down") newZ = Math.max(el.zIndex - 1, 0);

      const elements = state.elements.map((e) =>
        e.id === action.id ? { ...e, zIndex: newZ } : e,
      );
      return { ...state, elements };
    }

    case "SNAPSHOT": {
      const undoStack = [...state.undoStack, state.elements].slice(-MAX_UNDO);
      return { ...state, undoStack, redoStack: [] };
    }

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const undoStack = [...state.undoStack];
      const prev = undoStack.pop()!;
      return {
        ...state,
        elements: prev,
        undoStack,
        redoStack: [...state.redoStack, state.elements],
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const redoStack = [...state.redoStack];
      const next = redoStack.pop()!;
      return {
        ...state,
        elements: next,
        redoStack,
        undoStack: [...state.undoStack, state.elements],
      };
    }

    case "SET_CANVAS":
      return {
        ...state,
        canvasWidth: action.width,
        canvasHeight: action.height,
        canvasBackground: action.background,
      };

    case "SET_ZOOM":
      return { ...state, zoom: action.zoom };

    default:
      return state;
  }
}

// Context
interface EditorContextValue {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  selectedElement: CanvasElement | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be inside EditorProvider");
  return ctx;
}

export { EditorContext, editorReducer, initialState };
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/editor/[id]/components/canvas/useEditorState.ts
git commit -m "feat(canvas-engine): Task 2 — editor state reducer + context"
```

---

### Task 3: Canvas Renderer Component

**Files:**
- Create: `src/app/editor/[id]/components/canvas/CanvasRenderer.tsx`

**Step 1: Build the canvas that renders elements with absolute positioning**

```typescript
// CanvasRenderer.tsx
"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";
import type { CanvasElement, TextProps, ImageProps } from "./types";

/** Render a single text element */
function TextElement({ el }: { el: CanvasElement }) {
  const p = el.props as TextProps;
  return (
    <div
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
        userSelect: "none",
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
  const { dispatch } = useEditorContext();

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
        cursor: el.locked ? "default" : "move",
        outline: isSelected ? "2px dashed #3b82f6" : "none",
        outlineOffset: 2,
        boxSizing: "border-box",
        display: el.visible ? "block" : "none",
      }}
    >
      {el.type === "text" && <TextElement el={el} />}
      {el.type === "image" && <ImageElement el={el} />}
      {el.type === "sticker" && <ImageElement el={el} />}
    </div>
  );
}

/** Main canvas renderer */
export function CanvasRenderer() {
  const { state, dispatch } = useEditorContext();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (id: string) => {
      dispatch({ type: "SNAPSHOT" });
      dispatch({ type: "SELECT", id });
    },
    [dispatch],
  );

  const handleCanvasClick = useCallback(
    (e: React.PointerEvent) => {
      // Click on canvas background → deselect
      if (e.target === canvasRef.current) {
        dispatch({ type: "SELECT", id: null });
      }
    },
    [dispatch],
  );

  // Sort elements by zIndex for correct rendering order
  const sortedElements = [...state.elements].sort(
    (a, b) => a.zIndex - b.zIndex,
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
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/editor/[id]/components/canvas/CanvasRenderer.tsx
git commit -m "feat(canvas-engine): Task 3 — canvas renderer with absolute positioning"
```

---

### Task 4: Drag to Reposition

**Files:**
- Create: `src/app/editor/[id]/components/canvas/useDrag.ts`
- Modify: `src/app/editor/[id]/components/canvas/CanvasRenderer.tsx` — add drag to CanvasElementWrapper

**Step 1: Create drag hook**

```typescript
// useDrag.ts
"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";

export function useDrag(elementId: string) {
  const { state, dispatch } = useEditorContext();
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origTop: number;
    origLeft: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = state.elements.find((el) => el.id === elementId);
      if (!el || el.locked) return;

      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      // Snapshot for undo before starting drag
      dispatch({ type: "SNAPSHOT" });
      dispatch({ type: "SELECT", id: elementId });

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origTop: el.top,
        origLeft: el.left,
      };
    },
    [elementId, state.elements, dispatch],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;

      const zoom = state.zoom;
      const dx = (e.clientX - dragRef.current.startX) / zoom;
      const dy = (e.clientY - dragRef.current.startY) / zoom;

      dispatch({
        type: "UPDATE_ELEMENT",
        id: elementId,
        patch: {
          top: dragRef.current.origTop + dy,
          left: dragRef.current.origLeft + dx,
        },
      });
    },
    [elementId, state.zoom, dispatch],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
```

**Step 2: Wire drag into CanvasElementWrapper**

In `CanvasRenderer.tsx`, update `CanvasElementWrapper` to use `useDrag`:

```typescript
// Add to CanvasElementWrapper:
import { useDrag } from "./useDrag";

// Inside CanvasElementWrapper component:
const drag = useDrag(el.id);

// Replace handlePointerDown and add to the wrapper div:
<div
  data-element-id={el.id}
  onPointerDown={drag.onPointerDown}
  onPointerMove={drag.onPointerMove}
  onPointerUp={drag.onPointerUp}
  style={...}
>
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/editor/[id]/components/canvas/useDrag.ts src/app/editor/[id]/components/canvas/CanvasRenderer.tsx
git commit -m "feat(canvas-engine): Task 4 — drag to reposition elements"
```

---

### Task 5: Selection Overlay + Resize Handles

**Files:**
- Create: `src/app/editor/[id]/components/canvas/SelectionOverlay.tsx`

**Step 1: Build selection overlay with 8 resize handles + rotate handle**

```typescript
// SelectionOverlay.tsx
"use client";
import { useCallback, useRef } from "react";
import { useEditorContext } from "./useEditorState";

const HANDLE_SIZE = 8;
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type HandleDir = (typeof HANDLES)[number];

const HANDLE_CURSORS: Record<HandleDir, string> = {
  nw: "nw-resize", n: "n-resize", ne: "ne-resize", e: "e-resize",
  se: "se-resize", s: "s-resize", sw: "sw-resize", w: "w-resize",
};

function handlePosition(dir: HandleDir) {
  const half = -HANDLE_SIZE / 2;
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

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const { dir, startX, startY, origTop, origLeft, origWidth, origHeight } = resizeRef.current;
    const zoom = state.zoom;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;

    let newTop = origTop;
    let newLeft = origLeft;
    let newWidth = origWidth;
    let newHeight: number | "auto" = origHeight;

    // Resize logic per handle direction
    if (dir.includes("e")) newWidth = Math.max(20, origWidth + dx);
    if (dir.includes("w")) {
      newWidth = Math.max(20, origWidth - dx);
      newLeft = origLeft + dx;
    }
    if (dir.includes("s")) newHeight = Math.max(20, origHeight + dy);
    if (dir.includes("n") && dir !== "ne" && dir !== "nw") {
      newHeight = Math.max(20, origHeight - dy);
      newTop = origTop + dy;
    }
    if (dir === "nw" || dir === "ne") {
      newHeight = Math.max(20, origHeight - dy);
      newTop = origTop + dy;
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      id: el.id,
      patch: { top: newTop, left: newLeft, width: newWidth, height: newHeight },
    });
  };

  const handleResizeUp = () => {
    resizeRef.current = null;
  };

  return (
    <div
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
```

**Step 2: Add SelectionOverlay to CanvasRenderer**

In `CanvasRenderer.tsx`, add after the elements map:
```typescript
import { SelectionOverlay } from "./SelectionOverlay";

// Inside the canvas div, after sortedElements.map:
<SelectionOverlay />
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/editor/[id]/components/canvas/SelectionOverlay.tsx src/app/editor/[id]/components/canvas/CanvasRenderer.tsx
git commit -m "feat(canvas-engine): Task 5 — selection overlay + 8 resize handles"
```

---

### Task 6: Keyboard Shortcuts

**Files:**
- Create: `src/app/editor/[id]/components/canvas/useKeyboard.ts`

**Step 1: Implement keyboard handler**

```typescript
// useKeyboard.ts
"use client";
import { useEffect } from "react";
import { useEditorContext } from "./useEditorState";

export function useKeyboard() {
  const { state, dispatch } = useEditorContext();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      // Don't capture if typing in input/textarea
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const el = state.elements.find((el) => el.id === state.selectedId);

      // Delete selected element
      if ((e.key === "Delete" || e.key === "Backspace") && state.selectedId) {
        e.preventDefault();
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "DELETE_ELEMENT", id: state.selectedId });
        return;
      }

      // Undo: Ctrl+Z
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      // Redo: Ctrl+Shift+Z
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      // Arrow key nudge (1px, Shift = 10px)
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && el && !el.locked) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        dispatch({ type: "SNAPSHOT" });
        const patch: Partial<typeof el> = {};
        if (e.key === "ArrowUp") patch.top = el.top - step;
        if (e.key === "ArrowDown") patch.top = el.top + step;
        if (e.key === "ArrowLeft") patch.left = el.left - step;
        if (e.key === "ArrowRight") patch.left = el.left + step;
        dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch });
        return;
      }

      // Escape: deselect
      if (e.key === "Escape") {
        dispatch({ type: "SELECT", id: null });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedId, state.elements, dispatch]);
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/editor/[id]/components/canvas/useKeyboard.ts
git commit -m "feat(canvas-engine): Task 6 — keyboard shortcuts (delete, undo, redo, nudge)"
```

---

### Task 7: Context Menu

**Files:**
- Create: `src/app/editor/[id]/components/canvas/CanvasContextMenu.tsx`

**Step 1: Build context menu matching CineLove**

```typescript
// CanvasContextMenu.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import { useEditorContext } from "./useEditorState";

interface MenuPosition {
  x: number;
  y: number;
  elementId: string;
}

export function CanvasContextMenu() {
  const { state, dispatch } = useEditorContext();
  const [menu, setMenu] = useState<MenuPosition | null>(null);

  // Listen for contextmenu on canvas elements
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const elDiv = target.closest("[data-element-id]") as HTMLElement;
      if (!elDiv) {
        setMenu(null);
        return;
      }
      e.preventDefault();
      const id = elDiv.getAttribute("data-element-id")!;
      dispatch({ type: "SELECT", id });
      setMenu({ x: e.clientX, y: e.clientY, elementId: id });
    }

    function handleClick() {
      setMenu(null);
    }

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [dispatch]);

  if (!menu) return null;

  const el = state.elements.find((e) => e.id === menu.elementId);
  if (!el) return null;

  const menuItems = [
    {
      icon: "⬆",
      label: "Đưa lên trên cùng",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "front" as const }),
    },
    {
      icon: "⬇",
      label: "Đưa xuống dưới cùng",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "back" as const }),
    },
    {
      icon: "↑",
      label: "Đưa lên một lớp",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "up" as const }),
    },
    {
      icon: "↓",
      label: "Đưa xuống một lớp",
      action: () => dispatch({ type: "REORDER", id: el.id, direction: "down" as const }),
    },
    {
      icon: el.locked ? "🔓" : "🔒",
      label: el.locked ? "Mở khóa" : "Khóa vị trí",
      action: () =>
        dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch: { locked: !el.locked } }),
    },
    {
      icon: "🗑",
      label: "Xóa",
      action: () => {
        dispatch({ type: "SNAPSHOT" });
        dispatch({ type: "DELETE_ELEMENT", id: el.id });
      },
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: menu.y,
        left: menu.x,
        background: "#1f2937",
        borderRadius: 8,
        padding: "4px 0",
        minWidth: 200,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        zIndex: 999999,
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={(e) => {
            e.stopPropagation();
            item.action();
            setMenu(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "8px 16px",
            border: "none",
            background: "transparent",
            color: "#e5e7eb",
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.background = "transparent";
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <div style={{ padding: "4px 16px", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
        Lớp hiện tại: {el.zIndex}
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/editor/[id]/components/canvas/CanvasContextMenu.tsx
git commit -m "feat(canvas-engine): Task 7 — context menu (z-order, lock, delete)"
```

---

### Task 8: TemplateElement → CanvasElement Converter

**Files:**
- Create: `src/app/editor/[id]/components/canvas/convertTemplate.ts`

**Why:** The existing `template-presets.ts` uses `TemplateElement` (with x/y). We need to convert to `CanvasElement` (with top/left). This replaces the old `convertElementsToCraftState()`.

**Step 1: Write the converter**

```typescript
// convertTemplate.ts
import type { CanvasElement, TextProps, ImageProps, WidgetProps } from "./types";

interface TemplateElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  animation: { entrance: string; loop: string };
  props: Record<string, unknown>;
}

export function convertTemplateToCanvas(elements: TemplateElement[]): CanvasElement[] {
  return elements.map((te) => {
    const base: Omit<CanvasElement, "props"> = {
      id: te.id,
      type: mapType(te.type),
      top: te.y,
      left: te.x,
      width: te.width,
      height: te.type === "text" ? ("auto" as const) : te.height,
      rotation: te.rotation,
      scaleX: 1,
      scaleY: 1,
      zIndex: te.zIndex,
      locked: te.locked,
      visible: true,
      opacity: te.opacity,
      borderRadius: (te.props.borderRadius as number) || 0,
      border: { width: 0, color: "transparent", style: "solid" },
      shadow: null,
      entrance:
        te.animation.entrance !== "none"
          ? { type: te.animation.entrance, duration: 600, delay: 0 }
          : null,
      continuous:
        te.animation.loop !== "none"
          ? { type: te.animation.loop, duration: 2000 }
          : null,
    };

    let props: CanvasElement["props"];

    if (te.type === "text") {
      props = {
        text: (te.props.text as string) || "",
        fontFamily: (te.props.fontFamily as string) || "'Playfair Display', serif",
        fontSize: (te.props.fontSize as number) || 16,
        fontWeight: (te.props.fontWeight as string) || "normal",
        fontStyle: (te.props.fontStyle as string) || "normal",
        color: (te.props.color as string) || "#1f2937",
        backgroundColor: "transparent",
        textAlign: ((te.props.textAlign as string) || "center") as TextProps["textAlign"],
        lineHeight: (te.props.lineHeight as number) || 1.4,
        letterSpacing: (te.props.letterSpacing as number) || 0,
      } satisfies TextProps;
    } else if (te.type === "image") {
      props = {
        src: (te.props.src as string) || "/placeholder-couple.png",
        objectFit: ((te.props.objectFit as string) || "cover") as ImageProps["objectFit"],
        crop: null,
      } satisfies ImageProps;
    } else {
      // Widget types (countdown, calendar, map, etc.)
      props = {
        widgetType: te.type as WidgetProps["widgetType"],
        config: te.props,
      } satisfies WidgetProps;
    }

    return { ...base, props } as CanvasElement;
  });
}

function mapType(type: string): CanvasElement["type"] {
  if (type === "text") return "text";
  if (type === "image") return "image";
  if (type === "shape") return "shape";
  if (type === "sticker") return "sticker";
  return "widget"; // countdown, calendar, map, rsvp, qrbox, album, envelope, etc.
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/editor/[id]/components/canvas/convertTemplate.ts
git commit -m "feat(canvas-engine): Task 8 — TemplateElement → CanvasElement converter"
```

---

### Task 9: Wire Into Editor Page

**Files:**
- Create: `src/app/editor/[id]/components/canvas/index.ts` — barrel export
- Modify: `src/app/editor/[id]/components/CraftVisualEditor.tsx` — replace CraftJS canvas with new CanvasRenderer

**This is the integration task.** The existing CraftVisualEditor.tsx is 5,600+ lines. We keep ALL sidebar UI, right panel UI, top toolbar, bottom bar — only replace the central canvas area.

**Step 1: Create barrel export**

```typescript
// canvas/index.ts
export { CanvasRenderer } from "./CanvasRenderer";
export { SelectionOverlay } from "./SelectionOverlay";
export { CanvasContextMenu } from "./CanvasContextMenu";
export { useEditorContext, EditorContext, editorReducer, initialState } from "./useEditorState";
export { useKeyboard } from "./useKeyboard";
export { useDrag } from "./useDrag";
export { convertTemplateToCanvas } from "./convertTemplate";
export * from "./types";
```

**Step 2: In CraftVisualEditor.tsx, add the new canvas engine**

This is the key integration. Find the section where `<Editor>` + `<Frame>` from CraftJS render the canvas. Replace it with:

```typescript
import { useReducer, useMemo } from "react";
import {
  CanvasRenderer,
  CanvasContextMenu,
  EditorContext,
  editorReducer,
  initialState,
  useKeyboard,
  convertTemplateToCanvas,
} from "./canvas";
import type { CanvasElement, EditorState } from "./canvas/types";

// Inside CraftVisualEditor component:
// 1. Initialize state with useReducer
const [editorState, editorDispatch] = useReducer(editorReducer, initialState);

// 2. Compute selectedElement for context
const selectedElement = useMemo(
  () => editorState.elements.find((el) => el.id === editorState.selectedId) || null,
  [editorState.elements, editorState.selectedId],
);

// 3. Create context value
const editorCtx = useMemo(
  () => ({ state: editorState, dispatch: editorDispatch, selectedElement }),
  [editorState, selectedElement],
);

// 4. In render, wrap the canvas area with EditorContext.Provider:
<EditorContext.Provider value={editorCtx}>
  <CanvasRenderer />
  <CanvasContextMenu />
</EditorContext.Provider>

// 5. Replace convertElementsToCraftState() calls with convertTemplateToCanvas()
// 6. Update save() to serialize editorState.elements instead of CraftJS query.serialize()
// 7. Update load() to set elements from canvas_json instead of CraftJS deserialize
```

**Step 3: Verify build**

Run: `npx tsc --noEmit && npx next build`

**Step 4: Manual test**

Open `http://localhost:3000/editor/new?template=thiep-cuoi-53` and verify:
- Elements render with absolute positioning
- Click to select (blue dashed border)
- Drag to reposition
- Right-click context menu works
- Keyboard shortcuts work (Delete, Ctrl+Z, arrows)

**Step 5: Commit**

```bash
git add src/app/editor/[id]/components/canvas/index.ts src/app/editor/[id]/components/CraftVisualEditor.tsx
git commit -m "feat(canvas-engine): Task 9 — wire custom canvas into editor page"
```

---

### Task 10: Save & Load New Format

**Files:**
- Modify: `src/app/editor/[id]/components/CraftVisualEditor.tsx` — update save/load

**Step 1: Update save function**

Find the existing `save()` function (~line 1069). Change from CraftJS serialize to:

```typescript
const canvasJson = JSON.stringify({
  version: 2,
  engine: "custom-canvas",
  canvas: {
    width: editorState.canvasWidth,
    height: editorState.canvasHeight,
    background: editorState.canvasBackground,
  },
  elements: editorState.elements,
  meta: {
    particleEffect,
    pageAnimation,
    curtainEffect,
    musicUrl,
    musicName,
  },
});
```

**Step 2: Update load function**

Find the load useEffect (~line 882). Add version detection:

```typescript
const saved = project.canvas_json;
if (saved) {
  const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;

  if (parsed.version === 2 && parsed.engine === "custom-canvas") {
    // New format
    editorDispatch({ type: "SET_ELEMENTS", elements: parsed.elements });
    editorDispatch({
      type: "SET_CANVAS",
      width: parsed.canvas.width,
      height: parsed.canvas.height,
      background: parsed.canvas.background,
    });
  } else {
    // Legacy CraftJS format — convert (Phase 5 migration)
    console.warn("Legacy CraftJS format detected — migration needed");
  }
}
```

**Step 3: Verify TypeScript compiles and save/load works**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/editor/[id]/components/CraftVisualEditor.tsx
git commit -m "feat(canvas-engine): Task 10 — save/load with version 2 format"
```

---

## Phase 2: Full Interaction (Tasks 11-14)

### Task 11: Rotation Handle

**Files:**
- Modify: `src/app/editor/[id]/components/canvas/SelectionOverlay.tsx`

Add rotation logic to the circle handle above the element. On pointer drag, compute angle:
```typescript
const centerX = el.left + el.width / 2;
const centerY = el.top + (elHeight) / 2;
const angle = Math.atan2(pointerY - centerY, pointerX - centerX) * (180 / Math.PI) + 90;
dispatch({ type: "UPDATE_ELEMENT", id: el.id, patch: { rotation: angle } });
```

---

### Task 12: Inline Text Editing

**Files:**
- Modify: `src/app/editor/[id]/components/canvas/CanvasRenderer.tsx`

Double-click on text element → set `contentEditable=true`, focus. On blur → save text via `UPDATE_PROPS`.

---

### Task 13: Element Toolbar (Clone/Delete)

**Files:**
- Create: `src/app/editor/[id]/components/canvas/ElementToolbar.tsx`

Floating toolbar above selected element with: Clone, Delete, Menu (⋯) buttons. Matching CineLove's toolbar style.

---

### Task 14: Right Panel Binding

**Files:**
- Modify: `src/app/editor/[id]/components/CraftVisualEditor.tsx` — right panel section

Replace CraftJS `useNode().setProp()` calls with `dispatch({ type: "UPDATE_PROPS" })`. Wire font, color, size, alignment, opacity, border, shadow controls to the new state.

---

## Phase 3: Right Panel Parity (Tasks 15-17)

### Task 15: Text Properties Panel
Full font family selector, font size, weight, italic, color picker, text alignment, line height, letter spacing.

### Task 16: Image Properties Panel
Replace image, crop tool, border-radius, opacity, shadow.

### Task 17: Element Properties Panel (shared)
Opacity slider, border controls, shadow controls, entrance animation dropdown, continuous motion dropdown, link URL.

---

## Phase 4: Widgets & Effects (Tasks 18-21)

### Task 18: Widget Renderers
Add widget rendering to CanvasRenderer for: countdown, calendar, map, rsvp, qrbox, album, envelope. Reuse existing Craft* widget components but strip CraftJS hooks — make them pure React components that receive props.

### Task 19: Entrance Animations
CSS @keyframes for: fadeIn, slideUp, scaleIn, flipIn. Apply via IntersectionObserver on viewer/invitation page.

### Task 20: Particle Effects
Reuse existing ParticleOverlay component. Wire to editor settings.

### Task 21: Envelope Intro
Reuse existing CraftEnvelope as a pure component overlay.

---

## Phase 5: Migration & Cleanup (Tasks 22-24)

### Task 22: Template Preset Conversion
Update `editor/new/page.tsx` to use `convertTemplateToCanvas()` instead of `convertElementsToCraftState()`. All 75 templates now produce `CanvasElement[]` directly.

### Task 23: Legacy Project Migration
Add migration function: detect CraftJS format in `canvas_json`, convert to version 2 format on load.

### Task 24: Remove CraftJS
- Delete all `craft/Craft*.tsx` files
- Remove `@craftjs/core` from package.json
- Remove CraftJS imports from CraftVisualEditor.tsx
- Clean up `CraftEditorWrapper.tsx`
- Run `pnpm install` to update lockfile
- Verify build passes

---

## Execution Checklist

| Task | Phase | Description | Est. Lines |
|------|-------|-------------|-----------|
| 1 | 1 | Data model & types | ~180 |
| 2 | 1 | Editor state reducer + context | ~150 |
| 3 | 1 | Canvas renderer (absolute pos) | ~150 |
| 4 | 1 | Drag to reposition | ~60 |
| 5 | 1 | Selection overlay + resize handles | ~160 |
| 6 | 1 | Keyboard shortcuts | ~60 |
| 7 | 1 | Context menu | ~100 |
| 8 | 1 | Template converter | ~80 |
| 9 | 1 | Wire into editor page | ~100 |
| 10 | 1 | Save/load new format | ~50 |
| 11 | 2 | Rotation handle | ~30 |
| 12 | 2 | Inline text editing | ~50 |
| 13 | 2 | Element toolbar | ~80 |
| 14 | 2 | Right panel binding | ~200 |
| 15 | 3 | Text properties panel | ~150 |
| 16 | 3 | Image properties panel | ~100 |
| 17 | 3 | Element properties panel | ~100 |
| 18 | 4 | Widget renderers | ~200 |
| 19 | 4 | Entrance animations | ~60 |
| 20 | 4 | Particle effects | ~30 |
| 21 | 4 | Envelope intro | ~30 |
| 22 | 5 | Template preset conversion | ~50 |
| 23 | 5 | Legacy migration | ~80 |
| 24 | 5 | Remove CraftJS | deletion |
| **Total** | | | **~2300** |
