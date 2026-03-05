# 3.1. Biểu đồ thực thể - quan hệ (ERD) — Ký pháp Chen

## Mô tả

Biểu đồ thực thể - quan hệ (Entity-Relationship Diagram) ở mức **khái niệm** (conceptual level) cho hệ thống Quản lý Nhân sự, sử dụng ký pháp Chen (Chen's notation) được vẽ thủ công bằng các hình cơ bản của PlantUML.

- **Nguồn dữ liệu**: `system-spec.md` §5.1 và `domain-model-class-diagram.md`
- **Tổng số thực thể**: 5 (chỉ các thực thể nghiệp vụ cốt lõi)
- **Tổng số quan hệ**: 4 (bao gồm 1 quan hệ M:N chưa phân rã)
- **Ký hiệu**:
  - 🟦 Hình chữ nhật xanh = Thực thể (Entity)
  - 🟩 Hình thoi xanh lá = Quan hệ (Relationship)
  - ⬜ Hình elip trắng = Thuộc tính (Attribute); gạch chân = Khóa chính (PK)

## Quy ước

| Ký hiệu | Hình dạng PlantUML | Ý nghĩa |
|---|---|---|
| `rectangle` | Hình chữ nhật | Thực thể (Entity) |
| `hexagon` | Lục giác (thay cho hình thoi) | Quan hệ (Relationship) |
| `usecase` | Hình elip | Thuộc tính (Attribute) |
| `<u>tên</u>` | Gạch chân | Khóa chính (Primary Key) |
| `1`, `N`, `M` | Ký số trên đường nối | Cardinality |

> **Lưu ý**: PlantUML không hỗ trợ từ khóa `diamond`. Biểu đồ sử dụng `hexagon` (lục giác) thay cho hình thoi trong ký pháp Chen.

## Biểu đồ

```plantuml
@startuml Conceptual_ERD_HRMS

skinparam linetype ortho
skinparam nodesep 60
skinparam ranksep 60
skinparam shadowing false

skinparam rectangle {
  BackgroundColor #D6EAF8
  BorderColor #2C3E50
  FontSize 14
  FontStyle bold
}

skinparam usecase {
  BackgroundColor White
  BorderColor #85929E
  FontSize 11
}

' ====== ENTITIES (Blue Rectangles) ======
rectangle "Đơn vị tổ chức" as DV
rectangle "Nhân sự" as NS
rectangle "Hợp đồng" as HD
rectangle "Ngạch bậc lương" as NBL
rectangle "Khóa đào tạo" as KDT

' ====== RELATIONSHIPS (Green Hexagons — closest to Chen diamond in PlantUML) ======
hexagon "Trực thuộc" as R_TT #D5F5E3;line:#1E8449
hexagon "Ký kết" as R_KK #D5F5E3;line:#1E8449
hexagon "Áp dụng" as R_AD #D5F5E3;line:#1E8449
hexagon "Tham gia" as R_TG #D5F5E3;line:#1E8449

' ====== ATTRIBUTES (White Ellipses) ======
' -- Đơn vị tổ chức --
usecase "<u>maDonVi</u>" as a_dv1
usecase "tenDonVi" as a_dv2

' -- Nhân sự --
usecase "<u>maCanBo</u>" as a_ns1
usecase "hoTen" as a_ns2

' -- Hợp đồng --
usecase "<u>soHopDong</u>" as a_hd1
usecase "ngayKy" as a_hd2

' -- Ngạch bậc lương --
usecase "<u>ngachVienChuc</u>" as a_nbl1
usecase "heSoLuong" as a_nbl2

' -- Khóa đào tạo --
usecase "tenKhoaDaoTao" as a_kdt1
usecase "trangThai" as a_kdt2

' ====== ATTRIBUTE → ENTITY CONNECTIONS ======
a_dv1 -d- DV
a_dv2 -d- DV

a_ns1 -d- NS
a_ns2 -d- NS

a_hd1 -d- HD
a_hd2 -d- HD

a_nbl1 -d- NBL
a_nbl2 -d- NBL

KDT -d- a_kdt1
KDT -d- a_kdt2

' ====== ENTITY ↔ RELATIONSHIP CONNECTIONS (with cardinality) ======
' Đơn vị tổ chức 1 --- Trực thuộc --- N Nhân sự
DV "1" -d- R_TT
R_TT -d- "N" NS

' Nhân sự 1 --- Ký kết --- N Hợp đồng
NS "1" -r- R_KK
R_KK -r- "N" HD

' Nhân sự N --- Áp dụng --- 1 Ngạch bậc lương
NS "N" -l- R_AD
R_AD -l- "1" NBL

' Nhân sự M --- Tham gia --- N Khóa đào tạo (M:N conceptual)
NS "M" -d- R_TG
R_TG -d- "N" KDT

@enduml
```

## Giải thích các quan hệ

| # | Quan hệ | Thực thể 1 | Cardinality | Thực thể 2 | Mô tả |
|---|---|---|---|---|---|
| 1 | Trực thuộc | Đơn vị tổ chức | 1 : N | Nhân sự | Mỗi đơn vị có nhiều nhân sự; mỗi nhân sự thuộc 1 đơn vị |
| 2 | Ký kết | Nhân sự | 1 : N | Hợp đồng | Mỗi nhân sự có nhiều hợp đồng; mỗi hợp đồng thuộc 1 nhân sự |
| 3 | Áp dụng | Nhân sự | N : 1 | Ngạch bậc lương | Nhiều nhân sự áp dụng cùng 1 ngạch bậc lương |
| 4 | Tham gia | Nhân sự | M : N | Khóa đào tạo | Nhiều nhân sự tham gia nhiều khóa đào tạo (chưa phân rã) |

## Ghi chú thiết kế

1. **Mức khái niệm**: Biểu đồ này chỉ thể hiện các thực thể nghiệp vụ cốt lõi và quan hệ giữa chúng. Các thuộc tính chi tiết (email, số điện thoại, ngày sinh, v.v.) được trình bày trong Từ điển Dữ liệu (Data Dictionary).

2. **Quan hệ M:N "Tham gia"**: Ở mức khái niệm, quan hệ nhiều-nhiều được giữ nguyên dạng hình thoi. Việc phân rã thành bảng liên kết (linking table) sẽ thực hiện ở mức logic/vật lý.

3. **Các thực thể phụ thuộc**: Thông tin ngân hàng, gia đình, bằng cấp được gộp khái niệm vào thực thể "Nhân sự" ở mức này. Chúng sẽ được tách ra ở mức logic.

4. **Tương thích PlantUML**: Từ khóa `diamond` không có trong danh sách shape chuẩn của PlantUML. Biểu đồ sử dụng `hexagon` (lục giác) — hình gần nhất với hình thoi trong ký pháp Chen. Nếu cần hình thoi chính xác, có thể dùng Graphviz/DOT trực tiếp.
