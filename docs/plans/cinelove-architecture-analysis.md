# CineLove Architecture Analysis

**Date:** 2026-03-15
**Source:** Automated Playwright analysis of cinelove.me editor

---

## 1. Tech Stack

| Technology | Details |
|-----------|---------|
| Framework | Next.js Pages Router (buildId: `qQjn-LRclFUMBeSiKy1QA`) |
| Editor Engine | **CraftJS** (same as LoveStory!) |
| UI Library | Ant Design (`ant-` classes: 86 elements) |
| CSS | Tailwind CSS + Styled JSX (301 jsx- classes) |
| Components | Flowbite UI |
| Hosting | Vercel |
| Auth | NextAuth.js (`/api/auth/session`) |
| Backend API | `api.cinelove.me` (separate backend) |
| Image CDN | `img.cinelove.me` (resize, format, quality params) |
| Assets CDN | `assets.cinelove.me` |
| Storage | `uploads/` paths (likely S3/R2) |

## 2. Editor Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header (64px) — Logo, Save status, Share, Preview, Menu    │
├────┬────────────────────────────────────────────┬───────────┤
│    │                                            │           │
│ 85 │           Canvas Area                      │  350px    │
│ px │      (scrollable, flex-col center)          │  Right    │
│    │      Page container: 1485px wide            │  Panel    │
│ L  │      Content: ~500px wide centered          │           │
│ E  │                                            │  Tuỳ chỉnh│
│ F  │      ┌──────────────────┐                  │  Danh mục │
│ T  │      │   Template       │                  │  Trạng thái│
│    │      │   500px wide     │                  │  Bản xem  │
│ S  │      │   ~7300px tall   │                  │  trước    │
│ I  │      │                  │                  │  Tính năng│
│ D  │      └──────────────────┘                  │  nâng cao │
│ E  │                                            │           │
│ B  │                                            │           │
│ A  │                                            │           │
│ R  │                                            │           │
├────┤                                            │           │
│Help│                                            │           │
└────┴────────────────────────────────────────────┴───────────┘
```

### Layout CSS
- Main container: `fixed, flex, flex-row, pt-16, h-full, overflow-hidden`
- Left sidebar: `85px wide, flex, h-full`
- Page container: `flex-1, flex, flex-col`
- Canvas scroll: `relative, flex-col, items-center, pt-14, pb-48`
- Right panel: `350px, h-full, flex-col, overflow-auto, padding: 16px`

## 3. Sidebar Tabs (Left, 85px)

| # | Tab Name | Icon | Content |
|---|----------|------|---------|
| 1 | Văn bản | SVG text icon | Click to add text elements |
| 2 | Hình ảnh | SVG image icon | Upload/manage photos |
| 3 | Stock | SVG stock icon | Clipart library (wedding elements, characters, flowers, etc.) |
| 4 | Hình dạng | SVG shape icon | Geometric shapes (circles, rectangles, lines, etc.) |
| 5 | Nền | SVG bg icon | Background patterns/colors |
| 6 | Âm nhạc | SVG music icon | Music library with categories (Nhạc ngoại, V-POP) |
| 7 | Tiện ích | SVG widget icon | Plugins (11 total) |
| 8 | Thành phần | SVG component icon | Pre-built sections (22+ designs) |
| 9 | Mẫu | SVG template icon | Template gallery with "Xem mẫu" buttons |
| 10 | Hiệu ứng | SVG effect icon | Animation effects (3 categories) |
| — | Hỗ trợ | SVG help icon | Bottom-positioned help button |

### Tab Implementation
- Uses Ant Design `ant-tabs-left` with `ant-tabs-small`
- Class: `toolbox-tab`
- Each tab: icon (SVG) + text label, vertically stacked
- Tab width: 85px, tab height: ~47px each

## 4. Tiện ích (Plugins) — 11 items

| Plugin | Icon | Description |
|--------|------|-------------|
| Lịch | calendar.png | Wedding calendar |
| Đếm ngược | countdown.png | Countdown timer |
| Bản đồ | map.png | Google Maps embed |
| Nút gọi | telephone.png | Call button |
| Form xác nhận tham dự | form.png | RSVP form |
| Form tùy chỉnh | custom-form.png | Custom form builder |
| Tên khách mời tự động | text-box.png | Guest name auto-fill |
| QR Box | gift-box.png | QR code for gifts/bank transfer |
| Hiệu ứng phong bì thư | love-letter.png | Envelope opening animation |
| Album ảnh | photo-gallery.png | Photo gallery |
| Video YouTube | — | YouTube embed |

## 5. Thành phần (Pre-built Sections) — 22+ designs

### Categories
- **Tất cả** — All sections
- **Ảnh** — Photo frames, galleries
- **Thông tin** — Information sections (hai họ, dresscode)
- **Lịch trình** — Timeline, schedule
- **Lời mời** — Invitation letter
- **Khác** — Other (music frame, etc.)

### Available Sections
1. Khung ảnh cưới
2. Thông tin hai họ
3. Khung ảnh lịch cưới
4. Timeline sự kiện
5. Dresscode
6. Tiệc mừng thành hôn
7. Thư mời lễ vu quy
8. Nhà có hỷ
9. Khung nhạc
10. Lễ vu quy
11. Thiệp mời trang trọng
12. Timeline chi tiết
13. Thiệp cưới đầy đủ
14. Ảnh + Lịch
15. Tên đôi uyên ương
16. Bộ sưu tập ảnh
17. Lễ thành hôn đầy đủ
18. Tiệc mừng thành hôn
19. Gửi quà mừng
20. Khung ảnh (2 variants)

Each section is a CraftJS preset (pre-built node tree) stored at `assets.cinelove.me/presets/`.

## 6. Hiệu ứng (Effects) — 3 categories

### Hiệu ứng động (Page Animations)
Pre-built animation presets that apply to all elements:
- None
- Fade In All
- Slide Up All
- Scale In All
- Flip In All
- Slide Up Mix
- Fade In Mix

### Hiệu ứng mở màn (Curtain/Intro Effects)
Opening curtain animations (premium feature).

### Hiệu ứng rơi (Particle Effects)
Falling particle overlays (hearts, petals, snow, etc.).

## 7. Stock/Clipart Library

### Categories (filter chips)
- Tất cả
- Yếu tố đám cưới
- Nhân vật
- Hoa cưới
- Chữ hỷ
- Trái tim
- Xem thêm ▼

### Asset Structure
- Thumbnails: `resources/{category}/thumbnail/{id}.webp` (65x65px grid)
- Full assets: `resources/{category}/{id}.webp`
- Categories in URL paths: `weddingElements`, `characters`, etc.
- Total: 50+ clipart items visible per category

## 8. Right Panel (Settings)

### Default State (no selection)
- **Tuỳ chỉnh** header with pencil icon
- **Danh mục** dropdown (required): Thiệp cưới, Thiệp sinh nhật, Thiệp tốt nghiệp, Sự kiện, Kỷ niệm, Lời chúc, Khác
- **Trạng thái** dropdown: Nháp / Công khai
- **Bản xem trước** section with thumbnail + "Chỉnh sửa" button
- **Tính năng nâng cao** (premium badge):
  - Xóa watermark (toggle)
  - Tùy chỉnh thanh công cụ dưới (toggle)
  - QR Bank (input)
  - Tùy chỉnh tự động cuộn (toggle + speed slider)
- **Thư viện thiệp** toggle
- **Gói hiện tại: FREE** + "Nâng cấp lên Basic+" button

### After Element Selection
Right panel switches to show element-specific controls (accordion sections).

## 9. Template Data Format

### Storage
- Template data stored as **Base64-encoded compressed CraftJS state**
- Field: `templateData` in template record
- Compression: Custom dictionary encoding (control chars as back-references)
- Decoded size: ~17KB for template 53

### CraftJS Node Structure
```json
{
  "ROOT": {
    "type": { "resolvedName": "AppContainer" },
    "isCanvas": true,
    "props": {
      "width": 500,
      "height": 7306.93,
      "background": "#f8f3ebff"
    },
    "nodes": ["node-id-1", "node-id-2", ...]
  },
  "node-id-1": {
    "type": { "resolvedName": "PhotoBox" },
    "props": {
      "top": 222.927,
      "left": 1.0198,
      "width": ...,
      "height": ...,
      "opacity": 1,
      "rotation": 0,
      "shadow": 0,
      ...
    }
  }
}
```

### Component Types (from template 53)
- **AppContainer** — Root canvas container
- **PhotoBox** — Image element with crop support
- **Text** — Text element with font, size, color, alignment
- Plus other components (not fully decodable due to compression)

### Element Positioning
All elements use **absolute positioning** within their parent container:
- `top`, `left` — Position
- `width`, `height` — Dimensions
- `rotation` — Rotation angle
- `opacity` — Transparency
- `zIndex` — Layer order
- `shadow` — Shadow settings
- `borderRadius` — Corner radius

## 10. Fonts Used in Template 53

| Font | Category |
|------|----------|
| BucThu | Vietnamese decorative |
| Aquarelle | Handwritten/brush |
| Quicksand | Sans-serif modern |
| Mallong | Decorative |
| Montserrat | Sans-serif clean |
| RetroSignature | Script/signature |
| Carlytte | Script/calligraphy |
| Soul Note Display | Display/decorative |

**Loading:** Custom @font-face (NOT Google Fonts CDN) — fonts hosted on `assets.cinelove.me`.

## 11. API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/session` | GET | Check auth session |
| `api.cinelove.me/api/addons/user/usage` | GET | User addon usage |
| `api.cinelove.me/api/addons/user/purchased` | GET | User purchases |
| `api.cinelove.me/api/addons/user/limits` | GET | Feature limits |

## 12. Element Selection Behavior

- Click on element → adds `component-selected` CSS class
- Text elements: class `text-box-component component-selected`
- Image/container elements: `jsx-{hash} component-selected`
- Blue dashed border appears on selected elements
- Right panel switches to show element settings
- No contentEditable on single click (requires double-click for text editing)

## 13. Key Differences: CineLove vs LoveStory

| Feature | CineLove | LoveStory | Gap |
|---------|----------|-----------|-----|
| Editor engine | CraftJS | CraftJS | Same! |
| Sidebar tabs | 10 tabs (85px sidebar) | 9 tabs | Missing: Hình dạng |
| Stock library | SVG clipart (wedding-specific) | Unsplash photos | Different content |
| Thành phần | 22+ pre-built sections | None | Missing entirely |
| Effects | 3 categories (động, mở màn, rơi) | 8 particle effects | Need page animations |
| Right panel | 350px, premium features | 260px, basic | Need premium features |
| Fonts | 8 custom fonts (self-hosted) | 12 Google Fonts | Different fonts |
| Template data | Base64 + compression | Inline JSON | Different storage |
| Image CDN | img.cinelove.me (resize/format) | Direct URLs | Need CDN |
| API | Separate backend | Supabase | Different architecture |
| Template size | Canvas 500x~7300 | Canvas 500px | Same width |

---

## 14. Updated Strategy

### Critical Finding: CineLove uses CraftJS
Since CineLove also uses CraftJS, the plan to **remove CraftJS** is no longer necessary. Instead, we should:

1. **Keep CraftJS** — Both platforms use it, proving it's production-ready
2. **Match the UI** — Restructure sidebar, settings panel, and tools
3. **Add missing features** — Shapes tab, Components tab, page animations
4. **Match the fonts** — Self-host wedding fonts
5. **Add clipart library** — Replace Unsplash with wedding SVG clipart
6. **Add pre-built sections** — Create the "Thành phần" tab with section presets
7. **Match element properties** — Add rotation, flip, borders, effects per-element
