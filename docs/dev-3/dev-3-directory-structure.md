# Dev 3 — Cấu trúc thư mục và file

> **Phạm vi trách nhiệm:** Nhân sự Core — quản lý hồ sơ nhân viên và các thông tin phụ trợ (gia đình, ngân hàng, quá trình công tác, đảng/đoàn, phụ cấp).
>
> **Stack:** Turborepo + Bun · Elysia 1.4 · React 19 · Drizzle ORM · PostgreSQL

---

## Mục lục

1. [Database Schema](#1-database-schema)
2. [Backend Modules](#2-backend-modules)
3. [Shared Validators](#3-shared-validators)
4. [Frontend Routes](#4-frontend-routes)
5. [Frontend Components (Shared UI)](#5-frontend-components-shared-ui)
6. [Frontend Features](#6-frontend-features)

---

## 1. Database Schema

**Đường dẫn:** `apps/backend/src/db/schema/`

```
apps/backend/src/db/schema/
├── employees.ts                    # Bảng nhân viên chính + các bảng phụ trợ
├── allowance-types.ts              # Bảng loại phụ cấp (được tham chiếu bởi allowances)
└── index.ts                        # Re-export toàn bộ schema (do Dev 3 tạo mới/mở rộng)
```

### `employees.ts`

Chứa **6 bảng** và các kiểu TypeScript tương ứng:

| Drizzle table var | DB table name | Mô tả |
|---|---|---|
| `employees` | `employees` | Bảng nhân viên chính |
| `employeeFamilyMembers` | `employee_family_members` | Thành viên gia đình |
| `employeeBankAccounts` | `employee_bank_accounts` | Tài khoản ngân hàng |
| `employeePreviousJobs` | `employee_previous_jobs` | Quá trình công tác trước đây |
| `employeePartyMemberships` | `employee_party_memberships` | Đảng/đoàn thể |
| `employeeAllowances` | `employee_allowances` | Phụ cấp nhân viên |

**Các kiểu TypeScript được export từ `employees.ts`:**

```ts
// employees
export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert

// employee_family_members
export type EmployeeFamilyMember = typeof employeeFamilyMembers.$inferSelect
export type NewEmployeeFamilyMember = typeof employeeFamilyMembers.$inferInsert

// employee_bank_accounts
export type EmployeeBankAccount = typeof employeeBankAccounts.$inferSelect
export type NewEmployeeBankAccount = typeof employeeBankAccounts.$inferInsert

// employee_previous_jobs
export type EmployeePreviousJob = typeof employeePreviousJobs.$inferSelect
export type NewEmployeePreviousJob = typeof employeePreviousJobs.$inferInsert

// employee_party_memberships
export type EmployeePartyMembership = typeof employeePartyMemberships.$inferSelect
export type NewEmployeePartyMembership = typeof employeePartyMemberships.$inferInsert

// employee_allowances
export type EmployeeAllowance = typeof employeeAllowances.$inferSelect
export type NewEmployeeAllowance = typeof employeeAllowances.$inferInsert
```

### `allowance-types.ts`

| Drizzle table var | DB table name | Mô tả |
|---|---|---|
| `allowanceTypes` | `allowance_types` | Danh mục loại phụ cấp (lookup table) |

```ts
export type AllowanceType = typeof allowanceTypes.$inferSelect
export type NewAllowanceType = typeof allowanceTypes.$inferInsert
```

---

## 2. Backend Modules

**Đường dẫn:** `apps/backend/src/modules/`

```
apps/backend/src/modules/
├── employees/
│   ├── index.ts                    # Định nghĩa route CRUD /api/employees
│   ├── employees.service.ts        # Business logic: tạo, cập nhật, xoá, tìm kiếm nhân viên
│   └── employees.test.ts           # Unit/integration test cho employees module
│
├── family-members/
│   ├── index.ts                    # Định nghĩa route CRUD /api/employees/:id/family-members
│   ├── family-members.service.ts   # Business logic: quản lý thành viên gia đình
│   └── family-members.test.ts      # Unit/integration test cho family-members module
│
├── bank-accounts/
│   ├── index.ts                    # Định nghĩa route CRUD /api/employees/:id/bank-accounts
│   ├── bank-accounts.service.ts    # Business logic: quản lý tài khoản ngân hàng
│   └── bank-accounts.test.ts       # Unit/integration test cho bank-accounts module
│
├── previous-jobs/
│   ├── index.ts                    # Định nghĩa route CRUD /api/employees/:id/previous-jobs
│   ├── previous-jobs.service.ts    # Business logic: quản lý quá trình công tác
│   └── previous-jobs.test.ts       # Unit/integration test cho previous-jobs module
│
├── party-memberships/
│   ├── index.ts                    # Định nghĩa route CRUD /api/employees/:id/party-memberships
│   ├── party-memberships.service.ts # Business logic: quản lý đảng/đoàn thể, theo dõi trạng thái
│   └── party-memberships.test.ts   # Unit/integration test cho party-memberships module
│
├── allowances/
│   ├── index.ts                    # Định nghĩa route CRUD /api/employees/:id/allowances
│   ├── allowances.service.ts       # Business logic: quản lý phụ cấp, liên kết allowance_types
│   └── allowances.test.ts          # Unit/integration test cho allowances module
│
└── employees-export/
    ├── index.ts                    # Route GET /api/employees/:id/export và GET /api/employees/export
    ├── employees-export.service.ts # Business logic: xuất hồ sơ PDF/Excel, tổng hợp toàn bộ dữ liệu nhân viên
    └── employees-export.test.ts    # Unit/integration test cho export module
```

### Chi tiết từng module

#### `employees/index.ts`
```
GET    /api/employees           → Danh sách nhân viên (có phân trang, filter, search)
POST   /api/employees           → Tạo nhân viên mới
GET    /api/employees/:id       → Chi tiết một nhân viên
PUT    /api/employees/:id       → Cập nhật thông tin nhân viên
DELETE /api/employees/:id       → Xoá nhân viên
```

#### `family-members/index.ts`
```
GET    /api/employees/:id/family-members        → Danh sách thành viên gia đình
POST   /api/employees/:id/family-members        → Thêm thành viên gia đình
PUT    /api/employees/:id/family-members/:fmId  → Sửa thành viên gia đình
DELETE /api/employees/:id/family-members/:fmId  → Xoá thành viên gia đình
```

#### `bank-accounts/index.ts`
```
GET    /api/employees/:id/bank-accounts         → Danh sách tài khoản ngân hàng
POST   /api/employees/:id/bank-accounts         → Thêm tài khoản ngân hàng
PUT    /api/employees/:id/bank-accounts/:baId   → Sửa tài khoản ngân hàng
DELETE /api/employees/:id/bank-accounts/:baId   → Xoá tài khoản ngân hàng
```

#### `previous-jobs/index.ts`
```
GET    /api/employees/:id/previous-jobs         → Danh sách quá trình công tác
POST   /api/employees/:id/previous-jobs         → Thêm quá trình công tác
PUT    /api/employees/:id/previous-jobs/:pjId   → Sửa quá trình công tác
DELETE /api/employees/:id/previous-jobs/:pjId   → Xoá quá trình công tác
```

#### `party-memberships/index.ts`
```
GET    /api/employees/:id/party-memberships         → Danh sách đảng/đoàn thể
POST   /api/employees/:id/party-memberships         → Thêm đảng/đoàn thể
PUT    /api/employees/:id/party-memberships/:pmId   → Sửa thông tin đảng/đoàn thể
DELETE /api/employees/:id/party-memberships/:pmId   → Xoá đảng/đoàn thể
```

#### `allowances/index.ts`
```
GET    /api/employees/:id/allowances            → Danh sách phụ cấp
POST   /api/employees/:id/allowances            → Thêm phụ cấp
PUT    /api/employees/:id/allowances/:aId       → Sửa phụ cấp
DELETE /api/employees/:id/allowances/:aId       → Xoá phụ cấp
```

#### `employees-export/index.ts`
```
GET    /api/employees/export                    → Xuất danh sách toàn bộ nhân viên (Excel/CSV)
GET    /api/employees/:id/export                → Xuất hồ sơ chi tiết một nhân viên (PDF)
```

---

## 3. Shared Validators

**Đường dẫn:** `packages/shared/src/validators/`

```
packages/shared/src/validators/
├── common.ts                       # Schema dùng chung cho toàn dự án
├── employees.ts                    # Schema cho nhân viên chính
├── family-members.ts               # Schema cho thành viên gia đình
├── bank-accounts.ts                # Schema cho tài khoản ngân hàng
├── previous-jobs.ts                # Schema cho quá trình công tác
├── party-memberships.ts            # Schema cho đảng/đoàn thể
├── allowances.ts                   # Schema cho phụ cấp
└── index.ts                        # Re-export toàn bộ validators
```

> **Lưu ý:** `common.ts` có thể đã tồn tại. Dev 3 đảm bảo các schema chung (`paginationSchema`, `idParamSchema`) được khai báo ở đây để các dev khác tái sử dụng.

### `common.ts`

```ts
paginationSchema          // { page, limit, search? }
idParamSchema             // { id: uuid }
employeeIdParamSchema     // { employeeId: uuid }  — dùng cho nested routes
```

### `employees.ts`

```ts
createEmployeeSchema      // Toàn bộ fields khi tạo nhân viên mới (required + optional)
updateEmployeeSchema      // Partial của createEmployeeSchema cho PUT
employeeQuerySchema       // Query params: page, limit, search, departmentId, status, ...
employeeResponseSchema    // Shape của response trả về từ API
```

### `family-members.ts`

```ts
createFamilyMemberSchema  // fullName, relationship, dateOfBirth, idNumber, occupation, ...
updateFamilyMemberSchema  // Partial của createFamilyMemberSchema
familyMemberResponseSchema
```

### `bank-accounts.ts`

```ts
createBankAccountSchema   // bankName, accountNumber, accountHolder, branch, isPrimary
updateBankAccountSchema   // Partial của createBankAccountSchema
bankAccountResponseSchema
```

### `previous-jobs.ts`

```ts
createPreviousJobSchema   // organizationName, position, startDate, endDate, leaveReason
updatePreviousJobSchema   // Partial của createPreviousJobSchema
previousJobResponseSchema
```

### `party-memberships.ts`

```ts
createPartyMembershipSchema   // organizationName, membershipType, joinDate, status, position
updatePartyMembershipSchema   // Partial của createPartyMembershipSchema
partyMembershipResponseSchema
```

### `allowances.ts`

```ts
createAllowanceSchema         // allowanceTypeId, amount, startDate, endDate?, note?
updateAllowanceSchema         // Partial của createAllowanceSchema
allowanceResponseSchema
allowanceTypeResponseSchema   // Schema cho lookup allowance_types
```

---

## 4. Frontend Routes

**Đường dẫn:** `apps/frontend/src/routes/`

```
apps/frontend/src/routes/
└── _authenticated/
    ├── employees_/
    │   ├── $employeeId.tsx              # Layout tab nhân sự — chứa <Outlet/> và TabNav
    │   └── $employeeId/
    │       ├── index.tsx                # Tab: Thông tin cá nhân (route: /employees/:id)
    │       ├── family.tsx               # Tab: Gia đình (route: /employees/:id/family)
    │       ├── bank-accounts.tsx        # Tab: Tài khoản ngân hàng (route: /employees/:id/bank-accounts)
    │       ├── work-history.tsx         # Tab: Quá trình công tác (route: /employees/:id/work-history)
    │       ├── party.tsx                # Tab: Đảng/đoàn (route: /employees/:id/party)
    │       └── allowances.tsx           # Tab: Phụ cấp (route: /employees/:id/allowances)
    ├── employees/
    │   └── new.tsx                      # Tạo nhân viên mới (route: /employees/new)
    └── my/
        └── profile.tsx                  # Hồ sơ cá nhân (route: /my/profile)
```

### Mô tả từng route file

| File | URL | Mô tả |
|---|---|---|
| `employees_/$employeeId.tsx` | `/employees/:id` | Layout shell: thanh tab điều hướng, load thông tin cơ bản nhân viên, render `<Outlet/>` |
| `employees_/$employeeId/index.tsx` | `/employees/:id` | Tab thông tin cá nhân: họ tên, ngày sinh, CCCD, địa chỉ, vị trí, phòng ban |
| `employees_/$employeeId/family.tsx` | `/employees/:id/family` | Tab gia đình: bảng thành viên gia đình + CRUD inline |
| `employees_/$employeeId/bank-accounts.tsx` | `/employees/:id/bank-accounts` | Tab tài khoản ngân hàng: bảng tài khoản + CRUD |
| `employees_/$employeeId/work-history.tsx` | `/employees/:id/work-history` | Tab quá trình công tác: danh sách công việc trước + CRUD |
| `employees_/$employeeId/party.tsx` | `/employees/:id/party` | Tab đảng/đoàn: danh sách tổ chức, trạng thái + CRUD |
| `employees_/$employeeId/allowances.tsx` | `/employees/:id/allowances` | Tab phụ cấp: bảng phụ cấp liên kết với loại phụ cấp + CRUD |
| `employees/new.tsx` | `/employees/new` | Form tạo nhân viên mới (multi-step hoặc single form phức tạp) |
| `my/profile.tsx` | `/my/profile` | Xem và chỉnh sửa hồ sơ cá nhân của người dùng đang đăng nhập |

---

## 5. Frontend Components (Shared UI)

**Đường dẫn:** `apps/frontend/src/components/`

> Đây là các component **dùng chung toàn dự án** do Dev 3 xây dựng. Các dev khác import từ đây.

```
apps/frontend/src/components/
├── ui/
│   ├── DataTable/
│   │   ├── DataTable.tsx            # Component bảng dữ liệu chính (TanStack Table)
│   │   ├── DataTableHeader.tsx      # Header row với sort, filter controls
│   │   ├── DataTablePagination.tsx  # Phân trang (page size, prev/next, page indicator)
│   │   ├── DataTableToolbar.tsx     # Thanh công cụ: search input, filter dropdowns, action buttons
│   │   ├── DataTableRowActions.tsx  # Dropdown actions cho từng row (edit, delete, view)
│   │   ├── DataTableColumnToggle.tsx # Toggle hiện/ẩn cột
│   │   └── index.ts                 # Re-export toàn bộ DataTable components
│   │
│   ├── Modal/
│   │   ├── Modal.tsx                # Modal container wrapper (Radix Dialog hoặc tương đương)
│   │   ├── ModalHeader.tsx          # Header modal: title + close button
│   │   ├── ModalBody.tsx            # Body modal: scroll container
│   │   ├── ModalFooter.tsx          # Footer modal: nút Cancel + Submit
│   │   └── index.ts                 # Re-export toàn bộ Modal components
│   │
│   ├── Form/
│   │   ├── FormField.tsx            # Wrapper field: label + input + error message
│   │   ├── FormInput.tsx            # Input text/number controlled + validation state
│   │   ├── FormSelect.tsx           # Select dropdown (single) với options[]
│   │   ├── FormDatePicker.tsx       # Date picker input (ISO date string)
│   │   ├── FormTextarea.tsx         # Textarea controlled
│   │   ├── FormCheckbox.tsx         # Checkbox với label
│   │   ├── FormRadioGroup.tsx       # Radio group với options[]
│   │   └── index.ts                 # Re-export toàn bộ Form components
│   │
│   └── Tab/
│       ├── TabLayout.tsx            # Layout container cho tab-based pages
│       ├── TabNav.tsx               # Thanh điều hướng tab (active state, routing)
│       ├── TabNavItem.tsx           # Từng item trong TabNav (label, icon, link)
│       ├── TabPanel.tsx             # Nội dung bên trong mỗi tab (wrapper)
│       └── index.ts                 # Re-export toàn bộ Tab components
│
└── index.ts                         # Re-export toàn bộ shared components
```

### Mô tả chi tiết

#### `DataTable/DataTable.tsx`
- Nhận props: `columns`, `data`, `isLoading`, `pagination`, `onPaginationChange`
- Tích hợp TanStack Table v8
- Hỗ trợ server-side sorting, filtering, pagination
- Hiển thị skeleton loader khi `isLoading = true`

#### `Modal/Modal.tsx`
- Controlled component: `open`, `onOpenChange`
- Props: `title`, `description?`, `size?: 'sm' | 'md' | 'lg' | 'xl'`
- Sử dụng làm base cho tất cả modal CRUD trong toàn dự án

#### `Form/FormField.tsx`
- Wrapper chuẩn hoá: `<label>` + `{children}` + `<p className="error">`
- Props: `label`, `required?`, `error?`, `hint?`

#### `Tab/TabLayout.tsx`
- Nhận `header` slot (thông tin nhân viên) và render `<TabNav>` + `<Outlet/>`
- Dùng làm base layout cho `employees_/$employeeId.tsx`

---

## 6. Frontend Features

**Đường dẫn:** `apps/frontend/src/features/`

> Feature-specific components — chỉ dùng trong phạm vi tính năng nhân sự.

```
apps/frontend/src/features/
└── employees/
    ├── components/
    │   ├── EmployeeTable.tsx              # Bảng danh sách nhân viên (dùng DataTable + cột đặc thù)
    │   ├── EmployeeTableColumns.tsx       # Định nghĩa columns[] cho EmployeeTable
    │   ├── EmployeeForm.tsx               # Form thêm/sửa nhân viên chính (phức tạp, nhiều section)
    │   ├── EmployeeFormPersonalInfo.tsx   # Section thông tin cá nhân trong EmployeeForm
    │   ├── EmployeeFormContactInfo.tsx    # Section thông tin liên hệ trong EmployeeForm
    │   ├── EmployeeFormJobInfo.tsx        # Section thông tin công việc/phòng ban trong EmployeeForm
    │   ├── EmployeeAvatar.tsx             # Avatar nhân viên + upload ảnh
    │   ├── EmployeeStatusBadge.tsx        # Badge hiển thị trạng thái nhân viên (active/inactive/...)
    │   ├── EmployeeDetailHeader.tsx       # Header trang chi tiết: ảnh, tên, chức danh, actions
    │   │
    │   ├── FamilyMemberTable.tsx          # Bảng thành viên gia đình (sub-entity table pattern)
    │   ├── FamilyMemberForm.tsx           # Form thêm/sửa thành viên gia đình (trong Modal)
    │   │
    │   ├── BankAccountTable.tsx           # Bảng tài khoản ngân hàng
    │   ├── BankAccountForm.tsx            # Form thêm/sửa tài khoản ngân hàng (trong Modal)
    │   │
    │   ├── PreviousJobTable.tsx           # Bảng quá trình công tác
    │   ├── PreviousJobForm.tsx            # Form thêm/sửa quá trình công tác (trong Modal)
    │   │
    │   ├── PartyMembershipTable.tsx       # Bảng đảng/đoàn thể
    │   ├── PartyMembershipForm.tsx        # Form thêm/sửa đảng/đoàn thể + status field
    │   ├── PartyMembershipStatusBadge.tsx # Badge trạng thái đảng/đoàn thể
    │   │
    │   ├── AllowanceTable.tsx             # Bảng phụ cấp
    │   ├── AllowanceForm.tsx              # Form thêm/sửa phụ cấp + select AllowanceType
    │   │
    │   └── EmployeeExportButton.tsx       # Nút xuất hồ sơ (trigger export API)
    │
    ├── hooks/
    │   ├── useEmployees.ts                # Query hook: danh sách nhân viên (GET /api/employees)
    │   ├── useEmployee.ts                 # Query hook: chi tiết nhân viên (GET /api/employees/:id)
    │   ├── useCreateEmployee.ts           # Mutation hook: tạo nhân viên
    │   ├── useUpdateEmployee.ts           # Mutation hook: cập nhật nhân viên
    │   ├── useDeleteEmployee.ts           # Mutation hook: xoá nhân viên
    │   │
    │   ├── useFamilyMembers.ts            # Query hook: danh sách thành viên gia đình
    │   ├── useCreateFamilyMember.ts       # Mutation hook: thêm thành viên gia đình
    │   ├── useUpdateFamilyMember.ts       # Mutation hook: sửa thành viên gia đình
    │   ├── useDeleteFamilyMember.ts       # Mutation hook: xoá thành viên gia đình
    │   │
    │   ├── useBankAccounts.ts             # Query hook: danh sách tài khoản ngân hàng
    │   ├── useCreateBankAccount.ts        # Mutation hook: thêm tài khoản ngân hàng
    │   ├── useUpdateBankAccount.ts        # Mutation hook: sửa tài khoản ngân hàng
    │   ├── useDeleteBankAccount.ts        # Mutation hook: xoá tài khoản ngân hàng
    │   │
    │   ├── usePreviousJobs.ts             # Query hook: danh sách quá trình công tác
    │   ├── useCreatePreviousJob.ts        # Mutation hook: thêm quá trình công tác
    │   ├── useUpdatePreviousJob.ts        # Mutation hook: sửa quá trình công tác
    │   ├── useDeletePreviousJob.ts        # Mutation hook: xoá quá trình công tác
    │   │
    │   ├── usePartyMemberships.ts         # Query hook: danh sách đảng/đoàn thể
    │   ├── useCreatePartyMembership.ts    # Mutation hook: thêm đảng/đoàn thể
    │   ├── useUpdatePartyMembership.ts    # Mutation hook: sửa đảng/đoàn thể
    │   ├── useDeletePartyMembership.ts    # Mutation hook: xoá đảng/đoàn thể
    │   │
    │   ├── useAllowances.ts               # Query hook: danh sách phụ cấp
    │   ├── useCreateAllowance.ts          # Mutation hook: thêm phụ cấp
    │   ├── useUpdateAllowance.ts          # Mutation hook: sửa phụ cấp
    │   ├── useDeleteAllowance.ts          # Mutation hook: xoá phụ cấp
    │   │
    │   └── useEmployeeExport.ts           # Mutation hook: trigger xuất hồ sơ PDF/Excel
    │
    ├── api/
    │   ├── employees.api.ts               # Hàm gọi API employees (fetch wrappers)
    │   ├── family-members.api.ts          # Hàm gọi API family-members
    │   ├── bank-accounts.api.ts           # Hàm gọi API bank-accounts
    │   ├── previous-jobs.api.ts           # Hàm gọi API previous-jobs
    │   ├── party-memberships.api.ts       # Hàm gọi API party-memberships
    │   ├── allowances.api.ts              # Hàm gọi API allowances
    │   └── employees-export.api.ts        # Hàm gọi API export
    │
    └── index.ts                           # Re-export public API của feature employees
```

---

## Tổng kết số lượng file

| Layer | Số file |
|---|---|
| Database Schema | 3 |
| Backend Modules | 21 (7 modules × 3 files) |
| Shared Validators | 8 |
| Frontend Routes | 9 |
| Frontend Components (Shared UI) | 23 |
| Frontend Features (components) | 19 |
| Frontend Features (hooks) | 25 |
| Frontend Features (api) | 7 |
| **Tổng** | **115** |

---

## Quy ước đặt tên (nhắc lại nhanh)

| Loại | Quy ước | Ví dụ |
|---|---|---|
| DB table | `snake_case` plural | `employee_bank_accounts` |
| DB column | `snake_case` | `full_name`, `start_date` |
| Drizzle var | `camelCase` | `employeeBankAccounts` |
| TypeScript type | `PascalCase` | `EmployeeBankAccount` |
| Zod schema | `camelCase` + `Schema` | `createBankAccountSchema` |
| API endpoint | `kebab-case` | `/api/employees/:id/bank-accounts` |
| Route file | `kebab-case.tsx` | `bank-accounts.tsx` |
| Component file | `PascalCase.tsx` | `BankAccountTable.tsx` |
| Hook file | `camelCase.ts` | `useBankAccounts.ts` |
| API helper file | `kebab-case.api.ts` | `bank-accounts.api.ts` |
