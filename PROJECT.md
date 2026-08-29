# Project: Autonomous Multi-Agent SDLC System (auto_sdlc)

Hệ thống đa tác nhân tự trị xây dựng bằng Python sử dụng Google Antigravity SDK để tự động hóa toàn bộ vòng đời phát triển phần mềm (SDLC) cho ứng dụng mục tiêu.

## Architecture & Data Flow

Hệ thống hoạt động theo mô hình **Hub-and-Spoke** với `Central Orchestrator` đóng vai trò trung tâm điều phối, lưu trữ trạng thái và luân chuyển dữ liệu giữa các Agent chuyên biệt thông qua Google Antigravity SDK:

```
                  ┌───────────────────────┐
                  │  Central Orchestrator │ ◄─── CLI Prompt
                  └───────────┬───────────┘
                              │
         ┌────────────┬───────┼───────┬────────────┐
         ▼            ▼       ▼       ▼            ▼
   ┌───────────┐ ┌─────────┐┌─────────┐┌─────────┐ ┌───────────┐
   │  Logging  │ │ Planner ││  Coder  ││ Tester  │ │   Fixer   │
   │  Utility  │ │  Agent  ││  Agent  ││  Agent  │ │   Agent   │
   └───────────┘ └─────────┘└─────────┘└─────────┘ └───────────┘
```

1. **User input**: Người dùng chạy `python run_sdlc.py --prompt "Mô tả ứng dụng"`
2. **Setup Env**: Orchestrator tạo thư mục dự án mục tiêu và thiết lập môi trường ảo `venv` cùng các dependencies cơ bản.
3. **Planner Agent**: Nhận mô tả yêu cầu, phân tích và sinh kiến trúc tổng thể, xuất ra file `project_plan.md`.
4. **Coder Agent**: Đọc từng task trong `project_plan.md`, sinh mã nguồn tương ứng và lưu đúng cấu trúc file.
5. **Tester Agent**: Tự động viết unit test bằng `pytest` cho code vừa sinh, chạy test và ghi kết quả vào `test_report.log`.
6. **Fixer Agent**: Nếu test thất bại, Fixer sẽ đọc lỗi trong `test_report.log`, mã nguồn hiện tại để tiến hành sửa lỗi (lặp tối đa 3 lần).
7. **Logging Utility**: Stream trực tiếp suy nghĩ (`thoughts`) và log hoạt động của các agent trên terminal với màu sắc phân biệt, đồng thời ghi log ra thư mục `logs/`.

---

## Code Layout (Target Structure at /Users/mini4/teamwork_projects/auto_sdlc)

```
auto_sdlc/
├── requirements.txt            # Thư viện yêu cầu (google-antigravity, pytest, colorama)
├── run_sdlc.py                 # File chạy chính, Central Orchestrator & CLI
├── agents/
│   ├── __init__.py
│   ├── base.py                 # Base Agent chứa logic cấu hình Antigravity SDK chung
│   ├── planner.py              # Planner Agent
│   ├── coder.py                # Coder Agent
│   ├── tester.py               # Tester & Validator Agent
│   └── fixer.py                # Fixer Agent
├── utils/
│   ├── __init__.py
│   ├── logging.py              # Logging & Thought stream utility
│   └── env.py                  # Quản lý venv, dependencies cho ứng dụng mục tiêu
└── tests/                      # Bộ test E2E kiểm thử chính hệ thống auto_sdlc
    ├── __init__.py
    └── test_e2e_sdlc.py        # Test E2E tích hợp hệ thống
```

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Setup & Utils | Cài đặt cấu trúc, `requirements.txt`, `utils/logging.py`, `utils/env.py` | None | PLANNED |
| 2 | Base & Planner | `agents/base.py` và `agents/planner.py` (tạo `project_plan.md`) | M1 | PLANNED |
| 3 | Coder Agent | `agents/coder.py` (đọc tasks, sinh mã nguồn) | M2 | PLANNED |
| 4 | Tester Agent | `agents/tester.py` (sinh test pytest, chạy & ghi log) | M3 | PLANNED |
| 5 | Fixer Agent | `agents/fixer.py` (phân tích lỗi, sửa mã nguồn, vòng lặp 3 lần) | M4 | PLANNED |
| 6 | Orchestrator & CLI | `run_sdlc.py` (Tích hợp luồng Hub-and-Spoke, CLI, hiển thị log trực quan) | M5 | PLANNED |
| 7 | Verification & E2E | Viết bộ E2E tests, chạy thử ứng dụng Calculator CLI thực tế | M6 | PLANNED |

---

## Interface Contracts

### 1. Base Agent Config & Connection
Các agent đều kế thừa từ `BaseAgent` sử dụng `google.antigravity` để tương tác:
```python
class BaseAgent:
    def __init__(self, name: str, system_instructions: str):
        # Thiết lập LocalAgentConfig với system_instructions tương ứng
        # Mặc định bật capabilities=CapabilitiesConfig(enable_subagents=True)
```

### 2. Planner Agent Contract
- **Input**: `prompt: str` (Mô tả yêu cầu ứng dụng của người dùng)
- **Output**: Tạo file `project_plan.md` tại thư mục dự án mục tiêu. Định dạng của `project_plan.md` phải có dạng:
  ```markdown
  # Project Plan: <Tên ứng dụng>
  ## Tasks
  ### Task 1: <Tên task>
  - **Description**: <Mô tả chi tiết>
  - **File Path**: <Đường dẫn file cần tạo>
  - **Status**: pending
  ```

### 3. Coder Agent Contract
- **Input**: Nội dung task từ `project_plan.md` (Tên file path, mô tả)
- **Output**: Tạo file mã nguồn tương ứng tại đường dẫn quy định với code Python/HTML hoàn chỉnh.

### 4. Tester Agent Contract
- **Input**: File mã nguồn vừa được tạo, mô tả chức năng.
- **Output**: Tạo file `tests/test_<name>.py` chứa bộ unit test pytest. Chạy bộ test này và ghi kết quả (stdout, stderr, exit code) vào `test_report.log`.

### 5. Fixer Agent Contract
- **Input**: Nội dung `test_report.log`, mã nguồn hiện tại đang bị lỗi.
- **Output**: Phân tích lỗi và sửa đổi trực tiếp mã nguồn bị lỗi đó, lưu lại file sạch sẽ.
