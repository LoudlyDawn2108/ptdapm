# Dev 1 — 🔐 Auth + Hợp đồng + Bằng cấp/Chứng chỉ

> **Prerequisites**: Read `conventions.md` first for shared patterns and architecture.

**Theme**: Auth/Admin infrastructure + file upload system + document-heavy employee tabs

---

## Owned Tables (12)

| Table | Size | Notes |
|-------|------|-------|
| `auth_users` (user table) | M(2) | better-auth user entity with custom fields (role, status) |
| `auth_roles` | S(1) | Static role catalog |
| `session` | S(1) | better-auth managed — session CRUD |
| `account` | S(1) | better-auth managed — OAuth/credential accounts |
| `verification` | S(1) | better-auth managed — email verification |
| `audit_logs` | M(2) | Log listing + filtering + export |
| `files` | M(2) | File upload/download infrastructure — **shared by all devs** |
| `employment_contracts` | L(3) | Contract CRUD + status transitions + file attachments |
| `contract_appendices` | S(1) | Sub-entity of contracts |
| `employee_degrees` | S(1) | Employee tab: bằng cấp |
| `employee_certifications` | S(1) | Employee tab: chứng chỉ |
| `employee_foreign_work_permits` | S(1) | Employee tab: GPLĐNN |
| | **Total: 16** | |

---

## Owned Routes

**Backend** (`apps/backend/src/modules/`):

| Module folder | Endpoints |
|------------|-----------|
| `auth/` | `POST /auth/login`, `POST /auth/logout`, `GET /auth/session` |
| `accounts/` | CRUD `/api/accounts` (user management by ADMIN) |
| `audit-logs/` | `GET /api/audit-logs` (list, filter, export) |
| `files/` | `POST /api/files/upload`, `GET /api/files/:id` |
| `contracts/` | CRUD `/api/employees/:id/contracts`, `/api/employees/:id/contracts/:cid/appendices` |
| `degrees/` | CRUD `/api/employees/:id/degrees` |
| `certifications/` | CRUD `/api/employees/:id/certifications` |
| `foreign-permits/` | CRUD `/api/employees/:id/foreign-permits` |

**Frontend** (`apps/frontend/src/routes/`):

| Route file / folder | Description |
|---------------------|-------------|
| `login.tsx` | Login page |
| `_authenticated/accounts/index.tsx` | Account management |
| `_authenticated/audit-log/index.tsx` | Audit log viewer |
| `_authenticated/employees_/$employeeId/contracts.tsx` | Employee contract tab |
| `_authenticated/employees_/$employeeId/degrees.tsx` | Employee degrees tab |
| `_authenticated/employees_/$employeeId/certifications.tsx` | Employee certifications tab |
| `_authenticated/employees_/$employeeId/foreign-permits.tsx` | Employee foreign permits tab |

---

## Use Cases Covered (from `system-spec.md`)

| UC | Tên UC | Mô tả |
|----|--------|-------|
| 4.1 | Đăng nhập | Xác thực và truy cập hệ thống |
| 4.2 | Đăng xuất | Thoát phiên làm việc (bao gồm auto-logout 30 phút) |
| 4.3 | Đổi mật khẩu | Đổi mật khẩu tài khoản đang đăng nhập |
| 4.4 | Tìm kiếm tài khoản người dùng | Admin tìm kiếm tài khoản theo từ khóa + filter vai trò/trạng thái |
| 4.5 | Thêm mới tài khoản người dùng | Admin tạo tài khoản, hệ thống tự động tạo mật khẩu + gửi email |
| 4.6 | Sửa thông tin tài khoản người dùng | Admin cập nhật email, vai trò tài khoản |
| 4.7 | Phân quyền tài khoản người dùng | Admin gán vai trò (ADMIN, TCCB, TCKT, EMPLOYEE) |
| 4.8 | Thay đổi trạng thái tài khoản | Admin khóa/mở khóa tài khoản + tự động khóa khi nhân sự thôi việc |
| 4.22 | Thêm mới hợp đồng lao động | Tạo hợp đồng cho nhân sự (TCCB) |
| 4.42 | Xem nhật ký hệ thống (Audit Log) | Admin truy xuất + xuất audit log |

> **Note**: UC cho bằng cấp (degrees), chứng chỉ (certifications), GPLĐNN (foreign-permits) nằm trong UC 4.26 (Chỉnh sửa chi tiết hồ sơ nhân sự) — là các tab con trong employee detail. Dev 1 owns backend CRUD cho các tab này.

---

## Key Responsibilities

- **Auth flow end-to-end**: Login, logout, session management, auth guard middleware
- **File upload infrastructure**: Multipart upload, file storage, download — **other devs will reuse this**
- **RBAC middleware**: Route-level role checking (ADMIN, TCCB, TCKT, EMPLOYEE)
