## Phân tích Không nhất quán trong system-spec.md

### 🔴 Mức Nghiêm trọng Cao (Ảnh hưởng logic nghiệp vụ)

---

**1. UC 4.27 (Đánh dấu thôi việc) — Precondition mâu thuẫn với Alternative Flow**

- **Precondition** yêu cầu: Nhân sự phải đang ở trạng thái **"Chờ gia hạn"**
- **Alternative A2** lại mô tả: "Thôi việc khi hợp đồng **còn hiệu lực** (thanh lý trước hạn)"
- Hai điều kiện này **loại trừ nhau** — nếu precondition bắt buộc "Chờ gia hạn", thì A2 không bao giờ xảy ra được.

> **Khuyến nghị:** Sửa Precondition thành: "Nhân sự đang ở trạng thái làm việc **khác** 'Đã thôi việc'" (tức là chấp nhận "Đang chờ xét", "Đang công tác"). Giữ nguyên A2 như luồng xử lý riêng cho trường hợp hợp đồng còn hiệu lực.

---

**2. UC 4.22 (Thêm hợp đồng) — Hardcode "18 ngày" mâu thuẫn với cấu hình**

- Step 4 và E1 hardcode con số **18 ngày** cho thời gian chờ gia hạn
- Nhưng UC 4.19 (Thêm loại hợp đồng) có trường **"thời gian theo ngày chờ gia hạn"** là giá trị **cấu hình được** cho mỗi loại hợp đồng

> **Khuyến nghị:** Thay "18 ngày" bằng "trong thời gian chờ gia hạn được cấu hình của loại hợp đồng tương ứng".

---

**3. Thiếu luồng chuyển trạng thái "Chờ gia hạn" (TrangThaiHopDongNS)**

- Enum `TrangThaiHopDongNS` (5.1.4) có trạng thái **CHO_GIA_HAN**
- UC 4.22 và UC 4.27 đều **tham chiếu** trạng thái này
- Nhưng **không có UC nào** hay luồng tự động nào mô tả khi nào và như thế nào trạng thái nhân sự chuyển từ **CON_HIEU_LUC → CHO_GIA_HAN**
- Actor "Hệ thống (System Timer)" được định nghĩa ở mục 3.1 nhưng **không có UC tương ứng** cho chuyển đổi này

> **Khuyến nghị:** Bổ sung luồng tự động của Hệ thống (System Timer): "Khi hợp đồng đang 'Còn hiệu lực' và thời gian còn lại ≤ thời gian chờ gia hạn của loại hợp đồng → Cập nhật trạng thái hợp đồng nhân sự thành 'Chờ gia hạn'". Có thể thêm như một UC riêng cho System Actor hoặc ghi nhận rõ ràng trong phần FEAT.

---

**4. Thiếu luồng chuyển trạng thái Khóa đào tạo và Trạng thái tham gia**

- Enum `TrangThaiKhoaDaoTao` có: Đang mở đăng ký → Đang đào tạo → Đã hoàn thành
- Enum `TrangThaiThamGia` có: Đã đăng ký → Đang học → Hoàn thành/Không đạt
- **Không có UC nào** mô tả chuyển trạng thái:
  - Khóa đào tạo: "Đang mở đăng ký" → "Đang đào tạo" (Ai trigger? Tự động theo thời gian hay manual?)
  - Khóa đào tạo: "Đang đào tạo" → "Đã hoàn thành" (Tương tự)
  - Học viên: "Đã đăng ký" → "Đang học" (Khi nào chuyển?)
- UC 4.34 cho phép sửa "Trạng thái khóa đào tạo" nhưng **không có validation** ngăn chuyển ngược (ví dụ: từ "Đã hoàn thành" về "Đang đào tạo")

> **Khuyến nghị:** 
> - Bổ sung quy tắc chuyển trạng thái: chỉ cho phép chuyển tiến (Đang mở → Đang đào tạo → Đã hoàn thành). Thêm validation vào UC 4.34.
> - Xác định rõ: chuyển trạng thái tự động (theo thời gian) hay thủ công (Phòng TCCB thao tác)?
> - Bổ sung logic auto-chuyển "Đã đăng ký" → "Đang học" khi khóa chuyển sang "Đang đào tạo".

---

**5. UC 4.7 (Phân quyền) — UC không hoàn chỉnh**

- Basic flow chỉ có 3 bước: chọn dropdown → hiển thị quyền → chọn vai trò
- **Thiếu**: Tài khoản nào đang được phân quyền? Bước "Lưu"? Xác nhận? Lưu lịch sử?
- UC 4.5 và 4.6 tham chiếu "(UC 4.7)" như sub-function, nhưng UC 4.7 được liệt kê như UC độc lập với trigger riêng

> **Khuyến nghị:** Hoặc:
> - **(A)** Bổ sung đầy đủ flow: xác định tài khoản → chọn vai trò → xác nhận → lưu → ghi log. Hoặc:
> - **(B)** Xác định rõ UC 4.7 là `<<include>>` của UC 4.5 và 4.6, loại bỏ trigger độc lập, và mô tả nó như một bước con (sub-flow).

---

**6. UC 4.30 (Bổ nhiệm) — Mâu thuẫn logic trạng thái**

- Step 3 hiển thị nhân sự ở trạng thái **"Đang chờ xét"** VÀ hợp đồng **"Còn hiệu lực"**
- Nhưng UC 4.25 (Thêm hồ sơ) step 6 tạo nhân sự mới với trạng thái mặc định: **"Đang chờ xét"** + **"Chưa hợp đồng"**
- Nghĩa là nhân sự mới tạo KHÔNG thể được bổ nhiệm ngay (vì chưa có hợp đồng)
- Workflow ngầm yêu cầu: Tạo hồ sơ → Tạo hợp đồng → Bổ nhiệm, nhưng điều này **không được ghi rõ** trong precondition

> **Khuyến nghị:** Bổ sung precondition: "Nhân sự phải có trạng thái hợp đồng 'Còn hiệu lực'." Hoặc nếu cho phép bổ nhiệm nhân sự chưa có hợp đồng, cần sửa step 3 để mở rộng filter.

---

### 🟡 Mức Trung bình (Không nhất quán về tên gọi/tham chiếu)

---

**7. Tên Actor không thống nhất xuyên suốt tài liệu**

| Vị trí | Tên gọi |
|---|---|
| Mục 3.1 (Định nghĩa Actor) | "Người dùng (Cán bộ / Giảng viên / Nhân viên)" |
| Các UC (4.1, 4.2, 4.38...) | "Cán bộ nhân sự" |
| Enum VaiTro (5.1.1) | "CAN_BO_NHAN_SU" (Cán bộ / Nhân sự) |
| Nội dung UC 4.38 | "CB/GV", "CBGV", "Cán bộ/Giảng viên" |

> **Khuyến nghị:** Chọn MỘT tên chính thức và sử dụng nhất quán. Đề xuất: "Cán bộ" (khớp với enum CAN_BO_NHAN_SU) hoặc "Người dùng" (khớp với 3.1). Nếu muốn giữ nhiều tên, dùng bảng mapping ở đầu tài liệu.

---

**8. UC 4.4 (Tìm kiếm tài khoản) — Thiếu vai trò trong dropdown filter**

- Dropdown "Vai trò" liệt kê: Tất cả, Quản trị viên, Cán bộ TCCB, Cán bộ TCKT
- **Thiếu "Cán bộ nhân sự"** (vai trò thứ 4 trong enum VaiTro)

> **Khuyến nghị:** Bổ sung "Cán bộ nhân sự" vào danh sách dropdown.

---

**9. UC 4.3 (Đổi mật khẩu) — Tham chiếu bước sai trong Exception Flow**

- E1 ghi: "Tại **bước 7**, hệ thống phát hiện các lỗi"
- Nhưng bước 7 là "Hệ thống thay đổi thông tin về mật khẩu" (hành động lưu)
- Validation logic thực sự nằm ở **bước 6** ("Hệ thống kiểm tra dữ liệu")

> **Khuyến nghị:** Sửa E1 thành "Tại bước **6**".

---

**10. UC 4.5 (Thêm tài khoản) — Tham chiếu bước sai trong Exception Flow**

- E1 ghi: "Tại **bước 6**, Hệ thống validate phát hiện lỗi"
- Nhưng bước 6 là "Hệ thống tự động tạo mật khẩu ngẫu nhiên"
- Validation nằm ở **bước 5**

> **Khuyến nghị:** Sửa E1 thành "Tại bước **5**".

---

**11. UC 4.11 (Cập nhật trạng thái đơn vị) — Đánh số bước lộn xộn & tham chiếu Exception sai**

- Basic flow: Steps 5-12 trộn lẫn bước chính với sub-item (Steps 7-9 là sub-fields của step 6; Steps 11-12 là sub-options của step 10)
- E2 ghi "Tại bước 9 hoặc A1.9" nhưng step 9 trong basic flow là "Lý do (Giải thể / Tái cơ cấu / Khác)" — là data entry, không phải validation. Validation là ở step 14.

> **Khuyến nghị:** Đánh lại số bước rõ ràng, sử dụng sub-numbering (6a, 6b, 6c) cho các trường thông tin. Sửa tham chiếu exception cho đúng bước validation.

---

**12. UC 4.17 (Sửa phụ cấp) — Phân loại "Hủy thao tác" không nhất quán**

- UC 4.17 đặt "Hủy thao tác" vào **Alternative Flow** (A1)
- Hầu hết tất cả UC khác đặt "Hủy thao tác" vào **Exception Flow** (E2, E3...)

> **Khuyến nghị:** Thống nhất: hoặc luôn đặt "Hủy thao tác" vào Exception Flow (vì nó là hủy bỏ luồng chính, không phải luồng thay thế), hoặc tách riêng thành một quy ước chung cho tất cả UC.

---

**13. UC 4.21 (Ngừng sử dụng loại hợp đồng) — Lỗi chính tả "Ngưng" vs "Ngừng"**

- Tiêu đề và basic flow dùng: **"Ngừng sử dụng"**
- Trigger (dòng 782), Precondition, Post-condition dùng: **"Ngưng sử dụng"**
- E1 ghi: "Hủy thao tác **xóa**" — nhưng đây là UC ngừng sử dụng, không phải xóa

> **Khuyến nghị:** Thống nhất dùng "Ngừng sử dụng". Sửa E1 từ "Hủy thao tác xóa" thành "Hủy thao tác ngừng sử dụng".

---

**14. HeSoLuong.bacLuong — Kiểu dữ liệu mâu thuẫn**

- UC 4.12 E1 validation rule: "Bậc lương phải là **số nguyên**"
- Class 5.1.23 HeSoLuong định nghĩa `bacLuong` kiểu **String**

> **Khuyến nghị:** Nếu bậc lương là số nguyên, đổi kiểu dữ liệu trong class diagram thành `Int`. Nếu giữ String (ví dụ: "Bậc 1", "Bậc 2"), sửa validation rule cho phù hợp.

---

### 🟢 Mức Thấp (Thiếu sót nhỏ / Cải tiến)

---

**15. UC 4.32 (Xem chi tiết đơn vị) — Mô tả mục đích rộng hơn Basic Flow**

- Mục đích đề cập: "Lịch sử bổ nhiệm, miễn nhiệm chức vụ" và "Lịch sử thay đổi tổ chức (thành lập, sáp nhập, giải thể)"
- Nhưng Basic Flow chỉ có 3 tab: Tổng quan, Nhân sự, Đơn vị trực thuộc — **không có tab Lịch sử**

> **Khuyến nghị:** Hoặc bổ sung tab "Lịch sử" vào basic flow, hoặc thu gọn phần mô tả mục đích cho khớp.

---

**16. Thiếu đối xứng: Xóa Phụ cấp và Loại Hợp đồng**

- Hệ số lương: có cả **Xóa** (UC 4.14) lẫn **Ngừng sử dụng** (UC 4.15)
- Loại phụ cấp: chỉ có **Ngừng sử dụng** (UC 4.18), không có Xóa
- Loại hợp đồng: chỉ có **Ngừng sử dụng** (UC 4.21), không có Xóa

> **Khuyến nghị:** Nếu đây là chủ ý (ví dụ: phụ cấp/hợp đồng không được phép xóa vì lý do audit), ghi chú rõ trong FEAT. Nếu là thiếu sót, bổ sung UC "Xóa danh mục loại phụ cấp" và "Xóa danh mục loại hợp đồng" tương tự UC 4.14 (chỉ cho xóa khi chưa được sử dụng).

---

**17. FEAT 10.1 (Thống kê) — Danh sách báo cáo trong FEAT vs UC không hoàn toàn khớp**

- FEAT 10.1 liệt kê: "đánh giá của cán bộ với khóa đào tạo, hợp đồng, báo cáo bổ nhiệm nhân sự"
- UC 4.37 liệt kê chi tiết hơn, bao gồm: "Báo cáo hợp đồng và tình trạng làm việc", "Báo cáo đào tạo và phát triển" — tên gọi khác đi so với FEAT

> **Khuyến nghị:** Đồng bộ tên nhóm báo cáo giữa FEAT 10.1 và UC 4.37.

---

### Tổng kết

| Mức độ | Số lượng | Loại vấn đề chính |
|---|---|---|
| 🔴 Cao | 6 | Mâu thuẫn logic nghiệp vụ, thiếu luồng chuyển trạng thái, UC không hoàn chỉnh |
| 🟡 Trung bình | 8 | Tên gọi không nhất quán, tham chiếu bước sai, lỗi chính tả, kiểu dữ liệu |
| 🟢 Thấp | 3 | Mô tả không khớp flow, thiếu đối xứng thiết kế, tên báo cáo |

Ưu tiên sửa nhóm 🔴 trước vì chúng ảnh hưởng trực tiếp đến việc implement.
