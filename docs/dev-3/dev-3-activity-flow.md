# Dev 3 — Luồng hoạt động

> Bản này chỉ mô tả: **bấm ở đâu → vào file nào → gọi hàm nào → chạm endpoint nào**.

---

## 1. Luồng chung của Dev 3

Hầu hết thao tác của Dev 3 đều đi theo mẫu này:

```text
Route/frontend page
→ hook/query/mutation trong apps/frontend/src/features/employees/api.ts
→ backend route trong apps/backend/src/modules/*/index.ts
→ service trong *.service.ts
→ database
→ invalidate/refetch React Query
→ UI render lại
```

### Cache key chính

Nằm trong `apps/frontend/src/features/employees/api.ts`:

- `employeeKeys.list(params)` — danh sách
- `employeeKeys.detail(id)` — chi tiết 1 nhân sự
- `employeeKeys.me()` — hồ sơ cá nhân

---

## 2. Danh sách nhân sự: tìm kiếm, lọc, phân trang

## Người dùng bấm ở đâu?

- Gõ ô tìm kiếm
- Chọn filter trạng thái / giới tính
- Chuyển trang ở bảng

## File bắt đầu

- `apps/frontend/src/routes/_authenticated/employees/index.tsx`

## Hàm / hook chính

- `EmployeesPage()`
- `useListPage(...)`
- `useQuery(employeeListOptions(params))`

## Luồng

```text
Người dùng nhập search hoặc đổi filter
→ EmployeesPage cập nhật search params / state
→ gọi employeeListOptions(params)
→ apps/frontend/src/features/employees/api.ts
  → employeeListOptions(...)
  → GET /api/employees
→ apps/backend/src/modules/employees/index.ts
  → GET "/"
  → employeeService.list(...)
→ apps/backend/src/modules/employees/employee.service.ts
  → list(...)
→ trả danh sách về DataTable
```

## Kết quả trên UI

- Bảng render lại bằng `DataTable`
- Cột link sang chi tiết lấy từ `apps/frontend/src/features/employees/columns.tsx`

---

## 3. Mở chi tiết một nhân sự

## Người dùng bấm ở đâu?

- Bấm vào tên nhân sự
- Hoặc bấm icon xem ở bảng

## File bắt đầu

- `apps/frontend/src/features/employees/columns.tsx`

## Hàm / component chính

- `getEmployeeColumns(...)`
- `<Link to="/employees/$employeeId" ... />`

## Luồng

```text
Người dùng bấm vào nhân sự trong bảng
→ route sang /employees/:employeeId
→ apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx
  → EmployeeDetailLayout()
  → useEmployeeDetail(employeeId)
→ apps/frontend/src/features/employees/api.ts
  → useEmployeeDetail(...)
  → employeeDetailOptions(id)
  → GET /api/employees/:employeeId
→ apps/backend/src/modules/employees/index.ts
  → GET "/:employeeId"
  → employeeService.getAggregateById(...)
→ apps/backend/src/modules/employees/employee.service.ts
  → getAggregateById(...)
→ layout render tab + Outlet
```

## Các tab đang dùng chung dữ liệu aggregate

| Tab | File | Dữ liệu chính |
|---|---|---|
| Thông tin chung | `employees_/$employeeId/index.tsx` | `employee`, `partyMemberships`, `bankAccounts`, `foreignWorkPermits` |
| Gia đình | `employees_/$employeeId/family.tsx` | `familyMembers` |
| Công tác | `employees_/$employeeId/work-history.tsx` | `previousJobs` |
| Đảng/Đoàn | `employees_/$employeeId/party.tsx` | `partyMemberships` |
| Lương & phụ cấp | `employees_/$employeeId/salary.tsx` | `salaryGradeStep`, `allowances`, `bankAccounts` |

## Điều hướng tab đi qua đâu?

- file: `apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx`
- component: `EmployeeDetailLayout()`
- chỗ xử lý: `onValueChange` của `<Tabs>`
- danh sách tab: hằng `TAB_ITEMS`

---

## 4. Thêm mới nhân sự

## Người dùng bấm ở đâu?

- Nút `Thêm nhân sự` ở trang danh sách

## File bắt đầu

- `apps/frontend/src/routes/_authenticated/employees/index.tsx`
- route đích: `apps/frontend/src/routes/_authenticated/employees/new.tsx`

## Hàm / hook chính

- `NewEmployeePage()`
- `createMutation = useCreateEmployee()`
- `uploadFile(file)`
- các hook tạo sub-entity:
  - `useCreateFamilyMember()`
  - `useCreateBankAccount()`
  - `useCreatePreviousJob()`
  - `useCreatePartyMembership()`
  - `useCreateDegree()`
  - `useCreateCertification()`
  - `useCreateForeignWorkPermit()`

## Luồng chính

```text
Người dùng mở form tạo mới
→ NewEmployeePage render form lớn
→ nếu upload file
  → gọi uploadFile(file)
  → POST /api/files/upload

Người dùng bấm "Lưu hồ sơ nhân sự"
→ onSubmit(data)
→ useCreateEmployee()
→ POST /api/employees
→ employees/index.ts
  → POST "/"
→ employee.service.ts
  → create(data)

Sau khi có employeeId
→ gọi tiếp các mutation tạo family/bank/job/party/degree/certificate/foreign-work-permit
→ mỗi mutation đi qua api.ts
→ xuống module backend tương ứng
```

## Backend module tương ứng khi lưu sub-entity

| Loại dữ liệu | Endpoint | Service |
|---|---|---|
| Gia đình | `/api/employees/:employeeId/family-members` | `familyMemberService.create()` |
| Ngân hàng | `/api/employees/:employeeId/bank-accounts` | `bankAccountService.create()` |
| Công tác | `/api/employees/:employeeId/previous-jobs` | `previousJobService.create()` |
| Đảng/Đoàn | `/api/employees/:employeeId/party-memberships` | `partyMembershipService.create()` |
| Phụ cấp | `/api/employees/:employeeId/allowances` | `allowanceService.create()` |

## Kết quả cuối

- thành công: `toast.success(...)` hoặc `toast.warning(...)` nếu lỗi ở phần phụ
- điều hướng về `/employees`
- danh sách được refetch nhờ invalidate `employeeKeys.lists()`

---

## 5. Sửa hồ sơ nhân sự

## Người dùng bấm ở đâu?

- Nút `Sửa` ở danh sách
- hoặc nút `Sửa hồ sơ` ở trang chi tiết

## File bắt đầu

- `apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx`

## Hàm / hook chính

- `EditEmployeePage()`
- `EditEmployeeFormContent()`
- `useQuery(employeeDetailOptions(employeeId))`
- `useUpdateEmployee()`
- `syncSubEntities(...)`

## Luồng nạp dữ liệu ban đầu

```text
Mở trang sửa
→ EditEmployeePage()
→ useQuery(employeeDetailOptions(employeeId))
→ GET /api/employees/:employeeId
→ employeeService.getAggregateById(...)
→ đổ dữ liệu vào form bằng defaultValues
```

## Luồng bấm “Lưu thay đổi”

```text
Người dùng bấm lưu
→ onSubmit(rawFormData)
→ updateMutation.mutateAsync({ id, ...employeeData })
→ PUT /api/employees/:employeeId
→ employees/index.ts
  → PUT "/:employeeId"
→ employee.service.ts
  → update(id, data)

Sau đó
→ syncSubEntities(...)
→ tự quyết định bản ghi nào create / update / delete
→ gọi mutation tương ứng cho family / bank / previous job / party / degree / certificate
```

## Hàm đáng nhớ nhất ở file edit

- `syncSubEntities(...)`
  - item mới → `create(...)`
  - item có `id` → `update(...)`
  - item đã bị xóa khỏi form → `remove(...)`

## Kết quả cuối

- thành công: về lại `/employees/$employeeId`
- cache bị invalidate ở:
  - `employeeKeys.lists()`
  - `employeeKeys.detail(employeeId)`

---

## 6. Tab lương và phụ cấp

## File chính

- `apps/frontend/src/routes/_authenticated/employees_/$employeeId/salary.tsx`

## 6.1 Sửa hệ số lương

### Người dùng bấm ở đâu?

- nút `Sửa hệ số lương`

### Hàm chính

- `openSalaryDialog()`
- `handleSalarySubmit(...)`
- `useUpdateEmployee()`

### Luồng

```text
Bấm "Sửa hệ số lương"
→ mở dialog
→ chọn ngạch / bậc lương
→ handleSalarySubmit(...)
→ updateEmployeeMutation.mutateAsync({ id, salaryGradeStepId })
→ PUT /api/employees/:employeeId
→ employee.service.ts
  → update(...)
→ refetch chi tiết nhân sự
```

## 6.2 Thêm / sửa phụ cấp

### Người dùng bấm ở đâu?

- nút `Thêm phụ cấp`
- hoặc icon bút chì ở từng dòng phụ cấp

### Hàm chính

- `openAddAllowanceDialog()`
- `openEditAllowanceDialog(allowance)`
- `handleAllowanceSubmit(...)`
- `useCreateAllowance()`
- `useUpdateAllowance()`

### Luồng

```text
Mở dialog phụ cấp
→ submit form
→ nếu đang sửa
  → useUpdateAllowance()
  → PUT /api/employees/:employeeId/allowances/:id
  → allowanceService.update(...)

→ nếu đang thêm
  → useCreateAllowance()
  → POST /api/employees/:employeeId/allowances
  → allowanceService.create(...)

→ invalidate employeeKeys.detail(employeeId)
→ tab salary render lại
```

---

## 7. Hồ sơ cá nhân `/my/profile`

## File chính

- `apps/frontend/src/routes/_authenticated/my/profile.tsx`

## Hàm / hook chính

- `MyProfilePage()`
- `useQuery(myEmployeeOptions())`

## Luồng

```text
Người dùng mở /my/profile
→ MyProfilePage()
→ myEmployeeOptions()
→ GET /api/employees/me
→ apps/backend/src/modules/employees/index.ts
  → GET "/me"
→ employee.service.ts
  → getByEmail(user.email)
  → getAggregateById(employee.id, user.role)
→ render tab hồ sơ cá nhân
```

## Các tab hồ sơ cá nhân hiện có

- `general`
- `education`
- `salary`
- `family`
- `party`

Trang này là chế độ xem, không phải flow edit chính của Dev 3.

---

## 8. Đánh dấu thôi việc

## File chính

- `apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx`

## Hàm / hook chính

- `handleConfirmResigned()`
- `useMarkResigned()`

## Luồng

```text
Người dùng bấm "Đánh dấu thôi việc"
→ mở dialog
→ nhập lý do
→ handleConfirmResigned()
→ useMarkResigned()
→ PUT /api/employees/:employeeId
   với workStatus = "terminated"
→ employee.service.ts
  → update(...)
→ invalidate list + detail
→ UI hiển thị trạng thái mới
```

---

## 9. Khi cần lần nhanh một bug

| Vấn đề | Bắt đầu từ file nào |
|---|---|
| Search/filter sai | `routes/_authenticated/employees/index.tsx` |
| Click vào nhân sự không ra chi tiết | `features/employees/columns.tsx` và `employees_/$employeeId.tsx` |
| Tạo mới không lưu được | `routes/_authenticated/employees/new.tsx` |
| Sửa hồ sơ lưu sai | `routes/_authenticated/employees/$employeeId/edit.tsx` |
| Tab lương/phụ cấp lỗi | `routes/_authenticated/employees_/$employeeId/salary.tsx` |
| API gọi sai endpoint | `features/employees/api.ts` |
| Backend aggregate thiếu dữ liệu | `modules/employees/employee.service.ts` |

---

## 10. Kết luận ngắn

Muốn hiểu Dev 3 thì chỉ cần nhớ 5 điểm:

1. danh sách đi qua `employeeListOptions()` → `employeeService.list()`
2. chi tiết đi qua `useEmployeeDetail()` → `getAggregateById()`
3. tạo mới đi qua `useCreateEmployee()` rồi mới tạo sub-entity
4. sửa hồ sơ đi qua `useUpdateEmployee()` + `syncSubEntities()`
5. tab lương/phụ cấp là nhánh riêng trong `salary.tsx`

Như vậy là đủ để đọc code và debug, không cần trace toàn bộ hệ thống ở mức quá sâu.
