# CineLove 100% Parity Sprint — Design

> Match cinelove.me template editor feature-for-feature.

## Scope

8 features across 3 phases. Each phase: implement → TS check → build → verify.

## Phase 1: Core UX (this sprint)

### 1.1 Snap-to-center guidelines
- Hook: `useSnapGuides.ts` — calculates snap points from all elements + canvas center
- Threshold: 5px
- Snap targets: canvas center X (250px), canvas center Y, other element centers, other element edges
- Visual: `<SnapGuideLines />` — blue dashed lines (#3b82f6, 1px) rendered on canvas during drag
- Integration: `useDrag.ts` calls snap logic, adjusts position, emits active guide lines

### 1.2 Layers panel
- Component: `sidebar/LayersPanel.tsx`
- Shows all elements sorted by zIndex (highest first)
- Each row: type icon + element label + visibility toggle (eye) + lock toggle
- Click row → SELECT element, highlight in canvas
- Reorder via up/down buttons → dispatch REORDER
- Location: shown in CanvasRightPanel when no element selected (matches CineLove default right panel)

### 1.3 Device preview
- Component: `sidebar/DevicePreviewBar.tsx`
- 3 modes: Mobile (390px viewport), Tablet (768px), Desktop (1024px)
- Canvas stays 500px — preview only scales the view
- Scale ratios: mobile=0.78, tablet=1.0, desktop=1.0 (canvas already 500px)
- Position: sticky bar above canvas area

### 1.4 Fix double-click text edit
- Verify current behavior: single-click should only SELECT, double-click to enter edit mode
- Already implemented via `onDoubleClick={handleStartEdit}` in TextElement
- Ensure no auto-focus on selection

## Phase 2: Right panel + Pre-built sections

### 2.1 Right panel default state
When no element selected, show:
- Danh muc (category) dropdown
- Trang thai (status) dropdown: Nhap / Cong khai
- Ban xem truoc (preview thumbnail)
- Tinh nang nang cao (premium features section)

### 2.2 Pre-built sections (Thanh phan tab)
- 22 section presets matching CineLove categories
- Categories: Tat ca, Anh, Thong tin, Lich trinh, Loi moi, Khac
- Each preset = array of CanvasElements inserted at cursor position
- Stored in `server/data/section-presets.ts`

## Phase 3: Premium + Fonts

### 3.1 Self-hosted wedding fonts
8 fonts matching CineLove: BucThu, Aquarelle, Quicksand, Mallong, Montserrat, RetroSignature, Carlytte, Soul Note Display

### 3.2 Premium features
- Watermark removal toggle
- QR Bank input
- Auto-scroll toggle + speed slider

## Architecture

All new code goes into existing structure:
```
canvas-engine/
  useSnapGuides.ts (NEW)
  SnapGuideLines.tsx (NEW)
  useDrag.ts (MODIFY — integrate snap)
  CanvasRenderer.tsx (MODIFY — render guides)
  CanvasRightPanel.tsx (MODIFY — layers panel when no selection)
sidebar/
  LayersPanel.tsx (NEW)
  DevicePreviewBar.tsx (NEW)
```

## Success Criteria
- Snap guides visible when dragging within 5px of targets
- Layers panel shows all elements with working reorder/lock/visibility
- Device preview scales canvas correctly
- Text edit requires double-click (not single-click)
- TS 0 errors, build passes
