# UI_COMPONENTS.md — CineLove Component Library

## Global Components

### Navigation Bar (Public)
- Logo (left): "Cinelove" cursive logo with pink icon
- Menu items (center): Trang chủ, Mẫu thiệp, Thiệp đã tạo, Gói dịch vụ, Liên hệ, Tạo thiệp trọn gói
- Auth buttons (right): Đăng nhập, Đăng ký
- Mobile: Hamburger menu
- After login: User avatar replaces auth buttons

### Sidebar (Dashboard)
- Logo at top
- Grouped menu sections: HOME, THIẾT KẾ CỦA TÔI, QUÀ TẶNG & LỜI CHÚC, TÀI KHOẢN, HỖ TRỢ
- Active item: Rounded blue/purple highlight with white text
- Icons: Line-style icons for each menu item
- Fixed width, light background (#F5F7FA range)

### Floating Support Button
- Bottom-right, coral/pink circle
- Headphone icon
- Opens Messenger/Zalo chat widget

---

## Landing Page Components

### Hero Section
- Full-width dark background with card collage
- Centered tagline with gradient text
- Pink CTA button with arrow icon

### Template Card (Gallery)
- Aspect ratio: ~9:16 (portrait, mobile-first)
- Tier badge: Top-right corner (BASIC=green, PREMIUM=coral)
- Hover state: Eye icon (preview) + Heart icon (favorite)
- Shadow on hover, slight scale transform

### Template Preview Modal
- Left: Scrollable iframe showing live template
- Right: Feature bullets + "Dùng mẫu này" pink button + QR code
- Engagement counts: Heart icon (favorites) + Eye icon (views)
- Close button: X in corner

### Customer Showcase Card
- Thumbnail image of published invitation
- Couple name/event name overlay at bottom
- Date badge
- Horizontal scrollable carousel

### Feature Card (Why Choose)
- Dark card with rounded corners
- Title + description text
- Small emoji/icon at bottom-right
- Grid layout: 4 cards in a row

---

## Dashboard Components

### User Profile Card
- Avatar (circular), Name, Email
- Plan badge: "Free" with "Nâng cấp →" link
- Light pink background

### Stats Cards
- Usage statistics: Website (X/Y), Hình ảnh (X/Y), Lượt xem (X/Y)
- Progress bar showing usage percentage
- Limit text below: "Giới hạn: N"

### Quick Link Icons
- Circular colored background: Lời chúc (pink), Quà tặng (coral), Tham dự (green), Ví & Xu (orange)
- Icon + label below
- Grid: 4 items in a row

### Partner Program Banner
- Gradient purple background
- Badge: "MỚI" (New)
- Feature tags: Giới hạn cao hơn, Quản lý khách hàng, Tuỳ chỉnh branding
- CTA: "Bỏ qua" / "Tìm hiểu →"

### Plan Card (/my-plan)
- Dark header with plan name + "Nâng cấp" button
- Usage bars: Lượt xem, Hình ảnh, Website
- Tab switch: "Gói hiện tại" / "Add-ons đã mua"
- Feature detail list below

---

## Editor Components

### Toolbox (Left Panel)
- Vertical icon tabs (8 items)
- Active tab: Blue highlight
- Panel content slides out on click
- Each tab: Icon + Vietnamese label

| Tab | Icon | Content |
|-----|------|---------|
| Văn bản | T icon | Text style presets |
| Hình ảnh | Image icon | Upload zone + file history |
| Stock | Puzzle icon | Sticker/decorative element library |
| Nền | Palette icon | Color picker + upload |
| Âm nhạc | Music note | Track library + upload |
| Tiện ích | Widget icon | Interactive widget grid |
| Mẫu | Grid icon | Template layout switcher |
| Hiệu ứng | Sparkle icon | Global animation effects |

### Canvas Area
- Centered phone-shaped preview
- Zoom controls (+ / -)
- Click elements to select
- Blue dotted border on selected element
- Drag handles for resize/reposition
- Scroll to see full invitation

### Property Panel (Right)
- Appears when element is selected
- **Text properties:** Font family (dropdown), Size, Color, Alignment, Letter spacing, Line height, Text shadow
- **Border/Shadow:** Border width, radius, shadow settings
- **Motion:** Entrance animation (fade, slide, zoom), Loop animation (pulse, bounce)
- **Position:** Manual X/Y coordinate input
- **Layer:** Z-index controls

### Top Toolbar
- Left: Undo, Redo, Layer view
- Center: Auto-save status ("Tự động lưu: Bật")
- Right: "Xem trước" (Preview), "Xuất bản" (Publish)

---

## Public Invitation Components

### Envelope Opener
- Animated envelope opening effect on page load
- Custom envelope color matching template theme

### Music Player
- Auto-play background music
- Floating play/pause button
- Volume not controllable (auto-determined)

### Calendar Widget
- Monthly calendar view
- Wedding date highlighted
- Vietnamese day names

### Countdown Timer
- Days, Hours, Minutes, Seconds
- Real-time countdown to wedding date

### Google Maps Embed
- "Xem chỉ đường" (Get directions) button
- Interactive map with venue pin

### Photo Gallery
- Grid or slider of couple photos
- Lightbox on click

### Wish Wall
- Chat-style message bubbles
- Guest name + emoji + message
- "Gửi lời chúc" (Send wish) input field at bottom
- "Bấn tim" (Send heart) button

### Gift QR Box
- Bank account QR code (VietQR format)
- Bank info display
- Amount suggestions or free input

### RSVP Form
- Confirmation options (Will attend / Won't attend)
- Guest count
- Notes field
