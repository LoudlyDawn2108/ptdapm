## Discrepancy Report: System Spec vs Use Cases

### 🔴 Category 1: Actor / Terminology Inconsistencies

**1.1. "Phòng nhân sự" vs "Phòng TCCB" — inconsistent naming throughout**
- **Where**: STRQ 4–9 and FEATs use "phòng nhân sự", while all UC details (4.9–4.36) use "Phòng TCCB"
- **Example**: FEAT 3.5 says "quản trị viên và **phòng nhân sự**" but UC 4.32 says "Phòng TCCB, Quản trị viên"
- **Why it matters**: Even though the Actor section (3.1) defines them as the same ("Phòng Tổ chức - Cán bộ (Phòng Nhân sự)"), inconsistent naming across documents causes confusion.
- **Fix**: fix all to "Phòng TCCB" in the STRQ/FEAT section.

**1.2. UC 4.37 (Xem thống kê) — Precondition and flow only mention Phòng TCCB, but actor field includes Phòng TCKT**
- **Where**: UC 4.37 — Actor field says "Phòng TCCB, Phòng TCKT", but:
  - Precondition: "Phòng TCCB đã đăng nhập hệ thống." (TCKT missing)
  - Basic Flow step 3: "Phòng TCCB chọn từng nhóm báo cáo" (only TCCB)
  - Alternative Flow A1: "Cán bộ TCCB chọn chức năng 'Xuất báo cáo'" (only TCCB)
- **Fix**: Update precondition to "Phòng TCCB **hoặc Phòng TCKT** đã đăng nhập hệ thống." and change flow references to "Người dùng" instead of hard-coding "Phòng TCCB".

**1.3. Section 3.3.2b (Phòng TCCB actor decomposition) is INCOMPLETE**
- **Where**: The actor decomposition for Phòng TCCB (3.3.2b) doesn't explicitly list:
  - Thêm mới đơn vị tổ chức (UC 4.9)
  - Sửa thông tin đơn vị (UC 4.10)
  - Cập nhật trạng thái đơn vị (UC 4.11)
  
  Yet all three UCs (4.9, 4.10, 4.11) list "phòng TCCB" as an actor.
- **Fix**: Add "Nhóm UC Quản lý Đơn vị tổ chức (Thêm/Sửa/Cập nhật trạng thái)" to the Phòng TCCB decomposition in section 3.3.2b.

**1.4. System Timer actor defined but has NO dedicated UC decomposition**
- **Where**: Section 3.1 defines "Hệ thống (System Timer / Auto-Job)" as an actor performing: auto-logout, auto-code generation, auto-account lock, auto-status change. But section 3.3.2 has NO decomposition for this actor.
- Auto-processes are scattered as alternative flows across UCs 4.2 (A1), 4.8 (A2), 4.27 (A1), and design notes in 5.1.4 and 5.1.10.
- **Fix**: Remove "System Timer" as an actor and reclassify these as system behaviors within existing UCs (which is what you've effectively done).

---

### 🔴 Category 2: FEAT ↔ UC Mismatches

**2.1. FEAT 7.7/7.8 actor scope not cleanly traced from STRQ 7**
- **Where**: STRQ 7 only mentions "phòng nhân sự" wanting to manage HR records. But FEAT 7.7 and 7.8 add "phòng tài chính" as a viewer/exporter.
- **Why it matters**: The traceability from STRQ 7 → FEAT 7.7/7.8 is broken. TCKT's viewing ability could come from STRQ 10 (statistics) but viewing/exporting individual records isn't statistics.
- **Fix**: Either add a note in STRQ 7 mentioning phòng TCKT's read-only need, or create a new STRQ (e.g., STRQ 7b) to justify TCKT's access to individual HR records.

**2.2. UC 4.26 step 4 introduces a feature not traced to any FEAT**
- **Where**: UC 4.26 (Chỉnh sửa hồ sơ) step 4: "Cán bộ TCCB có thể **ẩn đi một số mục khen thưởng, mục kỷ luật** với tài khoản của cán bộ/giảng viên, tài khoản của tài chính/kế toán."
- This "hide reward/discipline" feature has NO corresponding STRQ or FEAT.
- **Fix**: Either add a FEAT (e.g., FEAT 7.9: "Hệ thống cho phép phòng TCCB ẩn/hiện các mục khen thưởng, kỷ luật đối với các vai trò khác") or remove this from the UC if it's not a real requirement.

**2.3. UC 4.35 participant list is missing "Trạng thái tham gia" column**
- **Where**: FEAT 8.3 says "xem thông tin khóa đào tạo đã mở cho cán bộ **kèm danh sách người đã đăng ký**". UC 4.35 shows the list with: Họ tên, Mã cán bộ, Đơn vị, Thời điểm đăng ký — but NO "Trạng thái tham gia" column.
- **Why it matters**: Phòng TCCB can't see at a glance which participants are "Đã đăng ký", "Đang học", "Hoàn thành", or "Không đạt" from this view. UC 4.36 (recording results) needs this context.
- **Fix**: Add "Trạng thái tham gia" to the participant list in UC 4.35.

**2.4. No "re-activate" feature for any catalog (Hệ số lương, Loại phụ cấp, Loại hợp đồng)**
- **Where**: FEATs 9.3, 9.4, 9.5 and UCs 4.15, 4.18, 4.21 all support "Ngừng sử dụng" but there's NO FEAT or UC to reverse it (re-activate a deactivated catalog item).
- **Fix**: No need fixing, TCCB can reactive them in update flows

---

### 🔴 Category 3: UC Internal Logic Issues

**3.1. UC 4.26 Exception E1 references wrong step**
- **Where**: UC 4.26 (Chỉnh sửa hồ sơ) — Exception E1 says "**Tại bước 4**" for data validation failure. But step 4 is about hiding rewards/discipline. Data validation is at **step 5**.
- **Fix**: Change "Tại bước 4" to "Tại bước 5".

**3.2. UC 4.22 Exception E3 references wrong step and wrong return step**
- **Where**: UC 4.22 (Thêm hợp đồng) — E3 says "**Tại bước 7**" for time validation, but the duration validation is at **step 8**. Also, E3 ends with "Phòng TCCB quay lại **bước 5**" (select contract type) when it should return to **step 7** (edit contract info).
- **Fix**: Fix step references: "Tại bước 8" and "quay lại bước 7".

**3.3. UC 4.33 Exception E1 — broken/unclear validation rule**
- **Where**: UC 4.33 (Mở khóa đào tạo) E1: "thời gian mở đăng ký sau thời gian đào tạo > ngày hiện tại, ." — this sentence is grammatically broken and has a trailing comma-period.
- **Fix**: Rewrite clearly, e.g.: "Thời gian mở đăng ký phải kết thúc trước thời gian bắt đầu đào tạo; thời gian bắt đầu đào tạo phải sau ngày hiện tại."

**3.4. UC 4.27 — Trạng thái hợp đồng logic gap for employees without contracts**
- **Where**: UC 4.27 (Đánh dấu thôi việc) post-condition says "Trạng thái hợp đồng được cập nhật thành 'Hết hiệu lực'." But an employee could have status "Chưa hợp đồng" (never had a contract). Setting it to "Hết hiệu lực" would be semantically wrong.
- **Fix**: Add conditional logic: "Nếu nhân sự có hợp đồng, cập nhật trạng thái hợp đồng thành 'Hết hiệu lực'. Nếu nhân sự chưa có hợp đồng, giữ nguyên trạng thái 'Chưa hợp đồng'."

**3.5. UC 4.30 — Precondition is incomplete**
- **Where**: UC 4.30 (Bổ nhiệm) precondition says "Nhân sự được bổ nhiệm phải có trạng thái hợp đồng 'Còn hiệu lực'." But the basic flow step 3 additionally requires "trạng thái **'Đang chờ xét'**". The precondition is missing this work status requirement.
- **Fix**: Update precondition to: "Nhân sự được bổ nhiệm phải có trạng thái hợp đồng 'Còn hiệu lực' và trạng thái làm việc 'Đang chờ xét' (luồng chính) hoặc 'Đang công tác' (luồng thay thế A1)."

**3.6. UC 4.31 — Post-condition is incomplete**
- **Where**: UC 4.31 (Bãi nhiệm) post-condition only says "Nhân sự được miễn nhiệm khỏi chức vụ." But step 6 also updates work status to "Đang chờ xét" AND removes the person from the unit.
- **Fix**: Expand post-condition to: "Nhân sự được miễn nhiệm khỏi chức vụ. Trạng thái làm việc cập nhật thành 'Đang chờ xét'. Nhân sự được xóa khỏi danh sách của đơn vị tổ chức."

**3.7. UC 4.36 — Precondition requires "Đã hoàn thành" but timing is questionable**
- **Where**: UC 4.36 (Ghi nhận kết quả đào tạo) requires course status "Đã hoàn thành" before recording results. But UC 4.34 allows changing status to "Đã hoàn thành" WITHOUT requiring all results to be recorded first.
- **Why it matters**: The workflow is: transition course → "Đã hoàn thành" → THEN record individual results. But there's no safeguard or reminder to ensure all results get recorded.
- **Fix**: Add a note or validation in UC 4.34 that warns when transitioning to "Đã hoàn thành" if there are participants with status still "Đang học" whose results haven't been recorded.

---

### 🟡 Category 4: Cross-UC Conflicts / Redundancies

**4.1. UC 4.27 + UC 4.31 — Redundant removal from unit**
- **Where**: UC 4.27 (Đánh dấu thôi việc) step 4: "nhân sự được cập nhật rời khỏi đơn vị công tác." UC 4.31 (Bãi nhiệm) A1: "auto remove when status is 'Đã thôi việc'."
- **Conflict**: When UC 4.27 runs, it already removes the person from the unit. Then UC 4.31 A1 would also try to auto-remove them — but they're already gone. This is redundant and could cause errors if the system tries to remove someone who's already removed.
- **Fix**: Clarify that UC 4.27 handles the removal directly, and UC 4.31 A1 should check if the person is still in a unit before attempting removal. Or, remove the redundancy by having UC 4.27 delegate removal to UC 4.31.

**4.2. UC 4.8 A2 + UC 4.27 step 5 — Redundant account locking**
- **Where**: UC 4.8 (Thay đổi trạng thái tài khoản) A2: "System detects employee status 'Đã thôi việc' → auto-lock account." UC 4.27 step 5: "Hệ thống tự động khóa tài khoản liên kết."
- **Conflict**: UC 4.27 already locks the account as part of the termination flow. Then UC 4.8 A2 (presumably a scheduled job) would try to lock it again.
- **Fix**: Either (a) remove UC 4.8 A2 since UC 4.27 already handles it, or (b) clarify that UC 4.8 A2 is a safety net for cases where UC 4.27's auto-lock failed or where termination happened through UC 4.27 A1 (auto-termination path). Add a note explaining the relationship.

**4.3. UC 4.30 A1 — Transfer doesn't explicitly remove from old unit**
- **Where**: UC 4.30 (Bổ nhiệm) Alternative Flow A1 handles appointing someone already at another unit. Step 6 says "Hệ thống thay đổi danh sách nhân sự và thông báo thành công" — it doesn't explicitly say the person is removed from the old unit.
- **Fix**: Add explicit step: "Hệ thống xóa nhân sự khỏi danh sách đơn vị cũ, thêm vào đơn vị mới, và cập nhật thông tin đơn vị công tác."

---

### 🟡 Category 5: Visibility / Information Gaps

**5.1. UC 4.28 — Phòng TCKT visibility restriction not documented**
- **Where**: UC 4.26 step 4 allows TCCB to hide certain reward/discipline items from TCKT. But UC 4.28 (Xem chi tiết hồ sơ, used by TCKT) doesn't mention that some items might be hidden. The TCKT actor decomposition (3.3.2c) also doesn't mention this restriction.
- **Fix**: Add a note in UC 4.28 explaining that TCKT sees a filtered view where certain items may be hidden by TCCB.

**5.2. DanhGia.dangHoatDong field — no UC explains how it's used**
- **Where**: Class DanhGia has "dangHoatDong: Boolean" but no UC explicitly describes setting this field or its effect on visibility.
- **Fix**: Map this field explicitly to UC 4.26 step 4 (the hiding feature) and document the relationship: dangHoatDong = false means the item is hidden from non-TCCB users.

---

### Summary Table

| # | Severity | Area | Issue |
|---|----------|------|-------|
| 1.1 | Medium | Terminology | "Phòng nhân sự" vs "Phòng TCCB" inconsistent |
| 1.2 | High | UC 4.37 | Precondition/flow missing Phòng TCKT |
| 1.3 | Medium | Sec 3.3.2b | TCCB decomposition missing unit management UCs |
| 1.4 | Low | Sec 3.3.2 | System Timer actor has no decomposition |
| 2.1 | Low | STRQ→FEAT | FEAT 7.7/7.8 adds TCKT without STRQ basis |
| 2.2 | Medium | UC 4.26 | "Hide" feature has no FEAT traceability |
| 2.3 | Low | UC 4.35 | Missing "Trạng thái tham gia" in participant list |
| 2.4 | Low | FEATs 9.x | No re-activate feature for catalogs |
| 3.1 | High | UC 4.26 | Exception references wrong step (4→5) |
| 3.2 | High | UC 4.22 | Exception references wrong step and return step |
| 3.3 | High | UC 4.33 | Broken/unclear validation rule text |
| 3.4 | Medium | UC 4.27 | Contract status logic gap for no-contract employees |
| 3.5 | Medium | UC 4.30 | Precondition missing work status requirement |
| 3.6 | Medium | UC 4.31 | Post-condition incomplete |
| 3.7 | Low | UC 4.34/4.36 | No safeguard before marking course complete |
| 4.1 | Medium | UC 4.27+4.31 | Redundant unit removal |
| 4.2 | Medium | UC 4.8+4.27 | Redundant account locking |
| 4.3 | Medium | UC 4.30 A1 | Transfer doesn't explicitly remove from old unit |
| 5.1 | Low | UC 4.28 | TCKT visibility restriction not documented |
| 5.2 | Low | Class diagram | dangHoatDong field usage undocumented |

The **highest priority fixes** are: 3.1, 3.2, 3.3 (broken step references/text), 1.2 (missing actor in precondition), and 4.1/4.2/4.3 (conflicting cross-UC logic).
