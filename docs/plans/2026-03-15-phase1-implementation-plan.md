# Phase 1: Editor Parity — CineLove 100% Feature Match

**Date:** 2026-03-15
**Branch:** `feat/phase1-editor-parity`
**Base:** `develop`
**Deadline:** None (quality over speed)
**Developer:** Claude (solo)

---

## Critical Finding: CineLove Also Uses CraftJS!

Reverse-engineering revealed CineLove uses **the same CraftJS framework** as LoveStory.
Their template data is CraftJS serialized state (Base64 + lz-string compression).

**Original plan:** Remove CraftJS, build custom engine (~5,500 new lines)
**Updated plan:** **KEEP CraftJS**, enhance UI & features to match CineLove (~2,500 new lines)

This reduces scope by ~55% while achieving the same 100% parity goal.

---

## Updated Interview Decisions

| Decision | Original | Updated | Why Changed |
|----------|----------|---------|-------------|
| CraftJS | Remove entirely | **KEEP** | CineLove uses CraftJS too — it's proven at scale |
| Canvas engine | Custom engine | **CraftJS enhanced** | No need to rebuild what works |
| Data format | Clean break v3 | **Keep CraftJS format** | Same format as CineLove |
| Template migration | Rewrite all 75 | **Incremental enhancement** | Templates already work in CraftJS |
| Settings architecture | Distributed + wrap | **Same (unchanged)** | Already correct approach |
| Clipart source | Scrape CineLove | **Same (unchanged)** | Still needed for parity |

---

## What Actually Needs to Change

### Gap Analysis (CineLove vs LoveStory)

| Feature | CineLove | LoveStory Current | Action |
|---------|----------|-------------------|--------|
| Editor engine | CraftJS | CraftJS | ✅ Same |
| Sidebar layout | 85px, 10 tabs, icon+text | ~52px, 9 tabs | Resize + add Hình dạng tab |
| Stock library | SVG clipart (wedding) | Unsplash photos | Replace with clipart |
| Thành phần tab | 22+ pre-built sections | None | Add new tab |
| Hình dạng tab | Geometric shapes | None | Add new tab |
| Hiệu ứng tab | 3 categories (động, mở màn, rơi) | Particles only | Add page animations |
| Right panel | 350px, project settings + element settings | 260px, basic | Widen + add features |
| Element rotation | Full rotation support | None | Add rotation |
| Text editing | Double-click → edit | Single-click → edit | Fix to double-click |
| Text controls | B/I/S/U + Aa + borders | B/I/S/U | Add Aa, borders |
| Fonts | 8 custom fonts (self-hosted) | 12 Google Fonts | Add CineLove fonts |
| Premium features | Watermark, QR Bank, auto-scroll | Partial | Add premium section |
| Selection UX | Blue dashed + move/rotate icons | Blue dashed | Add icons |
| Image CDN | img.cinelove.me (resize) | Direct URLs | Already using Supabase |

---

## Execution Plan (5 Steps)

### Step 0: Reverse-Engineering ✅ DONE
- [x] Analyzed CineLove editor DOM, layout, components
- [x] Identified tech stack: Next.js + CraftJS + Ant Design + Tailwind
- [x] Captured sidebar tabs, stock assets, effects, settings panel
- [x] Documented in `cinelove-architecture-analysis.md`
- [x] Key finding: CineLove also uses CraftJS!

**Output:** `docs/plans/cinelove-architecture-analysis.md`

---

### Step 1: Editor UI Restructure
> Restructure sidebar, settings panel, and header to match CineLove

**1.1** Widen left sidebar to 85px, add icon+text labels
- Match CineLove's `ant-tabs-left` pattern
- All 10 tabs with SVG icons + Vietnamese labels
- Bottom "Hỗ trợ" button

**1.2** Add missing sidebar tabs
- `ShapePanel.tsx` — Geometric shapes (line, rect, circle, triangle)
- `ComponentPanel.tsx` — Pre-built sections with categories (Ảnh, Thông tin, Lịch trình, Lời mời, Khác)
- Enhance `EffectsPanel.tsx` — Add "Hiệu ứng động" (page animations) and "Hiệu ứng mở màn" (curtain)

**1.3** Restructure right panel to 350px
- **Project settings** always visible: Danh mục dropdown, Trạng thái dropdown, Bản xem trước thumbnail
- **Tính năng nâng cao** section: Xóa watermark, Tùy chỉnh thanh công cụ dưới, QR Bank, Tùy chỉnh tự động cuộn
- **Element settings** in accordion sections when element selected
- **Empty state** when no element selected

**1.4** Create `Accordion` reusable component
- Chevron icon, smooth collapse animation
- Used in right panel settings sections

**1.5** Update header bar
- Add "Đã lưu tạm thời" save indicator
- Match CineLove header layout

**Commit:** `feat(phase1): step 1 — Editor UI restructure (sidebar 85px, settings 350px, new tabs)`

---

### Step 2: CraftJS Component Enhancements
> Add missing props and features to existing CraftJS components

**2.1** Add rotation support to all components
- Add `rotation` prop to CraftText, CraftImage, CraftContainer
- CSS `transform: rotate(${rotation}deg)`
- Rotate handle in selection overlay
- Rotation input in settings panel (0-360°)

**2.2** Fix text editing UX
- Change from single-click → double-click to enter contentEditable
- Single-click = select only (show selection border)
- Double-click = enter edit mode (contentEditable=true)

**2.3** Add text enhancement controls
- **Aa button**: text-transform cycling (none → uppercase → lowercase → capitalize)
- **Font size dropdown**: Click size number → dropdown with common sizes
- **Border section**: borderWidth, borderColor, borderRadius for text elements
- **List button**: bullet/numbered list support

**2.4** Add `CraftShape` component (NEW)
- SVG-based shape element
- Shape types: line, rectangle, circle, triangle, star, heart
- Props: shapeType, fill, stroke, strokeWidth, borderRadius
- Settings: color picker for fill/stroke, stroke width slider

**2.5** Add page animation system
- `pageAnimation` prop on root AppContainer
- Animation presets: None, Fade In All, Slide Up All, Scale In All, Flip In All, Slide Up Mix, Fade In Mix
- Apply CSS animations to elements based on scroll visibility

**2.6** Add curtain/intro effect
- `curtainEffect` prop on root
- Opening animation before template shows
- Match CineLove's "Hiệu ứng mở màn"

**Commit:** `feat(phase1): step 2 — CraftJS enhancements (rotation, text, shapes, animations)`

---

### Step 3: Stock & Components Library
> Replace Unsplash with wedding clipart, add pre-built sections

**3.1** Scrape CineLove stock clipart
- Playwright script to download all clipart per category
- Categories: Yếu tố đám cưới, Nhân vật, Hoa cưới, Chữ hỷ, Trái tim
- Upload to Supabase Storage `/clipart/`
- Create `clipart-library.ts` with URLs + metadata

**3.2** Replace StockPanel with clipart
- Remove Unsplash API dependency
- Filter chips UI matching CineLove
- Grid display of clipart thumbnails
- Click to add as CraftSticker to canvas

**3.3** Create section presets for ComponentPanel
- Design 20+ pre-built section templates
- Categories: Ảnh, Thông tin, Lịch trình, Lời mời, Khác
- Each section = CraftJS node tree (serialized JSON)
- Preview thumbnails for each section

**3.4** Self-host wedding fonts
- Add fonts: BucThu, Aquarelle, Mallong, RetroSignature, Carlytte, Soul Note Display
- Load via @font-face in layout.tsx
- Add to font selector dropdown

**Commit:** `feat(phase1): step 3 — Stock clipart library, component sections, custom fonts`

---

### Step 4: Selection UX & Polish
> Match CineLove's element selection interaction

**4.1** Update selection overlay
- Blue dashed selection border (match CineLove exactly)
- 8 resize handle dots (white circles, blue border)
- Rotate handle above element (line + circle)
- Move icon + Rotate icon buttons below selected element

**4.2** Add element toolbar
- Floating toolbar above selected element
- Buttons: Duplicate, Delete, Lock, Layer (forward/backward)

**4.3** Add keyboard shortcuts
- Already partially implemented, ensure all work:
  - Delete/Backspace: remove
  - Ctrl+Z/Y: undo/redo
  - Ctrl+C/V/D: copy/paste/duplicate
  - Arrow keys: nudge 1px (Shift: 10px)

**4.4** Bottom section bar
- "Thay ảnh nhanh" quick image replace
- Section thumbnails for navigation

**Commit:** `feat(phase1): step 4 — Selection UX, element toolbar, keyboard shortcuts`

---

### Step 5: Integration & Verification
> Final polish and testing

**5.1** Visual comparison testing
- Playwright screenshots: LoveStory vs CineLove
- Compare: sidebar tabs, right panel, template 53, effects
- Document remaining visual differences

**5.2** Template 53 pixel-perfect matching
- Match fonts, colors, spacing
- Match decorative elements positioning
- Compare scrolled views

**5.3** Smoke test all 75 templates
- Verify all load correctly
- Verify editing works
- Verify save/load cycle

**5.4** Performance verification
- Editor load time <3s
- 50+ elements: no lag
- Save/serialize <200ms

**5.5** Remove unused code
- Clean up old StockPanel (Unsplash)
- Remove any dead CraftJS code

**Commit:** `feat(phase1): step 5 — Integration, verification, and cleanup`

---

## Dependency Graph

```
Step 0 (Reverse-engineer) ✅ DONE
  ├── Step 1 (Editor UI) — No code deps, just UI
  ├── Step 2 (CraftJS Enhancements) — Independent
  └── Step 3 (Stock & Components) — Needs scraping
        └── Step 4 (Selection UX) — After Step 2
              └── Step 5 (Integration) — After ALL
```

**Parallel opportunities:**
- Step 1 + Step 2 + Step 3 can ALL run in parallel
- Step 4 depends on Step 2 (rotation/selection)
- Step 5 is always last

---

## Files Summary

### New Files (~2,500 lines)
```
apps/web/src/app/editor/[id]/
├── components/
│   ├── ui/
│   │   └── Accordion.tsx                    # NEW (~80 lines)
│   ├── sidebar/
│   │   ├── ShapePanel.tsx                   # NEW (~100 lines)
│   │   ├── ComponentPanel.tsx               # NEW (~120 lines)
│   │   └── EffectsPanel.tsx                 # NEW (expand ~150 lines)
│   └── craft/
│       └── CraftShape.tsx                   # NEW (~200 lines)
├── docs/plans/
│   └── cinelove-architecture-analysis.md    # NEW (this doc)
└── server/data/
    ├── clipart-library.ts                   # NEW (~200 lines)
    └── section-library.ts                   # NEW (~300 lines)
```

### Modified Files (~1,500 lines changed)
```
CraftVisualEditor.tsx     # Sidebar 85px, 10 tabs, header
CraftText.tsx             # Rotation, Aa, borders, double-click edit
CraftImage.tsx            # Rotation
CraftContainer.tsx        # Rotation
StockPanel.tsx            # Replace Unsplash → clipart
SettingsPanel.tsx         # Accordion sections, project settings
template-presets.ts       # Add new fonts, rotation defaults
layout.tsx                # Font loading
```

### Estimated Totals
- **New code:** ~2,500 lines
- **Modified code:** ~1,500 lines
- **Deleted code:** ~200 lines (old Unsplash code)
- **Net change:** ~+3,800 lines

---

## Verification Checklist

### Editor UI
- [ ] Left sidebar: 85px wide, 10 tabs with icon+text
- [ ] Tab: Hình dạng (shapes)
- [ ] Tab: Thành phần (pre-built sections, 5 categories)
- [ ] Tab: Stock (clipart instead of photos, category filter chips)
- [ ] Tab: Hiệu ứng (3 sub-categories: động, mở màn, rơi)
- [ ] Right panel: 350px, project settings, premium features
- [ ] Right panel: accordion settings for text/image elements
- [ ] Header: save indicator "Đã lưu tạm thời"

### Element Features
- [ ] Rotation works on text, image, container
- [ ] Rotate handle in selection overlay
- [ ] Double-click text to enter inline editing
- [ ] Single-click to select only
- [ ] Text controls: B/I/S/U + Aa + font size dropdown + borders
- [ ] CraftShape component renders basic shapes
- [ ] Page animation presets apply on scroll

### Selection UX
- [ ] Blue dashed selection border
- [ ] 8 resize handles
- [ ] Rotate handle above element
- [ ] Move/Rotate icon buttons below element
- [ ] Floating toolbar (Duplicate, Delete, Lock)

### Assets
- [ ] Clipart library loaded (wedding categories)
- [ ] Pre-built sections available in Thành phần tab
- [ ] Custom fonts loaded (BucThu, Aquarelle, Mallong, etc.)

### Parity
- [ ] Playwright screenshot comparison: sidebar matches CineLove
- [ ] Playwright screenshot comparison: right panel matches CineLove
- [ ] Playwright screenshot comparison: template 53 matches CineLove
- [ ] All 75 templates load and edit correctly
