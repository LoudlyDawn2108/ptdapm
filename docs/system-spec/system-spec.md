# I. BẢN KẾ HOẠCH QUẢN LÝ YÊU CẦU

## 1.1. Giới thiệu

### 1.1.1. Mục đích

Tài liệu Kế hoạch Quản lý Yêu cầu (Requirements Management Plan – RMP) này được xây dựng nhằm xác định các phương pháp, quy trình và công cụ được sử dụng để quản lý các yêu cầu của Hệ thống Quản lý Nhân sự (Human Resource Management System – HRMS) phục vụ Trường Đại học Thủy Lợi.

Tài liệu đóng vai trò là cơ sở để:

* Định hướng hoạt động thu thập, phân tích, đặc tả và quản lý yêu cầu hệ thống;
* Đảm bảo các yêu cầu được xác định rõ ràng, nhất quán và có khả năng truy xuất nguồn gốc;
* Hỗ trợ kiểm soát và quản lý các thay đổi yêu cầu trong suốt vòng đời phát triển hệ thống;
* Làm tài liệu tham chiếu cho các giai đoạn thiết kế, phát triển, kiểm thử và nghiệm thu hệ thống.

### 1.1.2. Phạm vi áp dụng

Bản RMP này áp dụng cho toàn bộ các yêu cầu của hệ thống HRMS được phát triển nhằm phục vụ công tác quản lý nhân sự tại Trường Đại học Thủy Lợi, bao gồm các đơn vị đào tạo, đơn vị nghiên cứu khoa học, các phòng ban chức năng và các cơ sở trực thuộc nhà trường.

## 1.2. Công cụ sử dụng và các kiểu yêu cầu

### 1.2.1. Các công cụ sử dụng quản lý yêu cầu

| STT | Công cụ | Mục đích sử dụng |
| --- | --- | --- |
| 1 | Microsoft Word | Soạn thảo và chỉnh sửa các tài liệu quản lý yêu cầu như RMP, SRS |
| 2 | StarUML/ Draw.io | - Mô hình hóa tiến trình công việc qua các sơ đồ GANTT, đường Găng.- Mô hình hóa hệ thống thông qua các sơ đồ Use Case, các sơ đồ UML liên quan. |
| 3 | Discord / Họp nhóm trực tiếp | Trao đổi thông tin, thảo luận và xác nhận yêu cầu giữa các thành viên trong nhóm và các bên liên quan |

### 1.2.2. Các kiểu yêu cầu cho dự án

| Loại yêu cầu | Loại tài liệu | Mô tả |
| --- | --- | --- |
| Yêu cầu của các bên liên quan (STRQ) | Yêu cầu của các bên liên quan (STR) | Mô tả các nhu cầu, mong đợi và mục tiêu chính của người dùng và các bên liên quan đối với hệ thống. |
| Yêu cầu tính năng (FEAT) | Tài liệu tầm nhìn (VIS) | Mô tả các điều kiện, khả năng và các tính năng tổng quát mà hệ thống cần cung cấp. |
| Ca sử dụng (UC) / Kịch bản (SC) | Đặc tả ca sử dụng (UCS) | Mô tả chi tiết các ca sử dụng và kịch bản, phản ánh đầy đủ các yêu cầu chức năng của hệ thống. |
| Yêu cầu bổ sung (SUPL) | Đặc tả bổ sung (SS) | Mô tả các yêu cầu phi chức năng và các ràng buộc của hệ thống không được thể hiện trong mô hình ca sử dụng. |

### 1.2.3. Loại tài liệu yêu cầu cho dự án

| Loại tài liệu | Mô tả | Loại yêu cầu mặc định |
| --- | --- | --- |
| Kế hoạch quản lý yêu cầu (RMP) | Tài liệu mô tả phương pháp, quy trình và công cụ quản lý yêu cầu của dự án. | Không áp dụng |
| Yêu cầu của các bên liên quan (STR) | Tập hợp các yêu cầu nghiệp vụ và mong đợi chính từ các bên liên quan. | Yêu cầu bên liên quan (STRQ) |
| Tài liệu tầm nhìn (VIS) | Mô tả tổng quan hệ thống, phạm vi và các mục tiêu chính của dự án. | Yêu cầu tính năng (FEAT) |
| Đặc tả ca sử dụng (UCS) | Mô tả chi tiết các ca sử dụng và cách người dùng tương tác với hệ thống. | Ca sử dụng (UC) và Kịch bản (SC) |
| Đặc tả bổ sung (SS) | Mô tả các yêu cầu phi chức năng và các ràng buộc của hệ thống. | Yêu cầu bổ sung (SUPL) |

## 1.3. Các nhân tố tham gia dự án phần mềm

| Team | Vai trò | Số lượng | Nhiệm vụ chính |
| --- | --- | --- | --- |
| Team 1 | BA / PM | 2 | Phân tích yêu cầu, lập kế hoạch và quản lý tiến độ dự án |
| Team 2 | SA / Design | 4 | Thiết kế kiến trúc hệ thống, cơ sở dữ liệu và giao diện người dùng (UI/UX) |
| Team 3 | Dev | 4 | Phát triển hệ thống Backend và Frontend theo thiết kế |
| Team 4 | Test | 2 | Xây dựng và thực hiện kiểm thử, đảm bảo chất lượng phần mềm |
| Team 5 | Deploy | 2 | Triển khai hệ thống, cấu hình môi trường và thiết lập quy trình CI/CD |
| **Tổng** |  | **14** |  |

## 1.4. Bảng liên lạc với các nhân tố chính (Stakeholder)

### 1.4.1. Các nhân tố chính

| STT | Nhân tố chính | Vai trò trong dự án | Đơn vị | Trách nhiệm chính | Hình thức liên lạc |
| --- | --- | --- | --- | --- | --- |
| 1 | Ban Giám hiệu | Nhà tài trợ / Phê duyệt | Ban Giám hiệu | Phê duyệt yêu cầu, xem xét báo cáo tổng hợp | Họp định kỳ, báo cáo |
| 2 | Phòng Tổ chức – Cán bộ | Khách hàng nghiệp vụ | Phòng TCCB | Cung cấp yêu cầu quản lý hồ sơ nhân sự | Họp, email |
| 3 | Phòng Tài chính – Kế toán | Khách hàng nghiệp vụ | Phòng TCKT | Cung cấp yêu cầu về lương, phụ cấp | Họp, trao đổi trực tiếp |
| 4 | Phòng CNTT | Đơn vị kỹ thuật | Phòng CNTT | Tư vấn kỹ thuật, hạ tầng, bảo mật | Họp kỹ thuật |
| 5 | Trưởng khoa / phòng | Người sử dụng chính | Các khoa / phòng | Góp ý, xác nhận yêu cầu quản lý nhân sự đơn vị | Họp, khảo sát |
| 6 | Nhóm phát triển | Thực hiện dự án | Nhóm dự án | Phân tích, thiết kế và triển khai hệ thống | Họp nhóm, công cụ trực tuyến |

### 1.4.2. Các bên liên quan khác

| STT | Bên liên quan | Vai trò / Mối liên hệ |
| --- | --- | --- |
| 1 | Bộ Nông nghiệp và Phát triển Nông thôn | Cơ quan quản lý nhà nước, ban hành quy định nhân sự, chế độ |
| 2 | Bộ Giáo dục và Đào tạo | Cơ quan quản lý chuyên ngành, quy định tiêu chuẩn cán bộ |
| 3 | Cơ quan Bảo hiểm xã hội | Đơn vị phối hợp quản lý bảo hiểm, chế độ người lao động |
| 4 | Cơ quan Thuế | Đơn vị phối hợp quản lý nghĩa vụ thuế thu nhập cá nhân |

# II. THU THẬP YÊU CẦU TỪ CÁC STAKEHOLDERS (Xác định STRQ, FEAT)

## 2.1. Xác định các STRQ, FEAT

| Yêu cầu (STRQ) | Kỹ thuật xác định FEAT | Tính năng (FEAT) |
| --- | --- | --- |
| **STRQ 1:** Cần hệ thống cho phép đăng nhập, đăng xuất, đổi mật khẩu như một hệ thống phần mềm nhân sự khác tài khoản có phân quyền nhiều tài khoản. | * Phân tách * Làm cho đầy đủ | * **FEAT 1.1:** Mọi người dùng có thể đăng nhập bằng tài khoản. * **FEAT 1.2:** Mọi người dùng có thể đăng xuất khỏi tài khoản đang sử dụng. * **FEAT 1.3:** Hệ thống tự động đăng xuất khỏi phiên làm việc nếu người dùng không thao tác với trang web trong 30 phút. * **FEAT 1.4:** Mọi người dùng có thể đổi mật khẩu tài khoản đang sử dụng. |
| **STRQ 2:** Quản trị viên là người có thể quản lý tài khoản như thêm, sửa, khóa hoặc phân quyền người dùng. | * Phân tách * Thêm chi tiết * Làm cho đầy đủ | * **FEAT 2.1:** Hệ thống cho phép quản trị viên có thể tìm kiếm tài khoản người dùng. * **FEAT 2.2:** Hệ thống cho phép quản trị viên có thể thêm mới tài khoản người dùng. * **FEAT 2.3:** Hệ thống cho phép quản trị viên có thể sửa tài khoản người dùng. * **FEAT 2.4:** Hệ thống cho phép quản trị viên phân quyền cho tài khoản thành viên hệ thống tương ứng với các nhóm nghiệp vụ. * **FEAT 2.5:** Hệ thống cho phép quản trị viên có thể thay đổi trạng thái của tài khoản người dùng (Trạng thái: Khóa/Mở khóa). * **FEAT 2.6:** Hệ thống có thể tự động khóa tài khoản của nhân sự đã thôi việc. |
| **STRQ 3:** Quản trị viên và phòng TCCB có thể quản lý cơ cấu tổ chức, thêm vào các đơn vị mới, chỉnh sửa thông tin hoặc thông báo giải thể, sáp nhập đơn vị. | * Phân tách * Làm cho đầy đủ * Thêm chi tiết * Sửa chữa | * **FEAT 3.1:** Hệ thống cung cấp cơ cấu tổ chức phân cấp đơn vị theo dạng cha-con có gốc là trường Đại học Thủy Lợi. * **FEAT 3.2:** Hệ thống cho phép quản trị viên và phòng TCCB thêm mới đơn vị tổ chức nhân sự. * **FEAT 3.3:** Hệ thống cho phép quản trị viên và phòng TCCB sửa thông tin đơn vị tổ chức nhân sự. * **FEAT 3.4:** Hệ thống cho phép quản trị viên và phòng TCCB thay đổi trạng thái của đơn vị tổ chức nhân sự (Trạng thái: Giải thể/Sáp nhập). * **FEAT 3.5:** Hệ thống cho phép quản trị viên và phòng TCCB xem chi tiết thông tin đơn vị tổ chức nhân sự. |
| **STRQ 4:** Phòng TCCB có thể điều chuyển và bổ nhiệm nhân sự vào các đơn vị. | * Thêm chi tiết | * **FEAT 4.1:** Hệ thống cho phép phòng TCCB bổ nhiệm và điều chuyển nhân sự vào một đơn vị tổ chức nhân sự. * **FEAT 4.2:** Hệ thống cho phép phòng TCCB bãi nhiệm nhân sự khỏi đơn vị tổ chức đó. |
| **STRQ 5:** Phòng TCCB có thể tạo hợp đồng lao động của nhân sự. | * Thêm chi tiết | * **FEAT 5.1:** Hệ thống cho phép phòng TCCB tạo hợp đồng cho nhân sự không có hợp đồng hoặc cần gia hạn hợp đồng. |
| **STRQ 6:** Phòng TCCB có thể ghi nhận đánh giá nhân sự. | * Sao chép | * **FEAT 6.1:** Hệ thống cho phép phòng TCCB ghi đánh giá cho nhân sự (Loại đánh giá: Khen thưởng/Kỷ luật). |
| **STRQ 7:** Phòng TCCB muốn quản lý hồ sơ nhân sự như thêm, sửa hồ sơ và cho phép đánh dấu thôi việc hồ sơ nếu nhân sự không làm có thêm phương pháp tìm kiếm và lọc để tiện quản lý. | * Phân tách * Làm cho rõ ràng * Thêm chi tiết | * **FEAT 7.1:** Hệ thống cho phép phòng TCCB và phòng tài chính tìm kiếm hồ sơ nhân sự bằng nhiều từ khóa. * **FEAT 7.2:** Hệ thống cho phép phòng TCCB và phòng tài chính lọc đa tiêu chí hồ sơ nhân sự. * **FEAT 7.3:** Hệ thống cho phép phòng TCCB thêm mới hồ sơ nhân sự (gồm nhập tay hoặc upload từ Excel). * **FEAT 7.4:** Hệ thống cho phép phòng TCCB chỉnh sửa hồ sơ nhân sự (thông tin cá nhân, trình độ học vấn, khen thưởng/kỷ luật, quá trình công tác, thông tin hợp đồng), bao gồm ẩn/hiện các mục khen thưởng, kỷ luật đối với các vai trò khác. * **FEAT 7.5:** Hệ thống cho phép phòng TCCB đánh dấu thôi việc nhân sự. * **FEAT 7.6:** Hệ thống có thể tự động đánh dấu thôi việc nhân sự nếu hợp đồng hết hạn quá thời gian cho phép của loại hợp đồng. * **FEAT 7.7:** Hệ thống cho phép phòng TCCB và phòng tài chính có thể xem chi tiết hồ sơ nhân sự theo từng chế độ xem. * **FEAT 7.8:** Hệ thống cho phép phòng TCCB và phòng tài chính có thể in hoặc xuất Excel hồ sơ nhân sự. |
| **STRQ 8:** Phòng TCCB cần hệ thống cho phép mở khóa đào tạo, quản lý khóa đào tạo cho nhân sự. | * Phân tách * Làm cho đầy đủ | * **FEAT 8.1:** Hệ thống cho phép phòng nhân sự mở khóa đào tạo (cấu hình chuyên sâu về thời gian, địa điểm, chứng chỉ) cho cán bộ. * **FEAT 8.2:** Hệ thống cho phép phòng nhân sự chỉnh sửa khóa đào tạo đã mở cho cán bộ tùy theo trạng thái chưa diễn ra hay đang diễn ra, bao gồm thay đổi trạng thái khóa đào tạo (Đang mở đăng ký → Đang đào tạo → Đã hoàn thành). * **FEAT 8.3:** Hệ thống cho phép phòng nhân sự xem thông tin khóa đào tạo đã mở cho cán bộ kèm danh sách người đã đăng ký. * **FEAT 8.4:** Hệ thống cho phép phòng nhân sự ghi nhận kết quả đào tạo cho cán bộ đã tham gia và lưu trực tiếp chứng chỉ vào hồ sơ nhân sự. |
| **STRQ 9:** Phòng TCCB có thể cấu hình lương, loại phụ cấp, loại hợp đồng. | * Phân tách * Làm cho đầy đủ | * **FEAT 9.1:** Hệ thống cho phép phòng nhân sự thêm mới hệ số lương (Hệ số lương được thêm sẽ được dùng làm thông tin cho hồ sơ). * **FEAT 9.2:** Hệ thống cho phép phòng nhân sự sửa thông tin đối với hệ số lương mới được tạo phục vụ sửa chữa nhập liệu lỗi. * **FEAT 9.3:** Hệ thống cho phép phòng nhân sự xóa hệ số lương khi không được hồ sơ nào sử dụng, hoặc thay đổi trạng thái (đưa vào trạng thái ngừng sử dụng hoặc kích hoạt lại) nếu đã được sử dụng. * **FEAT 9.4:** Hệ thống cho phép phòng nhân sự cấu hình (Thêm/Sửa/Thay đổi trạng thái) danh mục loại phụ cấp. * **FEAT 9.5:** Hệ thống cho phép phòng nhân sự cấu hình (Thêm/Sửa/Thay đổi trạng thái) danh mục loại hợp đồng. |

> **Ghi chú thiết kế – FEAT 9.4/9.5:** Danh mục loại phụ cấp và loại hợp đồng chỉ hỗ trợ thao tác "Thay đổi trạng thái" (chuyển đổi giữa "Đang sử dụng" và "Ngừng sử dụng") mà không hỗ trợ "Xóa" (khác với hệ số lương ở FEAT 9.3 có hỗ trợ xóa khi chưa được sử dụng). Thiết kế này nhằm đảm bảo tính toàn vẹn dữ liệu và phục vụ kiểm toán – các loại phụ cấp/hợp đồng đã từng được sử dụng trong hệ thống cần được lưu giữ lịch sử.
| **STRQ 10:** Phòng tài chính và TCCB muốn thống kê chi tiết về nhân sự. | * Thêm các chi tiết | * **FEAT 10.1:** Hệ thống cho phép phòng TCCB và phòng tài chính xem và xuất các thống kê nhân sự thông qua giao diện dashboard hoặc báo cáo tổng hợp: thống kê tổng quan nhân sự, biến động nhân sự, cơ cấu nhân sự theo đơn vị, cơ cấu nhân sự theo trình độ, học hàm, chức danh, đánh giá của cán bộ với khóa đào tạo, hợp đồng và tình trạng làm việc, đào tạo và phát triển, báo cáo bổ nhiệm nhân sự. |
| **STRQ 11:** Người dùng phần mềm có thể xem hồ sơ cá nhân, xem thông tin đơn vị đang công tác và thực hiện các luồng tác vụ cá nhân. | * Phân tách | * **FEAT 11.1:** Mọi người dùng trong hệ thống có thể xem thông tin cá nhân của bản thân trên không gian thông qua các chế độ Tab hiện hành. * **FEAT 11.2:** Mọi người dùng có thể xem thông tin đơn vị mình đang công tác và cơ cấu các thành phần đơn vị trực thuộc. * **FEAT 11.3:** Mọi người dùng trong hệ thống có thể đăng ký tham gia khóa học/đào tạo được nhà trường phê duyệt mở. * **FEAT 11.4:** Hệ thống cho phép người dùng xem danh sách các khóa đào tạo đã đăng ký và lịch sử đào tạo đã tham gia. |
| **STRQ 12:** Hệ thống yêu cầu tự động log dấu vết hoạt động người dùng và đảm bảo an ninh (System Logging). | * Phân tách | * **FEAT 12.1:** Hệ thống có khả năng ghi vết tất cả các tác vụ truy cập tài khoản, thay đổi/cập nhật hệ thống hoặc dữ liệu. * **FEAT 12.2:** Quản trị viên có thể truy xuất xem và xuất Audit log (Nhật ký hệ thống) nhằm truy vết hoạt động. |

# III. MÔ HÌNH HOÁ YÊU CẦU

## 3.1. Xác định các Tác nhân (Actors)

Dựa vào các yêu cầu thu thập (STRQ và FEAT), phân tích xác định được các tác nhân (Actors) tham gia vào hệ thống như sau:

1. **Người dùng (Cán bộ / Giảng viên / Nhân viên)**: Là tác nhân sử dụng các chức năng tự phục vụ trong hệ thống như đăng ký học, đổi mật khẩu, xem hồ sơ, xem thông tin đơn vị.
2. **Quản trị viên (Admin)**: Là tác nhân đảm nhiệm quản trị kỹ thuật của hệ thống, thực hiện quản lý tài khoản người dùng, phân quyền truy cập, thiết lập cơ cấu đơn vị tổ chức nhà trường và xem giám sát nhật ký (Audit Log).
3. **Phòng Tổ chức - Cán bộ (TCCB)**: Là tác nhân thực hiện các nghiệp vụ quản lý lõi của hệ thống bao gồm quản lý hồ sơ nhân sự, hợp đồng lao động, bổ nhiệm/điều chuyển, đánh giá khen thưởng/kỷ luật, thiết lập và đánh giá đào tạo, kết hợp việc thiết lập các cấu hình tham chiếu (lương, phụ cấp, hợp đồng).
4. **Phòng Tài chính - Kế toán (TCKT)**: Là tác nhân có nhu cầu tra cứu thông tin nhân sự và xuất các báo cáo, thống kê liên quan đến cơ cấu và biến động nhân sự, hợp đồng, đào tạo.
5. **Hệ thống (System Timer / Auto-Job)**: Tác nhân hệ thống tự động chạy ngầm thực hiện các quy trình động như tự động đăng xuất, tạo mã, khóa tài khoản tự động, đánh dấu hết hiệu lực.

## 3.2. Xác định các Use Case (UCs)

Từ các FEAT đã được phân tách và xác định, chi tiết thành các Use Case (UC) chính cho hệ thống:

> **Ghi chú:** Tổng cộng hệ thống bao gồm **42 Use Case** (UC 4.1 – UC 4.42), được phân nhóm theo chức năng như sau:

**► Nhóm UC Hệ thống & Tài khoản:**

* UC Đăng nhập
* UC Đăng xuất
* UC Đổi mật khẩu
* UC Quản lý tài khoản (Tìm kiếm, Thêm, Sửa, Đổi trạng thái khóa/mở)
* UC Phân quyền tài khoản
* UC Xem nhật ký hệ thống (Audit Log)

**► Nhóm UC Quản lý Cơ cấu tổ chức:**

* UC Quản lý đơn vị tổ chức (Thêm mới đơn vị, Sửa thông tin, Cập nhật trạng thái giải thể/sáp nhập, Xem chi tiết đơn vị)
* UC Điều chuyển nhân sự (Bổ nhiệm nhân sự vào đơn vị, Bãi nhiệm nhân sự khỏi đơn vị)

**► Nhóm UC Danh mục Cấu hình:**

* UC Quản lý danh mục Hệ số lương (Thêm mới, Sửa, Xóa, Thay đổi trạng thái)
* UC Quản lý danh mục Loại phụ cấp (Thêm mới, Sửa, Thay đổi trạng thái)
* UC Quản lý danh mục Loại hợp đồng (Thêm mới, Sửa, Thay đổi trạng thái)

**► Nhóm UC Quản lý Hồ sơ & Nhân sự:**

* UC Tìm kiếm hồ sơ nhân sự
* UC Lọc danh sách hồ sơ nhân sự
* UC Thêm mới Hồ sơ nhân sự
* UC Chỉnh sửa trong chi tiết hồ sơ nhân sự
* UC Xem Chi tiết thông tin hồ sơ nhân sự / In hồ sơ / Xuất Excel
* UC Đánh dấu thôi việc nhân sự
* UC Thêm mới Hợp đồng lao động
* UC Ghi nhận đánh giá khen thưởng/kỷ luật nhân sự

**► Nhóm UC Quản lý Đào tạo:**

* UC Mở khóa đào tạo cho cán bộ giảng viên
* UC Sửa thông tin khóa đào tạo đã mở
* UC Xem chi tiết thông tin khóa đào tạo đã mở
* UC Ghi nhận kết quả đào tạo cho cán bộ giảng viên

**► Nhóm UC Cá nhân (Self-service):**

* UC Xem thông tin trong hồ sơ cá nhân
* UC Xem thông tin chi tiết đơn vị đang công tác
* UC Đăng ký tham gia khóa đào tạo
* UC Xem danh sách các khóa đào tạo đã đăng ký

**► Nhóm UC Báo cáo & Thống kê:**

* UC Xem chi tiết các thống kê nhân sự và báo cáo

## 3.3. Vẽ biểu đồ UCs (UC tổng quát, UC phân rã theo các tác nhân)

### 3.3.1. Biểu đồ Use Case tổng quát (Nguyễn Hồng Phúc)

> **Ghi chú quan hệ giữa các UC:** UC 4.5 (Thêm tài khoản) và UC 4.6 (Sửa tài khoản) **<<include>>** UC 4.7 (Phân quyền) để thực hiện phân quyền vai trò cho tài khoản trong cùng luồng tạo/sửa.

### 3.3.2. Biểu đồ Use Case phân rã theo tác nhân

**a. Phân rã cho Quản trị viên (Admin)**

* **Tác nhân**: Quản trị viên
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Quản lý tài khoản người dùng
  + Phân quyền tài khoản
  + Thay đổi trạng thái tài khoản
  + Nhóm UC Quản lý Đơn vị tổ chức
  + Xem nhật ký hệ thống (Audit Log)
  + Nhóm UC Cá nhân (Self-service): Xem hồ sơ cá nhân, Xem đơn vị công tác, Đăng ký đào tạo, Xem khóa đào tạo đã đăng ký *(kế thừa quyền Người dùng)*

**b. Phân rã cho Phòng Tổ chức - Cán bộ**

* **Tác nhân**: Phòng Tổ chức - Cán bộ
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Nhóm UC Quản lý hồ sơ nhân sự (Thêm/Sửa/Đánh dấu thôi việc/Lọc tìm)
  + Nhóm UC Quản lý hợp đồng (Thêm)
  + Điều chuyển nhân sự (Bổ nhiệm/Bãi nhiệm)
  + Ghi nhận đánh giá (Khen thưởng / Kỷ luật)
  + Nhóm UC Quản lý khóa đào tạo & kết quả
  + Nhóm UC Cấu hình danh mục (lương, phụ cấp, HD)
  + Nhóm UC Quản lý Đơn vị tổ chức (Thêm mới, Sửa thông tin, Thay đổi trạng thái, Xem chi tiết)
  + Xem báo cáo thống kê
  + Nhóm UC Cá nhân (Self-service): Xem hồ sơ cá nhân, Xem đơn vị công tác, Đăng ký đào tạo, Xem khóa đào tạo đã đăng ký *(kế thừa quyền Người dùng)*

**c. Phân rã cho Phòng Tài chính - Kế toán**

* **Tác nhân**: Phòng Tài chính - Kế toán
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Chế độ xem: Tìm kiếm, Xem và Lọc chi tiết hồ sơ nhân sự
  + Xem chi tiết các thống kê
  + Nhóm UC Cá nhân (Self-service): Xem hồ sơ cá nhân, Xem đơn vị công tác, Đăng ký đào tạo, Xem khóa đào tạo đã đăng ký *(kế thừa quyền Người dùng)*

**d. Phân rã cho Người dùng (Cán bộ/Giảng viên/Nhân viên)**

* **Tác nhân**: Người dùng
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Xem hồ sơ cá nhân
  + Xem thông tin chi tiết đơn vị công tác
  + Đăng ký tham gia đào tạo
  + Xem danh sách các khóa đào tạo đã đăng ký

## 3.4. Ma trận truy vết yêu cầu (Traceability Matrix)

| FEAT | UC tương ứng |
|------|-------------|
| FEAT 1.1 | UC 4.1 (Đăng nhập) |
| FEAT 1.2 | UC 4.2 (Đăng xuất) |
| FEAT 1.3 | UC 4.2 A1 (Đăng xuất tự động) |
| FEAT 1.4 | UC 4.3 (Đổi mật khẩu) |
| FEAT 2.1 | UC 4.4 (Tìm kiếm tài khoản người dùng) |
| FEAT 2.2 | UC 4.5 (Thêm mới tài khoản người dùng) |
| FEAT 2.3 | UC 4.6 (Sửa thông tin tài khoản người dùng) |
| FEAT 2.4 | UC 4.7 (Phân quyền tài khoản người dùng) |
| FEAT 2.5 | UC 4.8 (Thay đổi trạng thái cho tài khoản người dùng) |
| FEAT 2.6 | UC 4.8 A2 (Tự động khóa tài khoản) |
| FEAT 3.1 | UC 4.9 (Tạo mới đơn vị tổ chức nhân sự) — cấu trúc cây |
| FEAT 3.2 | UC 4.9 (Tạo mới đơn vị tổ chức nhân sự) |
| FEAT 3.3 | UC 4.10 (Sửa thông tin đơn vị tổ chức nhân sự) |
| FEAT 3.4 | UC 4.11 (Cập nhật trạng thái cho đơn vị tổ chức nhân sự) |
| FEAT 3.5 | UC 4.32 (Xem chi tiết thông tin đơn vị tổ chức nhân sự) |
| FEAT 4.1 | UC 4.30 (Bổ nhiệm và điều chuyển nhân sự cho đơn vị tổ chức nhân sự) |
| FEAT 4.2 | UC 4.31 (Bãi nhiệm nhân sự khỏi đơn vị tổ chức nhân sự) |
| FEAT 5.1 | UC 4.22 (Thêm mới Hợp đồng lao động) |
| FEAT 6.1 | UC 4.29 (Ghi nhận đánh giá cho nhân sự) |
| FEAT 7.1 | UC 4.23 (Tìm kiếm hồ sơ nhân sự) |
| FEAT 7.2 | UC 4.24 (Lọc danh sách hồ sơ nhân sự) |
| FEAT 7.3 | UC 4.25 (Thêm mới Hồ sơ nhân sự) |
| FEAT 7.4 | UC 4.26 (Chỉnh sửa trong chi tiết hồ sơ nhân sự) |
| FEAT 7.5 | UC 4.27 (Đánh dấu thôi việc nhân sự) |
| FEAT 7.6 | UC 4.27 A1 (Thôi việc nhân sự tự động) |
| FEAT 7.7 | UC 4.28 (Xem Chi tiết thông tin hồ sơ nhân sự) |
| FEAT 7.8 | UC 4.28 A1/A2 (In hồ sơ / Xuất Excel) |
| FEAT 8.1 | UC 4.33 (Mở khóa đào tạo cho cán bộ giảng viên) |
| FEAT 8.2 | UC 4.34 (Sửa thông tin khóa đào tạo đã mở) |
| FEAT 8.3 | UC 4.35 (Xem chi tiết thông tin khóa đào tạo đã mở) |
| FEAT 8.4 | UC 4.36 (Ghi nhận kết quả đào tạo của cán bộ giảng viên) |
| FEAT 9.1 | UC 4.12 (Thêm mới danh mục hệ số lương) |
| FEAT 9.2 | UC 4.13 (Sửa danh mục hệ số lương) |
| FEAT 9.3 | UC 4.14 (Xóa danh mục hệ số lương), UC 4.15 (Thay đổi trạng thái danh mục hệ số lương) |
| FEAT 9.4 | UC 4.16 (Thêm mới danh mục loại phụ cấp), UC 4.17 (Sửa danh mục loại phụ cấp), UC 4.18 (Thay đổi trạng thái danh mục loại phụ cấp) |
| FEAT 9.5 | UC 4.19 (Thêm mới danh mục loại hợp đồng), UC 4.20 (Sửa danh mục loại hợp đồng), UC 4.21 (Thay đổi trạng thái danh mục loại hợp đồng) |
| FEAT 10.1 | UC 4.37 (Xem chi tiết các thống kê) |
| FEAT 11.1 | UC 4.38 (Xem các thông tin trong hồ sơ cá nhân của nhân sự) |
| FEAT 11.2 | UC 4.39 (Xem thông tin chi tiết đơn vị đang công tác) |
| FEAT 11.3 | UC 4.40 (Đăng ký tham gia khóa đào tạo) |
| FEAT 11.4 | UC 4.41 (Xem danh sách các khóa đào tạo đã đăng ký) |
| FEAT 12.1 | SUPL Ghi nhật ký (auto logging) |
| FEAT 12.2 | UC 4.42 (Xem nhật ký hệ thống — Audit Log) — truy xuất |

# IV. Luồng sự kiện và các UCs chính

[uc1-10.md](./uc1-10.md)

[uc11-20.md](./uc11-20.md)

[uc21-30.md](./uc21-30.md)

[uc31-42.md](./uc31-42.md)

# V. XÁC ĐỊNH CÁC LỚP, XÂY DỰNG BIỂU ĐỒ LỚP

## 5.1. Xác định các lớp — Biểu đồ lớp Hệ thống HRMS

**Các lớp liệt kê (Enumeration)**

### 5.1.1. VaiTro (Vai trò)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | QUAN\_TRI\_VIEN | enum | Quản trị viên |
| 2 | CAN\_BO\_TCCB | enum | Cán bộ Tổ chức Cán bộ |
| 3 | CAN\_BO\_TCKT | enum | Cán bộ Tài chính Kế toán |
| 4 | CAN\_BO\_NHAN\_SU | enum | Cán bộ / Nhân sự |

### 5.1.2. TrangThaiTaiKhoan (Trạng thái tài khoản)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | DANG\_HOAT\_DONG | enum | Đang hoạt động |
| 2 | BI\_KHOA | enum | Bị khóa |

### 5.1.3. TrangThaiLamViec (Trạng thái làm việc)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | DANG\_CHO\_XET | enum | Đang chờ xét |
| 2 | DANG\_CONG\_TAC | enum | Đang công tác |
| 3 | DA\_THOI\_VIEC | enum | Đã thôi việc |

### 5.1.4. TrangThaiHopDongNS (Trạng thái hợp đồng nhân sự)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | CHUA\_HOP\_DONG | enum | Chưa có hợp đồng |
| 2 | CON\_HIEU\_LUC | enum | Còn hiệu lực |
| 3 | HET\_HIEU\_LUC | enum | Hết hiệu lực |
| 4 | CHO\_GIA\_HAN | enum | Chờ gia hạn |

> **Ghi chú thiết kế – Tự động chuyển trạng thái hợp đồng:** Hệ thống sử dụng bộ hẹn giờ (System Timer / Scheduled Job) để tự động chuyển trạng thái hợp đồng nhân sự từ "Còn hiệu lực" (`CON_HIEU_LUC`) sang "Chờ gia hạn" (`CHO_GIA_HAN`) khi thời gian còn lại của hợp đồng ≤ giá trị `thoiGianChoGiaHan` được cấu hình trong loại hợp đồng tương ứng (xem UC 4.19). Quá trình này chạy định kỳ hàng ngày và không yêu cầu thao tác thủ công từ người dùng.

### 5.1.5. LoaiDonVi (Loại đơn vị)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | HOI\_DONG | enum | Hội đồng |
| 2 | BAN | enum | Ban |
| 3 | KHOA | enum | Khoa |
| 4 | PHONG | enum | Phòng |
| 5 | BO\_MON | enum | Bộ môn |
| 6 | PHONG\_THI\_NGHIEM | enum | Phòng thí nghiệm |
| 7 | TRUNG\_TAM | enum | Trung tâm |

### 5.1.6. TrangThaiDonVi (Trạng thái đơn vị)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | DANG\_HOAT\_DONG | enum | Đang hoạt động |
| 2 | GIAI\_THE | enum | Giải thể |
| 3 | SAP\_NHAP | enum | Sáp nhập |

### 5.1.7. TrangThaiHopDong (Trạng thái hợp đồng)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | CON\_HIEU\_LUC | enum | Còn hiệu lực |
| 2 | HET\_HIEU\_LUC | enum | Hết hiệu lực |

### 5.1.8. TrangThaiDanhMuc (Trạng thái danh mục)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | DANG\_SU\_DUNG | enum | Đang sử dụng |
| 2 | NGUNG\_SU\_DUNG | enum | Ngừng sử dụng |

### 5.1.9. TrangThaiKhoaDaoTao (Trạng thái khóa đào tạo)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | DANG\_MO\_DANG\_KY | enum | Đang mở đăng ký |
| 2 | DANG\_DAO\_TAO | enum | Đang đào tạo |
| 3 | DA\_HOAN\_THANH | enum | Đã hoàn thành |

### 5.1.10. TrangThaiThamGia (Trạng thái tham gia)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | DA\_DANG\_KY | enum | Đã đăng ký |
| 2 | DANG\_HOC | enum | Đang học |
| 3 | HOAN\_THANH | enum | Hoàn thành |
| 4 | KHONG\_DAT | enum | Không đạt |

> **Ghi chú thiết kế – Tự động chuyển trạng thái tham gia:** Khi phòng TCCB chuyển trạng thái khóa đào tạo từ "Đang mở đăng ký" (`DANG_MO_DANG_KY`) sang "Đang đào tạo" (`DANG_DAO_TAO`) thông qua UC 4.34, hệ thống tự động batch-update tất cả bản ghi `DangKyDaoTao` có `trangThaiThamGia = DA_DANG_KY` sang `DANG_HOC`. Quá trình này đảm bảo không còn khoảng trống logic giữa trạng thái "Đã đăng ký" và "Đang học".

**Các lớp thực thể (Entity)**

### 5.1.11. TaiKhoan (Tài khoản)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | maCanBo | String | Mã cán bộ |
| 2 | email | String | Email nhận mật khẩu |
| 3 | matKhau | String | Mật khẩu (đã mã hóa) |
| 4 | vaiTro | VaiTro | Vai trò người dùng |
| 5 | trangThai | TrangThaiTaiKhoan | Trạng thái tài khoản |

### 5.1.12. NhanSu (Nhân sự)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | maCanBo | String | Mã cán bộ |
| 2 | hoTen | String | Họ và tên |
| 3 | ngaySinh | Date | Ngày sinh |
| 4 | gioiTinh | String | Giới tính |
| 5 | soCCCD | String | Số CCCD/CMND |
| 6 | queQuan | String | Quê quán |
| 7 | diaChi | String | Địa chỉ |
| 8 | maSoThue | String | Mã số thuế |
| 9 | soBHXH | String | Số Bảo hiểm xã hội |
| 10 | soBHYT | String | Số Bảo hiểm y tế |
| 11 | email | String | Email |
| 12 | soDienThoai | String | Số điện thoại |
| 13 | anhChanDung | File | Ảnh chân dung |
| 14 | trinhDoVanHoa | String | Trình độ văn hóa |
| 15 | trinhDoDaoTao | String | Trình độ đào tạo |
| 16 | chucDanhNgheNghiep | String | Chức danh nghề nghiệp |
| 17 | chucDanhKhoaHoc | String | Chức danh khoa học (Học hàm) |
| 18 | laNguoiNuocNgoai | Boolean | Là người nước ngoài |
| 19 | trangThaiLamViec | TrangThaiLamViec | Trạng thái làm việc |
| 20 | trangThaiHopDong | TrangThaiHopDongNS | Trạng thái hợp đồng |

### 5.1.13. ThongTinNguoiNuocNgoai (Thông tin người nước ngoài)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | soVisa | String | Số visa |
| 2 | ngayHetHanVisa | Date | Ngày hết hạn visa |
| 3 | soHoChieu | String | Số hộ chiếu |
| 4 | ngayHetHanHoChieu | Date | Ngày hết hạn hộ chiếu |
| 5 | soGiayPhepLaoDong | String | Số giấy phép lao động |
| 6 | ngayHetHanGPLD | Date | Ngày hết hạn GPLD |
| 7 | fileGPLD | File | File giấy phép lao động |

### 5.1.14. ThongTinGiaDinh (Thông tin gia đình)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | moiQuanHe | String | Mối quan hệ |
| 2 | hoTen | String | Họ và tên |
| 3 | thongTinChiTiet | String | Thông tin chi tiết |

### 5.1.15. ThongTinNganHang (Thông tin ngân hàng)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | tenNganHang | String | Tên ngân hàng |
| 2 | soTaiKhoan | String | Số tài khoản |

### 5.1.16. QuaTrinhCongTac (Quá trình công tác)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | noiCongTac | String | Nơi công tác |
| 2 | thoiGianCongTac | String | Thời gian công tác |

### 5.1.17. ThongTinDangDoan (Thông tin Đảng / Đoàn)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | ngayVaoDoan | Date | Ngày vào Đoàn |
| 2 | ngayVaoDang | Date | Ngày vào Đảng |
| 3 | thongTinChiTiet | String | Thông tin chi tiết |

### 5.1.18. BangCap (Bằng cấp)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | tenBang | String | Tên bằng cấp |
| 2 | truong | String | Trường |
| 3 | nganh | String | Ngành |
| 4 | namTotNghiep | Int | Năm tốt nghiệp |
| 5 | xepLoai | String | Xếp loại |
| 6 | filePDF | File | File bằng cấp (PDF) |

### 5.1.19. ChungChi (Chứng chỉ)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | tenChungChi | String | Tên chứng chỉ |
| 2 | noiCap | String | Nơi cấp |
| 3 | ngayCap | Date | Ngày cấp |
| 4 | ngayHetHan | Date | Ngày hết hạn |
| 5 | filePDF | File | File chứng chỉ (PDF) |

### 5.1.20. DonViToChuc (Đơn vị tổ chức)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | maDonVi | String | Mã đơn vị |
| 2 | tenDonVi | String | Tên đơn vị |
| 3 | loaiDonVi | LoaiDonVi | Loại đơn vị |
| 4 | ngayThanhLap | Date | Ngày thành lập |
| 5 | diaChi | String | Địa chỉ |
| 6 | diaChiVanPhong | String | Địa chỉ văn phòng |
| 7 | email | String | Email |
| 8 | soDienThoai | String | Số điện thoại |
| 9 | website | String | Website |
| 10 | laDonViNut | Boolean | Là đơn vị nút (lá) |
| 11 | trangThai | TrangThaiDonVi | Trạng thái đơn vị |

### 5.1.21. QuyetDinhDonVi (Quyết định đơn vị)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | ngayHieuLuc | Date | Ngày hiệu lực |
| 2 | soQuyetDinh | String | Số quyết định |
| 3 | ngayQuyetDinh | Date | Ngày quyết định |
| 4 | fileDinhKem | File | File đính kèm |
| 5 | lyDo | String | Lý do |
| 6 | loaiSuKien | String | Loại sự kiện (Giải thể/Sáp nhập) |

### 5.1.22. BoNhiem (Bổ nhiệm)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | chucVu | String | Chức vụ |
| 2 | ngayBatDau | Date | Ngày bắt đầu |

### 5.1.23. HeSoLuong (Hệ số lương)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | ngachVienChuc | String | Ngạch viên chức |
| 2 | bacLuong | Int | Bậc lương |
| 3 | heSoLuong | Double | Hệ số lương |
| 4 | trangThai | TrangThaiDanhMuc | Trạng thái danh mục |

### 5.1.24. LoaiPhuCap (Loại phụ cấp)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | tenLoaiPhuCap | String | Tên loại phụ cấp |
| 2 | moTa | String | Mô tả |
| 3 | cachTinh | String | Cách tính phụ cấp |
| 4 | trangThai | TrangThaiDanhMuc | Trạng thái danh mục |

### 5.1.25. LoaiHopDong (Loại hợp đồng)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | tenLoaiHopDong | String | Tên loại hợp đồng |
| 2 | soThangToiThieu | Int | Số tháng tối thiểu |
| 3 | soThangToiDa | Int | Số tháng tối đa |
| 4 | soLanGiaHanToiDa | Int | Số lần gia hạn tối đa |
| 5 | thoiGianChoGiaHan | Int | Thời gian chờ gia hạn (ngày) |
| 6 | trangThai | TrangThaiDanhMuc | Trạng thái danh mục |

### 5.1.26. HopDongLaoDong (Hợp đồng lao động)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | soHopDong | String | Số hợp đồng |
| 2 | ngayKy | Date | Ngày ký hợp đồng |
| 3 | ngayHieuLuc | Date | Ngày hiệu lực |
| 4 | ngayHetHan | Date | Ngày hết hạn |
| 5 | donViCongTac | String | Đơn vị công tác |
| 6 | noiDung | String | Nội dung hợp đồng |
| 7 | filePDF | File | File hợp đồng (PDF) |
| 8 | trangThai | TrangThaiHopDong | Trạng thái hợp đồng |

### 5.1.27. PhuLucHopDong (Phụ lục hợp đồng)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | ngayHieuLuc | Date | Ngày hiệu lực |
| 2 | dieuKhoanBoSung | String | Điều khoản bổ sung |
| 3 | quyDinhMoi | String | Quy định mới |
| 4 | luuYQuanTrong | String | Lưu ý quan trọng |

### 5.1.28. DanhGia (Đánh giá) — *<>*

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | ngayQuyetDinh | Date | Ngày quyết định |
| 2 | dangHoatDong | Boolean | Đang hoạt động |

### 5.1.29. KhenThuong (Khen thưởng) — *kế thừa DanhGia*

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | loaiKhenThuong | String | Loại khen thưởng |
| 2 | tenKhenThuong | String | Tên khen thưởng |
| 3 | soQuyetDinh | String | Số quyết định |
| 4 | noiDung | String | Nội dung khen thưởng |
| 5 | soTienThuong | Double | Số tiền thưởng |

### 5.1.30. KyLuat (Kỷ luật) — *kế thừa DanhGia*

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | loaiKyLuat | String | Loại kỷ luật |
| 2 | tenKyLuat | String | Tên kỷ luật |
| 3 | lyDo | String | Lý do kỷ luật |
| 4 | hinhThucXuLy | String | Hình thức xử lý |

### 5.1.31. KhoaDaoTao (Khóa đào tạo)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | tenKhoaDaoTao | String | Tên khóa đào tạo |
| 2 | loaiKhoaDaoTao | String | Loại khóa đào tạo |
| 3 | thoiGianBatDau | Date | Thời gian bắt đầu |
| 4 | thoiGianKetThuc | Date | Thời gian kết thúc |
| 5 | diaDiem | String | Địa điểm |
| 6 | kinhPhi | Double | Kinh phí |
| 7 | camKetSauDaoTao | String | Cam kết sau đào tạo |
| 8 | tenChungChi | String | Tên chứng chỉ |
| 9 | loaiChungChi | String | Loại chứng chỉ |
| 10 | thoiGianMoDangKy\_Tu | Date | Thời gian mở đăng ký (từ) |
| 11 | thoiGianMoDangKy\_Den | Date | Thời gian mở đăng ký (đến) |
| 12 | gioiHanSoNguoi | Int | Giới hạn số người |
| 13 | trangThai | TrangThaiKhoaDaoTao | Trạng thái khóa đào tạo |

### 5.1.32. DangKyDaoTao (Đăng ký đào tạo)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | thoiDiemDangKy | Date | Thời điểm đăng ký |
| 2 | trangThaiThamGia | TrangThaiThamGia | Trạng thái tham gia |
| 3 | ngayHoanThanh | Date | Ngày hoàn thành |
| 4 | fileChungChi | File | File chứng chỉ |

### 5.1.33. NhatKyHeThong (Nhật ký hệ thống)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
| --- | --- | --- | --- |
| 1 | thoiGian | DateTime | Thời gian ghi nhật ký |
| 2 | taiKhoan | String | Tài khoản thực hiện |
| 3 | hoTen | String | Họ tên người thực hiện |
| 4 | vaiTro | String | Vai trò người thực hiện |
| 5 | loaiHanhDong | String | Loại hành động |
| 6 | doiTuong | String | Đối tượng |
| 7 | maDoiTuong | String | Mã đối tượng |
| 8 | moTaChiTiet | String | Mô tả chi tiết |
| 9 | diaChiIP | String | Địa chỉ IP |

**Quan hệ giữa các lớp**

| STT | Lớp nguồn | Quan hệ | Lớp đích | Mô tả |
| --- | --- | --- | --- | --- |
| 1 | TaiKhoan | 1 → 1 | NhanSu | Một tài khoản liên kết một nhân sự |
| 2 | NhanSu | 1 ◆ 0..1 | ThongTinNguoiNuocNgoai | Nhân sự có tối đa một thông tin người nước ngoài |
| 3 | NhanSu | 1 ◆ 0..\* | ThongTinGiaDinh | Nhân sự có nhiều thông tin gia đình |
| 4 | NhanSu | 1 ◆ 1 | ThongTinNganHang | Nhân sự có một tài khoản ngân hàng |
| 5 | NhanSu | 1 ◆ 0..\* | QuaTrinhCongTac | Nhân sự có nhiều quá trình công tác |
| 6 | NhanSu | 1 ◆ 0..1 | ThongTinDangDoan | Nhân sự có tối đa một thông tin Đảng/Đoàn |
| 7 | NhanSu | 1 ◆ 0..\* | BangCap | Nhân sự có nhiều bằng cấp |
| 8 | NhanSu | 1 ◆ 0..\* | ChungChi | Nhân sự có nhiều chứng chỉ |
| 9 | NhanSu | 0..\* → 0..1 | HeSoLuong | Nhân sự áp dụng một hệ số lương |
| 10 | NhanSu | 0..\* → 0..\* | LoaiPhuCap | Nhân sự hưởng nhiều loại phụ cấp |
| 11 | NhanSu | 1 ◆ 0..\* | HopDongLaoDong | Nhân sự ký nhiều hợp đồng |
| 12 | HopDongLaoDong | 0..\* → 1 | LoaiHopDong | Hợp đồng thuộc một loại hợp đồng |
| 13 | HopDongLaoDong | 1 ◆ 0..\* | PhuLucHopDong | Hợp đồng có nhiều phụ lục |
| 14 | DanhGia | ◁— | KhenThuong | KhenThuong kế thừa DanhGia |
| 15 | DanhGia | ◁— | KyLuat | KyLuat kế thừa DanhGia |
| 16 | NhanSu | 1 ◆ 0..\* | DanhGia | Nhân sự nhận nhiều đánh giá |
| 17 | DonViToChuc | 0..1 ◇ 0..\* | DonViToChuc | Đơn vị cha chứa nhiều đơn vị con |
| 18 | DonViToChuc | 1 ◆ 0..\* | QuyetDinhDonVi | Đơn vị có nhiều quyết định |
| 19 | BoNhiem | 0..\* → 1 | NhanSu | Bổ nhiệm cho nhân sự |
| 20 | BoNhiem | 0..\* → 1 | DonViToChuc | Bổ nhiệm tại đơn vị |
| 21 | DangKyDaoTao | 0..\* → 1 | NhanSu | Người đăng ký đào tạo |
| 22 | DangKyDaoTao | 0..\* → 1 | KhoaDaoTao | Đăng ký khóa đào tạo |
| 23 | TaiKhoan | 1 → 0..\* | NhatKyHeThong | Tài khoản tạo nhiều nhật ký |

## 5.2. Xây dựng biểu đồ lớp

![Image: image_007](./system-spec_images/image_007.png)