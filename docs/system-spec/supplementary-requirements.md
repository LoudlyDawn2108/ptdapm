# ĐẶC TẢ YÊU CẦU BỔ SUNG (Supplementary Requirements Specification)

## Hệ thống Quản lý Nhân sự (HRMS) — Trường Đại học Thủy Lợi

> **Mã tài liệu:** HRMS-SUPL-001
> **Ngày lập:** 13/03/2026
> **Phiên bản:** 1.0
> **Tham chiếu:** Kế hoạch Quản lý Yêu cầu (RMP), Đặc tả Ca sử dụng (UCS)

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Danh sách yêu cầu bổ sung / yêu cầu phi chức năng](#2-danh-sách-yêu-cầu-bổ-sung--yêu-cầu-phi-chức-năng)
3. [Thiết lập độ đo và tiêu chuẩn đáp ứng](#3-thiết-lập-độ-đo-và-tiêu-chuẩn-đáp-ứng)
4. [Ma trận truy vết NFR → FEAT/UC](#4-ma-trận-truy-vết-nfr--featuc)
5. [Phân tích Softgoals và Trade-offs](#5-phân-tích-softgoals-và-trade-offs)

---

## 1. Giới thiệu

### 1.1. Mục đích

Tài liệu này mô tả chi tiết các **yêu cầu bổ sung (Supplementary Requirements)** và **yêu cầu phi chức năng (Non-Functional Requirements - NFR)** của Hệ thống Quản lý Nhân sự (HRMS) phục vụ Trường Đại học Thủy Lợi. Các yêu cầu này **không được thể hiện** trong mô hình ca sử dụng (Use Case) nhưng vẫn là điều kiện thiết yếu để đảm bảo chất lượng và khả năng vận hành của hệ thống.

### 1.2. Phạm vi

Tài liệu bao gồm:
- Các yêu cầu phi chức năng được phân loại theo mô hình **FURPS+** (Functionality, Usability, Reliability, Performance, Supportability + Constraints)
- Các **yếu tố chất lượng** (Quality Factors) liên quan
- Các **độ đo yêu cầu** (Metrics) cụ thể, lượng hóa được
- Các **tiêu chuẩn đáp ứng** (Acceptance Criteria) cho từng độ đo
- Các **đại lượng thay thế** (Proxies) khi NFR khó đo trực tiếp

### 1.3. Phương pháp phân loại

Phân loại theo mô hình **FURPS+** kết hợp tham chiếu **ISO 25010**:

```
FURPS+ Classification
├── F - Functionality (Chức năng bổ sung - không thuộc UC)
├── U - Usability (Tính dễ sử dụng)
├── R - Reliability (Độ tin cậy)
├── P - Performance (Hiệu năng)
├── S - Supportability (Khả năng hỗ trợ / Bảo trì)
└── + Constraints (Các ràng buộc)
    ├── Design Constraints (Ràng buộc thiết kế)
    ├── Implementation Constraints (Ràng buộc triển khai)
    ├── Legal/Licensing (Pháp lý / Bản quyền)
    └── Physical Constraints (Ràng buộc vật lý)
```

### 1.4. Mức độ ưu tiên

| Ký hiệu | Mức độ | Ý nghĩa |
|----------|--------|----------|
| **M** | Mandatory (Bắt buộc) | Không thể thiếu, hệ thống không đạt nghiệm thu nếu thiếu |
| **E** | Expected (Mong đợi) | Nên có, được kỳ vọng bởi phần lớn stakeholders |
| **N** | Nice to have (Có thì tốt) | Tùy chọn, không ảnh hưởng nghiệm thu |

---

## 2. Danh sách yêu cầu bổ sung / yêu cầu phi chức năng

### 2.1. Functionality – Yêu cầu chức năng bổ sung (không thuộc UC)

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-F01** | Ghi nhật ký hệ thống tự động (Auto Logging) | Hệ thống tự động ghi lại mọi hành động truy cập, thêm/sửa/xóa dữ liệu, thay đổi cấu hình với thông tin: thời gian, tài khoản, vai trò, loại hành động, đối tượng, mã đối tượng, mô tả chi tiết, địa chỉ IP. Tham chiếu FEAT 12.1. | **M** |
| **SUPL-F02** | Tự động sinh mã nhân sự | Khi tạo mới hồ sơ nhân sự, hệ thống tự động sinh mã cán bộ (maCanBo) duy nhất theo quy tắc đặt mã của nhà trường. | **M** |
| **SUPL-F03** | Tự động đăng xuất phiên không hoạt động | Hệ thống tự động đăng xuất phiên làm việc nếu người dùng không thao tác trong 30 phút. Tham chiếu FEAT 1.3. | **M** |
| **SUPL-F04** | Tự động khóa tài khoản nhân sự thôi việc | Khi nhân sự được đánh dấu thôi việc (FEAT 7.5/7.6), hệ thống tự động chuyển trạng thái tài khoản sang BI_KHOA. Tham chiếu FEAT 2.6. | **M** |
| **SUPL-F05** | Tự động chuyển trạng thái hợp đồng | Hệ thống sử dụng Scheduled Job chạy hàng ngày để tự động chuyển trạng thái hợp đồng từ CON_HIEU_LUC sang CHO_GIA_HAN khi thời hạn còn lại ≤ thoiGianChoGiaHan. | **M** |
| **SUPL-F06** | Tự động batch-update trạng thái tham gia đào tạo | Khi khóa đào tạo chuyển từ DANG_MO_DANG_KY sang DANG_DAO_TAO, hệ thống tự động cập nhật tất cả đăng ký từ DA_DANG_KY sang DANG_HOC. | **M** |
| **SUPL-F07** | Quy tắc nghiệp vụ chung về xóa/thay đổi trạng thái | Danh mục loại phụ cấp và loại hợp đồng chỉ hỗ trợ "Thay đổi trạng thái" (không hỗ trợ "Xóa") để đảm bảo tính toàn vẹn dữ liệu và phục vụ kiểm toán. Hệ số lương cho phép xóa khi chưa được sử dụng. | **M** |
| **SUPL-F08** | Mã hóa mật khẩu | Tất cả mật khẩu người dùng phải được lưu trữ dưới dạng đã mã hóa (hashed) bằng thuật toán an toàn (bcrypt hoặc tương đương). | **M** |

### 2.2. Usability – Tính dễ sử dụng

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-U01** | Giao diện thân thiện và nhất quán | Giao diện người dùng phải sử dụng ngôn ngữ Tiếng Việt, thiết kế nhất quán về bố cục, màu sắc, font chữ trên toàn bộ hệ thống. Phong cách thiết kế chuyên nghiệp phù hợp với môi trường đại học. | **M** |
| **SUPL-U02** | Thời gian đào tạo sử dụng ngắn | Người dùng mới (phòng TCCB, TCKT) có thể sử dụng thành thạo các chức năng cơ bản sau tối đa 2 giờ đào tạo hướng dẫn. | **E** |
| **SUPL-U03** | Thông báo lỗi rõ ràng | Mọi lỗi nhập liệu hoặc lỗi hệ thống phải hiển thị thông báo bằng Tiếng Việt, rõ ràng, mô tả nguyên nhân và hướng dẫn khắc phục. | **M** |
| **SUPL-U04** | Hỗ trợ tìm kiếm và lọc đa tiêu chí | Các danh sách dữ liệu (nhân sự, hợp đồng, đơn vị) phải hỗ trợ tìm kiếm theo từ khóa và lọc đa tiêu chí để giảm thời gian thao tác. | **M** |
| **SUPL-U05** | Giao diện responsive | Giao diện hiển thị tốt trên màn hình desktop độ phân giải từ 1366×768 trở lên. Hỗ trợ hiển thị cơ bản trên tablet. | **E** |
| **SUPL-U06** | Phím tắt và điều hướng nhanh | Hệ thống hỗ trợ phím Tab để di chuyển giữa các trường nhập liệu, Enter để xác nhận, và breadcrumb để điều hướng nhanh. | **N** |
| **SUPL-U07** | Xác nhận trước thao tác quan trọng | Hệ thống hiển thị hộp thoại xác nhận trước các thao tác quan trọng: xóa dữ liệu, khóa tài khoản, đánh dấu thôi việc, thay đổi trạng thái đơn vị. | **M** |

### 2.3. Reliability – Độ tin cậy

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-R01** | Tính sẵn sàng cao (High Availability) | Hệ thống đảm bảo hoạt động liên tục trong giờ hành chính (7:00 – 22:00), đạt uptime tối thiểu 99.5% trong tháng (không tính thời gian bảo trì theo kế hoạch). | **M** |
| **SUPL-R02** | Khả năng phục hồi sau sự cố | Hệ thống có khả năng khởi động lại và phục hồi hoạt động bình thường trong tối đa 15 phút sau sự cố crash/restart. | **M** |
| **SUPL-R03** | Sao lưu dữ liệu tự động | Dữ liệu hệ thống (database, file đính kèm) phải được sao lưu tự động hàng ngày, lưu giữ bản sao lưu tối thiểu 30 ngày. | **M** |
| **SUPL-R04** | Toàn vẹn dữ liệu | Hệ thống đảm bảo tính toàn vẹn dữ liệu qua cơ chế transaction – mọi thao tác cập nhật dữ liệu quan trọng (hợp đồng, bổ nhiệm, đánh giá) phải thực hiện trong transaction. Nếu bất kỳ bước nào thất bại, toàn bộ thao tác phải rollback. | **M** |
| **SUPL-R05** | Không mất dữ liệu khi phiên hết hạn | Khi phiên người dùng hết hạn (30 phút không hoạt động), hệ thống phải lưu lại trạng thái form đang nhập (nếu có thể) hoặc cảnh báo trước 5 phút để người dùng lưu dữ liệu. | **E** |

### 2.4. Performance – Hiệu năng

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-P01** | Thời gian phản hồi giao diện | Các thao tác CRUD cơ bản (xem danh sách, xem chi tiết, thêm/sửa) phải hoàn thành hiển thị trong thời gian phản hồi chấp nhận được tùy số người dùng đồng thời. | **M** |
| **SUPL-P02** | Số lượng người dùng đồng thời | Hệ thống hỗ trợ tối thiểu 100 người dùng đồng thời mà không suy giảm hiệu năng đáng kể (thời gian phản hồi tăng ≤ 50% so với tải thấp). | **M** |
| **SUPL-P03** | Thời gian tạo báo cáo thống kê | Dashboard thống kê và báo cáo tổng hợp (FEAT 10.1) phải hoàn thành render trong thời gian chấp nhận được. | **E** |
| **SUPL-P04** | Hiệu năng tìm kiếm và lọc | Tìm kiếm và lọc danh sách nhân sự (FEAT 7.1, 7.2) trên tập dữ liệu lớn phải trả kết quả nhanh chóng. | **M** |
| **SUPL-P05** | Hiệu năng upload/download file | Upload và download file đính kèm (PDF bằng cấp, chứng chỉ, hợp đồng) phải hoàn thành trong thời gian hợp lý. | **E** |
| **SUPL-P06** | Hiệu năng xuất Excel | Xuất danh sách nhân sự ra file Excel (FEAT 7.8) phải hoàn thành trong thời gian chấp nhận được. | **E** |

### 2.5. Security – Bảo mật

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-SE01** | Xác thực người dùng (Authentication) | Mọi truy cập vào hệ thống phải qua xác thực bằng tài khoản/mật khẩu. Mật khẩu phải đáp ứng chính sách: tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số. | **M** |
| **SUPL-SE02** | Phân quyền truy cập (Authorization) | Hệ thống phân quyền theo 4 vai trò (Admin, TCCB, TCKT, Nhân sự) – mỗi vai trò chỉ truy cập được các chức năng được cấp quyền. Mọi request API phải kiểm tra quyền trước khi xử lý. | **M** |
| **SUPL-SE03** | Bảo vệ chống tấn công brute-force | Khóa tài khoản tạm thời sau 5 lần đăng nhập sai liên tiếp. Thời gian khóa tối thiểu 15 phút. | **M** |
| **SUPL-SE04** | Mã hóa truyền tải dữ liệu (HTTPS) | Toàn bộ giao tiếp giữa client và server phải sử dụng giao thức HTTPS (TLS 1.2 trở lên). | **M** |
| **SUPL-SE05** | Bảo vệ dữ liệu nhạy cảm | Dữ liệu nhạy cảm (số CCCD, số BHXH, thông tin ngân hàng) phải được bảo vệ – chỉ hiển thị cho vai trò được phép, ghi log khi truy cập. | **M** |
| **SUPL-SE06** | Phòng chống CSRF và XSS | Hệ thống phải triển khai cơ chế CSRF token và sanitize input để ngăn các tấn công Cross-Site Request Forgery và Cross-Site Scripting. | **M** |
| **SUPL-SE07** | Chống SQL Injection | Toàn bộ truy vấn database phải sử dụng prepared statements / parameterized queries. | **M** |

### 2.6. Supportability – Khả năng hỗ trợ & Bảo trì

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-S01** | Kiến trúc module hóa | Hệ thống được thiết kế theo kiến trúc module (frontend/backend tách biệt), cho phép nâng cấp hoặc thay thế từng module mà không ảnh hưởng toàn bộ hệ thống. | **M** |
| **SUPL-S02** | Tài liệu kỹ thuật đầy đủ | Cung cấp tài liệu API cho backend, hướng dẫn triển khai và hướng dẫn sử dụng cho từng vai trò. | **E** |
| **SUPL-S03** | Khả năng mở rộng danh mục cấu hình | Hệ thống cho phép mở rộng các danh mục cấu hình (loại phụ cấp, loại hợp đồng, hệ số lương) mà không cần thay đổi mã nguồn. | **M** |
| **SUPL-S04** | Hỗ trợ gỡ lỗi (Debugging) | Hệ thống ghi log lỗi phía server theo nhiều cấp độ (ERROR, WARNING, INFO, DEBUG). Log phải bao gồm timestamp, request ID, stack trace. | **E** |
| **SUPL-S05** | Khả năng mở rộng quy mô (Scalability) | Kiến trúc hỗ trợ mở rộng theo chiều ngang (horizontal scaling) – cho phép thêm server instance khi số lượng người dùng tăng. | **N** |

### 2.7. Design Constraints – Ràng buộc thiết kế

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-DC01** | Kiến trúc Client-Server | Hệ thống phải xây dựng theo mô hình Client-Server, frontend dạng SPA (Single Page Application) giao tiếp với backend qua RESTful API. | **M** |
| **SUPL-DC02** | Cơ cấu tổ chức dạng cây | Cơ cấu tổ chức đơn vị phải được mô hình hóa dưới dạng cấu trúc cây cha-con với gốc là Trường Đại học Thủy Lợi (FEAT 3.1). | **M** |
| **SUPL-DC03** | Tách biệt quyền theo vai trò | Thiết kế hệ thống phải đảm bảo phân tách quyền rõ ràng theo 4 vai trò đã xác định, sử dụng cơ chế Role-Based Access Control (RBAC). | **M** |

### 2.8. Implementation Constraints – Ràng buộc triển khai

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-IC01** | Ngôn ngữ và framework | Frontend: React.js (TypeScript). Backend: Laravel/PHP. Database: MySQL/MariaDB. | **M** |
| **SUPL-IC02** | Trình duyệt hỗ trợ | Hệ thống phải hoạt động ổn định trên Chrome (bản mới nhất và 2 phiên bản gần nhất), Firefox, Edge. | **M** |
| **SUPL-IC03** | Chuẩn mã hóa ký tự | Toàn bộ hệ thống sử dụng mã hóa UTF-8 để hỗ trợ đầy đủ Tiếng Việt có dấu. | **M** |
| **SUPL-IC04** | Định dạng file đính kèm | Hệ thống hỗ trợ upload/download file PDF (bằng cấp, chứng chỉ, hợp đồng, giấy phép lao động) và Excel (import/export nhân sự). Kích thước file tối đa: 10MB. | **M** |

### 2.9. Legal / Regulatory – Pháp lý

| Mã | Yêu cầu | Mô tả chi tiết | Ưu tiên |
|----|----------|-----------------|---------|
| **SUPL-LR01** | Tuân thủ quy định bảo vệ dữ liệu cá nhân | Hệ thống phải tuân thủ các quy định về bảo vệ dữ liệu cá nhân theo pháp luật Việt Nam (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân). | **M** |
| **SUPL-LR02** | Tuân thủ quy chế quản lý nhân sự | Hệ thống phải phù hợp với quy chế quản lý nhân sự của Bộ GD&ĐT và Bộ NN&PTNT đối với trường đại học công lập. | **M** |
| **SUPL-LR03** | Lưu trữ hồ sơ theo quy định | Hồ sơ nhân sự và hợp đồng lao động phải được lưu trữ tối thiểu theo thời gian quy định của pháp luật lao động Việt Nam. | **M** |

---

## 3. Thiết lập độ đo và tiêu chuẩn đáp ứng

### 3.1. Functionality — Yêu cầu chức năng bổ sung

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-F01** | Correctness (Tính đúng đắn) – Khả năng kiểm toán (Auditability) | Tỷ lệ hành động được ghi log / Tổng hành động thực hiện trên hệ thống | ≥ 100% các hành động CRUD và truy cập đều được ghi log. Log phải bao gồm đầy đủ 9 trường thông tin (thời gian, tài khoản, họ tên, vai trò, loại hành động, đối tượng, mã đối tượng, mô tả, IP). |
| **SUPL-F02** | Correctness (Tính đúng đắn) | Tỷ lệ mã sinh tự động trùng lặp | 0% trùng lặp mã cán bộ. Mã được sinh theo quy tắc duy nhất và kiểm tra ràng buộc UNIQUE trong database. |
| **SUPL-F03** | Correctness (Tính đúng đắn) – Tự động hóa | Thời gian phát hiện phiên không hoạt động | Hệ thống phát hiện và đăng xuất chính xác sau 30 phút (±30 giây) không hoạt động. |
| **SUPL-F04** | Correctness (Tính đúng đắn) – Tự động hóa | Thời gian khóa tài khoản sau khi đánh dấu thôi việc | Tài khoản bị khóa tự động trong ≤ 1 phút sau khi nhân sự được đánh dấu thôi việc. |
| **SUPL-F05** | Correctness (Tính đúng đắn) – Tự động hóa | Tỷ lệ hợp đồng chuyển trạng thái đúng hạn | 100% hợp đồng được kiểm tra hàng ngày. Độ trễ chuyển trạng thái ≤ 24 giờ kể từ khi đủ điều kiện. |
| **SUPL-F06** | Correctness (Tính đúng đắn) – Tự động hóa | Tỷ lệ bản ghi đăng ký được cập nhật khi chuyển trạng thái khóa đào tạo | 100% bản ghi DA_DANG_KY phải chuyển thành DANG_HOC trong cùng transaction khi khóa đào tạo chuyển sang DANG_DAO_TAO. |
| **SUPL-F07** | Integrity (Tính toàn vẹn) | Số trường hợp mất dữ liệu lịch sử do xóa danh mục | 0 trường hợp. Danh mục đã sử dụng không thể bị xóa, chỉ được thay đổi trạng thái. |
| **SUPL-F08** | Security (Bảo mật) | Thuật toán hash sử dụng; Số mật khẩu lưu dạng plaintext | Sử dụng bcrypt (hoặc argon2) với cost factor ≥ 10. 0 mật khẩu lưu dạng plaintext. |

### 3.2. Usability — Tính dễ sử dụng

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-U01** | Usability – Tính nhất quán (Consistency) | Số trang vi phạm design system (font, màu, layout); Tỷ lệ nội dung Tiếng Việt | 0 trang vi phạm. 100% giao diện sử dụng Tiếng Việt (trừ thuật ngữ kỹ thuật). |
| **SUPL-U02** | Usability – Learnability (Dễ học) | Thời gian đào tạo trung bình cho người dùng mới (proxy: khối lượng tài liệu đào tạo) | ≤ 2 giờ cho các chức năng cơ bản. 95% người dùng phòng TCCB hoàn thành được thao tác thêm/sửa nhân sự sau đào tạo. |
| **SUPL-U03** | Usability – Error Handling | Tỷ lệ lỗi có thông báo Tiếng Việt rõ ràng / Tổng số loại lỗi | 100% lỗi validation, lỗi nghiệp vụ, lỗi hệ thống đều có thông báo Tiếng Việt. Mỗi thông báo lỗi phải có ≥ 1 gợi ý khắc phục. |
| **SUPL-U04** | Usability – Efficiency (Hiệu quả thao tác) | Số bước thao tác để tìm kiếm và xem chi tiết 1 nhân sự | ≤ 3 bước (nhập từ khóa → tìm kiếm → click xem). Bộ lọc đa tiêu chí cho phép kết hợp ≥ 3 tiêu chí đồng thời. |
| **SUPL-U05** | Usability – Accessibility | % trang hiển thị đúng trên các độ phân giải mục tiêu | 100% trang hiển thị đúng trên ≥ 1366×768. ≥ 80% trang sử dụng được trên tablet (1024×768). |
| **SUPL-U06** | Usability – Efficiency (Hiệu quả thao tác) | Số form hỗ trợ phím Tab, Enter, breadcrumb | ≥ 90% form nhập liệu hỗ trợ Tab navigation. 100% trang có breadcrumb. |
| **SUPL-U07** | Usability – Error Prevention | Số thao tác quan trọng có hộp thoại xác nhận | 100% thao tác xóa, khóa tài khoản, thôi việc, thay đổi trạng thái đơn vị đều có confirmation dialog. |

### 3.3. Reliability — Độ tin cậy

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-R01** | Availability (Tính sẵn sàng) | Uptime (%) = (Tổng thời gian hoạt động / Tổng thời gian dự kiến) × 100 | ≥ 99.5%/tháng (tương đương downtime ≤ 3.6 giờ/tháng, không tính bảo trì kế hoạch). MTBF (Mean Time Between Failures) ≥ 720 giờ. |
| **SUPL-R02** | Recoverability (Khả năng phục hồi) | MTTR (Mean Time To Repair/Restart) | ≤ 15 phút từ lúc crash đến khi hệ thống phục vụ được request đầu tiên. |
| **SUPL-R03** | Recoverability (Khả năng phục hồi) – Sao lưu | RPO (Recovery Point Objective); RTO (Recovery Time Objective) | RPO ≤ 24 giờ (mất tối đa 1 ngày dữ liệu). RTO ≤ 4 giờ (phục hồi từ backup trong 4 giờ). Lưu giữ backup ≥ 30 ngày. |
| **SUPL-R04** | Integrity (Tính toàn vẹn dữ liệu) | Số trường hợp dữ liệu bất nhất quán (inconsistency) sau thao tác lỗi | 0 trường hợp. 100% thao tác cập nhật quan trọng nằm trong database transaction. Rollback hoàn chỉnh khi có lỗi. |
| **SUPL-R05** | Fault Tolerance (Chịu lỗi) | Tỷ lệ mất dữ liệu form khi phiên hết hạn | ≤ 5% trường hợp mất dữ liệu. Cảnh báo 5 phút trước khi phiên hết hạn. |

### 3.4. Performance — Hiệu năng

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-P01** | Speed (Tốc độ phản hồi) | Response time (giây) – P95 response time cho các thao tác CRUD | Theo bảng tải: **0–10 người dùng:** ≤ 1 giây; **11–50 người dùng:** ≤ 2 giây; **51–100 người dùng:** ≤ 5 giây; **>100 người dùng:** ≤ 10 giây. |
| **SUPL-P02** | Capacity (Dung lượng / Khả năng chịu tải) | Số người dùng đồng thời tối đa mà hệ thống phục vụ được | ≥ 100 concurrent users. Tại 100 users, response time tăng ≤ 50% so với tải 1 user. Throughput ≥ 50 transactions/second. |
| **SUPL-P03** | Speed (Tốc độ) – Báo cáo | Thời gian render dashboard/báo cáo | Dashboard: ≤ 5 giây. Báo cáo tổng hợp phức tạp: ≤ 15 giây. Biểu đồ thống kê: ≤ 3 giây/biểu đồ. |
| **SUPL-P04** | Speed (Tốc độ) – Tìm kiếm | Thời gian trả kết quả tìm kiếm/lọc | ≤ 2 giây trên tập dữ liệu ≤ 10.000 bản ghi. ≤ 5 giây trên tập dữ liệu ≤ 50.000 bản ghi. |
| **SUPL-P05** | Speed (Tốc độ) – File I/O | Thời gian upload/download file | Upload: ≤ 5 giây cho file ≤ 5MB. Download: ≤ 3 giây cho file ≤ 5MB (trên mạng LAN). |
| **SUPL-P06** | Speed (Tốc độ) – Xuất dữ liệu | Thời gian xuất Excel | ≤ 10 giây cho ≤ 1.000 bản ghi. ≤ 30 giây cho ≤ 10.000 bản ghi. |

### 3.5. Security — Bảo mật

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-SE01** | Authentication (Xác thực) | Chính sách mật khẩu; Số level xác thực | Mật khẩu ≥ 8 ký tự, chứa chữ hoa + chữ thường + số. 1 level xác thực (username/password). Token-based session management (JWT hoặc session cookie). |
| **SUPL-SE02** | Authorization (Phân quyền) | Số trường hợp truy cập trái phép (unauthorized access) phát hiện qua penetration test | 0 trường hợp unauthorized access. 100% API endpoint có middleware kiểm tra quyền. 4 vai trò phân quyền rõ ràng (RBAC). |
| **SUPL-SE03** | Integrity (Tính toàn vẹn) – Chống brute-force | Số lần đăng nhập sai trước khi khóa; Thời gian khóa | Khóa tài khoản sau 5 lần sai liên tiếp. Thời gian khóa: 15 phút. Ghi log cảnh báo khi phát hiện brute-force. |
| **SUPL-SE04** | Confidentiality (Bảo mật truyền tải) | Phiên bản TLS; Tỷ lệ kết nối sử dụng HTTPS | TLS ≥ 1.2. 100% kết nối qua HTTPS. 0 kết nối HTTP không mã hóa được phép. |
| **SUPL-SE05** | Confidentiality (Bảo mật dữ liệu) | Số trường dữ liệu nhạy cảm không được bảo vệ | 0 trường nhạy cảm hiển thị cho vai trò không được phép. 100% truy cập dữ liệu nhạy cảm (CCCD, BHXH, ngân hàng) được ghi audit log. |
| **SUPL-SE06** | Integrity – Chống tấn công web | Số lỗ hổng CSRF/XSS phát hiện qua kiểm thử bảo mật | 0 lỗ hổng CSRF. 0 lỗ hổng XSS. CSRF token trên mọi form POST/PUT/DELETE. |
| **SUPL-SE07** | Integrity – Chống tấn công database | Số lỗ hổng SQL Injection phát hiện qua kiểm thử | 0 lỗ hổng SQL Injection. 100% truy vấn sử dụng prepared statements. |

### 3.6. Supportability — Khả năng hỗ trợ & Bảo trì

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-S01** | Maintainability – Modularity (Tính module) | Số module; Coupling giữa các module | Frontend và Backend tách biệt hoàn toàn (giao tiếp qua API). Thay đổi 1 module không yêu cầu thay đổi ≥ 2 module khác. |
| **SUPL-S02** | Maintainability – Understandability | Tỷ lệ API có tài liệu; Tỷ lệ trang có hướng dẫn sử dụng | ≥ 90% API endpoint có mô tả trong tài liệu. 100% chức năng chính có hướng dẫn sử dụng. |
| **SUPL-S03** | Flexibility (Tính linh hoạt) | Số danh mục cấu hình có thể mở rộng không cần sửa code | ≥ 3 loại danh mục (hệ số lương, loại phụ cấp, loại hợp đồng) mở rộng qua giao diện quản trị. 0 thay đổi mã nguồn cần thiết khi thêm danh mục mới. |
| **SUPL-S04** | Testability (Khả năng kiểm thử) – Logging | Số cấp độ log được hỗ trợ; Thông tin trong mỗi log entry | ≥ 4 cấp độ (ERROR, WARNING, INFO, DEBUG). Mỗi entry có: timestamp, request ID, user ID, stack trace (cho ERROR). |
| **SUPL-S05** | Scalability (Khả năng mở rộng) | Số server instance có thể chạy song song (Proxy: kiến trúc stateless) | Backend stateless (session qua token). Hỗ trợ ≥ 2 instance chạy song song phía sau load balancer. |

### 3.7. Constraints — Ràng buộc

| Mã | Yếu tố chất lượng | Độ đo (Metric) | Tiêu chuẩn đáp ứng (Acceptance Criteria) |
|----|-------------------|----------------|------------------------------------------|
| **SUPL-DC01** | Portability – Kiến trúc | Tuân thủ mô hình Client-Server, RESTful API | 100% giao tiếp client-server qua RESTful API (JSON). Frontend là SPA (Single Page Application). |
| **SUPL-DC02** | Correctness – Mô hình dữ liệu | Kiểm tra cấu trúc cây đơn vị | 100% đơn vị tổ chức nằm trong cấu trúc cây cha-con hợp lệ. Gốc duy nhất: Trường ĐHTL. Không có cycle. |
| **SUPL-DC03** | Security – Thiết kế | Số vai trò được định nghĩa; Mô hình phân quyền | RBAC với 4 vai trò. 100% chức năng có ma trận phân quyền rõ ràng. |
| **SUPL-IC01** | Portability – Công nghệ | Stack công nghệ tuân thủ | React.js (TypeScript) + Laravel/PHP + MySQL/MariaDB. |
| **SUPL-IC02** | Compatibility – Trình duyệt | Số trình duyệt hỗ trợ; Tỷ lệ chức năng hoạt động đúng | ≥ 3 trình duyệt (Chrome, Firefox, Edge). 100% chức năng hoạt động trên Chrome mới nhất. ≥ 95% trên Firefox và Edge. |
| **SUPL-IC03** | Portability – Mã hóa | Encoding sử dụng | UTF-8 trên toàn bộ hệ thống. 0 lỗi hiển thị Tiếng Việt có dấu. |
| **SUPL-IC04** | Correctness – File | Định dạng và kích thước file hỗ trợ | PDF và Excel. Kích thước tối đa: 10MB/file. Thông báo lỗi nếu vượt quá. |
| **SUPL-LR01** | Legal – Bảo vệ dữ liệu | Tuân thủ Nghị định 13/2023/NĐ-CP | Có cơ chế đồng ý thu thập dữ liệu. Có khả năng xóa/ẩn dữ liệu cá nhân khi có yêu cầu. |
| **SUPL-LR02** | Legal – Quy chế nhân sự | Tuân thủ quy chế Bộ GD&ĐT, Bộ NN&PTNT | Các loại hợp đồng, phụ cấp, chức danh phù hợp quy định. |
| **SUPL-LR03** | Legal – Lưu trữ | Thời gian lưu trữ tối thiểu | Hồ sơ nhân sự lưu ≥ 75 năm (theo Luật Lưu trữ). Hợp đồng lao động lưu ≥ 10 năm sau khi kết thúc. |

---

## 4. Ma trận truy vết NFR → FEAT/UC

| Nhóm NFR | Mã SUPL | FEAT/UC liên quan | Tác nhân ảnh hưởng |
|----------|---------|--------------------|--------------------|
| **Functionality (bổ sung)** | SUPL-F01 | FEAT 12.1, UC Auto Logging | System Timer |
| | SUPL-F02 | FEAT 7.3, UC 4.25 | TCCB |
| | SUPL-F03 | FEAT 1.3, UC 4.2 A1 | System Timer |
| | SUPL-F04 | FEAT 2.6, UC 4.8 A2 | System Timer |
| | SUPL-F05 | FEAT 5.1, UC 4.22 | System Timer |
| | SUPL-F06 | FEAT 8.2, UC 4.34 | System Timer, TCCB |
| | SUPL-F07 | FEAT 9.3, 9.4, 9.5 | TCCB |
| | SUPL-F08 | FEAT 1.1, UC 4.1 | Tất cả |
| **Usability** | SUPL-U01 → U07 | Toàn bộ FEAT/UC | Tất cả |
| **Reliability** | SUPL-R01 → R05 | Toàn bộ hệ thống | Phòng CNTT |
| **Performance** | SUPL-P01 | Toàn bộ FEAT/UC | Tất cả |
| | SUPL-P02 | Toàn bộ hệ thống | Phòng CNTT |
| | SUPL-P03 | FEAT 10.1, UC 4.37 | TCCB, TCKT |
| | SUPL-P04 | FEAT 7.1, 7.2, UC 4.23, 4.24 | TCCB, TCKT |
| | SUPL-P05 | BangCap, ChungChi, HopDong files | TCCB |
| | SUPL-P06 | FEAT 7.8, UC 4.28 A2 | TCCB, TCKT |
| **Security** | SUPL-SE01 → SE07 | FEAT 1.1, 2.4, 12.1, 12.2 | Admin, System |
| **Supportability** | SUPL-S01 → S05 | Toàn bộ hệ thống | Nhóm phát triển |
| **Constraints** | SUPL-DC01 → IC04, LR01 → LR03 | Toàn bộ hệ thống | Tất cả stakeholders |

---

## 5. Phân tích Softgoals và Trade-offs

### 5.1. Các Softgoal chính của hệ thống HRMS

```
                 Chất lượng hệ thống HRMS
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   Bảo mật cao     Hiệu năng tốt    Dễ sử dụng
   (Security)      (Performance)     (Usability)
        │                 │                 │
   ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
   │         │      │         │      │         │
 Mã hóa   RBAC   Caching   Index  UI đơn   Tìm kiếm
 mạnh    chặt    dữ liệu  DB     giản     thông minh
```

### 5.2. Phân tích Trade-offs

| Trade-off | Softgoal A | Softgoal B | Quyết định |
|-----------|------------|------------|------------|
| **Bảo mật vs Dễ sử dụng** | Mật khẩu phức tạp + tự động đăng xuất 30 phút | Người dùng phải đăng nhập lại thường xuyên | Ưu tiên bảo mật (M) – bù bằng cảnh báo 5 phút trước khi hết phiên |
| **Bảo mật vs Hiệu năng** | Kiểm tra quyền trên mọi API request | Tăng overhead cho mỗi request | Ưu tiên bảo mật (M) – tối ưu bằng caching quyền theo phiên |
| **Toàn vẹn dữ liệu vs Linh hoạt** | Không cho xóa danh mục đã sử dụng | Người dùng muốn dọn dẹp dữ liệu cũ | Ưu tiên toàn vẹn (M) – hỗ trợ "Ngừng sử dụng" thay thế |
| **Audit Log đầy đủ vs Hiệu năng** | Ghi log 100% hành động | Tăng I/O database | Ưu tiên audit (M) – sử dụng async logging hoặc separate log table |
| **Responsive design vs Thời gian phát triển** | Hỗ trợ đa thiết bị | Tăng effort thiết kế/kiểm thử | Ưu tiên desktop (M) – tablet hỗ trợ cơ bản (E) |

### 5.3. Minh họa mô hình McCall áp dụng cho HRMS

```
Product Operation (Vận hành sản phẩm)
├── Correctness ───── SUPL-F01→F08, SUPL-DC02, SUPL-IC03, SUPL-IC04
├── Reliability ───── SUPL-R01→R05
├── Efficiency ────── SUPL-P01→P06
├── Integrity ─────── SUPL-SE01→SE07, SUPL-F07
└── Usability ─────── SUPL-U01→U07

Product Revision (Sửa đổi sản phẩm)
├── Maintainability ── SUPL-S01, SUPL-S02
├── Flexibility ────── SUPL-S03
└── Testability ────── SUPL-S04

Product Transition (Chuyển đổi sản phẩm)
├── Portability ────── SUPL-DC01, SUPL-IC01, SUPL-IC02, SUPL-IC03
├── Reusability ────── SUPL-S01 (kiến trúc module)
└── Interoperability ─ SUPL-IC04 (hỗ trợ Excel/PDF)
```

---

## Phụ lục A: Bảng tổng hợp nhanh — Quality Factor × Metric × Acceptance Criteria

> Bảng tóm tắt dạng đặc tả bổ sung (Supplementary Specification Table) theo format bài tập nhóm.

| # | Quality Factor | Metric | Acceptance Criteria | Priority |
|---|---------------|--------|---------------------|----------|
| 1 | **Performance – Speed** | P95 Response time (CRUD) | ≤ 2s (≤50 users), ≤ 5s (≤100 users) | M |
| 2 | **Performance – Capacity** | Concurrent users | ≥ 100 users, throughput ≥ 50 tx/s | M |
| 3 | **Performance – Search** | Search/filter response time | ≤ 2s (≤10K records) | M |
| 4 | **Performance – Report** | Dashboard render time | ≤ 5s dashboard, ≤ 15s complex report | E |
| 5 | **Performance – Export** | Excel export time | ≤ 10s (≤1K records), ≤ 30s (≤10K) | E |
| 6 | **Performance – File I/O** | Upload/download time (≤5MB) | Upload ≤ 5s, Download ≤ 3s | E |
| 7 | **Reliability – Availability** | Uptime percentage | ≥ 99.5%/month, MTBF ≥ 720h | M |
| 8 | **Reliability – Recoverability** | MTTR | ≤ 15 minutes | M |
| 9 | **Reliability – Backup** | RPO / RTO | RPO ≤ 24h, RTO ≤ 4h | M |
| 10 | **Reliability – Integrity** | Data inconsistency count | 0 cases | M |
| 11 | **Security – Authentication** | Password policy; session management | ≥ 8 chars (upper+lower+digit); token-based | M |
| 12 | **Security – Authorization** | Unauthorized access count | 0 cases, 100% endpoints protected | M |
| 13 | **Security – Brute-force** | Lock threshold | Lock after 5 failures, 15min cooldown | M |
| 14 | **Security – Encryption** | TLS version | ≥ TLS 1.2, 100% HTTPS | M |
| 15 | **Security – Data Protection** | Exposed sensitive fields | 0 fields exposed to unauthorized roles | M |
| 16 | **Security – Web Attacks** | CSRF/XSS vulnerabilities | 0 vulnerabilities | M |
| 17 | **Security – SQL Injection** | SQLi vulnerabilities | 0 vulnerabilities, 100% prepared statements | M |
| 18 | **Usability – Consistency** | UI violations | 0 pages violating design system | M |
| 19 | **Usability – Learnability** | Training time | ≤ 2 hours for basic functions | E |
| 20 | **Usability – Error Handling** | Vietnamese error messages | 100% with fix suggestions | M |
| 21 | **Usability – Efficiency** | Steps to search+view employee | ≤ 3 steps | M |
| 22 | **Usability – Responsive** | Correct display at target resolutions | 100% at ≥1366×768 | E |
| 23 | **Usability – Confirmation** | Critical actions with dialog | 100% delete/lock/terminate actions | M |
| 24 | **Supportability – Modularity** | Module coupling | Change in 1 module → ≤ 1 other module affected | M |
| 25 | **Supportability – Documentation** | API doc coverage | ≥ 90% endpoints documented | E |
| 26 | **Supportability – Flexibility** | Config categories extendable via UI | ≥ 3 categories, 0 code changes needed | M |
| 27 | **Supportability – Logging** | Log levels supported | ≥ 4 levels (ERROR/WARN/INFO/DEBUG) | E |
| 28 | **Supportability – Scalability** | Horizontal scaling support | ≥ 2 instances behind load balancer | N |
| 29 | **Correctness – Auto Logging** | Action log coverage | 100% CRUD actions logged with 9 fields | M |
| 30 | **Correctness – Auto Processes** | Auto status transition accuracy | 100% correct, ≤ 24h delay | M |
| 31 | **Integrity – Data Retention** | Catalog deletion prevention | 0 used catalogs deletable | M |
| 32 | **Legal – Data Privacy** | Compliance with ND 13/2023 | Full compliance | M |
| 33 | **Compatibility – Browser** | Supported browsers | Chrome + Firefox + Edge, 100% on Chrome | M |
| 34 | **Portability – Encoding** | UTF-8 compliance | 0 Vietnamese display errors | M |

---

> **Ghi chú cuối:** Tài liệu này bổ sung cho Đặc tả Ca sử dụng (UCS) và phải được đọc cùng với tài liệu RMP và các UC1-42 để có cái nhìn toàn diện về yêu cầu hệ thống.
