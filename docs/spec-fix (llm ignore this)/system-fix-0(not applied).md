## 🔴 HIGH SEVERITY — Logical Contradictions & Missing Critical Elements

### 1. UC 4.27 (Đánh dấu thôi việc): Post-condition contradicts Exception Flow
- **Post-condition** says: "Trạng thái hợp đồng được cập nhật thành 'Hết hiệu lực'" — implying the system auto-terminates contracts.
- **Exception E2** says: if nhân sự has a contract with status "Có hiệu lực", the system BLOCKS the operation and asks the user to terminate the contract first.
- **Contradiction**: Does the system auto-terminate the contract upon thôi việc, or must the user terminate it manually beforehand?
- **Also**: E2 uses the term **"Có hiệu lực"** but the rest of the document consistently uses **"Còn hiệu lực"** (matching the enum `TrangThaiHopDong.CON_HIEU_LUC`).

> **Recommendation**: Decide on one behavior. If auto-terminate, remove E2. If manual, update the post-condition to state "Hợp đồng phải đã được thanh lý trước khi thực hiện." Also fix "Có hiệu lực" → "Còn hiệu lực".

### 2. Missing status transition mechanism for Khóa Đào Tạo
The enum `TrangThaiKhoaDaoTao` has 3 states: `Đang mở đăng ký → Đang đào tạo → Đã hoàn thành`. But **no UC or system flow describes how or when these transitions happen**:
- Who/what changes from "Đang mở đăng ký" → "Đang đào tạo"?
- Who/what changes from "Đang đào tạo" → "Đã hoàn thành"?
- Similarly, `TrangThaiThamGia` transitions from "Đã đăng ký" → "Đang học" with no described mechanism.
- UC 4.36 has precondition "Trạng thái khóa đào tạo là 'Đã hoàn thành'" but nothing in the system ever sets this status.

> **Recommendation**: Add either (a) a UC for Phòng TCCB to manually change khóa đào tạo status, or (b) describe an automatic system process (System Timer actor) that transitions status based on dates. Similarly, clarify when "Đã đăng ký" becomes "Đang học".

### 3. UC 4.30 (Bổ nhiệm) E1: Validation logic is inverted
- E1 states the error condition as: **"Ngày bắt đầu ≥ ngày hiện tại"** — but that's the VALID condition (you SHOULD start on or after today).
- The error should trigger when **"Ngày bắt đầu < ngày hiện tại"** (can't appoint retroactively).

> **Recommendation**: Fix E1 to read: "Ngày bắt đầu < ngày hiện tại" as the error condition.

### 4. UC 4.22 (Thêm Hợp đồng): Hardcoded "18 ngày" vs configurable threshold
- Step 4: "chỉ cho phép tạo hợp đồng mới nếu... 'Còn hiệu lực' với thời gian còn lại là **18 ngày**"
- But `LoaiHopDong` class has `thoiGianChoGiaHan` (configurable per contract type). Why is 18 days hardcoded here instead of referencing the configured value?
- Also, how does a nhân sự reach status "Chờ gia hạn"? No UC or system flow describes this transition.

> **Recommendation**: Replace "18 ngày" with "thời gian chờ gia hạn được cấu hình của loại hợp đồng". Add a System Timer process that transitions hợp đồng from "Còn hiệu lực" → triggers "Chờ gia hạn" on the nhân sự when within the grace period.

### 5. Class `HeSoLuong.bacLuong`: Type mismatch with UC validation
- UC 4.12 E1: **"Bậc lương phải là số nguyên"**
- Class 5.1.23 `HeSoLuong`: `bacLuong` type is **String**, not Int.

> **Recommendation**: Change `bacLuong` to type `Int` in the class diagram to match the validation rule.

### 6. Class `BoNhiem`: Missing `ngayKetThuc` field
- UC 4.31 (Bãi nhiệm) removes nhân sự from đơn vị, but `BoNhiem` class only has `chucVu` and `ngayBatDau`.
- There's no `ngayKetThuc` or status to distinguish current vs historical appointments. Without this, you can't track appointment history (required by UC 4.32 which mentions "Lịch sử bổ nhiệm, miễn nhiệm chức vụ").

> **Recommendation**: Add `ngayKetThuc: Date` (and optionally `lyDo: String`) to the `BoNhiem` class.

### 7. Class `NhanSu`: Missing `ngayThoiViec` and `lyDoThoiViec` fields
- UC 4.27 step 2: "Hệ thống yêu cầu xác nhận và nhập **ngày, lý do thôi việc**"
- But the `NhanSu` entity has no fields to store this data.

> **Recommendation**: Add `ngayThoiViec: Date` and `lyDoThoiViec: String` to class `NhanSu`.

---

## 🟡 MEDIUM SEVERITY — Inconsistencies Causing Confusion

### 8. Actor naming inconsistency across the document
The same actor is referred to by different names:

| Section | Names used |
|---|---|
| Section 3.1 (Actor definition) | "Người dùng (Cán bộ/Giảng viên/Nhân viên)" |
| UC 4.1, 4.2, 4.3 (Tác nhân) | "Cán bộ nhân sự" |
| UC 4.7 (Phân quyền) | "Cán bộ (Employee)" |
| STRQ/FEAT | "Phòng nhân sự", "Phòng TCCB" interchangeably |
| Enum VaiTro | `CAN_BO_NHAN_SU` |

> **Recommendation**: Standardize naming. Use the 4 enum names consistently: Quản trị viên, Cán bộ TCCB, Cán bộ TCKT, Cán bộ nhân sự. Add a mapping note that "Phòng nhân sự = Phòng TCCB = Cán bộ TCCB".

### 9. FEAT 7.1/7.2 vs UC 4.23/4.24: Actor scope mismatch
- **FEAT 7.1**: "phòng **nhân sự** tìm kiếm hồ sơ nhân sự" — only Phòng TCCB
- **FEAT 7.2**: "phòng **nhân sự** lọc đa tiêu chí hồ sơ nhân sự" — only Phòng TCCB
- **UC 4.23 & 4.24**: Actors include both **Phòng TCCB AND Phòng TCKT**
- **UC diagram 3.3.2c** for TCKT also shows: "Tìm kiếm, Xem và Lọc chi tiết hồ sơ nhân sự"

The FEATs are more restrictive than the UCs and diagrams.

> **Recommendation**: Update FEAT 7.1 and 7.2 to include "phòng tài chính" to align with UCs and diagrams.

### 10. UC 4.5 (Thêm tài khoản) E1: Wrong step reference
- E1 says: "Tại **bước 6**, Hệ thống validate phát hiện các trường thông tin không hợp lệ."
- But step 6 is "Hệ thống tự động tạo mật khẩu". Validation is at **step 5**.

> **Recommendation**: Change E1 reference from "bước 6" to "bước 5".

### 11. UC 4.3 (Đổi mật khẩu) E1: Wrong step reference
- E1 says: "Tại **bước 7**, hệ thống phát hiện các lỗi"
- But step 7 is "Hệ thống thay đổi thông tin về mật khẩu" (the save step). Validation is at **step 6**.

> **Recommendation**: Change E1 reference from "bước 7" to "bước 6".

### 12. UC 4.21 (Ngừng sử dụng loại hợp đồng) E1: Copy-paste error
- E1 text reads: **"Hủy thao tác xóa"** — but this UC is about "Ngừng sử dụng", not "Xóa".
- This was clearly copied from UC 4.14 (Xóa danh mục hệ số lương).

> **Recommendation**: Change "Hủy thao tác xóa" to "Hủy thao tác ngừng sử dụng".

### 13. UC 4.17 (Sửa phụ cấp): "Hủy" classified differently than similar UCs
- UC 4.17 puts "Hủy thao tác" as **Alternative Flow (A1)**
- All similar UCs (4.12, 4.13, 4.16, 4.19, 4.20) put "Hủy" as **Exception Flow**

> **Recommendation**: Move UC 4.17's "Hủy" from Alternative Flow to Exception Flow for consistency.

### 14. Inconsistent CRUD patterns across danh mục categories

| Danh mục | Thêm | Sửa | Xóa | Ngừng sử dụng |
|---|---|---|---|---|
| Hệ số lương (FEAT 9.3) | UC 4.12 ✓ | UC 4.13 ✓ | UC 4.14 ✓ | UC 4.15 ✓ |
| Loại phụ cấp (FEAT 9.4) | UC 4.16 ✓ | UC 4.17 ✓ | **❌ Missing** | UC 4.18 ✓ |
| Loại hợp đồng (FEAT 9.5) | UC 4.19 ✓ | UC 4.20 ✓ | **❌ Missing** | UC 4.21 ✓ |

Hệ số lương has a Xóa UC (for unused records), but phụ cấp and hợp đồng don't. Is this intentional?

> **Recommendation**: Either add Xóa UCs for phụ cấp and hợp đồng (for unused records), or explicitly document why they're excluded. Update FEAT 9.4 and 9.5 accordingly.

### 15. No UC for re-activating "Ngừng sử dụng" danh mục
UCs 4.15, 4.18, 4.21 change category status to "Ngừng sử dụng" but there's **no reverse operation**. Once disabled, a category stays disabled forever.

> **Recommendation**: If intentional, document this explicitly. If not, add a "Kích hoạt lại danh mục" UC.

### 16. UC 4.22 (Thêm Hợp đồng) E1/E3: Wrong step references
- E1 says "Tại **bước 3**" — but step 3 is the user inputting mã nhân sự. The system check is at **step 4**.
- E3 says "Tại **bước 7**" — but the validate at step 8. Also says "quay lại bước 4" but step 4 is a system check, not user input.

> **Recommendation**: Fix step references: E1 → bước 4, E3 → bước 8, "quay lại bước 5" (user selects loại hợp đồng).

---

## 🟢 LOW SEVERITY — Style/Structural Issues

### 17. UC 4.7 (Phân quyền) is ambiguous: Standalone UC vs embedded component
- It's listed as a standalone UC in section 4.7
- But it's also **referenced as an included UC** from UC 4.5 step 3: "Vai trò (UC 4.7)" and UC 4.6 step 3: "Vai trò (UC 4.7)"
- Its flow (3 steps) has no save action and reads more like a UI widget description than a proper UC

> **Recommendation**: Clarify whether this is an `<<include>>` UC or standalone. If included, it shouldn't appear as a primary UC. If standalone, add proper save/confirm steps.

### 18. UC 4.4 (Tìm kiếm tài khoản) combines search + filter, but UC 4.23/4.24 separates them
- For tài khoản: search and filter are ONE UC (4.4)
- For hồ sơ nhân sự: search (UC 4.23) and filter (UC 4.24) are TWO separate UCs

> **Recommendation**: Pick one pattern and apply consistently. Since hồ sơ has more complexity, keeping them separate is fine, but the tài khoản UC should follow the same pattern.

### 19. UC 4.15/4.18/4.21: Missing precondition for current status
These UCs don't specify that the danh mục must currently be in "Đang sử dụng" status. What happens if you try to "Ngừng sử dụng" something already in "Ngừng sử dụng"?

> **Recommendation**: Add precondition: "Danh mục đang ở trạng thái 'Đang sử dụng'" for all three UCs.

### 20. UC 4.11 (Cập nhật trạng thái đơn vị): Confusing step numbering
Steps 10-12 and 15-18 are sub-items but numbered as main steps, making the flow hard to follow.

> **Recommendation**: Use sub-numbering (e.g., 10a, 10b or 15.1, 15.2) for nested steps.

### 21. STRQ 3 vs FEAT 3.2/3.3: Scope narrowing without explanation
- STRQ 3: "**Quản trị viên và phòng TCCB** có thể quản lý cơ cấu tổ chức"
- FEAT 3.2 (Thêm): only **Quản trị viên**
- FEAT 3.3 (Sửa): only **Quản trị viên**

The STRQ says both actors can manage, but FEATs restrict create/edit to Admin only. This narrowing isn't explained.

> **Recommendation**: Add a note explaining why Thêm/Sửa is restricted to Admin while STRQ mentions both actors, or update FEATs to include TCCB.

### 22. Missing relationship in class diagram: NhanSu ↔ DonViToChuc (current workplace)
Multiple UCs reference nhân sự's current đơn vị công tác (UC 4.27 removes it, UC 4.30 assigns it). But the only link is through `BoNhiem` (which lacks `ngayKetThuc`). Without a way to identify the **current** appointment, queries like "which đơn vị does this nhân sự belong to?" are ambiguous.

> **Recommendation**: Either (a) add `ngayKetThuc` to `BoNhiem` (see #6 above) so the current appointment is the one without an end date, or (b) add a direct `donViHienTai` reference on `NhanSu`.

---

## Summary Table

| # | Severity | Area | Issue |
|---|---|---|---|
| 1 | 🔴 HIGH | UC 4.27 | Post-condition vs E2 contradiction on contract termination |
| 2 | 🔴 HIGH | Khóa Đào Tạo | No mechanism for status transitions (3 states, 0 transitions defined) |
| 3 | 🔴 HIGH | UC 4.30 E1 | Validation logic inverted (≥ vs <) |
| 4 | 🔴 HIGH | UC 4.22 | Hardcoded "18 ngày" vs configurable field; missing "Chờ gia hạn" transition |
| 5 | 🔴 HIGH | Class HeSoLuong | `bacLuong` String vs Int mismatch |
| 6 | 🔴 HIGH | Class BoNhiem | Missing `ngayKetThuc` — can't track appointment history |
| 7 | 🔴 HIGH | Class NhanSu | Missing `ngayThoiViec`, `lyDoThoiViec` fields |
| 8 | 🟡 MED | Whole doc | Actor naming inconsistency |
| 9 | 🟡 MED | FEAT 7.1/7.2 | Missing TCKT actor (but UC and diagram include it) |
| 10 | 🟡 MED | UC 4.5 E1 | Wrong step reference (6→5) |
| 11 | 🟡 MED | UC 4.3 E1 | Wrong step reference (7→6) |
| 12 | 🟡 MED | UC 4.21 E1 | Copy-paste error: "xóa" should be "ngừng sử dụng" |
| 13 | 🟡 MED | UC 4.17 | "Hủy" in Alternative Flow vs Exception Flow in similar UCs |
| 14 | 🟡 MED | Danh mục | Inconsistent CRUD: hệ số lương has Xóa, others don't |
| 15 | 🟡 MED | Danh mục | No reverse operation for "Ngừng sử dụng" |
| 16 | 🟡 MED | UC 4.22 | Wrong step references in E1 and E3 |
| 17 | 🟢 LOW | UC 4.7 | Ambiguous: standalone UC vs included component |
| 18 | 🟢 LOW | UC 4.4 vs 4.23/4.24 | Inconsistent search/filter UC pattern |
| 19 | 🟢 LOW | UC 4.15/4.18/4.21 | Missing status precondition |
| 20 | 🟢 LOW | UC 4.11 | Confusing step numbering |
| 21 | 🟢 LOW | STRQ 3 → FEAT | Unexplained scope narrowing |
| 22 | 🟢 LOW | Class diagram | NhanSu→DonViToChuc current link unclear |

Let me know which items you'd like to address, or if you want me to elaborate on any specific finding.
