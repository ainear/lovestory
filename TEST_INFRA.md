# E2E Test Infra: Autonomous Multi-Agent SDLC System (auto_sdlc)

## Test Philosophy
- Kiểm thử hộp đen (opaque-box), hướng yêu cầu. Kiểm tra hoạt động của toàn bộ hệ thống từ CLI `run_sdlc.py`.
- Tách biệt kiểm thử logic nội bộ với kiểm thử tích hợp toàn bộ hệ thống.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Setup Env & Dependencies | Khởi tạo venv tại dự án đích | ✓ | ✓ | |
| 2 | Planner Agent | Tạo file `project_plan.md` | ✓ | ✓ | |
| 3 | Coder Agent | Sinh mã nguồn đầy đủ từ plan | ✓ | ✓ | |
| 4 | Tester Agent | Sinh unit test và chạy `pytest` | ✓ | ✓ | |
| 5 | Fixer Agent | Tự động sửa lỗi khi test fail | ✓ | ✓ | |
| 6 | Central Orchestrator & CLI | Chạy trơn tru và hiển thị logs màu | ✓ | ✓ | ✓ |

## Test Architecture
- Thư mục kiểm thử: `/Users/mini4/teamwork_projects/auto_sdlc/tests/`
- Tệp kiểm thử E2E: `test_e2e_sdlc.py`
- Bộ chạy test: `pytest`
- Cơ chế kiểm thử:
  1. Tạo thư mục tạm thời để chạy thử nghiệm.
  2. Gọi `python run_sdlc.py --prompt "Xây dựng ứng dụng Máy tính CLI hỗ trợ cộng, trừ, nhân, chia"` bằng subprocess.
  3. Kiểm tra xem file `project_plan.md` có được tạo không.
  4. Kiểm tra xem các file code của Máy tính CLI có được tạo không.
  5. Kiểm tra xem file `test_report.log` có được tạo không và kết quả unit tests có đạt không.
  6. Kiểm tra xem luồng log trên terminal có hiển thị rõ thought process của Planner, Coder, Tester, Fixer không.
  7. Kiểm tra cơ chế tự động sửa lỗi bằng cách cố ý chèn lỗi logic/cú pháp và xem Fixer Agent có tự sửa thành công sau tối đa 3 lượt lặp không.

## Coverage Thresholds
- Tier 1: ≥5 test cases bao gồm các luồng chạy thành công bình thường.
- Tier 2: ≥5 test cases bao gồm các biên lỗi (như prompt rỗng, prompt không hợp lệ, chèn lỗi cú pháp cố ý để kích hoạt Fixer, lỗi thiếu API Key).
- Tier 3: Kiểm thử tích hợp sự phối hợp Hub-and-Spoke giữa các agent dưới các tải giả lập hoặc input phức tạp.
- Tier 4: Kịch bản kiểm thử ứng dụng thực tế từ đầu đến cuối thành công.
