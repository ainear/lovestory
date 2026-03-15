# Sprint 64 — Launch-Critical Fixes Design

**Goal:** Fix data loss bugs, race conditions, and tech debt before production launch.

**Architecture:** Refactoring + bug fixes on existing canvas engine. No new features.

**Tech Stack:** React 19, TypeScript, Supabase, Next.js 16

---

## Task 1: Persist Project Settings (P0)

**Problem:** `projectCategory`, `projectStatus`, `removeWatermark`, `autoScroll`, `scrollSpeed`, `qrBank` are local `useState` in `CanvasRightPanel.tsx` — changes are silently discarded on reload.

**Solution:**
- Move premium state (`removeWatermark`, `autoScroll`, `scrollSpeed`, `qrBank`) up to `CraftVisualEditor.tsx`
- Pass as props to `CanvasRightPanel` → `PremiumFeaturesSection`
- Load from `parsed.meta` in the initial JSON parse
- Serialize into `canvas_json.meta` in `save()`
- `projectCategory` and `projectStatus` already exist in CraftVisualEditor — just pass them down

**Files:**
- Modify: `CraftVisualEditor.tsx` (add state, pass props, serialize in save)
- Modify: `CanvasRightPanel.tsx` (accept props instead of local state)

---

## Task 2: Fix Save Race Condition (P0)

**Problem:** `save()` captures `editorState` by closure. Autosave timer holds a stale snapshot. Manual save + pending autosave = two concurrent Supabase updates racing.

**Solution:**
- Add `editorStateRef = useRef(editorState)` synced via effect
- `save()` reads from `editorStateRef.current` instead of closure
- Remove `editorState` from `save` dependency array
- Same pattern for other state used in save (background, music, effects)

**Files:**
- Modify: `CraftVisualEditor.tsx` (refactor save callback)

---

## Task 3: Cleanup CraftJS Dead Code (P1)

**Problem:** ~60 lines of CraftJS stubs with `any` types suppress real TypeScript errors. Dead code paths like `insertLegacyPreset()` and `query.node("ROOT")` run silently.

**Solution:**
- Delete lines 74-132 in CraftVisualEditor.tsx (all stubs)
- Remove `insertLegacyPreset()` from ComponentsTab.tsx
- Remove all `Craft*` props from SidebarPanel interface
- Remove dead `query.node("ROOT")` call in BgTab.tsx
- Remove `FloatingToolbar` render (depends on always-undefined `selected`)

**Files:**
- Modify: `CraftVisualEditor.tsx`, `ComponentsTab.tsx`, `SidebarPanel.tsx`, `BgTab.tsx`

---

## Task 4: Split Large Files (P1)

**Problem:** `CanvasRightPanel.tsx` is 1105 lines (limit: 800).

**Solution:**
- Extract `PremiumFeaturesSection` → `PremiumFeaturesPanel.tsx`
- Extract `ProjectSettingsSection` → `ProjectSettingsPanel.tsx`
- Keep element property editors in `CanvasRightPanel.tsx`

**Files:**
- Create: `PremiumFeaturesPanel.tsx`, `ProjectSettingsPanel.tsx`
- Modify: `CanvasRightPanel.tsx` (import and render extracted components)

---

## Verification After Each Task

1. `npx --package=typescript tsc --noEmit` — 0 errors
2. `next build` — passes
3. Commit with conventional message
