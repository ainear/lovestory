# 🔍 Báo Cáo Kiểm Tra Tiến Độ Dự Án & Sự Cố Supabase Keep-Alive

> **Thời gian thực hiện:** 22/08/2026  
> **Người thực hiện:** Antigravity (DevOps & Database Specialist)  
> **Trạng thái tổng thể:** 🟡 **CẦN RESUME SUPABASE TRÊN DASHBOARD & CẬP NHẬT GITHUB SECRETS**  

---

## 📌 1. Tiến Độ & Ngữ Cảnh Dự Án (Project Status)
- **Tên dự án:** LoveStory (7app.online) — Nền tảng SaaS tạo thiệp cưới online tương tác & AI Video Cưới Cinematic.
- **Tiến độ kỹ thuật:**
  - **Sprint 52 hoàn thành 100%:** 20 bespoke template layouts độc lập, 75 assets đồng bộ Cloudflare R2 (`akala`), SePay VietQR webhook tự động kích hoạt gói dịch vụ, bộ test suite 43 Vitest + 21 Playwright.
  - Dự án đang ở giai đoạn chuẩn bị phát hành (Phase 3 ➔ Phase 4).

---

## 🚨 2. Kết Quả Kiểm Tra Thực Tế Supabase Keep-Alive (Evidence-Based Audit)

### A. Hiện tượng phát hiện:
Khi thực hiện truy vấn tới endpoint Supabase:
- `host cgymgtnmuuhxzbjecekp.supabase.co` ➔ **`NXDOMAIN` (Host not found)**.
- `curl https://cgymgtnmuuhxzbjecekp.supabase.co/rest/v1/` ➔ **`curl: (6) Could not resolve host`**.

### B. Phân tích nguyên nhân gốc rễ (Root Cause Analysis):
1. **Supabase Free Tier Rule:** Supabase tự động **Pause (Tạm dừng)** dự án nếu không có bất kỳ request/truy vấn nào trong **7 ngày liên tục**. Khi paused, Supabase gỡ bản ghi DNS công khai (`NXDOMAIN`).
2. **Lỗi ngầm trong GitHub Actions Keep-Alive:**
   - File workflow `.github/workflows/supabase-keepalive.yml` được cấu hình ping định kỳ.
   - **GitHub Secrets trên Repo (`ainear/lovestory`) được tạo ngày 08/03/2026**, lưu trữ URL của project cũ (`ujawiwotekelzgbxiauz`). Khi dự án chuyển sang project mới `cgymgtnmuuhxzbjecekp`, secrets trên GitHub chưa từng được cập nhật.
   - Các bước ping trong workflow sử dụng `continue-on-error: true`, khiến mọi lần ping đều thất bại (Exit code 6) nhưng GitHub Actions vẫn báo tick xanh (False Success).
   - Từ ngày **01/08/2026**, GitHub Actions đã dừng chạy cron theo chính sách tạm dừng workflow sau thời gian repository không có commit mới.
   - ➔ **0 request nào đến được project mới `cgymgtnmuuhxzbjecekp` trong hơn 7 ngày**, dẫn đến việc Supabase tạm dừng project.

---

## 🔑 3. Kiểm Tra GitHub Token & Môi Trường

1. **Biến môi trường `.env.local`:**
   - Không chứa `GITHUB_TOKEN` trực tiếp.
   - Chứa đầy đủ các token nghiệp vụ: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `SEPAY_*`, `GEMINI_API_KEY`, `RESEND_API_KEY`, v.v.
2. **GitHub CLI (`gh`):**
   - Đã xác thực thành công qua tài khoản `jokerlin135` với đầy đủ quyền quản trị repo `ainear/lovestory` (scopes: `repo`, `workflow`, `admin:repo_hook`, `secrets`).

---

## 🛠️ 4. Hành Động Cần Thực Hiện

1. **Bước 1 (Đại Ka thực hiện trên trình duyệt):**
   - Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard/project/cgymgtnmuuhxzbjecekp) và bấm **"Resume Project"** / **"Restore Project"** để kích hoạt lại Database.
2. **Bước 2 (Antigravity tự động hóa):**
   - Cập nhật chính xác `SUPABASE_URL` và `SUPABASE_ANON_KEY` mới nhất từ `.env.local` lên GitHub Secrets thông qua `gh secret set`.
   - Cập nhật file `.github/workflows/supabase-keepalive.yml`:
     - Bỏ `continue-on-error: true` để cảnh báo đúng khi có lỗi.
     - Truy vấn bảng thực tế (`/rest/v1/projects?limit=1`).
     - Trigger workflow kiểm thử trực tiếp (`gh workflow run`).
