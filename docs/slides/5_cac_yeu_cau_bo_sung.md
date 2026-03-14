# Phân Tích Yêu Cầu Phần Mềm - Đặc Tả Yêu Cầu Bổ Sung

> **Tác giả:** Nguyễn Thị Thu Hương (huongnt@tlu.edu.vn)
> **Nguồn:** Slide bài giảng "5. Các yêu cầu bổ sung" - 55 slides

---

## Mục Lục

1. [Giới thiệu & Khái niệm cơ bản](#1-giới-thiệu--khái-niệm-cơ-bản)
2. [Định nghĩa & Thách thức của NFR](#2-định-nghĩa--thách-thức-của-nfr)
3. [Tinh chỉnh & Phân loại yêu cầu](#3-tinh-chỉnh--phân-loại-yêu-cầu)
4. [Độ đo & Mức độ thỏa mãn](#4-độ-đo--mức-độ-thỏa-mãn)
5. [Mô hình chất lượng](#5-mô-hình-chất-lượng)
6. [Độ đo triển khai](#6-độ-đo-triển-khai)
7. [Softgoals & Tài liệu SRS](#7-softgoals--tài-liệu-srs)
8. [Yêu cầu & Kiểm thử](#8-yêu-cầu--kiểm-thử)

---

## 1. Giới thiệu & Khái niệm cơ bản

### Slide 1 - Trang bìa
- **Môn học:** Phân tích yêu cầu phần mềm
- **Chủ đề:** Đặc tả yêu cầu bổ sung (Supplementary Requirements Specification)

### Slide 2 - Nội dung chính
- Các khái niệm cơ bản (Basic concepts)
- Thiết lập độ đo (Setting metrics)
- Các yếu tố và tiêu chuẩn (Factors and standards)

### Slide 3 - Kim tự tháp yêu cầu (Requirement Pyramid)

```
        Needs (Nhu cầu)
           ↓
        Features (Tính năng)
           ↓
        Use Cases (Ca sử dụng)
           ↓
        Scenarios (Kịch bản)
           ↓
        Test Cases (Ca kiểm thử)
```

- **Yêu cầu bổ sung (Supplementary Requirements)** nằm ngoài luồng Use Case chính nhưng liên kết tới Features
- Các yêu cầu bổ sung không được nắm bắt qua Use Case nhưng vẫn cần thiết cho hệ thống

### Slide 4 - Yêu cầu phi chức năng (Non-Functional Requirements - NFRs)
- **Các yếu tố chất lượng** (Quality factors)
- **Tiêu chuẩn thiết kế** (Design standards)
- **Độ đo** (Metrics)
- **Hai hướng tiếp cận:**
  - **Hướng sản phẩm (Product-oriented):** Dựa trên các yếu tố chất lượng
  - **Hướng quy trình (Process-oriented):** Phân tích softgoal để tìm sự đánh đổi (trade-offs)

### Slide 5 - Yêu cầu chức năng (Functional Requirements)
- Mô tả các hành động của hệ thống
- Được nắm bắt qua: **Use Cases**, **DFDs** (Data Flow Diagrams), hoặc **State Diagrams**
- Bao gồm cả **xử lý lỗi** (error handling)

---

## 2. Định nghĩa & Thách thức của NFR

### Slide 6 - Định nghĩa NFR
- NFR là các **ràng buộc về hoạt động của hệ thống** (constraints on system operation)
- Ví dụ: chi phí, hiệu năng, độ tin cậy, các thuộc tính "-ility"
- Thường **không được liệt kê tại một vị trí duy nhất** trong chương trình

### Slide 7 - Thách thức trong thu thập NFR
- Khách hàng thường **quên** đề cập NFR
- Khách hàng **không hiểu** chi phí kỹ thuật liên quan
- NFR **khó đo lường** (hard to measure)

### Slide 8 - Suy luận NFR (Inferring NFRs)
Quy trình:
1. Liệt kê các loại NFR
2. Đặt câu hỏi về tác động/chi phí
3. Lấy phản hồi từ khách hàng
4. Gán **độ ưu tiên/trọng số** cho từng NFR

### Slide 9 - Các loại yêu cầu bổ sung
| Loại | Mô tả |
|------|--------|
| **Functional** (không thuộc UC) | Yêu cầu chức năng không nắm bắt qua Use Case |
| **Usability** | Tính dễ sử dụng |
| **Reliability** | Độ tin cậy |
| **Performance** | Hiệu năng |
| **Supportability** | Khả năng hỗ trợ |
| **Design Constraints** | Ràng buộc thiết kế |
| **Implementation** | Ràng buộc triển khai |
| **Physical** | Ràng buộc vật lý |
| **Licensing/Legal** | Bản quyền/pháp lý |

> **Ghi nhớ:** Phân loại theo mô hình **FURPS+** (Functionality, Usability, Reliability, Performance, Supportability + các ràng buộc)

### Slide 10 - Khó khăn khi làm việc với NFR
- Khó **mô hình hóa** (hard to model)
- Thường ở dạng **không chính thức/mâu thuẫn** (informal/conflicting)
- Khó tạo ra **tiêu chuẩn đo lường** (measurable standards)

### Slide 11-12 - Suy luận từ Features
- Ánh xạ các tính năng không được UC bao phủ sang đặc tả bổ sung
- **Ví dụ:**
  - Tab giao diện cho các chức năng chính
  - Hành vi mặc định của nút "Next"
  - Các quy tắc nghiệp vụ chung áp dụng cho nhiều UC

---

## 3. Tinh chỉnh & Phân loại yêu cầu

### Slide 13 - Tinh chỉnh yêu cầu (Refining Requirements)
- Tính năng chung cần được tinh chỉnh thành **độ đo chính xác**
- **Ví dụ:**
  - ❌ "Hệ thống hoạt động 24 giờ" (quá chung)
  - ✅ "Hoạt động 24/7, MTBF > 20h, availability > 99.93%"

### Slide 14-15 - Phân cấp phân loại NFR

```
NFR Classification
├── Product Requirements (Yêu cầu sản phẩm)
│   ├── Efficiency (Hiệu quả)
│   │   ├── Performance (Hiệu năng)
│   │   └── Space (Không gian)
│   ├── Reliability (Độ tin cậy)
│   ├── Portability (Tính di động)
│   └── Usability (Tính dễ sử dụng)
│
├── Organizational Requirements (Yêu cầu tổ chức)
│   ├── Implementation (Triển khai)
│   ├── Operations (Vận hành)
│   └── Standards (Tiêu chuẩn)
│
└── External Requirements (Yêu cầu bên ngoài)
    ├── Ethical (Đạo đức)
    ├── Legal (Pháp lý)
    │   ├── Privacy (Quyền riêng tư)
    │   └── Safety (An toàn)
    └── Interoperability (Tương tác)
```

### Slide 16 - Ví dụ LIBSYS
> "Giao diện được triển khai bằng HTML đơn giản, không sử dụng frames hoặc Java applets."

- Đây là ví dụ về **ràng buộc triển khai** (implementation constraint)

---

## 4. Độ đo & Mức độ thỏa mãn

### Slide 17 - Bảng thuộc tính và độ đo

| Thuộc tính (Property) | Độ đo (Measure) |
|------------------------|------------------|
| **Speed** (Tốc độ) | Transactions/second (Giao dịch/giây) |
| **Size** (Kích thước) | KB |
| **Ease of Use** (Dễ sử dụng) | Training time (Thời gian đào tạo) |
| **Reliability** (Độ tin cậy) | MTBF (Mean Time Between Failures) |
| **Robustness** (Tính bền vững) | Restart time (Thời gian khởi động lại) |
| **Portability** (Tính di động) | % target-dependent code (% mã phụ thuộc nền tảng) |

### Slide 18 - Lưu ý
- NFR có thể là **tùy chọn/bỏ qua** nếu không áp dụng cho hệ thống cụ thể

### Slide 19 - Bảng hiệu năng theo số người dùng

| Số người dùng đồng thời | Thời gian giao dịch tối đa |
|--------------------------|----------------------------|
| 0 - 10 | 1 giây |
| 11 - 50 | 2 giây |
| 51 - 100 | 5 giây |
| > 100 | 10 giây |

### Slide 20 - Mức độ quan trọng

| Mức độ | Ý nghĩa |
|--------|----------|
| **Mandatory** (Bắt buộc) | Phải có, không thể thiếu |
| **Expected/Desirable** (Mong đợi) | Nên có, được kỳ vọng |
| **Nice to have** (Có thì tốt) | Tùy chọn, không bắt buộc |

### Slide 21-22 - Sự thỏa mãn của khách hàng
- **Thỏa mãn cao** đến từ:
  - Đáp ứng đúng mô tả yêu cầu
  - Vượt kỳ vọng về độ đo
- **Ví dụ:**
  - Sắp xếp thời gian thực (real-time sorting)
  - Báo cáo được tạo trong **< 20 giây**
- Mức độ thỏa mãn liên quan đến khả năng đáp ứng metrics cụ thể

---

## 5. Mô hình chất lượng (Quality Models)

### Slide 23-26 - Hai cách tiếp cận
- **Định lượng (Quantitative):** Tính toán metrics cụ thể
- **Định tính (Qualitative):** Khám phá các trade-offs

### Slide 27-28 - Yếu tố vs Tiêu chuẩn
- **Factors (Yếu tố):** Liên quan đến khách hàng
  - Tốc độ, độ tin cậy, tính dễ sử dụng
- **Standards/Criteria (Tiêu chuẩn):** Liên quan đến kỹ thuật
  - Xử lý ngoại lệ, tính ổn định, tính module

### Slide 29-30 - Mô hình Boehm & McCall

**Mô hình McCall** - Ba góc nhìn chính:
```
Product Operation (Vận hành)
├── Correctness (Tính đúng đắn)
├── Reliability (Độ tin cậy)
├── Efficiency (Hiệu quả)
├── Integrity (Tính toàn vẹn)
└── Usability (Tính dễ sử dụng)

Product Revision (Sửa đổi)
├── Maintainability (Khả năng bảo trì)
├── Flexibility (Tính linh hoạt)
└── Testability (Khả năng kiểm thử)

Product Transition (Chuyển đổi)
├── Portability (Tính di động)
├── Reusability (Khả năng tái sử dụng)
└── Interoperability (Tương tác)
```

**Mô hình Boehm:**
```
Utility (Tiện ích)
├── As-is utility
│   ├── Reliability (Độ tin cậy)
│   ├── Efficiency (Hiệu quả)
│   └── Human Engineering
├── Maintainability (Khả năng bảo trì)
│   ├── Testability
│   ├── Understandability
│   └── Modifiability
└── Portability (Tính di động)
```

**Tiêu chí kỹ thuật:** Device independence, Accuracy, Modularity, Completeness, Consistency

---

## 6. Độ đo triển khai (Implementation Metrics)

### Slide 31-33 - Thiết lập "Tiêu chí thỏa mãn" (Criteria for Satisfaction)
- Chuyển đổi yêu cầu mơ hồ thành tiêu chí đo lường được
- **Ví dụ ATM:**
  - ❌ "Phần mềm ATM phải trực quan" (vague)
  - ✅ "95% người dùng có thể rút tiền/chuyển khoản trong 2 phút ở lần sử dụng đầu tiên"

### Slide 34 - Đại diện (Proxies)
- Sử dụng các đại lượng đo lường thay thế khi NFR khó đo trực tiếp:

| NFR gốc | Proxy đo lường |
|----------|----------------|
| **Security** (Bảo mật) | Số lượng mức mật khẩu |
| **Usability** (Dễ sử dụng) | Khối lượng tài liệu đào tạo |

### Slide 35-37 - Các nhóm NFR phổ biến (theo ISO 25010)

| Nhóm | Thuộc tính con |
|------|----------------|
| **Performance** | Speed (Tốc độ), Capacity (Dung lượng) |
| **Compatibility** | Tương thích với hệ thống khác |
| **Usability** | Dễ học, dễ sử dụng |
| **Reliability** | Fault tolerance (Chịu lỗi), Availability |
| **Security** | Integrity (Toàn vẹn), Authentication (Xác thực) |
| **Maintainability** | Modularity (Module hóa), Testability (Kiểm thử được) |
| **Portability** | Adaptability (Thích ứng), Installability |

---

## 7. Softgoals & Tài liệu SRS

### Slide 38-41 - Softgoals
- **Softgoal** = NFR được thỏa mãn **một phần** hoặc liên quan đến **trade-offs**
- NFR định nghĩa **sự thành công** của hệ thống
- **Sơ đồ ví dụ:** Sự thoải mái của hành khách (passenger comfort) vs. chi phí (cost) vs. an toàn (safety)
- Các softgoal có thể xung đột lẫn nhau → cần đánh giá đánh đổi

### Slide 42 - Ví dụ phân biệt FR vs NFR

| Loại | Ví dụ |
|------|-------|
| **Functional** | Server gửi email |
| **NFR** | Độ trễ email < 24h |
| **NFR → Functional** | Encryption (NFR) → dẫn đến yêu cầu Hashing (Functional) |

### Slide 43 - Mối quan hệ NFR → FR
- Một NFR có thể dẫn đến việc sinh ra các yêu cầu chức năng mới
- Ví dụ: Yêu cầu bảo mật (NFR) → yêu cầu mã hóa dữ liệu (FR mới)

### Slide 44-45 - Bảng đặc tả bổ sung (Supplementary Spec Table)

| Cột | Mô tả |
|-----|--------|
| **Quality Factor** | Yếu tố chất lượng (ví dụ: Performance, Security) |
| **Metric** | Độ đo cụ thể (ví dụ: response time, transactions/sec) |
| **Acceptance Criteria** | Tiêu chí chấp nhận (ví dụ: < 2 giây, > 99.9% uptime) |

- Bao gồm bài tập nhóm: xác định quality factors và metrics cho hệ thống

---

## 8. Yêu cầu & Kiểm thử (Requirements & Testing)

### Slide 46-48 - Kiểm thử như phương pháp xác minh

> ⚠️ **"Một yêu cầu không kiểm thử được thì không phải là yêu cầu tốt."**
> *(A requirement that cannot be tested is not a good requirement.)*

- Kiểm thử là cách **xác minh** (verify) rằng yêu cầu đã được thực hiện đúng
- Mỗi yêu cầu (cả FR và NFR) cần có test case tương ứng

### Slide 49-51 - Kiểm thử chức năng vs phi chức năng

**Vòng đời kiểm thử chức năng:**
```
Analyze (Phân tích) → Plan (Lập kế hoạch) → Design (Thiết kế) 
→ Execution (Thực thi) → Defect Management (Quản lý lỗi) → Coverage (Độ bao phủ)
```

**Các loại kiểm thử phi chức năng:**

| Loại kiểm thử | Mục đích |
|----------------|----------|
| **Security Testing** | Kiểm tra bảo mật |
| **Load Testing** | Kiểm tra tải |
| **Stress Testing** | Kiểm tra áp lực |
| **Volume Testing** | Kiểm tra khối lượng dữ liệu |
| **Scalability Testing** | Kiểm tra khả năng mở rộng |
| **Usability Testing** | Kiểm tra tính dễ sử dụng |
| **Stability Testing** | Kiểm tra tính ổn định |

### Slide 52-55 - Tổng kết & Bài tập

- **Phần mềm chất lượng** đòi hỏi tích hợp cả kiểm thử chức năng và phi chức năng
- Kiểm thử phi chức năng thường bị bỏ qua nhưng rất quan trọng
- **Bài tập nhóm:**
  - Xác định các yếu tố chất lượng (quality factors) cho hệ thống
  - Thiết lập metrics cho từng yếu tố
  - Xây dựng tiêu chí chấp nhận
  - Chuẩn bị cho kiểm thử

---

## Tóm tắt kiến thức quan trọng

### Các khái niệm cốt lõi

1. **Yêu cầu bổ sung** = Các yêu cầu không được nắm bắt qua Use Case, bao gồm cả yêu cầu chức năng bổ sung và yêu cầu phi chức năng
2. **NFR** phải được **lượng hóa** thành metrics cụ thể, không để ở dạng mô tả chung
3. **FURPS+** là mô hình phân loại NFR phổ biến: Functionality, Usability, Reliability, Performance, Supportability + ràng buộc
4. **Softgoals** thể hiện sự thỏa hiệp giữa các NFR xung đột
5. **Mọi yêu cầu phải kiểm thử được** - nếu không kiểm thử được thì không phải yêu cầu tốt

### Quy trình xử lý NFR

```
1. Thu thập (Gather)     → Liệt kê các loại NFR, phỏng vấn khách hàng
2. Phân loại (Classify)  → Theo FURPS+ hoặc ISO 25010
3. Tinh chỉnh (Refine)   → Từ mô tả chung → metrics cụ thể
4. Ưu tiên (Prioritize)  → Mandatory / Expected / Nice to have
5. Đặc tả (Specify)      → Supplementary Specification document
6. Kiểm thử (Test)       → Security, Load, Stress, Usability testing...
```

### Mô hình chất lượng chính

| Mô hình | Đặc điểm |
|---------|-----------|
| **McCall** | 3 góc nhìn: Product Operation, Revision, Transition |
| **Boehm** | Phân cấp: Utility → Maintainability → Portability |
| **ISO 25010** | 8 đặc tính: Performance, Compatibility, Usability, Reliability, Security, Maintainability, Portability, Functional Suitability |
| **FURPS+** | 5 yếu tố + ràng buộc bổ sung |
