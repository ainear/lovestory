# PRODUCT.md — LoveStory Product Specification

## 1. Vision

**LoveStory** là nền tảng SaaS tạo thiệp cưới online kết hợp AI video generation — giúp các cặp đôi kể câu chuyện tình yêu qua thiệp mời digital đẹp và video cinematic được tạo bởi AI.

> *"Invitation để kiếm tiền, Video để viral"*

### Tagline
**"Kể câu chuyện tình yêu của bạn — bằng AI"**

---

## 2. Problem Statement

| Problem | Current Solution | Pain Point |
|---------|-----------------|------------|
| Thiệp cưới giấy tốn kém, lãng phí | CineLove, Canva | Chỉ là thiệp tĩnh, không có video |
| Quay video cưới cinematic rất đắt (5-20M VND) | Thuê quay phim | Chi phí cao, phải đợi lâu |
| Muốn kể "Love Story" nhưng không biết viết | Tự nghĩ, nhờ bạn | Tốn thời gian, kết quả không chuyên nghiệp |
| Quản lý khách mời phức tạp | Google Sheets, Excel | Không tích hợp, thủ công |

---

## 3. Target Users

### Primary: Cặp đôi sắp cưới (B2C)
- Tuổi: 22-35
- Tech-savvy, sử dụng smartphone
- Muốn tiết kiệm nhưng vẫn có thiệp đẹp + video cinematic
- Active trên social media (Zalo, Facebook, TikTok)

### Secondary: Wedding Studios (B2B)
- Quản lý 10-100+ đám cưới/năm
- Cần white-label solution cho khách hàng
- Muốn upsell thêm dịch vụ digital

### Tertiary: Event Agencies
- Sinh nhật, kỷ niệm, party
- Multi-template, multi-event support

---

## 4. Core Features

### 4.1 🎬 AI Video Generator (Killer Differentiator)

**Mô tả:** Upload 5-20 ảnh + chọn nhạc → AI tạo video cinematic 30s-3min với transitions, text overlays, hiệu ứng.

**AI Enhancements:**
- **Face Detection & Smart Crop**: Auto detect khuôn mặt, crop đẹp
- **Background Removal**: Xóa nền ảnh bằng AI (rembg)
- **Love Story Text Gen**: LLM sinh "Câu chuyện tình yêu" từ thông tin cơ bản
- **Smart Music Matching**: Gợi ý nhạc phù hợp mood/tempo

**Templates:** Cinematic, Romantic, Vintage, Modern, Minimalist, Traditional VN

### 4.2 💌 Digital Invitation Builder

**Phase 1 (MVP):** Template-based editing — chọn template, fill form (tên, ngày, địa điểm, ảnh), customize màu sắc/font.

**Phase 2:** GrapesJS drag-and-drop editor với custom wedding blocks.

**Features:**
- 50+ wedding invitation templates
- Customizable color palettes & fonts
- Background music (library + upload)
- Embed AI-generated video vào thiệp
- QR code generation
- Personalized guest name links
- Auto-play envelope opening animation

### 4.3 📋 Guest Management

- RSVP tracking (Confirmed / Declined / Pending)
- Guest wish wall (lời chúc)
- Gift management (QR bank transfer)
- CSV import/export guest lists
- Auto-send personalized link per guest
- View analytics per guest

### 4.4 📊 Dashboard & Analytics

- Tổng quan: views, RSVPs, wishes
- Per-invitation analytics
- Real-time visitor tracking
- Usage quotas & billing status

### 4.5 🏪 Template Gallery

- Category filters: Cưới, Sinh nhật, Kỷ niệm, Event
- Style filters: Cinematic, Minimal, Traditional, Modern
- Live preview with QR
- "Use this template" one-click flow
- Premium template gating

---

## 5. User Journey

```
┌──────────────────────────────────────────────────────────────────┐
│                    LoveStory User Journey                        │
│                                                                  │
│  1. DISCOVER                                                     │
│     Landing page → Browse templates → Watch demo video           │
│     ↓                                                            │
│  2. SIGN UP (Google/Email)                                       │
│     Free tier → 1 invitation + 1 AI video (watermark)            │
│     ↓                                                            │
│  3. CREATE INVITATION                                            │
│     Pick template → Fill form (names, date, venue, photos)       │
│     → Customize colors/fonts → Preview                           │
│     ↓                                                            │
│  4. GENERATE AI VIDEO                                            │
│     Upload photos → Choose music → Select video template         │
│     → AI generates video → Preview → Edit/Regenerate             │
│     ↓                                                            │
│  5. PUBLISH & SHARE                                              │
│     Embed video in invitation → Publish → Get shareable link     │
│     → Share via Zalo/Facebook/SMS                                │
│     ↓                                                            │
│  6. MANAGE GUESTS                                                │
│     Import guest list → Send personalized links                  │
│     → Track RSVPs → Read wishes → Monitor gifts                  │
│     ↓                                                            │
│  7. UPGRADE (Conversion)                                         │
│     Free → Pro (remove watermark, more videos, more views)       │
│     → Premium (unlimited, priority render, premium templates)    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Pricing & Monetization

### Subscription Tiers

| Feature | Free | Pro (149K/yr) | Premium (299K/yr) |
|---------|------|---------------|-------------------|
| Invitations | 1 | 5 | Unlimited |
| Page Views | 500 | 20,000 | 100,000 |
| AI Videos/month | 1 (watermark) | 10 | 30 |
| Storage Duration | 6 months | 2 years | 5 years |
| Images/invitation | 10 | 50 | 200 |
| Basic Templates | ✅ | ✅ | ✅ |
| Premium Templates | ❌ | ❌ | ✅ |
| Remove Watermark | ❌ | ✅ | ✅ |
| Background Music | Library only | + Upload | + Upload |
| Guest Management | Basic | Full | Full + Export |
| AI Love Story Text | ❌ | ✅ | ✅ |
| Video Resolution | 720p | 1080p | 4K |
| Support | Community | Email | Priority |

### Add-on Credit Packs

| Pack | Price | Credits | Best For |
|------|-------|---------|----------|
| Starter | 49K VND | 10 videos | Occasional use |
| Bundle | 99K VND | 25 videos | Active users |
| Studio | 299K VND | 100 videos | B2B studios |

---

## 7. Competitive Positioning

```
                    High Video Quality
                         ↑
                         │
          LoveStory ★    │
          (AI Video +    │
           Invitation)   │
                         │
  ─────────────────────────────────────→ High Invitation Quality
                         │
                         │        CineLove ★
                         │        (Invitation only,
                         │         no video)
                         │
                    Low Video Quality
```

### Unique Selling Points vs CineLove:
1. **AI Video Generation** — CineLove không có
2. **AI Love Story Text** — tự sinh câu chuyện tình yêu
3. **AI Background Removal** — CineLove basic
4. **Credit-based AI** — mô hình linh hoạt
5. **Phase 2: Live Photo Wall** — feature viral

---

## 8. Success Metrics (KPIs)

### Growth
- MAU (Monthly Active Users): 1K → 10K → 50K (12 months)
- Invitations created/month: 500 → 5K
- AI Videos generated/month: 200 → 2K

### Revenue
- MRR target: Month 3: 5M VND → Month 6: 20M VND → Month 12: 100M VND
- Free → Paid conversion: >5%
- Credit pack purchase rate: >15% of paid users

### Engagement
- Average session duration: >5 min
- Invitation completion rate: >60%
- Video generation completion rate: >80%
- Share rate per invitation: >3 shares

---

## 9. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page Load Time | < 2s (LCP) |
| Video Render Time | < 60s (30s video) |
| Uptime | 99.9% |
| Max Concurrent Users | 1,000+ |
| Data Retention | Per plan (6mo/2yr/5yr) |
| Security | SOC 2 ready, HTTPS, encrypted PII |
| Mobile Responsive | All pages |
| Browser Support | Chrome, Safari, Firefox, Edge (latest 2) |
