# Dev 3 — Sơ đồ luồng hoạt động (Mermaid)

> Tài liệu mô tả luồng hoạt động của phần Dev 3 — Nhân sự Core (Employee Core) bằng sơ đồ Mermaid.

---

## 1. Tổng quan Use Case

```mermaid
graph TB
    subgraph Actors
        TCCB["Phòng TCCB"]
        TCKT["Phòng TCKT"]
        CBGV["Cán bộ / Giảng viên"]
    end

    subgraph UC["Use Cases - Dev 3"]
        UC23["UC 4.23<br/>Tìm kiếm hồ sơ nhân sự"]
        UC24["UC 4.24<br/>Lọc danh sách hồ sơ nhân sự"]
        UC25["UC 4.25<br/>Thêm mới hồ sơ nhân sự"]
        UC26["UC 4.26<br/>Chỉnh sửa chi tiết hồ sơ"]
        UC28["UC 4.28<br/>Xem chi tiết hồ sơ"]
        UC38["UC 4.38<br/>Xem hồ sơ cá nhân"]
    end

    TCCB --> UC23
    TCCB --> UC24
    TCCB --> UC25
    TCCB --> UC26
    TCCB --> UC28

    TCKT --> UC23
    TCKT --> UC24
    TCKT --> UC28

    CBGV --> UC38
```

---

## 2. Kiến trúc tổng thể Dev 3

```mermaid
graph LR
    subgraph Frontend["Frontend (React + Vite)"]
        direction TB
        Routes["Routes<br/>/employees/*"]
        Features["features/employees/api.ts<br/>(React Query hooks)"]
        Components["UI Components<br/>(DataTable, Form, Tabs)"]
        Routes --> Features
        Routes --> Components
    end

    subgraph Backend["Backend (Elysia)"]
        direction TB
        Modules["modules/employees/index.ts<br/>(Route handlers)"]
        Services["employee.service.ts<br/>(Business logic)"]
        SubModules["Sub-modules<br/>family-members, bank-accounts,<br/>previous-jobs, party-memberships,<br/>allowances, employees-export"]
        Modules --> Services
        SubModules --> Services
    end

    subgraph DB["Database (PostgreSQL)"]
        direction TB
        T1["employees"]
        T2["employee_family_members"]
        T3["employee_bank_accounts"]
        T4["employee_previous_jobs"]
        T5["employee_party_memberships"]
        T6["employee_allowances"]
    end

    Features -- "HTTP (REST API)" --> Modules
    Services --> DB
```

---

## 3. UC 4.23 — Tìm kiếm hồ sơ nhân sự

```mermaid
flowchart TD
    A([Phòng TCCB / TCKT<br/>đã đăng nhập]) --> B["Chọn menu<br/>'Quản lý Hồ sơ'"]
    B --> C["Hệ thống hiển thị<br/>danh sách hồ sơ nhân viên<br/>(có phân trang)"]
    C --> D{"Nhập từ khóa<br/>tìm kiếm?"}
    
    D -- "Có nhập<br/>(Tên, Mã, CCCD, SĐT)" --> E["Hệ thống tìm kiếm<br/>real-time theo từ khóa"]
    D -- "Không nhập<br/>(A1: rỗng)" --> F["Hiển thị toàn bộ<br/>danh sách hồ sơ"]
    
    E --> G{"Có kết quả?"}
    G -- "Có" --> H["Hiển thị danh sách<br/>kết quả tìm kiếm"]
    G -- "Không<br/>(E1)" --> I["Thông báo:<br/>'Không tìm thấy<br/>hồ sơ phù hợp'"]
    
    H --> J([Kết thúc])
    F --> J
    I --> J

    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style I fill:#ffcdd2
```

### Luồng kỹ thuật tìm kiếm

```mermaid
sequenceDiagram
    actor User as Phòng TCCB/TCKT
    participant Page as EmployeesPage
    participant Hook as useListPage()
    participant API as employeeListOptions(params)
    participant BE as GET /api/employees
    participant SVC as employeeService.list()
    participant DB as Database

    User->>Page: Nhập từ khóa vào ô tìm kiếm
    Page->>Hook: Cập nhật search params
    Hook->>API: Gọi với params mới
    API->>BE: GET /api/employees?search=...
    BE->>SVC: list({ search, page, ... })
    SVC->>DB: SELECT ... WHERE name LIKE ...
    DB-->>SVC: Kết quả
    SVC-->>BE: Danh sách nhân sự
    BE-->>API: JSON response
    API-->>Hook: Data
    Hook-->>Page: Re-render DataTable
    Page-->>User: Hiển thị kết quả
```

---

## 4. UC 4.24 — Lọc danh sách hồ sơ nhân sự

```mermaid
flowchart TD
    A([Phòng TCCB / TCKT<br/>tại màn hình danh sách]) --> B["Nhấn 'Bộ lọc nâng cao'"]
    B --> C["Hệ thống hiển thị<br/>panel lọc đa tiêu chí"]
    
    subgraph Filters["Tiêu chí lọc"]
        F1["Đơn vị công tác<br/>(Khoa, Phòng, Ban, Bộ môn)"]
        F2["Chức danh khoa học<br/>(GS, PGS, Không có)"]
        F3["Chức vụ đơn vị<br/>(Trưởng khoa, Phó khoa, ...)"]
        F4["Trạng thái làm việc<br/>(Đang chờ xét, Đang công tác,<br/>Đã thôi việc)"]
        F5["Trạng thái hợp đồng<br/>(Chưa HĐ, Còn hiệu lực,<br/>Hết hiệu lực, Chờ gia hạn)"]
        F6["Giới tính<br/>(Nam, Nữ)"]
    end
    
    C --> Filters
    Filters --> D["Chọn các tiêu chí lọc"]
    D --> E["Nhấn 'Áp dụng bộ lọc'"]
    E --> F{"Có kết quả<br/>phù hợp?"}
    
    F -- "Có" --> G["Hiển thị danh sách<br/>kết quả lọc đa tiêu chí"]
    F -- "Không (E1)" --> H["Thông báo:<br/>'Không có hồ sơ phù hợp<br/>với tiêu chí lọc'"]
    
    G --> I([Kết thúc])
    H --> I

    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style H fill:#ffcdd2
```

---

## 5. UC 4.25 — Thêm mới hồ sơ nhân sự

```mermaid
flowchart TD
    A([Phòng TCCB<br/>đã đăng nhập]) --> B{"Chọn phương thức<br/>thêm mới?"}
    
    B -- "Nhập tay" --> C["Nhấn 'Thêm mới'"]
    B -- "Từ file Excel (A1)" --> EX1["Nhấn 'Thêm mới từ Excel'"]
    
    C --> D["Hệ thống hiển thị<br/>form nhập liệu (tabs/bước)"]
    
    EX1 --> EX2["Hiển thị màn hình upload<br/>+ cung cấp file mẫu"]
    EX2 --> EX3["Tải lên file Excel"]
    EX3 --> EX4{"Kiểm tra file:<br/>Định dạng, cấu trúc cột,<br/>trường bắt buộc,<br/>tính hợp lệ?"}
    EX4 -- "Hợp lệ" --> SAVE
    EX4 -- "Không hợp lệ" --> ERR
    
    D --> TABS

    subgraph TABS["Các nhóm thông tin nhập liệu"]
        T1["Thông tin chung bắt buộc<br/>(Họ tên, Ngày sinh, Giới tính,<br/>CCCD, Email, SĐT, ...)"]
        T2["Thông tin người nước ngoài<br/>(Visa, Hộ chiếu, Giấy phép LĐ)<br/>⚡ Chỉ hiện khi tick chọn"]
        T3["Thông tin gia đình"]
        T4["Thông tin ngân hàng"]
        T5["Quá trình công tác"]
        T6["Thông tin Đảng/Đoàn"]
        T7["Ảnh chân dung"]
        T8["Trình độ học vấn"]
        T9["Bằng cấp & Chứng chỉ"]
        T10["Lương & Phụ cấp"]
    end
    
    TABS --> VALIDATE{"Kiểm tra tính<br/>đầy đủ, hợp lệ?"}
    
    VALIDATE -- "Hợp lệ" --> SAVE["Nhấn 'Lưu'"]
    VALIDATE -- "Không hợp lệ (E1)" --> ERR["Hiển thị cảnh báo<br/>đánh dấu tab lỗi<br/>❌ Không cho phép lưu"]
    
    ERR --> D
    
    SAVE --> AUTO["Hệ thống tự động:<br/>• Sinh Mã cán bộ<br/>• Trạng thái HĐ = 'Chưa hợp đồng'<br/>• Trạng thái LV = 'Đang chờ xét'"]
    AUTO --> LOG["Lưu hồ sơ +<br/>Ghi lịch sử tạo hồ sơ"]
    LOG --> SUCCESS["Thông báo thành công"]
    SUCCESS --> END([Kết thúc])

    TABS -.- CANCEL{"Hủy thao tác?<br/>(E2)"}
    CANCEL -- "Có" --> BACK["Quay lại<br/>màn hình danh sách"]

    style A fill:#e1f5fe
    style END fill:#c8e6c9
    style ERR fill:#ffcdd2
    style AUTO fill:#fff9c4
```

### Luồng kỹ thuật thêm mới

```mermaid
sequenceDiagram
    actor User as Phòng TCCB
    participant Page as NewEmployeePage
    participant Upload as uploadFile()
    participant Create as useCreateEmployee()
    participant BE as POST /api/employees
    participant SVC as employee.service.create()
    participant SubAPI as Sub-entity APIs
    participant DB as Database

    User->>Page: Mở form tạo mới
    Page-->>User: Render form lớn (tabs/bước)
    
    User->>Page: Upload ảnh / file PDF
    Page->>Upload: uploadFile(file)
    Upload->>BE: POST /api/files/upload
    BE-->>Upload: URL file
    
    User->>Page: Nhấn "Lưu hồ sơ nhân sự"
    Page->>Create: onSubmit(data)
    Create->>BE: POST /api/employees
    BE->>SVC: create(data)
    SVC->>DB: INSERT INTO employees
    DB-->>SVC: employeeId
    SVC-->>BE: Employee created
    BE-->>Create: { id: employeeId }

    Note over Page,SubAPI: Sau khi có employeeId → tạo sub-entities

    par Tạo song song các thực thể phụ
        Create->>SubAPI: POST /employees/:id/family-members
        Create->>SubAPI: POST /employees/:id/bank-accounts
        Create->>SubAPI: POST /employees/:id/previous-jobs
        Create->>SubAPI: POST /employees/:id/party-memberships
        Create->>SubAPI: POST /employees/:id/allowances
    end

    SubAPI->>DB: INSERT sub-entities
    DB-->>SubAPI: OK

    SubAPI-->>Page: All done
    Page->>Page: invalidate employeeKeys.lists()
    Page-->>User: toast.success() → điều hướng về /employees
```

---

## 6. UC 4.26 — Chỉnh sửa chi tiết hồ sơ nhân sự

```mermaid
flowchart TD
    A([Phòng TCCB<br/>đã đăng nhập]) --> CHECK{"Trạng thái<br/>hồ sơ nhân sự?"}
    
    CHECK -- "'Đang chờ xét'<br/>hoặc 'Đang công tác'" --> B["Nhấn 'Sửa'<br/>tại danh sách hoặc chi tiết"]
    CHECK -- "'Đã thôi việc'<br/>(E3)" --> BLOCK["Thông báo:<br/>'Không thể chỉnh sửa<br/>hồ sơ đã thôi việc'<br/>❌ Vô hiệu hóa nút Sửa"]
    
    B --> C["Hệ thống hiển thị<br/>form chỉnh sửa (tabs/bước)<br/>với dữ liệu hiện tại"]

    C --> D["Chỉnh sửa các trường thông tin<br/>(giống UC 4.25 nhưng Mã CB không đổi)"]
    
    D --> HIDE["Có thể ẩn mục khen thưởng/<br/>kỷ luật với tài khoản CB/GV,<br/>tài khoản TCKT"]
    
    HIDE --> VALIDATE{"Kiểm tra tính<br/>đầy đủ, hợp lệ?"}
    
    VALIDATE -- "Hợp lệ" --> SAVE["Nhấn 'Lưu thay đổi'"]
    VALIDATE -- "Không hợp lệ (E1)" --> ERR["Hiển thị cảnh báo<br/>đánh dấu tab lỗi<br/>❌ Không cho phép lưu"]
    ERR --> C
    
    SAVE --> LOG["Cập nhật hồ sơ +<br/>Ghi lịch sử thay đổi"]
    LOG --> SUCCESS["Thông báo thành công"]
    SUCCESS --> END([Kết thúc])

    D -.- CANCEL{"Hủy thao tác?<br/>(E2)"}
    CANCEL -- "Có" --> BACK["Quay lại<br/>màn hình danh sách"]

    style A fill:#e1f5fe
    style END fill:#c8e6c9
    style ERR fill:#ffcdd2
    style BLOCK fill:#ffcdd2
    style LOG fill:#fff9c4
```

### Luồng kỹ thuật chỉnh sửa (syncSubEntities)

```mermaid
sequenceDiagram
    actor User as Phòng TCCB
    participant Page as EditEmployeePage
    participant Query as useQuery(employeeDetailOptions)
    participant Update as useUpdateEmployee()
    participant Sync as syncSubEntities()
    participant BE as Backend APIs
    participant DB as Database

    User->>Page: Mở trang sửa hồ sơ
    Page->>Query: GET /api/employees/:id
    Query->>BE: employeeService.getAggregateById()
    BE->>DB: SELECT + JOINs
    DB-->>BE: Dữ liệu tổng hợp
    BE-->>Query: Employee aggregate
    Query-->>Page: Đổ dữ liệu vào form (defaultValues)

    User->>Page: Chỉnh sửa thông tin
    User->>Page: Nhấn "Lưu thay đổi"
    
    Page->>Update: PUT /api/employees/:id
    Update->>BE: employee.service.update()
    BE->>DB: UPDATE employees
    DB-->>BE: OK

    Page->>Sync: syncSubEntities(formData)
    
    Note over Sync: So sánh form data vs dữ liệu gốc

    alt Item mới (không có id)
        Sync->>BE: POST .../family-members (create)
    else Item có id (đã tồn tại)
        Sync->>BE: PUT .../family-members/:id (update)
    else Item bị xóa khỏi form
        Sync->>BE: DELETE .../family-members/:id (remove)
    end

    BE->>DB: CREATE / UPDATE / DELETE
    DB-->>BE: OK
    BE-->>Page: Done

    Page->>Page: invalidate lists() + detail(id)
    Page-->>User: Điều hướng về /employees/:id
```

---

## 7. UC 4.28 — Xem chi tiết thông tin hồ sơ nhân sự

```mermaid
flowchart TD
    A([Phòng TCCB / TCKT<br/>đã đăng nhập]) --> B["Nhấn 'Xem chi tiết'<br/>tại một nhân sự"]
    B --> C["Hệ thống hiển thị<br/>Chi tiết hồ sơ<br/>(chế độ chỉ đọc)"]
    
    C --> TABS

    subgraph TABS["Các Tab hiển thị"]
        TAB1["Tab 'Thông tin chung'<br/>Mã CB, Lý lịch, Liên hệ,<br/>Gia đình, Ảnh chân dung"]
        TAB2["Tab 'Trình độ & Chức danh'<br/>Bằng cấp, Chứng chỉ,<br/>Chức danh KH, Chức vụ"]
        TAB3["Tab 'Thông tin Đảng/Đoàn'"]
        TAB4["Tab 'Lương & Phụ cấp'<br/>Ngạch, Bậc, Hệ số lương,<br/>Thông tin ngân hàng"]
        TAB5["Tab 'Hợp đồng'<br/>Các HĐ đã ký"]
        TAB6["Tab 'Khen thưởng / Kỷ luật'"]
        TAB7["Tab 'Công tác'<br/>Quá trình trước khi về trường"]
    end
    
    TABS --> ACTION{"Hành động<br/>bổ sung?"}
    
    ACTION -- "In hồ sơ (A1)" --> PRINT["Xuất hồ sơ<br/>định dạng PDF"]
    ACTION -- "Xuất Excel (A2)" --> EXCEL["Xuất file Excel<br/>chứa tất cả thông tin"]
    ACTION -- "Không" --> END([Kết thúc])
    
    PRINT --> END
    EXCEL --> END

    style A fill:#e1f5fe
    style END fill:#c8e6c9
    style PRINT fill:#e8f5e9
    style EXCEL fill:#e8f5e9
```

### Luồng kỹ thuật xem chi tiết

```mermaid
sequenceDiagram
    actor User as Phòng TCCB/TCKT
    participant List as EmployeesPage (Bảng)
    participant Layout as EmployeeDetailLayout
    participant Hook as useEmployeeDetail(id)
    participant API as GET /api/employees/:id
    participant SVC as employeeService.getAggregateById()
    participant DB as Database
    participant Tab as Tab Component (Outlet)

    User->>List: Nhấn "Xem chi tiết" nhân sự
    List->>Layout: Route → /employees/:employeeId
    Layout->>Hook: useEmployeeDetail(employeeId)
    Hook->>API: GET /api/employees/:employeeId
    API->>SVC: getAggregateById(id)
    SVC->>DB: SELECT employee + JOINs sub-entities
    DB-->>SVC: Aggregate data
    SVC-->>API: Full employee object
    API-->>Hook: JSON response
    Hook-->>Layout: Employee data

    Layout-->>User: Render layout + tab navigation
    
    User->>Layout: Chọn tab (VD: "Gia đình")
    Layout->>Tab: Route → /employees/:id/family
    Tab-->>User: Hiển thị dữ liệu tab (chỉ đọc)
```

---

## 8. UC 4.38 — Xem hồ sơ cá nhân (Cán bộ/Giảng viên)

```mermaid
flowchart TD
    A([Cán bộ / Giảng viên<br/>đã đăng nhập]) --> B["Chọn 'Hồ sơ cá nhân'"]
    B --> C["Hệ thống hiển thị<br/>hồ sơ cá nhân<br/>(chế độ chỉ đọc)"]
    
    C --> TABS

    subgraph TABS["Các Tab hồ sơ cá nhân"]
        T1["Tab 'Thông tin chung'<br/>Mã CB, Lý lịch, Liên hệ,<br/>Gia đình, Ảnh chân dung"]
        T2["Tab 'Trình độ & Chức danh'<br/>Bằng cấp, Chứng chỉ,<br/>Chức danh KH, Chức vụ"]
        T3["Tab 'Thông tin Đảng/Đoàn'"]
        T4["Tab 'Lương & Phụ cấp'<br/>Ngạch, Bậc, Hệ số lương"]
        T5["Tab 'Hợp đồng'<br/>Các HĐ đã ký"]
        T6["Tab 'Khen thưởng / Kỷ luật'"]
        T7["Tab 'Công tác'"]
    end
    
    TABS --> END([Kết thúc])

    style A fill:#fff3e0
    style END fill:#c8e6c9
```

### Luồng kỹ thuật hồ sơ cá nhân

```mermaid
sequenceDiagram
    actor CBGV as Cán bộ / Giảng viên
    participant Page as MyProfilePage
    participant Hook as useQuery(myEmployeeOptions)
    participant BE as GET /api/employees/me
    participant SVC as employee.service
    participant DB as Database

    CBGV->>Page: Mở /my/profile
    Page->>Hook: myEmployeeOptions()
    Hook->>BE: GET /api/employees/me
    BE->>SVC: getByEmail(user.email)
    SVC->>DB: SELECT * FROM employees WHERE email = ?
    DB-->>SVC: employee record
    SVC->>SVC: getAggregateById(employee.id, user.role)
    SVC->>DB: SELECT + JOINs (filtered by role)
    DB-->>SVC: Aggregate data
    SVC-->>BE: Employee profile
    BE-->>Hook: JSON response
    Hook-->>Page: Data
    Page-->>CBGV: Render tabs hồ sơ cá nhân (chỉ đọc)
```

---

## 9. Luồng tổng hợp toàn bộ Dev 3

```mermaid
flowchart TB
    START([Người dùng<br/>đăng nhập hệ thống]) --> ROLE{"Vai trò?"}
    
    ROLE -- "Phòng TCCB" --> MENU_TCCB["Menu 'Quản lý Hồ sơ'"]
    ROLE -- "Phòng TCKT" --> MENU_TCKT["Menu 'Quản lý Hồ sơ'<br/>(chỉ xem)"]
    ROLE -- "CB/GV" --> PROFILE["Menu 'Hồ sơ cá nhân'"]
    
    MENU_TCCB --> LIST["Danh sách hồ sơ nhân sự<br/>(DataTable + phân trang)"]
    MENU_TCKT --> LIST
    
    LIST --> SEARCH["UC 4.23: Tìm kiếm<br/>(real-time theo từ khóa)"]
    LIST --> FILTER["UC 4.24: Lọc nâng cao<br/>(đa tiêu chí)"]
    
    SEARCH --> LIST
    FILTER --> LIST
    
    LIST -- "Phòng TCCB" --> ADD["UC 4.25: Thêm mới"]
    LIST --> VIEW["UC 4.28: Xem chi tiết"]
    LIST -- "Phòng TCCB" --> EDIT["UC 4.26: Chỉnh sửa"]
    
    ADD --> |"Form nhập liệu<br/>(tabs/bước)"| SAVE_NEW["Lưu → Sinh mã CB<br/>Trạng thái mặc định"]
    SAVE_NEW --> LIST
    
    VIEW --> DETAIL["Chi tiết hồ sơ<br/>(7 tabs - chỉ đọc)"]
    DETAIL --> PRINT["In PDF"]
    DETAIL --> EXPORT["Xuất Excel"]
    
    EDIT --> |"Form chỉnh sửa<br/>(syncSubEntities)"| SAVE_EDIT["Lưu thay đổi<br/>+ Ghi lịch sử"]
    SAVE_EDIT --> DETAIL
    
    PROFILE --> UC38["UC 4.38: Xem hồ sơ cá nhân<br/>(chỉ đọc - 5 tabs)"]

    style START fill:#e3f2fd
    style LIST fill:#e8eaf6
    style DETAIL fill:#f3e5f5
    style UC38 fill:#fff3e0
    style ADD fill:#e8f5e9
    style EDIT fill:#fff9c4
```

---

## 10. Sơ đồ API Endpoints

```mermaid
graph LR
    subgraph FE["Frontend Hooks"]
        H1["employeeListOptions()"]
        H2["useEmployeeDetail()"]
        H3["useCreateEmployee()"]
        H4["useUpdateEmployee()"]
        H5["myEmployeeOptions()"]
        H6["useCreateFamilyMember()"]
        H7["useCreateBankAccount()"]
        H8["useCreatePreviousJob()"]
        H9["useCreatePartyMembership()"]
        H10["useCreateAllowance()"]
    end

    subgraph BE["Backend Endpoints"]
        E1["GET /api/employees"]
        E2["GET /api/employees/:id"]
        E3["POST /api/employees"]
        E4["PUT /api/employees/:id"]
        E5["GET /api/employees/me"]
        E6["CRUD /api/employees/:id/family-members"]
        E7["CRUD /api/employees/:id/bank-accounts"]
        E8["CRUD /api/employees/:id/previous-jobs"]
        E9["CRUD /api/employees/:id/party-memberships"]
        E10["CRUD /api/employees/:id/allowances"]
        E11["GET /api/employees/:id/export"]
    end

    H1 --> E1
    H2 --> E2
    H3 --> E3
    H4 --> E4
    H5 --> E5
    H6 --> E6
    H7 --> E7
    H8 --> E8
    H9 --> E9
    H10 --> E10

    style FE fill:#e3f2fd
    style BE fill:#fce4ec
```

---

## 11. State Diagram — Trạng thái nhân sự

```mermaid
stateDiagram-v2
    [*] --> DangChoXet: Thêm mới hồ sơ<br/>(UC 4.25)
    
    DangChoXet: Đang chờ xét
    DangCongTac: Đang công tác
    DaThoiViec: Đã thôi việc
    
    DangChoXet --> DangCongTac: Duyệt hồ sơ
    DangChoXet --> DaThoiViec: Đánh dấu thôi việc
    DangCongTac --> DaThoiViec: Đánh dấu thôi việc
    
    note right of DangChoXet
        Có thể chỉnh sửa (UC 4.26)
        Trạng thái HĐ = "Chưa hợp đồng"
    end note
    
    note right of DangCongTac
        Có thể chỉnh sửa (UC 4.26)
    end note
    
    note right of DaThoiViec
        ❌ KHÔNG thể chỉnh sửa
        Nút "Sửa" bị vô hiệu hóa
    end note
    
    DaThoiViec --> [*]
```

---

## 12. Phân quyền theo vai trò

```mermaid
graph TB
    subgraph Permissions["Ma trận phân quyền Dev 3"]
        direction LR
        subgraph TCCB["Phòng TCCB"]
            P1["✅ Tìm kiếm (UC 4.23)"]
            P2["✅ Lọc (UC 4.24)"]
            P3["✅ Thêm mới (UC 4.25)"]
            P4["✅ Chỉnh sửa (UC 4.26)"]
            P5["✅ Xem chi tiết (UC 4.28)"]
            P6["✅ In / Xuất file"]
        end

        subgraph TCKT["Phòng TCKT"]
            Q1["✅ Tìm kiếm (UC 4.23)"]
            Q2["✅ Lọc (UC 4.24)"]
            Q3["❌ Thêm mới"]
            Q4["❌ Chỉnh sửa"]
            Q5["✅ Xem chi tiết (UC 4.28)"]
            Q6["✅ In / Xuất file"]
        end

        subgraph CBGV_P["CB / Giảng viên"]
            R1["❌ Quản lý hồ sơ"]
            R2["✅ Xem hồ sơ cá nhân (UC 4.38)"]
        end
    end

    style TCCB fill:#e8f5e9
    style TCKT fill:#e3f2fd
    style CBGV_P fill:#fff3e0
```
