# 09 — Module Map & State Machines

## Route → Use Case → Role Matrix

### A. Authentication & Session

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/login` | UC 4.1 Login | Public | Login form (username + password) |
| (global) | UC 4.2 Logout | All | Sidebar button → confirm dialog |
| (global) | UC 4.2 A1 Idle timeout | All | Auto-logout after 30min inactivity |
| `/my/change-password` or dialog | UC 4.3 Change password | All | Form: current + new + confirm password |

---

### B. Account Administration

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/accounts` | UC 4.4 Search accounts | Admin | Data table + keyword search + role/status filters |
| `/accounts` (dialog) | UC 4.5 Add account | Admin | Dialog form: email + select HR person + assign role |
| `/accounts` (dialog) | UC 4.6 Edit account | Admin | Dialog form: email + role |
| `/accounts` (inline) | UC 4.7 Assign role | Admin | Part of add/edit account form |
| `/accounts` (action) | UC 4.8 Lock/unlock | Admin | Toggle action → confirm dialog |

---

### C. Organizational Structure

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/org-units` | UC 4.9 Create org unit | Admin, TCCB | Tree view + "Add child" button → form |
| `/org-units` | UC 4.10 Edit org unit | Admin, TCCB | Inline edit or dialog form |
| `/org-units` | UC 4.11 Dissolve/merge unit | Admin, TCCB | Action button → wizard dialog (decision metadata) |
| `/org-units/$unitId` | UC 4.32 View unit detail | Admin, TCCB | Tabs: overview, personnel, sub-units, history |
| `/org-units/$unitId` | UC 4.30 Appoint/transfer staff | Admin, TCCB | Personnel tab → action dialog |
| `/org-units/$unitId` | UC 4.31 Dismiss staff | Admin, TCCB | Personnel tab → confirm dialog |

---

### D. Catalog Configuration

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/config/salary-coefficients` | UC 4.12–4.15 | TCCB | CRUD table + add/edit dialog + status toggle |
| `/config/allowance-types` | UC 4.16–4.18 | TCCB | CRUD table + add/edit dialog + status toggle |
| `/config/contract-types` | UC 4.19–4.21 | TCCB | CRUD table + add/edit dialog + status toggle |

All three follow the same pattern: paginated table with search, add/edit dialogs, status toggle with confirm.

---

### E. HR Profile Management

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/employees` | UC 4.23 Search profiles | TCCB, TCKT | Data table + real-time keyword search |
| `/employees` | UC 4.24 Advanced filter | TCCB, TCKT | Collapsible filter panel (unit, title, status, gender) |
| `/employees/new` | UC 4.25 Create profile | TCCB | Multi-tab form (personal, contact, education, etc.) |
| `/employees/$id?tab=personal` | UC 4.26 Edit profile | TCCB | Multi-tab form (inline edit per tab) |
| `/employees/$id` | UC 4.28 View detail | TCCB (full), TCKT (read-only) | Multi-tab read-only view + print PDF + export Excel |
| `/employees/$id` (action) | UC 4.27 Mark resigned | TCCB | Action button → confirm dialog (date + reason) |
| `/employees/$id?tab=evaluations` | UC 4.29 Record evaluation | TCCB | Evaluations tab → add reward/discipline dialog |

---

### F. Contracts

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/employees/$id?tab=contracts` | UC 4.22 Create contract | TCCB | Contracts tab → "New contract" button → form (rich text + PDF upload) |

Contract state transitions are automated by backend scheduled jobs (no manual UI action).

---

### G. Training & Development

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/training` | UC 4.33 Create course | TCCB | Data table + "New course" button → form |
| `/training/$courseId` | UC 4.34 Edit course | TCCB | Detail form (editable fields depend on course state) |
| `/training/$courseId` | UC 4.35 View detail | TCCB | Detail view + registered staff list + participation status |
| `/training/$courseId` | UC 4.36 Record results | TCCB | Results form (only when course = Completed) |
| `/my/training` | UC 4.40 Register/cancel | Employee | Course list → register/cancel buttons (state-dependent) |
| `/my/training` | UC 4.41 View registered | Employee | Table of registered courses + status |

---

### H. Reports & Dashboard

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/` (dashboard) | UC 4.37 Overview stats | All (role-specific) | Stats cards + charts (role-filtered data) |
| `/reports` | UC 4.37 Detailed reports | TCCB, TCKT | Report selector → data tables/charts + export PDF/Excel |

Report categories: workforce overview, changes, structure by unit/education/title, appointments, training, contracts, evaluation of courses.

---

### I. Audit Logs

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/audit-logs` | UC 4.42 View audit log | Admin | Data table + filters (time range, user, action, module) |
| `/audit-logs` (dialog) | UC 4.42 View detail | Admin | Dialog showing before/after values |
| `/audit-logs` (action) | UC 4.42 Export | Admin | Export PDF/Excel buttons |

---

### J. Self-Service

| Route | Use Case | Roles | UI Pattern |
|---|---|---|---|
| `/my/profile` | UC 4.38 View own profile | All | Read-only employee detail view |
| `/my/org` | UC 4.39 View own unit | All | Read-only org unit detail view |
| `/my/training` | UC 4.40–4.41 Training | Employee | Register/view courses |

---

## State Machines

### 1. Account Status

```
┌──────────────────┐         Lock (Admin)          ┌────────────┐
│  DANG_HOAT_DONG  │ ─────────────────────────────→ │  BI_KHOA   │
│  (Active)        │ ←───────────────────────────── │  (Locked)  │
└──────────────────┘         Unlock (Admin)         └────────────┘
                                                         ↑
                                                         │ Auto-lock
                                                         │ (when employee resigns)
```

**Frontend implications**:
- Lock/unlock toggle button on accounts table (with confirm dialog)
- Disable "lock" button for the currently logged-in account (UC 4.8 E1)
- Show "Locked" badge on locked accounts

---

### 2. Working Status (Employee)

```
┌──────────────┐    Appoint/Transfer     ┌──────────────┐     Resign (manual/auto)    ┌──────────────┐
│  DANG_CHO_XET│ ──────────────────────→ │ DANG_CONG_TAC│ ──────────────────────────→ │ DA_THOI_VIEC │
│  (Pending    │                         │ (Working)    │                              │ (Resigned)   │
│   Review)    │                         │              │                              │              │
└──────────────┘                         └──────────────┘                              └──────────────┘
       ↑                                        │
       │            Dismiss from unit            │
       └────────────────────────────────────────┘
```

**Frontend implications**:
- Status badge on employee list and detail
- "Mark resigned" button only visible when status ≠ `DA_THOI_VIEC`
- Edit form disabled when `DA_THOI_VIEC`
- Warning dialog if resigning with active contract

---

### 3. Contract Status (Employee-level)

```
┌──────────────┐    Create contract    ┌──────────────┐   Scheduled job     ┌──────────────┐
│ CHUA_HOP_DONG│ ────────────────────→ │ CON_HIEU_LUC │ ─────────────────→ │ CHO_GIA_HAN  │
│ (No contract)│                       │ (Valid)       │  (days ≤ wait)     │ (Pending     │
│              │                       │              │                     │  Renewal)    │
└──────────────┘                       └──────────────┘                     └──────┬───────┘
                                              ↑                                    │
                                              │         Renew (create new)         │
                                              └────────────────────────────────────┘
                                                                                   │
                                                                          Exceeds window
                                                                                   ↓
                                                                         ┌──────────────┐
                                                                         │ HET_HIEU_LUC │
                                                                         │ (Expired)    │
                                                                         └──────────────┘
```

**Frontend implications**:
- "Create contract" button visible only when: `CHUA_HOP_DONG`, `CHO_GIA_HAN`, or `CON_HIEU_LUC` with renewal window
- Status badge with color coding
- Enforce contract type rules in form (min/max months, max renewals)

---

### 4. Org Unit Status

```
┌──────────────────┐        Dissolve         ┌──────────────┐
│  DANG_HOAT_DONG  │ ─────────────────────→  │  GIAI_THE    │
│  (Active)        │                          │  (Dissolved) │
│                  │        Merge             └──────────────┘
│                  │ ─────────────────────→  ┌──────────────┐
│                  │                          │  SAP_NHAP    │
└──────────────────┘                          │  (Merged)    │
                                              └──────────────┘
```

**Frontend implications**:
- Dissolve/merge buttons only on `DANG_HOAT_DONG` units
- Dissolved/merged units: hide edit, add-child, staffing buttons
- Status change requires decision metadata form (decision number, date, file, reason)
- Cascade warning for units with sub-units or management staff

---

### 5. Training Course Status

```
┌──────────────────┐                    ┌──────────────────┐                    ┌──────────────────┐
│  DANG_MO_DANG_KY │ ────────────────→  │  DANG_DAO_TAO    │ ────────────────→  │  DA_HOAN_THANH   │
│  (Open for       │   Start training   │  (In Training)   │   Complete         │  (Completed)     │
│   Registration)  │                    │                  │                    │                  │
└──────────────────┘                    └──────────────────┘                    └──────────────────┘
```

**No rollback. No skipping.**

---

### 6. Training Participation Status

```
┌──────────────┐    Course starts     ┌──────────────┐    Record result     ┌──────────────┐
│  DA_DANG_KY  │ ──────────────────→  │  DANG_HOC    │ ──────────────────→  │  HOAN_THANH  │
│  (Registered)│   (batch auto)       │  (In Training)│                     │  (Completed) │
└──────────────┘                      └──────────────┘                      └──────────────┘
                                                       ──────────────────→  ┌──────────────┐
                                                                            │  KHONG_DAT   │
                                                                            │  (Failed)    │
                                                                            └──────────────┘
```

**Frontend implications**:
- "Register" button: visible when course = `DANG_MO_DANG_KY` AND within registration window AND capacity available
- "Cancel registration" button: visible when participation = `DA_DANG_KY` AND course still open
- "Record results" form: visible when course = `DA_HOAN_THANH`
- Certificate PDF upload required when marking `HOAN_THANH`

---

## State Machine Helper Pattern

```typescript
// Encode state machines as typed guard functions
// features/training/utils.ts

import { TrainingCourseStatus, ParticipationStatus } from "@hrms/shared";

export function canRegister(
  course: { status: string; registrationStart: string; registrationEnd: string; currentCount: number; capacity: number },
): boolean {
  const now = new Date();
  return (
    course.status === TrainingCourseStatus.OPEN_REGISTRATION &&
    now >= new Date(course.registrationStart) &&
    now <= new Date(course.registrationEnd) &&
    course.currentCount < course.capacity
  );
}

export function canCancelRegistration(
  course: { status: string },
  participation: { status: string },
): boolean {
  return (
    course.status === TrainingCourseStatus.OPEN_REGISTRATION &&
    participation.status === ParticipationStatus.REGISTERED
  );
}

export function canRecordResults(course: { status: string }): boolean {
  return course.status === TrainingCourseStatus.COMPLETED;
}

export function canCreateContract(
  employee: { contractStatus: string },
  // ...additional context
): boolean {
  return [
    "CHUA_HOP_DONG",
    "CHO_GIA_HAN",
  ].includes(employee.contractStatus);
  // Note: CON_HIEU_LUC also allowed if within renewal window — needs more context
}

export function canEditOrgUnit(unit: { status: string }): boolean {
  return unit.status === "DANG_HOAT_DONG";
}

export function canEditEmployee(employee: { workStatus: string }): boolean {
  return employee.workStatus !== "DA_THOI_VIEC";
}
```

**Usage in components**:
```typescript
{canRegister(course) && (
  <Button onClick={() => registerMutation.mutate()}>Đăng ký</Button>
)}

{canEditEmployee(employee) && (
  <Button variant="outline" asChild>
    <Link to="/employees/$employeeId" params={{ employeeId }}>
      Chỉnh sửa
    </Link>
  </Button>
)}
```
