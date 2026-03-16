# Sprint 64: Content Expansion — Design Doc

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close content gap with CineLove — expand fonts (12→35+), music (24→55+), stock images (36→120+)

**Architecture:** Data-only changes in editor-constants files. No structural changes to canvas engine or editor components. Font loading via Google Fonts CSS. Music/images are static arrays with Pixabay/Unsplash URLs.

**Tech Stack:** Next.js, Google Fonts, Pixabay Audio (royalty-free), Unsplash (free)

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Approach | Sequential (A) | Content first, premium next sprint |
| Payment | Manual QR | Clone CineLove, simple to implement |
| Pricing | One-time per project | CineLove model: Free/Basic/Pro/Premium |
| AI removal | Skip this sprint | Focus on content first |
| Premium gating | Clone CineLove tiers | Free→Basic→Pro→Premium |

---

## Phase 1: Wedding Fonts (12 → 35+)

### Current State
12 fonts in `apps/web/src/app/editor/[id]/components/editor-constants/text-presets.ts`:
Playfair Display, Cormorant Garamond, Dancing Script, Sacramento, Alex Brush, Satisfy, Allura, Pinyon Script, Cinzel Decorative, Inter, Lora

### New Fonts (23 additions)

**Script/Calligraphy (8):**
Great Vibes, Parisienne, Tangerine, Petit Formal Script, Italianno, Lovers Quarrel, Rouge Script, Carattere

**Serif Elegant (5):**
Cormorant Infant, Libre Baskerville, EB Garamond, Crimson Text, Spectral

**Sans Modern (5):**
Montserrat, Quicksand, Raleway, Josefin Sans, Poppins

**Display (5):**
Cinzel, Playfair Display SC, Antic Didone, Bodoni Moda, Tenor Sans

### Font Loading
- Google Fonts via CSS `@import` in layout or `next/font/google`
- Font picker UI: add category filter tabs (Script, Serif, Sans, Display)
- Preview: show font name in its own typeface

### Files to Modify
- `apps/web/src/app/editor/[id]/components/editor-constants/text-presets.ts` — add font entries
- `apps/web/src/app/layout.tsx` or font config — load new Google Fonts
- `apps/web/src/app/editor/[id]/components/sidebar/TextTab.tsx` — font picker with categories

---

## Phase 2: Music Library (24 → 55+)

### Current State
24 songs in `music-presets.ts`: 12 V-POP, 12 International

### New Categories & Songs (30+ additions)

**Acoustic/Guitar (8):** Romantic guitar, fingerstyle wedding instrumentals
**Piano/Instrumental (8):** Soft piano, romantic instrumental
**K-Pop/Korean (7):** Korean wedding ballads, drama OST style
**Classical (7):** Canon in D, Wedding March, Clair de Lune, etc.

### Source
Pixabay Audio (already used, royalty-free). Each entry: `{ id, title, artist, url, duration, category }`.

### Files to Modify
- `apps/web/src/app/editor/[id]/components/editor-constants/music-presets.ts` — add songs
- `apps/web/src/app/editor/[id]/components/sidebar/MusicTab.tsx` — add category filter for new categories

---

## Phase 3: Stock Images (36 → 120+)

### Current State
36 photos in `stock-images.ts`: 6 categories × 6 photos (Unsplash)

### New Content (84+ additions)

**New Categories:**
- Backdrop/Scenery (12): scenic wedding venues, gardens, beaches
- Food & Drink (10): wedding cake, champagne, table settings
- Invitation Details (10): close-up rings, bouquets, stationery
- Outdoor/Nature (10): garden, beach, forest weddings
- Vietnamese Traditional (12): ao dai, tea ceremony, betel leaf

**Expand Existing:** +30 photos across couple, ceremony, reception, decoration, rings, flowers

### Source
Unsplash (free, proper attribution). Curated high-quality wedding photos.

### Files to Modify
- `apps/web/src/app/editor/[id]/components/editor-constants/stock-images.ts` — add images + categories
- `apps/web/src/app/editor/[id]/components/sidebar/ImageTab.tsx` — update category pills if new categories added

---

## Sprint 65 Preview: Premium System

Will implement in next sprint:
- **Pricing tiers**: Free (watermark, 5 templates), Basic 199k (no watermark, 20 templates), Pro 399k (premium music, 50+ templates), Premium 599k (all features + priority)
- **Payment**: Manual QR bank transfer + admin confirmation
- **Watermark enforcement**: Server-side watermark on viewer for free tier
- **Feature gating**: Template/music/image limits per tier
- **Admin dashboard**: Order management, manual payment confirmation

---

**Created:** 2026-03-16
**Status:** Approved
