## Phân tích các mâu thuẫn/thiếu nhất quán trong system-spec.md

### 🔴 MỨC NGHIÊM TRỌNG CAO (Ảnh hưởng logic nghiệp vụ)

---

#### 1. UC 4.26 (Chỉnh sửa hồ sơ) — Chồng chéo phạm vi với các UC chuyên biệt

**Vấn đề:** UC 4.26 cho phép sửa trực tiếp trong hồ sơ tất cả: thông tin hợp đồng (phụ lục, trạng thái), thông tin đánh giá (đánh dấu ngưng hoạt động). Nhưng hệ thống đã có các UC riêng:
- UC 4.22: Thêm mới hợp đồng lao động
- UC 4.29: Ghi nhận đánh giá cho nhân sự

**Mâu thuẫn:** Người dùng có thể sửa hợp đồng/đánh giá qua 2 luồng khác nhau. Luồng nào là chính? Validation rules có giống nhau không?

**Mong muốn:** Tách rõ: UC 4.26 chỉ cho phép sửa thông tin cá nhân cơ bản. Thêm ghi chú rằng thông tin hợp đồng/đánh giá chỉ được quản lý qua UC 4.22 / UC 4.29.

---

#### 2. Thiếu luồng chuyển trạng thái tham gia "Đã đăng ký" → "Đang học"

**Vấn đề:** Enum `TrangThaiThamGia` có: Đã đăng ký → Đang học → Hoàn thành/Không đạt.

- UC 4.40 (Đăng ký): Gán trạng thái = "Đã đăng ký"
- UC 4.36 (Ghi nhận kết quả): Hiển thị trạng thái = "Đang học" rồi chuyển sang "Hoàn thành" / "Không đạt"

**Nhưng không có UC hay System Auto-Job nào** định nghĩa khi nào "Đã đăng ký" → "Đang học". Logic này nên xảy ra khi khóa đào tạo chuyển trạng thái từ "Đang mở đăng ký" → "Đang đào tạo", nhưng không có UC/flow nào mô tả.

**Mong muốn:** Bổ sung vào UC 4.34 (Sửa khóa đào tạo) — khi TCCB chuyển trạng thái khóa sang "Đang đào tạo", hệ thống tự động batch-update.

---

#### 3. UC 4.28 (Xem chi tiết hồ sơ) — TCKT xem được "Lương & Phụ cấp" mâu thuẫn với UC 4.7

**Vấn đề:**
- UC 4.7 (Phân quyền) mô tả quyền TCKT: *"Xem hồ sơ nhân sự (thông tin nhân sự - thông tin hồ sơ, hợp đồng, đánh giá)"* — **không bao gồm Lương & Phụ cấp**.
- Nhưng UC 4.28 (Xem chi tiết) hiển thị **tất cả tab** bao gồm "Lương & Phụ cấp" cho cả TCCB và TCKT, không phân biệt.

**Mong muốn:** 
- TCKT CẦN xem lương (vì là Phòng Tài chính): Cập nhật mô tả quyền TCKT trong UC 4.7 để bao gồm "Lương & Phụ cấp".

---

### 🟡 MỨC TRUNG BÌNH (Thiếu sót cần bổ sung)

---

#### 5. UC 4.9, 4.10: Tác nhân bao gồm "phòng TCCB" nhưng mô tả/luồng chỉ đề cập "Quản trị viên"

**Vấn đề:**
- UC 4.9 (Tạo đơn vị): Actor = "Quản trị viên, phòng TCCB". Nhưng Mục đích ghi: *"Cho phép **Quản trị viên** tạo mới..."*. Toàn bộ luồng Basic Flow dùng "Quản trị viên" ở mọi bước.
- UC 4.10 (Sửa đơn vị): Tương tự — Actor có TCCB nhưng mô tả/flow chỉ ghi "Quản trị viên".

**Mong muốn:** Sửa mô tả và luồng sự kiện: thay "Quản trị viên" bằng "Người dùng"

---

#### 6. UC 4.23 (Tìm kiếm hồ sơ) và UC 4.37 (Thống kê) — Trigger chỉ đề cập TCCB, thiếu TCKT

**Vấn đề:**
- UC 4.23: Actor = "Phòng TCCB, phòng TCKT". Trigger ghi: *"Cán bộ TCCB nhập từ khóa tìm kiếm..."* — thiếu TCKT.
- UC 4.37: Actor = "Phòng TCCB, Phòng TCKT". Trigger: *"Phòng TCCB chọn menu..."*. Luồng chính: *"Cán bộ TCCB truy cập menu..."* — chỉ nêu TCCB.

**Mong muốn:** Sửa trigger và luồng: thay "Phòng TCCB / Phòng TCKT" dùng đại từ chung "Người dùng".

---

#### 7. UC 4.13, 4.17, 4.20 (Sửa danh mục) — Thiếu precondition kiểm tra trạng thái danh mục

**Vấn đề:** 
- FEAT 9.2 nói rõ: *"sửa thông tin đối với hệ số lương **mới được tạo** phục vụ sửa chữa nhập liệu lỗi"* — ngụ ý chỉ sửa khi vừa tạo.
- Nhưng UC 4.13/4.17/4.20 **không có precondition** hay exception kiểm tra trạng thái hiện tại ("Đang sử dụng" / "Ngừng sử dụng").

**Câu hỏi cần quyết định:** 
- Có cho phép sửa danh mục đang ở trạng thái "Ngừng sử dụng" không?
- Có cho phép sửa danh mục đang được nhiều hồ sơ sử dụng không?

**Mong muốn:** Bổ sung precondition: "Danh mục ở trạng thái 'Đang sử dụng'" và thêm exception flow nếu trạng thái là "Ngừng sử dụng" → từ chối sửa.

---

#### 8. UC 4.15, 4.18, 4.21 (Ngừng sử dụng) — Thiếu precondition kiểm tra trạng thái hiện tại

**Vấn đề:** Các UC này không kiểm tra danh mục đã ở trạng thái "Ngừng sử dụng" hay chưa trước khi cho phép thao tác. Precondition chỉ ghi "đã tồn tại trong hệ thống".

**Mong muốn:** Bổ sung precondition: "Danh mục đang ở trạng thái 'Đang sử dụng'" và exception flow: nếu đã "Ngừng sử dụng" → vô hiệu hóa nút hoặc thông báo.

---

#### 9. UC 4.7 (Phân quyền) — Mối quan hệ <<include>> với UC 4.5/4.6 chưa rõ

**Vấn đề:**
- UC 4.5 (Thêm tài khoản) bước 3: *"Admin nhập thông tin: Email, Nhân sự, Vai trò **(UC 4.7)**"*
- UC 4.6 (Sửa tài khoản) bước 3: *"Admin thay đổi Email, Vai trò **(UC 4.7)**"*
- Nhưng UC 4.7 cũng có trigger riêng: *"Quản trị viên nhấn 'Phân quyền người dùng'"* — hoạt động độc lập.

**Mâu thuẫn:** UC 4.7 vừa là **<<include>>** (được gọi từ UC 4.5/4.6), vừa là **standalone** (có trigger riêng). Mối quan hệ này không được ghi rõ trong biểu đồ UC.

**Mong muốn:** Ghi rõ trong 3.3: "UC 4.5 và UC 4.6 **<<include>>** UC 4.7 để thực hiện phân quyền vai trò."

---

#### 10. FEAT 7.8 vs UC 4.28 A2 — Xuất Excel bị giới hạn nhưng FEAT không đề cập

**Vấn đề:**
- FEAT 7.8: *"Hệ thống cho phép phòng nhân sự và phòng tài chính có thể in hoặc xuất Excel hồ sơ nhân sự"* — không đề cập giới hạn nội dung.
- UC 4.28 A2: *"xuất ra file chứa tất cả thông tin **(trừ thông tin hợp đồng, khen thưởng/kỷ luật)**"* — loại trừ 2 loại thông tin.

**Mong muốn:** Mở rộng UC 4.28 A2 cho phép xuất đầy đủ nếu FEAT yêu cầu.

---

### 🟠 MỨC NHẸ (Lỗi copy-paste / sai tham chiếu bước)

---

#### 11. Lỗi copy-paste: "Quay lại màn hình danh sách nhân sự" ở sai ngữ cảnh

Nhiều UC ghi "Quay lại danh sách **nhân sự**" khi UC không liên quan đến nhân sự:

| UC | Chức năng thực tế | Phải quay về |
|---|---|---|
| UC 4.9 E4 | Tạo đơn vị tổ chức | Sơ đồ cơ cấu tổ chức |
| UC 4.10 E3 | Sửa đơn vị tổ chức | Sơ đồ cơ cấu tổ chức |
| UC 4.33 E2 | Mở khóa đào tạo | Danh sách khóa đào tạo |
| UC 4.34 E4 | Sửa khóa đào tạo | Danh sách khóa đào tạo |

**Mong muốn:** Sửa navigation target cho đúng module tương ứng.

---

#### 12. UC 4.22 (Thêm HĐ) — Sai tham chiếu bước trong Exception Flows

- **E1:** Ghi *"Tại bước 3"* nhưng việc kiểm tra mã nhân sự xảy ra ở **bước 4**.
- **E3:** Ghi *"Phòng TCCB quay lại bước 4"* nhưng bước 4 là bước hệ thống kiểm tra, không phải bước nhập liệu. Nên quay về **bước 7** (nhập thông tin hợp đồng) hoặc **bước 5** (chọn loại hợp đồng).

**Mong muốn:** E1 → sửa thành "Tại bước 4". E3 → sửa thành "quay lại bước 5" hoặc "bước 7".

---

#### 13. UC 4.34 E1 — Trùng lặp/thừa với Precondition

**Vấn đề:** 
- Precondition: *"Khóa đào tạo đang ở trạng thái 'Đang mở đăng ký' hoặc 'Đang đào tạo'"*
- E1: *"nếu khóa đào tạo ở trạng thái 'Đã hoàn thành'"* → từ chối sửa.

Nếu precondition được enforce, thì trạng thái "Đã hoàn thành" sẽ không bao giờ đến được E1.

**Mong muốn:** Bỏ E1 hoặc sửa thành: "E1: Chuyển trạng thái không hợp lệ — Tại bước 7, nếu trạng thái mới được chọn vi phạm thứ tự chuyển đổi (ví dụ: đã Hoàn thành muốn quay lại Đang đào tạo)."

---

#### 14. UC 4.38–4.41 (Self-service) — Actor list đầy đủ nhưng biểu đồ phân rã chỉ gắn với "Người dùng"

**Vấn đề:**
- UC 4.38, 4.39, 4.40, 4.41 đều liệt kê Actor = "Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự" (tất cả 4 vai trò).
- Nhưng phần 3.3.2 (Biểu đồ phân rã theo tác nhân): Các UC này **chỉ xuất hiện** trong phân rã cho "Người dùng" (3.3.2.d), **không xuất hiện** trong phân rã cho Admin (3.3.2.a), TCCB (3.3.2.b), hay TCKT (3.3.2.c).

**Mong muốn:** Một trong hai:
- Giữ actor = "Mọi người dùng" nhưng bổ sung các UC này vào phần phân rã 3.3.2.a, 3.3.2.b, 3.3.2.c.
- Hoặc sửa actor trong UC chi tiết chỉ còn "Cán bộ nhân sự (Người dùng)" và ghi chú rằng các vai trò khác đều kế thừa quyền "Người dùng".

---

#### 15. UC 4.12 E1 — Đánh số bước bị lỗi

**Vấn đề:** Exception E1 liệt kê điều kiện validate, rồi ghi:
> *"1. Hệ thống báo lỗi 2. Dữ liệu không được lưu"*

Nhưng phía trên đã có "1." cho danh sách lỗi validate, dẫn đến có **hai bước 1** trong cùng exception flow.

**Mong muốn:** Sửa numbering: các điều kiện validate dùng bullet, các bước sau đánh số riêng (2. Hệ thống báo lỗi, 3. Dữ liệu không được lưu).

---

### Tổng kết nhanh

| # | Mức độ | Vấn đề | Vị trí |
|---|---|---|---|
| 1 | 🔴 Cao | UC 4.26 chồng chéo phạm vi với UC 4.22, 4.29 | UC 4.26 |
| 2 | 🔴 Cao | Thiếu transition "Đã đăng ký" → "Đang học" | UC 4.40, 4.36, enum TrangThaiThamGia |
| 3 | 🔴 Cao | TCKT xem được Lương & Phụ cấp mâu thuẫn với quyền ở UC 4.7 | UC 4.7 vs UC 4.28 |
| 4 | 🔴 Cao | Auto-bãi nhiệm gắn sai vào flow thủ công | UC 4.31 A1 |
| 5 | 🟡 TB | Actor vs Mô tả/Flow không khớp (chỉ ghi Admin) | UC 4.9, 4.10 |
| 6 | 🟡 TB | Trigger chỉ nhắc TCCB, thiếu TCKT | UC 4.23, 4.37 |
| 7 | 🟡 TB | Thiếu precondition trạng thái danh mục khi sửa | UC 4.13, 4.17, 4.20 |
| 8 | 🟡 TB | Thiếu precondition trạng thái trước khi ngừng sử dụng | UC 4.15, 4.18, 4.21 |
| 9 | 🟡 TB | Mối quan hệ <<include>> chưa rõ ràng | UC 4.7 vs UC 4.5/4.6 |
| 10 | 🟡 TB | FEAT không đề cập giới hạn xuất Excel | FEAT 7.8 vs UC 4.28 A2 |
| 11 | 🟠 Nhẹ | Copy-paste "quay lại danh sách nhân sự" sai ngữ cảnh | UC 4.9, 4.10, 4.33, 4.34 |
| 12 | 🟠 Nhẹ | Sai tham chiếu bước trong Exception | UC 4.22 E1, E3 |
| 13 | 🟠 Nhẹ | E1 thừa/trùng với Precondition | UC 4.34 |
| 14 | 🟠 Nhẹ | Actor list vs biểu đồ phân rã không khớp | UC 4.38–4.41 vs 3.3.2 |
| 15 | 🟠 Nhẹ | Đánh số bước bị trùng trong exception | UC 4.12 E1 |
