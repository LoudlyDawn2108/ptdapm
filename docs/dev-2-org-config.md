# Dev 2 — 🏢 Tổ chức + Cấu hình + Thống kê

> **Prerequisites**: Read `conventions.md` first for shared patterns and architecture.

**Theme**: Organization tree + configuration catalogs + read-heavy pages

---

## ⚡ CRITICAL PATH

Dev 2 must deliver **Org Unit API** and **Config Catalog APIs** in Phase 1 — other devs depend on these for dropdown data (org unit picker, salary grade picker, contract type picker, etc.)

---

## Owned Tables (7)

| Table | Size | Notes |
|-------|------|-------|
| `org_units` | L(3) | Tree structure (parent_id), CRUD + merge/dissolve workflow |
| `org_unit_status_events` | M(2) | Event log for org unit state changes |
| `employee_assignments` | M(2) | Assignment/dismissal to org positions |
| `salary_grades` | S(1) | Config catalog: bậc lương |
| `salary_grade_steps` | S(1) | Config catalog: hệ số lương |
| `allowance_types` | S(1) | Config catalog: loại phụ cấp |
| `contract_types` | S(1) | Config catalog: loại hợp đồng |
| | **Total: 15** (includes 4 pts for dashboard/statistics) | |

---

## Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `org-units/` | CRUD `/api/org-units`, `POST /api/org-units/:id/merge`, `POST /api/org-units/:id/dissolve` |
| `assignments/` | CRUD `/api/employees/:id/assignments` |
| `config/salary-grades/` | CRUD `/api/config/salary-grades`, `/api/config/salary-grades/:id/steps` |
| `config/allowance-types/` | CRUD `/api/config/allowance-types` |
| `config/contract-types/` | CRUD `/api/config/contract-types` |
| `dashboard/` | `GET /api/dashboard/statistics` (aggregation queries) |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `_authenticated/org-units/index.tsx` | Org unit tree view + CRUD |
| `_authenticated/config/salary-grades.tsx` | Salary grade config |
| `_authenticated/config/allowance-types.tsx` | Allowance type config |
| `_authenticated/config/contract-types.tsx` | Contract type config |
| `_authenticated/employees/index.tsx` | Employee list page (**list only**, detail is Dev 3) |
| `_authenticated/employees_/$employeeId/assignments.tsx` | Employee assignment tab |
| `_authenticated/dashboard/index.tsx` | Dashboard with statistics |
| `_authenticated/my/org.tsx` | Self-service: view own org info |

---

## Use Cases Covered (from `system-spec.md`)

| UC | Tên UC | Mô tả |
|----|--------|-------|
| 4.9 | Tạo mới đơn vị tổ chức nhân sự | Thêm đơn vị con trong cây tổ chức, xác nhận đơn vị nút |
| 4.10 | Sửa thông tin đơn vị tổ chức nhân sự | Cập nhật tên, loại, thông tin liên hệ (mã đơn vị không được sửa) |
| 4.11 | Cập nhật trạng thái đơn vị tổ chức | Giải thể/sáp nhập đơn vị + điều chuyển nhân sự liên quan |
| 4.12 | Thêm mới danh mục hệ số lương | Tạo hệ số lương mới |
| 4.13 | Sửa danh mục hệ số lương | Sửa thông tin hệ số lương (chỉ khi mới tạo) |
| 4.14 | Xóa danh mục hệ số lương | Xóa hệ số lương chưa được sử dụng |
| 4.15 | Ngừng sử dụng danh mục hệ số lương | Đưa hệ số lương đã kích hoạt vào trạng thái ngừng sử dụng |
| 4.16 | Thêm mới danh mục loại phụ cấp | Tạo loại phụ cấp mới |
| 4.17 | Sửa danh mục loại phụ cấp | Sửa thông tin loại phụ cấp |
| 4.18 | Ngừng sử dụng danh mục loại phụ cấp | Ngừng sử dụng loại phụ cấp |
| 4.19 | Thêm mới danh mục loại hợp đồng | Tạo loại hợp đồng mới |
| 4.20 | Sửa danh mục loại hợp đồng | Sửa thông tin loại hợp đồng |
| 4.21 | Ngừng sử dụng danh mục loại hợp đồng | Ngừng sử dụng loại hợp đồng |
| 4.30 | Bổ nhiệm nhân sự cho đơn vị tổ chức | Gán nhân sự vào đơn vị kèm quyết định |
| 4.31 | Bãi nhiệm nhân sự khỏi đơn vị tổ chức | Gỡ nhân sự khỏi đơn vị |
| 4.32 | Xem chi tiết thông tin đơn vị tổ chức | Xem thông tin đơn vị + danh sách nhân sự thuộc đơn vị |
| 4.37 | Xem chi tiết các thống kê | Dashboard thống kê nhân sự (tổng quan, biến động, cơ cấu) |
| 4.39 | Xem thông tin chi tiết đơn vị đang công tác | Self-service: nhân sự xem đơn vị mình đang làm việc |

---

## Key Responsibilities

- **Org unit tree UI**: Render hierarchical tree + drag-and-drop or manual move
- **Config catalog pattern**: Reusable CRUD pattern for all config tables (template for other devs)
- **Statistics dashboard**: Aggregation queries, chart components
- **Shared dropdown data APIs**: `/api/org-units/dropdown`, `/api/config/*/dropdown` (used by all)
