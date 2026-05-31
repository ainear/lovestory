# PLAN-cinelove-parity.md — Bản So Sánh Kế Hoạch & Tiến Độ LoveStory vs CineLove.me

Tài liệu này đánh giá chi tiết tình hình triển khai thực tế của dự án **LoveStory** so với đối thủ dẫn đầu thị trường Việt Nam hiện tại là **CineLove.me**, đồng thời xác định các khoảng trống (gaps) kỹ thuật và lộ trình hành động để đạt 100% sự tương đồng (Parity) và vượt qua đối thủ.

---

## 1. 📊 Tình Hình Triển Khai Thực Tế Của LoveStory

Dựa trên cấu trúc Monorepo hiện tại và các tính năng cốt lõi vừa được tối ưu hóa, LoveStory đã hoàn thành lớp nền tảng kỹ thuật vững chắc:

| Hạng mục | Trạng thái kỹ thuật | Mức độ hoàn thành |
| :--- | :--- | :--- |
| **Foundation (Nền tảng)** | Monorepo Turborepo, Database Drizzle, Auth Supabase (Google/OTP) | **100%** |
| **Kiến trúc Server (SSR)** | SSR Next.js hoàn chỉnh cho `/i/[slug]`, hỗ trợ SEO OG Meta tức thì | **100%** |
| **Giao diện Thiệp (Viewer)** | Hỗ trợ 2 chế độ: Canvas Engine (`CanvasInvitation` v2) & Classic HTML | **90%** |
| **Mừng cưới (VietQR động)** | Sinh QR Napas động, có nhập số tiền/tên khách mời realtime, copy STK | **100% (Vượt CineLove)** |
| **AI Video Generator** | Worker FFmpeg render video, AI Story Text Gen (Gemini), Credit Gating | **75% (Vượt CineLove)** |
| **Quản lý Khách (RSVP/Wish)** | Widget Rsvp, Wish wall masonry, API ghi nhận lời chúc/xác nhận | **80%** |
| **Trình soạn thảo (Editor UX)** | Form-based editor, tính năng thay đổi palette/font, live preview | **65%** |

---

## 2. ⚔️ Bản So Sánh Đối Đầu: LoveStory vs CineLove.me

**CineLove.me** là đối thủ top 1 Việt Nam hiện tại về tạo thiệp cưới online. Dưới đây là bảng đối chiếu tính năng để xem chúng ta đã thực sự đuổi kịp đối thủ hay chưa:

| Tính năng cốt lõi | CineLove.me | LoveStory (Hiện tại) | Đánh giá Parity (%) & Khoảng cách |
| :--- | :--- | :--- | :--- |
| **Số lượng Templates** | 75+ mẫu thiệp thiết kế cao cấp | Seed sẵn 75 mẫu presets | **80%** (Số lượng tương đương nhưng chất lượng chi tiết một số mẫu cần trau chuốt thêm). |
| **Chất lượng Typography & Layering** | Cực kỳ tinh tế, font chữ uốn lượn đẹp, hoa văn trang trí đổ bóng mềm mại | Đã chỉnh width canvas về 390px chuẩn mobile, hỗ trợ Google Fonts uốn lượn | **75%** (Cần hoàn thiện Phase 2 trong Sprint để tinh chỉnh 5 mẫu chủ đạo đạt Parity score 10/10). |
| **Mừng cưới online** | QR Code tĩnh chuyển khoản thông thường | **VietQR Động thông minh**: Khách tự nhập số tiền, tự sinh QR có ghi chú động, copy STK nhanh | **150% (Vượt CineLove)**. Đây là vũ khí trải nghiệm cực mạnh của LoveStory. |
| **AI Video Generation** | ❌ Không hỗ trợ | **Độc quyền**: Upload ảnh + Gemini sinh kịch bản + FFmpeg render video cinematic nhúng thẳng vào thiệp | **200% (Vượt CineLove)**. Đây là tính năng tạo đột phá và lan truyền (viral) chính. |
| **Trình chỉnh sửa (Editor UX)** | Kéo thả trực quan, mượt mà trên mobile, có preview tức thì | Form-based editor ở desktop/mobile, canvas editor tọa độ tuyệt đối đang tối ưu | **60%** (Trình kéo thả trên điện thoại của CineLove rất mượt, LoveStory cần tối ưu responsive tốt hơn). |
| **Tốc độ tải trang & SEO** | Nhanh, nhẹ, hiển thị OG image cô dâu chú rể mượt mà khi chia sẻ qua Zalo/FB | Mới nâng cấp lên Next.js SSR + `generateMetadata` Server-side | **100%** (Đã đạt mức tương đương tuyệt đối sau đợt refactor kiến trúc SSR). |

---

## 3. 🔍 Các Khoảng Trống (Gaps) Cần Bù Đắp Để Đạt 100% Parity

Để tự tin tuyên bố "Đã đuổi kịp và sẵn sàng đánh bại CineLove", chúng ta phải giải quyết 3 khoảng trống sau:

### 🔴 Khoảng trống 1: Trình xem trước và chỉnh sửa trên Thiết bị di động (Mobile Editor UX)
* *Hiện trạng của ta:* Form editor hoạt động tốt ở màn hình lớn, nhưng trên màn hình mobile, việc thiết kế canvas kéo thả dễ bị chạm nhầm hoặc vỡ bố cục.
* *Hành động:* Giới hạn chế độ kéo thả tự do trên mobile, thay vào đó cung cấp form nhập liệu thông minh (Form-based Input) có chia tabs rõ ràng (Thông tin -> Album ảnh -> Mừng cưới).

### 🟡 Khoảng trống 2: Độ tinh tế của 5 Mẫu Template Đỉnh cao (Romantic, Luxury, Classic, Traditional, Minimal)
* *Hiện trạng của ta:* Các template presets đã có tọa độ nhưng một số icon hoa trang trí hoặc viền khung ảnh còn thô, chưa tiệm cận độ sang trọng của CineLove.
* *Hành động:* Thực thi Phase 2 của Sprint: Rà soát và tinh chỉnh CSS/Canvas Layer của 5 template chính để đạt parity score 10/10.

### 🟡 Khoảng trống 3: Trải nghiệm Nhạc nền (Audio Auto-play)
* *Hiện trạng của ta:* Người dùng mở link thiệp từ Zalo đôi khi bị trình duyệt chặn nhạc tự động phát.
* *Hành động:* Tạo action "Mở phong bì" (Envelope intro animation). Khi khách nhấn "Mở thiệp" sẽ đồng thời kích hoạt trình phát nhạc (valid user gesture), giải quyết triệt để chính sách bảo mật audio của Safari/Chrome.

---

## 📅 Lộ Trình Hành Động Đạt 100% Hoàn Thiện

```
Tuần này: [Parity Sprint]
██████████████░░░░░░░░░░░░░░░░  50%
- [x] SSR & SEO Metadata (Done)
- [x] Dynamic VietQR & STK Copy (Done)
- [x] AI Video Credit limits & Refund (Done)
- [/] Tinh chỉnh 5 template chủ chốt (Phase 2 - Đang thực hiện)
- [ ] Tối ưu hóa Trải nghiệm Mobile Editor UX (Phase 4 - Kế hoạch tiếp theo)
```

### Bước tiếp theo dành cho Bạn:
1. Bạn đã duyệt qua bản so sánh kế hoạch [PLAN-cinelove-parity.md](file:///Users/mini4/AAA/lovestory/docs/PLAN-cinelove-parity.md).
2. Hãy chạy lệnh `/create` hoặc phản hồi để chúng ta bắt đầu triển khai đợt tinh chỉnh chất lượng giao diện template (Phase 2 - Template Quality)!
