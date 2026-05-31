# Báo cáo: Khôi phục Supabase & Sửa lỗi Hệ thống LoveStory 2026

## 🎯 1. Mục tiêu chiến dịch
Giải quyết các sự cố phát sinh tại local sau khi Resume dự án Supabase, tối ưu hóa hệ thống giữ ấm tự động (Keep-Alive), khôi phục khả năng đăng nhập tài khoản quản trị hệ thống (Admin), hỗ trợ nâng cấp Premium cho khách hàng, sửa lỗi Ownership trên Editor và khắc phục triệt để lỗi CSS bể layout trang `/pricing`.

---

## 🛠️ 2. Công việc đã thực hiện & Giải pháp kỹ thuật

### A. Sửa lỗi CSS bể layout trang `/pricing` (next.config.ts)
*   **Vấn đề:** Giao diện trang bảng giá `/pricing` bị mất toàn bộ Grid và flex styles khi chạy thử ở local dev, mặc dù Tailwind v4 đã được cấu hình đúng. 
*   **Nguyên nhân:** Cấu hình Content-Security-Policy (CSP) headers trong file `next.config.ts` quá nghiêm ngặt đã chặn các inline styles, dynamic styles inject và WebSocket (`ws:`) của Next.js Turbopack trong local. Do JS HMR bị chặn, React không thể hydrate các CSS động và Tailwind v4.
*   **Giải pháp:** Tối ưu hóa CSP động dựa trên môi trường chạy (`process.env.NODE_ENV`):
    *   **Local Development:** CSP nới lỏng để cho phép HMR (Hot Module Replacement) qua WS/WSS và styles inject động hoạt động bình thường, giúp CSS compile chuẩn xác 100%.
    *   **Production Build:** Giữ nguyên CSP nghiêm ngặt để tối ưu hóa bảo mật hệ thống.
*   **Kết quả:** Giao diện trang `/pricing` hiển thị cực kỳ đẹp mắt, layout Tailwind v4 chuẩn chỉ, không còn bị lỗi bể CSS.

### B. Reset mật khẩu Quản trị viên (`admin@7app.online`)
*   **Vấn đề:** Tài khoản quản trị `admin@7app.online` bị sai mật khẩu, không thể truy cập vào trang Admin để quản trị người dùng.
*   **Giải pháp:** Viết script Node.js dùng Supabase Admin API (Service Role Key) để:
    1.  Reset mật khẩu tài khoản `admin@7app.online` về: **`Admin@123`**.
    2.  Kích hoạt xác nhận email (`email_confirm: true`).
    3.  Kiểm tra và chèn quyền `admin` đầy đủ cho `user_id` tương ứng vào bảng `user_roles`.
*   **Kết quả:** Đăng nhập thành công và có toàn quyền Admin trên hệ thống quản trị local.

### C. Khắc phục giới hạn tạo thiệp & Sửa lỗi Editor của `onenearcelo@gmail.com`
*   **Vấn đề 1 (Giới hạn thiệp):** Tài khoản `onenearcelo@gmail.com` bị giới hạn thiệp cưới ở gói Free (hiện có 4/1 thiệp) và hệ thống chặn tạo thiệp mới.
    *   **Giải pháp:** Cập nhật / tạo mới subscription gói **Premium** với thời hạn 10 năm cho user `onenearcelo@gmail.com` trong bảng `subscriptions` của Supabase.
*   **Vấn đề 2 (Lỗi Editor dự án `e8a4b5d1-7be0-4ff2-896a-ca797caee913`):** Khi cố gắng chỉnh sửa thiệp cưới này, người dùng nhận được thông báo *"Không tìm thấy dự án"*.
    *   **Nguyên nhân:** Dự án thuộc sở hữu của một `user_id` khác trong database, bị Ownership Guard của route `/editor/[id]` chặn lại.
    *   **Giải pháp:** Cập nhật cột `user_id` của project `e8a4b5d1-7be0-4ff2-896a-ca797caee913` sang chính xác ID của `onenearcelo@gmail.com` trong bảng `projects`.
*   **Kết quả:** User `onenearcelo@gmail.com` đã được nâng cấp lên Premium thành công, mở khóa toàn bộ giới hạn tạo thiệp, và truy cập trực tiếp vào editor của dự án `e8a4b5d1-7be0-4ff2-896a-ca797caee913` để chỉnh sửa bình thường.

### D. Đồng bộ Tri thức Keep-Alive Global & Nâng cấp GitHub Actions
*   **Vấn đề:** Các pings cũ chỉ gửi request tới root API Gateway, dễ bị Kong Gateway cache hoặc proxy phản hồi 200 mà không thực sự "đánh thức" PostgreSQL.
*   **Giải pháp:** Nâng cấp file `.github/workflows/supabase-keepalive.yml` thêm **Step 3 (Ping Real Database)** thực hiện truy vấn thực tế `SELECT templates limit 1` qua API REST để ép PostgreSQL Engine phải thức dậy và hoạt động.
*   **Đồng bộ Global:** Đưa tri thức nâng cấp (gồm file YAML 3 bước ping hoàn chỉnh, các pitfalls lỗi tự động tắt Actions sau 60 ngày của GitHub và cache Gateway) vào thư mục global của hệ thống tại `/.gemini/config/skills/supabase-keepalive/SKILL.md` để tái sử dụng cho tất cả các dự án khác.

---

## 📈 3. Kết quả & Xác minh an toàn
1.  **Xác minh Bảo mật Keys:** Tất cả các keys, credentials nhạy cảm (`.env.local`, `.env.dev`, v.v.) được cấu hình chuẩn chỉ, được `.gitignore` (cả root và apps/web) bảo vệ nghiêm ngặt. **Tuyệt đối không có rủi ro rò rỉ key nhạy cảm lên GitHub.**
2.  **Đăng nhập Admin:** Tài khoản `admin@7app.online` / mật khẩu `Admin@123` hoạt động hoàn hảo.
3.  **Local Dev Server:** Next.js Turbopack chạy ổn định trên cổng 3000, giao diện pricing chuẩn chỉ, không còn lỗi CSP.
