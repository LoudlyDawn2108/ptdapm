Kết quả review uc-dev-3.md
🔴 Lỗi logic / Mâu thuẫn rõ ràng
1. UC 4.23 — Trigger chỉ ghi "Cán bộ TCCB" nhưng Tác nhân gồm cả TCKT
- Trigger: "Cán bộ TCCB nhập từ khóa tìm kiếm..."
- Tác nhân chính: "Phòng TCCB, phòng TCKT"
- → TCKT cũng là tác nhân nhưng Trigger bỏ sót. Nên sửa thành "Cán bộ TCCB, phòng TCKT nhập từ khóa..."
2. UC 4.23 — Mục đích liệt kê tiêu chí tìm kiếm không khớp với Basic Flow
- Mục đích: tìm kiếm theo "tên, mã nhân sự, số CCCD, email hoặc số điện thoại"
- Basic Flow bước 3: "nhập từ khóa vào ô tìm kiếm (Tên, Mã, CCCD, SĐT)" — thiếu Email
- → Hoặc bổ sung Email vào bước 3, hoặc bỏ Email khỏi Mục đích.
3. UC 4.25 & 4.26 — Thứ tự bước bị đảo: Validate trước khi nhấn Lưu
- Bước 4: "Hệ thống kiểm tra tính đầy đủ, hợp lệ..."
- Bước 5: "Phòng TCCB nhấn 'Lưu'"
- → Sai thứ tự logic. Thông thường: Người dùng nhấn "Lưu" → Hệ thống validate → Lưu hoặc báo lỗi. Nếu ý định là real-time validation thì nên ghi rõ, và bước 5 (Lưu) vẫn cần một bước validate cuối cùng trước khi persist dữ liệu.
4. UC 4.28 — Điều kiện thất bại có nhưng Exception Flow lại "Không có"
- Điều kiện thất bại: "Hệ thống không hiển thị được thông tin hồ sơ do lỗi hệ thống hoặc dữ liệu không tồn tại."
- Exception Flow: "Không có"
- → Mâu thuẫn. Đã xác định điều kiện thất bại (dữ liệu không tồn tại) thì phải có exception flow tương ứng mô tả hệ thống xử lý như thế nào (hiển thị thông báo "Hồ sơ không tồn tại" chẳng hạn).
5. UC 4.38 — Thiếu Exception Flow tương tự
- Điều kiện thất bại: "Không thể hiển thị thông tin hồ sơ cá nhân do lỗi hệ thống."
- Exception Flow: "Không có"
- → Thiếu xử lý cho trường hợp: tài khoản chưa liên kết hồ sơ nhân sự (ví dụ Admin mới được tạo chưa có hồ sơ). Nên bổ sung exception.
---
🟡 Vấn đề nhỏ / Cần cân nhắc
6. UC 4.25 — Alternative Flow A1 (Excel) nhảy bước có thể gây nhầm
- A1 bước 5: "Tiếp tục bước 5 của luồng chính" (tức bước "Phòng TCCB nhấn Lưu")
- Nhưng bước 4 luồng chính (validate) bị bỏ qua, vì A1 bước 4 đã validate Excel riêng.
- → Không sai logic nhưng dễ gây hiểu nhầm. Nên ghi rõ hơn: "Tiếp tục bước 6 của luồng chính" (sinh mã cán bộ) nếu validation đã hoàn tất.
7. UC 4.26 — Scope quá rộng, overlap với UC khác
- UC 4.26 cho phép sửa thông tin hợp đồng (ngày ký, phụ lục...) → overlap với UC 4.22 (Thêm mới hợp đồng lao động).
- UC 4.26 cho phép sửa thông tin đánh giá → overlap với UC 4.29 (Ghi nhận đánh giá).
- → Không sai nhưng ranh giới chức năng mờ. Nên làm rõ: 4.26 là "chỉnh sửa thông tin hồ sơ cơ bản" hay là "trang tổng hợp quản lý mọi thứ liên quan đến nhân sự"?
8. UC 4.24 — Bộ lọc "Chức vụ đơn vị" cứng giá trị
- Tiêu chí lọc: "Trưởng khoa, Phó khoa, Không chức vụ"
- Nhưng UC 4.30 (Bổ nhiệm) cho phép gán nhiều chức vụ linh hoạt hơn (Trưởng bộ môn, Trưởng phòng...).
- → Bộ lọc nên lấy từ dữ liệu thực tế hoặc liệt kê đầy đủ hơn, nếu không sẽ không lọc được các chức vụ khác.
9. UC 4.24 — Không có Alternative Flow cho "Xóa bộ lọc / Reset"
- Luồng chỉ mô tả áp dụng bộ lọc, không có luồng thay thế cho "Xóa bộ lọc" để quay lại danh sách gốc. Nên bổ sung.
---
✅ Đúng / Nhất quán với system-spec
- Nội dung 6 UC (4.23, 4.24, 4.25, 4.26, 4.28, 4.38) trong uc-dev-3.md khớp hoàn toàn với system-spec.md. Không có sai lệch nào giữa 2 file.
- Việc thiếu UC 4.27 (Đánh dấu thôi việc) là bình thường vì có thể do dev khác phụ trách.
- Các trường dữ liệu, tiêu chí lọc, trạng thái nhất quán với các enum và lớp dữ liệu đã khai báo trong phần V của system-spec.
---
Tóm lại, có 5 lỗi logic/mâu thuẫn rõ (mục 1–5) cần sửa, và 4 điểm nhỏ (mục 6–9) nên cân nhắc cải thiện. Lỗi phổ biến nhất là thiếu exception flow khi đã khai báo điều kiện thất bại và thứ tự validate/save bị đảo.