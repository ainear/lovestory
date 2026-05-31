# PLAN-cinelove-matching.md — Kế Hoạch Đạt 100% CineLove Parity Dựa Trên Phân Tích DevTools

Tài liệu này ghi chép lại kết quả phân tích cấu trúc mã nguồn HTML/CSS thô của đối thủ **CineLove.me** và đề xuất các hành động cụ thể để nâng cấp giao diện, hiệu ứng visual và tính năng của **LoveStory** đạt độ tương đồng 100% và vượt trội hơn.

---

## 1. 🔍 Phân Tích Kỹ Thuật Giao Diện CineLove.me (Qua DevTools)

Qua việc quét và phân tích CSS thô của CineLove, chúng ta phát hiện ra những bí quyết kỹ thuật tạo nên trải nghiệm mượt mà của họ:

### A. Hiệu ứng Hover Scroll Card trong Template Gallery:
CineLove làm cho các card template cực kỳ sống động nhờ hiệu ứng cuộn ảnh tự động khi di chuột vào:
```css
.invitation.jsx-2086975127:hover .elImage.jsx-2086975127 .el-image__inner.jsx-2086975127 {
  transition: transform var(--scroll-duration) ease 0s;
  transform: translateY(calc(var(--image-scroll-height) * -1));
}
```
* **Bí quyết**: Mỗi mẫu thiệp được lưu dưới dạng một ảnh JPG rất dài chụp toàn bộ chiều dọc thiệp (Mockup). Khi hover, ảnh này sẽ tịnh tiến trục Y đi lên bằng chính chiều cao của ảnh trừ đi chiều cao của card hiển thị (`--image-scroll-height`).

### B. Badge Glassmorphism (Phù hiệu kính mờ):
Phù hiệu "HOT", "NEW", "PREMIUM" của họ sử dụng hiệu ứng phủ kính thời thượng:
```css
.badge.jsx-2086975127 {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}
.invitation.jsx-2086975127:hover .badge.jsx-2086975127 {
  opacity: 0;
  transform: scale(0.8) translateY(-40px);
}
```
* **Bí quyết**: Khi hover vào card, các badge này tự động mờ dần và bay nhẹ lên phía trên để nhường không gian cho ảnh thiệp cuộn bên dưới, tạo cảm giác vô cùng hiện đại.

### C. Accordion FAQ mượt mà:
Trang câu hỏi thường gặp của họ không giật cục mà mở ra rất mượt nhờ kết hợp:
```css
.faq-answer.jsx-262734203 {
  overflow: hidden;
  max-height: 0;
  visibility: collapse;
  transition: all 250ms cubic-bezier(0.32, 0.94, 0.6, 1);
  will-change: max-height, visibility;
}
.faq-answer-open.jsx-262734203 {
  max-height: 24rem;
  visibility: visible;
}
```

---

## 2. 🎯 Cần Làm Gì Để LoveStory Giống CineLove 100% (Visual & Widget)?

Để đạt chất lượng hoàn thiện tuyệt đối như đối thủ, chúng ta cần triển khai các hành động sau vào codebase:

### 🚀 Hành động 1: Áp dụng CSS Hover Scroll vào `TemplateCard` của LoveStory
* **Mục tiêu**: Khi user rê chuột vào card template trong Gallery, ảnh chụp thiệp phải tự động cuộn dọc từ đầu đến cuối một cách êm ái.
* **Cách làm**:
  * Cập nhật `apps/web/src/app/gallery/` hoặc component `TemplateCard` để áp dụng CSS Variables `--scroll-duration` (ví dụ: `4s`) và tính toán chiều cao ảnh dài.
  * Cấu hình CSS transition cho phần ảnh `img` để tịnh tiến Y khi rê chuột vào.

### 🚀 Hành động 2: Nâng cấp con dấu sáp (Wax Seal) của Phong bì cưới
* **Mục tiêu**: CineLove mô phỏng con dấu sáp ở nắp phong bì xoay nhẹ 3D và nắp phong bì lật lên trên khi bấm "Mở thiệp".
* **Cách làm**:
  * Trong `apps/web/src/app/i/[slug]/page.tsx` và `CanvasInvitation.tsx`, chúng ta cần làm nắp phong bì lật bằng CSS 3D:
    ```css
    .envelope-lid {
      transform-origin: top;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .envelope-open .envelope-lid {
      transform: rotateX(180deg);
      z-index: 0;
    }
    ```
  * Tinh chỉnh con dấu sáp (Wax seal icon) có bóng đổ mềm mại, khi hover chuột nhẹ sẽ xoay `-5deg` đến `5deg`.

### 🚀 Hành động 3: Đồng bộ hệ thống chỉ đường (Maps Widget)
* **Mục tiêu**: CineLove tích hợp các nút chỉ đường bo góc tròn 30px, phủ gradient sang trọng.
* **Cách làm**:
  * Tối ưu hóa component `MapWidget` trong `InvitationPageClient.tsx` sử dụng layout có 3 nút riêng biệt: **Google Maps**, **Apple Maps** (cho khách dùng iPhone) và **Zalo Maps** (hoặc nút chia sẻ nhanh đường đi).

---

## 📅 Kế Hoạch Triển Khai Parity Visual

### Bước 1: CSS Gallery Polish (Hôm nay)
* Cập nhật CSS cho các gallery card trong trang `/templates` và `/gallery`.
* Áp dụng hiệu ứng Badge ẩn mượt mà và ảnh cuộn tự động.

### Bước 2: Tinh chỉnh 3D Envelope Lid & Wax Seal (Ngày mai)
* Cập nhật hiệu ứng mở thiệp 3D trong `CanvasInvitation.tsx`.
* Trình phát nhạc tự động chạy đồng bộ ngay khi bấm mở.

### Bước 3: Tối ưu Maps Widget (Ngày kia)
* Thiết kế lại giao diện MapWidget của thiệp.

---

Bạn hãy xem qua kế hoạch phân tích kỹ thuật này. Nếu bạn phê duyệt, tôi sẽ tạo file `task.md` mới để bắt tay vào thực hiện nâng cấp hiệu ứng **Hover Scroll Gallery** và **3D Envelope Lid** ngay lập tức!
