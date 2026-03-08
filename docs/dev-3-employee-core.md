# Dev 3 — 👤 Nhân sự Core

> **Prerequisites**: Read `conventions.md` first for shared patterns and architecture.

**Theme**: Employee entity + personal sub-entity tabs + shared layout/UI components

---

## Owned Tables (6)

| Table | Size | Notes |
|-------|------|-------|
| `employees` | L(3) | Main entity — complex form with many fields, create + edit |
| `employee_family_members` | M(2) | Sub-entity tab with add/edit/delete |
| `employee_bank_accounts` | S(1) | Simple sub-entity tab |
| `employee_previous_jobs` | S(1) | Simple sub-entity tab |
| `employee_party_memberships` | M(2) | Sub-entity with date ranges, status tracking |
| `employee_allowances` | M(2) | Sub-entity linked to allowance_types (Dev 2's catalog) |
| | **Total: 16** (includes 5 pts for layout/components/view/export) | |

---

## Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `employees/` | CRUD `/api/employees`, `GET /api/employees/:id` (aggregate detail) |
| `family-members/` | CRUD `/api/employees/:id/family-members` |
| `bank-accounts/` | CRUD `/api/employees/:id/bank-accounts` |
| `previous-jobs/` | CRUD `/api/employees/:id/previous-jobs` |
| `party-memberships/` | CRUD `/api/employees/:id/party-memberships` |
| `allowances/` | CRUD `/api/employees/:id/allowances` |
| `employees-export/` | `GET /api/employees/:id/export`, `GET /api/employees/export` (list export) |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `_authenticated/employees_/$employeeId.tsx` | Employee detail **layout container** (tab navigation) |
| `_authenticated/employees_/$employeeId/index.tsx` | Personal info tab (default) |
| `_authenticated/employees_/$employeeId/family.tsx` | Family members tab |
| `_authenticated/employees_/$employeeId/bank-accounts.tsx` | Bank accounts tab |
| `_authenticated/employees_/$employeeId/work-history.tsx` | Previous jobs tab |
| `_authenticated/employees_/$employeeId/party.tsx` | Party memberships tab |
| `_authenticated/employees_/$employeeId/allowances.tsx` | Allowances tab |
| `_authenticated/employees/new.tsx` | Create new employee |
| `_authenticated/my/profile.tsx` | Self-service: view/edit own profile |

---

## Use Cases Covered (from `system-spec.md`)

| UC | Tên UC | Mô tả |
|----|--------|-------|
| 4.23 | Tìm kiếm hồ sơ nhân sự | Tìm kiếm nhân sự theo từ khóa (mã, họ tên, email) |
| 4.24 | Lọc danh sách hồ sơ nhân sự | Lọc đa tiêu chí (đơn vị, trạng thái, trình độ, v.v.) |
| 4.25 | Thêm mới hồ sơ nhân sự | Tạo hồ sơ nhân sự mới (nhập tay hoặc upload Excel) |
| 4.26 | Chỉnh sửa chi tiết hồ sơ nhân sự | Sửa thông tin cá nhân, trình độ, quá trình công tác |
| 4.28 | Xem chi tiết thông tin hồ sơ nhân sự | Xem chi tiết theo chế độ tab + in/xuất Excel hồ sơ |
| 4.38 | Xem thông tin hồ sơ cá nhân | Self-service: nhân sự xem hồ sơ của chính mình |

> **Note**: UC 4.26 bao gồm nhiều tab con — Dev 3 owns các tab: thông tin cá nhân, gia đình, ngân hàng, quá trình công tác, đảng/đoàn, phụ cấp. Các tab khác (bằng cấp, chứng chỉ, hợp đồng, đánh giá) thuộc Dev 1 và Dev 4.

---

## Key Responsibilities

- **Employee detail layout**: Tab-based container layout — **all devs add their tabs into this layout**
- **Shared UI components**: Table component, form components, modal pattern, tab pattern
- **Employee view/print/export**: PDF/print view of employee record
- **Reusable sub-entity CRUD pattern**: Template for tab-level CRUD (used by Dev 1 and Dev 4)
