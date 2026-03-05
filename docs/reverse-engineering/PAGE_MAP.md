# PAGE_MAP.md — CineLove Complete Navigation

## Public Pages (No Auth Required)

```
/                           # Landing page (homepage)
/templates                  # Template gallery with categories filter
/template/[slug]            # Individual template preview page
/template/iframe/[slug]     # Template live preview in iframe
/thiep-cuoi/khach-hang      # Customer invitation showcase
/pricing-plans              # Pricing plans comparison
/thiep-tron-goi             # Full-service package ordering
/contact                    # Contact page
/showcase/pc/[id]           # Public published invitation view
/[slug]                     # Short URL redirect to published invitation
```

## Authenticated Pages (Dashboard)

```
# ── HOME ──
/dashboard                  # Overview (stats, quick links, partner program)
/dashboard/my-plan          # Current plan details, usage stats, upgrade
/dashboard/my-plan/upgrade  # Plan upgrade/checkout flow

# ── THIẾT KẾ CỦA TÔI (My Designs) ──
/pages                      # My online invitations list
/dashboard/my-custom-web    # My custom websites list

# ── CREATE ──
/editor-template/[id]       # Canvas editor (for invitation editing)

# ── QUÀ TẶNG & LỜI CHÚC ──
/dashboard/blessing-box     # Guest wishes inbox
/dashboard/gifts-overview   # Gift tracking and management

# ── TÀI KHOẢN ──
/dashboard/profile          # Personal info + password change

# ── HỖ TRỢ ──
/dashboard/feedback         # Feedback submission form
```

## Sidebar Navigation Structure

```
HOME
├── Tổng quan              → /dashboard
├── Gói dịch vụ của tôi    → /dashboard/my-plan
└── Tạo thiết kế           → Modal popup
    ├── Thiết kế trống      → /editor-template/blank
    ├── Mẫu có sẵn          → /templates
    └── Web hay ho           → External/custom web builder

THIẾT KẾ CỦA TÔI
├── Thiệp online           → /pages
└── Website khác           → /dashboard/my-custom-web

QUÀ TẶNG & LỜI CHÚC
├── Lời chúc               → /dashboard/blessing-box
└── Quà tặng               → /dashboard/gifts-overview

TÀI KHOẢN
└── Thông tin cá nhân      → /dashboard/profile

HỖ TRỢ
└── Đóng góp ý kiến        → /dashboard/feedback
```

## Editor Routes

```
/editor-template/[template_id]   # Full canvas editor
  # URL stays the same, panels change via left sidebar clicks:
  # - Văn bản (Text)
  # - Hình ảnh (Photos)
  # - Stock (Materials/Stickers)
  # - Nền (Background)
  # - Âm nhạc (Music)
  # - Tiện ích (Widgets)
  # - Mẫu (Templates)
  # - Hiệu ứng (Effects)
```

## API Domain
```
https://api.cinelove.me     # Backend API
https://img.cinelove.me     # Image/asset CDN
```
