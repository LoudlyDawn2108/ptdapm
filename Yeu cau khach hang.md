# **I. PHÂN TÍCH YÊU CẦU KHÁCH HÀNG** {#i.-phân-tích-yêu-cầu-khách-hàng}

## **1\. Bản kế hoạch quản lý yêu cầu (RMP)** {#1.-bản-kế-hoạch-quản-lý-yêu-cầu-(rmp)}

### **1.1. Giới thiệu** {#1.1.-giới-thiệu}

#### ***1.1.1. Phạm vi áp dụng*** {#1.1.1.-phạm-vi-áp-dụng}

Tài liệu Kế hoạch Quản lý Yêu cầu (Requirements Management Plan – RMP) này được xây dựng nhằm xác định các phương pháp, quy trình và công cụ được sử dụng để quản lý các yêu cầu của Hệ thống Quản lý Nhân sự (Human Resource Management System – HRMS) phục vụ Trường Đại học Thủy Lợi.  
Tài liệu đóng vai trò là cơ sở để:

1. Định hướng hoạt động thu thập, phân tích, đặc tả và quản lý yêu cầu hệ thống;  
2. Đảm bảo các yêu cầu được xác định rõ ràng, nhất quán và có khả năng truy xuất nguồn gốc  
3. Hỗ trợ kiểm soát và quản lý các thay đổi yêu cầu trong suốt vòng đời phát triển hệ thống;  
4. Làm tài liệu tham chiếu cho các giai đoạn thiết kế, phát triển, kiểm thử và nghiệm thu hệ thống

#### ***1.1.2. Phạm vi áp dụng*** {#1.1.2.-phạm-vi-áp-dụng}

Bản RMP này áp dụng cho toàn bộ các yêu cầu của hệ thống HRMS được phát triển nhằm phục vụ công tác quản lý nhân sự tại **Trường Đại học Thủy Lợi**, bao gồm các đơn vị đào tạo, đơn vị nghiên cứu khoa học, các phòng ban chức năng và các cơ sở trực thuộc nhà trường.

### **1.2. Công cụ sử dụng và các kiểu yêu cầu** {#1.2.-công-cụ-sử-dụng-và-các-kiểu-yêu-cầu}

#### ***1.2.1. Các công cụ sử dụng quản lý yêu cầu*** {#1.2.1.-các-công-cụ-sử-dụng-quản-lý-yêu-cầu}

| STT | Công cụ | Mục đích sử dụng |
| ----- | ----- | ----- |
| 1 | Microsoft Word | Soạn thảo và chỉnh sửa các tài liệu quản lý yêu cầu như RMP, SRS |
| 2 | StarUML/ Draw.io | Mô hình hóa tiến trình công việc qua các sơ đồ GANTT, đường Găng.  Mô hình hóa hệ thống thông qua các sơ đồ Use Case, các sơ đồ UML liên quan. |
| 3 | Discord / Họp nhóm trực tiếp | Trao đổi thông tin, thảo luận và xác nhận yêu cầu giữa các thành viên trong nhóm và các bên liên quan |

#### ***1.2.2. Các kiểu yêu cầu cho dự án*** {#1.2.2.-các-kiểu-yêu-cầu-cho-dự-án}

| Loại yêu cầu | Loại tài liệu | Mô tả |
| :---- | :---- | :---- |
| Yêu cầu của các bên liên quan (STRQ) | Yêu cầu của các bên liên quan (STR) | Mô tả các nhu cầu, mong đợi và mục tiêu chính của người dùng và các bên liên quan đối với hệ thống. |
| Yêu cầu tính năng (FEAT) | Tài liệu tầm nhìn (VIS) | Mô tả các điều kiện, khả năng và các tính năng tổng quát mà hệ thống cần cung cấp. |
| Ca sử dụng (UC) / Kịch bản (SC) | Đặc tả ca sử dụng (UCS) | Mô tả chi tiết các ca sử dụng và kịch bản, phản ánh đầy đủ các yêu cầu chức năng của hệ thống. |
| Yêu cầu bổ sung (SUPL) | Đặc tả bổ sung (SS) | Mô tả các yêu cầu phi chức năng và các ràng buộc của hệ thống không được thể hiện trong mô hình ca sử dụng. |

#### ***1.2.3. Loại tài liệu yêu cầu cho dự án*** {#1.2.3.-loại-tài-liệu-yêu-cầu-cho-dự-án}

| Loại tài liệu | Mô tả | Loại yêu cầu mặc định |
| :---- | :---- | :---- |
| Kế hoạch quản lý yêu cầu (RMP) | Tài liệu mô tả phương pháp, quy trình và công cụ quản lý yêu cầu của dự án. | Không áp dụng |
| Yêu cầu của các bên liên quan (STR) | Tập hợp các yêu cầu nghiệp vụ và mong đợi chính từ các bên liên quan. | Yêu cầu bên liên quan (STRQ) |
| Tài liệu tầm nhìn (VIS) | Mô tả tổng quan hệ thống, phạm vi và các mục tiêu chính của dự án. | Yêu cầu tính năng (FEAT) |
| Đặc tả ca sử dụng (UCS) | Mô tả chi tiết các ca sử dụng và cách người dùng tương tác với hệ thống. | Ca sử dụng (UC) và Kịch bản (SC) |
| Đặc tả bổ sung (SS) | Mô tả các yêu cầu phi chức năng và các ràng buộc của hệ thống. | Yêu cầu bổ sung (SUPL) |

### **1.3. Các nhân tố tham gia dự án phần mềm** {#1.3.-các-nhân-tố-tham-gia-dự-án-phần-mềm}

| Team | Vai trò | Số lượng | Nhiệm vụ chính |
| :---- | :---- | :---- | :---- |
| Team 1 | BA / PM | 2 | Phân tích yêu cầu, lập kế hoạch và quản lý tiến độ dự án |
| Team 2 | SA / Design | 4 | Thiết kế kiến trúc hệ thống, cơ sở dữ liệu và giao diện người dùng (UI/UX) |
| Team 3 | Dev | 4 | Phát triển hệ thống Backend và Frontend theo thiết kế |
| Team 4 | Test | 2 | Xây dựng và thực hiện kiểm thử, đảm bảo chất lượng phần mềm |
| Team 5 | Deploy | 2 | Triển khai hệ thống, cấu hình môi trường và thiết lập quy trình CI/CD |
| **Tổng** |  | **14** |  |

### **1.4. Bảng liên lạc với các nhân tố chính (Stakeholder)** {#1.4.-bảng-liên-lạc-với-các-nhân-tố-chính-(stakeholder)}

#### ***1.4.1. Các nhân tố chính*** {#1.4.1.-các-nhân-tố-chính}

| STT | Nhân tố chính | Vai trò trong dự án | Đơn vị | Trách nhiệm chính | Hình thức liên lạc |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | Ban Giám hiệu | Nhà tài trợ / Phê duyệt | Ban Giám hiệu | Phê duyệt yêu cầu, xem xét báo cáo tổng hợp | Họp định kỳ, báo cáo |
| 2 | Phòng Tổ chức – Cán bộ | Khách hàng nghiệp vụ | Phòng TCCB | Cung cấp yêu cầu quản lý hồ sơ nhân sự | Họp, email |
| 3 | Phòng Tài chính – Kế toán | Khách hàng nghiệp vụ | Phòng TCKT | Cung cấp yêu cầu về lương, phụ cấp | Họp, trao đổi trực tiếp |
| 4 | Phòng CNTT | Đơn vị kỹ thuật | Phòng CNTT | Tư vấn kỹ thuật, hạ tầng, bảo mật | Họp kỹ thuật |
| 5 | Trưởng khoa / phòng | Người sử dụng chính | Các khoa / phòng | Góp ý, xác nhận yêu cầu quản lý nhân sự đơn vị | Họp, khảo sát |
| 6 | Nhóm phát triển | Thực hiện dự án | Nhóm dự án | Phân tích, thiết kế và triển khai hệ thống | Họp nhóm, công cụ trực tuyến |

#### ***1.4.2. Các bên liên quan khác*** {#1.4.2.-các-bên-liên-quan-khác}

| STT | Bên liên quan | Vai trò / Mối liên hệ |
| :---- | :---- | :---- |
| 1 | Bộ Nông nghiệp và Môi trường | Cơ quan quản lý nhà nước, ban hành các quy định liên quan đến nhân sự và chế độ |
| 2 | Bộ Giáo dục và Đào tạo | Cơ quan quản lý chuyên ngành giáo dục, quy định tiêu chuẩn và chính sách đối với cán bộ, giảng viên |
| 3 | Cơ quan Bảo hiểm xã hội | Đơn vị phối hợp trong quản lý bảo hiểm, chế độ cho người lao động |
| 4 | Cơ quan Thuế | Đơn vị phối hợp trong quản lý nghĩa vụ thuế thu nhập cá nhân |

## **2\. Tài liệu yêu cầu người dùng (STR)** {#2.-tài-liệu-yêu-cầu-người-dùng-(str)}

### **2.1. Mục đích** {#2.1.-mục-đích}

Tài liệu này nhằm thu thập và mô tả các nhu cầu, mong đợi và yêu cầu chính của các bên liên quan đối với Hệ thống Quản lý Nhân sự (HRMS) của Trường Đại học Thủy Lợi. Tài liệu đóng vai trò làm cơ sở cho việc phân tích, xác định yêu cầu phần mềm và hỗ trợ các giai đoạn thiết kế, phát triển và kiểm thử hệ thống.

### **2.2. Phạm vi** {#2.2.-phạm-vi}

Tài liệu áp dụng cho toàn bộ các yêu cầu của các bên liên quan tham gia vào hệ thống HRMS, bao gồm Ban Giám hiệu, các phòng ban chức năng, các khoa, cán bộ, giảng viên và nhân viên của Trường Đại học Thủy Lợi. Nội dung tập trung vào các yêu cầu nghiệp vụ và mong đợi ở mức tổng quát, không đi sâu vào thiết kế hay chi tiết kỹ thuật.

### **2.3. Yêu cầu thu thập từ Stakeholder** {#2.3.-yêu-cầu-thu-thập-từ-stakeholder}

| Stakeholder | Phương pháp thu thập yêu cầu | Yêu cầu (STRQ) |
| :---- | :---- | :---- |
|  Phòng CNTT | Khảo sát | STRQ 1: Cần hệ thống cho phép đăng nhập, đăng xuất, đổi mật khẩu như một hệ thống phần mềm nhân sự khác tài khoản có phân quyền nhiều tài khoản.  STRQ 2: Quản trị viên là người có thể quản lý tài khoản như thêm, sửa hoặc khóa tài khoản |
| Ban giám hiệu | Phỏng vấn | STRQ 3: Quản trị viên có thể quản lý cơ cấu tổ chức, thêm vào các đơn vị mới, chỉnh sửa thông tin hoặc thông báo giải thể, sáp nhập đơn vị STRQ 4: Phòng nhân sự có thể tạo hợp đồng lao động STRQ 5: Phòng nhân sự có thể ghi nhận đánh giá nhân sự |
| Phòng Tổ chức Cán bộ | Quan sát, mô phỏng nhiệm vụ | STRQ 6: Phòng nhân sự muốn quản lý hồ sơ nhân sự như thêm, sửa hồ sơ và cho phép đánh dấu thôi việc hồ sơ nếu nhân sự không làm có thêm phương pháp tìm kiếm và lọc để tiện quản lý. STRQ 7: Phòng nhân sự cần hệ thống cho phép mở khóa đào tạo cho nhân sự |
| Nhóm phát triển | Phân tích tài liệu hiện có | STRQ 8: Phòng nhân sự có thể cấu hình lương, loại phụ cấp, loại hợp đồng |
| Phòng Tài chính Kê Toán | Phỏng vấn | STRQ 9: Phòng tài chính muốn thống kê về nhân sự |
| Trưởng Khoa/ Phòng | Hội thảo yêu cầu | STRQ 10 Người dùng phần mềm có thể xem hồ sơ cá nhân, xem thông tin đơn vị đang công tác STRQ 11: Người dùng phần mềm có thể đăng ký khóa học được mở, xem các khóa học đã đăng ký |

#### Chú thích phương pháp thu thập yêu cầu {#chú-thích-phương-pháp-thu-thập-yêu-cầu}

| Phương pháp | Mô tả |
| :---- | :---- |
| **Phỏng vấn** | Thu thập trực tiếp từ các cuộc phỏng vấn với stakeholders |
| **Khảo sát** | Thu thập qua bảng hỏi, khảo sát ý kiến người dùng |
| **Hội thảo yêu cầu** | Thu thập qua các buổi họp nhóm, thảo luận với nhiều stakeholders |
| **Phân tích tài liệu hiện có** | Thu thập từ các văn bản pháp lý, quy định, tài liệu nghiệp vụ hiện có |
| **Quan sát và mô phỏng nhiệm vụ** | Tham khảo từ các hệ thống tương tự, tiêu chuẩn ngành |

## **3\. Tài liệu đặc trưng (VIS)** {#3.-tài-liệu-đặc-trưng-(vis)}

### **3.1. Mục đích** {#3.1.-mục-đích}

Tài liệu này định nghĩa tầm nhìn và phạm vi cho dự án Hệ thống Quản lý Nhân sự (HRMS) của Trường Đại học Thủy lợi. Nó cung cấp một cái nhìn tổng quan về nhu cầu kinh doanh, các bên liên quan, và các tính năng cốt lõi của giải pháp, làm cơ sở chung cho đội ngũ phát triển và các bên liên quan (Stakeholders).

### **3.2. Phạm vi** {#3.2.-phạm-vi}

Hệ thống tập trung vào việc quản lý toàn diện vòng đời nhân sự của nhà trường được các stakeholder đề xuất, thay thế cho các quy trình thủ công rời rạc hiện tại.  
	Trong phạm vi:

1. Quản lý hồ sơ nhân sự toàn diện (cán bộ, giảng viên, nhân viên)  
2. Quản lý hợp đồng lao động  
3. Quản lý cơ cấu tổ chức (Khoa/Viện/Bộ môn) và lịch sử biến động cơ bản  
4. Quản lý đào tạo và phát triển  
5. Cấu hình tham số nghiệp vụ (lương, phụ cấp, hợp đồng)  
6. Quản lý nhân sự (bổ nhiệm, miễn nhiệm) trong cơ cấu tổ chức  
7. Cổng thông tin tự phục vụ cho nhân viên  
8. Báo cáo và thống kê nhân sự  
   

### **3.3. Tính năng hệ thống** {#3.3.-tính-năng-hệ-thống}

| Yêu cầu (STRQ) | Kỹ thuật xác định FEAT | Tính năng (FEAT) |
| :---- | :---- | :---- |
| STRQ 1: Cần hệ thống cho phép đăng nhập, đăng xuất, đổi mật khẩu như một hệ thống phần mềm nhân sự khác tài khoản có phân quyền nhiều tài khoản. | Phân tách Làm cho đầy đủ   | FEAT 1.1: Mọi người dùng có thể đăng nhập bằng tài khoản. FEAT 1.2: Mọi người dùng có thể đăng xuất khỏi tài khoản đang sử dụng. FEAT 1.3: Hệ thống tự đống đăng xuất khỏi phiên làm việc nếu người dùng không thao tác với trang web trong 30 phút. FEAT 1.4: Mọi người dùng có thể đổi mật khẩu tài khoản đang sử dụng. |
| STRQ 2: Quản trị viên là người có thể quản lý tài khoản như thêm, sửa hoặc khóa tài khoản | Phân tách Thêm chi tiết Làm cho đầy đủ | FEAT 2.1: Hệ thống cho phép quản trị viên có thể tìm kiếm tài khoản người dùng FEAT 2.2: Hệ thống cho phép quản trị viên có thể thêm mới tài khoản người dùng Feat 2.3: Hệ thống cho phép quản trị viên có thể sửa tài khoản người dùng FEAT 2.4: Hệ thống cho phép quản trị viên có thể thay đổi trạng thái của tài khoản người dùng (Trạng thái: Khóa/ Mở khóa) FEAT 2.5: Hệ thống có thể tự động khóa tài khoản của nhân sự đã thôi việc |
| STRQ 3: Quản trị viên có thể quản lý cơ cấu tổ chức, thêm vào các đơn vị mới, chỉnh sửa thông tin hoặc thông báo giải thể, sáp nhập đơn vị | Phân tách Làm cho đầy đủ Thêm chi tiết Sửa chữa | FEAT 3.1: Hệ thống cung cấp cơ cấu tổ chức phân cấp đơn vị theo dạng cha-con có gốc là trường Đại học Thủy Lợi. FEAT 3.2: Hệ thống cho phép quản trị viên thêm mới đơn vị tổ chức nhân sự FEAT 3.3: Hệ thống cho phép quản trị viên sửa thông tin đơn vị tổ chức nhân sự FEAT 3.4: Hệ thống cho phép quản trị viên thay đổi trạng thái của đơn vị tổ chức nhân sự (Trạng thái: Giải thể /Sáp nhập) FEAT 3.5: Hệ thống cho phép phòng nhân sự bổ nhiệm nhân sự vào một đơn vị tổ chức nhân sự FEAT 3.6: Hệ thống cho phép phòng nhân sự bãi nhiệm nhân sự khỏi một đơn vị tổ chức nhân sự FEAT 3.7: Hệ thống cho phép phòng nhân sự và quản trị viên xem chi tiết thông tin đơn vị tổ chức nhân sự |
| STRQ 4: Phòng nhân sự có thể tạo hợp đồng lao động | Thêm chi tiết | FEAT 4.1: Hệ thống cho phép phòng nhân sự tạo hợp đồng cho nhân sự không có hợp đồng hoặc cần gia hạn hợp đồng. |
| STRQ 5: Phòng nhân sự có thể ghi nhận đánh giá nhân sự | Sao chép | FEAT 5.1: Hệ thống cho phép phòng nhân sự ghi đánh giá cho nhân sự (Loại đánh giá: Khen thưởng/ Kỷ luật) |
| STRQ 6: Phòng nhân sự muốn quản lý hồ sơ nhân sự như thêm, sửa hồ sơ và cho phép đánh dấu thôi việc hồ sơ nếu nhân sự không làm có thêm phương pháp tìm kiếm và lọc để tiện quản lý.   | Phân tách Làm cho rõ ràng Thêm chi tiết | FEAT 6.1: Hệ thống cho phép phòng nhân sự tìm kiếm hồ sơ nhân sự FEAT 6.2: Hệ thống cho phép phòng nhân sự lọc hồ sơ nhân sự FEAT 6.3: Hệ thống cho phép phòng nhân sự thêm mới hồ sơ nhân sự FEAT 6.4: Hệ thống cho phép phòng nhân sự chỉnh sửa hồ sơ nhân sự FEAT 6.5: Hệ thống cho phép phòng nhân sự đánh dấu thôi việc nhân sự FEAT 6.6: Hệ thống có thể tự động đánh dấu thôi việc nhân sự nếu hợp đồng hết hạn quá thời gian cho phép của loại hợp đồng FEAT 6.7: Hệ thống cho phép phòng nhân sự và phòng tài chính có thể xem chi tiết hồ sơ nhân sự FEAT 6.8: Hệ thống cho phép phòng nhân sự và phòng tài chính có thể in hồ sơ nhân sự |
| STRQ 7: Phòng nhân sự cần hệ thống cho phép mở khóa đào tạo cho nhân sự | Phân tách Làm cho đầy đủ | FEAT 7.1: Hệ thống cho phép phòng nhân sự mở khóa đào tạo cho cán bộ FEAT 7.2: Hệ thống cho phép phòng nhân sự chỉnh sửa khóa đào tạo đã mở cho cán bộ FEAT 7.3: Hệ thống cho phép phòng nhân sự xem thông tin khóa đào tạo đã mở cho cán bộ FEAT 7.4: Hệ thống cho phép phòng nhân sự ghi nhận kết quả đánh giá cho cán bộ đã tham gia |
| STRQ 8: Phòng nhân sự có thể cấu hình lương, loại phụ cấp, loại hợp đồng | Phân tách Làm cho đầy đủ | **FEAT 8.1**: Hệ thống cho phép phòng nhân sự thêm mới hệ số lương (Hệ số lương được thêm sẽ được dùng để làm thông tin cho hồ sơ nhân sự) <br> **FEAT 8.2**: Hệ thống cho phép phòng nhân sự xóa hệ số lương khi không được hồ sơ nào sử dụng <br> **FEAT 8.3**: Hệ thống cho phép phòng nhân sự sửa thông tin hệ số lương <br> **FEAT 8.4**: Hệ thống cho phép phòng nhân sự ngừng sử dụng hệ số lương (Hệ số lương bị đánh dấu ngừng sử dụng sẽ không được hồ sơ mới sử dụng) <br> **FEAT 8.5**: Hệ thống cho phép phòng nhân sự thêm mới loại phụ cấp (Loại phụ cấp được thêm sẽ được dùng để làm thông tin cho hồ sơ nhân sự) <br> **FEAT 8.6**: Hệ thống cho phép phòng nhân sự sửa loại phụ cấp <br> **FEAT 8.7**: Hệ thống cho phép phòng nhân sự ngừng sử dụng loại phụ cấp (Loại phụ cấp bị đánh dấu ngừng sử dụng sẽ không được hồ sơ mới sử dụng) <br> **FEAT 8.8**: Hệ thống cho phép phòng nhân sự thêm mới loại hợp đồng (Loại hợp đồng được thêm sẽ được dùng để làm thông tin cho hợp đồng) <br> **FEAT 8.9**: Hệ thống cho phép phòng nhân sự sửa loại hợp đồng <br> **FEAT 8.10**: Hệ thống cho phép phòng nhân sự ngừng sử dụng loại hợp đồng (Loại hợp đồng bị đánh dấu ngừng sử dụng sẽ không được hợp đồng mới sử dụng) |
| STRQ 9: Phòng tài chính muốn thống kê về nhân sự   | Thêm các chi tiết | **FEAT 9.1**: Hệ thống cho phép phòng nhân sự và phòng tài chính xem các thống kê nhân sự: thống kê tổng quan nhân sự, biến động nhân sự, cơ cấu nhân sự theo đơn vị, đánh giá của cán bộ với khóa đào tạo, hợp đồng. |
| STRQ 10 Người dùng phần mềm có thể xem hồ sơ cá nhân, xem thông tin đơn vị đang công tác | Phân tách | **FEAT 10.1**: Mọi người dùng trong hệ thống có thể xem thông tin cá nhân của mình <br> **FEAT 10.2**: Mọi người dùng có thể xem thông tin đơn vị mình đang công tác |
| STRQ 11: Người dùng phần mềm có thể đăng ký khóa học được mở, xem các khóa học đã đăng ký | Phân tách | FEAT 11.1: Mọi người dùng trong hệ thống có thể đăng ký khóa đào tạo FEAT 11.2: Mọi người dùng có thể đăng ký khóa đào tạo đã đăng ký |

### **3.4. Ràng buộc và yêu cầu chất lượng** {#3.4.-ràng-buộc-và-yêu-cầu-chất-lượng}

#### ***3.4.1. Ràng buộc*** {#3.4.1.-ràng-buộc}

1. **Hạ tầng:** Hệ thống phải vận hành trên hạ tầng máy chủ nội bộ (On-premise) hiện có của Trường Đại học Thủy lợi.  
2. **Pháp lý:** Tuân thủ tuyệt đối Bộ Luật Lao động 2019, Luật Viên chức và các quy định về bảo mật dữ liệu cá nhân.  
3. **Tích hợp:** Phải có khả năng kết nối (API hoặc Excel Export/Import) với phần mềm Kế toán và Đào tạo hiện có.  
4. **Ngôn ngữ:** Giao diện và tài liệu 100% Tiếng Việt.

#### ***3.4.2. Yêu cầu chất lượng*** {#3.4.2.-yêu-cầu-chất-lượng}

1. **Hiệu năng:** Hỗ trợ tối thiểu 500 người dùng đồng thời; Thời gian phản hồi trang thông thường dưới 2 giây.  
2. **Khả dụng:** Đảm bảo hoạt động 99.5% trong giờ hành chính. Sao lưu dữ liệu tự động hàng ngày.

