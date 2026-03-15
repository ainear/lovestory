# Phase 2: Bug Fixes + Phase 1 Completion

**Date:** 2026-03-15
**Branch:** `develop`
**Base:** Phase 1 commits on `develop`

---

## Context

Phase 1 audit revealed 3 bugs, 8 missing features, and several inconsistencies.
Phase 2 addresses all of these to bring the editor to production-ready state.

---

## Part A: Bug Fixes (3 items)

### A1. Arrow key nudge broken
- **Problem:** Handler sets `props.x/y/left/top` but components don't have these props
- **Fix:** Use CraftJS `setProp` with the correct positioning props used by each component (top/left for absolute positioning)

### A2. Save closure stale values
- **Problem:** `particleEffect` and `curtainEffect` missing from `save()` useCallback dependency array
- **Fix:** Add both to dependency array

### A3. Load doesn't restore pageAnimation/curtainEffect
- **Problem:** Only `particleEffect` is loaded from saved canvas_json, `pageAnimation` and `curtainEffect` are ignored
- **Fix:** Add restore logic in the load useEffect

---

## Part B: Missing Features (5 items)

### B1. Wire "Thanh phan" tab
- Add `components` key to TABS array (between Mau and Hieu ung)
- Create `activeTab === "components"` panel using SECTION_CATEGORIES + SECTION_PRESETS from section-library.ts
- Each section preset inserts its elements as CraftJS nodes

### B2. Fix CraftShape vs CraftSticker inconsistency
- Shapes tab should insert `CraftShape` instead of `CraftSticker`
- CraftShape has proper settings (fill, stroke, strokeWidth, shapeType)
- Keep CraftSticker for clipart only

### B3. Add 8-point resize handles to all components
- Extract shared resize handle rendering into a reusable pattern
- Add to CraftText, CraftContainer, CraftShape (CraftImage already has them)

### B4. Wire right panel dropdowns to project data
- Connect Danh muc and Trang thai selects to actual project metadata
- Save changes via existing save mechanism

### B5. Page animation + curtain effect runtime
- Add IntersectionObserver-based animation trigger on the viewer/invitation page
- Apply CSS animations based on `pageAnimation` setting
- Apply curtain/intro overlay based on `curtainEffect` setting

---

## Part C: Polish (2 items)

### C1. Self-host custom fonts
- Download and host: BucThu, Aquarelle, Mallong, RetroSignature, Carlytte, Soul Note Display
- Add @font-face declarations in layout.tsx
- Add to font selector dropdown in CraftText settings

### C2. Preview thumbnail generation
- Use html2canvas or similar to generate template preview
- Show in right panel "Ban xem truoc" section
- Save to Supabase Storage

---

## Estimated Changes

- Bug fixes: ~50 lines changed
- Missing features: ~400 lines new/changed
- Polish: ~200 lines new/changed
- **Total: ~650 lines**
