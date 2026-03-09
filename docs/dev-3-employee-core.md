# Dev 3 — 👤 Nhân sự Core

> **Lưu ý trước khi đọc**: Đọc file `conventions.md` trước để nắm được các quy ước chung và kiến trúc.

**Chủ đề**: Thực thể Nhân sự (Employee) + các tab chứa thực thể phụ cá nhân + bố cục/dùng chung (UI components)

---

## Các bảng đảm nhiệm (6)

| Bảng | Kích thước | Ghi chú |
|-------|------|-------|
| `employees` | Lớn (3) | Thực thể chính — form phức tạp với nhiều trường, thêm mới + chỉnh sửa |
| `employee_family_members` | Vừa (2) | Tab thực thể phụ với thêm/sửa/xóa (Gia đình) |
| `employee_bank_accounts` | Nhỏ (1) | Tab thực thể phụ đơn giản (Tài khoản ngân hàng) |
| `employee_previous_jobs` | Nhỏ (1) | Tab thực thể phụ đơn giản (Quá trình công tác) |
| `employee_party_memberships` | Vừa (2) | Thực thể phụ có khoảng thời gian, theo dõi trạng thái (Đảng/Đoàn) |
| `employee_allowances` | Vừa (2) | Thực thể phụ liên kết với allowance_types (Danh mục của Dev 2) (Phụ cấp) |
| | **Tổng: 16 điểm** (bao gồm 5 điểm cho layout/components/xem/xuất file) | |

---

## Các Route đảm nhiệm

**Backend** (`apps/backend/src/modules/`):

| Thư mục module | Endpoints |
|------------|-----------|
| `employees/` | CRUD `/api/employees`, `GET /api/employees/:id` (chi tiết tổng hợp) |
| `family-members/` | CRUD `/api/employees/:id/family-members` |
| `bank-accounts/` | CRUD `/api/employees/:id/bank-accounts` |
| `previous-jobs/` | CRUD `/api/employees/:id/previous-jobs` |
| `party-memberships/` | CRUD `/api/employees/:id/party-memberships` |
| `allowances/` | CRUD `/api/employees/:id/allowances` |
| `employees-export/` | `GET /api/employees/:id/export`, `GET /api/employees/export` (xuất file danh sách) |

**Frontend** (`apps/frontend/src/routes/`):

| File/thư mục route | Mô tả |
|---------------------|-------------|
| `_authenticated/employees_/$employeeId.tsx` | **Layout chứa** chi tiết nhân viên (điều hướng bằng tab) |
| `_authenticated/employees_/$employeeId/index.tsx` | Tab thông tin cá nhân (mặc định) |
| `_authenticated/employees_/$employeeId/family.tsx` | Tab thành viên gia đình |
| `_authenticated/employees_/$employeeId/bank-accounts.tsx` | Tab tài khoản ngân hàng |
| `_authenticated/employees_/$employeeId/work-history.tsx` | Tab quá trình công tác |
| `_authenticated/employees_/$employeeId/party.tsx` | Tab thông tin Đảng/Đoàn |
| `_authenticated/employees_/$employeeId/allowances.tsx` | Tab phụ cấp |
| `_authenticated/employees/new.tsx` | Tạo nhân viên mới |
| `_authenticated/my/profile.tsx` | Tự phục vụ: xem/sửa hồ sơ của chính mình |

---

## Các Use Case phụ trách (từ `system-spec.md`)

| UC | Tên UC | Mô tả |
|----|--------|-------|
| 4.23 | Tìm kiếm hồ sơ nhân sự | Tìm kiếm nhân sự theo từ khóa (mã, họ tên, email) |
| 4.24 | Lọc danh sách hồ sơ nhân sự | Lọc đa tiêu chí (đơn vị, trạng thái, trình độ, v.v.) |
| 4.25 | Thêm mới hồ sơ nhân sự | Tạo hồ sơ nhân sự mới (nhập tay hoặc upload Excel) |
| 4.26 | Chỉnh sửa chi tiết hồ sơ nhân sự | Sửa thông tin cá nhân, trình độ, quá trình công tác |
| 4.28 | Xem chi tiết thông tin hồ sơ nhân sự | Xem chi tiết theo chế độ tab + in/xuất Excel hồ sơ |
| 4.38 | Xem thông tin hồ sơ cá nhân | Tự phục vụ: nhân sự xem hồ sơ của chính mình |

> **Ghi chú**: UC 4.26 bao gồm nhiều tab con — Dev 3 phụ trách các tab: thông tin cá nhân, gia đình, ngân hàng, quá trình công tác, đảng/đoàn, phụ cấp. Các tab khác (bằng cấp, chứng chỉ, hợp đồng, đánh giá) thuộc Dev 1 và Dev 4.

---

## Các Trách nhiệm Chính

- **Layout chi tiết nhân sự**: Layout dùng chế độ tab — **tất cả các dev khác sẽ thêm tab của họ vào layout này**
- **UI Components dùng chung**: Component bảng (Table), form components, mẫu modal, mẫu tab
- **Xem/In/Xuất nhân viên**: Xem dưới dạng PDF/bản in của hồ sơ nhân viên
- **Mẫu CRUD dùng lại cho các thực thể phụ**: Mẫu chuẩn cho các thao tác CRUD ở cấp độ tab (để Dev 1 và Dev 4 có thể dùng lại)
