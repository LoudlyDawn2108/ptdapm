# HRMS — Kế hoạch Dự án

> **4 Full-Stack Lập trình viên** · **Monorepo (Turborepo + Bun)** · **Elysia + React + Drizzle**
>
> Phân chia theo dạng **sở hữu table/route (chủ quyền bảng và luồng)** — mỗi dev sở hữu toàn bộ luồng công nghệ (BE route → DB schema → FE page) cho các bảng dữ liệu được giao.
>
> **Tài liệu liên quan**: `conventions.md` (về mặt kiến trúc), `dev-{1..4}-*.md` (về mặt phân công giao việc cho từng người)

---

## 1. Tổng quan phân công

### Bảng tổng hợp

| Dev | Chủ đề | Số bảng DB | Độ phức tạp | Giao diện |
|-----|-------|--------|------------|-------|
| **Dev 1** 🔐 | Xác thực (Auth) + Hợp đồng + Bằng cấp/Chứng chỉ | 12 | **16 điểm** | /login, /accounts, /audit-log, các tab của nhân viên (bằng cấp, chứng chỉ, GPLĐNN, hợp đồng) |
| **Dev 2** 🏢 | Tổ chức + Cấu hình + Thống kê | 7 | **15 điểm** | /org-units, /config/*, /employees (chỉ màn danh sách), /dashboard, /my/org |
| **Dev 3** 👤 | Cốt lõi phần Nhân sự | 6 | **16 điểm** | Thêm nhân sự, khung bao ngoài chi tiết nhân sự + các tab (cá nhân, gia đình, ngân hàng, công tác, đảng/đoàn, phụ cấp), xem/in/xuất file, /my/profile |
| **Dev 4** 🎓 | Đào tạo + Đánh giá + Nghiệp vụ HR | 6 | **15 điểm** | Các tab nhân viên (đánh giá, thôi việc), Quản lý khóa đào tạo (CRUD), Đào tạo tự động đăng ký |

### Cách chấm điểm Độ Phức Tạp

| Kích cỡ | Điểm | Định nghĩa |
|------|--------|------------|
| **S (Nhỏ)** | 1 | CRUD đơn giản, chỉ 1 bảng rời, không yêu cầu UI đặc biệt |
| **M (Vừa)** | 2 | CRUD + logic xác thực, từ 2 bảng liên kết trở lên, hoặc UI phức tạp (cây thư mục, tabs tabs) |
| **L (Lớn)** | 3 | Quy trình nhiều bước, cỗ máy quản lý trạng thái phức tạp, hoặc tích hợp luồng chéo sang module của người khác |

---

## 2. Các Mốc Giai Đoạn & Sự Phụ Thuộc (Phasing & Dependencies)

### Giai đoạn 0 — Nền móng (Tuần 1)

> **Mục tiêu**: Sau giai đoạn này, mọi người có thể phát triển phần việc của mình một cách độc lập.

| Dev | Nhiệm vụ | Nộp phạt/Kết quả |
|-----|-------|-------------|
| **Dev 1** | Luồng xác thực (đăng nhập/đăng xuất/phiên) + Middleware phân quyền | Xác thực hoạt động, hook `useAuth()`, các chốt chặn route |
| **Dev 2** | Tạo ra các type/validator chuẩn trong `@hrms/shared` | Zod schemas cho toàn bộ các đối tượng, Định nghĩa type API |
| **Dev 3** | Khung bao UI + các thành phần dùng chung | Điều hướng Sidebar, bố cục tab, bảng (table), các mẩu form cơ bản |
| **Dev 4** | Khởi tạo Data migration + tạo hạt giống (seed) | Cấu trúc luồng `drizzle-kit`, Script đổ dữ liệu seed, tài liệu convention migration |

### Giai đoạn 1 — Lõi API (Tuần 2)

> **Mục tiêu**: Tất cả những dữ liệu thả xuống (dropdown) / dữ liệu phụ thuộc đã sẵn sàng. Mỗi lập trình viên đều phải có cho mình một luồng Thực thi (CRUD) hoạt động được.

| Dev | Nhiệm vụ | Nộp phạt/Kết quả | Ảnh hưởng chặn |
|-----|-------|-------------|--------|
| **Dev 1** | Quản lý Tài khoản con + Ghi sổ lịch sử (Audit log) | CRUD accounts, khung hiển thị Audit log | — |
| **Dev 2** | Quá trình thao tác Đơn vị tổ chức + Mọi danh mục cấu hình | API cây tổ chức, Cấu hình Thang/Bậc lương/Phụ cấp/Hợp đồng | **⚡ Mở đờng cho Dev 3 hoàn thành (những list sổ xuống)** |
| **Dev 3** | Thao tác Nhân viên (CRUD tạo mới + danh sách + Vỏ bọc chi tiết) | Khung nhập form Nhân viên, bố trí layout Chi tiết mang gắn tab | — |
| **Dev 4** | Danh mục Đào tạo + Mẫu loại đào tạo | Quá trình CRUD khóa Đào tạo và các luồng điểu kiện | — |

### Giai đoạn 2 — Hoàn thiện chức năng (Tuần 3–4)

> **Mục tiêu**: Mọi bảng/mọi luồng (route) phải được cài cắm đầy đủ. Tất cả các lập trình viên bắt đầu chuyên sâu vào mảnh giao diện tab/trang màn hình của mình.

| Dev | Nhiệm vụ |
|-----|-------|
| **Dev 1** | Tải lên file upload, Hệ thống file Hợp đồng, Bằng cấp, Chứng chỉ đào tạo chuyên môn, Giấy phép LĐ |
| **Dev 2** | Sự thuyên chuyển / phân công (Assignments), Dashboard/Báo cáo, Tìm kiếm chắt lọc trên Danh sách, /my/org |
| **Dev 3** | Chuyên sâu làm màn hình cá nhân hoá chứa các tab (Gia đình, ngân hàng, công tác, đảng, trợ cấp phụ phí), Export/In văn bản, /my/profile |
| **Dev 4** | Tab kỳ đánh giá, Thủ tục từ nhiệm (Termination), Ghi nhận đi học các loại lớp, kết quả, /my/training |

### Giai đoạn 3 — Ghép Mạch & Đánh Bóng (Tuần 5)

> **Mục tiêu**: Giao tiếp chéo nối liền dữ liệu, xử lý điểm mù biên độ (edge cases), trau truốt trang giao diện UI.

| Tất cả Dev | Nhiệm vụ |
|----------|-------|
| Giao tiếp Luồng/Cross | Kéo tính năng tải upload File thả vào lòng Hợp đồng, Kết quả,... |
| Giao tiếp Luồng/Cross | Chẻ mạch gọi data móc dropdown của phần Dev 2 cung cấp vào các mảng form chung |
| Giao tiếp Luồng/Cross | Form tổng kết Gương Kính Nhân viên: mọi thứ tab từ mọi người phải được lên khung |
| Đánh Bóng / Polish | Các màn chờ báo lỗi hợp lý (Loading states, Empty states), UX xịn xò. |
| Nghiệm thu | Tiến hành Test tay/kéo xả QA, săn lỗi bug. |

### Sơ Đồ Phụ Thuộc (Dependency Graph)

```
Giai đoạn 0:
  Dev 1 (phân quyền auth) ─────────────────────────► Mọi devs khác (lấy qua route chặn)
  Dev 3 (bố trí/màu vỏ màn hình) ──────────────────► Mọi devs khác (được xài ké UI)
  Dev 4 (móng DB setup)  ──────────────────────────► Mọi devs khác (dùng cho migrations)
  Dev 2 (chuẩn hoá kiều Form) ─────────────────────► Mọi devs (Hứng hưởng cho việc Zod schemas)

Giai đoạn 1:
  Dev 2 (api cho Org/Cấu hình) ────────────────────► Dev 3 (lấy cho các list dropdown khi lập form Nhân Viên)
  Dev 1 (Hệ mạch upload file) ─────────────────────► Dev 1, Dev 4 (cài ghép đính tệp đính kèm)

Giai đoạn 2:
  Dev 3 (khung bao màn Chi tiết Hồ sơ)  ───────────► Dev 1, Dev 4 (cài ghép thả các cục Tab của riêng mình vào)
  Dev 2 (Api lấy sự bổ nhiệm của chức vị) ────────► Dev 3 (sợi nối phơi bày cấu tạo phòng ban của nhân viên đó)

Giai đoạn 3:
  Mọi devs ôm nhào vào Test tích hợp chéo.
```

---

## 3. Chiến Lược Rẽ Nhánh Git (Git Branching)

### Cấu Trúc Nhánh

```
main                          # Mã chuẩn dành đẩy lên Production (Khoá vĩnh cửu/protected)
└── develop                   # Nhánh tích hợp làm bệ phóng (Khoá vĩnh cửu/protected)
    ├── feat/auth             # Nhánh Dev 1: Auth + accounts + audit
    ├── feat/org-config       # Nhánh Dev 2: Org units + config catalogs
    ├── feat/employee-core    # Nhánh Dev 3: Thực thể chính (Employee) + Các tabs
    └── feat/training-eval    # Nhánh Dev 4: Khóa học + Phiếu đánh giá
```

### Luật lệ Chung

| Luật lệ Quy Định | Trọng tâm |
|------|-------------|
| **Cách đặt Tên Nhánh** | `feat/<tên_tính_năng_module>`, `fix/<module>-<gọn_gàng_sự_việc_lỗi>`, `chore/<dọn_tệp_rác_nào...>` |
| **Chiết nhánh từ Base** | Luôn luôn tẻ nhánh BẮT NGUỒN từ `develop` |
| **Vạch đích kéo PR** | Luôn luôn dồn mã Pull Request VỀ LẠI nhánh `develop` |
| **Cách sáp nhập** | Ghép gộp một cục (Squash merge) đối với các tính năng → vào `develop`. Hợp nhất thẳng (Merge commit) đối với `develop` → vào `main`. |
| **Review check khi PR** | Yêu cầu phải có bét nhất 1 thanh niên dev khác điểm chỉ review thì mới được Merge |
| **Khi đụng xe (Conflicts)** | Bạn dev nào vào trễ nộp sau thì tự thân nai lưng ra giải quyết Conflicts |
| **Triển khai Release** | Chỉ bơm `develop` vào đẩy tung ra `main` tại lúc rạng sáng cuối của mỗi Milestone Giai Đoạn |

### Tiến Độ Theo Ngày (Daily Workflow)

```bash
# Phổ độ mỗi sớm: móc đồng bộ hoá code trước khi nặn ra tính năng
git checkout develop
git pull origin develop
git checkout feat/my-module
git rebase develop              # Bẻ lái gom code cho lên sát nút thời đại hiện tại

# Đang bận việc: siêng gõ lệnh Commit nhắt lại
git add -A
git commit -m "feat(module): description"

# Phiên tàn cuối ngày hoặc Done chốt được Tính Năng: Bơm xịt lên mây nặn chiếc PR
git push origin feat/my-module
# Tạo kéo PR qua nền web GitHub/GitLab → để xin phép cho luồn vô nhánh `develop`
```

### Khuôn Mẫu Viết Nắm Cam Kết Dấu Mốc Lịch Sử (Commit Convention)

```
<chủng_loại>(<phạm_vi_scope_cục_nhỏ>): <Miêu tả ý nghĩa>

Chủng loại (Types): feat, fix, chore, refactor, docs, style, test
Phạm vi (Scope): auth, org, employee, training, config, shared, ui, db
```

**Ví dụ**:
```
feat(auth): add login endpoint with better-auth session
feat(employee): add family members CRUD tab
fix(org): fix tree rendering with empty children
chore(db): add seed data for salary grades
refactor(shared): extract table component to shared UI
```

### Xử Lý Mã Nguồn Chia Sẻ Ràng Buộc Chung Xa Lạ

Khi nào bạn cần đụng chạm phẫu thuật vào mảng tài nguyên chung dùng cho cả họ `shared code` (`packages/shared/`, `apps/frontend/src/components/ui/`, v.v..):

1. **Vết trầy bé xíu** (bóp méo một xíu type, thêm value cho Enum): Giấu kèm luôn vào nhánh feature đang gọt của bạn
2. **Những vụ Nổ BigBang lớn cho khối Shared Core** (như làm một khuôn rập shared Component mới, hay cấu lại luật Validator mới): Tạo nhánh riêng biệt với tên `chore/shared-<desc>`, nặn PR và trôi vào `develop` thật thanh sạch láng cóng, rồi lúc đó hãy về lại nhánh cá nhân làm một mẻ **rebase** update mã.
3. **Mệnh lệnh bắt buộc Tiên quyết**: Luôn bắn Chat lên thông báo tin tức với biệt đội Team trước lúc tàn phá sửa mã nguồn chung, vì mục đích tránh cảnh đổ máu (cảnh báo Conflicts) đụng lịch luồng cày cuốc.

---

## Phụ Lục: Thẻ Nhớ Mẹo Chớp Nhoáng (Quick Reference Card)

```
┌────────────────────────────────────────────────────────┐
│  Dev 1 🔐  Auth + HĐ + Bằng cấp       (16 pts)       │
│  Tables: auth_*, audit_logs, files, contracts,          │
│          degrees, certifications, foreign_permits        │
│  Phase 0: Auth flow    Phase 1: Accounts + Audit        │
├────────────────────────────────────────────────────────┤
│  Dev 2 🏢  Tổ chức + Config + Stats    (15 pts)        │
│  Tables: org_units, org_events, assignments,             │
│          salary_grades, allowance_types, contract_types  │
│  Phase 0: Shared types  Phase 1: Org + Config ⚡        │
├────────────────────────────────────────────────────────┤
│  Dev 3 👤  Nhân sự Core                (16 pts)        │
│  Tables: employees, family, bank, prev_jobs,             │
│          party, allowances                               │
│  Phase 0: Layout + UI  Phase 1: Employee CRUD           │
├────────────────────────────────────────────────────────┤
│  Dev 4 🎓  Đào tạo + Đánh giá          (15 pts)       │
│  Tables: evaluations, terminations, training_courses,    │
│          training_types, registrations, results          │
│  Phase 0: DB setup     Phase 1: Training CRUD           │
└────────────────────────────────────────────────────────┘

Nhánh đường ống cống: feat/<module> → develop → main
Văng miếu Commit: <chủng_loại>(<phạm_vi>): <diễu_ngữ_viết>
Chuỗi gọi ống API truyền: /api/<module> → { data } | { error }
```
