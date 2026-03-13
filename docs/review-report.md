# BÁO CÁO KIỂM TRA NỘI DUNG TÀI LIỆU ĐẶC TẢ HỆ THỐNG HRMS

> **Phạm vi kiểm tra:** `khong-co-class.md` và các file đặc tả UC liên kết (`uc1-10.md`, `uc11-20.md`, `uc21-30.md`, `uc31-42.md`)
>
> **Nội dung kiểm tra:** Tính nhất quán logic, ánh xạ STRQ → FEAT → UC, lỗi diễn đạt, lỗi định dạng, và các vấn đề nghiệp vụ.

---

## I. LỖI LOGIC NGHIỆP VỤ (CRITICAL)

### 1.1. Thiếu quy trình chuyển trạng thái hợp đồng "Còn hiệu lực" → "Chờ gia hạn"

- **Vị trí:** Toàn bộ tài liệu (khong-co-class.md, uc21-30.md)
- **Mô tả:** Hệ thống sử dụng 4 trạng thái hợp đồng: `Chưa hợp đồng`, `Còn hiệu lực`, `Chờ gia hạn`, `Hết hiệu lực`. Tuy nhiên, **không có UC hay quy trình tự động nào mô tả việc chuyển trạng thái từ "Còn hiệu lực" sang "Chờ gia hạn"** khi hợp đồng sắp hết hạn (trong khoảng `thoiGianChoGiaHan` được cấu hình tại UC 4.19).
- **Tác động:** UC 4.22 (Thêm mới hợp đồng lao động) bước 4 kiểm tra trạng thái "Chờ gia hạn" để cho phép tạo hợp đồng mới, nhưng không có cơ chế nào tạo ra trạng thái này. UC 4.27 A1 cũng tham chiếu "Chờ gia hạn" để tự động thôi việc.
- **Đề xuất:** Bổ sung một Actor **Hệ thống (System Timer)** với quy trình tự động: Hệ thống định kỳ kiểm tra hợp đồng "Còn hiệu lực" mà thời gian còn lại ≤ `thoiGianChoGiaHan` → tự động chuyển sang "Chờ gia hạn". Hoặc bổ sung mô tả rõ ràng trong UC 4.22 / UC 4.27 về cách trạng thái này được kích hoạt.

### 1.2. FEAT 9.2 vs UC 4.13 — Phạm vi sửa hệ số lương không khớp

- **Vị trí:** khong-co-class.md (FEAT 9.2), uc11-20.md (UC 4.13)
- **Mô tả:** FEAT 9.2 ghi rõ: *"sửa thông tin đối với hệ số lương **mới được tạo** phục vụ sửa chữa nhập liệu lỗi"* — hàm ý chỉ cho sửa khi vừa tạo xong (chưa được sử dụng). Tuy nhiên, UC 4.13 chỉ yêu cầu điều kiện tiên quyết là *"Danh mục hệ số lương đang ở trạng thái Đang sử dụng"* — không giới hạn chỉ bản ghi mới tạo.
- **Tác động:** Phạm vi sửa ở UC rộng hơn ý đồ của FEAT. Nếu hệ số lương đã được gán cho nhiều hồ sơ nhân sự, việc sửa đổi có thể ảnh hưởng hàng loạt.
- **Đề xuất:** Làm rõ một trong hai hướng:
  - (A) UC 4.13 bổ sung ràng buộc: chỉ cho sửa khi hệ số lương chưa được gán cho hồ sơ nào.
  - (B) Cập nhật FEAT 9.2 để mở rộng phạm vi sửa, kèm cảnh báo khi hệ số lương đã được sử dụng.

### 1.3. UC 4.29 (Ghi nhận đánh giá) — Thiếu kiểm tra trạng thái "Đã thôi việc"

- **Vị trí:** uc21-30.md (UC 4.29)
- **Mô tả:** UC 4.29 cho phép ghi nhận đánh giá khen thưởng/kỷ luật cho nhân sự nhưng **không có điều kiện tiên quyết hay ngoại lệ nào ngăn chặn việc thêm đánh giá cho nhân sự có trạng thái "Đã thôi việc"**. Trong khi đó, UC 4.26 (Chỉnh sửa hồ sơ) có E3 rõ ràng chặn thao tác sửa khi nhân sự đã thôi việc.
- **Tác động:** Có thể ghi nhận khen thưởng/kỷ luật cho người đã thôi việc — không hợp lý về mặt nghiệp vụ.
- **Đề xuất:** Bổ sung Exception Flow cho UC 4.29: *"Nếu nhân sự ở trạng thái 'Đã thôi việc', hệ thống từ chối ghi nhận đánh giá."*

---

## II. LỖI NHẤT QUÁN TÊN GỌI / DIỄN ĐẠT

### 2.1. FEAT 3.5 — Tên tác nhân không nhất quán

- **Vị trí:** khong-co-class.md (FEAT 3.5)
- **Mô tả:** FEAT 3.2, 3.3, 3.4 đều dùng *"quản trị viên và **phòng TCCB**"*, nhưng FEAT 3.5 lại dùng *"quản trị viên và **phòng nhân sự**"*.
- **Tham chiếu:** UC 4.32 (Xem chi tiết đơn vị) xác nhận tác nhân là *"Phòng TCCB, Quản trị viên"*.
- **Đề xuất:** Sửa FEAT 3.5 thành *"quản trị viên và phòng TCCB"* để nhất quán.

### 2.2. UC 4.11 — Tên use case thừa từ

- **Vị trí:** uc11-20.md (UC 4.11)
- **Mô tả:** Tên UC là *"Cập nhật **trạng thái tình trạng** cho đơn vị tổ chức nhân sự"*. Từ "trạng thái" và "tình trạng" có nghĩa gần như tương đương, gây dư thừa và khó đọc.
- **Đề xuất:** Sửa thành *"Cập nhật trạng thái cho đơn vị tổ chức nhân sự"* hoặc *"Cập nhật tình trạng đơn vị tổ chức nhân sự"*.

### 2.3. UC 4.30 — Tên UC thiếu "điều chuyển"

- **Vị trí:** uc21-30.md (UC 4.30)
- **Mô tả:** FEAT 4.1 ghi rõ *"bổ nhiệm **và điều chuyển** nhân sự vào một đơn vị"*. Tuy nhiên, tên UC 4.30 chỉ là *"Bổ nhiệm nhân sự cho đơn vị tổ chức nhân sự"*. Chức năng điều chuyển bị ẩn trong Alternative Flow A1 (*"Bổ nhiệm nhân sự đang công tác ở đơn vị khác"*).
- **Tác động:** Người đọc có thể không nhận ra UC này bao gồm cả điều chuyển.
- **Đề xuất:** Đổi tên thành *"Bổ nhiệm và điều chuyển nhân sự cho đơn vị tổ chức nhân sự"* hoặc tách thành UC riêng cho điều chuyển.

### 2.4. UC 4.22 bước 10 — Mô tả cập nhật trạng thái mơ hồ

- **Vị trí:** uc21-30.md (UC 4.22, bước 10)
- **Mô tả:** Ghi *"cập nhật trạng thái hợp đồng của nhân sự dựa theo hợp đồng mới nhất"* mà không nêu rõ giá trị trạng thái kết quả. Theo logic, hợp đồng mới có trạng thái mặc định "Còn hiệu lực" nên trạng thái hợp đồng nhân sự cũng phải là "Còn hiệu lực", nhưng không được ghi tường minh.
- **Đề xuất:** Sửa thành: *"Hệ thống cập nhật hợp đồng mới với trạng thái mặc định 'Còn hiệu lực', đồng thời cập nhật trạng thái hợp đồng của nhân sự thành 'Còn hiệu lực'."*

---

## III. LỖI CẤU TRÚC / TRÌNH BÀY

### 3.1. Mục 3.2 (khong-co-class.md) — Nhóm UC gom chung gây hiểu nhầm số lượng

- **Vị trí:** khong-co-class.md, mục 3.2
- **Mô tả:** Các nhóm UC được liệt kê dạng tổng hợp, ví dụ *"UC Quản lý tài khoản (Tìm kiếm, Thêm, Sửa, Đổi trạng thái)"* trông như 1 mục nhưng thực tế tương ứng 4-5 UC riêng biệt trong đặc tả (UC 4.4–4.8). Người đọc có thể hiểu nhầm về tổng số UC thực tế.
- **Đề xuất:** Bổ sung ghi chú tổng số UC thực tế (42 UC) ở đầu mục 3.2, hoặc đánh số tham chiếu (UC 4.x) cho từng dòng.

### 3.2. UC 4.7 — Vai trò kép không được làm rõ

- **Vị trí:** uc1-10.md (UC 4.7), khong-co-class.md (ghi chú 3.3.1)
- **Mô tả:** UC 4.7 (Phân quyền tài khoản) vừa là UC độc lập (có trigger, luồng sự kiện riêng) vừa được **<<include>>** bởi UC 4.5 (Thêm tài khoản) và UC 4.6 (Sửa tài khoản). Ghi chú tại 3.3.1 có đề cập quan hệ include nhưng bản thân UC 4.7 không mô tả rõ cách nó hoạt động khi được gọi từ UC khác (bước nào được bỏ qua, dữ liệu nào được truyền).
- **Đề xuất:** Bổ sung Alternative Flow trong UC 4.7 mô tả luồng khi được include từ UC 4.5/4.6, hoặc ghi chú rõ tại UC 4.5/4.6 phần nào của UC 4.7 được thực thi.

---

## IV. LỖI ĐÁNH SỐ / ĐỊNH DẠNG

### 4.1. UC 4.16 E1 — Đánh số bước bị reset

- **Vị trí:** uc11-20.md (UC 4.16, Exception Flow E1)
- **Mô tả:** Các bước trong E1 đánh số lại từ 1 thay vì tiếp tục tuần tự:
  ```
  1. Tại bước 5, Hệ thống validate phát hiện lỗi: ...
  1. Hệ thống báo lỗi      ← Nên là bước 2
  2. Dữ liệu không được lưu ← Nên là bước 3
  ```
- **Đề xuất:** Sửa đánh số thành 1, 2, 3 liên tục.

### 4.2. UC 4.17 E1 — Trộn lẫn đánh số và bullet point

- **Vị trí:** uc11-20.md (UC 4.17, Exception Flow E1)
- **Mô tả:** E1 bắt đầu bằng numbered list (1, 2, 3) nhưng phần kết quả lại dùng bullet point:
  ```
  1. Tại bước 5, Hệ thống validate phát hiện lỗi:
  2. Tên loại phụ cấp dài quá 200 từ...
  3. Thông tin bắt buộc đầy đủ
     * Hệ thống báo lỗi    ← Bullet thay vì số 4
     * Dữ liệu không được lưu ← Bullet thay vì số 5
  ```
- **Đề xuất:** Thống nhất sử dụng numbered list xuyên suốt.

### 4.3. UC 4.30 E1 — Trộn bullet và đánh số

- **Vị trí:** uc21-30.md (UC 4.30, Exception Flow E1)
- **Mô tả:** E1 có bullet point theo sau bởi "1." — không nhất quán:
  ```
  * Ngày bắt đầu < ngày hiện tại
  1. Hệ thống yêu cầu nhập lại...
  ```
- **Đề xuất:** Sửa thành đánh số tuần tự 1, 2 liên tục.

---

## V. CÁC VẤN ĐỀ BỔ SUNG / CẢI THIỆN

### 5.1. UC 4.35 — Thiếu cột "Trạng thái tham gia" trong danh sách

- **Vị trí:** uc31-42.md (UC 4.35)
- **Mô tả:** Danh sách tham gia khóa đào tạo hiển thị (Họ tên, Mã cán bộ, Đơn vị công tác, Thời điểm đăng ký) nhưng **thiếu cột "Trạng thái tham gia"** (Đã đăng ký / Đang học / Hoàn thành / Không đạt). Trong khi UC 4.36 (Ghi nhận kết quả) và UC 4.41 (Xem danh sách đã đăng ký) đều sử dụng trạng thái tham gia.
- **Đề xuất:** Bổ sung cột *"Trạng thái tham gia"* vào danh sách tại UC 4.35.

### 5.2. UC 4.25 A1 — Bỏ qua validation logic khi import Excel

- **Vị trí:** uc21-30.md (UC 4.25, Alternative Flow A1)
- **Mô tả:** A1 bước 4 kiểm tra: *"Định dạng file, Cấu trúc cột dữ liệu, Các trường thông tin bắt buộc"*, sau đó bước 5 ghi *"Tiếp tục bước 5 của luồng chính"*. Tuy nhiên, bước 4 của luồng chính là kiểm tra *"tính đầy đủ, hợp lệ và **tính logic** của các thông tin"*. A1 chỉ kiểm tra format/cấu trúc mà bỏ qua validation logic (ví dụ: ngày sinh hợp lệ, CCCD đúng format, email unique...).
- **Đề xuất:** Bổ sung rõ tại A1 bước 4: *"Hệ thống kiểm tra: Định dạng file, Cấu trúc cột dữ liệu, Các trường thông tin bắt buộc, **và tính hợp lệ logic của dữ liệu từng dòng**"*.

### 5.3. Thiếu bảng truy xuất nguồn gốc FEAT → UC (Traceability Matrix)

- **Vị trí:** Toàn bộ tài liệu
- **Mô tả:** Tài liệu mô tả STRQ → FEAT trong mục 2.1 và liệt kê UC trong mục 3.2, nhưng **không có bảng truy xuất tường minh** từ FEAT → UC. Người đọc phải tự suy luận FEAT nào tương ứng UC nào.
- **Đề xuất:** Bổ sung bảng Traceability Matrix dạng:

| FEAT | UC tương ứng |
|------|-------------|
| FEAT 1.1 | UC 4.1 (Đăng nhập) |
| FEAT 1.2 | UC 4.2 (Đăng xuất) |
| FEAT 1.3 | UC 4.2 A1 (Đăng xuất tự động) |
| FEAT 1.4 | UC 4.3 (Đổi mật khẩu) |
| ... | ... |

### 5.4. STRQ 4 — Tên tác nhân không nhất quán với STRQ 7

- **Vị trí:** khong-co-class.md (STRQ 4 vs STRQ 7)
- **Mô tả:** STRQ 4 dùng *"Phòng nhân sự"*, STRQ 7 cũng dùng *"Phòng nhân sự"*, nhưng FEAT bên trong STRQ 3 lại dùng *"phòng TCCB"*. Xuyên suốt tài liệu, "Phòng nhân sự" và "Phòng TCCB" được dùng lẫn lộn để chỉ cùng một tác nhân (Phòng Tổ chức - Cán bộ). Mục 3.1 (Xác định Actors) ghi rõ: *"Phòng Tổ chức - Cán bộ (Phòng Nhân sự)"* nhưng sự phân biệt này không được áp dụng nhất quán.
- **Đề xuất:** Thống nhất sử dụng một tên gọi duy nhất xuyên suốt tài liệu. Khuyến nghị dùng **"Phòng TCCB"** vì đây là tên chính thức được dùng trong UC specs.

### 5.5. UC 4.30 — Điều kiện tiên quyết có thể thiếu trạng thái "Đang chờ xét"

- **Vị trí:** uc21-30.md (UC 4.30)
- **Mô tả:** Precondition ghi *"Nhân sự được bổ nhiệm phải có trạng thái hợp đồng 'Còn hiệu lực'"*, nhưng bước 3 của Basic Flow lại hiển thị danh sách nhân sự ở trạng thái **"Đang chờ xét"** (trạng thái làm việc) và hợp đồng "Còn hiệu lực". Alternative Flow A1 bổ nhiệm nhân sự đang công tác ở đơn vị khác (trạng thái "Đang công tác"). Precondition không bao quát hết cả hai luồng.
- **Đề xuất:** Sửa precondition thành: *"Nhân sự phải có trạng thái hợp đồng 'Còn hiệu lực' và trạng thái làm việc 'Đang chờ xét' hoặc 'Đang công tác'"*.

---

## VI. TỔNG HỢP

| Mức độ | Số lượng | Mô tả |
|--------|----------|-------|
| **CRITICAL** (Logic nghiệp vụ) | 3 | Thiếu quy trình chuyển trạng thái hợp đồng, phạm vi sửa hệ số lương không khớp, thiếu kiểm tra thôi việc khi đánh giá |
| **MAJOR** (Nhất quán tên/diễn đạt) | 4 | Tên tác nhân không nhất quán (FEAT 3.5), tên UC thừa từ (4.11), thiếu "điều chuyển" (4.30), mô tả mơ hồ (4.22) |
| **MINOR** (Cấu trúc/trình bày) | 2 | Nhóm UC gom chung gây hiểu nhầm, vai trò kép UC 4.7 không rõ |
| **FORMAT** (Đánh số/định dạng) | 3 | Lỗi đánh số bước tại UC 4.16, 4.17, 4.30 |
| **IMPROVEMENT** (Đề xuất cải thiện) | 5 | Thiếu cột trạng thái (4.35), bỏ qua validation Excel (4.25), thiếu traceability matrix, tên tác nhân lẫn lộn, precondition chưa đủ (4.30) |
| **Tổng cộng** | **17** | |

---

*Báo cáo được tạo dựa trên kết quả kiểm tra chéo toàn bộ 5 file tài liệu đặc tả hệ thống HRMS - Trường Đại học Thủy Lợi.*
