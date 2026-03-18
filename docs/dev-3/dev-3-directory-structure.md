# Dev 3 — Cấu trúc thư mục và file

> Bản này chỉ giữ những file cần mở khi làm Dev 3. Không liệt kê toàn bộ file lý thuyết.

---

## 1. Đọc gì trước?

Nếu mới vào task của Dev 3, đọc theo thứ tự này:

1. `docs/conventions.md` — quy ước chung của repo
2. `docs/dev-3/dev-3-employee-core.md` — phạm vi Dev 3
3. `apps/frontend/src/routes/_authenticated/employees/index.tsx` — danh sách nhân sự
4. `apps/frontend/src/routes/_authenticated/employees/new.tsx` — tạo mới nhân sự
5. `apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx` — sửa hồ sơ
6. `apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx` — layout chi tiết + tab
7. `apps/frontend/src/features/employees/api.ts` — query/mutation frontend
8. `apps/backend/src/modules/employees/index.ts`
9. `apps/backend/src/modules/employees/employee.service.ts`

---

## 2. Nhóm file Dev 3 cần nắm

## 2.1 Frontend route

```text
apps/frontend/src/routes/_authenticated/
├── employees/index.tsx                 # Trang danh sách nhân sự
├── employees/new.tsx                   # Form tạo mới nhân sự
├── employees/$employeeId/edit.tsx      # Form sửa hồ sơ nhân sự
├── employees_/$employeeId.tsx          # Layout chi tiết nhân sự + tab
└── employees_/$employeeId/
    ├── index.tsx                       # Tab thông tin chung
    ├── family.tsx                      # Tab gia đình
    ├── work-history.tsx                # Tab quá trình công tác
    ├── party.tsx                       # Tab Đảng/Đoàn
    ├── salary.tsx                      # Tab lương và phụ cấp
    ├── education.tsx                   # Tab liên quan Dev khác
    ├── contracts.tsx                   # Tab liên quan Dev khác
    ├── assignments.tsx                 # Tab liên quan Dev khác
    └── rewards.tsx                     # Tab liên quan Dev khác
```

### Ý nghĩa nhanh

| File | Mở khi cần làm gì |
|---|---|
| `employees/index.tsx` | sửa search, filter, bảng danh sách, nút thêm mới |
| `employees/new.tsx` | sửa flow tạo hồ sơ mới |
| `employees/$employeeId/edit.tsx` | sửa flow cập nhật hồ sơ + đồng bộ sub-entity |
| `employees_/$employeeId.tsx` | sửa layout chi tiết, tab, nút “Sửa hồ sơ”, “Đánh dấu thôi việc” |
| `employees_/$employeeId/index.tsx` | sửa tab thông tin chung |
| `employees_/$employeeId/family.tsx` | sửa tab gia đình |
| `employees_/$employeeId/work-history.tsx` | sửa tab công tác |
| `employees_/$employeeId/party.tsx` | sửa tab Đảng/Đoàn |
| `employees_/$employeeId/salary.tsx` | sửa tab lương, phụ cấp, ngân hàng |

---

## 2.2 Frontend feature employees

```text
apps/frontend/src/features/employees/
├── api.ts                              # Toàn bộ query/mutation chính của employee
├── columns.tsx                         # Cột bảng danh sách nhân sự
├── types.ts                            # Kiểu aggregate phía frontend
└── components/
    ├── employee-form.tsx               # Form employee cơ bản
    └── form-helpers.tsx                # Helper dùng lại trong form lớn
```

### Ý nghĩa nhanh

| File | Mở khi cần làm gì |
|---|---|
| `api.ts` | xem route frontend gọi API nào, hook nào invalidate cache nào |
| `columns.tsx` | sửa link xem chi tiết, nút thao tác ở bảng |
| `types.ts` | sửa kiểu aggregate đọc từ backend |
| `components/employee-form.tsx` | sửa form employee đơn giản/tái sử dụng |
| `components/form-helpers.tsx` | sửa field helper, section helper cho form lớn |

---

## 2.3 Backend module Dev 3

```text
apps/backend/src/modules/
├── employees/
│   ├── index.ts                        # CRUD nhân sự chính + /me + import
│   └── employee.service.ts             # list, getAggregateById, create, update, remove
├── family-members/
│   ├── index.ts                        # CRUD family members
│   └── family-member.service.ts
├── bank-accounts/
│   ├── index.ts                        # CRUD bank accounts
│   └── bank-account.service.ts
├── previous-jobs/
│   ├── index.ts                        # CRUD previous jobs
│   └── previous-job.service.ts
├── party-memberships/
│   ├── index.ts                        # CRUD party memberships
│   └── party-membership.service.ts
├── allowances/
│   ├── index.ts                        # CRUD allowances
│   └── allowance.service.ts
└── employees-export/
    ├── index.ts                        # Export danh sách / chi tiết nhân sự
    └── employees-export.service.ts
```

### Ý nghĩa nhanh

| File | Mở khi cần làm gì |
|---|---|
| `employees/index.ts` | xem endpoint `/api/employees` nhận gì, trả gì |
| `employees/employee.service.ts` | xem logic search, aggregate, create, update |
| `family-members/*` | sửa CRUD tab gia đình |
| `bank-accounts/*` | sửa CRUD tài khoản ngân hàng |
| `previous-jobs/*` | sửa CRUD quá trình công tác |
| `party-memberships/*` | sửa CRUD Đảng/Đoàn |
| `allowances/*` | sửa CRUD phụ cấp |
| `employees-export/*` | sửa export PDF/XLSX/CSV |

---

## 2.4 Shared validator liên quan Dev 3

```text
packages/shared/src/validators/
└── employees.ts                        # schema employee + family + bank + previous job + party + allowance
```

Mở file này khi cần sửa validate dùng chung cho frontend và backend.

---

## 3. Ownership map

## Dev 3 sở hữu trực tiếp

- `employees`
- `employee_family_members`
- `employee_bank_accounts`
- `employee_previous_jobs`
- `employee_party_memberships`
- `employee_allowances`
- layout chi tiết nhân sự
- tab: thông tin chung, gia đình, công tác, Đảng/Đoàn, lương & phụ cấp
- `/my/profile`

## Có liên quan nhưng không phải trọng tâm Dev 3

- `education.tsx`
- `contracts.tsx`
- `assignments.tsx`
- `rewards.tsx`
- dữ liệu cấu hình từ Dev 2 như salary grades, allowance types, org unit dropdown

---

## 4. Khi debug thì mở file nào?

| Vấn đề | Mở file đầu tiên |
|---|---|
| Search/filter danh sách sai | `apps/frontend/src/routes/_authenticated/employees/index.tsx` |
| Query/mutation gọi sai endpoint | `apps/frontend/src/features/employees/api.ts` |
| Form tạo mới lỗi | `apps/frontend/src/routes/_authenticated/employees/new.tsx` |
| Form sửa lỗi | `apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx` |
| Tab chi tiết không ra dữ liệu | `apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx` |
| Aggregate thiếu dữ liệu | `apps/backend/src/modules/employees/employee.service.ts` |
| CRUD tab con lỗi | module backend tương ứng (`family-members`, `bank-accounts`, `previous-jobs`, `party-memberships`, `allowances`) |
| Validate sai | `packages/shared/src/validators/employees.ts` |

---

## 5. Kết luận ngắn

Dev 3 không cần nhớ toàn bộ repo. Chỉ cần nắm 4 cụm chính:

1. route frontend
2. `features/employees/api.ts`
3. backend `employees` + các sub-module
4. shared validator `employees.ts`

Đi từ 4 cụm này là lần được gần như toàn bộ flow của Employee Core.
