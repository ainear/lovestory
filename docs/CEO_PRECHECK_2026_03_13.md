# 🏢 CEO Pre-Check Report — 2026-03-13

> **Vai trò:** CEO / PM của startup LoveStory (7app.online)  
> **Thời gian:** 2026-03-13T21:53 ICT  
> **Phương pháp:** Audit toàn diện — Security, Bugs, Performance, UX/UI, Policy, Templates

---

## 🎯 Mục tiêu session này

1. **[QUAN TRỌNG NHẤT]** Kiểm tra 75 templates đã custom edit đầy đủ giống CineLove.me chưa
2. Fix bugs từ task.md cũ (typo widget, fileInputRef)
3. Set env vars còn thiếu (GEMINI_API_KEY, SEPAY_WEBHOOK_SECRET)
4. Viết toàn bộ phân tích vào docs/

---

## 🔬 I. TEMPLATE PRE-CHECK — Kết quả quan trọng nhất

### ❗ PHÁT HIỆN CHÍNH: Template Parity Gap

| Tiêu chí | CineLove.me | LoveStory hiện tại | Gap |
|---------|-------------|-------------------|-----|
| Số templates | 75+ | 75 | ✅ OK |
| Hình nền thật | ✅ Mỗi template unique | ✅ CDN proxy /cinelove-cdn/ | ✅ OK |
| Layout elements | ✅ Mỗi template có design riêng | ⚠️ Chỉ có 6 family preset | ❌ GAP |
| Typography | ✅ Phù hợp từng template | ⚠️ Generic per family | ❌ GAP |
| Element positions | ✅ Custom per design | ⚠️ Giống nhau trong cùng family | ❌ GAP |

### Chi tiết kỹ thuật

```
editor/new/page.tsx:
  75 templates → CINELOVE_BG (background) ✅
  75 templates → TEMPLATE_FAMILY (chỉ có 6 loại) ⚠️
  6 families → FAMILY_ELEMENTS (15 elements mỗi family) ⚠️

Kết quả: Thiep-cuoi-42 và thiep-cuoi-44 đều là "romantic-pink"
→ Hiển thị CÙNG layout elements, chỉ khác background image
→ Chưa đạt "custom edit full giống cinelove.me"
```

### 🎯 Cần làm: 3 mức độ giải pháp

| Option | Mô tả | Effort | Impact |
|--------|-------|--------|--------|
| **A - Quick** | Tăng families từ 6 → 20 (mỗi family ~4 templates) | 2h | Medium |
| **B - Deep** | Per-template unique element layout (75 template presets riêng) | 2 ngày | HIGH ⭐ |
| **C - Smart** | 20 families + AI điều chỉnh màu theo bg thumbnail | 1 ngày | HIGH ⭐ |

**Khuyến nghị:** Option B — Per-template unique layout, ưu tiên top 20 templates (cao nhất)

---

## 🔐 II. SECURITY PRE-CHECK

| Check | Status | Note |
|-------|--------|------|
| Auth guards (18 routes) | ✅ OK | Fixed trong session 09/03 |
| IDOR prevention (orders) | ✅ OK | B1 đã fix |
| RSVP table name | ✅ OK | rsvp_responses đã dùng đúng |
| SEPAY_SANDBOX | ✅ OK | false qua env var |
| INTERNAL_API_SECRET | ✅ Set trên Vercel | |
| GEMINI_API_KEY | ❌ Chưa set | AI text sẽ dùng fallback |
| SEPAY_WEBHOOK_SECRET | ❌ Chưa set | Webhook unprotected |
| Cinelove CDN proxy | ⚠️ Legal risk | Dùng assets của cinelove.me qua proxy |

### ⚠️ Legal Risk — CDN Proxy

```
next.config.ts rewrites:
  /cinelove-cdn/:path* → https://assets.cinelove.me/:path*

Đây là: Sử dụng assets của người khác không có phép
Rủi ro: DMCA takedown, legal issues
Giải pháp: Download và self-host thumbnails (1-time bulk download)
```

---

## 🐛 III. BUG PRE-CHECK

| ID | Bug | File | Priority |
|----|-----|------|---------|
| U2 | Widget typo "Phù ngư" → "Phong bì mừng cưới" | RightPanel/WidgetPanel | 🟠 Medium |
| U4 | "Đổi ảnh" dùng wrong fileInputRef | ImagePanel | 🔴 High (UX break) |
| U1 | Image opacity desync (el.opacity vs p.opacity) | ImagePanel | 🟠 Medium |
| U5 | Text alignment icons không rõ ràng | TextPanel | 🟡 Low |
| NEW | alert("Tính năng đang phát triển") — AI BG remove là stub | ImagePanel:L159 | 🟠 Medium |

---

## ⚡ IV. PERFORMANCE PRE-CHECK

| Metric | Status | Detail |
|--------|--------|--------|
| TypeScript | ✅ 0 errors | Verified 2026-03-13 |
| Bundle size | ⚠️ Not checked | next build needed |
| Image CDN | ⚠️ External proxy | Latency từ cinelove CDN |
| Canvas render | ✅ DOM-based | Tốt cho text-heavy invitations |
| Playwright tests | ✅ 15/15 pass | Last run: 2026-03-09 |

---

## 🎨 V. UI/UX PRE-CHECK

| Area | CineLove.me | LoveStory | Gap |
|------|-------------|-----------|-----|
| Template gallery | 6-col masonry | ✅ 6-col + hover | ✅ |
| Editor layout | Vertical sidebar | ✅ Tương đương | ✅ |
| Right panel | Per-element panels | ✅ Full panels | ✅ |
| Music player | Spinning vinyl | ✅ Implemented | ✅ |
| RSVP sticky CTA | Bottom sticky | ✅ Implemented | ✅ |
| Template init | Unique per design | ❌ 6 families | ❌ |
| Particle effects | Confetti/Snow | ✅ Implemented | ✅ |

---

## 📋 VI. CÔNG VIỆC ĐÃ HOÀN THÀNH (tính đến 13/03)

| Sprint | Task | Status |
|--------|------|--------|
| Sprint 49-51 | 75 Cinelove templates + CDN proxy | ✅ |
| Sprint 50 | 6 style families, 15 elements each | ✅ |
| Sprint 51 | Template → family mapping | ✅ |
| Phase 4 | Music Library 8 bài + preview | ✅ |
| Phase 4 | Analytics visual chart | ✅ |
| CEO Audit | 5 security bugs B1-B4+P1 | ✅ |
| CEO Audit | 10 file rsvps → rsvp_responses | ✅ |
| Vercel | INTERNAL_SECRET, RESEND, EMAIL_FROM, SANDBOX | ✅ |
| middleware | proxy.ts migration | ✅ |
| Tests | 15/15 Playwright pass | ✅ |

---

## 🚀 VII. PLAN TIẾP THEO (Priority Order)

### 🔴 P0 — Ngay bây giờ (hôm nay)

1. **Fix U4** (Đổi ảnh dùng wrong ref) — 15 phút
2. **Fix U2** (Widget typo) — 5 phút  
3. **Deploy & test** — 10 phút

### 🟠 P1 — Sprint 52 (tuần này)

4. **Template per-design unique elements** — TOP 20 templates
   - Phân tích visual thumbnail của từng template
   - Adjust font/màu/position phù hợp với từng background
   - Ước tính: 20 × 30 phút = ~2 ngày

### 🟡 P2 — Sprint 53 (tuần sau)

5. Set GEMINI_API_KEY + SEPAY_WEBHOOK_SECRET
6. Self-host CDN thumbnails (legal safety)
7. Viết Playwright tests cho editor flow

---

## 📊 VIII. CineLove.me PARITY SCORE

| Feature | Weight | Score | Weighted |
|---------|--------|-------|---------|
| Template gallery UI | 10% | 95% | 9.5% |
| Editor functionality | 20% | 90% | 18% |
| Template init quality | 20% | 40% | 8% ❌ |
| Music & effects | 10% | 85% | 8.5% |
| RSVP & guest mgmt | 10% | 80% | 8% |
| Analytics | 10% | 75% | 7.5% |
| Performance | 10% | 70% | 7% |
| Security | 10% | 85% | 8.5% |
| **TOTAL** | **100%** | | **75%** |

**Kết luận: LoveStory đang ở ~75% vs CineLove.me**  
**Gap lớn nhất:** Template init quality (40% — chỉ 6 families cho 75 templates)

---

*Report: 2026-03-13T21:53 ICT | Next review: khi fix xong template per-design*
