# Sprint 67: Viewer Polish + Deploy

**Goal:** Complete viewer rendering for ALL widget types, add responsive mobile, integrate OG meta from editor, and deploy to production via Vercel.

**Target:** 100% CineLove parity for both editor AND viewer.

## Phase 1: Viewer Widget Completion

### Album Widget Renderer
- Read `widget.photos[]` array from element props
- Render as responsive grid (2-3 columns) with lightbox on tap
- Support caption per photo
- Lazy load images with IntersectionObserver

### FormBuilder Widget Renderer
- Read `widget.fields[]` from element props
- Render each field type: text, textarea, select, checkbox, radio
- Submit to `/api/form-submit` endpoint
- Show success/error feedback

## Phase 2: Responsive Mobile

- Ensure viewport meta tag in layout.tsx
- Scale canvas elements proportionally: `transform: scale(screenWidth / canvasWidth)`
- Font size minimum 12px on mobile
- Touch targets minimum 44px
- Test on 375px (iPhone SE) and 390px (iPhone 14)

## Phase 3: OG Meta Integration

- Read `ogTitle` / `ogDescription` from `canvas_json.meta` in `layout.tsx` generateMetadata
- Fallback chain: ogTitle → "Thiệp mời cưới {groom} & {bride}"
- OG image: use project cover_image or first photo

## Phase 4: Commit + Deploy

- Commit all uncommitted work on develop
- Fix TypeScript errors in test files
- Push develop → origin/develop
- Merge develop → main
- Vercel auto-deploys from main branch
- Verify production at 7app.online
