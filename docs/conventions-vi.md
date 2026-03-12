# HRMS — Quy ước Chung
> Đây là "kinh thánh" kiến trúc cho tất cả lập trình viên (dev). Hãy cung cấp tài liệu này cho AI hỗ trợ code của bạn cùng với tài liệu phân công công việc.
>
> **Stack (Công nghệ)**: Monorepo (Turborepo + Bun) · Elysia 1.4 · React 19 · Drizzle ORM · PostgreSQL

---

## 1. Backend — Mẫu (Pattern) Route của Elysia

Mỗi module tuân theo kiến trúc **thin controller + service layer** (controller mỏng + tầng dịch vụ), đặt cùng nhau trong cùng một thư mục:

```
modules/<module>/
  index.ts              → Định nghĩa các Route (thin controller — xác thực dữ liệu + điều hướng)
  <module>.service.ts   → Logic nghiệp vụ (queries, kiểm tra xung đột, v.v.)
  <module>.test.ts      → Thử nghiệm/Test (đặt cùng thư mục với module)
```

> **Tham khảo mẫu triển khai chuẩn**: `modules/config/contract-types/` — route đầy đủ CRUD + service. Hãy sao chép mẫu này cho các module mới.

**Các quy ước chính**:
- **Xác thực dữ liệu (Validation)**: Sử dụng Zod schemas từ `@hrms/shared` trong các tùy chọn `body`/`params`/`query` (Elysia 1.4 hỗ trợ Zod trực tiếp qua Standard Schema). Các mở rộng truy vấn riêng cho từng route (ví dụ: `paginationSchema.extend(...)`) dùng trực tiếp `zod` trong file route.
- **Xác thực người dùng (Auth)**: Dùng `.use(authPlugin)` một lần cho mỗi nhóm route — cung cấp tùy chọn `{ auth: true }` và đưa biến `user` + `session` vào ngữ cảnh (context). Plugin tự động chống trùng lặp theo tên.
- **Bảo vệ quyền hạn (Role guard)**: `requireRole(user.role, "ADMIN", "TCCB")` — ném ra lỗi `ForbiddenError`. Lưu ý hàm này không trả về giá trị gì.
- **Xử lý lỗi**: Ném ra các class kế thừa từ `AppError` — plugin tổng `errorPlugin` sẽ bắt lỗi và trả về dạng `{ error: string }` kèm mã trạng thái HTTP chính xác.
- **Phân trang (Pagination)**: Dùng `buildPaginatedResponse()` + `countRows()` từ `common/utils/pagination.ts`.
- **Cấu trúc dữ liệu trả về (Response shape)**: Luôn bọc kết quả bên trong `{ data }`. Trình gọi API Eden Treaty sẽ tự phân loại qua `data` (khi thành công) vs `error` (khi thất bại). Không dùng trường `success`.
- **Không khai báo kiểu dữ liệu trả về (Return types) rõ ràng trên các hàm xử lý**: Hãy để TypeScript tự suy luận từ tầng service.
- **Tầng dịch vụ (Service layer)**: Toàn bộ logic nghiệp vụ (business logic) nằm trong `*.service.ts`. Các Route chỉ là những controller mỏng (kết nối và dẫn hướng).
- Thêm tiền tố `/api/` cho tất cả các route API.
- Các thực thể con của nhân viên phải được lồng bên dưới `/api/employees/:employeeId/<tên-thực-thể-con>`

---

## 2. Backend — Cấu trúc Thư mục & Đăng ký Route

> **Tham khảo**: Xem `apps/backend/src/index.ts` để biết cách đăng ký route, và `common/` cho hạ tầng dùng chung.

```
apps/backend/src/
├── common/                       # Hạ tầng dùng chung (mọi dev import từ đây)
│   ├── plugins/                  # auth.ts, db.ts, error-handler.ts, rate-limit.ts
│   ├── utils/                    # errors.ts, pagination.ts, role-guard.ts, user-context.ts
│   └── auth/index.ts             # cấu hình better-auth
├── db/
│   ├── index.ts                  # Kết nối DB
│   ├── seed/                     # users.ts, roles.ts (Dữ liệu mẫu)
│   └── schema/                   # Các Schema được nhóm theo vùng (10 files, 27 bảng)
├── modules/                      # Các module tính năng — mỗi dev làm việc tại đây
│   ├── auth/                     # 🔐 Dev 1
│   ├── config/contract-types/    # 🏢 Dev 2 (mẫu CRUD tham khảo)
│   └── ...                       # Xem tài liệu phân công dev để biết danh sách module đầy đủ
└── index.ts                      # Điểm bắt đầu của ứng dụng — đăng ký tất cả routes từ các module
```

**Cách đăng ký module mới**: Import các route vào `src/index.ts` và dùng hàm `.use()` để thêm vào. Hãy xem các module đã được đăng ký mẫu làm chuẩn.

**Lưu ý**:
- `errorPlugin` phải được đăng ký đầu tiên với option `{ as: "global" }` — giúp nó bắt lỗi từ tất cả các plugin con khác.
- `globalRateLimit` + `loginRateLimit` sử dụng các hook `onRequest` (hoạt động trước khi phân tích nội dung body).
- `authPlugin` tự phân biệt trùng lặp qua tên — nên việc `.use()` nó ở nhiều chỗ rất an toàn.
- Hiện tại mới chỉ có `auth/` và `config/contract-types/` được triển khai. **KHÔNG tạo sẵn các thư mục trống cho các module con tương lai.**

---

## 3. Frontend — Mẫu File Route (Dùng TanStack Router)

> **Tham khảo**: Xem `apps/frontend/src/routes/` để biết các file route hiện tại.

```
apps/frontend/src/routes/
├── __root.tsx                          # Layout gốc
├── _authenticated.tsx                  # Layout bảo vệ buộc đăng nhập (Auth guard)
├── _authenticated/
│   ├── employees/index.tsx             # /employees (danh sách)
│   ├── employees_/$employeeId.tsx      # Layout chi tiết nhân sự (chứa thanh điều hướng tab + <Outlet />)
│   ├── employees_/$employeeId/
│   │   ├── index.tsx                   # Tab mặc định (thông tin cá nhân)
│   │   ├── family.tsx                  # /employees/:id/family (chi tiết gia đình)
│   │   ├── contracts.tsx               # /employees/:id/contracts (chi tiết hợp đồng)
│   │   └── ...                         # Mỗi dev sẽ bổ sung thêm tab của họ vào đây
│   ├── config/...                      # Các trang Cấu hình
│   └── my/...                          # Các trang tự phục vụ bản thân
└── login.tsx                           # /login (nằm ngoài phạm vi bảo vệ đăng nhập)
```

**Các quy ước chính**:
- `_authenticated.tsx` = là một layout tự động kiểm tra đăng nhập, chuyển hướng người dùng về `/login` nếu chưa đăng nhập.
- `employees_/$employeeId.tsx` = layout không đường dẫn (pathless) dành cho trang Chi tiết Nhân viên (thanh nav bar dạng tab + `<Outlet />`)
- Mỗi lập trình viên tự thêm các file tab của họ vào thư mục `$employeeId/`

---

## 4. Gói dùng chung (Shared Package) — Các Validator (DTOs)

> **Tham khảo**: Xem `packages/shared/src/validators/config.ts` để nắm được mẫu validator, `constants/enums.ts` để xem các hằng số enum được khai báo kiểu gì.

**Các quy ước chính**:
- Tất cả schema bằng Zod để tạo/sửa/xóa thực thể phải nằm ở `@hrms/shared` — nhằm được sử dụng bởi cả backend (validate API) và frontend (validate Form).
- Khai báo mảng bằng Enum cần được ép kiểu rõ ràng: `z.enum(CODES as [Code, ...Code[]])` — phải ép kiểu sang định dạng tập hợp (union), đừng dùng generic `string`.
- Các schema dùng chung (`paginationSchema`, `idParamSchema`) lưu tại `validators/common.ts`
- Các kiểu dữ liệu đầu vào `Input` phải được suy luận từ Zod qua từ khóa `z.infer<>`
- **KHÔNG đặt các interface của các Entity (thực thể DB) vào trong thư viện dùng chung `shared`** — các trường kiểu Dữ liệu thời gian (`Date`) sẽ bị chuyển thành dạng chữ (`string`) lúc chạy JSON serialize. Backend tự lấy types từ Drizzle, Frontend tự lấy types từ Eden Treaty một cách an toàn nhất.

---

## 5. Lược đồ Drizzle — Bảng CSDL

> **Tham khảo**: Xem `apps/backend/src/db/schema/contracts.ts` để học cách khai báo cấu trúc bảng.

**Các quy ước chính**:
- Gọi thêm `.$type<EnumCode>()` ở cuối khi khai báo đối với mọi cột thuộc kiểu `varchar` mà mục đích đang lưu Enum codes — điều này giúp gò bó (narrow) các kiểu gõ từ dạng `string` sang thành tập hợp union tĩnh chuyên biệt.
- Luôn phải có `{ withTimezone: true }` trên các cột thuộc định dạng timestamp (ngày giờ).
- Phải xuất khẩu loại Alias `$inferSelect` / `$inferInsert` ngay sau khi khai báo xong một định dạng bảng:
  ```typescript
  export const contractTypes = pgTable("contract_types", { ... });
  export type ContractType = typeof contractTypes.$inferSelect;
  export type NewContractType = typeof contractTypes.$inferInsert;
  ```
- Tính sở hữu định dạng Schema: Của dev nào dev nấy tự lo. Hãy trao đổi với nhau trước khi cố ý sửa một bảng CSDL của dev khác.

---

## 6. Quy ước Đặt tên (Naming Conventions)

| Thực thể | Quy ước | Ví dụ |
|--------|-----------|---------|
| DB table (Bảng DB) | `snake_case` (số nhiều) | `employee_degrees` |
| DB column (Cột DB) | `snake_case` | `full_name`, `created_at` |
| Drizzle table var (Biến bảng Drizzle) | `camelCase` | `employeeDegrees` |
| TypeScript type (Kiểu Typescript) | `PascalCase` | `EmployeeDegree` |
| Zod schema (Khuôn dạng Zod) | `camelCase` + `Schema` | `createEmployeeDegreeSchema` |
| API endpoint (Đường dẫn API) | `kebab-case` | `/api/employees/:id/bank-accounts` |
| Route file (File đường dẫn React) | `kebab-case.tsx` | `bank-accounts.tsx` |
| Component | `PascalCase.tsx` | `EmployeeTable.tsx` |
| Store | `camelCase.ts` | `auth.ts` |
| Enum constant (Hằng số dạng phân loại) | `PascalCase` | `Gender`, `WorkStatus` |
| Enum key (Ký hiệu chìa khoá Enum) | `UPPER_SNAKE_CASE` | `GIANG_VIEN_CHINH` |

---

## 7. Cấu trúc giá trị trả về API

Tất cả các đường dẫn API phải trả về đáp án dưới một trong các dạng này:

```typescript
// Trả về một đối tượng đơn
{ data: { id: "...", ... } }

// Trả về dạng Liệt kê Mảng (Hỗ trợ phân trang)
{ data: { items: [...], total: 100, page: 1, pageSize: 20 } }

// Lỗi dạng Toast bật lên ở Frontend
{ type: "toast", error: "Mô tả lỗi bằng tiếng Việt" }

// Lỗi riêng lẻ cho mỗi ô Input ở Frontend
{ type: "field", error: "Dữ liệu không hợp lệ", fields: { "fieldName": "Lỗi cụ thể" } }
```

Việc gọi API ở frontend dựa trên Eden Treaty diễn ra bằng: `const { data, error } = await api...get()`. Lập trình viên kiểm tra giá trị của biến `error` xem có null không để phân giải đường lỗi. **Tuyệt đối không sử dụng trường `success`.**

---

## 8. Xử lý Lỗi

> **Tham khảo**: Xem `common/utils/errors.ts` để biết các lớp lỗi, `common/plugins/error-handler.ts` đối với chức năng bắt lỗi toàn cục, kiểu hợp nhất có phân loại tên `ErrorResponse` trong thư mục `@hrms/shared`.

- Bất kỳ cấu hình xử lý lỗi nào cũng phải mang theo biến `type` với chữ `"toast"` (đối với lời nhắn chung) hay là chữ `"field"` (đối với cảnh báo tại tầng mỗi trường nhập)
- Chỉ Ném (Throw) ra ngoài các lỗi có bắt nguồn bằng các dòng Subclass của AppError để thông báo dạng Toast: `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409)
- Chỉ Ném (Throw) ra loại lỗi `FieldValidationError<T>` khi muốn phát sinh lỗi tại phân lớp service. Với `<T>` bảo mật an toàn thời gian biên dịch tại khu vực keys của Body.
- Khi người dùng gửi yêu cầu Sai so với các khối schema Elysia (chẳng hạn như thiếu params, sai tham số truy vấn ở body, v.v.), plugin `errorPlugin` sẽ tự động chuyển lỗi này về lại thành dạng cảnh báo `"field"`.
- **Tuyệt đối chỉ dùng Throw.** Đừng bao giờ chèn `set.status` rồi `return`.
- Tính tự vệ theo vai trò: gọi hàm `requireRole(user.role, "ADMIN", "TCCB")` — chương trình sẽ ngầm tạo một Throw mang lớp lỗi `ForbiddenError`.

---

## 9. Cấu trúc kỹ thuật Frontend Tương lai

> **Tình trạng hiện nay**: Chờ. Đang lên phác thảo, vì chưa hề có tài liệu mockups vẽ trên ứng dụng thiết kế gửi sang phần mềm này.

### Trình sinh thái hệ (Tech Stack)

| Lớp/Tầng | Thư viện | Ý nghĩa/Mục đích |
|-------|---------|---------|
| Khung sườn làm nền tảng | React 19 | Render, Hiển thị giao diện |
| Phân chia điều hướng (Routing) | TanStack Router | Làm định hướng đường chuyển dựa vào file một cách an toàn param/quary. |
| Quản lý trạng thái nội hàm (State) | Zustand | Biến dùng riêng tư phía front, UI (auth, màu nền, v.v.) — KO NÊN để lưu data do server đổ xuống |
| Người gọi API (API Client) | Eden Treaty | Tạo dựng API End-to-End Type safe kết sinh hoàn hảo kèm vs Elysia |
| Gõ Biểu mẫu (Forms) | React Hook Form + Zod | Khai thác thư viện Schema `@hrms/shared` nhằm bọc Validate Forms nhàn rỗi. |
| Quản trị làm đẹp (Styling) | Tailwind CSS 4 | Các cục thuộc tính tạo Css tiện nghi |
| Bảng mã Lập phần màn hình UI | shadcn/ui (radix-maia style, zinc base) | Cách điều hướng nền theo quy chuẩn dễ thấy và tiếp cận. |
| Icons hình | Lucide React | Tệp tin icon |
| Lịch / Thời gian | date-fns | Render hiển thị chuỗi |

### Sổ Nhật Ký Gốc Quyết Nghị Đầu Xoáy

> **Tham khảo**: Đọc tại `apps/frontend/src/api/client.ts` về Eden Treaty, còn `stores/auth.ts` dành cách phân giải trạng thái.

- Sử dụng **Eden Treaty** gọi cho trọn vẹn mọi phương thức từ hệ thống API — không dại dột tự xài hàng lậu mồi gốc API Raw `fetch`. Vì Eden đã thiết kê chuẩn ra kết cấu `{ data, error }`.
- Triển khai **Zustand** cho các việc xoay quanh Giao Diện với Auth bảo mật đơn giản thôi. Phải rạch ròi giới tuyến (One store per domain), KO dùng để lưu mọi dữ kiện lên.
- Sự kết hợp **React Hook Form + `zodResolver`** là chúa tể thống lĩnh của Input nhập văn vẻ Form — mượn liền khuôn bộ mẫu `shared` bên kia.
- Triển khai **shadcn/ui** lắp đặt bộ Components — Tải về bằng chuỗi `npx shadcn@latest add <component>`.
- **Giao diện dựa theo Role:** Kéo trường `user.role` để châm biến UI ẩn hiện nút / Tab. Nhưng không được quá lạm dụng. Nhớ rằng Backend mới là nơi chốt sổ cuối cùng chức năng hàm `requireRole()`. Phần Frontend chỉ để vỗ về trải nghiệm thôi.

### Phân vùng Đăng-Xuất luồng sự kiện (Auth flow):

1. Chương trình load App → file gốc `_authenticated.tsx` có bổn phận check xem phiên Session với `/auth/session` API.
2. Nếu được Cấp thẻ OK → Mở giao diện Render đầy đủ cho Màn điều hướng.
3. Nếu 401 lỡ trượt đỗ → Tự đánh bật văng qua giao diện `/login` Login
4. Làm Login Đăng Nhập → Gọi API `/auth/login` phương thức POST → Đổ kho user → Cài văng về Main `.`
5. Nếu Đăng Xuất → Qua POST của `/auth/logout` API → Delete xoá dẹp biến kho auth → Văng về con đường `/login`.

### TODO (Những việc nhạy sẽ làm lúc có Bản vẽ Giao diện Design)

1. **Dev 1**: Khuôn mặt cái đơn đăng nhập Login, cùng tấm chiếu cấm khu `_authenticated.tsx`.
2. **Dev 3**: Dựng cột Cửa viền Bên lề (Sidebar), Thanh thả ngọc Trên (Nav Top), Thẻ Header nhô, Grid lưới Bảng hiển thị Bốn Phương (Data table) và bọc lõi bao bên ngoài thẻ Form Nhập Biểu mẫu.
3. **Mọi dev có mặt tại trận phím**: Quất shadcn và rèn mưu tự lập giao việc do mảng mình cai quản.

---

## 10. Biến thiết đặt môi trường (Environment Variables)

```bash
# Sổ Môi Trường Chung Toàn Tuyến Mạch .env (Đứng ở Root — sẽ cấp nguồn gọi đi mọi nẻo backend xài len cờ: --env-file ../../.env)
DATABASE_URL=postgres://user:pass@localhost:5432/hrms
BETTER_AUTH_SECRET=your-secret-key-here
PORT=3000
FRONTEND_URL=http://localhost:5173

# Sổ Cho Trẻ Frontend (.env)
VITE_API_URL=http://localhost:3000
```

> **Gợi nhớ**: Hướng mắt về tập địa `packages/env/` có lắp tệp khung sinh đôi `@t3-oss/env-core` + Zod gánh việc soát môi trường từ khởi thủy rễ máy ảo Server. Tất cả ngọn giáo bọc trong nhánh backend buộc phải viện dùng hệ câu trích: `import { env } from "@hrms/env"` — ko dùng chiêu rách process.env độc đoán cá thể!
