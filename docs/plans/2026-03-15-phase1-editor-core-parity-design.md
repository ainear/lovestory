# Phase 1: Editor Core Parity — Design Doc

**Date:** 2026-03-15
**Goal:** LoveStory editor editing experience matches CineLove 100%
**Scope:** Right panel redesign, text editing nang cao, element selection UX, inline text editing, stock/clipart library

---

## 1. Current State vs Target

### 1.1 Right Panel (Settings Panel)

**CineLove (target):**
- Always visible on right side (~280px width)
- Shows "Tuy chinh" header with pencil icon
- When NO element selected: "Click vao phan tu tren canvas de chinh sua" + hint
- When TEXT selected: Accordion sections — Kieu chu, Khoang dem, Duong vien, Do bong
- When IMAGE selected: Accordion sections — specific to images
- "Danh muc" dropdown + "Trang thai" dropdown always visible at top
- "Ban xem truoc" section with thumbnail + "Chinh sua" button

**LoveStory (current):**
- Right panel exists in CraftVisualEditor (~260px)
- Shows "Tuy chinh" header
- When NO element selected: "Click vao phan tu..." hint + "CAI DAT CHUNG" section (Trang thai, Link thiep, Tinh nang nang cao)
- When element selected: Uses component's `.craft.related.settings` to render settings
- Settings are inline in each Craft component file

**Gap:** LoveStory settings are functional but NOT organized into CineLove's accordion pattern. Need to restructure.

### 1.2 Text Editing Controls

**CineLove (target):**
- B / I / S / U buttons in a row
- Aa button (text-transform: uppercase/lowercase/capitalize/none)
- List button (bullet/numbered list)
- Can chinh: 4 alignment buttons
- Font size: -/+ buttons + dropdown (not just input)
- Font: Dropdown with font preview
- Mau chu: Color swatch
- Mau nen: Color swatch
- Trong suot: Slider 0.00 - 1.00
- Khoang dem: Collapsible accordion
- Duong vien: Collapsible accordion
- Do bong: Collapsible accordion

**LoveStory (current):**
- B / I / S / U buttons — OK
- NO Aa button — MISSING
- NO list button — MISSING
- 4 alignment buttons — OK
- Font size +/- + input — OK (but no dropdown)
- Font selector — OK (12 fonts)
- Color picker — OK
- Background color — OK
- Opacity slider — OK
- Letter spacing (in "Khoang dem" section) — OK but limited
- Shadow presets (in "Do bong" section) — OK
- NO "Duong vien" (border) section — MISSING

### 1.3 Element Selection UX

**CineLove (target):**
- Blue dashed selection border
- 2 small icon buttons below element when selected:
  - Move icon (4-arrow cross)
  - Rotate icon (circular arrow)
- Resize handles on corners/edges
- Floating toolbar above for text: font controls

**LoveStory (current):**
- Blue dashed selection border — OK
- Floating toolbar with Duplicate/Delete — OK
- 8-point resize handles on images — OK
- NO move/rotate icon buttons — MISSING
- NO rotation support — MISSING

### 1.4 Inline Text Editing

**CineLove (target):**
- Double-click on text element → cursor appears, can type directly
- Text element shows "Text" placeholder when adding new text
- Selection shows blue handles on left/right edges

**LoveStory (current):**
- `contentEditable={selected}` on CraftText — text becomes editable when selected (single click)
- Should be double-click to edit, single-click to select

### 1.5 Stock/Clipart Library

**CineLove (target):**
- Tab "Stock" in sidebar
- Categories with filter chips: Tat ca, Yeu to dam cuoi, Nhan vat, Hoa cuoi, Chu hy, Trai tim, Xem them
- Grid of SVG/PNG clipart illustrations (NOT photos)
- Wedding-specific: candles, double-happiness, flower baskets, hearts, couple characters
- Click to add to canvas as image/sticker element

**LoveStory (current):**
- Tab "Trang tri" (Stock renamed)
- Uses Unsplash PHOTOS (real photographs)
- 9 categories but all are photos
- Also has CraftSticker with SVG decorations
- DIFFERENT content type — photos vs clipart/illustrations

---

## 2. Design Decisions

### 2.1 Right Panel Architecture

**Decision:** Restructure right panel as a unified `SettingsPanel` component that:
1. Detects selected element type via `useEditor()`
2. Renders appropriate accordion sections based on type
3. Always shows project settings (Danh muc, Trang thai) at top
4. Uses consistent accordion pattern for all element types

**Component structure:**
```
SettingsPanel (new component)
├── ProjectSettings (always visible)
│   ├── Danh muc dropdown
│   ├── Trang thai dropdown
│   └── Ban xem truoc thumbnail
├── TextSettings (when CraftText selected)
│   ├── KieuChu accordion (B/I/S/U, Aa, alignment, font, size, colors, opacity)
│   ├── KhoangDem accordion (letter-spacing, line-height, padding)
│   ├── DuongVien accordion (border-width, border-color, border-radius)
│   └── DoBong accordion (shadow presets)
├── ImageSettings (when CraftImage selected)
│   ├── Preview + action buttons
│   ├── DuongVien accordion
│   ├── DoBong accordion
│   └── LienKet accordion (URL)
├── ContainerSettings (when CraftContainer selected)
│   └── Background + spacing controls
└── EmptyState (no selection)
    └── "Click vao phan tu..." hint
```

### 2.2 Text Editing Enhancements

**New controls to add:**
1. **Aa button** — Cycles: none → uppercase → lowercase → capitalize
2. **Font size dropdown** — Click on size number opens dropdown with common sizes (8,10,12,14,16,18,20,24,28,32,36,40,48,56,64,72,80,96,120)
3. **Duong vien section** — Border controls for text elements (width, color, radius)
4. **Inline editing fix** — Change from single-click to double-click contentEditable

### 2.3 Element Controls

**New controls:**
1. **Rotation** — Add `rotation` prop to all Craft components, render rotate handle
2. **Move handle** — Small drag icon below element (CineLove-style)
3. Both icons positioned 8px below selected element, 24x24px, semi-transparent background

### 2.4 Stock Library Redesign

**Decision:** Keep Unsplash photos BUT add a separate "clipart" section with SVG wedding illustrations

**Sources for clipart:**
- Existing CraftSticker SVGs (expand collection)
- Free SVG wedding illustration packs
- Categories matching CineLove: Yeu to dam cuoi, Nhan vat, Hoa cuoi, Chu hy, Trai tim

---

## 3. Implementation Plan

### Step 1: Right Panel Restructure (SettingsPanel component)
**Files:** New `apps/web/src/app/editor/[id]/components/sidebar/SettingsPanel.tsx`
**Changes to:** `CraftVisualEditor.tsx` — extract right panel logic into SettingsPanel

**Tasks:**
- [ ] 1.1 Create `SettingsPanel.tsx` component shell
- [ ] 1.2 Extract settings rendering from CraftVisualEditor right panel
- [ ] 1.3 Add ProjectSettings section (Danh muc, Trang thai, Ban xem truoc)
- [ ] 1.4 Implement accordion component (Chevron + collapse animation)
- [ ] 1.5 Wire up CraftText settings into accordion pattern
- [ ] 1.6 Wire up CraftImage settings into accordion pattern
- [ ] 1.7 Wire up CraftContainer settings into accordion pattern
- [ ] 1.8 Add empty state with hand icon + "Click vao phan tu..."
- [ ] 1.9 Visual match: fonts, spacing, colors match CineLove exactly

### Step 2: Text Editing Enhancements
**Files:** Modify `CraftText.tsx` + `SettingsPanel.tsx`

**Tasks:**
- [ ] 2.1 Add `textTransform` prop to CraftText (none/uppercase/lowercase/capitalize)
- [ ] 2.2 Add Aa button cycling through text-transform values
- [ ] 2.3 Add font size dropdown (click size number → popup with common sizes)
- [ ] 2.4 Add "Duong vien" (border) accordion section for text
- [ ] 2.5 Add `borderWidth`, `borderColor`, `borderRadius` props to CraftText
- [ ] 2.6 Fix inline editing: double-click to enter edit mode, single-click to select

### Step 3: Element Selection UX
**Files:** Modify all Craft components

**Tasks:**
- [ ] 3.1 Add `rotation` prop to CraftText, CraftImage, CraftContainer
- [ ] 3.2 Create shared `ElementControls` component (move + rotate icons)
- [ ] 3.3 Render ElementControls below selected element
- [ ] 3.4 Implement rotation drag handler (circular drag → degrees)
- [ ] 3.5 Apply CSS `transform: rotate(${rotation}deg)` to elements
- [ ] 3.6 Add rotation input in settings panel (0-360 degrees)

### Step 4: Stock/Clipart Library Upgrade
**Files:** Modify `StockPanel.tsx` + new clipart data file

**Tasks:**
- [ ] 4.1 Create `clipart-library.ts` with SVG wedding illustrations data
- [ ] 4.2 Add filter chips UI (Tat ca, Yeu to dam cuoi, Nhan vat, Hoa cuoi, Chu hy, Trai tim)
- [ ] 4.3 Add clipart grid with category filtering
- [ ] 4.4 Rename tab from "Trang tri" to "Stock" to match CineLove
- [ ] 4.5 Maintain existing Unsplash photos as secondary section
- [ ] 4.6 Click clipart → add as CraftSticker or CraftImage to canvas

### Step 5: Integration & Polish
**Tasks:**
- [ ] 5.1 CraftVisualEditor: integrate SettingsPanel, remove old right panel code
- [ ] 5.2 Match CineLove styling: sidebar icon sizes, tab highlight colors, panel widths
- [ ] 5.3 Add "Luu tam thoi" auto-save indicator in header (match CineLove's "Da luu tam thoi")
- [ ] 5.4 Test all features with template thiep-cuoi-53
- [ ] 5.5 Screenshot comparison test (automated Playwright)
- [ ] 5.6 Fix any remaining visual discrepancies

---

## 4. File Impact Analysis

| File | Action | Scope |
|------|--------|-------|
| `CraftVisualEditor.tsx` (1847 lines) | MODIFY | Extract right panel → SettingsPanel, adjust sidebar tab names |
| `CraftText.tsx` (380 lines) | MODIFY | Add textTransform, border props, fix contentEditable |
| `CraftImage.tsx` (425 lines) | MODIFY | Add rotation prop |
| `CraftContainer.tsx` (353 lines) | MODIFY | Add rotation prop |
| `StockPanel.tsx` (168 lines) | MODIFY | Add clipart section, filter chips |
| `SettingsPanel.tsx` | NEW | Unified settings panel (~400 lines) |
| `ElementControls.tsx` | NEW | Move/Rotate handles (~150 lines) |
| `Accordion.tsx` | NEW | Reusable accordion component (~80 lines) |
| `clipart-library.ts` | NEW | SVG clipart data (~200 lines) |

**Estimated total new/modified code:** ~1,200 lines new + ~500 lines modified

---

## 5. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CraftJS rotation support | HIGH | CraftJS supports transform via CSS, but drag-rotate needs custom handler |
| Breaking existing templates | HIGH | Test all 75 templates after changes, add default values for new props |
| Performance with many elements | MEDIUM | Use React.memo on settings components, debounce prop updates |
| Font loading | LOW | All fonts already loaded via Google Fonts in layout.tsx |

---

## 6. Success Criteria

- [ ] Right panel matches CineLove layout (accordion sections, project settings)
- [ ] Text editing has all CineLove controls (Aa, border, full accordion)
- [ ] Elements show move/rotate handles like CineLove
- [ ] Stock tab has clipart illustrations like CineLove
- [ ] Double-click to edit text inline
- [ ] Template 53 renders with correct fonts and layout
- [ ] No regression in existing 75 templates
- [ ] Playwright screenshot comparison shows <5% visual diff
