# Custom Canvas Engine — Design Document

**Date:** 2026-03-15
**Goal:** Replace CraftJS with custom canvas engine matching CineLove 1:1
**Branch:** `develop`

---

## 1. Problem Statement

LoveStory editor currently uses CraftJS with **flexbox containers** — elements are stacked in sections, constrained to parent containers. CineLove uses a **custom absolute-positioning engine** — elements placed freely anywhere on a tall canvas. The two approaches produce fundamentally different UX:

- CineLove: Free-form design, pixel-perfect placement, overlapping elements
- LoveStory: Rigid section-based layout, no free placement, container-locked elements

**Decision:** Drop CraftJS rendering entirely. Build custom canvas engine with absolute positioning.

---

## 2. CineLove Architecture (Reverse-Engineered)

### 2.1 Canvas Structure
```
Root Container (845px viewport)
  └── Canvas (500px × 7306px, position: relative, display: block)
       ├── Element 0 (position: absolute, top/left/width/z-index)
       ├── Element 1 (position: absolute, top/left/width/z-index)
       ├── ...
       └── Element 91 (position: absolute, top/left/width/z-index)
```

- **Flat element list** — no nesting, no containers
- Canvas: `500px` wide, `~7300px` tall (wedding = long vertical scroll)
- Background: `#f8f3eb` (cream/beige)
- All 92 elements are direct children of canvas

### 2.2 Element Inline Style Pattern
Every element uses identical style structure:
```css
position: absolute;
top: {float}px;
left: {float}px;
width: {float}px;
height: auto;          /* text auto-sizes */
z-index: {int};        /* 0-77 range */
cursor: move;          /* always draggable */
transform: rotate({deg}deg) scale({x}, {y});
```

### 2.3 Element Types (92 elements on template 53)
- **Text** (~60) — Rich text with font, color, size, alignment
- **PhotoBox** (~15) — Images with crop, border-radius, shadow
- **SVG/Clipart** (~10) — Decorative elements (icons, shapes, wax seals)
- **Widgets** (~7) — Countdown, Calendar, Map, RSVP, QR, Album, Envelope

### 2.4 Interaction Patterns
- **Drag:** `cursor: move` on all elements, updates top/left on drag
- **Resize:** Corner handles, updates width/height
- **Rotate:** Rotation handle, updates `transform: rotate()`
- **Selection:** Blue dashed border on selected element
- **Z-Order:** Context menu: bring front/back, move up/down layer
- **Lock:** Prevents drag/edit on locked elements

### 2.5 Right Panel (Element Properties)
When text selected:
- Font family, size, weight, style
- Color, background color
- Text alignment (left/center/right/justify)
- Letter spacing, line height
- Opacity slider
- Border (width, color, radius)
- Shadow (offset, blur, color)
- Animation (entrance effect, continuous motion)
- Link

When image selected:
- Replace image button
- Crop tool
- Border radius
- Opacity
- Shadow
- Animation

When nothing selected:
- Danh mục (category dropdown)
- Trạng thái (status dropdown)
- Bản xem trước (preview thumbnail)
- Tính năng nâng cao (premium features)
- Thư viện thiệp (library toggle)

---

## 3. LoveStory Custom Engine Design

### 3.1 Data Model

```typescript
interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "sticker" | "widget";

  // Position & Size (absolute, in pixels)
  top: number;
  left: number;
  width: number;
  height: number | "auto";  // "auto" for text elements

  // Transform
  rotation: number;         // degrees
  scaleX: number;          // 1 = normal, -1 = flipped
  scaleY: number;

  // Layer
  zIndex: number;
  locked: boolean;
  visible: boolean;

  // Appearance
  opacity: number;          // 0-1
  borderRadius: number;
  border: { width: number; color: string; style: string };
  shadow: { offsetX: number; offsetY: number; blur: number; spread: number; color: string } | null;

  // Animation
  entrance: { type: string; duration: number; delay: number } | null;
  continuous: { type: string; duration: number } | null;

  // Type-specific props
  props: TextProps | ImageProps | ShapeProps | WidgetProps;
}

interface TextProps {
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

interface ImageProps {
  src: string;
  objectFit: "cover" | "contain" | "fill";
  crop: { x: number; y: number; width: number; height: number } | null;
}

interface WidgetProps {
  widgetType: "countdown" | "calendar" | "map" | "rsvp" | "qrbox" | "album" | "envelope" | "youtube" | "callbutton" | "guestname" | "formbuilder";
  config: Record<string, unknown>;
}
```

### 3.2 Canvas Component Architecture

```
EditorPage
  ├── LeftSidebar (85px) — Tabs: text, image, stock, shape, bg, music, widgets, sections, templates, effects
  ├── CanvasViewport (flex: 1) — Scrollable area
  │    └── Canvas (500px × dynamic height, position: relative)
  │         ├── CanvasElement[0] (position: absolute)
  │         ├── CanvasElement[1] (position: absolute)
  │         ├── ...
  │         ├── SelectionOverlay — Blue dashed border + resize handles + rotate handle
  │         └── ContextMenu — Z-order, lock, copy/paste style, delete
  ├── RightPanel (320px) — Element properties or project settings
  ├── TopToolbar — Undo/redo, save, preview, publish
  └── BottomBar — Quick image replace strip
```

### 3.3 State Management

```typescript
interface EditorState {
  // Canvas
  elements: CanvasElement[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;

  // Selection
  selectedId: string | null;
  multiSelectIds: string[];

  // Interaction
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
  dragOffset: { x: number; y: number };

  // History
  undoStack: CanvasElement[][];
  redoStack: CanvasElement[][];

  // UI
  zoom: number;
  activeTab: string;
  showGrid: boolean;
}
```

Use `useReducer` + `useContext` (no external state library needed). All state updates are immutable (new arrays/objects).

### 3.4 Drag & Drop Implementation

```
Mouse/Touch Events:
  onPointerDown → start drag (record offset from element origin)
  onPointerMove → update element top/left (element.top = pointerY - offsetY)
  onPointerUp → commit position, push to undo stack

Resize:
  8 handles: N, NE, E, SE, S, SW, W, NW
  Each handle constrains which dimensions change
  Shift key → maintain aspect ratio

Rotate:
  Handle above element, drag to set angle
  angle = atan2(pointerY - centerY, pointerX - centerX)
```

### 3.5 Migration Strategy

**Phase 1 — Core Engine (replace CraftJS renderer)**
- [ ] New `CanvasRenderer` component with absolute positioning
- [ ] Element rendering: Text, Image
- [ ] Selection overlay with blue dashed border
- [ ] Drag to reposition
- [ ] Keep existing sidebar tabs (reuse UI)
- [ ] Keep existing right panel (adapt bindings)
- [ ] Save/load as new JSON format (not CraftJS state)

**Phase 2 — Full Interaction**
- [ ] 8-point resize handles
- [ ] Rotation handle
- [ ] Z-order context menu (bring front/back/up/down)
- [ ] Lock/unlock elements
- [ ] Copy/paste style
- [ ] Undo/redo (Ctrl+Z / Ctrl+Shift+Z)
- [ ] Delete (Del/Backspace)
- [ ] Arrow key nudge (1px, Shift+Arrow = 10px)

**Phase 3 — Right Panel Parity**
- [ ] Text settings: font, size, weight, color, align, spacing
- [ ] Image settings: replace, crop, border-radius, shadow
- [ ] Element settings: opacity, border, shadow, animation
- [ ] Project settings: category, status, preview, premium features

**Phase 4 — Widgets & Effects**
- [ ] Plugin widgets (countdown, calendar, map, rsvp, qr, album, envelope)
- [ ] Entrance animations
- [ ] Continuous motion effects
- [ ] Particle overlay effects
- [ ] Envelope intro overlay

**Phase 5 — Template Conversion**
- [ ] Convert all 75 template presets to new data format
- [ ] Migrate existing saved projects (CraftJS → new format)
- [ ] Remove all CraftJS dependencies

---

## 4. Files to Change

### New Files
- `src/app/editor/[id]/components/canvas/CanvasRenderer.tsx` — Main canvas
- `src/app/editor/[id]/components/canvas/CanvasElement.tsx` — Element wrapper
- `src/app/editor/[id]/components/canvas/SelectionOverlay.tsx` — Selection UI
- `src/app/editor/[id]/components/canvas/useEditorState.ts` — State management
- `src/app/editor/[id]/components/canvas/useDragResize.ts` — Drag/resize/rotate hooks
- `src/app/editor/[id]/components/canvas/ContextMenu.tsx` — Right-click menu

### Modified Files
- `src/app/editor/[id]/components/CraftVisualEditor.tsx` — Replace CraftJS usage with new canvas
- `src/app/editor/new/page.tsx` — New template → new format (not CraftJS state)
- `src/server/data/template-presets.ts` — Already uses correct data model (TemplateElement)

### Removed (Phase 5)
- All `craft/Craft*.tsx` components (CraftText, CraftImage, CraftContainer, etc.)
- CraftJS package from dependencies

---

## 5. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | Pure React + inline styles | Matches CineLove exactly, no library overhead |
| State | useReducer + Context | Simple, no extra dependency, sufficient for editor |
| Drag/Resize | Pointer events | Cross-platform, better than mouse events |
| Data format | JSON array of CanvasElement | Clean, no CraftJS nested tree complexity |
| Canvas size | 500px × dynamic | Matches CineLove, responsive via CSS transform scale |
| Save format | elements[] + meta{} | Backward compatible with existing canvas_json field |

---

## 6. Estimated Effort

- Phase 1 (Core): ~800 lines new code, ~200 lines modified
- Phase 2 (Interaction): ~500 lines new
- Phase 3 (Right Panel): ~400 lines modified
- Phase 4 (Widgets): ~300 lines adapted
- Phase 5 (Migration): ~200 lines, mostly deletion
- **Total: ~2200 lines new/modified**
