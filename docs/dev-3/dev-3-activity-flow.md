# Dev 3, Activity Flow, Employee Core module

Tài liệu này mô tả luồng thực thi chi tiết cho các use case chính của module **Employee Core** trong HRMS. Mỗi luồng được lần từ thao tác của người dùng ở UI, qua route React, component, hook React Query, Eden Treaty client, backend route Elysia, service Drizzle ORM, truy vấn PostgreSQL, rồi quay lại UI.

Phạm vi tài liệu tập trung vào các use case Dev 3 phụ trách:

- UC 4.23, Tìm kiếm hồ sơ nhân sự
- UC 4.24, Lọc danh sách hồ sơ nhân sự
- UC 4.25, Thêm mới hồ sơ nhân sự
- UC 4.26, Chỉnh sửa chi tiết hồ sơ nhân sự
- UC 4.28, Xem chi tiết thông tin hồ sơ nhân sự
- UC 4.38, Xem thông tin hồ sơ cá nhân

---

## 1. Tổng quan kiến trúc luồng Employee Core

Luồng chuẩn của module này thường có dạng:

```text
Người dùng click / nhập liệu / submit
  → File route .tsx trong apps/frontend/src/routes/
    → Component route render UI
      → Hook tùy biến hoặc useQuery/useMutation
        → API layer trong apps/frontend/src/features/employees/api.ts
          → Eden Treaty gọi api.api....
            → Backend route Elysia trong apps/backend/src/modules/.../index.ts
              → authPlugin xác thực phiên đăng nhập
                → requireRole(...) kiểm tra quyền nếu route có giới hạn vai trò
                  → Service function trong *.service.ts
                    → Drizzle ORM query vào bảng PostgreSQL
                      → Trả về { data: ... }
                    ← Service trả kết quả
                  ← Route trả JSON
            ← Eden Treaty trả { data, error }
        ← React Query cập nhật cache, invalidate hoặc refetch
      ← Component render lại
  ← Người dùng thấy kết quả mới trên UI
```

### Query key quan trọng

Tất cả key nằm trong `apps/frontend/src/features/employees/api.ts`:

- `employeeKeys.all = ["employees"]`
- `employeeKeys.lists()` dùng cho danh sách
- `employeeKeys.list(params)` dùng cho từng bộ tham số danh sách
- `employeeKeys.detail(id)` dùng cho chi tiết một nhân sự
- `employeeKeys.me()` dùng cho hồ sơ cá nhân `/api/employees/me`

---

## 2. UC 4.23, Tìm kiếm hồ sơ nhân sự

### Mô tả thao tác

Người dùng ở trang danh sách nhân sự nhập từ khóa vào ô tìm kiếm để tìm theo họ tên, mã nhân sự, email, số điện thoại hoặc CCCD.

### Quyền truy cập

- Frontend route: `authorizeRoute("/employees")`
- Backend route `GET /api/employees`: chỉ cho `ADMIN`, `TCCB`, `TCKT`
- Backend dùng `authPlugin` + `requireRole(user.role, "ADMIN", "TCCB", "TCKT")`

### Luồng thực thi chi tiết

```text
Người dùng gõ vào ô Input tìm kiếm
  → apps/frontend/src/routes/_authenticated/employees/index.tsx
    → Route = createFileRoute("/_authenticated/employees/")
    → component EmployeesPage
      → <Input ... onChange={(e) => setSearchText(e.target.value)} />
        → hook useListPage(...) trong apps/frontend/src/hooks/use-list-page.ts
          → setSearchText(value) cập nhật state cục bộ searchText
          → useDebounce(searchText) tạo debouncedValue
          → trả ra debouncedSearch = debouncedValue || undefined
      → EmployeesPage tạo params:
        { page, pageSize, search: debouncedSearch, workStatus, gender, orgUnitId }
      → useQuery(employeeListOptions(params))
        → apps/frontend/src/features/employees/api.ts
          → employeeListOptions(params)
            → queryKey = employeeKeys.list(params)
            → queryFn làm sạch params rỗng bằng Object.entries(...).filter(...)
            → Eden Treaty call:
              api.api.employees.get({ query: edenBody(cleanParams) })
                → HTTP GET /api/employees?search=...&page=...&pageSize=...
                  → apps/backend/src/modules/employees/index.ts
                    → .get("/", async ({ query, user }) => { ... })
                    → authPlugin xác thực người dùng
                    → requireRole(user.role, "ADMIN", "TCCB", "TCKT")
                    → gọi employeeService.list(
                        query.page,
                        query.pageSize,
                        query.search,
                        query.orgUnitId,
                        query.workStatus,
                        query.contractStatus,
                        query.gender,
                        query.academicRank,
                        query.positionTitle,
                      )
                      → apps/backend/src/modules/employees/employee.service.ts
                        → list(...)
                          → normalizeOptional(search)
                          → tạo conditions: SQL[]
                          → nếu có search thì thêm or(
                              ilike(employees.fullName, `%search%`),
                              ilike(employees.staffCode, `%search%`),
                              ilike(employees.email, `%search%`),
                              ilike(employees.phone, `%search%`),
                              ilike(employees.nationalId, `%search%`)
                            )
                          → where = and(...conditions) hoặc undefined
                          → itemsQuery = db.select().from(employees).where(where)
                          → Promise.all([
                              itemsQuery.limit(pageSize)
                                .offset((page - 1) * pageSize)
                                .orderBy(employees.createdAt),
                              countRows(employees, where)
                            ])
                            → truy vấn bảng `employees`
                          → buildPaginatedResponse(items, total, page, pageSize)
                          → trả object phân trang
                    ← backend route trả `{ data }`
              ← Eden Treaty nhận `{ data, error }`
            → nếu `error` thì `throw handleApiError(error)`
            → nếu thành công thì return `data`
      ← React Query đưa dữ liệu vào cache theo `employeeKeys.list(params)`
    ← EmployeesPage lấy `result = data?.data`
    → `DataTable` render `result.items`
    → `getEmployeeColumns(deleteMutation)` định nghĩa cột, trong đó `fullName` là Link sang chi tiết
  ← Người dùng thấy danh sách đã thu hẹp theo từ khóa
```

### Cập nhật UI sau phản hồi

- `DataTable` nhận:
  - `data={result?.items ?? []}`
  - `pageCount={Math.ceil(result.total / pageSize)}`
- Nếu không có kết quả, UI hiển thị `emptyMessage="Không có nhân sự nào"`

### Xử lý lỗi

- Ở frontend, `employeeListOptions` ném lỗi qua `handleApiError(error)`.
- `EmployeesPage` kiểm tra `isError` từ `useQuery`.
- Khi lỗi, trang hiển thị `QueryError` từ `@/components/shared/query-error` và cho phép `refetch`.

---

## 3. UC 4.24, Lọc danh sách hồ sơ nhân sự

### Mô tả thao tác

Người dùng đổi bộ lọc như trạng thái làm việc hoặc giới tính ở trang danh sách nhân sự. URL search params thay đổi, query key đổi theo, và React Query refetch dữ liệu mới.

### Quyền truy cập

Giống UC 4.23:

- Frontend: `authorizeRoute("/employees")`
- Backend: `GET /api/employees`
- Vai trò: `ADMIN`, `TCCB`, `TCKT`

### Luồng thực thi chi tiết

```text
Người dùng chọn filter Trạng thái hoặc Giới tính
  → apps/frontend/src/routes/_authenticated/employees/index.tsx
    → EmployeesPage
      → <Select value={search.workStatus ?? "all"} ...>
        hoặc <Select value={search.gender ?? "all"} ...>
      → onValueChange(v) gọi navigate({ search: (prev) => ({ ...prev, filter mới, page: 1 }) })
        → TanStack Router cập nhật URL search params
        → Route.useSearch() trả search mới
      → EmployeesPage dựng lại params:
        {
          page: search.page,
          pageSize: search.pageSize,
          search: debouncedSearch,
          workStatus: search.workStatus,
          gender: search.gender,
          orgUnitId: search.orgUnitId,
        }
      → useQuery(employeeListOptions(params)) nhận queryKey mới
        → apps/frontend/src/features/employees/api.ts
          → employeeListOptions(params)
            → queryKey = employeeKeys.list(params)
            → Eden Treaty call:
              api.api.employees.get({ query: edenBody(cleanParams) })
                → HTTP GET /api/employees?workStatus=...&gender=...&page=1&pageSize=...
                  → apps/backend/src/modules/employees/index.ts
                    → .get("/", ...)
                    → authPlugin
                    → requireRole(user.role, "ADMIN", "TCCB", "TCKT")
                    → employeeService.list(...)
                      → apps/backend/src/modules/employees/employee.service.ts
                        → list(...)
                          → nếu có `workStatus` thì conditions.push(eq(employees.workStatus, normalizedWorkStatus))
                          → nếu có `gender` thì conditions.push(eq(employees.gender, normalizedGender))
                          → nếu có `orgUnitId` thì conditions.push(eq(employees.currentOrgUnitId, normalizedOrgUnitId))
                          → nếu có `contractStatus` thì eq(employees.contractStatus, normalizedContractStatus)
                          → nếu có `academicRank` thì eq(employees.academicRank, normalizedAcademicRank)
                          → nếu có `positionTitle` thì ilike(employees.currentPositionTitle, `%...%`)
                          → thực thi truy vấn bảng `employees`
                          → buildPaginatedResponse(...)
                    ← trả `{ data }`
              ← Eden Treaty trả `{ data, error }`
      ← React Query cập nhật cache cho key lọc mới
    ← EmployeesPage render lại `DataTable`
  ← Người dùng thấy danh sách theo bộ lọc vừa chọn
```

### Điểm cần lưu ý

- `navigate({ search: ... })` là điểm bắt đầu của filter flow, không phải state cục bộ như search text.
- Việc đổi filter đặt lại `page: 1`, tránh trường hợp người dùng đang ở trang cuối nhưng bộ lọc mới có ít kết quả.
- Flow backend và response shape giống UC 4.23, chỉ khác điều kiện `WHERE` được thêm vào.

### Xử lý lỗi

- Giống UC 4.23, lỗi query được bọc bởi `handleApiError` và hiển thị qua `QueryError`.

---

## 4. UC 4.25, Thêm mới hồ sơ nhân sự

### Mô tả thao tác

Người dùng mở form tạo nhân sự mới, nhập thông tin nhân sự chính, nhập các phần con như gia đình, ngân hàng, lịch sử công tác, đảng/đoàn, bằng cấp, chứng chỉ, giấy phép lao động, rồi bấm lưu.

### Quyền truy cập

- Frontend route file: `apps/frontend/src/routes/_authenticated/employees/new.tsx`
- Backend `POST /api/employees`: chỉ `ADMIN`, `TCCB`
- Backend các endpoint sub-entity `POST /api/employees/:employeeId/...`: chỉ `ADMIN`, `TCCB`
- Các route đều qua `authPlugin` trước khi vào handler

### Luồng chính, pha 0, tải file chân dung hoặc PDF

Luồng upload file không đi qua Eden Treaty mà dùng raw `fetch`.

```text
Người dùng chọn ảnh chân dung hoặc PDF
  → apps/frontend/src/routes/_authenticated/employees/new.tsx
    → NewEmployeePage
      → handler onChange của input type="file"
        → gọi uploadFile(file)
          → apps/frontend/src/features/employees/api.ts
            → uploadFile(file)
              → tạo FormData
              → fetch(`${apiBaseUrl}/api/files/upload`, {
                  method: "POST",
                  body: formData,
                  credentials: "include"
                })
              → nếu lỗi network: throw handleApiError({ error: "Không thể tải ảnh lên" })
              → nếu response không ok: throw handleApiError(payload)
              → nếu payload không đúng shape `{ data: UploadedFile }`: throw handleApiError(...)
              → return payload.data
      ← NewEmployeePage nhận `uploadedFile.id`
      → form.setValue("portraitFileId", uploadedFile.id, ...)
      hoặc setValue cho `workPermitFileId`, `degrees.${index}.degreeFileId`, `certificates.${index}.certFileId`
  ← UI đổi trạng thái nút thành "Đã tải..." hoặc hiện preview ảnh
```

### Luồng chính, pha 1, tạo bản ghi nhân sự chính

```text
Người dùng bấm nút "Lưu hồ sơ nhân sự"
  → apps/frontend/src/routes/_authenticated/employees/new.tsx
    → NewEmployeePage
      → <form onSubmit={form.handleSubmit(onSubmit)}>
      → react-hook-form + zodResolver(formSchema) validate toàn bộ dữ liệu
      → onSubmit(data: FormValues)
        → dựng employeePayload: CreateEmployeeInput
        → gọi createMutation.mutateAsync(employeePayload)
          → hook useCreateEmployee() trong apps/frontend/src/features/employees/api.ts
            → useMutation({ mutationFn, onSuccess })
            → mutationFn:
              api.api.employees.post(edenBody(input))
                → HTTP POST /api/employees
                  → apps/backend/src/modules/employees/index.ts
                    → .post("/", async ({ body, user }) => ...)
                    → authPlugin
                    → requireRole(user.role, "ADMIN", "TCCB")
                    → employeeService.create(body)
                      → apps/backend/src/modules/employees/employee.service.ts
                        → create(data)
                          → normalizeOptional(data.nationalId), normalizeOptional(data.email), normalizeOptional(staffCode)
                          → nếu thiếu nationalId hoặc email thì ném `FieldValidationError`
                          → payload = undefinedToNull(...)
                          → db.transaction(async (tx) => { ... })
                            → kiểm tra trùng `employees.nationalId`
                            → kiểm tra trùng `employees.email`
                            → nếu có staffCode thì kiểm tra trùng `employees.staffCode`
                            → tx.insert(employees).values(insertValues).returning()
                              → ghi vào bảng `employees`
                          → trả bản ghi employee vừa tạo
                    ← backend route trả `{ data: createdEmployee }`
              ← Eden Treaty trả `{ data, error }`
            → nếu thành công, `onSuccess` invalidate `employeeKeys.lists()`
        ← NewEmployeePage lấy `result.data.id` làm `employeeId`
```

### Luồng chính, pha 2, tạo các sub-entity song song

Sau khi có `employeeId`, form gọi nhiều mutation song song bằng `Promise.all(subEntityPromises)`.

#### 4.25.1. Thêm thành viên gia đình

```text
NewEmployeePage lặp `for (const fm of data.familyMembers ?? [])`
  → createFamilyMember.mutateAsync({ employeeId, relation, fullName })
    → useCreateFamilyMember()
      → api.api.employees({ employeeId })["family-members"].post(edenBody(input))
        → POST /api/employees/:employeeId/family-members
          → apps/backend/src/modules/family-members/index.ts
            → authPlugin
            → requireRole(user.role, "ADMIN", "TCCB")
            → familyMemberService.create(params.employeeId, body)
              → apps/backend/src/modules/family-members/family-member.service.ts
                → db.insert(employeeFamilyMembers).values({ ...data, employeeId }).returning()
                  → bảng `employee_family_members`
          ← trả `{ data }`
    ← onSuccess invalidate `employeeKeys.detail(employeeId)`
```

#### 4.25.2. Thêm tài khoản ngân hàng

```text
NewEmployeePage lặp `bankAccounts`
  → createBankAccount.mutateAsync({ employeeId, bankName, accountNo })
    → useCreateBankAccount()
      → api.api.employees({ employeeId })["bank-accounts"].post(...)
        → POST /api/employees/:employeeId/bank-accounts
          → apps/backend/src/modules/bank-accounts/index.ts
            → authPlugin + requireRole("ADMIN", "TCCB")
            → bankAccountService.create(employeeId, body)
              → apps/backend/src/modules/bank-accounts/bank-account.service.ts
                → countRows(employeeBankAccounts, eq(employeeBankAccounts.employeeId, employeeId))
                → nếu là tài khoản đầu tiên hoặc `isPrimary` được chọn thì transaction:
                  → update các bản ghi cũ `isPrimary = false`
                  → insert tài khoản mới `isPrimary = true`
                → ngược lại insert trực tiếp
                → bảng `employee_bank_accounts`
```

#### 4.25.3. Thêm lịch sử công tác

```text
NewEmployeePage lặp `previousJobs`
  → createPreviousJob.mutateAsync({ employeeId, workplace, startedOn, endedOn })
    → useCreatePreviousJob()
      → POST /api/employees/:employeeId/previous-jobs
        → previousJobRoutes trong apps/backend/src/modules/previous-jobs/index.ts
        → previousJobService.create(...) trong previous-job.service.ts
          → db.insert(employeePreviousJobs).values({ ...data, employeeId }).returning()
            → bảng `employee_previous_jobs`
```

#### 4.25.4. Thêm thông tin Đảng, Đoàn

```text
NewEmployeePage lặp `partyMemberships`
  → createPartyMembership.mutateAsync({ employeeId, organizationType, joinedOn, details })
    → useCreatePartyMembership()
      → POST /api/employees/:employeeId/party-memberships
        → partyMembershipRoutes trong apps/backend/src/modules/party-memberships/index.ts
        → partyMembershipService.create(...) trong party-membership.service.ts
          → db.insert(employeePartyMemberships).values({ ...data, employeeId }).returning()
            → bảng `employee_party_memberships`
```

#### 4.25.5. Thêm bằng cấp

```text
NewEmployeePage lặp `degrees`
  → createDegree.mutateAsync({ employeeId, degreeName, school, degreeFileId })
    → useCreateDegree()
      → POST /api/employees/:employeeId/degrees
        → degreeRoutes trong apps/backend/src/modules/degrees/index.ts
        → degreeService.create(...) trong degree.service.ts
          → db.insert(employeeDegrees).values({ ...data, employeeId }).returning()
            → bảng `employee_degrees`
```

#### 4.25.6. Thêm chứng chỉ

```text
NewEmployeePage lặp `certificates`
  → createCertification.mutateAsync({ employeeId, certName, issuedBy, certFileId })
    → useCreateCertification()
      → POST /api/employees/:employeeId/certifications
        → certificationRoutes trong apps/backend/src/modules/certifications/index.ts
        → certificationService.create(...) trong certification.service.ts
          → db.insert(employeeCertifications).values({ ...data, employeeId }).returning()
            → bảng `employee_certifications`
```

#### 4.25.7. Thêm giấy phép lao động cho người nước ngoài

```text
Nếu `data.isForeigner` và có dữ liệu giấy phép
  → createForeignWorkPermit.mutateAsync({ employeeId, visaNo, visaExpiresOn, passportNo, ... })
    → useCreateForeignWorkPermit()
      → POST /api/employees/:employeeId/foreign-work-permits
        → foreignWorkPermitRoutes trong apps/backend/src/modules/foreign-work-permits/index.ts
        → foreignWorkPermitService.create(...) trong foreign-work-permit.service.ts
          → db.insert(employeeForeignWorkPermits).values({ ...data, employeeId }).returning()
            → bảng `employee_foreign_work_permits`
```

### Kết thúc luồng thành công

```text
Promise.all(subEntityPromises) hoàn tất
  → nếu có lỗi cục bộ ở sub-entity
    → toast.warning("Đã tạo nhân sự nhưng một số thông tin bổ sung lỗi: ...")
  → nếu không có lỗi
    → toast.success("Thêm nhân sự thành công")
  → navigate({ to: "/employees" })
    → quay lại trang danh sách
    → query danh sách đã bị invalidate bởi useCreateEmployee nên sẽ lấy dữ liệu mới khi cần
```

### Xử lý lỗi

- Lỗi validate phía form:
  - `zodResolver(formSchema)` chặn submit nếu dữ liệu không hợp lệ.
- Lỗi backend của employee chính:
  - `createMutation.mutateAsync` throw error.
  - `catch` gọi `applyFieldErrors(form.setError, error)` để map lỗi field như email, nationalId.
  - Nếu không phải `ApiResponseError` thì hiện `toast.error("Có lỗi xảy ra")`.
- Lỗi sub-entity:
  - Không rollback employee chính.
  - Mỗi promise tự `.catch(...)` rồi đẩy message vào `subEntityErrors`.
  - Kết quả cuối là warning, không fail toàn bộ.
- Nếu backend trả về employee nhưng không có `id`, UI báo `toast.error("Không thể tạo nhân sự. Vui lòng thử lại.")`.

---

## 5. UC 4.26, Chỉnh sửa chi tiết hồ sơ nhân sự

### Mô tả thao tác

Người dùng có quyền mở trang sửa hồ sơ nhân sự, chỉnh dữ liệu nhân sự chính và các mảng con, rồi bấm lưu. Hệ thống cập nhật `employees` trước, sau đó đồng bộ create, update, delete cho từng sub-entity.

### Quyền truy cập

- Frontend vào chi tiết từ `apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx`
- Nút sửa xuất hiện khi:
  - `user.role === "TCCB" || user.role === "ADMIN"`
  - và `emp.workStatus !== "terminated"`
- File edit route: `apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx`
- Backend `PUT /api/employees/:employeeId`: `ADMIN`, `TCCB`
- Backend các route sub-entity `PUT`, `POST`, `DELETE`: `ADMIN`, `TCCB`

### 5.1. Mở trang chỉnh sửa và nạp dữ liệu ban đầu

```text
Người dùng bấm nút "Sửa hồ sơ"
  → apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx
    → EmployeeDetailLayout
      → <Link to="/employees/$employeeId/edit" params={{ employeeId }}>
  → chuyển route sang apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx
    → Route = createFileRoute("/_authenticated/employees/$employeeId/edit")
    → component EditEmployeePage
      → const { employeeId } = Route.useParams()
      → useQuery(employeeDetailOptions(employeeId))
        → employeeDetailOptions(id)
        → api.api.employees({ employeeId: id }).get()
          → GET /api/employees/:employeeId
            → apps/backend/src/modules/employees/index.ts
              → authPlugin
              → requireRole(user.role, "ADMIN", "TCCB", "TCKT")
              → employeeService.getAggregateById(id, user.role)
                → apps/backend/src/modules/employees/employee.service.ts
                  → getById(id) đọc bảng `employees`
                  → Promise.all([
                      select employeeFamilyMembers,
                      select employeeBankAccounts,
                      select employeePreviousJobs,
                      select employeePartyMemberships,
                      select employeeAllowances innerJoin allowanceTypes,
                      select employeeDegrees,
                      select employeeCertifications,
                      select employeeForeignWorkPermits,
                      select employmentContracts,
                      select employeeEvaluations
                    ])
                  → filterEvaluationsByRole(evaluationsRaw, userRole)
                  → trả aggregate gồm employee + toàn bộ sub-entity
      ← EditEmployeePage nhận aggregate
      → nếu `isLoading` hiển thị `FormSkeleton`
      → nếu không có aggregate hiển thị "Không tìm thấy thông tin nhân sự."
      → nếu `emp.workStatus` không thuộc `["pending", "working"]`
        → chặn chỉnh sửa và hiện thông báo trạng thái hiện tại
      → nếu hợp lệ, render `EditEmployeeFormContent`
        → useForm(...) khởi tạo defaultValues từ aggregate
        → useFieldArray cho familyMembers, bankAccounts, previousJobs, partyMemberships, degrees, certificates
        → useMemo giữ `initialIds` để phát hiện bản ghi bị xóa khi submit
```

### 5.2. Submit cập nhật thông tin nhân sự chính

```text
Người dùng bấm nút "Lưu thay đổi"
  → EditEmployeeFormContent
    → form.handleSubmit(onSubmit)
    → onSubmit(rawFormData)
      → editFormSchema.parse(rawFormData)
      → tách các mảng sub-entity ra khỏi employeeData
      → cleanedEmployeeData = lọc bỏ optional fields có giá trị rỗng
      → updateMutation.mutateAsync({ id: employeeId, ...cleanedEmployeeData })
        → useUpdateEmployee() trong apps/frontend/src/features/employees/api.ts
          → api.api.employees({ employeeId: id }).put(edenBody(input))
            → HTTP PUT /api/employees/:employeeId
              → apps/backend/src/modules/employees/index.ts
                → authPlugin
                → requireRole(user.role, "ADMIN", "TCCB")
                → employeeService.update(params.employeeId, body)
                  → apps/backend/src/modules/employees/employee.service.ts
                    → getById(id) từ bảng `employees`
                    → nếu `existing.workStatus` không thuộc pending/working
                      → throw BadRequestError("Không thể chỉnh sửa hồ sơ ở trạng thái hiện tại")
                    → nếu body rỗng
                      → throw FieldValidationError({}, "Không có dữ liệu cập nhật")
                    → db.transaction(async (tx) => { ... })
                      → nếu nationalId đổi, kiểm tra trùng bằng:
                        and(eq(employees.nationalId, nationalId), ne(employees.id, id))
                      → nếu email đổi, kiểm tra trùng bằng:
                        and(eq(employees.email, email), ne(employees.id, id))
                      → tx.update(employees)
                          .set({ ...data, updatedAt: new Date() })
                          .where(eq(employees.id, id))
                          .returning()
                        → cập nhật bảng `employees`
              ← route trả `{ data: updatedEmployee }`
        ← useUpdateEmployee onSuccess invalidate:
          - `employeeKeys.lists()`
          - `employeeKeys.detail(vars.id)`
```

### 5.3. Submit đồng bộ create, update, delete cho sub-entity

Sau khi cập nhật employee chính xong, trang gọi `syncSubEntities(...)` cho từng mảng con. Đây là hàm nội bộ ngay trong `apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx`.

#### Cách `syncSubEntities(...)` hoạt động

```text
syncSubEntities({ items, initialIds, create, update, remove, promises, errors })
  → tạo currentIds từ các item có id
  → duyệt initialIds:
    → id nào không còn trong currentIds thì push promise remove(id)
  → duyệt items hiện tại:
    → item có id thì push promise update(id, body)
    → item chưa có id thì push promise create(body)
  → mọi lỗi được gom vào `errors[]`
```

#### 5.3.1. Đồng bộ family members

```text
syncSubEntities cho familyMembers
  → create: useCreateFamilyMember().mutateAsync({ employeeId, ...body })
    → POST /api/employees/:employeeId/family-members
    → familyMemberService.create(...)
    → insert bảng `employee_family_members`
  → update: useUpdateFamilyMember().mutateAsync({ employeeId, id, ...body })
    → PUT /api/employees/:employeeId/family-members/:id
    → familyMemberService.update(...)
      → getById(id)
      → kiểm tra đúng employeeId
      → update `employee_family_members`, set updatedAt
  → remove: useDeleteFamilyMember().mutateAsync({ employeeId, id })
    → DELETE /api/employees/:employeeId/family-members/:id
    → familyMemberService.remove(...)
      → delete `employee_family_members`
  → mỗi mutation onSuccess invalidate `employeeKeys.detail(employeeId)`
```

#### 5.3.2. Đồng bộ bank accounts

```text
syncSubEntities cho bankAccounts
  → create: POST /api/employees/:employeeId/bank-accounts
    → bankAccountService.create(...)
    → insert `employee_bank_accounts`
    → nếu `isPrimary` hoặc là tài khoản đầu tiên thì transaction reset các tài khoản khác về non-primary
  → update: PUT /api/employees/:employeeId/bank-accounts/:id
    → bankAccountService.update(...)
    → nếu `data.isPrimary` thì transaction reset tài khoản khác rồi update tài khoản hiện tại
  → remove: DELETE /api/employees/:employeeId/bank-accounts/:id
    → bankAccountService.remove(...)
    → delete `employee_bank_accounts`
```

#### 5.3.3. Đồng bộ previous jobs

```text
syncSubEntities cho previousJobs
  → create/update/delete qua previousJobRoutes
    → previousJobService.create/update/remove
    → tác động bảng `employee_previous_jobs`
```

#### 5.3.4. Đồng bộ party memberships

```text
syncSubEntities cho partyMemberships
  → create/update/delete qua partyMembershipRoutes
    → partyMembershipService.create/update/remove
    → tác động bảng `employee_party_memberships`
```

#### 5.3.5. Đồng bộ degrees

```text
syncSubEntities cho degrees
  → create: POST /api/employees/:employeeId/degrees
    → degreeService.create(...)
    → insert `employee_degrees`
  → update: PUT /api/employees/:employeeId/degrees/:id
    → degreeService.update(...)
    → update `employee_degrees`
  → remove: DELETE /api/employees/:employeeId/degrees/:id
    → degreeService.remove(...)
    → delete `employee_degrees`
```

#### 5.3.6. Đồng bộ certifications

```text
syncSubEntities cho certificates
  → create/update/delete qua certificationRoutes
    → certificationService.create/update/remove
    → tác động bảng `employee_certifications`
```

#### 5.3.7. Đồng bộ foreign work permits

Foreign work permit không dùng `syncSubEntities`, mà xử lý riêng vì UI chỉ thao tác bản ghi đầu tiên.

```text
Nếu formData.isForeigner và có dữ liệu giấy phép
  → nếu aggregate ban đầu có `foreignWorkPermitsData[0]?.id`
    → updateForeignWorkPermitMutation.mutateAsync({ employeeId, id, ...permitPayload })
      → PUT /api/employees/:employeeId/foreign-work-permits/:id
      → foreignWorkPermitService.update(...)
      → update `employee_foreign_work_permits`
  → ngược lại
    → createForeignWorkPermitMutation.mutateAsync({ employeeId, ...permitPayload })
      → POST /api/employees/:employeeId/foreign-work-permits
      → foreignWorkPermitService.create(...)
      → insert `employee_foreign_work_permits`
```

### 5.4. Kết thúc luồng cập nhật

```text
await Promise.all(promises)
  → nếu `subEntityErrors.length > 0`
    → toast.warning("Đã lưu thông tin chính nhưng lỗi: ...")
  → nếu không có lỗi
    → toast.success("Cập nhật hồ sơ thành công")
  → navigate({ to: "/employees/$employeeId", params: { employeeId } })
    → quay lại trang chi tiết
    → query detail đã bị invalidate nên dữ liệu mới sẽ được refetch
```

### 5.5. Chỉnh sửa hệ số lương và phụ cấp từ tab Salary

Ngoài trang edit tổng thể, UC 4.26 còn có một nhánh chỉnh sửa ngay trong tab lương, phụ cấp.

#### 5.5.1. Sửa hệ số lương

```text
Người dùng ở tab Lương và phụ cấp bấm "Sửa hệ số lương"
  → apps/frontend/src/routes/_authenticated/employees_/$employeeId/salary.tsx
    → component SalaryTab
      → openSalaryDialog()
      → Dialog mở ra với selectedGradeId và selectedStepId hiện tại
      → người dùng chọn Ngạch viên chức
        → dữ liệu dropdown lấy từ useQuery(salaryGradeDropdownOptions())
      → người dùng chọn Bậc lương
        → dữ liệu step lấy từ useQuery(salaryGradeStepsOptions(selectedGradeId))
      → submit form `handleSalarySubmit`
        → updateEmployeeMutation.mutateAsync({ id: employeeId, salaryGradeStepId: selectedStepId })
          → hook useUpdateEmployee() trong apps/frontend/src/features/employees/api.ts
            → api.api.employees({ employeeId: id }).put(edenBody(input))
              → HTTP PUT /api/employees/:employeeId
                → apps/backend/src/modules/employees/index.ts
                  → authPlugin
                  → requireRole(user.role, "ADMIN", "TCCB")
                  → employeeService.update(params.employeeId, body)
                    → apps/backend/src/modules/employees/employee.service.ts
                      → getById(id) từ bảng `employees`
                      → kiểm tra trạng thái hồ sơ còn cho phép sửa
                      → db.transaction(...)
                        → tx.update(employees)
                            .set({ salaryGradeStepId: selectedStepId, updatedAt: new Date() })
                            .where(eq(employees.id, id))
                            .returning()
                          → cập nhật bảng `employees`
              ← backend trả `{ data }`
          ← useUpdateEmployee onSuccess invalidate:
            - `employeeKeys.lists()`
            - `employeeKeys.detail(employeeId)`
      ← SalaryTab hiển thị `toast.success("Cập nhật hệ số lương thành công")`
      → đóng dialog
  ← UI refetch chi tiết và hiện hệ số lương mới
```

#### 5.5.2. Thêm phụ cấp

```text
Người dùng bấm "Thêm phụ cấp"
  → apps/frontend/src/routes/_authenticated/employees_/$employeeId/salary.tsx
    → SalaryTab
      → openAddAllowanceDialog()
      → allowanceForm dùng `zodResolver(createEmployeeAllowanceSchema)`
      → loại phụ cấp lấy từ useQuery(allowanceTypeListOptions({ page: 1, pageSize: 100, search: undefined }))
      → người dùng submit form
        → handleAllowanceSubmit
          → createAllowanceMutation.mutateAsync({ employeeId, ...values })
            → hook useCreateAllowance() trong apps/frontend/src/features/employees/api.ts
              → api.api.employees({ employeeId }).allowances.post(edenBody(input))
                → HTTP POST /api/employees/:employeeId/allowances
                  → apps/backend/src/modules/allowances/index.ts
                    → authPlugin
                    → requireRole(user.role, "ADMIN", "TCCB")
                    → allowanceService.create(params.employeeId, body)
                      → apps/backend/src/modules/allowances/allowance.service.ts
                        → ensureAllowanceTypeExists(data.allowanceTypeId)
                          → db.select({ id: allowanceTypes.id }).from(allowanceTypes)...
                            → kiểm tra bảng `allowance_types`
                        → normalizeAmount(amount)
                        → db.insert(employeeAllowances).values(payload).returning()
                          → insert bảng `employee_allowances`
                  ← backend route trả `{ data }`
            ← useCreateAllowance onSuccess invalidate `employeeKeys.detail(employeeId)`
      ← SalaryTab hiển thị `toast.success("Thêm phụ cấp thành công")`
      → closeAllowanceDialog()
  ← UI refetch chi tiết, bảng phụ cấp hiển thị dòng mới
```

#### 5.5.3. Sửa phụ cấp

```text
Người dùng bấm icon bút chì ở một dòng phụ cấp
  → apps/frontend/src/routes/_authenticated/employees_/$employeeId/salary.tsx
    → SalaryTab
      → openEditAllowanceDialog(allowance)
      → allowanceForm.reset({ allowanceTypeId, amount, note })
      → submit form
        → handleAllowanceSubmit
          → updateAllowanceMutation.mutateAsync({ employeeId, id: editingAllowance.id, ...values })
            → hook useUpdateAllowance() trong apps/frontend/src/features/employees/api.ts
              → api.api.employees({ employeeId }).allowances({ id }).put(edenBody(input))
                → HTTP PUT /api/employees/:employeeId/allowances/:id
                  → apps/backend/src/modules/allowances/index.ts
                    → authPlugin
                    → requireRole(user.role, "ADMIN", "TCCB")
                    → allowanceService.update(employeeId, id, body)
                      → apps/backend/src/modules/allowances/allowance.service.ts
                        → getByIdForEmployee(employeeId, id)
                          → db.select().from(employeeAllowances)...
                        → nếu có `allowanceTypeId` mới thì ensureAllowanceTypeExists(...)
                        → normalizeAmount(amount)
                        → db.update(employeeAllowances)
                            .set({ ...payload, updatedAt: new Date() })
                            .where(and(eq(employeeAllowances.id, id), eq(employeeAllowances.employeeId, employeeId)))
                            .returning()
                          → cập nhật bảng `employee_allowances`
                  ← backend route trả `{ data }`
            ← useUpdateAllowance onSuccess invalidate `employeeKeys.detail(employeeId)`
      ← SalaryTab hiển thị `toast.success("Cập nhật phụ cấp thành công")`
      → closeAllowanceDialog()
  ← UI refetch chi tiết và hiển thị phụ cấp đã cập nhật
```

#### 5.5.4. Ghi chú về xóa phụ cấp

Hiện tại `apps/frontend/src/routes/_authenticated/employees_/$employeeId/salary.tsx` chưa render nút xóa phụ cấp, dù API layer đã có `useDeleteAllowance()` và backend đã có `DELETE /api/employees/:employeeId/allowances/:id`. Vì vậy, trong activity flow hiện tại của UC 4.26, thao tác xóa phụ cấp chưa xuất hiện ở UI.

### Xử lý lỗi

- Nếu hồ sơ ở trạng thái `terminated`, frontend chặn sửa ngay trong `EditEmployeePage`.
- Nếu backend vẫn nhận request sửa cho hồ sơ không hợp lệ, `employeeService.update()` ném `BadRequestError`.
- `applyFieldErrors(form.setError, error)` map lỗi field vào form.
- Các lỗi sub-entity được gom theo cơ chế warning, không rollback phần employee chính.
- Upload file trên trang edit dùng lại `uploadFile(file)` giống UC 4.25.

---

## 6. UC 4.28, Xem chi tiết thông tin hồ sơ nhân sự

### Mô tả thao tác

Người dùng mở chi tiết một nhân sự từ danh sách, xem tab thông tin chung và các tab con như gia đình, lịch sử công tác, đảng/đoàn, lương và phụ cấp. Dữ liệu gốc được lấy qua một aggregate endpoint duy nhất là `GET /api/employees/:employeeId`.

### Quyền truy cập

- Frontend route: `authorizeRoute("/employees")`
- Backend `GET /api/employees/:employeeId`: `ADMIN`, `TCCB`, `TCKT`
- Backend dùng `authPlugin` + `requireRole(user.role, "ADMIN", "TCCB", "TCKT")`

### 6.1. Từ danh sách sang trang chi tiết

```text
Người dùng click tên nhân sự hoặc icon con mắt
  → apps/frontend/src/features/employees/columns.tsx
    → getEmployeeColumns(deleteMutation)
      → cột fullName render:
        <Link to="/employees/$employeeId" params={{ employeeId: row.original.id }} />
      → cột actions cũng có Link tương tự với icon Eye
  → TanStack Router chuyển sang route detail
    → apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx
      → EmployeeDetailLayout
```

### 6.2. Nạp aggregate cho layout chi tiết

```text
EmployeeDetailLayout mount
  → const { employeeId } = Route.useParams()
  → gọi useEmployeeDetail(employeeId)
    → apps/frontend/src/features/employees/api.ts
      → useEmployeeDetail(id)
        → useQuery(employeeDetailOptions(id))
          → employeeDetailOptions(id)
            → queryKey = employeeKeys.detail(id)
            → Eden Treaty call: api.api.employees({ employeeId: id }).get()
              → HTTP GET /api/employees/:employeeId
                → apps/backend/src/modules/employees/index.ts
                  → authPlugin
                  → requireRole(user.role, "ADMIN", "TCCB", "TCKT")
                  → employeeService.getAggregateById(id, user.role)
                    → apps/backend/src/modules/employees/employee.service.ts
                      → getById(id) từ bảng `employees`
                      → Promise.all đọc song song:
                        - `employee_family_members`
                        - `employee_bank_accounts`
                        - `employee_previous_jobs`
                        - `employee_party_memberships`
                        - `employee_allowances` JOIN `allowance_types`
                        - `employee_degrees`
                        - `employee_certifications`
                        - `employee_foreign_work_permits`
                        - `employment_contracts`
                        - `employee_evaluations`
                      → filterEvaluationsByRole(...) lọc theo `user.role`
                      → trả aggregate object
            ← useQuery nhận `data`
        → useEmployeeDetail trả `{ aggregate, employee, isLoading }`
  ← EmployeeDetailLayout dùng `emp`, `aggregate`
```

### 6.3. Điều hướng tab trong chi tiết

`EmployeeDetailLayout` chứa hằng `TAB_ITEMS`:

- `""` → Thông tin chung
- `"/family"` → Gia đình
- `"/work-history"` → Lịch sử công tác
- `"/education"` → Trình độ
- `"/party"` → Đảng/Đoàn
- `"/salary"` → Lương và phụ cấp
- `"/contracts"` → Hợp đồng
- `"/assignments"` → Bổ nhiệm
- `"/rewards"` → Khen thưởng/Kỷ luật

Luồng tab:

```text
Người dùng click tab trong <Tabs>
  → apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx
    → EmployeeDetailLayout
      → onValueChange(val)
        → tìm tab trong TAB_ITEMS
        → navigate({ to: `/employees/$employeeId${tab.path}`, params: { employeeId } })
  → TanStack Router render child route tương ứng trong <Outlet />
  → child route thường gọi lại useEmployeeDetail(employeeId)
    → dùng cùng queryKey `employeeKeys.detail(employeeId)`
    → nếu cache đã có thì dùng ngay, không cần fetch mới trừ khi cache stale/refetch
```

### 6.4. Xem tab Thông tin chung

File route: `apps/frontend/src/routes/_authenticated/employees_/$employeeId/index.tsx`

```text
Route default của employee detail được render
  → component GeneralInfoTab
    → useEmployeeDetail(employeeId)
      → lấy aggregate từ `employeeKeys.detail(employeeId)`
    → bóc tách:
      - `partyMemberships = aggregate?.partyMemberships`
      - `bankAccounts = aggregate?.bankAccounts`
      - `foreignWorkPermits = aggregate?.foreignWorkPermits`
    → chọn phần tử đại diện:
      - `party = partyMemberships?.[0]`
      - `bank = bankAccounts?.find((x) => x.isPrimary) ?? bankAccounts?.[0]`
      - `permit = foreignWorkPermits?.[0]`
    → render các `ReadOnlyField`
      - thông tin employee từ bảng `employees`
      - thông tin Đảng/Đoàn từ `employee_party_memberships`
      - thông tin ngân hàng từ `employee_bank_accounts`
      - thông tin visa, hộ chiếu, work permit từ `employee_foreign_work_permits`
    → nút `Xem PDF`
      → `window.open(getFileUrl(permit.workPermitFileId), "_blank")`
```

### 6.5. Xem tab Gia đình

File route: `apps/frontend/src/routes/_authenticated/employees_/$employeeId/family.tsx`

```text
Người dùng chuyển tab Gia đình
  → FamilyTab
    → useEmployeeDetail(employeeId)
      → lấy `aggregate.familyMembers`
    → map từng member ra cặp `ReadOnlyField`
      - fullName
      - relation, map label qua enum `FamilyRelation`
  ← UI hiển thị danh sách thành viên gia đình từ bảng `employee_family_members`
```

### 6.6. Xem tab Lịch sử công tác

File route: `apps/frontend/src/routes/_authenticated/employees_/$employeeId/work-history.tsx`

```text
Người dùng chuyển tab Lịch sử công tác
  → WorkHistoryTab
    → useEmployeeDetail(employeeId)
      → lấy `aggregate.previousJobs`
    → render mỗi bản ghi với:
      - workplace
      - startedOn
      - endedOn
  ← UI hiển thị dữ liệu từ bảng `employee_previous_jobs`
```

### 6.7. Xem tab Đảng, Đoàn

File route: `apps/frontend/src/routes/_authenticated/employees_/$employeeId/party.tsx`

```text
Người dùng chuyển tab Đảng/Đoàn
  → PartyTab
    → useEmployeeDetail(employeeId)
      → lấy `aggregate.partyMemberships`
    → render Card cho từng membership
      - organizationType, map label qua enum `PartyOrgType`
      - joinedOn
      - details
  ← UI hiển thị dữ liệu từ bảng `employee_party_memberships`
```

### 6.8. Xem tab Lương và phụ cấp

File route: `apps/frontend/src/routes/_authenticated/employees_/$employeeId/salary.tsx`

Tab này vừa xem, vừa có khả năng sửa. Phần xem dùng dữ liệu aggregate chi tiết nhân sự.

```text
Người dùng chuyển tab Lương và phụ cấp
  → SalaryTab
    → useQuery(employeeDetailOptions(employeeId))
      → GET /api/employees/:employeeId
      → employeeService.getAggregateById(...)
        → đọc `employee_allowances` JOIN `allowance_types`
    → aggregate được ép kiểu thành `SalaryAggregate`
    → đọc:
      - `salary = aggregate?.salaryGradeStep`
      - `allowances = aggregate?.allowances`
    → render ReadOnlyField cho grade, step, coefficient
    → render bảng allowances với:
      - allowanceName
      - status badge
```

Lưu ý, `getAggregateById()` trong `employee.service.ts` hiện trả `allowances` và `contracts`, không trực tiếp tạo `salaryGradeStep`. `SalaryTab` đang kỳ vọng aggregate mở rộng hơn, nên khi viết activity flow cần hiểu rằng dữ liệu xem phụ cấp chắc chắn đi qua aggregate này, còn phần `salaryGradeStep` phụ thuộc aggregate tổng hợp của hệ thống ở runtime.

### 6.9. Đánh dấu thôi việc từ trang chi tiết

Đây không nằm trong danh sách use case yêu cầu, nhưng là hành động quan trọng của layout chi tiết.

```text
Người dùng bấm "Đánh dấu thôi việc"
  → EmployeeDetailLayout
    → mở Dialog, nhập resignReason
    → handleConfirmResigned()
      → markResigned.mutateAsync({ id: employeeId, reason })
        → useMarkResigned()
          → api.api.employees({ employeeId: id }).put({ workStatus: "terminated", terminationReason: reason })
            → PUT /api/employees/:employeeId
              → requireRole(user.role, "ADMIN", "TCCB")
              → employeeService.update(id, body)
                → update bảng `employees`
        → onSuccess invalidate:
          - `employeeKeys.lists()`
          - `employeeKeys.detail(id)`
      → toast.success("Đã đánh dấu thôi việc thành công")
  ← UI detail và danh sách đều phản ánh trạng thái mới sau refetch
```

### Xử lý lỗi

- Nếu `useEmployeeDetail` chưa xong, layout và tab hiển thị `FormSkeleton`.
- Nếu không có `emp`, layout hiển thị `Không tìm thấy thông tin nhân sự.`
- Nếu query lỗi ở hook/API layer, lỗi được bọc bởi `handleApiError(error)`.
- Nếu lỗi khi đánh dấu thôi việc, `EmployeeDetailLayout` hiển thị `toast.error(...)`.

---

## 7. UC 4.38, Xem thông tin hồ sơ cá nhân

### Mô tả thao tác

Nhân sự đăng nhập và vào trang hồ sơ cá nhân để xem hồ sơ của chính mình. Luồng này dùng endpoint riêng `/api/employees/me`, không cần người dùng biết `employeeId`.

### Quyền truy cập

- Frontend route file: `apps/frontend/src/routes/_authenticated/my/profile.tsx`
- Backend route: `GET /api/employees/me`
- Điều kiện: mọi người dùng đã đăng nhập
- Backend chỉ yêu cầu `auth: true`, không gọi `requireRole(...)`

### Luồng thực thi chi tiết

```text
Người dùng mở trang hồ sơ cá nhân
  → apps/frontend/src/routes/_authenticated/my/profile.tsx
    → Route = createFileRoute("/_authenticated/my/profile")
    → component MyProfilePage
      → useQuery(myEmployeeOptions())
        → apps/frontend/src/features/employees/api.ts
          → myEmployeeOptions()
            → queryKey = employeeKeys.me()
            → Eden Treaty call: api.api.employees.me.get()
              → HTTP GET /api/employees/me
                → apps/backend/src/modules/employees/index.ts
                  → .get("/me", async ({ user }) => { ... }, { auth: true })
                  → authPlugin xác thực session
                  → employeeService.getByEmail(user.email ?? "")
                    → apps/backend/src/modules/employees/employee.service.ts
                      → getByEmail(email)
                        → normalizeOptional(email)
                        → db.select().from(employees).where(eq(employees.email, normalizedEmail))
                          → bảng `employees`
                        → trả employee hoặc null
                  → nếu không tìm thấy employee
                    → throw NotFoundError("Không tìm thấy hồ sơ nhân viên")
                  → nếu tìm thấy employee
                    → employeeService.getAggregateById(employee.id, user.role)
                      → getById(employee.id)
                      → Promise.all đọc các bảng:
                        - `employee_family_members`
                        - `employee_bank_accounts`
                        - `employee_previous_jobs`
                        - `employee_party_memberships`
                        - `employee_allowances` JOIN `allowance_types`
                        - `employee_degrees`
                        - `employee_certifications`
                        - `employee_foreign_work_permits`
                        - `employment_contracts`
                        - `employee_evaluations`
                      → filterEvaluationsByRole(evaluationsRaw, user.role)
                        → nếu role = `EMPLOYEE`, chỉ giữ evaluation có `visibleToEmployee = true`
                  ← backend route trả `{ data: aggregate }`
            ← Eden Treaty trả `{ data, error }`
          → nếu `error` thì throw handleApiError(error)
      ← React Query lưu cache dưới `employeeKeys.me()`
      → MyProfilePage gán:
        - `aggregate = data?.data as EmployeeAggregate | undefined`
        - `emp = aggregate?.employee`
      → render giao diện hồ sơ cá nhân bằng Tabs nội bộ:
        - general
        - education
        - salary
        - family
        - party
      → mỗi `TabsContent` chỉ đọc dữ liệu từ aggregate đã nạp
  ← Người dùng xem hồ sơ của chính mình mà không cần gọi thêm endpoint theo từng tab
```

### Cập nhật UI

- Header hiển thị:
  - `emp.fullName`
  - `emp.staffCode`
  - badge trạng thái từ `StatusBadgeFromCode`
- Tab `general` dùng dữ liệu từ bảng `employees`
- Tab `education` dùng `employees.educationLevel`, `academicRank`, `currentOrgUnitName`, `currentPositionTitle`
- Tab `salary` dùng:
  - `salaryInfo?.salaryGradeStep`
  - `aggregate.bankAccounts`
- Tab `family` dùng `aggregate.familyMembers`
- Tab `party` dùng `aggregate.partyMemberships`

### Xử lý lỗi

- Nếu query đang tải, hiển thị `FormSkeleton`.
- Nếu không có `emp`, hiển thị `Không tìm thấy thông tin hồ sơ cá nhân.`
- Nếu `/api/employees/me` trả lỗi xác thực hoặc not found, lỗi sẽ đi qua `handleApiError` rồi đẩy vào trạng thái lỗi của `useQuery`.

---

## 8. Tóm tắt bảng route, hook, endpoint, service, bảng dữ liệu

| Use case | Frontend route / component | Hook / API frontend | Backend endpoint | Service | Bảng chính |
|---|---|---|---|---|---|
| UC 4.23 | `apps/frontend/src/routes/_authenticated/employees/index.tsx` , `EmployeesPage` | `useListPage`, `useQuery(employeeListOptions(params))` | `GET /api/employees` | `employeeService.list()` | `employees` |
| UC 4.24 | `apps/frontend/src/routes/_authenticated/employees/index.tsx` , `EmployeesPage` | `navigate({ search: ... })`, `employeeListOptions(params)` | `GET /api/employees` | `employeeService.list()` | `employees` |
| UC 4.25 | `apps/frontend/src/routes/_authenticated/employees/new.tsx` , `NewEmployeePage` | `useCreateEmployee`, `useCreateFamilyMember`, `useCreateBankAccount`, `useCreatePreviousJob`, `useCreatePartyMembership`, `useCreateDegree`, `useCreateCertification`, `useCreateForeignWorkPermit`, `uploadFile` | `POST /api/employees` và các `POST /api/employees/:employeeId/...` | `employeeService.create()` và các sub-service `create()` | `employees`, `employee_family_members`, `employee_bank_accounts`, `employee_previous_jobs`, `employee_party_memberships`, `employee_degrees`, `employee_certifications`, `employee_foreign_work_permits` |
| UC 4.26 | `apps/frontend/src/routes/_authenticated/employees/$employeeId/edit.tsx` , `EditEmployeePage`, `EditEmployeeFormContent` | `employeeDetailOptions`, `useUpdateEmployee`, toàn bộ create/update/delete sub-entity hooks | `GET /api/employees/:employeeId`, `PUT /api/employees/:employeeId`, các `POST/PUT/DELETE /api/employees/:employeeId/...` | `employeeService.getAggregateById()`, `employeeService.update()`, các sub-service create/update/remove | `employees` và toàn bộ bảng con của hồ sơ |
| UC 4.28 | `apps/frontend/src/routes/_authenticated/employees_/$employeeId.tsx` và các tab con | `useEmployeeDetail`, `employeeDetailOptions`, `useMarkResigned` | `GET /api/employees/:employeeId`, `PUT /api/employees/:employeeId` | `employeeService.getAggregateById()`, `employeeService.update()` | `employees` + mọi bảng aggregate |
| UC 4.38 | `apps/frontend/src/routes/_authenticated/my/profile.tsx` , `MyProfilePage` | `useQuery(myEmployeeOptions())` | `GET /api/employees/me` | `employeeService.getByEmail()`, `employeeService.getAggregateById()` | `employees` + mọi bảng aggregate |

---

## 9. Sơ đồ tổng quát data flow

```text
[User Action]
  | click / type / submit
  v
[Route File .tsx]
  | createFileRoute(...)
  v
[React Component]
  | EmployeesPage / NewEmployeePage / EditEmployeeFormContent / EmployeeDetailLayout / MyProfilePage
  v
[Hook / React Query]
  | useQuery(...) / useMutation(...)
  | useEmployeeDetail(...) / useCreateEmployee(...) / useUpdateEmployee(...)
  v
[Frontend API Layer]
  | employeeListOptions / employeeDetailOptions / myEmployeeOptions
  | useCreateFamilyMember / useCreateBankAccount / ...
  v
[Eden Treaty Client]
  | api.api.employees...
  v
[Backend Route Elysia]
  | apps/backend/src/modules/*/index.ts
  | authPlugin
  | requireRole(...), nếu route có phân quyền
  v
[Service Layer]
  | employeeService.list / getAggregateById / create / update / remove
  | familyMemberService / bankAccountService / previousJobService / ...
  v
[Drizzle ORM]
  | db.select / insert / update / delete
  v
[PostgreSQL Tables]
  | employees
  | employee_family_members
  | employee_bank_accounts
  | employee_previous_jobs
  | employee_party_memberships
  | employee_allowances (+ allowance_types join)
  | employee_degrees
  | employee_certifications
  | employee_foreign_work_permits
  | employment_contracts
  | employee_evaluations
  v
[Response]
  | { data: ... }
  v
[React Query Cache]
  | set cache / invalidate / refetch
  v
[UI Re-render]
  | DataTable / Tabs / ReadOnlyField / Form / Dialog
```

### Mẫu invalidate cache thường gặp

- Tạo nhân sự mới: invalidate `employeeKeys.lists()`
- Cập nhật nhân sự: invalidate `employeeKeys.lists()` và `employeeKeys.detail(id)`
- CRUD sub-entity: invalidate `employeeKeys.detail(employeeId)`
- Đánh dấu thôi việc: invalidate `employeeKeys.lists()` và `employeeKeys.detail(id)`

### Kết luận

Employee Core của Dev 3 dùng một mô hình khá nhất quán:

- Danh sách dùng `employeeService.list()` với query động.
- Chi tiết dùng aggregate endpoint `GET /api/employees/:employeeId` hoặc `GET /api/employees/me`.
- Form tạo và sửa tách rõ phần employee chính với các sub-entity.
- React Query giữ vai trò trung tâm trong đồng bộ cache và cập nhật UI.
- Backend Elysia + Drizzle giữ cấu trúc mỏng ở route, dồn logic nghiệp vụ vào service.
