# Demo-Elegant: 1:1 CineLove 36 Clone Design

**Goal:** Transform `/i/demo-elegant` from a dry, generic template into a pixel-perfect visual clone of CineLove's "Thiep cuoi 36" for benchmark comparison.

**Scope:** Only `apps/web/src/app/i/[slug]/page.tsx` — demo-elegant slug handler data.

## Decisions

- **Photos:** Unsplash Asian couple placeholders (swap AI-generated later)
- **Illustrations:** Free SVG from storyset.com/undraw.co for THANK YOU section
- **Target:** 1:1 pixel-perfect clone for benchmarking

## Changes

### 1. Layout (biggest impact)
- Hero: 2 photos side-by-side (210px x 530px each) instead of single oval
- All photos: full-width 420px with 8px border-radius
- Section spacing: increase from 30-50px to 80-120px between sections
- Add subtle decorative dividers between sections

### 2. Fonts
- Couple names: Playfair Display → Great Vibes (script, romantic)
- Poetry: Cormorant Garamond Italic → Dancing Script (handwriting)
- Labels: increase letter-spacing to 6px
- Date number: 64px → 72px bold

### 3. Photos (7 needed)
- Hero left: bride with flowers, side angle
- Hero right: couple close-up, formal
- Full-width 1-5: outdoor, rings, walking, scenic, formal

### 4. Effects
- Keep petals particle + envelope intro (already match)
- Increase fadeIn delay stagger for smoother scroll
- Add subtle section divider ornaments

### 5. Illustration
- THANK YOU section: couple illustration SVG from storyset/undraw
