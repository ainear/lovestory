# USER_FLOWS.md — CineLove User Journeys

## Flow 1: Browse & Select Template

```
/templates → Browse grid → Filter by category → Hover card → Click eye icon
→ Preview modal (iframe + QR code) → "Dùng mẫu này" → /editor-template/[id]
```

### Steps:
1. User visits `/templates`
2. Category tabs filter: Tất cả | Thiệp cưới | Sinh nhật | Tốt nghiệp | Sự kiện | Kỷ niệm | Lời chúc | Khác
3. Package filter dropdown: Tất cả gói | BASIC | PREMIUM
4. Hover on template card → eye (preview) and heart (favorite) icons appear
5. Click eye → modal shows: iframe preview + feature list + QR code for mobile preview
6. Click "Xem trực tiếp" → opens `/template/[slug]` in new tab
7. Click "Dùng mẫu này" → clones template → redirects to editor

---

## Flow 2: Edit Invitation (Editor)

```
/editor-template/[id] → Edit text → Upload photos → Add widgets
→ Change background → Select music → Preview → Publish
```

### Steps:
1. Editor loads with template pre-applied on canvas
2. **Left Toolbox Tabs:**
   - **Văn bản:** Click to add text blocks
   - **Hình ảnh:** Drag-and-drop photo upload, photo history
   - **Stock:** Pre-designed stickers, icons, decorative elements
   - **Nền:** Change background color or upload custom image
   - **Âm nhạc:** Select from library or upload MP3
   - **Tiện ích:** Add interactive widgets (Calendar, Countdown, Map, RSVP, QR, YouTube video, Album, Custom form, Call button, Dynamic guest names)
   - **Mẫu:** Switch entire layout template
   - **Hiệu ứng:** Global animations (falling leaves, snow, hearts)
3. **Canvas interaction:** Click element → right panel shows properties (font, size, color, alignment, spacing, borders, shadows, motion effects)
4. **Top toolbar:** Undo/Redo, Layer management, Auto-save (real-time indicator), Preview, Publish
5. **Auto-save:** Every change is automatically saved

---

## Flow 3: Publish & Share

```
Editor → Click "Xuất bản" → Publish modal → Copy URL → Share via Zalo/Facebook/SMS
```

### Steps:
1. Click "Xuất bản" button in top toolbar
2. System generates unique slug/URL
3. Published URL format: `cinelove.me/showcase/pc/[id]` or custom slug
4. Share options: Copy link, Zalo, Facebook, SMS
5. QR code generated for the invitation URL
6. Invitation is publicly accessible

---

## Flow 4: Guest Interaction (Public Invitation)

```
Guest receives link → Opens invitation → Music plays → Scroll content
→ View details → RSVP → Send wish → Send gift via QR
```

### Steps:
1. Guest opens invitation link (mobile-optimized)
2. Envelope opening animation plays
3. Background music auto-plays
4. Scroll through sections: Hero → Couple info → Calendar → Countdown → Venue + Map → Photo gallery → Wishes wall → Gift QR → RSVP form
5. Guest can:
   - View Google Maps directions
   - Submit RSVP confirmation
   - Write and submit a wish/blessing message
   - Send money gift via QR bank transfer (VietQR)

---

## Flow 5: Dashboard Management

```
/dashboard → View stats → Check plans → Manage invitations → View wishes/gifts
```

### Steps:
1. Login → redirect to `/dashboard`
2. Overview shows: User profile card, Partner program banner, Quick links (Lời chúc, Quà tặng, Tham dự, Ví & Xu), Usage stats (Website usage, Photos used, Views consumed)
3. `/pages` — List of created invitations with view stats
4. `/dashboard/blessing-box` — Inbox of guest wishes
5. `/dashboard/gifts-overview` — Gift tracking with amounts
6. `/dashboard/my-plan` — Plan details, usage limits, upgrade options

---

## Flow 6: Upgrade Plan

```
Dashboard → "Nâng cấp" → /pricing-plans → Select tier → Checkout → Payment → Plan activated
```

### Steps:
1. Click "Nâng cấp →" anywhere in dashboard
2. Redirect to `/pricing-plans`
3. Compare 3 tiers: Free, Basic (199K), Premium (299K)
4. Select plan → Checkout flow
5. Payment methods (likely bank transfer, e-wallet, or payment gateway)
6. Plan activated immediately
