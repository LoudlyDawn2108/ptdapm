## CRITICAL — Logic / Functionality Errors

### 1. UC 4.12 (Thêm mới hệ số lương) has a copy-paste error: Exception E4 doesn't belong

UC 4.12 is about **adding** a new salary coefficient, but its E4 exception says:

> *"Hệ số lương đã được gán cho hồ sơ nhân sự → Hệ thống hiển thị thông báo: 'Không thể **chỉnh sửa** hệ số lương...' → Hệ thống vô hiệu hóa nút **'Sửa'**."*

This exception is about **editing**, not adding. It's identical to E4 in UC 4.13 (Sửa danh mục hệ số lương). This was clearly copy-pasted from UC 4.13 and doesn't make sense in the context of "Thêm mới."

**Recommendation:** Remove E4 entirely from UC 4.12. It already exists correctly in UC 4.13.

---

### 2. UC 4.27 A1 (Thôi việc tự động) is missing critical side effects

The **Basic Flow** of UC 4.27 specifies 3 important side effects when marking resignation:
1. Trạng thái làm việc → "Đã thôi việc"
2. Nhân sự được gỡ khỏi đơn vị công tác (step 4)
3. Tài khoản liên kết được tự động khóa (step 5)

But **A1 (Thôi việc tự động)** only mentions:
1. Cập nhật trạng thái hợp đồng → "Hết hiệu lực"
2. Cập nhật trạng thái làm việc → "Đã thôi việc"

**Missing from A1:** Gỡ nhân sự khỏi đơn vị công tác, and khóa tài khoản liên kết. If the system auto-terminates someone, these effects should also apply — otherwise the resigned employee's account remains active and they still appear in their unit.

**Recommendation:** Add steps to A1:
> *3. Hệ thống tự động gỡ nhân sự khỏi đơn vị công tác hiện tại.*
> *4. Hệ thống tự động cập nhật trạng thái tài khoản liên kết thành "Bị khóa".*

---

### 3. UC 4.37 A1 (Xuất báo cáo) excludes Phòng TCKT — contradicts FEAT 10.1

**FEAT 10.1** clearly states: *"phòng TCCB **và** phòng tài chính **xem và xuất** các thống kê nhân sự"*

But UC 4.37's A1 (Xuất báo cáo) only mentions: *"Cán bộ **TCCB** chọn chức năng 'Xuất báo cáo'"* — Phòng TCKT is excluded from the export flow despite being listed as a main actor of the UC itself.

**Recommendation:** Change A1 to reference both actors: *"Phòng TCCB hoặc Phòng TCKT chọn chức năng 'Xuất báo cáo'..."*

---

## SIGNIFICANT — Naming / Actor Inconsistencies

### 4. "Phòng nhân sự" in STRQ 8 & 9 creates a naming collision

In Actor definition (section 3.1), Actor 3 is described as:
> *"Phòng Tổ chức - Cán bộ **(Phòng Nhân sự)**"*

But in the VaiTro enum (section 5.1.1):
> *CAN_BO_NHAN_SU = "Cán bộ / Nhân sự"* — This is the **regular employee** role.

Now STRQ 8 and STRQ 9 both use *"Phòng nhân sự"*:
- STRQ 8: *"Phòng nhân sự cần hệ thống cho phép mở khóa đào tạo..."*
- STRQ 9: *"Phòng nhân sự có thể cấu hình lương, loại phụ cấp, loại hợp đồng."*

A reader could confuse "Phòng nhân sự" (the TCCB department) with "Cán bộ nhân sự" (the regular user role). All corresponding UCs (4.12–4.21, 4.33–4.36) correctly use "Phòng TCCB" as the actor, making the STRQ wording the outlier.

**Recommendation:** Two options:
- **(A)** Replace "Phòng nhân sự" in STRQ 8 and STRQ 9 with "Phòng TCCB" for consistency with all UCs.
- **(B)** Remove the parenthetical "(Phòng Nhân sự)" from Actor 3's definition to eliminate the collision. Use only "Phòng Tổ chức - Cán bộ" or "Phòng TCCB".

I recommend **(B)** — it fixes the root cause.

---

### 5. Overlapping auto-dismissal logic between UC 4.27 and UC 4.31

**UC 4.27** (Đánh dấu thôi việc) Basic Flow step 4 says:
> *"Nhân sự được cập nhật rời khỏi đơn vị công tác."*

**UC 4.31** (Bãi nhiệm) A1 (Tự động bãi nhiệm) says:
> *"Hệ thống tự động kiểm tra trạng thái hợp đồng 'Hết hiệu lực' hoặc trạng thái 'Đã thôi việc' → Hệ thống tự động xóa nhân sự khỏi đơn vị tổ chức."*

Both UCs claim responsibility for removing staff from units upon resignation. This creates an ambiguous question: **Which process actually executes the removal?** If UC 4.27 already removes the person from the unit during resignation, then UC 4.31 A1's auto-check would find nobody to remove. Conversely, if UC 4.27 doesn't handle removal, then UC 4.31 A1 must.

**Recommendation:** Clarify ownership. I suggest:
- UC 4.27 handles removal from unit as part of the resignation flow (both manual and automatic).
- UC 4.31 A1 should be **removed** or rewritten as: *"Tự động bãi nhiệm chỉ áp dụng cho các trường hợp nhân sự bị hết hiệu lực hợp đồng mà chưa được xử lý qua luồng thôi việc (UC 4.27)."* — making it a safety net rather than a competing process.

---

### 6. UC 4.37 description mentions "lãnh đạo" — not a defined Actor

UC 4.37's description says:
> *"Cung cấp cho Phòng TCCB, Phòng TCKT **và lãnh đạo** có các báo cáo..."*

But "lãnh đạo" is not defined anywhere in the Actor list (section 3.1), the VaiTro enum (section 5.1.1), or the UC permission matrix (section 3.3.2). It's a phantom actor.

**Recommendation:** Either:
- **(A)** Remove "và lãnh đạo" from UC 4.37 description.
- **(B)** If leadership access is a real requirement, define a new actor and add corresponding FEATs/permissions.

---

### 7. UC 4.9 missing exception for leaf node (laDonViNut)

UC 4.9 step 5 introduces the concept of "đơn vị nút" (leaf node):
> *"Xác nhận đơn vị nút (Nếu xác nhận thì ta sẽ không thể thêm mới đơn vị con dưới đơn vị này)"*

The DonViToChuc class has `laDonViNut: Boolean`. But UC 4.9's exception flows only check for:
- E1: Trùng mã đơn vị
- E2: Thiếu thông tin bắt buộc
- E3: Đơn vị cha ở trạng thái Giải thể/Sáp nhập
- E4: Hủy thao tác

**Missing:** There is no exception for when the selected parent unit has `laDonViNut = true`. The UI should prevent this, but it needs to be documented as an exception flow.

**Recommendation:** Add E5 to UC 4.9:
> *E5: Đơn vị cha là đơn vị nút — Tại bước 3, hệ thống phát hiện đơn vị cha đã được xác nhận là đơn vị nút. Hệ thống ẩn/vô hiệu hóa chức năng "Thêm mới đơn vị" dưới cấp đơn vị này và hiển thị thông báo nếu người dùng cố truy cập.*

---

## MINOR — Gaps & Polish Issues

### 8. UC 4.3 (Đổi mật khẩu) missing success notification

Every other write UC in the system ends with *"Hệ thống lưu lịch sử thay đổi và thông báo [thêm/cập nhật/xóa] thành công"*. But UC 4.3 step 7 just says:
> *"Hệ thống thay đổi thông tin về mật khẩu của tài khoản đang đăng nhập"*

No success notification, no audit log mention.

**Recommendation:** Change step 7 to: *"Hệ thống cập nhật mật khẩu, lưu lịch sử thay đổi và thông báo đổi mật khẩu thành công."*

---

### 9. UC 4.32 trigger text only mentions Phòng TCCB, but Quản trị viên is also an actor

UC 4.32 lists actors as "Phòng TCCB, Quản trị viên" but the Trigger says:
> *"**Phòng TCCB** chọn chức năng xem chi tiết một đơn vị..."*

Admin is missing from the trigger text.

**Recommendation:** Change trigger to: *"Phòng TCCB hoặc Quản trị viên chọn chức năng xem chi tiết..."*

---

### 10. No UC for canceling a training registration

UC 4.40 allows users to register for training. But there is no UC for **canceling** a registration. FEAT 11.3 only mentions *"đăng ký tham gia"* and FEAT 11.4 mentions *"xem danh sách đã đăng ký."*

If a user registers by mistake, or circumstances change before the course starts, there is no documented way to cancel.

**Recommendation:** Consider adding a UC (e.g., UC "Hủy đăng ký khóa đào tạo") with the constraint that cancellation is only allowed when the course is still in "Đang mở đăng ký" status. If this is intentionally excluded, add a design note explaining why.

---

### 11. UC 4.40 (Đăng ký đào tạo) missing precondition about work status

UC 4.40's preconditions don't mention the staff member's work status. Theoretically, a person with trạng thái "Đã thôi việc" (if their account wasn't locked yet) or "Đang chờ xét" could register for training.

**Recommendation:** Add precondition: *"Cán bộ/Giảng viên đang ở trạng thái làm việc 'Đang công tác'."*

---

### 12. UC 4.10 (Sửa đơn vị) doesn't include `laDonViNut` or `ngayThanhLap` as editable

UC 4.10's editable fields are: Tên đơn vị, Loại đơn vị, Thông tin liên hệ. Fields explicitly not editable: Mã đơn vị.

**Not mentioned at all:** `laDonViNut` (leaf node), `ngayThanhLap` (founding date), and `đơn vị cha` (parent unit).

This means once a unit is created as a leaf node, it can never be changed to allow sub-units. And `ngayThanhLap` can never be corrected if entered wrong.

**Recommendation:** Either:
- **(A)** Add `laDonViNut` and `ngayThanhLap` to the editable fields in UC 4.10 (with appropriate business rule checks — e.g., can't disable laDonViNut if sub-units already exist).
- **(B)** Add a design note explicitly stating these fields are immutable after creation, and explain why.

---

### 13. UC 4.30 (Bổ nhiệm) precondition may be too restrictive

UC 4.30 precondition requires: *"Nhân sự phải có trạng thái hợp đồng **'Còn hiệu lực'**"*

This means a person with contract status "Chờ gia hạn" cannot be transferred between units, even though their contract is technically still active (just approaching expiry). This could block legitimate inter-department transfers during the renewal window.

**Recommendation:** Consider expanding the precondition to: *"Nhân sự phải có trạng thái hợp đồng 'Còn hiệu lực' hoặc 'Chờ gia hạn'."*
