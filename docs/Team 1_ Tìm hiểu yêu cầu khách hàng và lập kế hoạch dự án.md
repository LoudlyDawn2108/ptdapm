
Đề Tài:
Quản Lý Nhân Sự Trường Đại Học Thủy Lợi
Nhiệm vụ: Tìm hiểu yêu cầu khách hàng và lập kế hoạch dự án


## **5\. Kịch bản use case (UCS)** {#5.-kịch-bản-use-case-(ucs)}

**5.1. Đặc tả use case: Đăng nhập**

| Tên use case | Đăng nhập |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự  |
| Mục đích (mô tả) | Cho phép người dùng xác thực và truy cập vào hệ thống dựa trên thông tin tài khoản được cấp.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Ấn “Đăng nhập” |
| Điều kiện tiên quyết (Precondition) | Người dùng đã được cấp tài khoản. Hệ thống đang hoạt động bình thường.  |
| Điều kiện thành công (Post-condition) | Người dùng được chuyển đến trang chủ (Dashboard) tương ứng với vai trò của mình.  |
| Điều kiện thất bại | Tác nhân đăng nhập vào tài khoản thất bại |
| Luồng sự kiện chính (Basic Flow) | 1\.  Người dùng truy cập vào địa chỉ web của hệ thống. 2\.  Hệ thống hiển thị màn hình Đăng nhập. 3\.  Người dùng nhập \`Tên đăng nhập\` (Mã nhân viên) và \`Mật khẩu\`. 4\.  Người dùng nhấn nút "Đăng nhập". 5\.  Hệ thống kiểm tra tính hợp lệ của dữ liệu nhập (không được để trống). 6\.  Hệ thống xác thực thông tin tài khoản với cơ sở dữ liệu. 7\.  Hệ thống kiểm tra trạng thái tài khoản (Active/ Lock). 8\.  Hệ thống xác định vai trò của người dùng. 9\.  Hệ thống chuyển hướng người dùng đến Dashboard tương ứng.  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Đăng nhập khi đã có session** Tại bước 1, Người dùng truy cập trang đăng nhập khi đã có session hợp lệ,  Hệ thống tự động chuyển hướng vào Dashboard.  |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Sai Tên đăng nhập hoặc Mật khẩu** Tại bước 6, hệ thống kiểm tra thông tin không khớp. Hệ thống hiển thị thông báo "Tên đăng nhập hoặc mật khẩu không đúng". Quay về bước 3 **E2: Tài khoản bị khóa** Tại bước 7, nếu tài khoản bị khóa,  Hệ thống hiển thị thông báo "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên". **E3: Không hợp lệ Tên đăng nhập hoặc Mật khẩu** Tại bước 5, hệ thống kiểm tra không hợp lệ Hệ thống hiển thị thông báo “Vui lòng nhập tên đăng nhập và mật khẩu hợp lệ” Quay lại bước 3  |

**5.2. Đặc tả use case: Đăng xuất**

| Tên use case | Đăng xuất |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự  |
| Mục đích (mô tả) | Cho phép người dùng thoát khỏi phiên làm việc hiện tại một cách an toàn.   |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Ấn “Đăng xuất” |
| Điều kiện tiên quyết (Precondition) | Người dùng đang trong phiên đăng nhập hợp lệ.  |
| Điều kiện thành công (Post-condition) | Phiên làm việc bị hủy bỏ. Người dùng được chuyển về màn hình Đăng nhập.  |
| Điều kiện thất bại | Không có  |
| Luồng sự kiện chính (Basic Flow) | 1\. Người dùng chọn "Đăng xuất". 2\. Hệ thống yêu cầu xác nhận đăng xuất 3\. Người dùng xác nhận đăng xuất. 4\. Hệ thống hủy session hiện tại. 5\. Hệ thống chuyển hướng về trang Đăng nhập. |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Đăng xuất tự động** 1\.  Hệ thống giám sát thời gian không hoạt động của người dùng. 2\.  Nếu thời gian idle vượt quá **30 phút** 3\.  Hệ thống tự động hủy session. 4\.  Hệ thống hiển thị thông báo "Phiên làm việc đã hết hạn" và chuyển về trang Đăng nhập. |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.3. Đặc tả use case: Đổi mật khẩu**

| Tên use case | Đổi mật khẩu |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự  |
| Mục đích (mô tả) | Cho phép người dùng đã đăng nhập thay đổi mật khẩu hiện tại sang một mật khẩu mới để tăng cường bảo mật. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Ấn “Đổi mật khẩu” |
| Điều kiện tiên quyết (Precondition) | Người dùng đang đăng nhập hệ thống.  |
| Điều kiện thành công (Post-condition) | Mật khẩu được đổi thành công  |
| Điều kiện thất bại | Đổi mật khẩu thất bại  |
| Luồng sự kiện chính (Basic Flow) | 1\. Người dùng chọn "Đổi mật khẩu". 2\. Hệ thống hiển thị các trường thông tin: Mật khẩu cũ, mật khẩu mới, xác nhận mật khẩu mới 3\. Người dùng nhập dữ liệu. 4\. Hệ thống yêu cầu xác nhận. 5\. Người dùng xác nhận đổi mật khẩu. 6\. Hệ thống kiểm tra dữ liệu \-  Kiểm tra "Mật khẩu hiện tại" có khớp với mật khẩu trong CSDL không. \-  Kiểm tra "Mật khẩu mới" có đúng quy tắc bảo mật (Độ dài, ký tự đặc biệt) không. \-   Kiểm tra "Mật khẩu mới" và "Xác nhận mật khẩu" có khớp nhau không. \-   Kiểm tra "Mật khẩu mới" có khác "Mật khẩu hiện tại" không. 7\. Hệ thống thay đổi thông tin về mật khẩu của tài khoản đang đăng nhập |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Sai thông tin trường dữ liệu** 1\.  Tại bước 6, hệ thống phát hiện các lỗi tại các trường thông tin 2\.  Hệ thống thông báo lỗi 3\. Hệ thống từ chối lưu dữ liệu. **E2: Hủy thao tác** Tại bước 2, người dùng nhấn “Hủy” Hệ thống quay lại màn hình chính. |

**5.4. Đặc tả use case: Tìm kiếm tài khoản người dùng**

| Tên use case | Tìm kiếm tài khoản người dùng |
| :---- | :---- |
| Tác nhân chính | Quản trị viên  |
| Mục đích (mô tả) | Cho phép admin tìm kiếm tài khoản người dùng |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Quản trị viên nhập từ khóa tìm kiếm và thực hiện tìm kiếm trong menu “Quản lý tài khoản người dùng” |
| Điều kiện tiên quyết (Precondition) | Người dùng đã đăng nhập với vai trò Quản trị viên hệ thống.  |
| Điều kiện thành công (Post-condition) | Danh sách tài khoản người dùng thỏa điều kiện tìm kiếm được hiển thị.  |
| Điều kiện thất bại | Hệ thống không xử lý được yêu cầu tìm kiếm |
| Luồng sự kiện chính (Basic Flow) | 1\.  Admin chọn menu "Quản lý tài khoản người dùng". 2\.  Hệ thống hiển thị danh sách người dùng (phân trang). 3\.  Admin nhập từ khóa vào ô tìm kiếm (Mã nhân sự, Họ tên, Email). 4\. Admin chọn lọc các thông tin theo dropdown: \- **Vai trò**: Tất cả (Mặc định), Quản trị viên, Cán bộ TCCB, Cán bộ TCKT \- **Trạng thái**: Tất cả, Hoạt động (Mặc định), Không hoạt động 5\.  Admin nhấn nút tìm kiếm. 6\.  Hệ thống lọc và hiển thị danh sách kết quả tương ứng bao gồm các cột: \- STT \- Mã nhân sự \- Họ tên \- Email \- Vai trò \- Trạng thái  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Không nhập từ khóa** Tại bước 3, Admin không nhập từ khóa Hệ thống hiển thị toàn bộ danh sách người dùng  |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Không tìm thấy kết quả** Tại bước 6, Hệ thống không tìm thấy người dùng phù hợp Hệ thống hiển thị thông báo “Không có người dùng”  |

**5.5. Đặc tả use case: Thêm mới tài khoản người dùng**

| Tên use case | Thêm mới tài khoản người dùng |
| :---- | :---- |
| Tác nhân chính | Quản trị viên  |
| Mục đích (mô tả) | Cho phép Quản trị viên thêm mới tài khoản người dùng.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Admin nhấn nút “Thêm mới người dùng”. |
| Điều kiện tiên quyết (Precondition) | Người dùng đã đăng nhập với vai trò Quản trị viên hệ thống. |
| Điều kiện thành công (Post-condition) | Tài khoản người dùng mới được tạo và lưu trong cơ sở dữ liệu.  |
| Điều kiện thất bại | Tài khoản người dùng không được tạo do dữ liệu không hợp lệ hoặc trùng lặp |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại màn hình danh sách, Admin nhấn nút "Thêm mới". 2\.  Hệ thống hiển thị form thêm người dùng. 3\.  Admin nhập thông tin: Email, Nhân sự, Vai trò (UC 5.7). 4\.  Admin nhấn "Lưu". 5\.  Hệ thống validate dữ liệu (Đầy đủ các trường thông tin, Email đúng định dạng và duy nhất, Nhân sự tồn tại và chưa có tài khoản liên kết, Vai trò tồn tại) 6\. Hệ thống tự động tạo mật khẩu ngẫu nhiên và gửi mật khẩu đã tạo cho email tương ứng. 7\.  Hệ thống lưu thông tin. 8\.  Hệ thống lưu lịch sử thay đổi và thông báo thêm thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện các trường thông tin không hợp lệ. Hệ thống thông báo lỗi tương ứng Dữ liệu không được lưu **E2: Admin hủy thao tác** Tại bước 2, Admin nhấn “Hủy” Hệ thống quay lại màn hình danh sách người dùng |

**5.6. Đặc tả use case: Sửa thông tin tài khoản người dùng**

| Tên use case | Sửa thông tin tài khoản người dùng |
| :---- | :---- |
| Tác nhân chính | Quản trị viên |
| Mục đích (mô tả) | Cho phép Quản trị viên cập nhật thông tin tài khoản người dùng.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Admin chọn một tài khoản và nhấn nút “Sửa”. |
| Điều kiện tiên quyết (Precondition) | Người dùng đã đăng nhập với vai trò Quản trị viên hệ thống. Tài khoản cần chỉnh sửa đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Thông tin tài khoản người dùng được cập nhật trong cơ sở dữ liệu.  |
| Điều kiện thất bại | Không có thay đổi nào được lưu vào hệ thống. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại danh sách, Quản trị viên nhấn "Sửa" trên một dòng user. 2\.  Hệ thống hiển thị form cập nhật. 3\.  Admin thay đổi Email, Vai trò (UC 5.7). 4\.  Admin nhấn "Lưu". 5\.  Hệ thống validate dữ liệu (Đầy đủ các trường thông tin, Email đúng định dạng và duy nhất, Vai trò tồn tại). 6\.  Hệ thống lưu thay đổi. 7\.  Hệ thống lưu lịch sử thay đổi và thông báo cập nhật thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện trường dữ liệu không hợp lệ. Hệ thống thông báo lỗi Dữ liệu không được lưu **E2: Quản trị viên** **hủy thao tác** Tại bước 2, Quản trị viên nhấn “Hủy” Hệ thống quay lại màn hình danh sách người dùng |

**5.7. Đặc tả use case: Phân quyền tài khoản người dùng**

| Tên use case | Phân quyền tài khoản người dùng |
| :---- | :---- |
| Tác nhân chính | Quản trị viên  |
| Mục đích (mô tả) | Cho phép Quản trị viên phân quyền tài khoản người dùng.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Quản trị viên nhấn “Phân quyền người dùng”. |
| Điều kiện tiên quyết (Precondition) | Người dùng đã đăng nhập với vai trò Quản trị viên hệ thống.  |
| Điều kiện thành công (Post-condition) | Tài khoản người dùng được đổi quyền thành công.  |
| Điều kiện thất bại | Tài khoản người dùng được đổi quyền thất bại. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Admin bấm dropdown chọn vai trò. 2\. Hệ thống hiển thị các Vai trò cho người dùng kèm các chi tiết quyền hạn cho vai trò được chọn. **Quản trị viên** (Admin) Quản lý đơn vị nhân sự. Quản lý tài khoản người dùng. **Nhân sự phòng Tổ chức Cán bộ** (TCCB) Cấu hình một số danh mục: hệ số lương, loại phụ cấp và một số danh mục có thể được cấu hình trong tương lai. Quản lý lưu trữ hợp đồng lao động của nhân sự Quản lý hồ sơ nhân sự (thông tin cơ bản nhân sự, thông tin lương, thông tin khen thưởng/kỷ luật, thông tin, hợp đồng) Quản lý các thông tin về đơn vị nhân sự Quản lý các khóa đào tạo. **Nhân sự phòng Tài chính kế toán**(TCKT) Xem hồ sơ nhân sự (thông tin nhân sự \- thông tin hồ sơ, hợp đồng, đánh giá) **Cán bộ** (Employee) Xem thông tin hồ sơ Xem thông tin đơn vị đang công tác Đăng ký các khóa đào tạo và xem thông tin khóa đào tạo đã đăng ký. 3\. Quản trị viên chọn vai trò.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.8. Đặc tả use case: Thay đổi trạng thái cho tài khoản người dùng**

| Tên use case | Thay đổi trạng thái cho tài khoản người dùng |
| :---- | :---- |
| Tác nhân chính | Quản trị viên  |
| Mục đích (mô tả) | Cho phép Quản trị viên thay đổi tài khoản người dùng sang trạng thái hoạt động hoặc bị khóa  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Admin chọn chức năng thay đổi trạng thái khóa tài khoản người dùng. |
| Điều kiện tiên quyết (Precondition) | Người dùng đã đăng nhập với vai trò Quản trị viên hệ thống.  |
| Điều kiện thành công (Post-condition) | Trạng thái tài khoản người dùng được cập nhật thành Hoạt động hoặc Bị khóa  |
| Điều kiện thất bại | Trạng thái tài khoản người dùng không thay đổi. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại danh sách, Admin nhấn icon "Khóa" trên dòng user có trạng thái ‘Đang hoạt động’(mặc định) . 2\.  Hệ thống hiển thị xác nhận. 3\.  Admin xác nhận. 4\.  Hệ thống cập nhật trạng thái ‘Bị khóa’ cho tài khoản. 5\.  Hệ thống lưu lịch sử thay đổi và thông báo cập nhật thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Mở khóa tài khoản** Tại bước 1, Admin nhấn icon "Mở khóa" trên dòng user tại danh sách. Hệ thống hiển thị xác nhận. Admin xác nhận Hệ thống cập nhật trạng thái ‘Đang hoạt động’ cho tài khoản. **A2: Tự động khóa tài khoản** Hệ thống phát hiện nhân sự liên kết với tài khoản ở trạng thái “Đã thôi việc” Hệ thống cập nhật trạng thái ‘Bị khóa’ cho tài khoản. |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Không thể khóa tài khoản đang đăng nhập** Tại bước 1, Admin chọn khóa tài khoản đang sử dụng Hệ thống từ chối thao tác Hiển thị thông báo “Không thể khóa tài khoản đang sử dụng”  |

**5.9. Đặc tả use case: Tạo mới đơn vị tổ chức nhân sự**

| Tên use case | Tạo mới đơn vị tổ chức nhân sự |
| :---- | :---- |
| Tác nhân chính | Quản trị viên |
| Mục đích (mô tả) | Cho phép Quản trị viên tạo mới một đơn vị tổ chức trong hệ thống, xác định mối quan hệ đơn vị cha – đơn vị con, phục vụ việc xây dựng và quản lý cơ cấu tổ chức nhân sự và nhập liệu thông tin đơn vị đang công tác cho nhân sự. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Quản trị viên chọn chức năng “Thêm mới đơn vị” trong menu “Cơ cấu tổ chức”.  |
| Điều kiện tiên quyết (Precondition) | Cán bộ Quản trị viên đã đăng nhập hệ thống. Hệ thống đã tồn tại đơn vị gốc “Trường đại học Thủy lợi”. |
| Điều kiện thành công (Post-condition) | Đơn vị tổ chức mới được tạo và lưu thành công trong hệ thống. Đơn vị mới được gắn đúng vào cây cơ cấu tổ chức theo quan hệ cha – con. Sơ đồ cơ cấu tổ chức được cập nhật và hiển thị ngay sau khi tạo. Đơn vị mới có thể được sử dụng để gán thông tin đơn vị công tác cho hồ sơ nhân sự. |
| Điều kiện thất bại | Đơn vị không được tạo do vi phạm ràng buộc dữ liệu hoặc nghiệp vụ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Hệ thống hiển thị sơ đồ cây cơ cấu tổ chức hiện tại. 2\. Quản trị viên chọn một đơn vị làm đơn vị cha (hoặc chọn “đơn vị gốc”). 3\. Quản trị viên nhấn chức năng “Thêm mới đơn vị” dưới cấp của đơn vị đã chọn. 4\. Hệ thống hiển thị màn hình nhập thông tin đơn vị mới. 5\. Quản trị viên nhập các thông tin: Tên đơn vị Mã đơn vị Loại đơn vị (Hội đồng, Ban, Khoa, Phòng, Bộ môn, Phòng thí nghiệm, Trung tâm) Đơn vị cha (mặc định là đơn vị đã chọn ở bước 3\) Thông tin liên hệ (Ngày thành lập, Địa chỉ, Địa chỉ văn phòng,  Email, Số điện thoại, link website(tùy chọn)) Xác nhận đơn vị nút (Nếu xác nhận thì ta sẽ không thể thêm mới đơn vị con dưới đơn vị này) 6\. Quản trị viên nhấn “Lưu”. 7\. Hệ thống kiểm tra dữ liệu hợp lệ (Dữ liệu cần đầy đủ các trường bắt buộc). 8\. Hệ thống xác nhận lưu 9\. Quản trị viên xác nhận 10\. Hệ thống lưu đơn vị mới vào cơ sở dữ liệu và trạng thái của đơn vị mặc định là “Đang hoạt động”. 11\. Hệ thống lưu lịch sử thay đổi và thông báo thêm thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Trùng mã đơn vị** Tại bước 7, hệ thống phát hiện mã đơn vị đã tồn tại. Hệ thống hiển thị thông báo: “Mã đơn vị đã tồn tại. Vui lòng nhập mã khác.” **E2: Thiếu thông tin bắt buộc** Tại bước 7, hệ thống phát hiện thiếu các trường bắt buộc (Tên đơn vị, Mã đơn vị, Loại đơn vị). Hệ thống hiển thị cảnh báo và yêu cầu bổ sung. Quay lại bước 6\. **E3: Đơn vị cha không hợp lệ** Tại bước 3, hệ thống phát hiện người dùng muốn thêm mới tại đơn vị cha đang ở trạng thái Giải thể/Bị sáp nhập. Hệ thống hiển thị thông báo: “Không thể tạo đơn vị trực thuộc đơn vị đã giải thể/ bị sáp nhập” **E4: Hủy thao tác** Tại bước 5, Quản trị viên chọn “Hủy”. Quay lại màn hình danh sách nhân sự.  |

**5.10. Đặc tả use case: Sửa thông tin đơn vị tổ chức nhân sự**

| Tên use case | Sửa thông tin đơn vị tổ chức nhân sự  |
| :---- | :---- |
| Tác nhân chính | Quản trị viên  |
| Mục đích (mô tả) | Cho phép cán bộ Quản trị viên chỉnh sửa thông tin của đơn vị trong cơ cấu tổ chức nhằm đảm bảo dữ liệu luôn chính xác và cập nhật theo thực tế.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Quản trị viên chọn chức năng “Sửa thông tin đơn vị” tại màn hình chi tiết đơn vị trong menu “Cơ cấu tổ chức”.  |
| Điều kiện tiên quyết (Precondition) | Quản trị viên đã đăng nhập hệ thống. Đơn vị tổ chức cần chỉnh sửa đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Thông tin đơn vị được cập nhật thành công. Sơ đồ cơ cấu tổ chức phản ánh dữ liệu mới. |
| Điều kiện thất bại | Thông tin đơn vị không được cập nhật do vi phạm ràng buộc dữ liệu hoặc nghiệp vụ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Hệ thống hiển thị sơ đồ đơn vị hiện tại 2\. Quản trị viên chọn chức năng “Sửa thông tin đơn vị” của một đơn vị. 3\. Hệ thống hiển thị form chỉnh sửa với các thông tin hiện tại của đơn vị, bao gồm:  **\- Thông tin cơ bản:** Tên đơn vị, Mã đơn vị (Không được sửa), Loại đơn vị;  **\- Thông tin liên hệ:** Địa chỉ, Địa chỉ văn phòng, Email, Số điện thoại, Website. 4\. Quản trị viên chỉnh sửa các thông tin cần thiết. 5\. Quản trị viên nhấn **“Lưu”**.6\. Hệ thống kiểm tra tính hợp lệ của dữ liệu. 7\. Hệ thống xác nhận lưu 8\. Quản trị viên xác nhận. 9\. Hệ thống cập nhật thông tin đơn vị. 10\. Hệ thống lưu lịch sử thay đổi và thông báo cập nhật thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có  |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu không hợp lệ** Tại bước 6, hệ thống phát hiện thiếu dữ liệu bắt buộc hoặc định dạng không hợp lệ. Hệ thống hiển thị cảnh báo và không cho phép lưu. **E2: Không được phép chỉnh sửa** Tại bước 2, nếu đơn vị đang ở trạng thái “Giải thể” hoặc “Sáp nhập”. Hệ thống hiển thị thông báo từ chối cho phép chỉnh sửa. **E3: Hủy thao tác** Tại bước 5, Quản trị viên chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.11. Đặc tả use case: Cập nhật trạng thái tình trạng cho đơn vị tổ chức nhân sự**

| Tên use case | Cập nhật trạng thái tình trạng cho đơn vị tổ chức nhân sự |
| :---- | :---- |
| Tác nhân chính | Quản trị viên |
| Mục đích (mô tả) | Cho phép Quản trị viên cập nhật trạng thái hoạt động của đơn vị tổ chức (Giải thể hoặc Sáp nhập), đồng thời xử lý các đơn vị con trực thuộc và tự động cập nhật dữ liệu nhân sự, hợp đồng lao động nhằm đảm bảo tính nhất quán của hệ thống.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Quản trị viên chọn chức năng "Cập nhật trạng thái" đối với một đơn vị cụ thể tại menu "Cơ cấu tổ chức". |
| Điều kiện tiên quyết (Precondition) | Quản trị viên đã đăng nhập hệ thống. Đơn vị tổ chức cần cập nhật đã tồn tại và đang ở trạng thái “Đang hoạt động”. |
| Điều kiện thành công (Post-condition) | Trạng thái đơn vị được cập nhật thành “Giải thể” hoặc “Sáp nhập”. Lịch sử thay đổi trạng thái đơn vị được ghi nhận đầy đủ. Dữ liệu nhân sự, hợp đồng lao động và trạng thái làm việc của nhân sự được cập nhật tự động theo quy định nghiệp vụ.  |
| Điều kiện thất bại | Việc cập nhật trạng thái đơn vị không được thực hiện do vi phạm ràng buộc nghiệp vụ hoặc dữ liệu không hợp lệ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Hệ thống hiển thị sơ đồ cây cơ cấu tổ chức hiện tại. 2\. Quản trị viên chọn một đơn vị đang ở trạng thái "Đang hoạt động". 3\. Quản trị viên chọn chức năng "Cập nhật trạng thái đơn vị". 4\. Hệ thống hiển thị form cập nhật, đồng thời **hiển thị cảnh báo danh sách các đơn vị con trực thuộc** (nếu có). 5\. Quản trị viên chọn loại sự kiện: **Giải thể**. 6\. Quản trị viên nhập các thông tin bắt buộc: Ngày hiệu lực (ngày giải thể). Quyết định (Số quyết định, Ngày quyết định, File đính kèm). Lý do (Giải thể / Tái cơ cấu / Khác). 7\. **Xử lý đơn vị con (Nếu có):** Quản trị viên chọn phương án xử lý cho các đơn vị trực thuộc: *Tùy chọn A:* Giải thể toàn bộ đơn vị con. *Tùy chọn B:* Điều chuyển đơn vị con sang trực thuộc một đơn vị cha khác (yêu cầu chọn đơn vị cha mới từ danh sách). 8\. Quản trị viên nhấn nút **"Lưu xác nhận"**. 9\. Hệ thống kiểm tra tính hợp lệ của dữ liệu đầu vào. 10\. Hệ thống thực hiện cập nhật đồng loạt: Cập nhật trạng thái đơn vị đang thao tác từ “Đang hoạt động” → **“Giải thể”**. **Đối với đơn vị con:** Thực hiện Giải thể hoặc Cập nhật đơn vị quản lý cấp trên mới tùy theo lựa chọn tại Bước 7\. **Đối với nhân sự:** Tất cả hợp đồng đang hiệu lực → "Hết hiệu lực". Trạng thái hợp đồng của nhân sự → "Chưa hợp đồng". Trạng thái làm việc của nhân sự → "Đang chờ xét". Xóa thông tin đơn vị công tác hiện tại của các nhân sự thuộc đơn vị bị giải thể. 11\. Hệ thống lưu lịch sử thay đổi và hiển thị thông báo "Cập nhật thành công".  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Sáp nhập đơn vị** 1\. Tại bước 5 của Luồng sự kiện chính, Quản trị viên chọn loại sự kiện: **Sáp nhập** thay vì Giải thể. 2\. Quản trị viên nhập thông tin bắt buộc: Ngày hiệu lực, Quyết định, Lý do và **chọn Đơn vị nhận sáp nhập** từ danh sách đơn vị đang hoạt động. 3\. **Xử lý đơn vị con:** Hệ thống tự động thiết lập chuyển toàn bộ các đơn vị con trực thuộc sang làm đơn vị con của Đơn vị nhận sáp nhập. 4\. Quản trị viên nhấn nút **"Lưu xác nhận"**. 5\. Hệ thống kiểm tra tính hợp lệ của dữ liệu. 6\. Hệ thống thực hiện cập nhật đồng loạt: Cập nhật trạng thái đơn vị đang thao tác từ “Đang hoạt động” → **“Sáp nhập”**. **Đối với đơn vị con:** Cập nhật "Đơn vị quản lý cấp trên" sang Đơn vị nhận sáp nhập. **Đối với nhân sự:** Tự động chuyển toàn bộ nhân sự sang Đơn vị nhận sáp nhập (Trạng thái hợp đồng giữ nguyên; Trạng thái làm việc giữ nguyên "Đang công tác"; Thông tin đơn vị mới được cập nhật). 7\. Hệ thống lưu lịch sử thay đổi và hiển thị thông báo "Cập nhật thành công".  |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Đơn vị không hợp lệ để cập nhật trạng thái** Tại bước 2, nếu đơn vị đang ở trạng thái “Giải thể” hoặc “Sáp nhập”. Hệ thống vô hiệu hóa nút chức năng và hiển thị thông báo "Đơn vị này không còn hoạt động". **E2: Dữ liệu không hợp lệ** Tại bước 9 hoặc A1.9, nếu thiếu thông tin bắt buộc, ngày hiệu lực sai định dạng hoặc chưa đính kèm file Quyết định. Hệ thống chặn thao tác lưu, bôi đỏ các trường bị lỗi và yêu cầu nhập lại. **E3: Chưa xử lý đơn vị con khi Giải thể** Tại bước 9, nếu đơn vị có đơn vị con nhưng Quản trị viên chọn Tùy chọn B (Điều chuyển) mà không chọn Đơn vị cha mới. Hệ thống cảnh báo: *"Vui lòng chọn đơn vị quản lý mới cho các đơn vị trực thuộc trước khi giải thể."* **E4: Ràng buộc chức vụ quản lý** Tại bước 9, nếu đơn vị bị giải thể đang có nhân sự giữ chức vụ quản lý (Trưởng phòng, Trưởng khoa...). Hệ thống chặn thao tác và thông báo: *"Vui lòng thực hiện bãi nhiệm chức vụ quản lý của đơn vị trước khi thực hiện giải thể."* |

**5.12. Đặc tả use case: Thêm mới danh mục hệ số lương**

| Tên use case | Thêm mới danh mục hệ số lương |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB thiết lập hệ số lương theo bậc và ngạch phục vụ cho việc quản lý và nhập liệu thông tin nhân sự.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục hệ số lương, Phòng TCCB chọn chức năng “Thêm”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB.  |
| Điều kiện thành công (Post-condition) | Thiết lập hệ số lương theo ngạch/bậc thành công |
| Điều kiện thất bại | Hệ số lương không được cập nhật mới trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB truy cập chức năng thêm hệ số lương. 2\.  Hệ thống hiển thị màn hình nhập hệ số lương. 3\.  Phòng TCCB nhập các các thông tin Ngạch viên chức Bậc lương Hệ số lương 4\.  Phòng TCCB xác nhận lưu thông tin 5\. Hệ thống kiểm tra dữ liệu hợp lệ 6\. Hệ thống thêm thông tin. 7\. Hệ thống lưu lịch sử thay đổi và thông báo thêm thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện lỗi: Bậc lương trong cùng ngạch đã tồn tại Hệ số lương phải là số thực, không được nhỏ hơn 0 Bậc lương phải là số nguyên Thông tin bắt buộc đầy đủ Hệ thống báo lỗi Dữ liệu không được lưu **E2: Phòng TCCB hủy thao tác** Tại bước 2, Phòng TCCB nhấn “Hủy” Hệ thống quay lại màn hình danh sách bậc lương |

**5.13. Đặc tả use case: Sửa danh mục hệ số lương**

| Tên use case | Sửa danh mục hệ số lương |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB sửa hệ số lương theo bậc và ngạch phục vụ cho việc quản lý và nhập liệu thông tin nhân sự nếu như nhập liệu sai sót.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục hệ số lương, Phòng TCCB chọn chức năng “Sửa”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB. Danh mục hệ số lương cần chỉnh sửa đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Sửa hệ số lương theo ngạch/bậc thành công |
| Điều kiện thất bại | Hệ số lương không được cập nhật trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB truy cập chức năng sửa hệ số lương của một bản ghi hệ số lương đã được cấu hình. 2\.  Hệ thống hiển thị màn hình nhập hệ số lương. 3\.  Phòng TCCB sửa các các thông tin Ngạch viên chức Bậc lương Hệ số lương mỗi bậc 4\.  Phòng TCCB bấm lưu 5\. Hệ thống kiểm tra dữ liệu hợp lệ 6\. Hệ thống cập nhật thông tin. 7\. Hệ thống lưu lịch sử thay đổi và thông báo cập nhật thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện lỗi: Bậc lương trong cùng ngạch đã tồn tại Hệ số lương phải là số thực, không được nhỏ hơn 0 Bậc lương phải là số nguyên Thông tin bắt buộc đầy đủ Hệ thống báo lỗi Dữ liệu không được lưu **E2: Phòng TCCB hủy thao tác** Tại bước 2, Phòng TCCB nhấn “Hủy” Hệ thống quay lại màn hình danh sách bậc lương |

**5.14. Đặc tả use case: Xóa danh mục hệ số lương**

| Tên use case | Xóa danh mục hệ số lương |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Phòng TCCB xóa hệ số lương theo bậc và ngạch phục vụ cho việc quản lý và nhập liệu thông tin nhân sự nếu như nhập liệu sai sót trong trường hợp hệ số lương chưa từng được sử dụng trong hồ sơ nhân sự.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục hệ số lương, Phòng TCCB chọn chức năng “Xóa”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB. Danh mục hệ số lương cần xóa đã tồn tại trong hệ thống. Danh mục hệ số lương chưa được sử dụng trong bất kỳ hồ sơ nhân sự nào.  |
| Điều kiện thành công (Post-condition) | Danh mục hệ số lương được xóa hoàn toàn khỏi hệ thống. |
| Điều kiện thất bại | Danh mục hệ số lương không được xóa. |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB chọn một danh mục hệ số lương trong danh sách. 2\. Phòng TCCB chọn chức năng “Xóa”. 3\. Hệ thống hiển thị hộp thoại xác nhận xóa. 4\. Phòng TCCB xác nhận thao tác xóa. 5\. Hệ thống kiểm tra điều kiện sử dụng của hệ số lương. 6\. Hệ thống xóa danh mục hệ số lương thành công. 7\. Hệ thống lưu lịch sử thay đổi và thông báo xóa thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Danh mục hệ số lương đã được sử dụng** Tại bước 5, hệ thống phát hiện hệ số lương đã được gán cho ít nhất một hồ sơ nhân sự. Hệ thống thông báo không thể xóa danh mục đã được sử dụng Dữ liệu không bị xóa. **E2: Hủy thao tác xóa** Tại bước 3, Phòng TCCB chọn “Hủy”. Hệ thống đóng hộp thoại xác nhận và quay lại màn hình danh sách. |

**5.15. Đặc tả use case: Ngừng sử dụng danh mục hệ số lương**

| Tên use case | Ngừng sử dụng danh mục hệ số lương |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB đánh dấu danh mục hệ số lương ở trạng thái ngừng sử dụng nhằm không cho phép sử dụng cho hồ sơ nhân sự mới, đồng thời bảo toàn dữ liệu và liên kết với các hồ sơ đã tồn tại.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục hệ số lương, Phòng TCCB chọn chức năng “Ngừng sử dụng”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB.Danh mục hệ số lương cần ngừng sử dụng đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Danh mục hệ số lương được cập nhật trạng thái “Ngừng sử dụng”. Hệ số lương không còn được chọn khi tạo hoặc chỉnh sửa hồ sơ nhân sự mới.Các hồ sơ nhân sự đã sử dụng hệ số lương này không bị ảnh hưởng. |
| Điều kiện thất bại | Không thể cập nhật trạng thái mới trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB chọn một danh mục hệ số lương trong danh sách. 2\. Phòng TCCB chọn chức năng “Ngừng sử dụng”. 3\. Hệ thống hiển thị hộp thoại xác nhận. 4\. Phòng TCCB xác nhận thao tác. 5\. Hệ thống cập nhật trạng thái danh mục hệ số lương thành “Ngừng sử dụng”. 6\. Hệ thống thông báo thao tác thành công. 7\. Hệ thống lưu lịch sử thay đổi và thông báo cập nhật thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | **Không có** |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Hủy thao tác** Tại bước 3, Phòng TCCB chọn “Hủy”. Hệ thống đóng hộp thoại xác nhận và quay lại màn hình danh sách. |

**5.16. Đặc tả use case: Thêm mới danh mục loại phụ cấp**

| Tên use case | Thêm mới danh mục loại phụ cấp |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB thêm mới loại phụ cấp phục vụ cho việc quản lý và nhập liệu thông tin nhân sự.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục loại phụ cấp, Phòng TCCB chọn chức năng “Thêm”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB.  |
| Điều kiện thành công (Post-condition) | Danh mục loại phụ cấp được thêm thành công |
| Điều kiện thất bại | Loại phụ cấp  không được cập nhật mới trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB truy cập chức năng thêm loại danh mục. 2\.  Hệ thống hiển thị màn hình nhập danh mục loại phụ cấp. 3\.  Phòng TCCB thêm các các thông tin Tên loại phụ cấp Mô tả Cách tính 4\.  Phòng TCCB bấm lưu 5\. Hệ thống kiểm tra dữ liệu hợp lệ 6\. Hệ thống lưu thông tin thành công 7\. Hệ thống lưu lịch sử thay đổi và thông báo thêm thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | **Không có** |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện lỗi: Tên loại phụ cấp dài quá 200 từ, có ký tự đặc biệt không hợp lệ. Thông tin bắt buộc đầy đủ Hệ thống báo lỗi Dữ liệu không được lưu **E2: Hủy thao tác** Tại bước 2, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách. |

**5.17. Đặc tả use case: Sửa danh mục loại phụ cấp**

| Tên use case | Sửa danh mục loại phụ cấp |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB sửa loại phụ cấp phục vụ cho việc quản lý và nhập liệu thông tin nhân sự nếu có nhập liệu danh mục sai sót  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục loại phụ cấp, Phòng TCCB chọn chức năng “Sửa”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB. Danh mục loại phụ cấp cần chỉnh sửa đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Danh mục loại phụ cấp được sửa thành công |
| Điều kiện thất bại | Loại phụ cấp không được cập nhật trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB truy cập chức năng sửa loại phụ cấp đã tồn tại. 2\.  Hệ thống hiển thị màn hình sửa danh mục loại phụ cấp. 3\.  Phòng TCCB sửa các các thông tin Tên loại phụ cấp Mô tả Cách tính 4\.  Phòng TCCB bấm lưu 5\. Hệ thống kiểm tra dữ liệu hợp lệ 6\. Hệ thống lưu thông tin thành công 7\. Hệ thống lưu lịch sử thay đổi và thông báo thêm thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện lỗi: Tên loại phụ cấp dài quá 200 từ, có ký tự đặc biệt không hợp lệ. Thông tin bắt buộc đầy đủ Hệ thống báo lỗi Dữ liệu không được lưu **E2: Hủy thao tác** Tại bước 2, Phòng TCCB chọn "Hủy". Quay lại màn hình danh sách. |

**5.18. Đặc tả use case: Ngừng sử dụng danh mục loại phụ cấp**

| Tên use case | Ngừng sử dụng danh mục loại phụ cấp |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB đánh dấu danh mục loại phụ cấp ở trạng thái ngừng sử dụng nhằm không cho phép sử dụng cho hồ sơ nhân sự mới, đồng thời bảo toàn dữ liệu và liên kết với các hồ sơ đã tồn tại.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục loại phụ cấp, Phòng TCCB chọn chức năng “Ngừng sử dụng”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB.Danh mục loại phụ cấp cần ngừng sử dụng đã tồn tại trong hệ thống. |
| Điều kiện thành công (Post-condition) | Danh mục loại phụ cấp được cập nhật trạng thái “Ngừng sử dụng”. Loại phụ cấp không còn được chọn khi tạo hoặc chỉnh sửa hồ sơ nhân sự mới.Các loại phụ cấp được hồ sơ nhân sự đã sử dụng sẽ được hiển thị khác với các loại phụ cấp ở trạng thái “Đang sử dụng”. |
| Điều kiện thất bại | Loại phụ cấp không được thay đổi được trạng thái  trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB chọn một danh mục loại phụ cấp trong danh sách. 2\. Phòng TCCB chọn chức năng “Ngừng sử dụng”. 3\. Hệ thống hiển thị hộp thoại xác nhận. 4\. Phòng TCCB xác nhận thao tác. 5\. Hệ thống cập nhật trạng thái danh mục hệ loại phụ cấp thành “Ngừng sử dụng”. 6\. Hệ thống thông báo thao tác thành công. 7\. Hệ thống lưu lịch sử thay đổi và thông cập nhật thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | **Không có** |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Hủy thao tác** Tại bước 3, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách. |

**5.19. Đặc tả use case: Thêm mới danh mục loại hợp đồng**

| Tên use case | Thêm mới danh mục loại hợp đồng |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB cấu hình loại hợp đồng theo quy định nhà nước phục vụ cho việc quản lý và nhập liệu hợp đồng nhân sự.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục loại hợp đồng, Phòng TCCB chọn chức năng “Thêm”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB.  |
| Điều kiện thành công (Post-condition) | Thiết lập loại hợp đồng thành công |
| Điều kiện thất bại | Loại hợp đồng không được cập nhật mới trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB truy cập chức năng thêm loại hợp đồng. 2\.  Hệ thống hiển thị các trường thông tin (Tên loại hợp đồng, Số tháng tối thiểu, Số tháng tối đa, Số lần gia hạn tối đa, thời gian theo ngày chờ gia hạn). 3\. Phòng TCCB nhập đầy đủ thông tin 4\.  Phòng TCCB xác nhận lưu thông tin 5\. Hệ thống kiểm tra dữ liệu hợp lệ 6\. Hệ thống lưu thông tin thành công 7\. Hệ thống lưu lịch sử thay đổi và thông báo thêm thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện lỗi: Số tháng, số lần gia hạn, thời gian chờ gia hạn phải là số nguyên Thông tin bắt buộc đầy đủ Hệ thống báo lỗi Dữ liệu không được lưu **E2: Phòng TCCB hủy thao tác** Tại bước 2, Phòng TCCB nhấn “Hủy” Hệ thống quay lại màn hình danh sách loại hợp đồng |

**5.20. Đặc tả use case: Sửa danh mục loại hợp đồng**

| Tên use case | Sửa danh mục loại hợp đồng |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Phòng TCCB sửa cấu hình loại hợp đồng theo quy định nhà nước phục vụ cho việc quản lý và nhập liệu hợp đồng nhân sự nếu như nhập liệu sai sót.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục loại hợp đồng, Phòng TCCB chọn chức năng “Sửa”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB. Danh mục loại hợp đồng cần chỉnh sửa đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Sửa loại hợp đồng  thành công |
| Điều kiện thất bại | Loại hợp đồng  không được cập nhật trong CSDL |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB truy cập chức năng sửa loại hợp đồng của một loại hợp đồng đã được cấu hình. 2\.  Hệ thống hiển thị màn hình sửa loại hợp đồng và các trường thông tin  (Tên loại hợp đồng, Số tháng tối thiểu, Số tháng tối đa, Số lần gia hạn tối đa, thời gian theo ngày chờ gia hạn). 3\.  Phòng TCCB sửa các các thông tin 4\.  Phòng TCCB bấm lưu 5\. Hệ thống kiểm tra dữ liệu hợp lệ 6\. Hệ thống lưu thông tin thành công 7\. Hệ thống lưu lịch sử thay đổi và thông báo cập nhật thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 5, Hệ thống validate phát hiện lỗi: Số tháng, số lần gia hạn, thời gian chờ gia hạn phải là số nguyên Thông tin bắt buộc đầy đủ Hệ thống báo lỗi Dữ liệu không được lưu **E2: Phòng TCCB hủy thao tác** Tại bước 2, Phòng TCCB nhấn “Hủy” Hệ thống quay lại màn hình danh sách loại hợp đồng |

**5.21. Đặc tả use case: Ngừng sử dụng danh mục loại hợp đồng**

| Tên use case | Ngừng sử dụng danh mục loại hợp đồng |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Đánh dấu trạng thái "Ngừng sử dụng" cho một loại hợp đồng nhằm vô hiệu hóa loại hợp đồng này, không cho phép chọn để tạo hợp đồng mới trong tương lai.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Tại màn hình danh sách danh mục loại hợp đồng, Phòng TCCB chọn chức năng “Ngưng sử dụng”.  |
| Điều kiện tiên quyết (Precondition) | Người dùng đăng nhập với vai trò Phòng TCCB. Loại hợp đồng cần ngưng sử dụng đã tồn tại trong hệ thống.  |
| Điều kiện thành công (Post-condition) | Loại hợp đồng đã được cập nhật trạng thái “Ngưng sử dụng” thành công. |
| Điều kiện thất bại | Loại hợp đồng không được cập nhật trạng thái. |
| Luồng sự kiện chính (Basic Flow) | Phòng TCCB chọn một danh mục loại hợp đồng trong danh sách. Phòng TCCB chọn chức năng “Ngừng sử dụng”. Hệ thống hiển thị hộp thoại yêu cầu xác nhận thao tác ngừng sử dụng. Phòng TCCB xác nhận thao tác trên hộp thoại. Hệ thống cập nhật trạng thái của danh mục loại hợp đồng thành “Ngừng sử dụng”. Hệ thống lưu lại lịch sử thay đổi. Hệ thống đóng hộp thoại, hiển thị thông báo cập nhật thành công và tải lại danh sách với trạng thái mới. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Hủy thao tác xóa** Tại bước 3, Phòng TCCB chọn “Hủy”. Hệ thống đóng hộp thoại xác nhận và quay lại màn hình danh sách. |

**5.22. Đặc tả use case: Thêm mới Hợp đồng lao động**

| Tên use case | Thêm mới Hợp đồng lao động |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Tạo mới hợp đồng với quản lý trạng thái và ràng buộc nghiệp vụ.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng “Thêm mới hợp đồng”.  |
| Điều kiện tiên quyết (Precondition) | Cán bộ TCCB đã đăng nhập hệ thống. Hồ sơ nhân sự đã được tạo |
| Điều kiện thành công (Post-condition) | Hợp đồng lao động mới được tạo và gắn với hồ sơ nhân sự. Trạng thái hợp đồng của nhân sự được cập nhật theo hợp đồng mới nhất.  |
| Điều kiện thất bại | Hợp đồng không được tạo do vi phạm ràng buộc nghiệp vụ hoặc lỗi hệ thống. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB chọn mục “Thêm mới hợp đồng”. 2\. Hệ thống yêu cầu nhập mã nhân sự 3\. Phòng TCCB nhập Mã nhân sự. 4\.  Hệ thống kiểm tra: Mã nhân sự có tồn tại không và nếu tồn tại chỉ cho phép tạo hợp đồng mới nếu nhân viên có trạng thái hợp đồng "Chưa hợp đồng" hoặc “Chờ gia hạn” hoặc “Còn hiệu lực” với thời gian còn lại là 18 ngày hoặc trong thời gian chờ gia hạn. 5\.  Chọn \`Loại hợp đồng\`. 6\.  Hệ thống kiểm tra số lần ký tối đa cho loại hợp đồng. 7\.  Nhập thông tin hợp đồng:Số HĐ Ngày ký Ngày hiệu lực Ngày hết hạn Đơn vị công tác theo hợp đồng Nội dung hợp đồng (rich text editor \- nhập điều khoản, mô tả công việc, quyền lợi...) Upload PDF bản hợp đồng giấy\` (tải lên bản scan/file gốc đã ký) 8\.  Hệ thống validate thời hạn Thời gian tối thiểu/ Thời gian tối đa của loại hợp đồng. 9\.  Nhấn "Lưu". 10\. Hệ thống cập nhật hợp đồng mới trạng thái mặc định là “Còn hiệu lực”, cập nhật trạng thái hợp đồng của nhân sự dựa theo hợp đồng mới nhất. 11\. Hệ thống lưu hợp đồng vào hồ sơ cá nhân và thông báo thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Không đủ điều kiện tạo hợp đồng mới do hợp đồng hiện tại còn hiệu lực** Tại bước 4, hệ thống phát hiện nhân sự không tồn tại hoặc nhân sự đang có hợp đồng ở trạng thái “Còn hiệu lực” và thời gian còn lại \> 18 ngày. Hệ thống từ chối tạo hợp đồng mới. Hệ thống hiển thị thông báo: *“Không thể tạo hợp đồng mới”* **E2: Vượt quá số lần ký hợp đồng cho phép** Tại bước 6, hệ thống kiểm tra số lần ký hợp đồng theo loại hợp đồng đã chọn của nhân sự. Hệ thống không cho phép tiếp tục tạo hợp đồng. Hiển thị thông báo: *“Vui lòng chọn loại hợp đồng khác.”* **E3: Thời gian hợp đồng không hợp lệ hoặc trùng lặp** Tại bước 8, hệ thống phát hiện: Thời hạn hợp đồng không nằm trong khoảng Min/Max theo quy định hoặc ngày hiệu lực của hợp đồng mới ≤ ngày hết hạn của hợp đồng cũ chưa chấm dứt. Các trường dữ liệu chưa đầy đủ Hệ thống hiển thị thông báo: “Thời gian hợp đồng không hợp lệ hoặc bị trùng với hợp đồng trước” Phòng TCCB quay lại bước 7 **E4: Hủy thao tác** Tại bước 3, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.23. Đặc tả use case: Tìm kiếm hồ sơ nhân sự**

| Tên use case | Tìm kiếm hồ sơ nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB, phòng TCKT  |
| Mục đích (mô tả) | Cho phép cán bộ Phòng TCCB, phòng TCKT tìm kiếm hồ sơ nhân sự nhanh chóng dựa trên từ khóa như tên, mã nhân sự, số CCCD, email hoặc số điện thoại nhằm phục vụ công tác quản lý và tra cứu thông tin. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Cán bộ TCCB nhập từ khóa tìm kiếm và thực hiện tìm kiếm trong menu “Quản lý hồ sơ nhân sự”  |
| Điều kiện tiên quyết (Precondition) | Cán bộ TCCB, phòng TCKT đã đăng nhập hệ thống.  |
| Điều kiện thành công (Post-condition) | Danh sách nhân sự thỏa mãn điều kiện được hiển thị  |
| Điều kiện thất bại | Hệ thống không xử lý yêu cầu tìm kiếm |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB, phòng TCKT chọn menu "Quản lý Hồ sơ". 2\.  Hệ thống hiển thị danh sách hồ sơ nhân viên (Mã, Họ tên, CCCD, Giới tính, Địa chỉ, SĐT liên hệ, Chức danh khoa học, Đơn vị công tác, Chức vụ đơn vị, Trạng thái công việc, Trạng thái hợp đồng) có phân trang. 3\.  Phòng TCCB, phòng TCKT **nhập từ khóa** vào ô tìm kiếm (Tên, Mã, CCCD, SĐT). 4\.  Hệ thống hiển thị kết quả tìm kiếm theo từ khóa (real-time).  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Từ khóa tìm kiếm rỗng** Tại bước 3, nếu phòng TCCB, phòng TCKT không nhập từ khóa Hệ thống hiển thị toàn bộ danh sách hồ sơ nhân sự  |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Không có kết quả tìm kiếm** Tại bước 4, nếu không có hồ sơ nào phù hợp với từ khóa Hệ thống hiển thị thông báo: *“Không tìm thấy hồ sơ phù hợp.”*  |

**5.24. Đặc tả usecase: Lọc danh sách hồ sơ nhân sự**

| Tên use case | Lọc danh sách hồ sơ nhân sự  |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB, phòng TCKT  |
| Mục đích (mô tả) | Cho phép phòng TCCB, phòng TCKT lọc danh sách hồ sơ nhân sự dựa trên nhiều tiêu chí nhằm thu hẹp phạm vi dữ liệu phục vụ công tác quản lý.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB, phòng TCKT chọn tiêu chí lọc trong menu “Quản lý hồ sơ nhân sự”  |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB, phòng TCKT đã đăng nhập hệ thống.  |
| Điều kiện thành công (Post-condition) | Danh sách hồ sơ nhân sự được hiển thị đúng theo các tiêu chí lọc đã chọn  |
| Điều kiện thất bại | Hệ thống không hiển thị yêu cầu lọc danh sách theo tiêu chí đã chọn do lỗi hệ thống |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại màn hình danh sách, Phòng TCCB, phòng TCKT nhấn "Bộ lọc nâng cao". 2\.  Hệ thống hiển thị panel lọc với nhiều tiêu chí: **Đơn vị công tác:** Chọn Khoa, Phòng, Ban, Bộ môn **Chức danh khoa học:** GS, PGS, Không có **Chức vụ đơn vị:**Trưởng khoa, Phó khoa, Không chức vụ **Trạng thái làm việc:** Đang chờ xét, Đang công tác, Đã thôi việc **Trạng thái hợp đồng:** Chưa hợp đồng, Còn hiệu lực, Hết hiệu lực, Chờ gia hạn. **Giới tính:** Nam, Nữ 3\.  Phòng TCCB, phòng TCKT chọn các tiêu chí lọc. 4\.  Nhấn "Áp dụng bộ lọc". 5\.  Hệ thống hiển thị kết quả lọc đa tiêu chí.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| **Luồng sự kiện ngoại lệ (Exception Flow)** | **E1: Không có kết quả lọc** Tại bước 5, nếu không có hồ sơ nào thỏa mãn tiêu chí đã chọn Hệ thống hiển thị thông báo *“Không có hồ sơ phù hợp với tiêu chí lọc.”*  |

**5.25. Đặc tả use case: Thêm mới Hồ sơ nhân sự**

| Tên use case | Thêm mới Hồ sơ nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Cho phép Phòng TCCB tạo mới và lưu trữ đầy đủ thông tin hồ sơ nhân sự trên hệ thống. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng thêm trong menu “Quản lý hồ sơ nhân sự”  |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB đã đăng nhập hệ thống.  |
| Điều kiện thành công (Post-condition) | Hồ sơ nhân sự được tạo mới  |
| Điều kiện thất bại | Hệ thống không thể tạo mới hồ sơ do lỗi hệ thống hoặc dữ liệu không hợp lệ. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại màn hình danh sách, Phòng TCCB nhấn "Thêm mới". 2\.  Hệ thống hiển thị form nhập liệu chia thành các tabs/bước. 3\.  Phòng TCCB nhập các trường thông tin: **Thông tin chung bắt buộc**: Họ tên, Ngày sinh, Giới tính, CCCD, Quê quán, Địa chỉ, Mã số thuế (Không bắt buộc), Số Bảo hiểm xã hội (Không bắt buộc), Số bảo hiểm y tế (Không bắt buộc), Email, SĐT liên hệ. **\[MỞ RỘNG \- Nếu là người nước ngoài\],** Cán bộ TCCB tick chọn "Người nước ngoài", hệ thống hiển thị thêm các trường bắt buộc: Số Visa, Ngày hết hạn Visa, Số Hộ chiếu, Ngày hết hạn Hộ chiếu, Số giấy phép lao động, Ngày hết hạn giấy phép lao động, Upload PDF giấy phép lao động. **Thông tin gia đình  (bắt buộc)**: Cha/Mẹ, Vợ/chồng, con, người phụ thuộc, thông tin chi tiết về gia đình. **Thông tin ngân hàng  (bắt buộc)**: Tên Ngân hàng, Số tài khoản. **Quá trình công tác** trước khi về trường: Nơi công tác, thời gian công tác **(bắt buộc)**. **Thông tin Đảng/Đoàn (bắt buộc):** Ngày vào Đoàn/Đảng, Thông tin chi tiết. **Upload ảnh chân dung  (bắt buộc). Trình độ học vấn (bắt buộc):** Trình độ văn hóa, Trình độ đào tạo, Chức danh nghề nghiệp, Chức danh khoa học. **Thông tin các bằng cấp  (bắt buộc)**: Tên bằng, Trường, Ngành, Năm tốt nghiệp, Xếp loại, Bản pdf. **Thông tin các chứng chỉ  (bắt buộc):** Tên chứng chỉ, Nơi cấp, Ngày cấp, Ngày hết hạn, Bản pdf. **Lương & Phụ cấp (bắt buộc):** Hệ số lương (đã được cấu hình), Phụ cấp(đã được cấu hình). 4\. Hệ thống kiểm tra tính đầy đủ, hợp lệ và tính logic của các thông tin bắt buộc 5\. Phòng TCCB nhấn "Lưu". 6\. Hệ thống tự động sinh Mã cán bộ và Trạng thái hợp đồng mặc định là “Chưa hợp đồng”, Trạng thái làm việc là “Đang chờ xét”. 7\. Hệ thống lưu hồ sơ, lịch sử tạo hồ sơ và thông báo thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Tạo mới hồ sơ nhân sự từ file Excel** 1\. Tại bước 1 của Luồng sự kiện chính, Phòng TCCB chọn chức năng **“Thêm mới từ Excel”**. 2\. Hệ thống hiển thị màn hình tải lên file Excel và cung cấp **file mẫu** theo định dạng quy định. 3\. Phòng TCCB tải lên file Excel chứa danh sách hồ sơ nhân sự. 4\. Hệ thống kiểm tra: Định dạng file, Cấu trúc cột dữ liệu, Các trường thông tin bắt buộc 5\. Tiếp tục bước 5 của luồng chính |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc** Tại bước 4, hệ thống phát hiện thiếu thông tin bắt buộc, định dạng dữ liệu sai hoặc các trường thời gian không hợp lệ. Hệ thống hiển thị cảnh báo, đánh dấu các tab còn thiếu hoặc sai dữ liệu và không cho phép lưu hồ sơ. **E2: Hủy thao tác** Tại bước 3, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.26. Đặc tả use case: Chỉnh sửa trong chi tiết hồ sơ nhân sự**

| Tên use case | Chỉnh sửa trong chi tiết hồ sơ nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Cho phép Phòng TCCB sửa và lưu lại đầy đủ thông tin hồ sơ nhân sự trên hệ thống nếu có thay đổi hoặc sai sót trong nhập liệu.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng sửa trong một nhân sự trong menu “Quản lý hồ sơ nhân sự”  |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB đã đăng nhập hệ thống. Hồ sơ nhân sự có trạng thái làm việc “Đang chờ xét”, “Đang công tác”  |
| Điều kiện thành công (Post-condition) | Hồ sơ nhân sự được cập nhật. Lịch sử thay đổi được ghi lại.  |
| Điều kiện thất bại | Hồ sơ nhân sự không được cập nhật và thay đổi |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại màn hình danh sách, Phòng TCCB nhấn "Sửa" một nhân sự tại danh sách. 2\.  Hệ thống hiển thị form nhập liệu chia thành các tabs/bước. 3\.  Phòng TCCB có thể sửa các trường thông tin: **Thông tin chung bắt buộc**: Mã cán bộ(không thể sửa), Họ tên, Ngày sinh, Giới tính, CCCD, Quê quán, Địa chỉ, Mã số thuế (Không bắt buộc), Số Bảo hiểm xã hội (Không bắt buộc), Số bảo hiểm y tế (Không bắt buộc), Email, SĐT liên hệ. **\[MỞ RỘNG \- Nếu là người nước ngoài\],** Cán bộ TCCB tick chọn "Người nước ngoài", hệ thống hiển thị thêm các trường bắt buộc: Số Visa, Ngày hết hạn Visa, Số Hộ chiếu, Ngày hết hạn Hộ chiếu, Số giấy phép lao động, Ngày hết hạn giấy phép lao động, Upload PDF giấy phép lao động. **Thông tin gia đình  (bắt buộc)**: Cha/Mẹ, Vợ/chồng, con, người phụ thuộc, thông tin chi tiết về gia đình. **Thông tin ngân hàng  (bắt buộc)**: Tên Ngân hàng, Số tài khoản. **Quá trình công tác** trước khi về trường: Nơi công tác, thời gian công tác  **(bắt buộc)**. **Thông tin Đảng/Đoàn (bắt buộc):** Ngày vào Đoàn/Đảng, Thông tin chi tiết. **Upload ảnh chân dung  (bắt buộc). Trình độ học vấn (bắt buộc):** Trình độ văn hóa, Trình độ đào tạo, Chức danh nghề nghiệp, Chức danh khoa học. **Thông tin các bằng cấp  (bắt buộc)**: Tên bằng, Trường, Ngành, Năm tốt nghiệp, Xếp loại, Bản pdf. **Thông tin các chứng chỉ  (bắt buộc):** Tên chứng chỉ, Nơi cấp, Ngày cấp, Ngày hết hạn, Bản pdf. **Lương & Phụ cấp (bắt buộc):** Hệ số lương (đã được cấu hình), Phụ cấp(đã được cấu hình). **Thông tin hợp đồng được lưu:** Ngày ký, Ngày hiệu lực, Ngày hết hạn, Nội dung hợp đồng (rich text editor \- nhập điều khoản, mô tả công việc, quyền lợi...), bản PDF hợp đồng, Các phụ lục cho hợp đồng (Ngày phụ lục hiệu lực, Điều khoản bổ sung, Quy định mới, Lưu ý quan trọng; *Lưu ý các thông tin loại hợp đồng chỉ được thay đổi khi hợp đồng đang trong trạng thái ‘Còn hiệu lực’*). **Thông tin đánh giá:** Đánh dấu ngưng hoạt động cho đánh giá đã được thêm 4\. Hệ thống kiểm tra tính đầy đủ, hợp lệ và tính logic của các thông tin bắt buộc 5\. Cán bộ TCCB nhấn "Lưu". 6\. Hệ thống lưu hồ sơ, lịch sử tạo hồ sơ và thông báo thành công  |
| Luồng sự kiện thay thế (Alternative Flow) | **Không có** |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc** Tại bước 4, hệ thống phát hiện thiếu thông tin bắt buộc, định dạng dữ liệu sai hoặc các trường thời gian không hợp lệ. Hệ thống hiển thị cảnh báo, đánh dấu các tab còn thiếu hoặc sai dữ liệu và không cho phép lưu hồ sơ. **E2: Hủy thao tác** Tại bước 3, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.27. Đặc tả usecase: Đánh dấu thôi việc nhân sự**

| Tên use case | Đánh dấu thôi việc nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Cho phép phòng TCCB cập nhật trạng thái làm việc “Đã thôi việc” cho hồ sơ nhân sự  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng đánh dấu thôi việc trong một nhân sự trong menu “Quản lý hồ sơ nhân sự”  |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB đã đăng nhập hệ thống. Nhân sự đang ở trạng thái làm việc "Đang công tác" hoặc "Đang chờ xét".  |
| Điều kiện thành công (Post-condition) | Trạng thái của nhân sự được cập nhật thành “Đã thôi việc” trong hồ sơ nhân sự thành công.Trạng thái hợp đồng được cập nhật thành "Hết hiệu lực". Nhân sự được gỡ khỏi đơn vị công tác. Tài khoản liên kết được tự động khóa.  |
| Điều kiện thất bại | Trạng thái làm việc “Đã thôi việc” không được cập nhật |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại màn hình danh sách, phòng TCCB chọn chức năng "Đánh dấu thôi việc" một nhân sự. 2\.  Hệ thống yêu cầu xác nhận và nhập ngày, lý do thôi việc. 3\.  Phòng TCCB xác nhận. 4\.  Hệ thống cập nhật trạng thái làm việc thành "Đã thôi việc", trạng thái hợp đồng thành “Hết hiệu lực”, nhân sự được cập nhật rời khỏi đơn vị công tác.  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Thôi việc nhân sự tự động** Hệ thống tự động cập nhật trạng thái hợp đồng “Hết hiệu lực” cho loại hợp đồng ở trạng thái “Chờ gia hạn” quá thời gian gia hạn được cấu hình . Hệ thống tự động cập nhật trạng thái làm việc cho nhân sự vừa bị cập nhật trạng thái hợp đồng “Hết hiệu lực” thành “Đã thôi việc”. |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Nhân sự đã ở trạng thái "Đã thôi việc"** Tại bước 1, hệ thống phát hiện nhân sự đã có trạng thái làm việc "Đã thôi việc". Hệ thống vô hiệu hóa nút "Đánh dấu thôi việc" hoặc hiển thị cảnh báo: *"Nhân sự này đã được đánh dấu thôi việc trước đó."* **E2: Hủy thao tác** Tại bước 2, Phòng TCCB chọn "Hủy". Hệ thống quay lại màn hình danh sách nhân sự. |

**5.28. Đặc tả use case: Xem Chi tiết thông tin hồ sơ nhân sự**

| Tên use case | Xem Chi tiết thông tin hồ sơ nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB, Phòng TCKT  |
| Mục đích (mô tả) | Cho phép phòng TCCB, phòng TCKT xem chi tiết toàn bộ thông tin hồ sơ nhân sự, có thể thực hiện in hồ sơ |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB, phòng TCKT chọn chức năng xem chi tiết trong một nhân sự trong menu “Quản lý hồ sơ nhân sự”  |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB, phòng TCKT đã đăng nhập hệ thống.  |
| Điều kiện thành công (Post-condition) | Thông tin chi tiết hồ sơ nhân sự được hiển thị đầy đủ, chính xác ở chế độ chỉ đọc.  |
| Điều kiện thất bại | Hệ thống không hiển thị được thông tin hồ sơ do lỗi hệ thống hoặc dữ liệu không tồn tại. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Tại danh sách, Phòng TCCB, phòng TCKT nhấn vào nhấn "Xem chi tiết" tại một nhân sự. 2\.  Hệ thống hiển thị màn hình Chi tiết hồ sơ ở chế độ chỉ đọc. 3\.  Hệ thống hiển thị đầy đủ thông tin theo các tab: **Tab "Thông tin chung":** Mã cán bộ, Lý lịch, liên hệ, gia đình, ảnh chân dung **Tab "Trình độ & Chức danh":** Bằng cấp, chứng chỉ. **Tab "Thông tin Đảng/ Đoàn":** Thông tin Đảng/ Đoàn đã được lưu. **Tab "Lương & Phụ cấp":** Thông tin về ngạch, bậc, hệ số lương, thông tin ngân hàng **Tab "Hợp đồng":** Thông tin về các loại hợp đồng đồng đã ký **Tab "Khen thưởng/Kỷ luật":** Các mục khen thưởng, kỷ luật của nhân sự **Tab "Công tác":** Quá trình công tác trước khi về trường đã được ghi T**ab "Lịch sử":** Lịch sử thay đổi hồ sơ |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: In hồ sơ** Tiếp tục bước 3, Phòng TCCB có thể in ra hồ sơ ở định dạng PDF **A2: Xuất ra Excel** Tiếp tục bước 3, Phòng TCCB có thể xuất ra file chứa tất cả thông tin (trừ thông tin hợp đồng, khen thưởng/kỷ luật) dưới định dạng file Excel |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.29. Đặc tả use case: Ghi nhận đánh giá cho nhân sự**

| Tên use case | Ghi nhận đánh giá cho nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Ghi nhận các quyết định đánh giá đối với nhân sự.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng “Thêm đánh giá khen thưởng hoặc kỷ luật”  |
| Điều kiện tiên quyết (Precondition) | Cán bộ TCCB đã đăng nhập hệ thống. Hồ sơ nhân sự đã được tạo |
| Điều kiện thành công (Post-condition) | Hồ sơ nhân sự được cập nhật. Lịch sử thay đổi được ghi lại. |
| Điều kiện thất bại | Dữ liệu đánh giá không được ghi nhận vào hệ thống do thiếu các trường thông tin bắt buộc, hoặc do lỗi kết nối cơ sở dữ liệu/phiên đăng nhập hết hạn |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB chọn tab " Thêm đánh giá khen thưởng hoặc kỷ luật". 2\. Hệ thống yêu cầu nhập mã nhân sự và chọn loại đánh giá 3\. Phòng TCCB nhập mã nhân sự và chọn loại đánh giá (Khen thưởng/ Kỷ luật) 4\.  Hệ thống hiển thị giao diện nhập liệu: Nếu chọn loại đánh giá là khen thưởng: \`Loại khen thưởng\`, ‘Tên khen thưởng’, \`Ngày quyết định\`, \`Số quyết định\`, \`Nội dung\`, \`Số tiền thưởng\` (nếu có). Nếu chọn loại đánh giá là kỷ luật: \`Loại kỷ luật\`, ‘Tên kỷ luật’,  \`Ngày quyết định\`, \`Lý do\`, \`Hình thức xử lý\`. 5\.  Nhấn "Lưu". 6\. Hệ thống kiểm tra dữ liệu hợp lệ (Đầy đủ các trường thông tin) 7\. Hệ thống lưu dữ liệu và đẩy vào hồ sơ cá nhân và thông báo thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Mã nhân sự không hợp lệ** Tại bước 3, Hệ thống phát hiện mã nhân sự không tồn tại. Hệ thống từ chối tiếp tục tạo bản đánh giá. **E2: Dữ liệu không hợp lệ** Tại bước 6, Hệ thống phát hiện dữ liệu không đầy đủ các trường thông tin. Hệ thống từ chối lưu thông tin và thông báo lỗi. **E3: Hủy thao tác** Tại bước 2, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.30. Đặc tả use case: Bổ nhiệm nhân sự cho đơn vị tổ chức nhân sự**

| Tên use case | Bổ nhiệm nhân sự cho đơn vị tổ chức nhân sự  |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Cho phép Phòng TCCB bổ nhiệm nhân sự vào các đơn vị tổ chức |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng bổ nhiệm trong menu “Cơ cấu tổ chức”. |
| Điều kiện tiên quyết (Precondition) | Cán bộ TCCB đã đăng nhập hệ thống. Đơn vị tổ chức đã tồn tại trong cây cơ cấu tổ chức.  |
| Điều kiện thành công (Post-condition) | Nhân sự được bổ nhiệm nhân sự vào đơn vị. Thông tin nhân sự của đơn vị được cập nhật.  |
| Điều kiện thất bại | Việc bổ nhiệm không được thực hiện do vi phạm ràng buộc nghiệp vụ hoặc dữ liệu không hợp lệ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB truy cập một đơn vị trong cơ cấu tổ chức. 2\. Phòng TCCB chọn bổ nhiệm nhân sự chưa công tác 3\. Hệ thống hiển thị danh sách nhân sự ở trạng thái “Đang chờ xét” và trạng thái hợp đồng “Còn hiệu lực”. 4\. Phòng TCCB chọn nhân sự và nhập thông tin như (Chức vụ, Ngày bắt đầu) 5\. Hệ thống kiểm tra hợp lệ (Ngày bắt đầu). 6\. Hệ thống thay đổi danh sách nhân sự, trạng thái công việc của nhân sự chuyển thành “Đang công tác ”và thông báo thành công.  |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Bổ nhiệm nhân sự đang công tác ở đơn vị khác** 1\. Phòng TCCB truy cập một đơn vị trong cơ cấu tổ chức. 2\. Phòng TCCB chọn bổ nhiệm nhân sự đang công tác tại đơn vị khác. 3\. Hệ thống yêu cầu chọn đơn vị, chọn nhân sự từ đơn vị được chọn. 4\. Phòng TCCB chọn nhân sự và nhập thông tin như (Chức vụ, Ngày bắt đầu) 5\. Hệ thống kiểm tra hợp lệ (Ngày bắt đầu). 6\. Hệ thống thay đổi danh sách nhân sự và thông báo thành công. |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu không hợp lệ** Tại bước 5, Hệ thống kiểm tra phát hiện: Ngày bắt đầu < ngày hiện tại Hệ thống yêu cầu nhập lại và không lưu dữ liệu. **E2: Không được phép tiếp tục** Tại bước 1, nếu đơn vị đang ở trạng thái “Giải thể” hoặc “Sáp nhập”. Hệ thống hiển thị thông báo từ chối cho phép tiếp tục cập nhật bổ nhiệm. |

**5.31. Đặc tả use case: Bãi nhiệm nhân sự khỏi đơn vị tổ chức nhân sự**

| Tên use case | Bãi nhiệm nhân sự khỏi đơn vị tổ chức nhân sự  |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Cho phép Phòng TCCB thực hiện bãi nhiệm nhân sự trong đơn vị tổ chức, nhằm cập nhật chính xác tình trạng nhân sự và phục vụ công tác quản lý nhân sự.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng bãi nhiệm nhân sự của đơn vị trong menu “Cơ cấu tổ chức”.  |
| Điều kiện tiên quyết (Precondition) | Cán bộ Phòng TCCB đã đăng nhập hệ thống. Đơn vị tổ chức đã tồn tại trong cây cơ cấu tổ chức. |
| Điều kiện thành công (Post-condition) | Nhân sự được miễn nhiệm khỏi chức vụ.  |
| Điều kiện thất bại | Việc bãi nhiệm không được thực hiện do vi phạm ràng buộc nghiệp vụ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB truy cập một đơn vị trong cơ cấu tổ chức. 2\. Hệ thống hiển thị danh sách nhân sự 3\. Phòng TCCB chọn chức năng bãi nhiệm từ trong một nhân sự trong danh sách. 4\. Hệ thống yêu cầu xác nhận thao tác. 5\. Phòng TCCB xác nhận thao tác miễn nhiệm.6\. Hệ thống cập nhật trạng thái công việc của nhân sự là “Đang chờ xét”  và xóa nhân sự khỏi danh sách của đơn vị tổ chức. |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Tự động bãi nhiệm** Tại bước 1, hệ thống tự động kiểm tra trạng thái hợp đồng của nhân sự là “Hết hiệu lực” hoặc trạng thái công việc của nhân sự là “Đã thôi việc”. Hệ thống tự động cập nhật xóa nhân sự khỏi danh sách của đơn vị tổ chức. |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Không được phép tiếp tục** Tại bước 3, nếu đơn vị đang ở trạng thái “Giải thể” hoặc “Sáp nhập”. Hệ thống hiển thị thông báo từ chối cho phép tiếp tục thực hiện bãi nhiệm. |

**5.32. Đặc tả use case: Xem chi tiết thông tin đơn vị tổ chức nhân sự**

| Tên use case | Xem chi tiết thông tin đơn vị tổ chức nhân sự |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB, Quản trị viên  |
| Mục đích (mô tả) | Cho phép Phòng TCCB hoặc quản trị viên xem đầy đủ thông tin của một đơn vị tổ chức trong cơ cấu tổ chức, bao gồm: Thông tin cơ bản và trạng thái đơn vị Danh sách nhân sự và chức vụ hiện tại Lịch sử bổ nhiệm, miễn nhiệm chức vụ Lịch sử thay đổi tổ chức (thành lập, sáp nhập, giải thể) Nhằm phục vụ công tác theo dõi, quản lý và tra cứu dữ liệu tổ chức nhân sự theo thời gian |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn  chức năng xem chi tiết một đơn vị trong menu “Cơ cấu tổ chức”.  |
| Điều kiện tiên quyết (Precondition) | Cán bộ Phòng TCCB, Quản trị viên đã đăng nhập hệ thống. Đơn vị tổ chức đã tồn tại trong hệ thống. |
| Điều kiện thành công (Post-condition) | Toàn bộ thông tin chi tiết của đơn vị được hiển thị chính xác.Không làm thay đổi dữ liệu trong hệ thống (chỉ đọc).  |
| Điều kiện thất bại | Không hiển thị được dữ liệu do lỗi hệ thống hoặc không tồn tại đơn vị. |
| Luồng sự kiện chính (Basic Flow) | 1\. Hệ thống hiển thị sơ đồ cây cơ cấu tổ chức. 2\. Phòng TCCB chọn một đơn vị trong cây. 3\. Hệ thống hiển thị chi tiết thông tin các đơn vị, bao gồm: Tab **“Tổng quan”**, bao gồm: Tên đơn vị, Mã đơn vị, Loại đơn vị, Đơn vị cha, Ngày thành lập, Thông tin liên hệ, Trạng thái hiện tại của đơn vị (Đang hoạt động / Sáp nhập / Giải thể) Tab **“Nhân sự”**: Hệ thống hiển thị danh sách các nhân sự, Tên chức vụ, hệ thống hiển thị: Họ tên nhân sự, Mã cán bộ, Ngày bắt đầu. Hệ thống hiển thị danh sách nhân sự thuộc đơn vị Tab **“Đơn vị trực thuộc”**: Hệ thống hiển thị danh sách các đơn vị dưới cấp trực thuộc đơn vị đang xem. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có  |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.33. Đặc tả use case: Mở khóa đào tạo cho cán bộ giảng viên**

| Tên use case | Mở khóa đào tạo cho cán bộ giảng viên |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB  |
| Mục đích (mô tả) | Cho phép Cán bộ TCCB tạo mới và thiết lập thông tin một khóa đào tạo dành cho cán bộ, giảng viên; cấu hình hình thức đào tạo, thời gian, kinh phí và điều kiện đăng ký, làm cơ sở cho việc đăng ký tham gia và quản lý đào tạo sau này.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng mở khóa học trong menu “Đào tạo & Phát triển”  |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB đã đăng nhập hệ thống.   |
| Điều kiện thành công (Post-condition) | Khóa đào tạo được tạo mới và lưu thành công. Trạng thái khóa đào tạo được thiết lập theo cấu hình.  |
| Điều kiện thất bại | Khóa đào tạo không được tạo do dữ liệu không hợp lệ hoặc vi phạm ràng buộc nghiệp vụ. |
| Luồng sự kiện chính (Basic Flow) | 1\.  Phòng TCCB chọn menu "Đào tạo & Phát triển". 2\.  Phòng TCCB nhấn "Tạo khóa đào tạo mới". 3\. Hệ thống hiển thị thông tin nhập 4\.  Phòng TCCB nhập thông tin: Tên khóa đào tạo, Loại khóa đào tạo (theo cấu hình), Thời gian đào tạo (từ ngày – đến ngày), Địa điểm, Kinh phí (nếu có), Cam kết sau đào tạo (nếu có), Chứng chỉ sau đào tạo (Tên chứng chỉ, Loại chứng chỉ). 5\.  Phòng TCCB thiết lập thời gian mở đăng ký từ ngày - đến ngày, Giới hạn số người tham gia. 6\. Phòng TCCB nhấn “Lưu”. 7\. Hệ thống kiểm tra dữ liệu hợp lệ. 8\. Hệ thống yêu cầu xác nhận tạo khóa đào tạo. 9\. Phòng TCCB xác nhận. 10\. Hệ thống lưu khóa đào tạo và thiết lập trạng thái ban đầu là “Đang mở đăng ký” |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Dữ liệu lưu không hợp lệ** Tại bước 7, hệ thống phát hiện thiếu các trường bắt buộc (Tên khóa, Loại khóa, Thời gian), thời gian mở đăng ký sau thời gian đào tạo > ngày hiện tại, . Hệ thống hiển thị cảnh báo và yêu cầu chỉnh sửa. **E2: Hủy thao tác** Tại bước 4, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.34. Đặc tả use case: Sửa thông tin khóa đào tạo đã mở**

| Tên use case | Sửa thông tin khóa đào tạo đã mở |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Cho phép Phòng TCCB chỉnh sửa các thông tin của khóa đào tạo đã được tạo nhằm cập nhật kế hoạch đào tạo phù hợp với thực tế, đồng thời đảm bảo không vi phạm các ràng buộc nghiệp vụ đối với khóa đào tạo đã mở đăng ký hoặc đã có người tham gia |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng “Sửa thông tin khóa đào tạo” tại một khóa đào tạo trong menu “Đào tạo & Phát triển”. |
| Điều kiện tiên quyết (Precondition) | Cán bộ Phòng TCCB đã đăng nhập hệ thống. Khóa đào tạo đã tồn tại trong hệ thống. Khóa đào tạo đang ở trạng thái "Đang mở đăng ký". |
| Điều kiện thành công (Post-condition) | Thông tin khóa đào tạo được cập nhật thành công.Các thay đổi được ghi nhận và áp dụng ngay cho khóa đào tạo. |
| Điều kiện thất bại | Thông tin khóa đào tạo không được cập nhật do vi phạm ràng buộc nghiệp vụ hoặc dữ liệu không hợp lệ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB chọn menu **“Đào tạo & Phát triển”**. 2\. Hệ thống hiển thị danh sách các khóa đào tạo.3\. Phòng TCCB chọn một khóa đào tạo và nhấn **“Sửa thông tin”**. 4\. Hệ thống hiển thị màn hình chỉnh sửa thông tin khóa đào tạo. 5\. Phòng TCCB chỉnh sửa các thông tin cho phép: Tên khóa đào tạo Địa điểm Kinh phí (nếu có) Cam kết sau đào tạo (nếu có) Thông tin chứng chỉ sau đào tạo Thời gian mở đăng ký và giới hạn số người tham gia (nếu được phép) 6\. Phòng TCCB nhấn **“Lưu”**.7\. Hệ thống kiểm tra tính hợp lệ và ràng buộc nghiệp vụ. 8\. Hệ thống yêu cầu xác nhận cập nhật. 9\. Phòng TCCB xác nhận. 10\. Hệ thống cập nhật thông tin khóa đào tạo và thông báo thành công. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Không được phép chỉnh sửa do trạng thái khóa đào tạo** Tại bước 7, hệ thống phát hiện nếu khóa đào tạo ở trạng thái “Đang đào tạo” hoặc “Đã hoàn thành”. Hệ thống hiển thị thông báo từ chối chỉnh sửa. **E2: Vi phạm ràng buộc đăng ký** Tại bước 7, hệ thống phát hiện nếu: Giảm giới hạn số người tham gia nhỏ hơn số lượng đã đăng ký; hoặc thay đổi loại khóa đào tạo khi khóa đã mở đăng ký. Hệ thống hiển thị cảnh báo và không cho phép lưu. **E3: Dữ liệu không hợp lệ** Tại bước 7, hệ thống phát hiện thiếu trường bắt buộc hoặc thời gian không hợp lệ. Hệ thống yêu cầu chỉnh sửa lại thông tin. **E4: Hủy thao tác** Tại bước 5, Phòng TCCB chọn “Hủy”. Quay lại màn hình danh sách nhân sự. |

**5.35. Đặc tả use case: Xem chi tiết thông tin khóa đào tạo đã mở**

| Tên use case | Xem chi tiết thông tin khóa đào tạo đã mở |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB |
| Mục đích (mô tả) | Cho phép Phòng TCCB xem đầy đủ thông tin chi tiết của một khóa đào tạo đã được tạo, bao gồm trạng thái khóa học, thông tin tổ chức đào tạo, danh sách cán bộ – giảng viên đăng ký tham gia, và tình trạng tham gia của từng nhân sự, nhằm phục vụ công tác quản lý, theo dõi và ra quyết định điều chỉnh khóa đào tạo khi cần thiết. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn một khóa đào tạo và nhấn chức năng “Xem chi tiết” trong menu “Đào tạo & Phát triển”. |
| Điều kiện tiên quyết (Precondition) | Cán bộ Phòng TCCB đã đăng nhập hệ thống. Khóa đào tạo đã tồn tại trong hệ thống. |
| Điều kiện thành công (Post-condition) | Thông tin chi tiết của khóa đào tạo được hiển thị đầy đủ và chính xác. Phòng TCCB có thể theo dõi tình trạng khóa học và danh sách nhân sự tham gia. |
| Điều kiện thất bại | Không thể hiển thị thông tin khóa đào tạo do lỗi hệ thống. |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB truy cập menu **“Đào tạo & Phát triển”**. 2\. Hệ thống hiển thị danh sách các khóa đào tạo. 3\. Phòng TCCB chọn một khóa đào tạo và nhấn **“Xem chi tiết”**. 4\. Hệ thống hiển thị màn hình chi tiết khóa đào tạo, hiển thị đầy đủ thông tin theo yêu cầu bao gồm các thông tin: **Thông tin chung khóa đào tạo**: Tên khóa đào tạo, Loại khóa đào tạo, Trạng thái khóa đào tạo (Đang mở đăng ký / Đang đào tạo / Đã hoàn thành), Thời gian đào tạo (từ ngày – đến ngày), Địa điểm, Kinh phí (nếu có), Cam kết sau đào tạo (nếu có), Chứng chỉ sau đào tạo. **Thông tin đăng ký**: Thời gian mở đăng ký, Giới hạn số lượng người tham gia, Số lượng đã đăng ký / số lượng tối đa **Danh sách tham gia**: Hệ thống hiển thị danh sách cán bộ, giảng viên đã đăng ký khóa đào tạo, bao gồm (Họ và tên, Mã cán bộ, Đơn vị đang công tác, Thời điểm đăng ký |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.36. Đặc tả use case: Ghi nhận kết quả đào tạo của cán bộ giảng viên**

| Tên use case | Ghi nhận kết quả đào tạo của cán bộ giảng viên |
| :---- | :---- |
| Tác nhân chính | Cán bộ TCCB |
| Mục đích (mô tả) | Cho phép Phòng TCCB ghi nhận kết quả tham gia khóa đào tạo của cán bộ, giảng viên sau khi khóa học kết thúc; cập nhật trạng thái hoàn thành, không đạt và lưu trữ chứng chỉ đào tạo vào hồ sơ nhân sự nhằm phục vụ công tác quản lý và đánh giá năng lực. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn chức năng “Ghi nhận kết quả đào tạo” tại tab “Danh sách học viên” của một khóa đào tạo. |
| Điều kiện tiên quyết (Precondition) | Cán bộ Phòng TCCB đã đăng nhập hệ thống. Khóa đào tạo đã tồn tại trong hệ thống. Trạng thái khóa đào tạo là “Đã hoàn thành”. Khóa đào tạo có danh sách học viên đã đăng ký. |
| Điều kiện thành công (Post-condition) | Kết quả đào tạo của từng học viên được ghi nhận thành công. Trạng thái tham gia của học viên được cập nhật (Hoàn thành / Không đạt). Chứng chỉ đào tạo (nếu có) được lưu vào hồ sơ cá nhân của nhân sự. Lịch sử đào tạo của nhân sự được cập nhật. |
| Điều kiện thất bại | Kết quả đào tạo không được ghi nhận do dữ liệu không hợp lệ hoặc vi phạm ràng buộc nghiệp vụ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Phòng TCCB truy cập menu **“Đào tạo & Phát triển”**. 2\. Chọn xem chi tiết “Danh sách học viên” có một khóa đào tạo có trạng thái “Đã hoàn thành”. 3\. Hệ thống hiển thị danh sách học viên tham gia khóa đào tạo, bao gồm: Họ tên, Mã cán bộ, Đơn vị công tác, Trạng thái tham gia hiện tại (Đang học) 4\. Phòng TCCB chọn một học viên và nhấn **“Ghi nhận kết quả”**. 5\. Hệ thống hiển thị form ghi nhận kết quả, bao gồm: Trạng thái kết quả: Hoàn thành/ Không đạt`,`Ngày hoàn thành (mặc định là ngày kết thúc khóa học), File chứng chỉ (PDF) (tùy chọn, bắt buộc nếu trạng thái là “Hoàn thành”)6\. Phòng TCCB nhập thông tin và nhấn **“Lưu”**.7\. Hệ thống kiểm tra tính hợp lệ của dữ liệu. 8\. Hệ thống cập nhật trạng thái học viên: Nếu **Hoàn thành** (Ghi nhận kết quả đào tạo, Lưu chứng chỉ vào hồ sơ nhân sự). Nếu **Không đạt** (Chỉ lưu trạng thái kết quả, không cập nhật chứng chỉ, Hệ thống thông báo ghi nhận kết quả thành công). |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Ghi nhận kết quả cho nhiều học viên** Tại bước 4, Phòng TCCB có thể chọn nhiều học viên. Hệ thống cho phép ghi nhận kết quả hàng loạt với cùng trạng thái. Tiếp tục bước 5 |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Khóa đào tạo chưa hoàn thành** Tại bước 4, nếu trạng thái khóa đào tạo khác “Đã hoàn thành”. Hệ thống hiển thị thông báo: *“Chỉ có thể ghi nhận kết quả khi khóa đào tạo đã hoàn thành.”* **E2: Thiếu chứng chỉ khi hoàn thành, Dữ liệu không hợp lệ** Tại bước 8, Hệ thống phát hiện thiếu thông tin bắt buộc hoặc file không đúng định dạng hoặc nếu học viên được đánh dấu “Hoàn thành” nhưng không upload file chứng chỉ (trong trường hợp bắt buộc). Hệ thống hiển thị cảnh báo và yêu cầu bổ sung. |

**5.37. Đặc tả use case: Xem chi tiết các thống kê**

| Tên use case | Xem chi tiết các thống kê |
| :---- | :---- |
| Tác nhân chính | Phòng TCCB, Phòng TCKT |
| Mục đích (mô tả) | Cung cấp cho Phòng TCCB, Phòng TCKT và lãnh đạo có các báo cáo tổng hợp, thống kê trực quan về tình hình nhân sự, cơ cấu tổ chức, đào tạo và biến động nhân sự theo thời gian; hỗ trợ theo dõi, phân tích và ra quyết định quản lý. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Phòng TCCB chọn menu “Báo cáo và Thống kê” trên hệ thống. |
| Điều kiện tiên quyết (Precondition) | Phòng TCCB đã đăng nhập hệ thống. Dữ liệu nhân sự, đơn vị, đào tạo đã tồn tại trong hệ thống. |
| Điều kiện thành công (Post-condition) | Các báo cáo thống kê được hiển thị đầy đủ, chính xác. Người dùng có thể xem chi tiết, lọc dữ liệu và xuất báo cáo theo nhu cầu. |
| Điều kiện thất bại | Không hiển thị được báo cáo do lỗi dữ liệu hoặc hệ thống. |
| Luồng sự kiện chính (Basic Flow) | 1\. Cán bộ TCCB truy cập menu **“Báo cáo và Thống kê”**. 2\. Hệ thống hiển thị **Danh sách nhóm báo cáo**. 3\. Phòng TCCB chọn từng nhóm báo cáo để xem chi tiết. Báo cáo tổng quan nhân sự Báo cáo biến động nhân sự Báo cáo cơ cấu nhân sự theo đơn vị Báo cáo cơ cấu nhân sự theo trình độ, học hàm, chức danh Báo cáo bổ nhiệm nhân sự Báo cáo đào tạo và phát triển Báo cáo hợp đồng và tình trạng làm việc 4\. Hệ thống hiển thị dữ liệu thống kê tương ứng dưới dạng biểu đồ và bảng đa dạng theo thời gian, đơn vị, loại nhân sự. |
| Luồng sự kiện thay thế (Alternative Flow) | **A1: Xuất báo cáo** Tại bước 4, Cán bộ TCCB chọn chức năng “Xuất báo cáo” (Định dạng xuất: PDF / Excel, Phạm vi dữ liệu (theo bộ lọc hiện tại)) Cán bộ TCCB xác nhận xuất Hệ thống tạo file báo cáo và cho phép tải về |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.38. Đặc tả use case: Xem các thông tin trong hồ sơ cá nhân của nhân sự**

| Tên use case | Xem các thông tin trong hồ sơ cá nhân của nhân sự |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự |
| Mục đích (mô tả) | Cho phép Cán bộ/Giảng viên (CBGV) xem toàn bộ thông tin hồ sơ cá nhân của mình đang được lưu trong hệ thống, tra cứu lịch sử hợp đồng, hệ số, bậc lương, các quyết định khen thưởng và kỷ luật của bản thân.. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | CB/GV chọn chức năng “Hồ sơ cá nhân” trên giao diện hệ thống |
| Điều kiện tiên quyết (Precondition) | CB/GV đã đăng nhập. |
| Điều kiện thành công (Post-condition) | Thông tin hồ sơ cá nhân được hiển thị đầy đủ cho CBGV. |
| Điều kiện thất bại | Không thể hiển thị thông tin hồ sơ cá nhân do lỗi hệ thống. |
| Luồng sự kiện chính (Basic Flow) | 1\. CB/GV chọn các mục kích hoạt chức năng xem hồ sơ nhân sự 2\. Hệ thống hiển thị đầy đủ thông tin theo các tab: **Tab "Thông tin chung":** Mã cán bộ, Lý lịch, liên hệ, gia đình, ảnh chân dung **Tab "Trình độ & Chức danh":** Bằng cấp, chứng chỉ, chức danh khoa học, chức vụ, đơn vị công tác. **Tab "Thông tin Đảng/ Đoàn":** Thông tin Đảng/ Đoàn đã được lưu. **Tab "Lương & Phụ cấp":** Thông tin về ngạch, bậc, hệ số lương, thông tin ngân hàng **Tab "Hợp đồng":** Thông tin về các loại hợp đồng đã ký **Tab "Khen thưởng/Kỷ luật":** Các mục khen thưởng, kỷ luật của nhân sự **Tab "Công tác":** Quá trình công tác T**ab "Lịch sử":** Lịch sử thay đổi hồ sơ |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.39. Đặc tả use case: Xem thông tin chi tiết đơn vị đang công tác**

| Tên use case | Xem thông tin chi tiết đơn vị đang công tác |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự |
| Mục đích (mô tả) | Cho phép Cán bộ/Giảng viên xem thông tin chi tiết về đơn vị tổ chức mà mình đang công tác trong cơ cấu tổ chức của đơn vị, bao gồm thông tin cơ bản của đơn vị, danh sách chức vụ và nhân sự hiện tại trong đơn vị. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Cán bộ/Giảng viên chọn chức năng xem thông tin đơn vị công tác từ hồ sơ cá nhân hoặc menu liên quan. |
| Điều kiện tiên quyết (Precondition) | Cán bộ/Giảng viên đã đăng nhập hệ thống. Cán bộ/Giảng viên đã được gán đơn vị công tác trong hệ thống. Đơn vị tổ chức đang tồn tại trong cơ cấu tổ chức. |
| Điều kiện thành công (Post-condition) | Thông tin chi tiết của đơn vị công tác được hiển thị đầy đủ và chính xác. Không có thay đổi dữ liệu trong hệ thống (chỉ đọc). |
| Điều kiện thất bại | Không hiển thị được thông tin do lỗi hệ thống hoặc không xác định được đơn vị công tác của CBGV. |
| Luồng sự kiện chính (Basic Flow) | 1\. Cán bộ/Giảng viên truy cập chức năng xem thông tin đơn vị công tác.2\. Hệ thống xác định đơn vị mà Cán bộ/Giảng viên đang trực thuộc. 3\. Hệ thống hiển thị thông tin chi tiết của đơn vị, bao gồm: Tab **“Tổng quan”**, bao gồm: Tên đơn vị, Mã đơn vị, Loại đơn vị, Đơn vị cha, Ngày thành lập, Thông tin liên hệ, Trạng thái hiện tại của đơn vị (Đang hoạt động / Sáp nhập / Giải thể) Tab **“Nhân sự”**: Hệ thống hiển thị danh sách các nhân sự, Tên chức vụ, hệ thống hiển thị: Họ tên nhân sự, Mã cán bộ, Ngày bắt đầu. Hệ thống hiển thị danh sách nhân sự thuộc đơn vị Tab **“Đơn vị trực thuộc”**: Hệ thống hiển thị danh sách các đơn vị dưới cấp trực thuộc đơn vị đang xem. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.40. Đặc tả use case: Đăng ký tham gia khóa đào tạo**

| Tên use case | Đăng ký tham gia khóa đào tạo |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự |
| Mục đích (mô tả) | Cho phép Cán bộ/Giảng viên đăng ký tham gia các khóa đào tạo do nhà trường tổ chức đang trong thời gian mở đăng ký, làm cơ sở cho việc quản lý học viên, theo dõi quá trình và ghi nhận kết quả đào tạo. |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Cán bộ/Giảng viên chọn menu “Đào tạo”. |
| Điều kiện tiên quyết (Precondition) | Cán bộ/Giảng viên đã đăng nhập hệ thống. Khóa đào tạo tồn tại và đang ở trạng thái **"Đang mở đăng ký"**. Thời điểm hiện tại nằm trong khoảng **Thời gian mở đăng ký**. |
| Điều kiện thành công (Post-condition) | Đăng ký tham gia khóa đào tạo của CBGV được ghi nhận trong hệ thống. |
| Điều kiện thất bại | Không thể đăng ký do khóa đào tạo không hợp lệ, hết hạn đăng ký hoặc vi phạm ràng buộc nghiệp vụ. |
| Luồng sự kiện chính (Basic Flow) | 1\. Cán bộ/Giảng viên truy cập menu “Đào tạo”. 2\. Hệ thống hiển thị danh sách các khóa đào tạo đang ở trạng thái "Đang mở đăng ký". 3\. Cán bộ/Giảng viên chọn một khóa đào tạo để xem chi tiết thông tin. 4\. Cán bộ/Giảng viên nhấn nút “Đăng ký tham gia”. 5\. Hệ thống kiểm tra các điều kiện đăng ký (thời gian, số lượng, trạng thái). 6\. Hệ thống ghi nhận đăng ký và thiết lập trạng thái đăng ký là “Đã đăng ký” tương ứng. 7\. Hệ thống thông báo đăng ký thành công cho Cán bộ/Giảng viên. |
| Luồng sự kiện thay thế (Alternative Flow) | Không có |
| Luồng sự kiện ngoại lệ (Exception Flow) | **E1: Hết thời gian đăng ký** Tại bước 5, nếu thời gian hiện tại nằm ngoài khoảng mở đăng ký. Hệ thống ẩn nút “Đăng ký” và hiển thị thông báo: *“Khóa đào tạo đã hết thời gian đăng ký.”* **E2: Đã đủ số lượng người tham gia** Tại bước 5, nếu số lượng đăng ký đã đạt giới hạn. Hệ thống hiển thị thông báo: *“Khóa đào tạo đã đủ số lượng đăng ký.”* **E3: Đã đăng ký trước đó** Nếu CBGV đã đăng ký khóa học này. Hệ thống hiển thị thông báo: *“Bạn đã đăng ký khóa đào tạo này.* |

**5.41. Đặc tả use case: Xem danh sách các khóa đào tạo đã đăng ký**

| Tên use case | Xem danh sách các khóa đào tạo đã đăng ký |
| :---- | :---- |
| Tác nhân chính | Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự  |
| Mục đích (mô tả) | Cho phép Cán bộ/Giảng viên xem danh sách tất cả các khóa đào tạo mà mình đã đăng ký tham gia, theo dõi trạng thái tham gia và kết quả đào tạo của từng khóa (Đang học, Hoàn thành, Không đạt), phục vụ việc tra cứu, theo dõi quá trình học tập và kết quả đào tạo cá nhân.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Chọn menu "Đào tạo"   |
| Điều kiện tiên quyết (Precondition) | Cán bộ/Giảng viên đã đăng nhập hệ thống. Cán bộ/Giảng viên đã từng đăng ký ít nhất một khóa đào tạo  |
| Điều kiện thành công (Post-condition) | Danh sách các khóa đào tạo đã đăng ký của Cán bộ/Giảng viên được hiển thị đầy đủ và chính xác. Trạng thái tham gia và kết quả đào tạo của từng khóa được hiển thị đúng theo dữ liệu do Phòng TCCB ghi nhận.  |
| Điều kiện thất bại | Không hiển thị được danh sách do lỗi hệ thống hoặc dữ liệu không tồn tại. |
| Luồng sự kiện chính (Basic Flow) | 1\. Cán bộ/Giảng viên truy cập chức năng **“Khóa đào tạo đã đăng ký”**. 2\. Hệ thống truy xuất danh sách các khóa đào tạo mà Cán bộ/Giảng viên đã đăng ký. 3\. Hệ thống hiển thị danh sách khóa đào tạo, bao gồm các thông tin: Tên khóa đào tạo, Loại khóa đào tạo, Thời gian đào tạo (từ ngày – đến ngày), Đơn vị/địa điểm tổ chức, Trạng thái khóa đào tạo (Đang mở đăng ký / Đang đào tạo / Đã hoàn thành), Trạng thái tham gia của cá nhân (Đã đăng ký, Đang học, Hoàn thành, Không đạt). |
| Luồng sự kiện thay thế (Alternative Flow) | Không có  |
| Luồng sự kiện ngoại lệ (Exception Flow) | Không có |

**5.42. Đặc tả use case: Xem nhật ký hệ thống (Audit Log)**

| Tên use case | Xem nhật ký hệ thống (Audit Log) |
| :---- | :---- |
| Tác nhân chính | Quản trị viên  |
| Mục đích (mô tả) | Cho phép Quản trị viên xem, tìm kiếm và lọc nhật ký ghi lại toàn bộ các thao tác quan trọng trên hệ thống (đăng nhập, thêm/sửa/xóa dữ liệu, phân quyền, thay đổi trạng thái…) nhằm phục vụ công tác giám sát, kiểm tra an ninh và truy vết sự cố.  |
| Mức độ ưu tiên (Priority) | Bắt buộc |
| Điều kiện kích hoạt (Trigger) | Quản trị viên chọn menu "Nhật ký hệ thống" (Audit Log).   |
| Điều kiện tiên quyết (Precondition) | Người dùng đã đăng nhập với vai trò Quản trị viên hệ thống. Hệ thống đã ghi nhận các bản ghi nhật ký từ hoạt động của người dùng.  |
| Điều kiện thành công (Post-condition) | Danh sách nhật ký hệ thống được hiển thị đầy đủ, chính xác theo tiêu chí lọc. Không có thay đổi dữ liệu trong hệ thống (chỉ đọc).  |
| Điều kiện thất bại | Không hiển thị được nhật ký do lỗi hệ thống. |
| Luồng sự kiện chính (Basic Flow) | 1\. Quản trị viên chọn menu "Nhật ký hệ thống". 2\. Hệ thống hiển thị danh sách nhật ký (phân trang), mỗi bản ghi bao gồm: Thời gian thao tác, Tài khoản thực hiện (Username), Họ tên người thực hiện, Vai trò, Loại hành động (Đăng nhập / Đăng xuất / Thêm / Sửa / Xóa / Phân quyền / Thay đổi trạng thái), Đối tượng bị tác động (Tên module, Mã đối tượng), Mô tả chi tiết thay đổi, Địa chỉ IP. 3\. Quản trị viên có thể lọc nhật ký theo các tiêu chí: \- Khoảng thời gian: Từ ngày – Đến ngày \- Tài khoản thực hiện: Nhập Username hoặc Họ tên \- Loại hành động: Tất cả (Mặc định), Đăng nhập, Đăng xuất, Thêm, Sửa, Xóa, Phân quyền, Thay đổi trạng thái \- Module: Tất cả (Mặc định), Quản lý tài khoản, Hồ sơ nhân sự, Cơ cấu tổ chức, Hợp đồng, Đào tạo, Danh mục cấu hình 4\. Quản trị viên nhấn "Tìm kiếm" hoặc "Áp dụng bộ lọc". 5\. Hệ thống hiển thị kết quả nhật ký phù hợp với tiêu chí đã chọn. 6\. Quản trị viên có thể nhấn vào một bản ghi để xem chi tiết thay đổi (giá trị trước và sau khi thay đổi). |
| Luồng sự kiện thay thế (Alternative Flow) | A1: Xuất nhật ký Tại bước 5, Quản trị viên chọn chức năng "Xuất nhật ký". Hệ thống cho phép xuất danh sách nhật ký theo bộ lọc hiện tại dưới định dạng Excel hoặc PDF. Quản trị viên xác nhận xuất. Hệ thống tạo file và cho phép tải về. |
| Luồng sự kiện ngoại lệ (Exception Flow) | E1: Không tìm thấy kết quả Tại bước 5, nếu không có bản ghi nhật ký nào phù hợp với tiêu chí lọc. Hệ thống hiển thị thông báo: "Không tìm thấy nhật ký phù hợp với tiêu chí tìm kiếm." |