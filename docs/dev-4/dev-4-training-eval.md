# Dev 4 — 🎓 Đào tạo + Đánh giá + Nghiệp vụ HR

> **Prerequisites**: Read `conventions.md` first for shared patterns and architecture.

**Theme**: Operational HR features + training lifecycle + DB infrastructure

---

## Owned Tables (6)

| Table | Size | Notes |
|-------|------|-------|
| `employee_evaluations` | M(2) | Reward/discipline with file attachments |
| `employee_terminations` | M(2) | Termination workflow with approval |
| `training_courses` | L(3) | Full CRUD + status workflow (draft → open → in_progress → completed → closed) |
| `training_course_types` | S(1) | Config catalog for training types |
| `training_registrations` | M(2) | Registration + approval workflow |
| `training_results` | M(2) | Result entry + pass/fail |
| | **Total: 15** (includes 3 pts for DB setup + self-service) | |

---

## Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `evaluations/` | CRUD `/api/employees/:id/evaluations` |
| `terminations/` | `POST /api/employees/:id/terminate`, `GET /api/employees/:id/termination` |
| `training-courses/` | CRUD `/api/training-courses`, `POST /api/training-courses/:id/open`, `/close`, etc. |
| `config/training-types/` | CRUD `/api/config/training-types` |
| `training-registrations/` | CRUD `/api/training-courses/:id/registrations` |
| `training-results/` | CRUD `/api/training-courses/:id/results` |
| `my/training/` | `GET /api/my/training` (self-service: own courses, register) |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `_authenticated/employees_/$employeeId/evaluations.tsx` | Employee evaluations tab |
| `_authenticated/training/index.tsx` | Training course list |
| `_authenticated/training/$courseId.tsx` | Training course detail + registrations + results |
| `_authenticated/config/training-types.tsx` | Training type config |
| `_authenticated/my/training.tsx` | Self-service: training courses + registration |

---

## Use Cases Covered (from `system-spec.md`)

| UC | Tên UC | Mô tả |
|----|--------|-------|
| 4.27 | Đánh dấu thôi việc nhân sự | Đánh dấu nhân sự thôi việc + tự động khóa tài khoản liên quan |
| 4.29 | Ghi nhận đánh giá cho nhân sự | Ghi nhận khen thưởng/kỷ luật kèm file đính kèm |
| 4.33 | Mở khóa đào tạo cho cán bộ giảng viên | Tạo khóa đào tạo (thời gian, địa điểm, chứng chỉ) |
| 4.34 | Sửa thông tin khóa đào tạo đã mở | Sửa khóa đào tạo tùy trạng thái (chưa/đang diễn ra) |
| 4.35 | Xem chi tiết thông tin khóa đào tạo | Xem thông tin khóa đào tạo + danh sách đăng ký |
| 4.36 | Ghi nhận kết quả đào tạo | Nhập kết quả + lưu chứng chỉ vào hồ sơ nhân sự |
| 4.40 | Đăng ký tham gia khóa đào tạo | Self-service: nhân sự đăng ký khóa học đang mở |
| 4.41 | Xem danh sách khóa đào tạo đã đăng ký | Self-service: nhân sự xem lịch sử đào tạo đã đăng ký |

---

## Key Responsibilities

- **DB migration infrastructure**: Set up `drizzle-kit` workflow, seed data scripts, migration conventions
- **Training state machine**: Status transitions (draft → open_registration → in_progress → completed → closed)
- **Self-service training portal**: Employee registers for courses, views own results
- **Termination workflow**: Archive employee data, status transition
