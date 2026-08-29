# Original User Request

## Initial Request — 2026-06-01T13:39:14+07:00

Thiết lập một hệ thống đa tác nhân tự trị (Autonomous Multi-Agent SDLC System) viết bằng Python sử dụng Google Antigravity SDK. Hệ thống này có khả năng tự động thực hiện toàn bộ vòng đời phát triển phần mềm (SDLC) cho một ứng dụng mục tiêu được mô tả bằng ngôn ngữ tự nhiên: từ lập kế hoạch tối ưu, chia nhỏ module, lập trình mã nguồn, chạy kiểm thử/pre-check tự động, cho tới sửa lỗi (bug fixing) và bàn giao sản phẩm cuối cùng.

Working directory: /Users/mini4/teamwork_projects/auto_sdlc
Integrity mode: development

## Requirements

### R1. Planner Agent
- Đọc yêu cầu ứng dụng mục tiêu từ người dùng.
- Sử dụng Google Antigravity SDK để phân tích và lập kế hoạch kiến trúc.
- Tạo ra file `project_plan.md` trong thư mục dự án mục tiêu, chia nhỏ dự án thành các tác vụ (tasks/modules) cụ thể kèm theo mô tả và tiêu chí hoàn thành cho từng phần.

### R2. Coder Agent
- Lần lượt đọc từng tác vụ được liệt kê trong `project_plan.md`.
- Sử dụng Google Antigravity SDK để sinh mã nguồn Python (`.py`) hoặc HTML/CSS/JS chất lượng cao, lưu vào đúng thư mục cấu trúc của ứng dụng mục tiêu.
- Đảm bảo viết code sạch, dễ đọc và tự động hóa cao.

### R3. Tester & Validator Agent
- Tự động viết mã kiểm thử (sử dụng thư viện `pytest` cho Python hoặc tương đương).
- Thực hiện kiểm tra trước (pre-check) bao gồm quét lỗi cú pháp cơ bản và chạy bộ kiểm thử tự động.
- Ghi lại log chi tiết về kết quả kiểm thử (pass/fail) vào file `test_report.log`.

### R4. Fixer Agent
- Trong trường hợp Tester Agent phát hiện lỗi (test fail), Fixer Agent sẽ đọc file `test_report.log` và mã nguồn hiện tại.
- Tự động phân tích nguyên nhân gốc rễ và sửa đổi mã nguồn bị lỗi.
- Quy trình Lập trình -> Kiểm thử -> Sửa lỗi sẽ được lặp lại liên tục cho đến khi vượt qua toàn bộ các bài test hoặc đạt đến giới hạn số lần thử (tối đa 3 lần).

### R5. Central Orchestrator & CLI
- File thực thi chính `run_sdlc.py` để khởi động toàn bộ hệ thống đa tác nhân.
- CLI nhận đầu vào là mô tả ứng dụng mục tiêu (ví dụ: `python run_sdlc.py --prompt "Xây dựng ứng dụng Máy tính CLI hỗ trợ cộng, trừ, nhân, chia"`).
- Hiển thị luồng giao tiếp, suy nghĩ (thought process) và hành động của từng agent theo thời gian thực trên màn hình terminal.
- Đóng gói và lưu kết quả sản phẩm cuối cùng vào thư mục đầu ra.

## Acceptance Criteria

### Hệ thống Đa tác nhân (Multi-Agent System)
- [ ] Toàn bộ hệ thống được xây dựng bằng Python 3.10+ và tích hợp thư viện `google-antigravity`.
- [ ] Chạy file `run_sdlc.py` với một prompt cụ thể chạy thành công từ đầu đến cuối mà không bị lỗi crash hệ thống.
- [ ] Planner Agent tạo ra file `project_plan.md` đúng định dạng và có tính khả thi.
- [ ] Coder Agent viết code đầy đủ tính năng và lưu đúng cấu trúc file.
- [ ] Tester Agent tạo ra bộ unit test hợp lệ và thực thi thành công thông qua `pytest`.
- [ ] Fixer Agent có khả năng tự động phát hiện và sửa ít nhất một lỗi cú pháp hoặc logic đơn giản được đưa vào mã nguồn một cách cố ý để thử nghiệm.
- [ ] Log hoạt động hiển thị rõ ràng sự phân vai và phối hợp giữa các agent (Planner -> Coder -> Tester -> Fixer).
