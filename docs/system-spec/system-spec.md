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

### 1.1.3. Tổng quan tài liệu

Tài liệu RMP này được tổ chức theo các phần như sau:

- **Mục 1.2** mô tả các công cụ, hạ tầng và môi trường được sử dụng để quản lý yêu cầu.
- **Mục 1.2.2** định nghĩa các kiểu yêu cầu được sử dụng trong dự án.
- **Mục 1.2.3** liệt kê các loại tài liệu yêu cầu và ánh xạ tới kiểu yêu cầu tương ứng.
- **Mục 1.3 – 1.4** mô tả các nhân tố tham gia dự án và bảng liên lạc với các bên liên quan chính.
- **Mục 1.5** xác định phương pháp phát triển phần mềm được áp dụng.
- **Mục 1.6** mô tả quy trình quản lý thay đổi yêu cầu.
- **Mục 1.7** định nghĩa cấu trúc truy vết giữa các kiểu yêu cầu, bao gồm sơ đồ, ràng buộc và quy trình phát hiện khoảng trống.
- **Mục 1.8** định nghĩa các thuộc tính cho từng kiểu yêu cầu, bao gồm tập giá trị cho phép và ý nghĩa cụ thể trong ngữ cảnh dự án.
- **Mục 1.9** mô tả các báo cáo và chế độ xem dùng để giám sát độ bao phủ yêu cầu.

## 1.2. Công cụ sử dụng và các kiểu yêu cầu

### 1.2.1. Các công cụ, môi trường và hạ tầng quản lý yêu cầu

| STT | Công cụ / Hạ tầng | Mục đích sử dụng |
| --- | --- | --- |
| 1 | Microsoft Word | Soạn thảo và chỉnh sửa các tài liệu quản lý yêu cầu như RMP, SRS |
| 2 | StarUML / Draw.io | Mô hình hóa tiến trình công việc qua các sơ đồ GANTT, đường Găng. Mô hình hóa hệ thống thông qua các sơ đồ Use Case, các sơ đồ UML liên quan. |
| 3 | Discord / Họp nhóm trực tiếp | Trao đổi thông tin, thảo luận và xác nhận yêu cầu giữa các thành viên trong nhóm và các bên liên quan |
| 4 | Google Drive / Thư mục dự án dùng chung | Lưu trữ tập trung tất cả tài liệu yêu cầu (RMP, STR, VIS, UCS, SS). Các thành viên truy cập tài liệu thông qua thư mục chia sẻ với quyền đọc/ghi theo vai trò. |
| 5 | GitHub Issues / Trello | Theo dõi các yêu cầu thay đổi (Change Request), phân công nhiệm vụ và ghi nhận trạng thái xử lý yêu cầu. |

**Quy định truy cập:**

- Các thành viên không có quyền chỉnh sửa trực tiếp sẽ được cung cấp bản xuất PDF hoặc liên kết chỉ đọc (read-only) tới các tài liệu yêu cầu.
- Mọi thay đổi tài liệu yêu cầu phải được thực hiện thông qua quy trình quản lý thay đổi (xem Mục 1.6).

### 1.2.2. Các kiểu yêu cầu cho dự án

| Loại yêu cầu | Viết tắt | Loại tài liệu | Mô tả |
| --- | --- | --- | --- |
| Yêu cầu của các bên liên quan | STRQ | Yêu cầu của các bên liên quan (STR) | Mô tả các nhu cầu, mong đợi và mục tiêu chính của người dùng và các bên liên quan đối với hệ thống. Thuộc miền vấn đề (problem domain). |
| Yêu cầu tính năng | FEAT | Tài liệu tầm nhìn (VIS) | Mô tả các điều kiện, khả năng và các tính năng tổng quát mà hệ thống cần cung cấp. Thuộc miền giải pháp (solution domain). |
| Ca sử dụng | UC | Đặc tả ca sử dụng (UCS) | Mô tả chi tiết các ca sử dụng dưới dạng tương tác giữa tác nhân và hệ thống, phản ánh các yêu cầu chức năng. Mỗi UC có một tài liệu đặc tả riêng. |
| Kịch bản | SCEN | Đặc tả ca sử dụng (UCS) | Mô tả các đường đi hợp lệ qua một ca sử dụng (luồng cơ bản và luồng thay thế). Là cầu nối giữa UC và ca kiểm thử (TC), hỗ trợ triển khai lặp theo từng kịch bản. |
| Yêu cầu bổ sung | SUPL | Đặc tả bổ sung (SS) | Mô tả các yêu cầu phi chức năng và các ràng buộc của hệ thống không được thể hiện trong mô hình ca sử dụng. |
| Thuật ngữ | TERM | Bảng thuật ngữ (GLS) | Định nghĩa các thuật ngữ chuyên ngành và từ vựng chung được sử dụng trong dự án nhằm đảm bảo sự thống nhất trong giao tiếp. |

### 1.2.3. Loại tài liệu yêu cầu cho dự án

| Loại tài liệu | Viết tắt | Mô tả | Loại yêu cầu mặc định |
| --- | --- | --- | --- |
| Kế hoạch quản lý yêu cầu | RMP | Tài liệu mô tả phương pháp, quy trình và công cụ quản lý yêu cầu của dự án. | Không áp dụng |
| Yêu cầu của các bên liên quan | STR | Tập hợp các yêu cầu nghiệp vụ và mong đợi chính từ các bên liên quan. | Yêu cầu bên liên quan (STRQ) |
| Tài liệu tầm nhìn | VIS | Mô tả tổng quan hệ thống, phạm vi và các mục tiêu chính của dự án. | Yêu cầu tính năng (FEAT) |
| Đặc tả ca sử dụng | UCS | Mô tả chi tiết các ca sử dụng và cách người dùng tương tác với hệ thống. Mỗi UC có một tài liệu UCS riêng. | Ca sử dụng (UC) và Kịch bản (SCEN) |
| Đặc tả bổ sung | SS | Mô tả các yêu cầu phi chức năng và các ràng buộc của hệ thống. | Yêu cầu bổ sung (SUPL) |
| Bảng thuật ngữ | GLS | Định nghĩa từ vựng chung và thuật ngữ chuyên ngành nhân sự (hệ số lương, phụ cấp, bổ nhiệm, điều chuyển, v.v.) nhằm đảm bảo sự thống nhất trong trao đổi giữa các bên. | Thuật ngữ (TERM) |

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

## 1.5. Phương pháp phát triển phần mềm

Dự án HRMS áp dụng **phương pháp phát triển lặp (Iterative Development)** theo mô hình **Unified Process (UP)**, bao gồm bốn giai đoạn chính:

| Giai đoạn | Mô tả | Sản phẩm chính |
| --- | --- | --- |
| Khởi đầu (Inception) | Xác định phạm vi dự án, các bên liên quan chính, rủi ro lớn và tầm nhìn hệ thống. | Tài liệu tầm nhìn (VIS), Bản kế hoạch quản lý yêu cầu (RMP), Danh sách STRQ ban đầu |
| Phân tích chi tiết (Elaboration) | Thu thập, phân tích và đặc tả yêu cầu chi tiết; xây dựng kiến trúc hệ thống cơ sở. | Đặc tả ca sử dụng (UCS), Đặc tả bổ sung (SS), Kiến trúc cơ sở |
| Xây dựng (Construction) | Thiết kế, lập trình và kiểm thử các tính năng theo từng iteration. Các UC được triển khai theo kịch bản (SCEN), dần hoàn thiện toàn bộ UC qua các lần lặp. | Mã nguồn, Kết quả kiểm thử, Tài liệu thiết kế |
| Chuyển giao (Transition) | Triển khai hệ thống, đào tạo người dùng, nghiệm thu và bàn giao. | Hệ thống hoàn chỉnh, Tài liệu hướng dẫn sử dụng |

**Quy tắc đường cơ sở yêu cầu (Baseline):**

- Yêu cầu được đưa vào đường cơ sở khi đạt trạng thái **Approved** (Đã phê duyệt).
- Mọi thay đổi đối với yêu cầu đã vào đường cơ sở phải thông qua quy trình quản lý thay đổi (xem Mục 1.6).
- Việc kiểm tra truy vết (traceability verification) được thực hiện tại cuối mỗi iteration.

## 1.6. Quy trình quản lý thay đổi yêu cầu

### 1.6.1. Quy trình xử lý yêu cầu thay đổi

Mọi yêu cầu thay đổi (Change Request – CR) đối với yêu cầu đã được phê duyệt (trạng thái Approved trở lên) phải tuân thủ quy trình sau:

| Bước | Hoạt động | Người thực hiện | Sản phẩm |
| --- | --- | --- | --- |
| 1 | **Gửi yêu cầu thay đổi**: Mô tả nội dung thay đổi, lý do và yêu cầu liên quan (STRQ/FEAT/UC/SUPL bị ảnh hưởng). | Bất kỳ thành viên dự án hoặc bên liên quan | Phiếu CR (tạo trên GitHub Issues / Trello) |
| 2 | **Phân tích tác động**: Đánh giá ảnh hưởng của thay đổi tới các yêu cầu liên quan thông qua chuỗi truy vết (STRQ → FEAT → UC/SUPL), ước lượng công sức và rủi ro. | Team BA/PM (Team 1) | Báo cáo phân tích tác động |
| 3 | **Phê duyệt hoặc từ chối**: Quyết định chấp nhận, hoãn hoặc từ chối yêu cầu thay đổi. | Ban Giám hiệu (thay đổi lớn về phạm vi) hoặc PM (thay đổi nhỏ trong phạm vi đã duyệt) | Trạng thái CR cập nhật |
| 4 | **Cập nhật yêu cầu**: Nếu được phê duyệt, cập nhật các tài liệu yêu cầu liên quan (STR, VIS, UCS, SS) và cập nhật ma trận truy vết. | Team BA/PM (Team 1) | Tài liệu yêu cầu cập nhật, Ma trận truy vết cập nhật |
| 5 | **Xác minh cập nhật**: Kiểm tra lại tính nhất quán và truy vết sau thay đổi. | Team BA/PM (Team 1) | Kết quả kiểm tra truy vết |

### 1.6.2. Phân loại mức độ thay đổi

| Mức độ | Mô tả | Người phê duyệt |
| --- | --- | --- |
| Nhỏ | Sửa lỗi chính tả, làm rõ mô tả mà không thay đổi ý nghĩa yêu cầu | PM (Team 1) |
| Trung bình | Thay đổi nội dung yêu cầu nhưng không ảnh hưởng phạm vi dự án tổng thể | PM (Team 1) với sự đồng ý của Team SA/Design (Team 2) |
| Lớn | Thêm/xóa STRQ, FEAT hoặc UC; thay đổi phạm vi dự án | Ban Giám hiệu |

## 1.7. Cấu trúc truy vết yêu cầu

### 1.7.1. Sơ đồ truy vết

Cấu trúc truy vết giữa các kiểu yêu cầu trong dự án được định nghĩa như sau:

```
STRQ ──→ FEAT ──→ UC ──→ SCEN
  │         │
  │         └──→ SUPL
  └──→ SUPL
```

Trong đó:
- **STRQ → FEAT**: Yêu cầu bên liên quan được chuyển đổi thành các tính năng hệ thống.
- **STRQ → SUPL**: Yêu cầu bên liên quan có thể truy vết trực tiếp tới yêu cầu bổ sung (phi chức năng).
- **FEAT → UC**: Tính năng được hiện thực hóa thông qua các ca sử dụng.
- **FEAT → SUPL**: Tính năng được hỗ trợ bởi các yêu cầu bổ sung.
- **UC → SCEN**: Ca sử dụng được phân tách thành các kịch bản (luồng cơ bản và luồng thay thế).

### 1.7.2. Chi tiết các đường truy vết

| Từ | Đến | Quan hệ | Ràng buộc bắt buộc |
| --- | --- | --- | --- |
| STRQ | FEAT | Nhiều-nhiều (thông thường 1 STRQ → nhiều FEAT) | Mỗi STRQ ở trạng thái **Approved** phải truy vết tới ít nhất một FEAT hoặc SUPL. |
| STRQ | SUPL | Nhiều-nhiều | (Nằm trong ràng buộc bao phủ STRQ ở trên) |
| FEAT | UC | Nhiều-nhiều | Mỗi FEAT ở trạng thái **Approved** phải truy vết tới ít nhất một UC hoặc SUPL. |
| FEAT | SUPL | Nhiều-nhiều | (Nằm trong ràng buộc bao phủ FEAT ở trên) |
| UC | FEAT | Truy vết ngược | UC truy vết ngược về FEAT mà nó hiện thực hóa. |
| SUPL | FEAT | Truy vết ngược | SUPL truy vết ngược về FEAT mà nó hỗ trợ. |
| UC | SCEN | Một-nhiều | Mỗi UC có ít nhất một SCEN (luồng cơ bản). |

### 1.7.3. Quy trình phát hiện khoảng trống truy vết (Gap Detection)

Tại cuối mỗi iteration, nhóm BA/PM thực hiện các kiểm tra sau:

**Kiểm tra truy vết xuôi (Forward-trace gaps) — yêu cầu thiếu bao phủ downstream:**

| Kiểm tra | Ý nghĩa |
| --- | --- |
| Tất cả STRQ chưa truy vết tới FEAT nào | Nhu cầu bên liên quan chưa có tính năng tương ứng |
| Tất cả FEAT chưa truy vết tới UC hoặc SUPL nào | Tính năng chưa được hiện thực hóa bằng yêu cầu cụ thể |

**Kiểm tra truy vết ngược (Back-trace gaps) — yêu cầu thiếu nguồn gốc upstream:**

| Kiểm tra | Ý nghĩa |
| --- | --- |
| Tất cả FEAT không được truy vết từ STRQ nào | Tính năng không có nhu cầu bên liên quan làm căn cứ |
| Tất cả UC không được truy vết từ FEAT nào | Ca sử dụng không có tính năng làm căn cứ |
| Tất cả SUPL không được truy vết từ FEAT nào | Yêu cầu bổ sung không có tính năng làm căn cứ |

Kết quả kiểm tra khoảng trống được ghi nhận trong báo cáo khoảng trống (Gap Report) — xem Mục 1.9.

## 1.8. Thuộc tính yêu cầu

Phần này định nghĩa các thuộc tính cho từng kiểu yêu cầu, bao gồm tập giá trị cho phép và ý nghĩa cụ thể trong ngữ cảnh dự án HRMS.

### 1.8.1. Thuộc tính cho FEAT (Yêu cầu tính năng)

#### Trạng thái (Status)

Theo dõi vòng đời của yêu cầu tính năng:

| Giá trị | Mô tả |
| --- | --- |
| **Proposed** (Đề xuất) | Tính năng đang được thảo luận, chưa được nhóm dự án xem xét và chấp nhận. |
| **Approved** (Đã phê duyệt) | Tính năng đã được xem xét và phê duyệt để tiến hành thiết kế và triển khai. |
| **Realized** (Đã hiện thực hóa trong thiết kế) | Tính năng đã được tích hợp vào thiết kế. Các sản phẩm thiết kế (sơ đồ, mô hình) phản ánh tính năng này. |
| **Incorporated** (Đã tích hợp vào sản phẩm) | Tính năng đã được triển khai trong mã nguồn. |
| **Validated** (Đã kiểm thử xác nhận) | Tính năng đã được kiểm thử và xác minh hoạt động đúng. |

#### Độ ưu tiên (Priority)

Xác định mức độ ưu tiên phân bổ nguồn lực phát triển:

| Giá trị | Mô tả |
| --- | --- |
| **High** (Cao) | Phải được triển khai không muộn hơn iteration đầu tiên của giai đoạn Xây dựng (Construction). |
| **Medium** (Trung bình) | Phải được triển khai không muộn hơn khi kết thúc giai đoạn Xây dựng (Construction). |
| **Low** (Thấp) | Có thể triển khai nếu còn thời gian. Ít quan trọng hơn và có thể được lùi sang các iteration hoặc phiên bản tiếp theo. |

#### Lợi ích (Benefit)

Mức độ quan trọng của tính năng đối với người dùng cuối và khách hàng:

| Giá trị | Mô tả |
| --- | --- |
| **Critical** (Thiết yếu) | Tính năng thiết yếu. Nếu không triển khai, hệ thống sẽ không đáp ứng nhu cầu khách hàng. Tất cả tính năng Critical phải có trong bản phát hành, nếu không lịch trình sẽ bị trễ. |
| **Important** (Quan trọng) | Tính năng quan trọng cho tính hiệu quả của hệ thống trong hầu hết các trường hợp sử dụng. Không thể dễ dàng cung cấp bằng cách khác. |
| **Useful** (Hữu ích) | Tính năng sẽ được sử dụng ít thường xuyên hơn, hoặc có thể có giải pháp thay thế hợp lý. Không ảnh hưởng đáng kể nếu không có trong bản phát hành. |

#### Công sức (Effort)

Ước lượng khối lượng công việc tính theo **ngày-người (person-days)**. Giá trị được xác định bởi đội phát triển (Team 3) phối hợp với Team SA/Design (Team 2).

#### Rủi ro (Risk)

Xác suất kết hợp với mức độ tác động của các sự kiện bất lợi khi triển khai:

| Giá trị | Mô tả |
| --- | --- |
| **High** (Cao) | Tác động của rủi ro kết hợp với xác suất xảy ra là cao. Ví dụ: sử dụng công nghệ mới mà nhóm chưa có kinh nghiệm, hoặc tính năng phụ thuộc hệ thống bên ngoài chưa ổn định. |
| **Medium** (Trung bình) | Tác động của rủi ro ít nghiêm trọng hơn và xác suất xảy ra nhỏ hơn. |
| **Low** (Thấp) | Tác động rủi ro tối thiểu và xác suất xảy ra thấp. |

#### Độ ổn định (Stability)

Xác suất yêu cầu sẽ thay đổi hoặc hiểu biết của nhóm về yêu cầu sẽ thay đổi:

| Giá trị | Mô tả |
| --- | --- |
| **High** (Cao — ổn định) | Xác suất thay đổi thấp. Yêu cầu đã được hiểu rõ và thống nhất. |
| **Medium** (Trung bình) | Xác suất thay đổi vừa phải. |
| **Low** (Thấp — dễ biến động) | Xác suất thay đổi cao. Yêu cầu cần được thu thập thêm thông tin (elicitation bổ sung). Các mục có Stability = Low nên được ưu tiên làm rõ sớm. |

#### Bản phát hành mục tiêu (Target Release)

Tên hoặc số hiệu của iteration mà tính năng dự kiến được tích hợp vào sản phẩm. Kiểu dữ liệu: **Văn bản** (ví dụ: "Iteration 1", "Construction-2").

#### Người phụ trách (Assigned To)

Người chịu trách nhiệm thu thập thêm thông tin, viết đặc tả yêu cầu phần mềm và theo dõi triển khai. Kiểu dữ liệu: **Văn bản** (tên người).

#### Lý do (Reason)

Giải thích nguồn gốc hoặc lý do của yêu cầu tính năng — tham chiếu tới STRQ hoặc giải thích cụ thể. Kiểu dữ liệu: **Văn bản tự do**.

---

### 1.8.2. Thuộc tính cho STRQ (Yêu cầu của các bên liên quan)

Tương tự FEAT, **ngoại trừ** không có thuộc tính **Bản phát hành mục tiêu (Target Release)** và **Người phụ trách (Assigned To)** — vì STRQ thuộc miền vấn đề và không được lên lịch trực tiếp vào iteration:

| Thuộc tính | Kiểu dữ liệu | Giá trị cho phép |
| --- | --- | --- |
| Trạng thái (Status) | Liệt kê | Proposed / Approved / Realized / Incorporated / Validated |
| Độ ưu tiên (Priority) | Liệt kê | High / Medium / Low |
| Lợi ích (Benefit) | Liệt kê | Critical / Important / Useful |
| Công sức (Effort) | Số | Ngày-người (person-days) |
| Rủi ro (Risk) | Liệt kê | High / Medium / Low |
| Độ ổn định (Stability) | Liệt kê | High / Medium / Low |
| Lý do (Reason) | Văn bản | Tự do — ghi nhận nguồn gốc nhu cầu (ví dụ: "Phòng TCCB yêu cầu trong buổi phỏng vấn ngày 10/01") |

Ý nghĩa của từng giá trị tương tự như định nghĩa tại Mục 1.8.1.

---

### 1.8.3. Thuộc tính cho UC (Ca sử dụng)

Tương tự FEAT, **bổ sung thêm** thuộc tính **Tác nhân (Actor)**:

| Thuộc tính | Kiểu dữ liệu | Giá trị cho phép |
| --- | --- | --- |
| Trạng thái (Status) | Liệt kê | Proposed / Approved / Realized / Incorporated / Validated |
| Độ ưu tiên (Priority) | Liệt kê | High / Medium / Low |
| Lợi ích (Benefit) | Liệt kê | Critical / Important / Useful |
| Công sức (Effort) | Số | Ngày-người (person-days) |
| Rủi ro (Risk) | Liệt kê | High / Medium / Low |
| Độ ổn định (Stability) | Liệt kê | High / Medium / Low |
| Bản phát hành mục tiêu (Target Release) | Văn bản | Tên/số iteration |
| Lý do (Reason) | Văn bản | Tự do — tham chiếu tới FEAT nguồn |
| **Tác nhân (Actor)** | Văn bản | Tên tác nhân khởi tạo UC (ví dụ: "Quản trị viên", "Phòng TCCB", "Người dùng", "Hệ thống") |

Ý nghĩa của từng giá trị tương tự như định nghĩa tại Mục 1.8.1.

---

### 1.8.4. Thuộc tính cho SUPL (Yêu cầu bổ sung)

Tương tự FEAT (không có Assigned To trong tập chuẩn):

| Thuộc tính | Kiểu dữ liệu | Giá trị cho phép |
| --- | --- | --- |
| Trạng thái (Status) | Liệt kê | Proposed / Approved / Realized / Incorporated / Validated |
| Độ ưu tiên (Priority) | Liệt kê | High / Medium / Low |
| Lợi ích (Benefit) | Liệt kê | Critical / Important / Useful |
| Công sức (Effort) | Số | Ngày-người (person-days) |
| Rủi ro (Risk) | Liệt kê | High / Medium / Low |
| Độ ổn định (Stability) | Liệt kê | High / Medium / Low |
| Bản phát hành mục tiêu (Target Release) | Văn bản | Tên/số iteration |
| Lý do (Reason) | Văn bản | Tự do — tham chiếu tới FEAT hoặc STRQ nguồn |

Ý nghĩa của từng giá trị tương tự như định nghĩa tại Mục 1.8.1.

---

### 1.8.5. Bảng tổng hợp thuộc tính theo kiểu yêu cầu

| Thuộc tính | STRQ | FEAT | UC | SUPL |
| --- | :---: | :---: | :---: | :---: |
| Trạng thái (Status) | ✔ | ✔ | ✔ | ✔ |
| Độ ưu tiên (Priority) | ✔ | ✔ | ✔ | ✔ |
| Lợi ích (Benefit) | ✔ | ✔ | ✔ | ✔ |
| Công sức (Effort) | ✔ | ✔ | ✔ | ✔ |
| Rủi ro (Risk) | ✔ | ✔ | ✔ | ✔ |
| Độ ổn định (Stability) | ✔ | ✔ | ✔ | ✔ |
| Bản phát hành mục tiêu (Target Release) | — | ✔ | ✔ | ✔ |
| Người phụ trách (Assigned To) | — | ✔ | — | — |
| Lý do (Reason) | ✔ | ✔ | ✔ | ✔ |
| Tác nhân (Actor) | — | — | ✔ | — |

## 1.9. Báo cáo và chế độ xem

Phần này xác định các báo cáo sẽ được tạo ra để giám sát độ bao phủ và trạng thái của yêu cầu trong suốt vòng đời dự án.

### 1.9.1. Ma trận thuộc tính (Attribute Matrices)

Mỗi kiểu yêu cầu có một ma trận thuộc tính liệt kê toàn bộ yêu cầu thuộc kiểu đó kèm giá trị các thuộc tính:

| Ma trận | Nội dung |
| --- | --- |
| Ma trận thuộc tính STRQ | Tất cả STRQ kèm Status, Priority, Benefit, Effort, Risk, Stability, Reason |
| Ma trận thuộc tính FEAT | Tất cả FEAT kèm Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Assigned To, Reason |
| Ma trận thuộc tính UC | Tất cả UC kèm Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Reason, Actor |
| Ma trận thuộc tính SUPL | Tất cả SUPL kèm Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Reason |

### 1.9.2. Ma trận truy vết (Traceability Matrices)

Thể hiện ánh xạ giữa các yêu cầu thuộc các kiểu khác nhau:

| Ma trận | Nội dung |
| --- | --- |
| Ma trận STRQ → FEAT | Mỗi STRQ ánh xạ tới (các) FEAT mà nó dẫn xuất |
| Ma trận FEAT → UC | Mỗi FEAT ánh xạ tới (các) UC hiện thực hóa tính năng đó |
| Ma trận FEAT → SUPL | Mỗi FEAT ánh xạ tới (các) SUPL hỗ trợ tính năng đó |

### 1.9.3. Báo cáo khoảng trống (Gap Reports)

Xác định các yêu cầu thiếu truy vết — cần được xử lý trước khi kết thúc mỗi iteration:

| Báo cáo | Nội dung | Ý nghĩa |
| --- | --- | --- |
| STRQ chưa truy vết tới FEAT | Tất cả STRQ không truy vết tới bất kỳ FEAT nào | Nhu cầu bên liên quan chưa được chuyển đổi thành tính năng hệ thống |
| FEAT chưa truy vết tới UC hoặc SUPL | Tất cả FEAT không truy vết tới bất kỳ UC hoặc SUPL nào | Tính năng chưa có yêu cầu triển khai cụ thể |
| FEAT không được truy vết từ STRQ | Tất cả FEAT không được truy vết ngược từ bất kỳ STRQ nào | Tính năng thiếu căn cứ nhu cầu từ bên liên quan |
| UC không được truy vết từ FEAT | Tất cả UC không được truy vết ngược từ bất kỳ FEAT nào | Ca sử dụng thiếu căn cứ tính năng |
| SUPL không được truy vết từ FEAT | Tất cả SUPL không được truy vết ngược từ bất kỳ FEAT nào | Yêu cầu bổ sung thiếu căn cứ tính năng |

### 1.9.4. Cây truy vết (Traceability Trees)

Cung cấp chế độ xem phân cấp toàn bộ chuỗi truy vết:

| Cây truy vết | Hướng | Mô tả |
| --- | --- | --- |
| Cây truy vết từ STRQ | Từ trên xuống (top-down) | STRQ → FEAT → UC/SUPL: Từ nhu cầu bên liên quan xuống tính năng, rồi tới ca sử dụng và yêu cầu bổ sung |
| Cây truy vết tới UC | Từ dưới lên (bottom-up) | UC → FEAT → STRQ: Từ ca sử dụng ngược lên tính năng, rồi tới nhu cầu bên liên quan |
| Cây truy vết tới SUPL | Từ dưới lên (bottom-up) | SUPL → FEAT → STRQ: Từ yêu cầu bổ sung ngược lên tính năng, rồi tới nhu cầu bên liên quan |

# II. THU THẬP YÊU CẦU TỪ CÁC STAKEHOLDERS (Xác định STRQ, FEAT)

## 2.1. Xác định các STRQ, FEAT

| Yêu cầu (STRQ) | Kỹ thuật xác định FEAT | Tính năng (FEAT) |
| --- | --- | --- |
| **STRQ 1:** Cần hệ thống cho phép đăng nhập, đăng xuất, đổi mật khẩu tương tự các hệ thống phần mềm nhân sự khác, với tài khoản có phân quyền cho nhiều người dùng. | * Phân tách * Làm cho đầy đủ * Sửa chữa | * **FEAT 1.1:** Hệ thống cho phép người dùng đăng nhập bằng tài khoản. * **FEAT 1.2:** Hệ thống cho phép người dùng đăng xuất khỏi tài khoản đang sử dụng. * **FEAT 1.3:** Hệ thống tự động đăng xuất khỏi phiên làm việc nếu người dùng không thao tác với trang web trong 30 phút. * **FEAT 1.4:** Hệ thống cho phép người dùng đổi mật khẩu tài khoản đang sử dụng. |
| **STRQ 2:** Quản trị viên là người có thể quản lý tài khoản như thêm, sửa, khóa hoặc phân quyền người dùng. | * Phân tách * Thêm chi tiết * Làm cho đầy đủ | * **FEAT 2.1:** Hệ thống cho phép quản trị viên tìm kiếm tài khoản người dùng. * **FEAT 2.2:** Hệ thống cho phép quản trị viên thêm mới tài khoản người dùng. * **FEAT 2.3:** Hệ thống cho phép quản trị viên sửa tài khoản người dùng. * **FEAT 2.4:** Hệ thống cho phép quản trị viên phân quyền cho tài khoản thành viên hệ thống tương ứng với các nhóm nghiệp vụ. * **FEAT 2.5:** Hệ thống cho phép quản trị viên thay đổi trạng thái của tài khoản người dùng (Trạng thái: Khóa/Mở khóa). * **FEAT 2.6:** Hệ thống tự động khóa tài khoản của nhân sự đã thôi việc. |
| **STRQ 3:** Quản trị viên và phòng TCCB có thể quản lý cơ cấu tổ chức, thêm vào các đơn vị mới, chỉnh sửa thông tin hoặc thông báo giải thể, sáp nhập đơn vị. | * Phân tách * Làm cho đầy đủ * Thêm chi tiết * Sửa chữa | * **FEAT 3.1:** Hệ thống cung cấp cơ cấu tổ chức phân cấp đơn vị theo dạng cha-con có gốc là trường Đại học Thủy Lợi. * **FEAT 3.2:** Hệ thống cho phép quản trị viên và phòng TCCB thêm mới đơn vị tổ chức nhân sự. * **FEAT 3.3:** Hệ thống cho phép quản trị viên và phòng TCCB sửa thông tin đơn vị tổ chức nhân sự. * **FEAT 3.4:** Hệ thống cho phép quản trị viên và phòng TCCB thay đổi trạng thái của đơn vị tổ chức nhân sự (Trạng thái: Giải thể/Sáp nhập). * **FEAT 3.5:** Hệ thống cho phép quản trị viên và phòng TCCB xem chi tiết thông tin đơn vị tổ chức nhân sự. |
| **STRQ 4:** Phòng TCCB có thể điều chuyển và bổ nhiệm nhân sự vào các đơn vị. | * Phân tách * Thêm chi tiết * Làm cho đầy đủ | * **FEAT 4.1:** Hệ thống cho phép phòng TCCB bổ nhiệm nhân sự vào một đơn vị tổ chức nhân sự. * **FEAT 4.2:** Hệ thống cho phép phòng TCCB điều chuyển nhân sự sang đơn vị tổ chức nhân sự khác. * **FEAT 4.3:** Hệ thống cho phép phòng TCCB bãi nhiệm nhân sự khỏi đơn vị tổ chức đó. |
| **STRQ 5:** Phòng TCCB có thể tạo hợp đồng lao động của nhân sự. | * Thêm chi tiết | * **FEAT 5.1:** Hệ thống cho phép phòng TCCB tạo hợp đồng cho nhân sự không có hợp đồng hoặc cần gia hạn hợp đồng. |
| **STRQ 6:** Phòng TCCB có thể ghi nhận đánh giá nhân sự. | * Thêm chi tiết | * **FEAT 6.1:** Hệ thống cho phép phòng TCCB ghi đánh giá cho nhân sự (Loại đánh giá: Khen thưởng/Kỷ luật). |
| **STRQ 7:** Phòng TCCB muốn quản lý hồ sơ nhân sự như thêm, sửa hồ sơ và cho phép đánh dấu thôi việc nếu nhân sự không còn làm việc, có thêm phương pháp tìm kiếm và lọc để tiện quản lý. | * Phân tách * Làm cho rõ ràng * Thêm chi tiết * Sửa chữa * Làm cho đầy đủ | * **FEAT 7.1:** Hệ thống cho phép phòng TCCB và phòng tài chính tìm kiếm hồ sơ nhân sự bằng nhiều từ khóa. * **FEAT 7.2:** Hệ thống cho phép phòng TCCB và phòng tài chính lọc đa tiêu chí hồ sơ nhân sự. * **FEAT 7.3:** Hệ thống cho phép phòng TCCB thêm mới hồ sơ nhân sự (gồm nhập tay hoặc upload từ Excel). * **FEAT 7.4:** Hệ thống cho phép phòng TCCB chỉnh sửa hồ sơ nhân sự (thông tin cá nhân, trình độ học vấn, khen thưởng/kỷ luật, quá trình công tác, thông tin hợp đồng), bao gồm ẩn/hiện các mục khen thưởng, kỷ luật đối với các vai trò khác. * **FEAT 7.5:** Hệ thống cho phép phòng TCCB đánh dấu thôi việc nhân sự. * **FEAT 7.6:** Hệ thống tự động đánh dấu thôi việc nhân sự khi hợp đồng hết hạn quá thời gian cho phép của loại hợp đồng. * **FEAT 7.7:** Hệ thống cho phép phòng TCCB và phòng tài chính xem chi tiết hồ sơ nhân sự theo từng chế độ xem. * **FEAT 7.8:** Hệ thống cho phép phòng TCCB và phòng tài chính in hoặc xuất Excel hồ sơ nhân sự. |
| **STRQ 8:** Phòng TCCB cần hệ thống cho phép mở khóa đào tạo, quản lý khóa đào tạo cho nhân sự. | * Phân tách * Làm cho đầy đủ | * **FEAT 8.1:** Hệ thống cho phép phòng TCCB mở khóa đào tạo (cấu hình chuyên sâu về thời gian, địa điểm, chứng chỉ) cho cán bộ. * **FEAT 8.2:** Hệ thống cho phép phòng TCCB chỉnh sửa khóa đào tạo đã mở cho cán bộ tùy theo trạng thái chưa diễn ra hay đang diễn ra, bao gồm thay đổi trạng thái khóa đào tạo (Đang mở đăng ký → Đang đào tạo → Đã hoàn thành). * **FEAT 8.3:** Hệ thống cho phép phòng TCCB xem thông tin khóa đào tạo đã mở cho cán bộ kèm danh sách người đã đăng ký. * **FEAT 8.4:** Hệ thống cho phép phòng TCCB ghi nhận kết quả đào tạo cho cán bộ đã tham gia và lưu trực tiếp chứng chỉ vào hồ sơ nhân sự. |
| **STRQ 9:** Phòng TCCB có thể cấu hình lương, loại phụ cấp, loại hợp đồng. | * Phân tách * Làm cho đầy đủ | * **FEAT 9.1:** Hệ thống cho phép phòng TCCB thêm mới hệ số lương (Hệ số lương được thêm sẽ được dùng làm thông tin cho hồ sơ). * **FEAT 9.2:** Hệ thống cho phép phòng TCCB sửa thông tin đối với hệ số lương mới được tạo phục vụ sửa chữa nhập liệu lỗi. * **FEAT 9.3:** Hệ thống cho phép phòng TCCB xóa hệ số lương khi không được hồ sơ nào sử dụng, hoặc thay đổi trạng thái (đưa vào trạng thái ngừng sử dụng hoặc kích hoạt lại) nếu đã được sử dụng. * **FEAT 9.4:** Hệ thống cho phép phòng TCCB cấu hình (Thêm/Sửa/Thay đổi trạng thái) danh mục loại phụ cấp. * **FEAT 9.5:** Hệ thống cho phép phòng TCCB cấu hình (Thêm/Sửa/Thay đổi trạng thái) danh mục loại hợp đồng. |

> **Ghi chú thiết kế – FEAT 9.4/9.5:** Danh mục loại phụ cấp và loại hợp đồng chỉ hỗ trợ thao tác "Thay đổi trạng thái" (chuyển đổi giữa "Đang sử dụng" và "Ngừng sử dụng") mà không hỗ trợ "Xóa" (khác với hệ số lương ở FEAT 9.3 có hỗ trợ xóa khi chưa được sử dụng). Thiết kế này nhằm đảm bảo tính toàn vẹn dữ liệu và phục vụ kiểm toán – các loại phụ cấp/hợp đồng đã từng được sử dụng trong hệ thống cần được lưu giữ lịch sử.

| Yêu cầu (STRQ) | Kỹ thuật xác định FEAT | Tính năng (FEAT) |
| --- | --- | --- |
| **STRQ 10:** Phòng tài chính và TCCB muốn thống kê chi tiết về nhân sự. | * Phân tách * Thêm chi tiết | * **FEAT 10.1:** Hệ thống cho phép phòng TCCB và phòng tài chính xem và xuất thống kê tổng quan nhân sự và biến động nhân sự. * **FEAT 10.2:** Hệ thống cho phép phòng TCCB và phòng tài chính xem và xuất cơ cấu nhân sự theo đơn vị, trình độ, học hàm, chức danh. * **FEAT 10.3:** Hệ thống cho phép phòng TCCB và phòng tài chính xem và xuất thống kê hợp đồng, tình trạng làm việc, đánh giá cán bộ. * **FEAT 10.4:** Hệ thống cho phép phòng TCCB và phòng tài chính xem và xuất thống kê đào tạo, phát triển, bổ nhiệm nhân sự. |
| **STRQ 11:** Người dùng phần mềm có thể xem hồ sơ cá nhân, xem thông tin đơn vị đang công tác và thực hiện các luồng tác vụ cá nhân. | * Phân tách * Làm cho rõ ràng * Thêm chi tiết | * **FEAT 11.1:** Hệ thống cho phép người dùng xem thông tin cá nhân của bản thân. * **FEAT 11.2:** Hệ thống cho phép người dùng xem thông tin đơn vị mình đang công tác và cơ cấu các thành phần đơn vị trực thuộc. * **FEAT 11.3:** Hệ thống cho phép người dùng đăng ký hoặc hủy đăng ký tham gia khóa học/đào tạo được nhà trường phê duyệt mở. * **FEAT 11.4:** Hệ thống cho phép người dùng xem danh sách các khóa đào tạo đã đăng ký và lịch sử đào tạo đã tham gia. |
| **STRQ 12:** Hệ thống yêu cầu tự động log dấu vết hoạt động người dùng và đảm bảo an ninh (System Logging). | * Phân tách | * **FEAT 12.1:** Hệ thống tự động ghi vết tất cả các tác vụ truy cập tài khoản, thay đổi/cập nhật hệ thống hoặc dữ liệu. * **FEAT 12.2:** Hệ thống cho phép quản trị viên truy xuất xem và xuất Audit log (Nhật ký hệ thống) nhằm truy vết hoạt động. |

> **Ghi chú thiết kế – FEAT 7.1/7.2/7.7/7.8:** STRQ 7 chỉ đề cập phòng TCCB, nhưng các FEAT 7.1, 7.2, 7.7, 7.8 bổ sung thêm "phòng tài chính" với vai trò chỉ-đọc (tìm kiếm, lọc, xem, in/xuất) nhằm phục vụ nghiệp vụ đối soát lương – phụ cấp mà không cho phép phòng tài chính chỉnh sửa hồ sơ. Kỹ thuật áp dụng: *Làm cho đầy đủ* (Completion).

## 2.2. Ma trận thuộc tính STRQ

> Mô tả chi tiết của từng STRQ được trình bày tại Mục 2.1. Ý nghĩa các giá trị thuộc tính được định nghĩa tại Mục 1.8.2.

| STRQ | Status | Priority | Benefit | Risk | Stability | Effort (ngày-người) | Reason |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| STRQ 1 | Approved | High | Critical | Low | High | 5 | Yêu cầu cơ bản — xác thực và bảo mật phiên làm việc |
| STRQ 2 | Approved | High | Critical | Low | High | 8 | Yêu cầu quản trị hệ thống — quản lý tài khoản và phân quyền |
| STRQ 3 | Approved | High | Critical | Medium | Medium | 10 | Phỏng vấn Phòng TCCB và Quản trị viên — quản lý cơ cấu tổ chức |
| STRQ 4 | Approved | High | Important | Medium | Medium | 5 | Phỏng vấn Phòng TCCB — nghiệp vụ bổ nhiệm và điều chuyển |
| STRQ 5 | Approved | High | Critical | Medium | Medium | 5 | Phỏng vấn Phòng TCCB — quản lý hợp đồng lao động |
| STRQ 6 | Approved | Medium | Important | Low | High | 3 | Phỏng vấn Phòng TCCB — đánh giá khen thưởng / kỷ luật |
| STRQ 7 | Approved | High | Critical | Medium | Medium | 20 | Phỏng vấn Phòng TCCB — quản lý toàn diện hồ sơ nhân sự |
| STRQ 8 | Approved | Medium | Important | Medium | Medium | 12 | Phỏng vấn Phòng TCCB — quản lý đào tạo và phát triển nhân sự |
| STRQ 9 | Approved | High | Important | Low | High | 8 | Phỏng vấn Phòng TCCB — cấu hình tham chiếu hệ thống (lương, phụ cấp, hợp đồng) |
| STRQ 10 | Approved | Medium | Important | Medium | Low | 10 | Phỏng vấn Phòng TCCB và Phòng TCKT — báo cáo thống kê phục vụ quản lý |
| STRQ 11 | Approved | Medium | Useful | Low | High | 6 | Phỏng vấn người dùng cuối — tự phục vụ thông tin cá nhân |
| STRQ 12 | Approved | High | Critical | Low | High | 5 | Yêu cầu bảo mật — ghi vết hoạt động hệ thống và kiểm toán |

## 2.3. Ma trận thuộc tính FEAT

> Mô tả chi tiết của từng FEAT được trình bày tại Mục 2.1. Ý nghĩa các giá trị thuộc tính được định nghĩa tại Mục 1.8.1. Cột "Assigned To" sử dụng tên nhóm chức năng — thay bằng tên cá nhân cụ thể khi có phân công chính thức.

| FEAT | Status | Priority | Benefit | Risk | Stability | Effort (ngày-người) | Target Release | Assigned To | Reason |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| FEAT 1.1 | Approved | High | Critical | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 1 |
| FEAT 1.2 | Approved | High | Critical | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 1 |
| FEAT 1.3 | Approved | Medium | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 1 |
| FEAT 1.4 | Approved | High | Critical | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 1 |
| FEAT 2.1 | Approved | High | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 2 |
| FEAT 2.2 | Approved | High | Critical | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 2 |
| FEAT 2.3 | Approved | High | Critical | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 2 |
| FEAT 2.4 | Approved | High | Critical | Medium | Medium | 5 | Iteration 1 | Team 1 (BA) | STRQ 2 |
| FEAT 2.5 | Approved | High | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 2 |
| FEAT 2.6 | Approved | Medium | Important | Medium | Medium | 3 | Iteration 2 | Team 1 (BA) | STRQ 2 |
| FEAT 3.1 | Approved | High | Critical | Medium | Medium | 5 | Iteration 1 | Team 1 (BA) | STRQ 3 |
| FEAT 3.2 | Approved | High | Critical | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 3 |
| FEAT 3.3 | Approved | High | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 3 |
| FEAT 3.4 | Approved | Medium | Important | Medium | Medium | 3 | Iteration 1 | Team 1 (BA) | STRQ 3 |
| FEAT 3.5 | Approved | High | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 3 |
| FEAT 4.1 | Approved | High | Critical | Medium | Medium | 3 | Iteration 2 | Team 1 (BA) | STRQ 4 |
| FEAT 4.2 | Approved | High | Critical | Medium | Medium | 2 | Iteration 2 | Team 1 (BA) | STRQ 4 |
| FEAT 4.3 | Approved | High | Important | Medium | Medium | 3 | Iteration 2 | Team 1 (BA) | STRQ 4 |
| FEAT 5.1 | Approved | High | Critical | Medium | Medium | 5 | Iteration 2 | Team 1 (BA) | STRQ 5 |
| FEAT 6.1 | Approved | Medium | Important | Low | High | 3 | Iteration 2 | Team 1 (BA) | STRQ 6 |
| FEAT 7.1 | Approved | High | Critical | Low | High | 3 | Iteration 2 | Team 1 (BA) | STRQ 7 |
| FEAT 7.2 | Approved | High | Important | Low | Medium | 3 | Iteration 2 | Team 1 (BA) | STRQ 7 |
| FEAT 7.3 | Approved | High | Critical | Medium | Medium | 8 | Iteration 2 | Team 1 (BA) | STRQ 7 |
| FEAT 7.4 | Approved | High | Critical | Medium | Medium | 8 | Iteration 2 | Team 1 (BA) | STRQ 7 |
| FEAT 7.5 | Approved | High | Important | Low | High | 2 | Iteration 2 | Team 1 (BA) | STRQ 7 |
| FEAT 7.6 | Approved | Medium | Important | Medium | Medium | 4 | Iteration 3 | Team 1 (BA) | STRQ 7 |
| FEAT 7.7 | Approved | High | Critical | Low | High | 3 | Iteration 2 | Team 1 (BA) | STRQ 7 |
| FEAT 7.8 | Approved | Medium | Important | Medium | High | 5 | Iteration 3 | Team 1 (BA) | STRQ 7 |
| FEAT 8.1 | Approved | Medium | Important | Medium | Medium | 5 | Iteration 3 | Team 1 (BA) | STRQ 8 |
| FEAT 8.2 | Approved | Medium | Important | Medium | Medium | 4 | Iteration 3 | Team 1 (BA) | STRQ 8 |
| FEAT 8.3 | Approved | Medium | Useful | Low | High | 2 | Iteration 3 | Team 1 (BA) | STRQ 8 |
| FEAT 8.4 | Approved | Medium | Important | Medium | Medium | 4 | Iteration 3 | Team 1 (BA) | STRQ 8 |
| FEAT 9.1 | Approved | High | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 9 |
| FEAT 9.2 | Approved | High | Important | Low | High | 2 | Iteration 1 | Team 1 (BA) | STRQ 9 |
| FEAT 9.3 | Approved | High | Important | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 9 |
| FEAT 9.4 | Approved | High | Important | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 9 |
| FEAT 9.5 | Approved | High | Important | Low | High | 3 | Iteration 1 | Team 1 (BA) | STRQ 9 |
| FEAT 10.1 | Approved | Medium | Important | Medium | Low | 3 | Iteration 3 | Team 1 (BA) | STRQ 10 |
| FEAT 10.2 | Approved | Medium | Important | Medium | Low | 3 | Iteration 3 | Team 1 (BA) | STRQ 10 |
| FEAT 10.3 | Approved | Medium | Medium | Medium | Low | 2 | Iteration 3 | Team 1 (BA) | STRQ 10 |
| FEAT 10.4 | Approved | Medium | Low | Medium | Low | 2 | Iteration 3 | Team 1 (BA) | STRQ 10 |
| FEAT 11.1 | Approved | Medium | Useful | Low | High | 3 | Iteration 4 | Team 1 (BA) | STRQ 11 |
| FEAT 11.2 | Approved | Medium | Useful | Low | High | 2 | Iteration 4 | Team 1 (BA) | STRQ 11 |
| FEAT 11.3 | Approved | Medium | Useful | Low | High | 3 | Iteration 4 | Team 1 (BA) | STRQ 11 |
| FEAT 11.4 | Approved | Low | Useful | Low | High | 2 | Iteration 4 | Team 1 (BA) | STRQ 11 |
| FEAT 12.1 | Approved | High | Critical | Medium | High | 5 | Iteration 1 | Team 1 (BA) | STRQ 12 |
| FEAT 12.2 | Approved | High | Important | Low | High | 3 | Iteration 4 | Team 1 (BA) | STRQ 12 |

**Tổng hợp phân bổ theo iteration:**

| Iteration | Số FEAT | Tổng Effort (ngày-người) | Trọng tâm |
| --- | ---: | ---: | --- |
| Iteration 1 | 20 | 57 | Xác thực, quản lý tài khoản, cơ cấu tổ chức, danh mục cấu hình, hạ tầng ghi vết |
| Iteration 2 | 12 | 46 | Quản lý hồ sơ nhân sự, hợp đồng, đánh giá, điều chuyển / bổ nhiệm |
| Iteration 3 | 10 | 34 | Đào tạo, báo cáo thống kê, tính năng tự động, xuất dữ liệu |
| Iteration 4 | 5 | 13 | Tự phục vụ cá nhân, xem nhật ký hệ thống |
| **Tổng** | **47** | **150** | |

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
* UC Điều chuyển nhân sự (Bổ nhiệm nhân sự vào đơn vị, Điều chuyển nhân sự sang đơn vị khác, Bãi nhiệm nhân sự khỏi đơn vị)

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
* UC Thay đổi trạng thái đăng ký khóa đào tạo
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
  + Nhóm UC Cá nhân (Self-service): Xem hồ sơ cá nhân, Xem đơn vị công tác, Thay đổi trạng thái đăng ký đào tạo, Xem khóa đào tạo đã đăng ký *(kế thừa quyền Người dùng)*

**b. Phân rã cho Phòng Tổ chức - Cán bộ**

* **Tác nhân**: Phòng Tổ chức - Cán bộ
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Nhóm UC Quản lý hồ sơ nhân sự (Thêm/Sửa/Đánh dấu thôi việc/Lọc tìm)
  + Nhóm UC Quản lý hợp đồng (Thêm)
  + Điều chuyển nhân sự (Bổ nhiệm/Điều chuyển/Bãi nhiệm)
  + Ghi nhận đánh giá (Khen thưởng / Kỷ luật)
  + Nhóm UC Quản lý khóa đào tạo & kết quả
  + Nhóm UC Cấu hình danh mục (lương, phụ cấp, HD)
  + Nhóm UC Quản lý Đơn vị tổ chức (Thêm mới, Sửa thông tin, Thay đổi trạng thái, Xem chi tiết)
  + Xem báo cáo thống kê
  + Nhóm UC Cá nhân (Self-service): Xem hồ sơ cá nhân, Xem đơn vị công tác, Thay đổi trạng thái đăng ký đào tạo, Xem khóa đào tạo đã đăng ký *(kế thừa quyền Người dùng)*

**c. Phân rã cho Phòng Tài chính - Kế toán**

* **Tác nhân**: Phòng Tài chính - Kế toán
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Chế độ xem: Tìm kiếm, Xem và Lọc chi tiết hồ sơ nhân sự
  + Xem chi tiết các thống kê
  + Nhóm UC Cá nhân (Self-service): Xem hồ sơ cá nhân, Xem đơn vị công tác, Thay đổi trạng thái đăng ký đào tạo, Xem khóa đào tạo đã đăng ký *(kế thừa quyền Người dùng)*

**d. Phân rã cho Người dùng (Cán bộ/Giảng viên/Nhân viên)**

* **Tác nhân**: Người dùng
* **Các Use Case liên kết**:
  + Đăng nhập / Đăng xuất / Đổi mật khẩu
  + Xem hồ sơ cá nhân
  + Xem thông tin chi tiết đơn vị công tác
  + Thay đổi trạng thái đăng ký đào tạo
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
| FEAT 4.1 | UC 4.30 (Bổ nhiệm nhân sự vào đơn vị tổ chức nhân sự) |
| FEAT 4.2 | UC 4.30 (Điều chuyển nhân sự sang đơn vị tổ chức nhân sự khác) |
| FEAT 4.3 | UC 4.31 (Bãi nhiệm nhân sự khỏi đơn vị tổ chức nhân sự) |
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
| FEAT 10.1 | UC 4.37 (Thống kê tổng quan nhân sự và biến động nhân sự) |
| FEAT 10.2 | UC 4.37 (Cơ cấu nhân sự theo đơn vị, trình độ, học hàm, chức danh) |
| FEAT 10.3 | UC 4.37 (Hợp đồng, tình trạng làm việc, đánh giá cán bộ) |
| FEAT 10.4 | UC 4.37 (Đào tạo, phát triển, bổ nhiệm nhân sự) |
| FEAT 11.1 | UC 4.38 (Xem các thông tin trong hồ sơ cá nhân của nhân sự) |
| FEAT 11.2 | UC 4.39 (Xem thông tin chi tiết đơn vị đang công tác) |
| FEAT 11.3 | UC 4.40 (Thay đổi trạng thái đăng ký khóa đào tạo) |
| FEAT 11.4 | UC 4.41 (Xem danh sách các khóa đào tạo đã đăng ký) |
| FEAT 12.1 | SUPL Ghi nhật ký (auto logging) |
| FEAT 12.2 | UC 4.42 (Xem nhật ký hệ thống — Audit Log) — truy xuất |

# IV. Luồng sự kiện và các UCs chính

[uc1-10.md](./uc1-10.md)

[uc11-20.md](./uc11-20.md)

[uc21-30.md](./uc21-30.md)

[uc31-42.md](./uc31-42.md)


