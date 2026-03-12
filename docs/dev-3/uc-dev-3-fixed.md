# Use Case — Dev 3: Quản lý hồ sơ nhân sự (Bản sửa lỗi)

> **Ghi chú**: File này là bản sửa lỗi từ `uc-dev-3.md`. Các thay đổi được đánh dấu bằng `[SỬA #N]` tương ứng với danh sách lỗi đã review.

---

### 4.23. Use Case: Tìm kiếm hồ sơ nhân sự

|  |  |
| --- | --- |
| **Tên use case** | **Tìm kiếm hồ sơ nhân sự** |
| Tác nhân chính | Phòng TCCB, phòng TCKT |
| Mục đích  (mô tả) | Cho phép cán bộ Phòng TCCB, phòng TCKT tìm kiếm hồ sơ nhân sự nhanh chóng dựa trên từ khóa như tên, mã nhân sự, số CCCD, email hoặc số điện thoại nhằm phục vụ công tác quản lý và tra cứu thông tin. |
| Mức độ ưu tiên  (Priority) | Bắt buộc |
| Điều kiện kích hoạt  (Trigger) | Cán bộ TCCB, phòng TCKT nhập từ khóa tìm kiếm và thực hiện tìm kiếm trong menu "Quản lý hồ sơ nhân sự" `[SỬA #1: Bổ sung phòng TCKT vào Trigger cho khớp với Tác nhân chính]` |
| Điều kiện tiên quyết  (Precondition) | Cán bộ TCCB, phòng TCKT đã đăng nhập hệ thống. |
| Điều kiện thành công  (Post-condition) | Danh sách nhân sự thỏa mãn điều kiện được hiển thị |
| Điều kiện thất bại | Hệ thống không xử lý yêu cầu tìm kiếm |
| Luồng sự kiện chính  (Basic Flow) | 1.  Phòng TCCB, phòng TCKT chọn menu "Quản lý Hồ sơ".  2.  Hệ thống hiển thị danh sách hồ sơ nhân viên (Mã, Họ tên, CCCD, Giới tính, Địa chỉ, SĐT liên hệ, Chức danh khoa học, Đơn vị công tác, Chức vụ đơn vị, Trạng thái công việc, Trạng thái hợp đồng) có phân trang.  3.  Phòng TCCB, phòng TCKT **nhập từ khóa** vào ô tìm kiếm (Tên, Mã, CCCD, Email, SĐT). `[SỬA #2: Bổ sung Email vào tiêu chí tìm kiếm cho khớp với Mục đích]`  4.  Hệ thống hiển thị kết quả tìm kiếm theo từ khóa (real-time). |
| Luồng sự kiện thay thế  (Alternative Flow) | **A1: Từ khóa tìm kiếm rỗng**   1. Tại bước 3, nếu phòng TCCB, phòng TCKT không nhập từ khóa 2. Hệ thống hiển thị toàn bộ danh sách hồ sơ nhân sự |
| Luồng sự kiện ngoại lệ  (Exception Flow) | **E1: Không có kết quả tìm kiếm**   1. Tại bước 4, nếu không có hồ sơ nào phù hợp với từ khóa 2. Hệ thống hiển thị thông báo: *"Không tìm thấy hồ sơ phù hợp."* |

---

### 4.24. Use Case: Lọc danh sách hồ sơ nhân sự

|  |  |
| --- | --- |
| **Tên use case** | **Lọc danh sách hồ sơ nhân sự** |
| Tác nhân chính | Phòng TCCB, phòng TCKT |
| Mục đích (mô tả) | Cho phép phòng TCCB, phòng TCKT lọc danh sách hồ sơ nhân sự dựa trên nhiều tiêu chí nhằm thu hẹp phạm vi dữ liệu phục vụ công tác quản lý. |
| Mức độ ưu tiên  (Priority) | Bắt buộc |
| Điều kiện kích hoạt  (Trigger) | Phòng TCCB, phòng TCKT chọn tiêu chí lọc trong menu "Quản lý hồ sơ nhân sự" |
| Điều kiện tiên quyết  (Precondition) | Phòng TCCB, phòng TCKT đã đăng nhập hệ thống. |
| Điều kiện thành công  (Post-condition) | Danh sách hồ sơ nhân sự được hiển thị đúng theo các tiêu chí lọc đã chọn |
| Điều kiện thất bại | Hệ thống không hiển thị yêu cầu lọc danh sách theo tiêu chí đã chọn do lỗi hệ thống |
| Luồng sự kiện chính  (Basic Flow) | 1.  Tại màn hình danh sách, Phòng TCCB, phòng TCKT nhấn "Bộ lọc nâng cao".  2.  Hệ thống hiển thị panel lọc với nhiều tiêu chí:   * **Đơn vị công tác:** Chọn Khoa, Phòng, Ban, Bộ môn * **Chức danh khoa học:** GS, PGS, Không có * **Chức vụ đơn vị:** Danh sách chức vụ được lấy từ dữ liệu hệ thống (ví dụ: Trưởng khoa, Phó khoa, Trưởng bộ môn, Trưởng phòng, Không chức vụ...) `[SỬA #8: Lấy danh sách chức vụ từ dữ liệu thực tế thay vì hardcode, đồng bộ với UC 4.30]` * **Trạng thái làm việc:** Đang chờ xét, Đang công tác, Đã thôi việc * **Trạng thái hợp đồng:** Chưa hợp đồng, Còn hiệu lực, Hết hiệu lực, Chờ gia hạn. * **Giới tính:** Nam, Nữ   3.  Phòng TCCB, phòng TCKT chọn các tiêu chí lọc.  4.  Nhấn "Áp dụng bộ lọc".  5.  Hệ thống hiển thị kết quả lọc đa tiêu chí. |
| Luồng sự kiện thay thế  (Alternative Flow) | **A1: Xóa bộ lọc / Reset** `[SỬA #9: Bổ sung luồng thay thế cho xóa bộ lọc]`  1. Tại bước 3 hoặc sau bước 5, Phòng TCCB, phòng TCKT nhấn "Xóa bộ lọc".  2. Hệ thống xóa toàn bộ tiêu chí lọc đã chọn và hiển thị lại danh sách hồ sơ nhân sự đầy đủ (tương đương trạng thái ban đầu). |
| Luồng sự kiện ngoại lệ  (Exception Flow) | **E1: Không có kết quả lọc**   1. Tại bước 5, nếu không có hồ sơ nào thỏa mãn tiêu chí đã chọn 2. Hệ thống hiển thị thông báo *"Không có hồ sơ phù hợp với tiêu chí lọc."* |

---

### 4.25. Use Case: Thêm mới Hồ sơ nhân sự

|  |  |
| --- | --- |
| **Tên use case** | **Thêm mới Hồ sơ nhân sự** |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Cho phép Phòng TCCB tạo mới và lưu trữ đầy đủ thông tin hồ sơ nhân sự trên hệ thống. |
| Mức độ ưu tiên  (Priority) | Bắt buộc |
| Điều kiện kích hoạt  (Trigger) | Phòng TCCB chọn chức năng thêm trong menu "Quản lý hồ sơ nhân sự" |
| Điều kiện tiên quyết  (Precondition) | Phòng TCCB đã đăng nhập hệ thống. |
| Điều kiện thành công  (Post-condition) | Hồ sơ nhân sự được tạo mới |
| Điều kiện thất bại | Hệ thống không thể tạo mới hồ sơ do lỗi hệ thống hoặc dữ liệu không hợp lệ. |
| Luồng sự kiện chính  (Basic Flow) | 1.  Tại màn hình danh sách, Phòng TCCB nhấn "Thêm mới".  2.  Hệ thống hiển thị form nhập liệu chia thành các tabs/bước.  3.  Phòng TCCB nhập các trường thông tin:   * **Thông tin chung bắt buộc**: Họ tên, Ngày sinh, Giới tính, CCCD, Quê quán, Địa chỉ, Mã số thuế (Không bắt buộc), Số Bảo hiểm xã hội (Không bắt buộc), Số bảo hiểm y tế (Không bắt buộc), Email, SĐT liên hệ. * **[MỞ RỘNG - Nếu là người nước ngoài],** Cán bộ TCCB tick chọn "Người nước ngoài", hệ thống hiển thị thêm các trường bắt buộc: Số Visa, Ngày hết hạn Visa, Số Hộ chiếu, Ngày hết hạn Hộ chiếu, Số giấy phép lao động, Ngày hết hạn giấy phép lao động, Upload PDF giấy phép lao động. * **Thông tin gia đình  (bắt buộc)**: Cha/Mẹ, Vợ/chồng, con, người phụ thuộc, thông tin chi tiết về gia đình. * **Thông tin ngân hàng  (bắt buộc)**: Tên Ngân hàng, Số tài khoản. * **Quá trình công tác** trước khi về trường: Nơi công tác, thời gian công tác **(bắt buộc)**. * **Thông tin Đảng/Đoàn (bắt buộc):** Ngày vào Đoàn/Đảng, Thông tin chi tiết. * **Upload ảnh chân dung  (bắt buộc).** * **Trình độ học vấn (bắt buộc):** Trình độ văn hóa, Trình độ đào tạo, Chức danh nghề nghiệp, Chức danh khoa học. * **Thông tin các bằng cấp  (bắt buộc)**: Tên bằng, Trường, Ngành, Năm tốt nghiệp, Xếp loại, Bản pdf. * **Thông tin các chứng chỉ  (bắt buộc):** Tên chứng chỉ, Nơi cấp, Ngày cấp, Ngày hết hạn, Bản pdf. * **Lương & Phụ cấp (bắt buộc):** Hệ số lương (đã được cấu hình), Phụ cấp(đã được cấu hình).   4. Phòng TCCB nhấn "Lưu". `[SỬA #3: Đổi thứ tự — người dùng nhấn Lưu trước, hệ thống validate sau]`  5. Hệ thống kiểm tra tính đầy đủ, hợp lệ và tính logic của các thông tin bắt buộc. Nếu dữ liệu không hợp lệ, chuyển sang E1.  6. Hệ thống tự động sinh Mã cán bộ và Trạng thái hợp đồng mặc định là "Chưa hợp đồng", Trạng thái làm việc là "Đang chờ xét".  7. Hệ thống lưu hồ sơ, lịch sử tạo hồ sơ và thông báo thành công. |
| Luồng sự kiện thay thế  (Alternative Flow) | **A1: Tạo mới hồ sơ nhân sự từ file Excel**  1. Tại bước 1 của Luồng sự kiện chính, Phòng TCCB chọn chức năng **"Thêm mới từ Excel"**.  2. Hệ thống hiển thị màn hình tải lên file Excel và cung cấp **file mẫu** theo định dạng quy định.  3. Phòng TCCB tải lên file Excel chứa danh sách hồ sơ nhân sự.  4. Hệ thống kiểm tra: Định dạng file, Cấu trúc cột dữ liệu, Các trường thông tin bắt buộc.  5. Tiếp tục bước 6 của luồng chính (sinh Mã cán bộ). `[SỬA #6: Sửa tham chiếu từ "bước 5" thành "bước 6" vì validation đã hoàn tất ở A1 bước 4, tránh validate lại]` |
| Luồng sự kiện ngoại lệ  (Exception Flow) | **E1: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc**   1. Tại bước 5 `[SỬA #3: Cập nhật tham chiếu bước từ 4 → 5 theo thứ tự mới]`, hệ thống phát hiện thiếu thông tin bắt buộc, định dạng dữ liệu sai hoặc các trường thời gian không hợp lệ. 2. Hệ thống hiển thị cảnh báo, đánh dấu các tab còn thiếu hoặc sai dữ liệu và không cho phép lưu hồ sơ.   **E2: Hủy thao tác**   1. Tại bước 3, Phòng TCCB chọn "Hủy". 2. Quay lại màn hình danh sách nhân sự. |

---

### 4.26. Use Case: Chỉnh sửa trong chi tiết hồ sơ nhân sự

|  |  |
| --- | --- |
| **Tên use case** | **Chỉnh sửa trong chi tiết hồ sơ nhân sự** |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Cho phép Phòng TCCB sửa và lưu lại đầy đủ thông tin hồ sơ nhân sự trên hệ thống nếu có thay đổi hoặc sai sót trong nhập liệu. `[SỬA #7: Lưu ý — UC này chỉ cho phép chỉnh sửa thông tin hồ sơ cơ bản và các mục đã được ghi nhận. Việc thêm mới hợp đồng lao động thuộc phạm vi UC 4.22, việc ghi nhận đánh giá mới thuộc phạm vi UC 4.29. UC 4.26 chỉ cho phép sửa/ẩn các mục đã tồn tại.]` |
| Mức độ ưu tiên  (Priority) | Bắt buộc |
| Điều kiện kích hoạt  (Trigger) | Phòng TCCB chọn chức năng sửa trong một nhân sự trong menu "Quản lý hồ sơ nhân sự" |
| Điều kiện tiên quyết  (Precondition) | Phòng TCCB đã đăng nhập hệ thống.  Hồ sơ nhân sự có trạng thái làm việc "Đang chờ xét", "Đang công tác" |
| Điều kiện thành công  (Post-condition) | Hồ sơ nhân sự được cập nhật.  Lịch sử thay đổi được ghi lại. |
| Điều kiện thất bại | Hồ sơ nhân sự không được cập nhật và thay đổi |
| Luồng sự kiện chính  (Basic Flow) | 1.  Tại màn hình danh sách, Phòng TCCB nhấn "Sửa" một nhân sự tại danh sách.  2.  Hệ thống hiển thị form nhập liệu chia thành các tabs/bước.  3.  Phòng TCCB có thể sửa các trường thông tin:   * **Thông tin chung bắt buộc**: Mã cán bộ (không thể sửa), Họ tên, Ngày sinh, Giới tính, CCCD, Quê quán, Địa chỉ, Mã số thuế (Không bắt buộc), Số Bảo hiểm xã hội (Không bắt buộc), Số bảo hiểm y tế (Không bắt buộc), Email, SĐT liên hệ. * **[MỞ RỘNG - Nếu là người nước ngoài],** Cán bộ TCCB tick chọn "Người nước ngoài", hệ thống hiển thị thêm các trường bắt buộc: Số Visa, Ngày hết hạn Visa, Số Hộ chiếu, Ngày hết hạn Hộ chiếu, Số giấy phép lao động, Ngày hết hạn giấy phép lao động, Upload PDF giấy phép lao động. * **Thông tin gia đình  (bắt buộc)**: Cha/Mẹ, Vợ/chồng, con, người phụ thuộc, thông tin chi tiết về gia đình. * **Thông tin ngân hàng  (bắt buộc)**: Tên Ngân hàng, Số tài khoản. * **Quá trình công tác** trước khi về trường: Nơi công tác, thời gian công tác **(bắt buộc)**. * **Thông tin Đảng/Đoàn (bắt buộc):** Ngày vào Đoàn/Đảng, Thông tin chi tiết. * **Upload ảnh chân dung  (bắt buộc).** * **Trình độ học vấn (bắt buộc):** Trình độ văn hóa, Trình độ đào tạo, Chức danh nghề nghiệp, Chức danh khoa học. * **Thông tin các bằng cấp  (bắt buộc)**: Tên bằng, Trường, Ngành, Năm tốt nghiệp, Xếp loại, Bản pdf. * **Thông tin các chứng chỉ  (bắt buộc):** Tên chứng chỉ, Nơi cấp, Ngày cấp, Ngày hết hạn, Bản pdf. * **Lương & Phụ cấp (bắt buộc):** Hệ số lương (đã được cấu hình), Phụ cấp(đã được cấu hình). * **Thông tin hợp đồng được lưu:** Ngày ký, Ngày hiệu lực, Ngày hết hạn, Nội dung hợp đồng (rich text editor - nhập điều khoản, mô tả công việc, quyền lợi...), bản PDF hợp đồng, Các phụ lục cho hợp đồng (Ngày phụ lục hiệu lực, Điều khoản bổ sung, Quy định mới, Lưu ý quan trọng; *Lưu ý các thông tin loại hợp đồng chỉ được thay đổi khi hợp đồng đang trong trạng thái 'Còn hiệu lực'*). * **Thông tin đánh giá:** Đánh dấu ngưng hoạt động cho đánh giá đã được thêm.  4. Cán bộ TCCB có thể ẩn đi một số mục khen thưởng, mục kỷ luật với tài khoản của cán bộ/ giảng viên, tài khoản của tài chính/ kế toán.  5. Cán bộ TCCB nhấn "Lưu". `[SỬA #3: Đổi thứ tự — người dùng nhấn Lưu trước, hệ thống validate sau]`  6. Hệ thống kiểm tra tính đầy đủ, hợp lệ và tính logic của các thông tin bắt buộc. Nếu dữ liệu không hợp lệ, chuyển sang E1.  7. Hệ thống lưu hồ sơ, lịch sử thay đổi và thông báo thành công. |
| Luồng sự kiện thay thế  (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ  (Exception Flow) | **E1: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc**   1. Tại bước 6 `[SỬA #3: Cập nhật tham chiếu bước từ 4 → 6 theo thứ tự mới]`, hệ thống phát hiện thiếu thông tin bắt buộc, định dạng dữ liệu sai hoặc các trường thời gian không hợp lệ. 2. Hệ thống hiển thị cảnh báo, đánh dấu các tab còn thiếu hoặc sai dữ liệu và không cho phép lưu hồ sơ.   **E2: Hủy thao tác**   1. Tại bước 3, Phòng TCCB chọn "Hủy". 2. Quay lại màn hình danh sách nhân sự. |

---

### 4.28. Use Case: Xem Chi tiết thông tin hồ sơ nhân sự

|  |  |
| --- | --- |
| **Tên use case** | **Xem Chi tiết thông tin hồ sơ nhân sự** |
| Tác nhân chính | Phòng TCCB, Phòng TCKT |
| Mục đích (mô tả) | Cho phép phòng TCCB, phòng TCKT xem chi tiết toàn bộ thông tin hồ sơ nhân sự, có thể thực hiện in hồ sơ |
| Mức độ ưu tiên  (Priority) | Bắt buộc |
| Điều kiện kích hoạt  (Trigger) | Phòng TCCB, phòng TCKT chọn chức năng xem chi tiết trong một nhân sự trong menu "Quản lý hồ sơ nhân sự" |
| Điều kiện tiên quyết  (Precondition) | Phòng TCCB, phòng TCKT đã đăng nhập hệ thống. |
| Điều kiện thành công  (Post-condition) | Thông tin chi tiết hồ sơ nhân sự được hiển thị đầy đủ, chính xác ở chế độ chỉ đọc. |
| Điều kiện thất bại | Hệ thống không hiển thị được thông tin hồ sơ do lỗi hệ thống hoặc dữ liệu không tồn tại. |
| Luồng sự kiện chính  (Basic Flow) | 1.  Tại danh sách, Phòng TCCB, phòng TCKT nhấn vào nhấn "Xem chi tiết" tại một nhân sự.  2.  Hệ thống hiển thị màn hình Chi tiết hồ sơ ở chế độ chỉ đọc.  3.  Hệ thống hiển thị đầy đủ thông tin theo các tab:   * **Tab "Thông tin chung":** Mã cán bộ, Lý lịch, liên hệ, gia đình, ảnh chân dung * **Tab "Trình độ & Chức danh":** Bằng cấp, chứng chỉ, chức danh khoa học, chức vụ, đơn vị công tác. * **Tab "Thông tin Đảng/ Đoàn":** Thông tin Đảng/ Đoàn đã được lưu. * **Tab "Lương & Phụ cấp":** Thông tin về ngạch, bậc, hệ số lương, thông tin ngân hàng * **Tab "Hợp đồng":** Thông tin về các loại hợp đồng đồng đã ký * **Tab "Khen thưởng/Kỷ luật":** Các mục khen thưởng, kỷ luật của nhân sự * **Tab "Công tác":** Quá trình công tác trước khi về trường đã được ghi |
| Luồng sự kiện thay thế  (Alternative Flow) | **A1: In hồ sơ**   1. Tiếp tục bước 3, Phòng TCCB và TCKT có thể in ra hồ sơ ở định dạng PDF   **A2: Xuất ra Excel**   1. Tiếp tục bước 3, Phòng TCCB và TCKT có thể xuất ra file chứa tất cả thông tin (trừ thông tin hợp đồng, khen thưởng/kỷ luật) dưới định dạng file Excel |
| Luồng sự kiện ngoại lệ  (Exception Flow) | **E1: Hồ sơ không tồn tại** `[SỬA #4: Bổ sung Exception Flow cho khớp với Điều kiện thất bại]`  1. Tại bước 2, hệ thống không tìm thấy hồ sơ nhân sự (dữ liệu đã bị xóa hoặc ID không hợp lệ).  2. Hệ thống hiển thị thông báo: *"Hồ sơ nhân sự không tồn tại hoặc đã bị xóa."*  3. Chuyển hướng về màn hình danh sách hồ sơ nhân sự.   **E2: Lỗi hệ thống**  1. Tại bước 2, hệ thống gặp lỗi khi truy vấn dữ liệu.  2. Hệ thống hiển thị thông báo: *"Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."* |

---

### 4.38. Use Case: Xem các thông tin trong hồ sơ cá nhân của nhân sự

|  |  |
| --- | --- |
| **Tên use case** | **Xem các thông tin trong hồ sơ cá nhân của nhân sự** |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự |
| Mục đích (mô tả) | Cho phép Cán bộ/Giảng viên (CBGV) xem toàn bộ thông tin hồ sơ cá nhân của mình đang được lưu trong hệ thống, tra cứu lịch sử hợp đồng, hệ số, bậc lương, các quyết định khen thưởng và kỷ luật của bản thân. |
| Mức độ ưu tiên  (Priority) | Bắt buộc |
| Điều kiện kích hoạt  (Trigger) | CB/GV chọn chức năng "Hồ sơ cá nhân" trên giao diện hệ thống |
| Điều kiện tiên quyết  (Precondition) | CB/GV đã đăng nhập. Tài khoản đã được liên kết với một hồ sơ nhân sự trong hệ thống. `[SỬA #5: Bổ sung điều kiện tiên quyết — tài khoản phải có hồ sơ nhân sự liên kết]` |
| Điều kiện thành công  (Post-condition) | Thông tin hồ sơ cá nhân được hiển thị đầy đủ cho CBGV. |
| Điều kiện thất bại | Không thể hiển thị thông tin hồ sơ cá nhân do lỗi hệ thống hoặc tài khoản chưa liên kết hồ sơ nhân sự. `[SỬA #5: Bổ sung điều kiện thất bại cho tài khoản chưa liên kết]` |
| Luồng sự kiện chính  (Basic Flow) | 1.  CB/GV chọn các mục kích hoạt chức năng xem hồ sơ nhân sự  2.  Hệ thống hiển thị đầy đủ thông tin theo các tab:   * **Tab "Thông tin chung":** Mã cán bộ, Lý lịch, liên hệ, gia đình, ảnh chân dung * **Tab "Trình độ & Chức danh":** Bằng cấp, chứng chỉ, chức danh khoa học, chức vụ, đơn vị công tác. * **Tab "Thông tin Đảng/ Đoàn":** Thông tin Đảng/ Đoàn đã được lưu. * **Tab "Lương & Phụ cấp":** Thông tin về ngạch, bậc, hệ số lương, thông tin ngân hàng * **Tab "Hợp đồng":** Thông tin về các loại hợp đồng đã ký * **Tab "Khen thưởng/Kỷ luật":** Các mục khen thưởng, kỷ luật của nhân sự * **Tab "Công tác":** Quá trình công tác |
| Luồng sự kiện thay thế  (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ  (Exception Flow) | **E1: Tài khoản chưa liên kết hồ sơ nhân sự** `[SỬA #5: Bổ sung Exception Flow]`  1. Tại bước 1, hệ thống kiểm tra tài khoản đăng nhập không có hồ sơ nhân sự liên kết (ví dụ: tài khoản Admin mới được tạo).  2. Hệ thống hiển thị thông báo: *"Tài khoản của bạn chưa được liên kết với hồ sơ nhân sự. Vui lòng liên hệ Phòng TCCB."*   **E2: Lỗi hệ thống**  1. Tại bước 2, hệ thống gặp lỗi khi truy vấn dữ liệu hồ sơ cá nhân.  2. Hệ thống hiển thị thông báo: *"Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."* |

---

## Tổng hợp các thay đổi

| # | UC | Loại | Mô tả thay đổi |
|---|------|------|-----------------|
| 1 | 4.23 | 🔴 Sửa lỗi | Trigger: Bổ sung "phòng TCKT" cho khớp với Tác nhân chính |
| 2 | 4.23 | 🔴 Sửa lỗi | Basic Flow bước 3: Bổ sung "Email" vào tiêu chí tìm kiếm cho khớp với Mục đích |
| 3 | 4.25, 4.26 | 🔴 Sửa lỗi | Đổi thứ tự: Nhấn "Lưu" → Hệ thống validate → Lưu/Báo lỗi (thay vì validate trước khi nhấn Lưu) |
| 4 | 4.28 | 🔴 Sửa lỗi | Bổ sung Exception Flow: E1 (hồ sơ không tồn tại) + E2 (lỗi hệ thống) |
| 5 | 4.38 | 🔴 Sửa lỗi | Bổ sung Precondition (liên kết hồ sơ), cập nhật Điều kiện thất bại, bổ sung Exception Flow: E1 (chưa liên kết) + E2 (lỗi hệ thống) |
| 6 | 4.25 | 🟡 Cải thiện | A1 bước 5: Sửa tham chiếu "bước 5" → "bước 6" (sinh Mã cán bộ) vì validation đã hoàn tất ở A1 |
| 7 | 4.26 | 🟡 Cải thiện | Mục đích: Bổ sung ghi chú phân định ranh giới với UC 4.22 (hợp đồng) và UC 4.29 (đánh giá) |
| 8 | 4.24 | 🟡 Cải thiện | Bộ lọc "Chức vụ đơn vị": Lấy từ dữ liệu hệ thống thay vì hardcode, đồng bộ với UC 4.30 |
| 9 | 4.24 | 🟡 Cải thiện | Bổ sung Alternative Flow A1: Xóa bộ lọc / Reset |
