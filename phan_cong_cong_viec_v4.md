# PHÂN CÔNG CÔNG VIỆC - DỰ ÁN HRMS TLU-HR (v4)

> **Nguyên tắc**: Mỗi người **tự thiết kế + code toàn bộ FE + BE** của phần mình.
> **Tech stack**: React 19 + TypeScript + Vite (FE) | Tự chọn BE framework | PostgreSQL
> **Thay đổi từ v3**: Sửa bottleneck skeleton, chuyển config domain cho đúng người, thêm cross-module contract, error handling, seed data, testing, environment setup.

---

## NGUYÊN TẮC CHIA

1. **Mỗi người = 1 mini-project**: Tự thiết kế UI, tự viết API, tự query DB phần mình
2. **Không ai thiết kế cho ai**: Ai làm phần nào thì người đó quyết định cách code phần đó
3. **Chỉ thống nhất 4 thứ**: Database schema (chung), API response format (chung), Auth middleware (chung), Export utilities (chung)
4. **FE hiện có**: Ai được phân trang nào thì nhận trang đó, tự sửa/refactor theo ý mình
5. **Config thuộc domain owner**: Bảng danh mục/cấu hình của domain nào → người sở hữu domain đó quản lý (không tập trung hết ở 1 người)

---

## TỔNG QUAN

```
Người 1: Quản trị hệ thống + Self-Service  → Auth + Users + System Config + Audit + File + Cổng nhân viên
Người 2: Quản lý nhân sự                   → Hồ sơ CRUD + Sub-entities + Import/Export
Người 3: Hợp đồng, Đào tạo, Đánh giá      → HĐ + Đào tạo + KT/KL + Domain Config (loại HĐ, loại ĐT, loại ĐG)
Người 4: Tổ chức, Báo cáo & Cổng TCKT      → Cơ cấu tổ chức + Dashboard + TCKT + Reports + Shared Export
```

### Thay đổi so với v3

| Thay đổi | Lý do |
|----------|-------|
| Domain config (contract_types, training_course_types, evaluation_types) chuyển từ Người 1 → **Người 3** | Người 3 sở hữu business logic HĐ/ĐT/ĐG, hiểu config domain mình nhất |
| FE config pages (ContractConfigPage, TrainingTypesPage, EvaluationConfigPage) chuyển từ Người 1 → **Người 3** | Đi kèm DB tables |
| Shared Export engine do **Người 4** tạo, Người 3 tái sử dụng cho in HĐ PDF | Tránh 2 người build export song song |
| Skeleton unblock: **4 giờ** thay vì 2 ngày | Giảm bottleneck, 3 người không bị block cả ngày |
| Thêm: Cross-module API contract, Error handling, Seed data, Testing, Environment | Thiếu trong v3 |

---

## PHẦN CHUNG — Thống nhất trước khi code (Ngày 1)

### 1. Database: Dùng chung 1 schema PostgreSQL

Tất cả cùng dùng 1 database, mỗi người **chỉ đọc/ghi bảng trong phạm vi mình**.

```
Người 1 sở hữu (11 bảng — GHI):
  auth_users, auth_roles, auth_user_roles, session, account,
  verification, salary_coefficients, allowance_types,
  audit_logs, files, campuses

Người 2 sở hữu (10 bảng — GHI):
  employees, employee_terminations, employee_family_members,
  employee_bank_accounts, employee_previous_jobs,
  employee_party_memberships, employee_degrees,
  employee_certifications, employee_foreign_work_permits,
  employee_allowances

Người 3 sở hữu (9 bảng — GHI):
  contract_types, training_course_types, evaluation_types,   ← MỚI (chuyển từ Người 1)
  employment_contracts, contract_appendices,
  training_courses, training_registrations, training_results,
  employee_evaluations

Người 4 sở hữu (3 bảng — GHI + READ ALL):
  org_units, org_unit_status_events, employee_assignments
  + READ-ONLY từ bảng người khác cho Dashboard/Reports/TCKT
```

> ⚠️ **evaluation_types** chưa có trong schema.postgres.sql hiện tại — Người 3 cần tạo migration bổ sung.

### 2. API Response Format: Thống nhất 1 lần

```typescript
// Mọi API đều trả về dạng này
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: { page: number; limit: number; total: number };
}

// Lỗi
interface ApiError {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

// Base URL: /api/v1
// Auth: Cookie-based session (better-auth)
```

### 3. Backend Skeleton: Người 1 tạo trong 4 GIỜ ĐẦU (sáng Ngày 1)

**Mục tiêu**: Push skeleton tối giản lên `dev` trước buổi trưa ngày 1 → 3 người pull và làm song song.

Người 1 tạo project backend với:
- `package.json` + `tsconfig.json`
- `src/db/connection.ts` — kết nối PostgreSQL (connection pool)
- `src/middleware/auth.ts` — kiểm tra session (người khác import)
- `src/middleware/error-handler.ts` — bắt lỗi chung, trả ApiError format
- `src/types/shared.ts` — ApiResponse, ApiError, PaginationParams
- `src/index.ts` — entry point, đăng ký route từng module
- `.env.example` — template biến môi trường
- `docker-compose.yml` — PostgreSQL + pgAdmin (dev)

**Chỉ cần chạy được**: `npm run dev` → server start + kết nối DB thành công. Chưa cần auth API xong.

**3 người còn lại trong sáng ngày 1**: Làm FE (refactor, tách components, tạo service layer) — KHÔNG cần BE.

### 4. FE Shared: Các file KHÔNG AI sửa lại

```
Giữ nguyên, ai cũng dùng:
├── src/components/ui/*           → 30+ Shadcn primitives
├── src/components/ProtectedRoute.tsx
├── src/components/AdminRoute.tsx
├── src/components/layout/AppLayout.tsx
├── src/hooks/*
├── src/lib/utils.ts
├── src/stores/auth.ts            → Người 1 quản lý
└── src/main.tsx, App.tsx, index.css
```

### 5. Shared Export Utilities (Người 4 tạo, mọi người dùng)

Người 4 tạo module export dùng chung ở `backend/src/shared/export/`:

```typescript
// backend/src/shared/export/pdf-generator.ts
export function generatePDF(template: string, data: Record<string, unknown>): Buffer

// backend/src/shared/export/excel-generator.ts
export function generateExcel(columns: Column[], rows: Row[]): Buffer

// backend/src/shared/export/word-generator.ts
export function generateWord(template: string, data: Record<string, unknown>): Buffer
```

- **Người 3** import để in hợp đồng PDF
- **Người 4** dùng cho export báo cáo, export lương TCKT
- **Người 2** dùng cho export hồ sơ nhân sự

**Thư viện đề xuất**: `pdfkit` (PDF), `exceljs` (Excel), `docx` (Word) — thống nhất 1 lần.

---

## CROSS-MODULE API CONTRACT — Thống nhất Ngày 1

> Danh sách endpoint mà **module khác sẽ gọi**. Chỉ cần thống nhất tên + request/response, chưa cần implement.

### Người 2 cung cấp cho module khác gọi:

| Endpoint | Ai gọi | Mô tả |
|----------|--------|-------|
| `GET /api/v1/personnel` | Người 4 (Dashboard, Reports, TCKT) | Danh sách nhân sự (filter, pagination) |
| `GET /api/v1/personnel/:id` | Người 1 (Self-Service), Người 3 (lookup tên) | Chi tiết 1 nhân sự |
| `GET /api/v1/personnel/stats` | Người 4 (Dashboard) | Thống kê tổng quan (tổng, theo giới tính, tuổi...) |

### Người 3 cung cấp:

| Endpoint | Ai gọi | Mô tả |
|----------|--------|-------|
| `GET /api/v1/contracts?employeeId=` | Người 1 (Self-Service), Người 2 (tab HĐ) | Danh sách HĐ theo nhân sự |
| `GET /api/v1/contracts/expiring?days=30` | Người 4 (Dashboard) | HĐ sắp hết hạn |
| `GET /api/v1/contracts/stats` | Người 4 (Reports) | Thống kê HĐ |
| `GET /api/v1/training?employeeId=` | Người 1 (Self-Service) | Lịch sử đào tạo theo nhân sự |
| `GET /api/v1/training/stats` | Người 4 (Reports) | Thống kê đào tạo |
| `GET /api/v1/evaluations?employeeId=` | Người 1 (Self-Service) | KT/KL theo nhân sự |

### Người 4 cung cấp:

| Endpoint | Ai gọi | Mô tả |
|----------|--------|-------|
| `GET /api/v1/organization/tree` | Người 2 (lookup đơn vị), Người 3 (HĐ theo đơn vị) | Cây đơn vị tổ chức |
| `GET /api/v1/organization/assignments?employeeId=` | Người 2 (tab Đơn vị) | Lịch sử bổ nhiệm theo nhân sự |
| `DELETE /api/v1/organization/assignments/by-employee/:employeeId` | Người 2 (cascade thôi việc) | Rút nhân sự khỏi tất cả đơn vị |

### Người 1 cung cấp:

| Endpoint | Ai gọi | Mô tả |
|----------|--------|-------|
| `GET /api/v1/auth/me` | Tất cả (FE) | Thông tin user đang đăng nhập |
| `GET /api/v1/users/by-employee/:employeeId` | Người 2 (cascade thôi việc → khóa tài khoản) | Tìm user theo employee |
| `PATCH /api/v1/users/:id/lock` | Người 2 (cascade thôi việc) | Khóa tài khoản |
| `GET /api/v1/config/salary-coefficients` | Người 2 (gán lương) | Danh sách hệ số lương |
| `GET /api/v1/config/allowance-types` | Người 2 (gán phụ cấp) | Danh sách loại phụ cấp |
| `POST /api/v1/files/upload` | Tất cả | Upload file |
| `POST /api/v1/audit` | Tất cả (BE) | Ghi log hành động |

---

## CROSS-MODULE ERROR HANDLING

### Vấn đề: Cascade thôi việc cần gọi nhiều module

Khi Người 2 đánh dấu thôi việc:
1. UPDATE `employees.work_status = 'terminated'` ← Người 2
2. Rút khỏi đơn vị ← gọi API Người 4
3. Khóa tài khoản ← gọi API Người 1

### Giải pháp: Internal Service Call (KHÔNG dùng HTTP)

Vì tất cả module nằm trong **1 backend monolith**, dùng **direct function import** thay vì HTTP call:

```typescript
// backend/src/personnel/terminate.service.ts
import { removeAllAssignments } from '../organization/assignment.service';
import { lockUserByEmployee } from '../users/user.service';

export async function terminateEmployee(employeeId: string, reason: string, tx: Transaction) {
  // 1. Đánh dấu thôi việc (trong transaction)
  await markTerminated(employeeId, reason, tx);

  // 2. Rút khỏi đơn vị (cùng transaction)
  await removeAllAssignments(employeeId, tx);

  // 3. Khóa tài khoản (cùng transaction)
  await lockUserByEmployee(employeeId, tx);
}
```

### Quy tắc Internal Service Call

| Quy tắc | Mô tả |
|---------|-------|
| **Shared transaction** | Nếu cần atomicity → truyền `tx` (transaction object) qua function |
| **Export service function** | Mỗi module export 1 file `xxx.service.ts` chứa các function cho module khác gọi |
| **Không import router/controller** | Chỉ import service layer, không import route handler |
| **File riêng** | Mỗi module tạo `backend/src/<module>/internal.service.ts` cho cross-module calls |
| **HTTP call chỉ dùng FE→BE** | FE gọi BE qua HTTP, BE modules gọi nhau qua function import |

### Các internal service cần export (thống nhất Ngày 1)

```
Người 1 export:
  src/users/internal.service.ts     → lockUserByEmployee(employeeId, tx)
  src/audit/internal.service.ts     → createAuditLog(actor, action, entity, tx)

Người 2 export:
  src/personnel/internal.service.ts → getEmployeeById(id, tx)
                                    → getEmployeeStats(tx)

Người 3 export:
  src/contracts/internal.service.ts → getContractsByEmployee(employeeId, tx)
                                    → getExpiringContracts(days, tx)

Người 4 export:
  src/organization/internal.service.ts → removeAllAssignments(employeeId, tx)
                                       → getOrgTree(tx)
```

---

## NGƯỜI 1 — Quản trị hệ thống + Cổng Self-Service

**Tự thiết kế + code**: Auth, Quản lý User, System Config (lương, phụ cấp, danh mục), Backend skeleton, File upload, Audit, Cổng nhân viên

### Phạm vi sở hữu

```
FE (đã có, tự sửa):
├── pages/auth/LoginPage.tsx
├── pages/admin/UserListPage.tsx
├── pages/admin/UserCreatePage.tsx
├── pages/admin/UserEditPage.tsx
├── pages/admin/config/SalaryConfigPage.tsx
├── pages/admin/config/AllowanceConfigPage.tsx
├── pages/admin/config/BusinessCatalogsPage.tsx    ← danh mục dân tộc, tôn giáo...
├── components/AdminRoute.tsx
├── components/ProtectedRoute.tsx
├── components/SessionTimeoutProvider.tsx
└── stores/auth.ts

⚠️ KHÔNG còn sở hữu (chuyển sang Người 3):
  pages/admin/config/ContractConfigPage.tsx
  pages/admin/config/TrainingTypesPage.tsx
  pages/admin/config/EvaluationConfigPage.tsx

BE (tự thiết kế):
├── backend/src/auth/          → Đăng nhập, đăng xuất, đổi mật khẩu, session
├── backend/src/users/         → CRUD tài khoản, phân quyền, khóa/mở khóa
├── backend/src/config/        → CRUD hệ số lương, phụ cấp, danh mục chung
├── backend/src/middleware/    → Auth middleware, error handler, logger
├── backend/src/db/            → DB connection, migrations
├── backend/src/audit/         → Ghi + xem nhật ký hệ thống
├── backend/src/files/         → Upload/download file
└── backend/src/self-service/  → API hồ sơ cá nhân, HĐ, đào tạo (read-only + đề nghị cập nhật)

FE mới cần tạo:
├── pages/admin/AuditLogPage.tsx
└── pages/self-service/                   → Cổng nhân viên (toàn bộ MỚI)
    ├── SelfServiceLayout.tsx             → Layout + sidebar riêng
    ├── MyProfilePage.tsx                 → Xem hồ sơ cá nhân
    ├── MyContractsPage.tsx               → Xem lịch sử HĐ
    ├── MyEvaluationsPage.tsx             → Xem khen thưởng/kỷ luật
    ├── MyTrainingPage.tsx                → Xem + đăng ký khóa đào tạo
    └── UpdateRequestPage.tsx             → Gửi đề nghị cập nhật thông tin
```

### Tự làm từ A→Z

| # | Việc | Chi tiết | Ưu tiên |
|---|------|----------|---------|
| 1 | **Backend skeleton** | Cấu trúc project, DB connection, middleware, entry point, docker-compose | 🔴 P0 — Ngày 1 sáng |
| 2 | **Environment setup** | .env.example, docker-compose.yml (PostgreSQL), README hướng dẫn chạy | 🔴 P0 — Ngày 1 sáng |
| 3 | **Auth** | API login/logout/me/change-password, session (better-auth), FE kết nối | 🔴 P0 — Ngày 1-2 |
| 4 | **Quản lý User** | API CRUD user, phân quyền, khóa/mở khóa, FE kết nối | 🟠 P1 — Ngày 3-4 |
| 5 | **File upload** | API upload/download file, lưu disk/S3 | 🟠 P1 — Ngày 3-4 |
| 6 | **Cấu hình lương** | API CRUD salary_coefficients, FE SalaryConfigPage kết nối | 🟡 P2 — Tuần 2 |
| 7 | **Cấu hình phụ cấp** | API CRUD allowance_types, FE AllowanceConfigPage kết nối | 🟡 P2 — Tuần 2 |
| 8 | **Danh mục chung** | API CRUD catalogs (dân tộc, tôn giáo, quốc gia...), FE kết nối | 🟡 P2 — Tuần 2 |
| 9 | **Audit log** | API ghi log + xem/lọc log, FE AuditLogPage mới | 🟡 P2 — Tuần 2 |
| 10 | **Internal services** | Export lockUserByEmployee, createAuditLog cho module khác | 🟠 P1 — Ngày 4-5 |
| **Cổng Self-Service** | | | |
| 11 | **Layout Self-Service** | Tự thiết kế sidebar + layout cho vai trò nhân viên | 🔵 P3 — Tuần 3 |
| 12 | **Hồ sơ cá nhân** | API GET profile (gọi internal service Người 2), FE mới | 🔵 P3 — Tuần 3 |
| 13 | **Lịch sử hợp đồng** | API GET my contracts (gọi internal service Người 3), FE mới | 🔵 P3 — Tuần 3 |
| 14 | **Khen thưởng/Kỷ luật** | API GET my evaluations, FE mới | 🔵 P3 — Tuần 3 |
| 15 | **Đào tạo** | API GET my training + POST đăng ký khóa mới, FE mới | 🔵 P3 — Tuần 3 |
| 16 | **Đề nghị cập nhật** | API POST update-request, FE form mới | 🔵 P3 — Tuần 4 |
| 17 | **router.tsx** | Quản lý file route chung, merge PR người khác | Liên tục |

### DB sở hữu (11 bảng)
`auth_users`, `auth_roles`, `auth_user_roles`, `session`, `account`, `verification`, `salary_coefficients`, `allowance_types`, `audit_logs`, `files`, `campuses`

---

## NGƯỜI 2 — Quản lý nhân sự

**Tự thiết kế + code**: Hồ sơ nhân sự CRUD, Sub-entities, Lương & Phụ cấp, Thôi việc, Import/Export, Seed data

### Phạm vi sở hữu

```
FE (đã có, tự sửa):
├── pages/tccb/PersonnelListPage.tsx
├── pages/tccb/PersonnelCreatePage.tsx
├── pages/tccb/PersonnelDetailPage.tsx      ⚠️ Shell + tabs — xem ghi chú
├── pages/tccb/PersonnelEditPage.tsx
└── components/forms/wizard-steps/Step1~Step8

BE (tự thiết kế):
└── backend/src/personnel/     → CRUD hồ sơ, sub-entities, lương, thôi việc, import/export
```

### Tự làm từ A→Z

| # | Việc | Chi tiết | Ưu tiên |
|---|------|----------|---------|
| 1 | **Danh sách nhân sự** | API GET list (search, filter, pagination), FE kết nối | 🔴 P0 — Ngày 2-3 |
| 2 | **Tạo hồ sơ** | API POST (tự sinh mã nhân sự), FE wizard 8 bước kết nối | 🔴 P0 — Ngày 3-5 |
| 3 | **Chi tiết hồ sơ** | API GET detail (join tất cả sub-entities), FE kết nối | 🔴 P0 — Ngày 3-5 |
| 4 | **Sửa hồ sơ** | API PUT update, FE kết nối | 🟠 P1 — Tuần 2 |
| 5 | **Sub-entities** | API CRUD cho: gia đình, ngân hàng, bằng cấp, chứng chỉ, kinh nghiệm, đảng viên, giấy phép LĐ NN | 🟠 P1 — Tuần 2 |
| 6 | **Lương & Phụ cấp** | API CRUD salary + allowances cho từng nhân sự | 🟠 P1 — Tuần 2 |
| 7 | **Đánh dấu thôi việc** | API PATCH terminate (cascade: HĐ→đơn vị→tài khoản qua internal service) | 🟠 P1 — Tuần 2 |
| 8 | **Seed data** | Script tạo 50-100 nhân sự mẫu (cho dev + demo) | 🟠 P1 — Tuần 2 |
| 9 | **Internal services** | Export getEmployeeById, getEmployeeStats cho module khác | 🟠 P1 — Ngày 5 |
| 10 | **Import Excel** | API POST import hàng loạt (parsing, validation, xử lý lỗi từng dòng) | 🔵 P3 — Tuần 3-4 |
| 11 | **Export hồ sơ** | API GET export PDF/Excel/Word (dùng shared export engine Người 4) | 🔵 P3 — Tuần 4 |

### ⚠️ Ghi chú: PersonnelDetailPage

Người 2 sở hữu file `PersonnelDetailPage.tsx` (shell + hệ thống tabs). Các module khác **tạo component riêng**, Người 2 import vào.

```
PersonnelDetailPage.tsx (Người 2 sở hữu)
├── Tab "Thông tin chung"       → Người 2 tự code
├── Tab "Lương & Phụ cấp"      → Người 2 tự code
├── Tab "Đơn vị / Bổ nhiệm"   → import <OrgAssignmentTab /> từ Người 4
├── Tab "Hợp đồng"             → import <ContractTab /> từ Người 3
├── Tab "Đào tạo"              → import <TrainingTab /> từ Người 3
└── Tab "Khen thưởng/Kỷ luật"  → import <EvaluationTab /> từ Người 3
```

**Quy trình**: Người 3 + 4 tạo PR thêm tab component → Người 2 review + merge + import.

### Ranh giới với module Tổ chức (Người 4)

- Người 2 **chỉ ghi bảng employees** (tạo, sửa, thôi việc)
- Người 4 **chỉ ghi bảng org_units + employee_assignments** (tạo đơn vị, bổ nhiệm)
- Khi Người 2 cần hiển thị "nhân sự thuộc đơn vị nào" → READ từ bảng Người 4
- Khi Người 4 cần hiển thị "danh sách nhân sự trong đơn vị" → READ từ bảng Người 2
- **Không ai ghi bảng của người kia**
- **Cascade thôi việc**: Người 2 gọi `internal.service` của Người 4 (cùng transaction)

### DB sở hữu (10 bảng)
`employees`, `employee_terminations`, `employee_family_members`, `employee_bank_accounts`, `employee_previous_jobs`, `employee_party_memberships`, `employee_degrees`, `employee_certifications`, `employee_foreign_work_permits`, `employee_allowances`

---

## NGƯỜI 3 — Hợp đồng, Đào tạo, Đánh giá + Domain Config

**Tự thiết kế + code**: Hợp đồng lao động, Phụ lục HĐ, Khóa đào tạo, Đăng ký + Kết quả, Khen thưởng/Kỷ luật, Cấu hình domain (loại HĐ, loại ĐT, loại đánh giá)

### Phạm vi sở hữu

```
FE (đã có, tự sửa):
├── pages/tccb/ContractListPage.tsx
├── pages/tccb/ContractCreatePage.tsx
├── pages/tccb/TrainingListPage.tsx
├── pages/tccb/TrainingCreatePage.tsx
├── pages/tccb/TrainingDetailPage.tsx
├── pages/tccb/TrainingEditPage.tsx
├── pages/admin/config/ContractConfigPage.tsx      ← MỚI (chuyển từ Người 1)
├── pages/admin/config/TrainingTypesPage.tsx        ← MỚI (chuyển từ Người 1)
├── pages/admin/config/EvaluationConfigPage.tsx     ← MỚI (chuyển từ Người 1)
├── components/contracts/ContractExtensionDialog.tsx
├── components/contracts/ContractTerminationDialog.tsx
├── components/contracts/AddAppendixDialog.tsx
├── components/training/EnrollPersonnelDialog.tsx
└── components/training/UpdateProgressDialog.tsx

FE mới cần tạo (cho PersonnelDetailPage):
├── components/tabs/ContractTab.tsx      → Người 2 import vào PersonnelDetail
├── components/tabs/TrainingTab.tsx      → Người 2 import vào PersonnelDetail
└── components/tabs/EvaluationTab.tsx    → Người 2 import vào PersonnelDetail

BE (tự thiết kế):
├── backend/src/contracts/      → CRUD HĐ, gia hạn, chấm dứt, phụ lục, in HĐ
├── backend/src/training/       → CRUD khóa, mở đăng ký, đăng ký, kết quả
├── backend/src/evaluations/    → CRUD khen thưởng/kỷ luật
└── backend/src/domain-config/  → CRUD contract_types, training_course_types, evaluation_types
```

### Tự làm từ A→Z

| # | Việc | Chi tiết | Ưu tiên |
|---|------|----------|---------|
| **Domain Config** | | | |
| 1 | **Cấu hình loại HĐ** | API CRUD contract_types, FE ContractConfigPage kết nối | 🟠 P1 — Ngày 3-4 |
| 2 | **Cấu hình loại đào tạo** | API CRUD training_course_types, FE TrainingTypesPage kết nối | 🟠 P1 — Ngày 3-4 |
| 3 | **Cấu hình loại đánh giá** | API CRUD evaluation_types (cần tạo bảng mới), FE EvaluationConfigPage kết nối | 🟠 P1 — Ngày 3-4 |
| **Hợp đồng** | | | |
| 4 | **Danh sách hợp đồng** | API GET list (search, filter, join tên nhân sự), FE kết nối | 🔴 P0 — Ngày 2-3 |
| 5 | **Tạo hợp đồng** | API POST (validate nhân sự, kiểm tra HĐ hiện tại, số lần ký, thời hạn), FE kết nối | 🔴 P0 — Ngày 3-5 |
| 6 | **Gia hạn hợp đồng** | API POST extend (quy tắc chuyển đổi loại HĐ theo contract_types), FE dialog | 🟠 P1 — Tuần 2 |
| 7 | **Chấm dứt hợp đồng** | API PATCH terminate, FE dialog | 🟠 P1 — Tuần 2 |
| 8 | **Phụ lục hợp đồng** | API CRUD appendices, FE dialog | 🟠 P1 — Tuần 2 |
| 9 | **Cảnh báo HĐ hết hạn** | Logic tự động: HĐ còn ≤ renewal_grace_days (từ contract_types) | 🟡 P2 — Tuần 2-3 |
| 10 | **In hợp đồng PDF** | Dùng shared export engine (Người 4), tạo template HĐ | 🔵 P3 — Tuần 3-4 |
| 11 | **Tab HĐ PersonnelDetail** | Tạo `ContractTab.tsx` — hiển thị + thao tác HĐ theo nhân sự | 🟠 P1 — Ngày 5 |
| **Đào tạo** | | | |
| 12 | **Danh sách khóa đào tạo** | API CRUD training-courses, FE kết nối | 🔴 P0 — Ngày 3-5 |
| 13 | **Mở đăng ký** | API PATCH open-registration (check thời gian, trạng thái) | 🟠 P1 — Tuần 2 |
| 14 | **Đăng ký tham gia** | API POST register (check giới hạn, thời gian), FE dialog | 🟠 P1 — Tuần 2 |
| 15 | **Ghi nhận kết quả** | API PATCH result, FE dialog | 🟡 P2 — Tuần 2-3 |
| 16 | **Tab đào tạo PersonnelDetail** | Tạo `TrainingTab.tsx` — hiển thị lịch sử đào tạo theo nhân sự | 🟠 P1 — Ngày 5 |
| 17 | **Auto cập nhật chứng chỉ** | Khi hoàn thành khóa → INSERT vào employee_certifications (GHI bảng Người 2) | 🔵 P3 — Tuần 3 |
| **Khen thưởng/Kỷ luật** | | | |
| 18 | **CRUD đánh giá** | API CRUD employee_evaluations (khen thưởng, kỷ luật) | 🟠 P1 — Tuần 2 |
| 19 | **Tab đánh giá PersonnelDetail** | Tạo `EvaluationTab.tsx` — hiển thị + thêm KT/KL theo nhân sự | 🟠 P1 — Ngày 5 |
| 20 | **Internal services** | Export getContractsByEmployee, getExpiringContracts, etc. | 🟠 P1 — Ngày 5 |

### ⚠️ Task #17 — Ngoại lệ ghi bảng người khác

Task "Auto cập nhật chứng chỉ" cần INSERT vào `employee_certifications` (bảng Người 2). Đây là **ngoại lệ duy nhất** — cần thống nhất với Người 2:
- **Cách 1**: Người 3 gọi internal service của Người 2: `addCertification(employeeId, certData, tx)`
- **Cách 2**: Người 2 export function `addCertification()` trong `internal.service.ts`
- **Chọn Cách 2** (Người 2 giữ quyền kiểm soát bảng mình)

### Lấy tên nhân sự

- BE: JOIN với bảng `employees` (READ-ONLY) hoặc gọi `getEmployeeById()` từ internal service
- Trong response API: Luôn denormalize `employee_name`, `employee_staff_code` để FE không cần gọi thêm

### DB sở hữu (9 bảng)
`contract_types`, `training_course_types`, `evaluation_types`, `employment_contracts`, `contract_appendices`, `training_courses`, `training_registrations`, `training_results`, `employee_evaluations`

---

## NGƯỜI 4 — Cơ cấu tổ chức, Báo cáo, Cổng TCKT + Shared Export

**Tự thiết kế + code**: Cơ cấu tổ chức, Bổ nhiệm/Bãi nhiệm, Dashboard, Báo cáo, Cổng TCKT, Shared Export Engine

### Phạm vi sở hữu

```
FE (đã có, tự sửa):
├── pages/tccb/OrganizationPage.tsx
├── pages/tccb/UnitDetailPage.tsx
├── pages/tccb/DashboardPage.tsx

FE mới cần tạo:
├── components/tabs/OrgAssignmentTab.tsx  → Người 2 import vào PersonnelDetail
│
├── pages/tckt/                           → Cổng Tài chính (toàn bộ MỚI)
│   ├── TCKTLayout.tsx                    → Layout + sidebar riêng
│   ├── TCKTPersonnelListPage.tsx         → Xem danh sách nhân sự (read-only)
│   ├── TCKTSalaryPage.tsx                → Xem dữ liệu lương
│   └── TCKTExportPage.tsx                → Export Excel cho kế toán
│
├── pages/reports/                        → Báo cáo (MỚI)
│   └── ReportsPage.tsx                   → 7 nhóm báo cáo + biểu đồ + export
│
└── components/
    └── TCKTRoute.tsx                     → Route guard cho vai trò TCKT

BE (tự thiết kế):
├── backend/src/organization/  → CRUD cây đơn vị, bổ nhiệm/bãi nhiệm, giải thể/sáp nhập
├── backend/src/reports/       → API thống kê, báo cáo
├── backend/src/tckt/          → API đọc dữ liệu lương (read-only)
└── backend/src/shared/export/ → Engine export PDF/Excel/Word DÙNG CHUNG
```

### Tự làm từ A→Z

| # | Việc | Chi tiết | Ưu tiên |
|---|------|----------|---------|
| **Shared Export Engine** | | | |
| 1 | **Export PDF** | `generatePDF()` — dùng pdfkit, ai cũng gọi được | 🔴 P0 — Ngày 2-3 |
| 2 | **Export Excel** | `generateExcel()` — dùng exceljs, ai cũng gọi được | 🔴 P0 — Ngày 2-3 |
| 3 | **Export Word** | `generateWord()` — dùng docx, ai cũng gọi được | 🟡 P2 — Tuần 2 |
| **Cơ cấu tổ chức** | | | |
| 4 | **Sơ đồ cây đơn vị** | API GET tree, POST/PUT đơn vị, FE sơ đồ cây kết nối | 🔴 P0 — Ngày 2-4 |
| 5 | **Chi tiết đơn vị** | API GET detail (join nhân sự trong đơn vị), FE UnitDetailPage | 🔴 P0 — Ngày 3-5 |
| 6 | **Bổ nhiệm/Bãi nhiệm** | API POST/DELETE assignments (gán nhân sự vào đơn vị + chức vụ) | 🟠 P1 — Tuần 2 |
| 7 | **Giải thể/Sáp nhập** | API PATCH status (xử lý đơn vị con + nhân sự bên trong) | 🟡 P2 — Tuần 2-3 |
| 8 | **Tab đơn vị PersonnelDetail** | Tạo `OrgAssignmentTab.tsx` — hiển thị + thao tác bổ nhiệm theo nhân sự | 🟠 P1 — Ngày 5 |
| 9 | **Internal services** | Export removeAllAssignments, getOrgTree cho module khác | 🟠 P1 — Ngày 5 |
| **Dashboard** | | | |
| 10 | **Dashboard** | API GET overview (tổng nhân sự, biến động, HĐ sắp hết hạn, cảnh báo), FE kết nối | 🟠 P1 — Tuần 2 |
| **Cổng TCKT** | | | |
| 11 | **Layout + Route TCKT** | TCKTLayout + TCKTRoute (route guard vai trò TCKT) | 🔵 P3 — Tuần 3 |
| 12 | **Danh sách nhân sự TCKT** | API GET personnel (read-only, chỉ trả thông tin lương), FE mới | 🔵 P3 — Tuần 3 |
| 13 | **Dữ liệu lương** | API GET salary data theo đơn vị, FE mới | 🔵 P3 — Tuần 3 |
| 14 | **Export lương** | API + FE export Excel tương thích phần mềm kế toán | 🔵 P3 — Tuần 3-4 |
| **Báo cáo** | | | |
| 15 | **Báo cáo biến động** | API GET movements (tuyển mới, thôi việc, chuyển đơn vị theo khoảng thời gian) | 🔵 P3 — Tuần 3 |
| 16 | **Báo cáo cơ cấu** | API GET structure (theo đơn vị/trình độ/tuổi/giới tính) | 🔵 P3 — Tuần 3 |
| 17 | **Báo cáo đào tạo** | API GET training stats (gọi internal service Người 3) | 🔵 P3 — Tuần 4 |
| 18 | **Báo cáo hợp đồng** | API GET contract stats (gọi internal service Người 3) | 🔵 P3 — Tuần 4 |
| 19 | **Trang báo cáo** | FE trang mới: 7 nhóm báo cáo + biểu đồ + bộ lọc | 🔵 P3 — Tuần 3-4 |
| 20 | **Export báo cáo** | API + FE export PDF/Excel (dùng shared export engine) | 🔵 P3 — Tuần 4 |
| **Route** | | | |
| 21 | **Thêm routes** | Thêm `/tckt/*`, `/reports/*` vào router.tsx (qua PR) | Khi cần |

### Ranh giới rõ ràng

| Tình huống | Ai xử lý | Cách làm |
|------------|----------|----------|
| Tạo đơn vị mới | **Người 4** | INSERT vào org_units |
| Bổ nhiệm nhân sự vào đơn vị | **Người 4** | INSERT employee_assignments, READ employees |
| Tạo hồ sơ nhân sự mới | **Người 2** | INSERT employees |
| Xem "nhân sự thuộc đơn vị nào" | **Người 4** | Qua OrgAssignmentTab → gọi API Người 4 |
| Xem "nhân sự trong đơn vị" | **Người 4** | SELECT JOIN employees (READ-ONLY) |
| Cascade thôi việc | **Người 2** gọi internal service **Người 4** | `removeAllAssignments(employeeId, tx)` |
| Dashboard data | **Người 4** | READ-ONLY từ tất cả bảng, hoặc gọi internal service |

### DB sở hữu (3 bảng + READ ALL)
`org_units`, `org_unit_status_events`, `employee_assignments`

---

## SƠ ĐỒ FOLDER TỔNG THỂ

```
fe/tlu-hr/src/
├── router.tsx                    → Người 1 quản lý
├── stores/auth.ts                → Người 1
├── components/ui/*               → Dùng chung (KHÔNG sửa)
├── components/ProtectedRoute.tsx → Người 1
├── components/AdminRoute.tsx     → Người 1
├── components/TCKTRoute.tsx      → Người 4 tạo mới
│
├── pages/auth/*                  → Người 1
├── pages/admin/
│   ├── User*                     → Người 1
│   └── config/
│       ├── SalaryConfigPage      → Người 1
│       ├── AllowanceConfigPage   → Người 1
│       ├── BusinessCatalogsPage  → Người 1
│       ├── ContractConfigPage    → Người 3 ← THAY ĐỔI
│       ├── TrainingTypesPage     → Người 3 ← THAY ĐỔI
│       └── EvaluationConfigPage  → Người 3 ← THAY ĐỔI
├── pages/self-service/*          → Người 1 (MỚI)
├── pages/tccb/
│   ├── Personnel*                → Người 2
│   ├── Organization*             → Người 4
│   ├── UnitDetail*               → Người 4
│   ├── Contract*                 → Người 3
│   ├── Training*                 → Người 3
│   └── Dashboard*                → Người 4
├── pages/tckt/*                  → Người 4 (MỚI)
├── pages/reports/*               → Người 4 (MỚI)
│
├── components/forms/wizard-steps/*   → Người 2
├── components/contracts/*            → Người 3
├── components/training/*             → Người 3
├── components/tabs/
│   ├── OrgAssignmentTab.tsx      → Người 4 (Người 2 import)
│   ├── ContractTab.tsx           → Người 3 (Người 2 import)
│   ├── TrainingTab.tsx           → Người 3 (Người 2 import)
│   └── EvaluationTab.tsx         → Người 3 (Người 2 import)

backend/src/
├── index.ts                → Người 1 tạo, mỗi người thêm import route
├── db/connection.ts        → Người 1 tạo, ai cũng import
├── middleware/*             → Người 1 tạo, ai cũng import
├── types/shared.ts         → Người 1 tạo, ai cũng import
│
├── shared/
│   └── export/             → Người 4 TẠO, ai cũng import
│       ├── pdf-generator.ts
│       ├── excel-generator.ts
│       └── word-generator.ts
│
├── auth/                   → Người 1
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── internal.service.ts
├── users/                  → Người 1
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── internal.service.ts
├── config/                 → Người 1 (salary, allowance, catalogs)
├── audit/                  → Người 1
│   └── internal.service.ts
├── files/                  → Người 1
├── self-service/           → Người 1
│
├── personnel/              → Người 2
│   ├── personnel.controller.ts
│   ├── personnel.service.ts
│   ├── sub-entities.service.ts
│   └── internal.service.ts
│
├── domain-config/          → Người 3 (contract_types, training_types, eval_types)
├── contracts/              → Người 3
│   ├── contracts.controller.ts
│   ├── contracts.service.ts
│   └── internal.service.ts
├── training/               → Người 3
│   └── internal.service.ts
├── evaluations/            → Người 3
│   └── internal.service.ts
│
├── organization/           → Người 4
│   ├── organization.controller.ts
│   ├── organization.service.ts
│   └── internal.service.ts
├── reports/                → Người 4
└── tckt/                   → Người 4
```

---

## ENVIRONMENT SETUP — Ngày 1

### Người 1 tạo (trong skeleton):

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: tlu_hr
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./code/database/schema.postgres.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./code/database/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql

  pgadmin:
    image: dpage/pgadmin4
    ports: ["5050:80"]
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@tlu.edu.vn
      PGADMIN_DEFAULT_PASSWORD: admin

volumes:
  pgdata:
```

```bash
# .env.example
DATABASE_URL=postgresql://dev:dev123@localhost:5432/tlu_hr
SESSION_SECRET=change-me-in-production
PORT=3000
UPLOAD_DIR=./uploads
```

### Mọi người chạy:
```bash
docker compose up -d          # Khởi PostgreSQL + pgAdmin
cd backend && npm install     # Cài dependencies
cp .env.example .env          # Tạo file env
npm run dev                   # Chạy backend
```

---

## SEED DATA — Người 2 chịu trách nhiệm chính

> Seed data rất quan trọng vì **tất cả module đều cần employee data** để test.

### Thứ tự seed:

| # | Bảng | Ai tạo | Số lượng | Khi nào |
|---|------|--------|----------|---------|
| 1 | `campuses` | Người 1 | 3 cơ sở | Ngày 1 (trong skeleton) |
| 2 | `auth_roles` | Người 1 | 4 roles (ADMIN, TCCB, TCKT, EMPLOYEE) | Ngày 1 |
| 3 | `auth_users` | Người 1 | 5-10 users (admin, tccb, tckt, employee×5) | Ngày 2 |
| 4 | `org_units` | Người 4 | 15-20 đơn vị (cây 3 cấp) | Ngày 2 |
| 5 | `salary_coefficients` | Người 1 | 20 hệ số | Ngày 2 |
| 6 | `allowance_types` | Người 1 | 5-8 loại phụ cấp | Ngày 2 |
| 7 | `contract_types` | Người 3 | 4 loại HĐ (thử việc, 12 tháng, 36 tháng, vô thời hạn) | Ngày 2 |
| 8 | `training_course_types` | Người 3 | 5 loại (nội bộ, ngoài, online...) | Ngày 2 |
| 9 | **`employees`** | **Người 2** | **50-100 nhân sự** | **Ngày 3-4** |
| 10 | `employee_assignments` | Người 4 | Gán nhân sự vào đơn vị | Ngày 4-5 |
| 11 | `employment_contracts` | Người 3 | 50-100 HĐ (match với employees) | Ngày 4-5 |
| 12 | `training_courses` | Người 3 | 10 khóa | Ngày 4-5 |

**File seed**: `code/database/seed.sql` — Mỗi người thêm INSERT statements cho bảng mình, commit vào 1 file chung.

---

## TIMELINE CHI TIẾT

### Ngày 1 (Sáng): Unblock — Tất cả làm song song

```
09:00-12:00
├── Người 1: Tạo skeleton BE + docker-compose + push lên dev
├── Người 2: Refactor FE PersonnelDetail (tách tab system), tạo FE service layer
├── Người 3: Tạo ContractTab + TrainingTab + EvaluationTab (FE components)
└── Người 4: Tạo OrgAssignmentTab, thiết kế FE cho TCKT + Reports layout

12:00: Người 1 push skeleton → 3 người pull
```

### Ngày 1 (Chiều) + Ngày 2: Foundation

```
├── Người 1: Auth API (login/logout/me) → push → mọi người test auth
├── Người 2: Bắt đầu Personnel API (list + create)
├── Người 3: Bắt đầu domain config APIs (contract_types, training_types)
└── Người 4: Shared export engine (PDF + Excel) + Org API (tree)
```

### Ngày 3-5: Core APIs (P0 tasks)

```
├── Người 1: User CRUD API → File upload API → seed data (campuses, roles, users, salary, allowance)
├── Người 2: Personnel CRUD hoàn chỉnh → seed 50+ employees
├── Người 3: Contract CRUD → Training CRUD → seed (contract_types, HĐ, khóa ĐT)
└── Người 4: Org CRUD → Bổ nhiệm API → seed (org_units, assignments)

Cuối ngày 5: Internal services exported, cross-module communication tested
```

### Tuần 2: Feature Complete (P1 + P2 tasks)

```
├── Người 1: Config APIs (salary, allowance, catalogs) → Audit log → kết nối FE
├── Người 2: Sub-entities ×7 → Lương/Phụ cấp → Thôi việc cascade → kết nối FE
├── Người 3: Gia hạn/Chấm dứt HĐ → Phụ lục → Đăng ký ĐT → Kết quả → KT/KL
└── Người 4: Dashboard API → Giải thể/Sáp nhập → kết nối FE
```

### Tuần 3: Cross-module + New Features (P3 tasks)

```
├── Người 2: Import tab components từ Người 3+4 → Import Excel
├── Người 1: Self-Service portal (gọi internal services Người 2+3)
├── Người 3: In HĐ PDF (dùng shared export Người 4) → Auto chứng chỉ
└── Người 4: TCKT portal → Reports (gọi internal services Người 2+3)
```

### Tuần 4: Integration + Polish

```
├── Test cross-module flows (thôi việc cascade, dashboard data, self-service)
├── Import Excel edge cases (Người 2)
├── Export báo cáo + lương (Người 4)
├── Bug fixes toàn bộ
└── Người 1: Self-Service đề nghị cập nhật
```

### Tuần 5+: Testing, Fix bug, Demo

---

## QUY TẮC PHỐI HỢP

### 1. Git Branching — Mỗi người 1 nhánh

```
main
└── dev
    ├── feat/admin-auth        ← Người 1
    ├── feat/personnel         ← Người 2
    ├── feat/contracts         ← Người 3
    └── feat/org-reports       ← Người 4
```

- Mỗi người làm trên nhánh mình, merge vào `dev` khi xong task
- PR cần review nhanh (không block quá 4 giờ)
- **Rebase từ dev** trước khi tạo PR (tránh merge conflict lớn)

### 2. File chung — Ai sửa?

| File | Cách xử lý |
|------|-----------|
| `router.tsx` | Mỗi người thêm route mình vào, Người 1 merge conflict nếu có |
| `backend/src/index.ts` | Mỗi người thêm 1 dòng import route, merge qua PR |
| `backend/src/shared/export/*` | Người 4 sở hữu, người khác chỉ import |
| `code/database/seed.sql` | Mỗi người thêm INSERT cho bảng mình (append, không sửa phần người khác) |
| `package.json` | Thông báo trong group chat trước khi thêm dependency |
| `types/index.ts` | Mỗi người tạo type file riêng, re-export trong index.ts |

### 3. Quy tắc đơn giản

- **Folder mình = tự do**: Muốn code kiểu gì cũng được
- **Folder người khác = không sửa**: Nếu cần → tạo PR hoặc nói chuyện
- **Import được, sửa không được**: Mọi người import `db/connection.ts`, `middleware/*`, `types/*`, `shared/export/*` — nhưng chỉ owner sửa
- **Cross-module trong BE**: Import `internal.service.ts` của module khác (KHÔNG gọi HTTP)
- **Conflict = nói chuyện**: 2 người sửa cùng file → giải quyết 5 phút

---

## TESTING STRATEGY

### Unit Test (mỗi người tự test phần mình)

| Loại | Công cụ | Ai làm |
|------|---------|--------|
| BE API test | Vitest + Supertest | Mỗi người test API endpoints mình |
| FE component test | Vitest + React Testing Library | Tùy chọn (khuyến khích) |

### Integration Test (tuần 3-4)

| Test Case | Người chịu trách nhiệm |
|-----------|------------------------|
| Login → truy cập trang TCCB | Người 1 |
| Tạo hồ sơ → tạo HĐ → xem trong PersonnelDetail | Người 2 + 3 cùng test |
| Thôi việc cascade (employees → assignments → users) | Người 2 (trigger) + Người 4 + 1 (verify) |
| Dashboard hiển thị data đúng | Người 4 |
| Self-Service hiển thị data đúng | Người 1 |
| TCKT xem + export lương | Người 4 |
| Import Excel 100 dòng | Người 2 |

### Quy trình test:

1. Mỗi người viết **ít nhất smoke test** cho API endpoints chính (P0, P1)
2. **Tuần 4**: Cả team ngồi chung test cross-module flows
3. **Test trên database seed data** — không dùng database rỗng

---

## ĐÁNH GIÁ CÂN BẰNG (v4 — điều chỉnh từ v3)

### So sánh v3 vs v4

| Chiều đo | Người 1 (v3→v4) | Người 2 (v3→v4) | Người 3 (v3→v4) | Người 4 (v3→v4) |
|----------|-----------------|-----------------|-----------------|-----------------|
| Tasks | 18→17 | 9→11 | 16→20 | 17→21 |
| Bảng DB (ghi) | 14→**11** | 10 | 6→**9** | 3 |
| FE config pages | 6→**3** | 0 | 3+3→**6+3 tabs** | 3 |
| FE tạo mới | 7 | 0 | 3 tabs | ~7 + 1 tab |
| Shared responsibility | Skeleton + Auth | Seed data | Domain config | Export engine |

### Effort thực tế (honest assessment)

```
Vibecoding Effort  ██████████ 10

  7.0   ·········          ██████████
  6.5   ··████████·██████████████████·██████████
  6.0   ██████████·██████████████████·██████████
  5.5   ██████████·██████████████████·██████████
        ──────────┬──────────┬──────────┬──────────
         Người 1    Người 2    Người 3    Người 4
           5.5        6.5        6.5        6.0
```

| Người | Effort | Tại sao? |
|-------|--------|----------|
| **1** | **5.5/10** | Skeleton 1 lần, auth dùng better-auth (framework), config ×3 (lặp), Self-Service 5 trang read-only. Vibecoding generate cực nhanh. |
| **2** | **6.5/10** | Wizard 8 bước validation phức tạp, sub-entities ×7 (lặp nhưng nhiều), Import Excel parsing, cascade thôi việc. Seed 100 records. |
| **3** | **6.5/10** | Business logic HĐ (chuyển loại, gia hạn, đếm lần ký, grace days), 3 domain modules, 3 config pages + 3 tabs mới, in PDF template. |
| **4** | **6.0/10** | Shared export engine (công 1 lần nhưng phức tạp), org tree + giải thể/sáp nhập, SQL aggregate cho reports, ~8 new pages nhưng đa phần read-only. |

### Chênh lệch: 5.5 — 6.5 = 1.0 → **Chấp nhận được**

Người 1 nhẹ hơn ~15% nhưng chịu trách nhiệm **unblock team ngày 1** + **merge conflict router** + **auth thông suốt sớm** = effort ẩn không tính vào feature count.

### Ai cũng được làm thật

| Người | Ghi DB? | Business logic phức tạp? | FE mới? | BE modules? | Shared? |
|-------|---------|-------------------------|---------|-------------|---------|
| **1** | ✅ 11 bảng | ✅ Auth, phân quyền, session | ✅ 7 trang | ✅ 5 modules | ✅ Skeleton, Auth MW |
| **2** | ✅ 10 bảng | ✅ Wizard, thôi việc, import | ❌ (FE sẵn đủ) | ✅ 1 module lớn | ✅ Seed data |
| **3** | ✅ 9 bảng | ✅ Quy tắc HĐ, in PDF | ✅ 3 tabs + 3 config | ✅ 4 modules | ❌ |
| **4** | ✅ 3 bảng | ✅ Giải thể/sáp nhập, SQL agg | ✅ ~8 trang + 1 tab | ✅ 4 modules | ✅ Export engine |

---

## TỔNG KẾT

| Người | Phạm vi | Bảng DB | FE sẵn | FE mới | BE modules | Shared |
|-------|---------|---------|--------|--------|------------|--------|
| **1** | Auth + Users + System Config + Audit + File + Self-Service | 11 | 7 trang | 7 trang | 5 | Skeleton, Auth MW |
| **2** | Nhân sự CRUD + Sub-entities + Import/Export | 10 | 4 + wizard | 0 | 1 (lớn) | Seed data |
| **3** | HĐ + ĐT + KT/KL + Domain Config (loại HĐ/ĐT/ĐG) | 9 | 6 + 5 dialogs + 3 config | 3 tabs | 4 | — |
| **4** | Tổ chức + Dashboard + TCKT + Reports | 3 + read | 3 trang | ~8 trang | 4 | Export engine |

### Nguyên tắc vàng

- **Mỗi người tự chịu trách nhiệm thiết kế + code FE + BE phần mình**
- **Thống nhất**: DB schema, API format, Auth middleware, Export utilities
- **Config thuộc domain owner**: Ai sở hữu business logic → sở hữu luôn config
- **Internal service call trong monolith**: Dùng function import + shared transaction, KHÔNG HTTP
- **Không ai ghi bảng của người khác** (trừ ngoại lệ đã thống nhất: auto chứng chỉ)
- **Seed data là bắt buộc**: Mỗi người seed bảng mình, Người 2 seed employees trước (vì tất cả phụ thuộc)
