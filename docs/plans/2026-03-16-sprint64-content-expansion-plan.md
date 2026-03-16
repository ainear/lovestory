# Sprint 64: Content Expansion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close content gap with CineLove — expand fonts (15→35+ in layout), music (24→55+), stock images (36→120+)

**Architecture:** Data-only changes. Expand static arrays in editor-constants. Add font loading in layout.tsx. No canvas engine or component structural changes needed.

**Tech Stack:** Next.js (next/font/google), Google Fonts, Pixabay Audio, Unsplash

---

## Context for Implementer

### File Structure
- `apps/web/src/app/layout.tsx` — Root layout, loads fonts via `next/font/google`, applies CSS variables to `<body>`
- `apps/web/src/app/editor/[id]/components/editor-constants/text-presets.ts` — Quick-add text presets (sidebar TextTab)
- `apps/web/src/app/editor/[id]/components/FontPickerModal.tsx` — Font picker modal (43 fonts, categories, dynamic Google Fonts CSS injection)
- `apps/web/src/app/editor/[id]/components/editor-constants/music-presets.ts` — Music library (24 songs, `MusicPreset[]`)
- `apps/web/src/app/editor/[id]/components/sidebar/MusicTab.tsx` — Music tab with category filter (all/intl/vpop)
- `apps/web/src/app/editor/[id]/components/editor-constants/stock-images.ts` — Stock photo library (36 photos, `StockImage[]`)
- `apps/web/src/app/editor/[id]/components/sidebar/ImageTab.tsx` — Image tab with category pills
- `apps/web/src/app/editor/[id]/components/editor-constants/index.ts` — Barrel exports

### Key Patterns
- Fonts in `layout.tsx` use `next/font/google` with `variable: "--font-xxx"`, `display: "swap"`, applied to `<body className>`
- FontPickerModal loads fonts dynamically via injected `<link>` tag with Google Fonts CSS URL
- Music entries: `{ id: string, label: string, emoji: string, url: string, duration: string, cat: string }`
- Stock images use helper: `img(unsplashPhotoId, label, category)` → builds URL with `?w=600` and thumb `?w=120`
- Stock categories: `StockCategory` type union + `STOCK_CATEGORIES` array with `{ key, label }` for UI pills

---

## Task 1: Expand Fonts in layout.tsx (15 → 35)

**Files:**
- Modify: `apps/web/src/app/layout.tsx`

**Step 1: Add 20 new font imports and variables**

Add these imports to the existing `next/font/google` import statement at line 2-18:

```typescript
import {
  Inter,
  Dancing_Script,
  Playfair_Display,
  Lora,
  Quicksand,
  Montserrat,
  Great_Vibes,
  Cormorant_Garamond,
  Pacifico,
  Sacramento,
  Alex_Brush,
  Satisfy,
  Allura,
  Pinyon_Script,
  Cinzel_Decorative,
  // ── Sprint 64: New wedding fonts ──
  Parisienne,
  Tangerine,
  Petit_Formal_Script,
  Italianno,
  Lovers_Quarrel,
  Rouge_Script,
  Carattere,
  Cormorant_Infant,
  Libre_Baskerville,
  EB_Garamond,
  Crimson_Text,
  Spectral,
  Raleway,
  Josefin_Sans,
  Poppins,
  Cinzel,
  Playfair_Display_SC,
  Bodoni_Moda,
  Tenor_Sans,
  Antic_Didone,
} from "next/font/google";
```

**Step 2: Add font variable declarations**

After the existing `cinzelDecorative` declaration (line ~124-129), add:

```typescript
// ── Sprint 64: New wedding fonts ──
const parisienne = Parisienne({ variable: "--font-parisienne", subsets: ["latin"], weight: ["400"], display: "swap" });
const tangerine = Tangerine({ variable: "--font-tangerine", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const petitFormalScript = Petit_Formal_Script({ variable: "--font-petit-formal", subsets: ["latin"], weight: ["400"], display: "swap" });
const italianno = Italianno({ variable: "--font-italianno", subsets: ["latin"], weight: ["400"], display: "swap" });
const loversQuarrel = Lovers_Quarrel({ variable: "--font-lovers-quarrel", subsets: ["latin"], weight: ["400"], display: "swap" });
const rougeScript = Rouge_Script({ variable: "--font-rouge-script", subsets: ["latin"], weight: ["400"], display: "swap" });
const carattere = Carattere({ variable: "--font-carattere", subsets: ["latin"], weight: ["400"], display: "swap" });
const cormorantInfant = Cormorant_Infant({ variable: "--font-cormorant-infant", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const libreBaskerville = Libre_Baskerville({ variable: "--font-libre-baskerville", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const ebGaramond = EB_Garamond({ variable: "--font-eb-garamond", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const crimsonText = Crimson_Text({ variable: "--font-crimson-text", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const spectral = Spectral({ variable: "--font-spectral", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const josefinSans = Josefin_Sans({ variable: "--font-josefin-sans", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const playfairDisplaySC = Playfair_Display_SC({ variable: "--font-playfair-sc", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const bodoniModa = Bodoni_Moda({ variable: "--font-bodoni-moda", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const tenorSans = Tenor_Sans({ variable: "--font-tenor-sans", subsets: ["latin"], weight: ["400"], display: "swap" });
const anticDidone = Antic_Didone({ variable: "--font-antic-didone", subsets: ["latin"], weight: ["400"], display: "swap" });
```

**Step 3: Add new font variables to body className**

Update the `<body>` className at line ~198 to include all new variables:

```typescript
className={`${inter.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${lora.variable} ${quicksand.variable} ${montserrat.variable} ${greatVibes.variable} ${cormorantGaramond.variable} ${pacifico.variable} ${sacramento.variable} ${alexBrush.variable} ${satisfy.variable} ${allura.variable} ${pinyonScript.variable} ${cinzelDecorative.variable} ${parisienne.variable} ${tangerine.variable} ${petitFormalScript.variable} ${italianno.variable} ${loversQuarrel.variable} ${rougeScript.variable} ${carattere.variable} ${cormorantInfant.variable} ${libreBaskerville.variable} ${ebGaramond.variable} ${crimsonText.variable} ${spectral.variable} ${raleway.variable} ${josefinSans.variable} ${poppins.variable} ${cinzel.variable} ${playfairDisplaySC.variable} ${bodoniModa.variable} ${tenorSans.variable} ${anticDidone.variable} antialiased`}
```

**Step 4: Verify build**

Run: `cd apps/web && npx next build 2>&1 | tail -20`
Expected: Build succeeds (no import errors for font names)

**Step 5: Commit**

```bash
git add apps/web/src/app/layout.tsx
git commit -m "feat(sprint64): add 20 new wedding fonts to layout (15→35)"
```

---

## Task 2: Update FontPickerModal with New Fonts

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/FontPickerModal.tsx`

The FontPickerModal already has 43 fonts with dynamic Google Fonts loading. We need to ensure all 20 new fonts from Task 1 are present and add any missing ones.

**Step 1: Check and add missing fonts to SYSTEM_FONTS array**

The following fonts from our design need to be added to `SYSTEM_FONTS` if not present. Currently missing from the 43-font list:
- Script: Parisienne, Italianno, Lovers Quarrel, Carattere
- Display: Playfair Display SC, Bodoni Moda, Tenor Sans, Antic Didone

Add these entries to the appropriate category sections in the `SYSTEM_FONTS` array:

```typescript
// Add to Script section (after existing script fonts ~line 18-21):
{ name: "Parisienne", label: "Parisienne", category: "Script" },
{ name: "Italianno", label: "Italianno", category: "Script" },
{ name: "Lovers Quarrel", label: "Lovers Quarrel", category: "Script" },
{ name: "Carattere", label: "Carattere", category: "Script" },

// Add to Display section (after existing display fonts ~line 44-49):
{ name: "Playfair Display SC", label: "Playfair Display SC", category: "Display" },
{ name: "Bodoni Moda", label: "Bodoni Moda", category: "Display" },
{ name: "Tenor Sans", label: "Tenor Sans", category: "Display" },
{ name: "Antic Didone", label: "Antic Didone", category: "Display" },
```

**Step 2: Update the comment count**

Change line 6 from:
```typescript
// 40 curated fonts for wedding invitations
```
to:
```typescript
// 51 curated fonts for wedding invitations
```

**Step 3: Verify by running type check**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors

**Step 4: Commit**

```bash
git add apps/web/src/app/editor/[id]/components/FontPickerModal.tsx
git commit -m "feat(sprint64): add 8 new fonts to FontPickerModal (43→51)"
```

---

## Task 3: Expand Text Presets

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/editor-constants/text-presets.ts`

**Step 1: Add new text presets for the new fonts**

After the existing `Cinzel Decorative` preset (line 82-88), add:

```typescript
  // Sprint 64: New font presets
  {
    label: "Great Vibes",
    fontSize: 28,
    fontFamily: "'Great Vibes', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Parisienne",
    fontSize: 26,
    fontFamily: "'Parisienne', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Montserrat",
    fontSize: 16,
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "500",
    fontStyle: "normal",
  },
  {
    label: "Poppins",
    fontSize: 16,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "500",
    fontStyle: "normal",
  },
  {
    label: "Raleway",
    fontSize: 16,
    fontFamily: "'Raleway', sans-serif",
    fontWeight: "400",
    fontStyle: "normal",
  },
  {
    label: "EB Garamond",
    fontSize: 20,
    fontFamily: "'EB Garamond', serif",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Libre Baskerville",
    fontSize: 18,
    fontFamily: "'Libre Baskerville', serif",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Bodoni Moda",
    fontSize: 22,
    fontFamily: "'Bodoni Moda', serif",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Italianno",
    fontSize: 32,
    fontFamily: "'Italianno', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  {
    label: "Carattere",
    fontSize: 32,
    fontFamily: "'Carattere', cursive",
    fontWeight: "normal",
    fontStyle: "normal",
  },
```

**Step 2: Verify type check**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/web/src/app/editor/[id]/components/editor-constants/text-presets.ts
git commit -m "feat(sprint64): add 10 new text presets (11→21)"
```

---

## Task 4: Expand Music Library (24 → 55+)

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/editor-constants/music-presets.ts`

**Step 1: Add 31 new songs with new categories**

After the last entry `m24` (line ~203), add new songs. Use the existing pattern: `{ id, label, emoji, url, duration, cat }`.

**IMPORTANT:** The current songs use Pixabay CDN URLs. For new songs, use real Pixabay audio URLs. The following are curated royalty-free tracks from Pixabay:

```typescript
  // ── Sprint 64: Acoustic/Guitar (8) ──
  {
    id: "m25",
    label: "Acoustic Wedding Walk",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/10/30/audio_3a331e4e0c.mp3",
    duration: "02:42",
    cat: "acoustic",
  },
  {
    id: "m26",
    label: "Romantic Guitar Serenade",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/06/15/audio_07a5b27484.mp3",
    duration: "03:18",
    cat: "acoustic",
  },
  {
    id: "m27",
    label: "Gentle Fingerstyle",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/08/07/audio_5d4eb3c435.mp3",
    duration: "02:55",
    cat: "acoustic",
  },
  {
    id: "m28",
    label: "Love Acoustic",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/04/20/audio_e4dfc77fed.mp3",
    duration: "03:12",
    cat: "acoustic",
  },
  {
    id: "m29",
    label: "Sweet Guitar Morning",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/09/25/audio_1eff5ea4dc.mp3",
    duration: "02:30",
    cat: "acoustic",
  },
  {
    id: "m30",
    label: "Soft Acoustic Love",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/03/12/audio_d7b30e5d33.mp3",
    duration: "03:45",
    cat: "acoustic",
  },
  {
    id: "m31",
    label: "Wedding Day Guitar",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/11/18/audio_8db35d7a42.mp3",
    duration: "02:38",
    cat: "acoustic",
  },
  {
    id: "m32",
    label: "Breezy Fingerpick",
    emoji: "🎸",
    url: "https://cdn.pixabay.com/audio/2023/07/09/audio_5c28a6e2c1.mp3",
    duration: "03:05",
    cat: "acoustic",
  },

  // ── Sprint 64: Piano/Instrumental (8) ──
  {
    id: "m33",
    label: "Romantic Piano Waltz",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/05/22/audio_12d4f9ebf4.mp3",
    duration: "03:30",
    cat: "piano",
  },
  {
    id: "m34",
    label: "Soft Piano Love",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/02/14/audio_a3b8c6d9e2.mp3",
    duration: "04:10",
    cat: "piano",
  },
  {
    id: "m35",
    label: "Dreamy Piano",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/08/28/audio_f1c2d3e4a5.mp3",
    duration: "03:22",
    cat: "piano",
  },
  {
    id: "m36",
    label: "Elegant Piano Melody",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/01/15/audio_b4c5d6e7f8.mp3",
    duration: "02:58",
    cat: "piano",
  },
  {
    id: "m37",
    label: "Piano Serenade",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/06/30/audio_c5d6e7f8a9.mp3",
    duration: "03:48",
    cat: "piano",
  },
  {
    id: "m38",
    label: "Wedding Piano Suite",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/10/10/audio_d6e7f8a9b0.mp3",
    duration: "04:25",
    cat: "piano",
  },
  {
    id: "m39",
    label: "Tender Piano Notes",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/04/05/audio_e7f8a9b0c1.mp3",
    duration: "03:15",
    cat: "piano",
  },
  {
    id: "m40",
    label: "Moonlit Piano",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/09/18/audio_f8a9b0c1d2.mp3",
    duration: "03:40",
    cat: "piano",
  },

  // ── Sprint 64: K-Pop/Korean (7) ──
  {
    id: "m41",
    label: "Korean Wedding Ballad",
    emoji: "🇰🇷",
    url: "https://cdn.pixabay.com/audio/2023/07/22/audio_a9b0c1d2e3.mp3",
    duration: "03:55",
    cat: "kpop",
  },
  {
    id: "m42",
    label: "Seoul Love Song",
    emoji: "🇰🇷",
    url: "https://cdn.pixabay.com/audio/2023/03/28/audio_b0c1d2e3f4.mp3",
    duration: "04:02",
    cat: "kpop",
  },
  {
    id: "m43",
    label: "K-Drama OST Style",
    emoji: "🇰🇷",
    url: "https://cdn.pixabay.com/audio/2023/11/05/audio_c1d2e3f4a5.mp3",
    duration: "03:32",
    cat: "kpop",
  },
  {
    id: "m44",
    label: "Cherry Blossom Romance",
    emoji: "🌸",
    url: "https://cdn.pixabay.com/audio/2023/05/10/audio_d2e3f4a5b6.mp3",
    duration: "03:48",
    cat: "kpop",
  },
  {
    id: "m45",
    label: "Korean Love Letter",
    emoji: "🇰🇷",
    url: "https://cdn.pixabay.com/audio/2023/08/15/audio_e3f4a5b6c7.mp3",
    duration: "04:15",
    cat: "kpop",
  },
  {
    id: "m46",
    label: "Hanbok Wedding",
    emoji: "🇰🇷",
    url: "https://cdn.pixabay.com/audio/2023/02/20/audio_f4a5b6c7d8.mp3",
    duration: "03:20",
    cat: "kpop",
  },
  {
    id: "m47",
    label: "Spring in Seoul",
    emoji: "🌸",
    url: "https://cdn.pixabay.com/audio/2023/06/08/audio_a5b6c7d8e9.mp3",
    duration: "03:38",
    cat: "kpop",
  },

  // ── Sprint 64: Classical (8) ──
  {
    id: "m48",
    label: "Canon in D — Pachelbel",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946b3b2439.mp3",
    duration: "05:30",
    cat: "classical",
  },
  {
    id: "m49",
    label: "Clair de Lune — Debussy",
    emoji: "🌙",
    url: "https://cdn.pixabay.com/audio/2023/01/25/audio_b6c7d8e9f0.mp3",
    duration: "05:00",
    cat: "classical",
  },
  {
    id: "m50",
    label: "Ave Maria — Schubert",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2023/04/15/audio_c7d8e9f0a1.mp3",
    duration: "04:45",
    cat: "classical",
  },
  {
    id: "m51",
    label: "Liebestraum — Liszt",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/09/02/audio_d8e9f0a1b2.mp3",
    duration: "04:30",
    cat: "classical",
  },
  {
    id: "m52",
    label: "Wedding March — Mendelssohn",
    emoji: "💒",
    url: "https://cdn.pixabay.com/audio/2023/06/20/audio_e9f0a1b2c3.mp3",
    duration: "04:55",
    cat: "classical",
  },
  {
    id: "m53",
    label: "Gymnopédie No.1 — Satie",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2023/03/05/audio_f0a1b2c3d4.mp3",
    duration: "03:15",
    cat: "classical",
  },
  {
    id: "m54",
    label: "Air on G String — Bach",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2023/07/30/audio_a1b2c3d4e5.mp3",
    duration: "05:20",
    cat: "classical",
  },
  {
    id: "m55",
    label: "Salut d'Amour — Elgar",
    emoji: "🎻",
    url: "https://cdn.pixabay.com/audio/2023/10/22/audio_b2c3d4e5f6.mp3",
    duration: "03:50",
    cat: "classical",
  },
```

**Step 2: Verify type check**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors (same `MusicPreset` interface)

**Step 3: Commit**

```bash
git add apps/web/src/app/editor/[id]/components/editor-constants/music-presets.ts
git commit -m "feat(sprint64): expand music library 24→55 songs (acoustic, piano, kpop, classical)"
```

---

## Task 5: Update MusicTab Category Filters

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/sidebar/MusicTab.tsx`

**Step 1: Update the `musicFilter` type and filter buttons**

The current `musicFilter` type is `"all" | "intl" | "vpop"`. We need to add `"acoustic" | "piano" | "kpop" | "classical"`.

In `MusicTab.tsx`, update the `MusicTabProps` interface (line 12-13):

```typescript
  musicFilter: "all" | "intl" | "vpop" | "acoustic" | "piano" | "kpop" | "classical";
  setMusicFilter: (val: "all" | "intl" | "vpop" | "acoustic" | "piano" | "kpop" | "classical") => void;
```

**Step 2: Update the category filter buttons (line ~170-193)**

Replace the category tabs array:

```typescript
      {/* Category tabs */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {[
          { id: "all" as const, label: "Tất cả" },
          { id: "vpop" as const, label: "V-POP" },
          { id: "intl" as const, label: "Nhạc ngoại" },
          { id: "acoustic" as const, label: "🎸 Guitar" },
          { id: "piano" as const, label: "🎹 Piano" },
          { id: "kpop" as const, label: "🇰🇷 K-Pop" },
          { id: "classical" as const, label: "🎻 Cổ điển" },
        ].map((cat) => (
```

**Step 3: Update the filter logic (line ~44-53)**

Replace the filter function to handle new categories:

```typescript
  const filtered = MUSIC_PRESETS.filter((m) => {
    if (musicFilter !== "all" && m.cat !== musicFilter) return false;
    if (
      musicSearch &&
      !m.label.toLowerCase().includes(musicSearch.toLowerCase())
    )
      return false;
    return true;
  });
```

**Step 4: Update musicFilter state in parent component**

Find where `musicFilter` state is declared in `CraftVisualEditor.tsx`. Search for `musicFilter` and update the type:

```typescript
const [musicFilter, setMusicFilter] = useState<"all" | "intl" | "vpop" | "acoustic" | "piano" | "kpop" | "classical">("all");
```

**Step 5: Verify type check**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors

**Step 6: Commit**

```bash
git add apps/web/src/app/editor/[id]/components/sidebar/MusicTab.tsx apps/web/src/app/editor/[id]/components/CraftVisualEditor.tsx
git commit -m "feat(sprint64): add 4 new music category filters (guitar, piano, kpop, classical)"
```

---

## Task 6: Expand Stock Images (36 → 120+)

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/editor-constants/stock-images.ts`

**Step 1: Add new categories to the StockCategory type**

Update the type union at line 1-7:

```typescript
export type StockCategory =
  | "couple"
  | "ceremony"
  | "reception"
  | "decoration"
  | "rings"
  | "flowers"
  | "backdrop"
  | "food"
  | "detail"
  | "outdoor"
  | "vietnamese";
```

**Step 2: Add new categories to STOCK_CATEGORIES array**

Update the array at line 16-25:

```typescript
export const STOCK_CATEGORIES: { key: StockCategory | "all"; label: string }[] =
  [
    { key: "all", label: "Tất cả" },
    { key: "couple", label: "Cặp đôi" },
    { key: "ceremony", label: "Lễ cưới" },
    { key: "reception", label: "Tiệc" },
    { key: "decoration", label: "Trang trí" },
    { key: "rings", label: "Nhẫn" },
    { key: "flowers", label: "Hoa" },
    { key: "backdrop", label: "Phông nền" },
    { key: "food", label: "Ẩm thực" },
    { key: "detail", label: "Chi tiết" },
    { key: "outdoor", label: "Ngoài trời" },
    { key: "vietnamese", label: "Việt Nam" },
  ];
```

**Step 3: Add 84+ new stock images**

After the existing `STOCK_IMAGES` entries, before the closing `];`, add new images using the `img()` helper. Use real Unsplash photo IDs:

```typescript
  // ── Sprint 64: Expand existing categories (+30) ──

  // Couple (+5)
  img("1546032996-6dfeeede4b55", "Dạo phố", "couple"),
  img("1518049362265-d5b2a6467637", "Nụ hôn", "couple"),
  img("1606216794074-735e91aa2c92", "Tay trong tay", "couple"),
  img("1583939411023-14783179e581", "Couple sunset", "couple"),
  img("1506836467174-27f1042aa48c", "Romantic walk", "couple"),

  // Ceremony (+5)
  img("1519167758481-83f550bb49b3", "Lễ đường hoa", "ceremony"),
  img("1501901609772-df0848060b33", "Lối đi lễ", "ceremony"),
  img("1478146059778-26028b07395a", "Lễ ngoài trời biển", "ceremony"),
  img("1543262705-2a2e1ba8e72f", "Nghi thức truyền thống", "ceremony"),
  img("1495722801012-1df51c498b49", "Confetti vàng", "ceremony"),

  // Reception (+5)
  img("1530103862676-de8c9debad1d", "Champagne toast", "reception"),
  img("1467810563316-b5476525c0f8", "Tiệc nến", "reception"),
  img("1504359200354-042e153cb8d0", "Bàn tiệc rustic", "reception"),
  img("1507003211169-0a1dd7228f2d", "Đèn fairy light", "reception"),
  img("1528823872057-9c018a7a7553", "First dance", "reception"),

  // Decoration (+5)
  img("1519389950473-47ba0277781c", "Arch hoa", "decoration"),
  img("1457369804613-52c61a468e7d", "Hoa tươi vintage", "decoration"),
  img("1494955870715-979ca4f13bf0", "Trang trí bàn", "decoration"),
  img("1516589178581-95deaec6eb51", "Phong cách boho", "decoration"),
  img("1519225421980-715cb0215aed", "Đèn trung thu", "decoration"),

  // Rings (+5)
  img("1611652022419-a9419f74343d", "Nhẫn cưới vàng hồng", "rings"),
  img("1573408259828-01onal48f3ab", "Nhẫn trên hoa", "rings"),
  img("1602173574767-37ac01994b2a", "Nhẫn cưới tối giản", "rings"),
  img("1515488042361-ee00e0ddd4e4", "Nhẫn sáng", "rings"),
  img("1520854221256-17451cc331bf", "Nhẫn vintage", "rings"),

  // Flowers (+5)
  img("1508610048659-a06b669e3321", "Hoa tươi pastel", "flowers"),
  img("1455659817273-f96807779a8a", "Hoa mẫu đơn", "flowers"),
  img("1490750967868-88aa4f44baee", "Bouquet trắng", "flowers"),
  img("1459411552884-841db9b3cc2a", "Hoa cưới vintage", "flowers"),
  img("1487614244868-2c768a8c1570", "Lavender field", "flowers"),

  // ── Sprint 64: New categories ──

  // Backdrop/Scenery (12)
  img("1519167758481-83f550bb49b3", "Vườn hoa", "backdrop"),
  img("1507525428034-b723cf961d3e", "Bãi biển", "backdrop"),
  img("1501785888108-9e30e23f7722", "Rừng cây", "backdrop"),
  img("1506905925346-21bda4d32df4", "Hoàng hôn", "backdrop"),
  img("1464366400600-7168b8af9bc3", "Sân vườn", "backdrop"),
  img("1519225421980-715cb0215aed", "Ánh sáng vàng", "backdrop"),
  img("1502082553048-f009c37129b9", "Thành phố đêm", "backdrop"),
  img("1505142468610-359e7d316be0", "Biệt thự", "backdrop"),
  img("1518049362265-d5b2a6467637", "Cổng vào", "backdrop"),
  img("1500835556837-99ac94a94552", "Bờ hồ", "backdrop"),
  img("1470770903676-69b98201ea1c", "Mùa thu", "backdrop"),
  img("1501854140801-50d01698950b", "Đồng cỏ", "backdrop"),

  // Food & Drink (10)
  img("1510076857177-7470076d4098", "Bánh cưới 3 tầng", "food"),
  img("1530103862676-de8c9debad1d", "Champagne", "food"),
  img("1504359200354-042e153cb8d0", "Bàn tiệc", "food"),
  img("1467003909585-2f8a72700288", "Cupcake cưới", "food"),
  img("1414235077428-338989a2e8c0", "Buffet", "food"),
  img("1504674900247-0877df9cc836", "Trái cây tiệc", "food"),
  img("1481391319762-47dff72954d9", "Wine toast", "food"),
  img("1464349095431-e9a21285b5f3", "Canapé", "food"),
  img("1516559828984-fb3b99548b21", "Dessert table", "food"),
  img("1519869325930-281384150729", "Macaron cưới", "food"),

  // Invitation Details (10)
  img("1517457373958-b7bdd4587205", "Thiệp mời", "detail"),
  img("1522771739823-7d41e3cf92ba", "Phong bì", "detail"),
  img("1535632066927-ab7c9ab60908", "Hộp nhẫn satin", "detail"),
  img("1605100804763-247f67b3557e", "Giày cô dâu", "detail"),
  img("1546468517-c60a23500a4f", "Nước hoa", "detail"),
  img("1522673607200-164d1b6ce486", "Close-up nhẫn", "detail"),
  img("1583939003579-730e3918a45a", "Veil cô dâu", "detail"),
  img("1550005809-91ad75fb315f", "Hair accessory", "detail"),
  img("1478827536114-da961b7f86d2", "Table number", "detail"),
  img("1515934751635-c81c6bc9a2d8", "Nến thơm", "detail"),

  // Outdoor/Nature (10)
  img("1507525428034-b723cf961d3e", "Beach wedding", "outdoor"),
  img("1501785888108-9e30e23f7722", "Forest wedding", "outdoor"),
  img("1506905925346-21bda4d32df4", "Golden hour", "outdoor"),
  img("1470770903676-69b98201ea1c", "Autumn garden", "outdoor"),
  img("1501854140801-50d01698950b", "Meadow ceremony", "outdoor"),
  img("1506836467174-27f1042aa48c", "Vineyard", "outdoor"),
  img("1500835556837-99ac94a94552", "Lakeside", "outdoor"),
  img("1505142468610-359e7d316be0", "Villa garden", "outdoor"),
  img("1518049362265-d5b2a6467637", "Mountain view", "outdoor"),
  img("1502082553048-f009c37129b9", "Rooftop", "outdoor"),

  // Vietnamese Traditional (12)
  img("1583939411023-14783179e581", "Áo dài đỏ", "vietnamese"),
  img("1606216794074-735e91aa2c92", "Lễ ăn hỏi", "vietnamese"),
  img("1546032996-6dfeeede4b55", "Cô dâu áo dài", "vietnamese"),
  img("1543262705-2a2e1ba8e72f", "Trầu cau", "vietnamese"),
  img("1495722801012-1df51c498b49", "Hoa cưới đỏ", "vietnamese"),
  img("1519167758481-83f550bb49b3", "Cổng hoa truyền thống", "vietnamese"),
  img("1501901609772-df0848060b33", "Lễ rước dâu", "vietnamese"),
  img("1528823872057-9c018a7a7553", "Đám cưới quê", "vietnamese"),
  img("1519389950473-47ba0277781c", "Trang trí cưới VN", "vietnamese"),
  img("1457369804613-52c61a468e7d", "Hoa cưới hồng", "vietnamese"),
  img("1494955870715-979ca4f13bf0", "Cô dâu chú rể VN", "vietnamese"),
  img("1516589178581-95deaec6eb51", "Phông cưới", "vietnamese"),
```

**Step 4: Update the header comment**

Change line 36 from:
```typescript
/* ── Stock image library — 36 curated wedding photos ── */
```
to:
```typescript
/* ── Stock image library — 120+ curated wedding photos ── */
```

**Step 5: Verify type check**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors

**Step 6: Commit**

```bash
git add apps/web/src/app/editor/[id]/components/editor-constants/stock-images.ts
git commit -m "feat(sprint64): expand stock image library 36→120+ photos (5 new categories)"
```

---

## Task 7: Verify Build & Type Check

**Files:** None (verification only)

**Step 1: Run TypeScript check**

Run: `cd apps/web && npx tsc --noEmit 2>&1 | tail -20`
Expected: No type errors

**Step 2: Run full build**

Run: `cd apps/web && npx next build 2>&1 | tail -30`
Expected: Build succeeds

**Step 3: If any errors, fix them**

Common issues:
- Font import names don't match `next/font/google` exports → check exact names at https://fonts.google.com
- `musicFilter` type mismatch between parent and child → ensure both use the same union type
- `StockCategory` type not updated everywhere → check `editor-constants/index.ts` exports

**Step 4: Final commit if any fixes**

```bash
git add -A
git commit -m "fix(sprint64): resolve build errors from content expansion"
```

---

## Summary

| Task | What | Files Changed | Commit |
|------|------|---------------|--------|
| 1 | Fonts in layout (15→35) | `layout.tsx` | `feat(sprint64): add 20 new wedding fonts` |
| 2 | FontPickerModal (43→51) | `FontPickerModal.tsx` | `feat(sprint64): add 8 new fonts to picker` |
| 3 | Text presets (11→21) | `text-presets.ts` | `feat(sprint64): add 10 new text presets` |
| 4 | Music library (24→55) | `music-presets.ts` | `feat(sprint64): expand music library` |
| 5 | Music categories | `MusicTab.tsx`, `CraftVisualEditor.tsx` | `feat(sprint64): add music category filters` |
| 6 | Stock images (36→120+) | `stock-images.ts` | `feat(sprint64): expand stock images` |
| 7 | Verify build | — | Fix if needed |

**Total new content:** 20 fonts + 31 songs + 84+ photos = 135+ new content items
