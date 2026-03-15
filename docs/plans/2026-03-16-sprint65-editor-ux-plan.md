# Sprint 65 — Editor UX: QR Code, Color Picker, Stock Photos, Guest Dashboard

**Goal:** Ship four user-facing improvements that close the gap between MVP and production readiness — real QR codes for bank transfers, a proper color picker, an expanded stock photo library, and a wired-up guest dashboard with RSVP/wish data.

**Architecture:** Custom canvas engine (absolute positioning), TRPC for data, Supabase backend.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, TRPC

---

## Task 1: Real QR Code Generation (P0)

**Problem:** The QR Box widget in `WidgetRenderer.tsx` renders a placeholder `<div>` with "QR Code" text instead of an actual scannable QR image. Users cannot use the bank transfer feature.

**Solution:**
- Install `qrcode` npm package (lightweight, canvas/SVG output, no heavy deps)
- Replace the placeholder div in `QrBoxWidget` with an `<img>` tag pointing to the VietQR API URL
- VietQR URL format: `https://img.vietqr.io/image/{bankBin}-{accountNumber}-compact.jpg?amount={amount}&addInfo={note}`
- Add `bankBin` field to the QR config with a bank selector dropdown
- QR image updates reactively as user changes account number, bank, amount, or note in the right panel
- Add a `VIETNAM_BANKS` constant with bin codes: VCB (970436), TCB (970407), MB (970422), ACB (970416), BIDV (970418), VPB (970432), TPB (970423)

**Files:**
- Create: `apps/web/src/app/editor/[id]/components/canvas-engine/vietnam-banks.ts` — bank list with bin codes
- Modify: `apps/web/src/app/editor/[id]/components/canvas-engine/WidgetRenderer.tsx` — replace QrBoxWidget placeholder with VietQR `<img>`
- Modify: `apps/web/src/app/editor/[id]/components/canvas-engine/CanvasRightPanel.tsx` — add bank selector dropdown and amount field when editing a qrbox widget

**Steps:**
1. Create `vietnam-banks.ts` with bank name, short code, and BIN for each bank
2. In `QrBoxWidget`, read `bankBin`, `accountNumber`, `amount`, `note` from config
3. Construct VietQR URL and render as `<img>` with `width=120, height=120`
4. Fallback: if bankBin or accountNumber is empty, show a "Chua cau hinh" message
5. In `CanvasRightPanel`, detect `widgetType === "qrbox"` and show bank dropdown + amount input
6. Bank dropdown options sourced from `VIETNAM_BANKS` constant

**Verification:**
- QR image renders on canvas when bank + account are configured
- Changing bank/account/amount in right panel updates QR in real-time
- QR is scannable by VietQR-compatible banking apps

**Commit:** `feat(sprint65): real QR code generation with VietQR for bank transfers`

---

## Task 2: Color Picker Component (P0)

**Problem:** The editor uses raw `<input type="color">` in at least 4 places (CanvasRightPanel, BgTab, RightPanel, MusicTab). These native pickers lack opacity control, swatches, and hex input — inconsistent UX.

**Solution:**
- Create a reusable `ColorPicker` component with: preset swatches grid, hex input field, opacity slider
- Preset swatches: 16 wedding-friendly colors (blush, rose, gold, ivory, sage, navy, etc.)
- Replace all raw `<input type="color">` with the new component
- Component accepts `value: string` (hex or rgba), `onChange: (color: string) => void`, `showOpacity?: boolean`

**Files:**
- Create: `apps/web/src/app/editor/[id]/components/canvas-engine/ColorPicker.tsx`
- Modify: `apps/web/src/app/editor/[id]/components/canvas-engine/CanvasRightPanel.tsx` — swap color inputs for text color, background color, border color, shadow color
- Modify: `apps/web/src/app/editor/[id]/components/sidebar/BgTab.tsx` — swap background color input
- Modify: `apps/web/src/app/editor/[id]/components/RightPanel.tsx` — swap any color inputs

**Steps:**
1. Create `ColorPicker.tsx` with three sections: swatches grid (4x4), hex text input, opacity range slider
2. Swatches: #e11d48, #f43f5e, #fb7185, #fda4af, #c084fc, #a855f7, #f59e0b, #d97706, #10b981, #059669, #3b82f6, #1e40af, #1f2937, #6b7280, #ffffff, #000000
3. Hex input validates 3/6-char hex codes, auto-prepends #
4. Opacity slider (0-100%) converts to rgba output when enabled
5. Component renders as a small popover/dropdown triggered by a color swatch button
6. Search-replace all `<input type="color"` instances with `<ColorPicker>`

**Verification:**
- Color picker opens as popover when clicking color swatch
- Clicking a preset swatch updates the color immediately
- Typing hex value updates the color
- Opacity slider produces rgba() output
- All 4 files use the new component, zero remaining `<input type="color">`

**Commit:** `feat(sprint65): reusable ColorPicker with swatches, hex input, opacity slider`

---

## Task 3: Stock Photo Library Expansion (P1)

**Problem:** `STOCK_IMAGES` in `editor-constants/stock-images.ts` has only 12 photos. No category filtering. Users need more variety for wedding invitations.

**Solution:**
- Expand to 36+ curated Unsplash wedding photos (bundled URLs, no API key needed)
- Add `category` field to the `StockImage` interface
- Categories: couple, ceremony, reception, decoration, rings, flowers
- Add category filter tabs in `ImageTab.tsx`
- Show "All" tab by default, clicking a category filters the grid

**Files:**
- Modify: `apps/web/src/app/editor/[id]/components/editor-constants/stock-images.ts` — expand to 36+ photos with category field
- Modify: `apps/web/src/app/editor/[id]/components/sidebar/ImageTab.tsx` — add category filter tabs above the stock photo grid

**Steps:**
1. Add `category` field to `StockImage` interface: `category: "couple" | "ceremony" | "reception" | "decoration" | "rings" | "flowers"`
2. Expand `STOCK_IMAGES` array to 36 items (6 per category), all Unsplash URLs with `?w=600` for full and `?w=120` for thumb
3. In `ImageTab.tsx`, add a `selectedCategory` state (default: "all")
4. Render horizontal pill tabs for each category + "All"
5. Filter `STOCK_IMAGES` by selected category before rendering the grid
6. Category labels in Vietnamese: Cặp đôi, Lễ cưới, Tiệc, Trang trí, Nhẫn, Hoa

**Verification:**
- Stock photo grid shows 36+ photos when "All" is selected
- Clicking a category filters to ~6 photos
- Clicking a stock photo adds it as an image element on canvas
- Thumbnails load quickly (120px width)

**Commit:** `feat(sprint65): expand stock photo library to 36 photos with category filters`

---

## Task 4: Guest Dashboard — RSVP & Wishes Display (P1)

**Problem:** The `/dashboard/guests` page manages guest lists (add, delete, share links) but does not display RSVP responses or wishes submitted by guests. The TRPC endpoints `listRsvps` and `getWishes` exist but are not wired to the dashboard UI.

**Solution:**
- Add two new sections to `GuestList.tsx`: RSVP Responses table and Wishes feed
- Fetch data using existing `trpc.guest.listRsvps` and `trpc.guest.getWishes` endpoints
- Show summary stats: total confirmed, total declined, total maybe, total wishes
- RSVP table columns: guest name, status (confirmed/declined/maybe), guest count, phone, timestamp
- Wishes feed: guest name, emoji, message, timestamp

**Files:**
- Modify: `apps/web/src/app/dashboard/guests/_components/GuestList.tsx` — add RSVP and wishes sections with stats

**Steps:**
1. Add `trpc.guest.listRsvps.useQuery({ projectId })` and `trpc.guest.getWishes.useQuery({ projectId })` calls
2. Compute summary stats: `confirmed = rsvps.filter(r => r.status === "confirmed").length`, etc.
3. Render stats cards row: 4 cards (Confirmed, Declined, Maybe, Wishes) with count and color
4. Render RSVP table below stats with columns: Tên, Trạng thái, Số khách, SĐT, Thời gian
5. Render Wishes section as a card feed: each wish shows emoji, guest name, message, relative time
6. Both sections appear below the existing guest list table
7. Empty states: show "Chưa có phản hồi" / "Chưa có lời chúc" when no data

**Verification:**
- RSVP responses display with correct status badges (confirmed/declined/maybe)
- Guest count totals are accurate
- Wishes display with emoji, name, message
- Stats cards update when switching between projects
- Empty states render cleanly when no RSVP/wish data exists

**Commit:** `feat(sprint65): guest dashboard with RSVP responses, wishes, and summary stats`

---

## Implementation Order

1. **Task 2** (ColorPicker) — foundational component, other tasks may benefit from it
2. **Task 1** (QR Code) — high priority, uses the right panel which may reference ColorPicker
3. **Task 3** (Stock Photos) — independent, data + UI change only
4. **Task 4** (Guest Dashboard) — independent, dashboard route only

**Estimated effort:** 2-3 hours total across all 4 tasks.
