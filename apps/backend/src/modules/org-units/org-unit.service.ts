import type {
  CreateOrgUnitInput,
  DissolveOrgUnitInput,
  MergeOrgUnitInput,
  UpdateOrgUnitInput,
} from "@hrms/shared";
import { type SQL, and, eq, ilike, isNull, or } from "drizzle-orm";
import { BadRequestError, ConflictError, NotFoundError } from "../../common/utils/errors";
import { db } from "../../db";
import {
  type OrgUnit,
  employeeAssignments,
  employees,
  employmentContracts,
  orgUnitStatusEvents,
  orgUnits,
} from "../../db/schema";
import { campuses } from "../../db/schema";

// ── Tree ────────────────────────────────────────────────────────────────────

export interface OrgUnitTreeNode extends OrgUnit {
  children: OrgUnitTreeNode[];
}

export async function getTree(campusId?: string): Promise<OrgUnitTreeNode[]> {
  const allUnits = await db.select().from(orgUnits).orderBy(orgUnits.unitName);

  const map = new Map<string, OrgUnitTreeNode>();
  for (const u of allUnits) {
    map.set(u.id, { ...u, children: [] });
  }

  const roots: OrgUnitTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// ── Dropdown ────────────────────────────────────────────────────────────────

export async function dropdown(search?: string, limit = 20) {
  let where: SQL | undefined = eq(orgUnits.status, "active");
  if (search) {
    where = and(
      where,
      or(ilike(orgUnits.unitName, `%${search}%`), ilike(orgUnits.unitCode, `%${search}%`)),
    );
  }

  const items = await db
    .select({ value: orgUnits.id, label: orgUnits.unitName })
    .from(orgUnits)
    .where(where)
    .limit(limit)
    .orderBy(orgUnits.unitName);

  return items;
}

// ── CRUD ────────────────────────────────────────────────────────────────────

export async function getById(id: string) {
  const [item] = await db.select().from(orgUnits).where(eq(orgUnits.id, id));
  if (!item) throw new NotFoundError("Không tìm thấy đơn vị tổ chức");
  return item;
}

export async function getDetail(id: string) {
  const unit = await getById(id);

  const children = await db
    .select()
    .from(orgUnits)
    .where(eq(orgUnits.parentId, id))
    .orderBy(orgUnits.unitName);

  const assignments = await db
    .select({
      id: employeeAssignments.id,
      employeeId: employeeAssignments.employeeId,
      positionTitle: employeeAssignments.positionTitle,
      startedOn: employeeAssignments.startedOn,
      endedOn: employeeAssignments.endedOn,
      staffCode: employees.staffCode,
      fullName: employees.fullName,
    })
    .from(employeeAssignments)
    .innerJoin(employees, eq(employeeAssignments.employeeId, employees.id))
    .where(and(eq(employeeAssignments.orgUnitId, id), isNull(employeeAssignments.endedOn)))
    .orderBy(employeeAssignments.startedOn);

  const statusEvents = await db
    .select()
    .from(orgUnitStatusEvents)
    .where(eq(orgUnitStatusEvents.orgUnitId, id))
    .orderBy(orgUnitStatusEvents.createdAt);

  return { ...unit, children, assignments, statusEvents };
}

export async function create(data: CreateOrgUnitInput, createdByUserId?: string) {
  // Check parent validity
  if (data.parentId) {
    const parent = await getById(data.parentId);
    if (parent.status !== "active") {
      throw new BadRequestError("Không thể tạo đơn vị trực thuộc đơn vị đã giải thể/sáp nhập");
    }
    if (parent.isLeafConfirmed) {
      throw new BadRequestError(
        "Đơn vị cha đã được xác nhận là đơn vị nút, không thể thêm đơn vị con",
      );
    }
  }

  // Check unique code
  const existing = await db
    .select({ id: orgUnits.id })
    .from(orgUnits)
    .where(eq(orgUnits.unitCode, data.unitCode))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Mã đơn vị đã tồn tại. Vui lòng nhập mã khác.");
  }

  // Get default campus
  const [campus] = await db.select({ id: campuses.id }).from(campuses).limit(1);
  if (!campus)
    throw new BadRequestError("Không tìm thấy cơ sở — vui lòng kiểm tra dữ liệu hệ thống");

  const [created] = await db
    .insert(orgUnits)
    .values({
      ...data,
      campusId: campus.id,
      email: data.email || null,
    })
    .returning();

  if (!created) throw new BadRequestError("Không thể tạo đơn vị tổ chức");
  return created;
}

export async function update(id: string, data: UpdateOrgUnitInput) {
  const unit = await getById(id);

  if (unit.status !== "active") {
    throw new BadRequestError("Không thể chỉnh sửa đơn vị đã giải thể/sáp nhập");
  }

  const [updated] = await db
    .update(orgUnits)
    .set({ ...data, email: data.email || null, updatedAt: new Date() })
    .where(eq(orgUnits.id, id))
    .returning();

  if (!updated) throw new BadRequestError("Không thể cập nhật đơn vị tổ chức");
  return updated;
}

// ── Dissolve ────────────────────────────────────────────────────────────────

export async function dissolve(id: string, data: DissolveOrgUnitInput, userId?: string) {
  const unit = await getById(id);

  if (unit.status !== "active") {
    throw new BadRequestError("Đơn vị này không còn hoạt động");
  }

  // Check for managers that need dismissal first
  const managersInUnit = await db
    .select({ id: employeeAssignments.id, positionTitle: employeeAssignments.positionTitle })
    .from(employeeAssignments)
    .where(and(eq(employeeAssignments.orgUnitId, id), isNull(employeeAssignments.endedOn)));

  const hasManagers = managersInUnit.some(
    (a) =>
      a.positionTitle && (a.positionTitle.includes("Trưởng") || a.positionTitle.includes("Phó")),
  );

  if (hasManagers) {
    throw new BadRequestError(
      "Vui lòng thực hiện bãi nhiệm chức vụ quản lý của đơn vị trước khi thực hiện giải thể",
    );
  }

  // Get child units
  const children = await db
    .select()
    .from(orgUnits)
    .where(and(eq(orgUnits.parentId, id), eq(orgUnits.status, "active")));

  if (data.childAction === "reassign") {
    if (!data.newParentId) {
      throw new BadRequestError(
        "Vui lòng chọn đơn vị quản lý mới cho các đơn vị trực thuộc trước khi giải thể",
      );
    }
    // Reassign children to new parent
    if (children.length > 0) {
      await db
        .update(orgUnits)
        .set({ parentId: data.newParentId, updatedAt: new Date() })
        .where(eq(orgUnits.parentId, id));
    }
  } else {
    // Dissolve all children recursively
    for (const child of children) {
      await db
        .update(orgUnits)
        .set({ status: "dissolved", statusUpdatedAt: new Date(), updatedAt: new Date() })
        .where(eq(orgUnits.id, child.id));
    }
  }

  // Update employees in this unit
  await handleEmployeesOnDissolve(id);

  // Update unit status
  const [updated] = await db
    .update(orgUnits)
    .set({ status: "dissolved", statusUpdatedAt: new Date(), updatedAt: new Date() })
    .where(eq(orgUnits.id, id))
    .returning();

  // Record event
  await db.insert(orgUnitStatusEvents).values({
    orgUnitId: id,
    eventType: "DISSOLVE",
    effectiveOn: data.effectiveOn,
    decisionNo: data.decisionNo,
    decisionOn: data.decisionOn,
    reason: data.reason,
    note: data.note,
    createdByUserId: userId,
  });

  if (!updated) throw new BadRequestError("Không thể cập nhật trạng thái đơn vị");
  return updated;
}

// ── Merge ───────────────────────────────────────────────────────────────────

export async function merge(id: string, data: MergeOrgUnitInput, userId?: string) {
  const unit = await getById(id);

  if (unit.status !== "active") {
    throw new BadRequestError("Đơn vị này không còn hoạt động");
  }

  const target = await getById(data.targetOrgUnitId);
  if (target.status !== "active") {
    throw new BadRequestError("Đơn vị nhận sáp nhập không còn hoạt động");
  }

  // Move children to target
  await db
    .update(orgUnits)
    .set({ parentId: data.targetOrgUnitId, updatedAt: new Date() })
    .where(and(eq(orgUnits.parentId, id), eq(orgUnits.status, "active")));

  // Move employees to target (update currentOrgUnitId, keep status)
  await db
    .update(employees)
    .set({ currentOrgUnitId: data.targetOrgUnitId, updatedAt: new Date() })
    .where(eq(employees.currentOrgUnitId, id));

  // End current assignments, create new ones at target
  const activeAssignments = await db
    .select()
    .from(employeeAssignments)
    .where(and(eq(employeeAssignments.orgUnitId, id), isNull(employeeAssignments.endedOn)));

  const today = new Date().toISOString().split("T")[0];
  for (const assignment of activeAssignments) {
    // End old assignment
    await db
      .update(employeeAssignments)
      .set({ endedOn: today })
      .where(eq(employeeAssignments.id, assignment.id));

    // Create new assignment at target
    await db.insert(employeeAssignments).values({
      employeeId: assignment.employeeId,
      orgUnitId: data.targetOrgUnitId,
      positionTitle: assignment.positionTitle,
      eventType: "APPOINT",
      startedOn: data.effectiveOn,
      createdByUserId: userId,
    });
  }

  // Update unit status
  const [updated] = await db
    .update(orgUnits)
    .set({ status: "merged", statusUpdatedAt: new Date(), updatedAt: new Date() })
    .where(eq(orgUnits.id, id))
    .returning();

  // Record event
  await db.insert(orgUnitStatusEvents).values({
    orgUnitId: id,
    eventType: "MERGE",
    effectiveOn: data.effectiveOn,
    decisionNo: data.decisionNo,
    decisionOn: data.decisionOn,
    reason: data.reason,
    note: data.note,
    mergedIntoOrgUnitId: data.targetOrgUnitId,
    createdByUserId: userId,
  });

  if (!updated) throw new BadRequestError("Không thể cập nhật trạng thái đơn vị");
  return updated;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function handleEmployeesOnDissolve(orgUnitId: string) {
  // Get employees in this org unit
  const emps = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.currentOrgUnitId, orgUnitId));

  const today = new Date().toISOString().split("T")[0];

  for (const emp of emps) {
    // Set contracts to expired
    await db
      .update(employmentContracts)
      .set({ status: "expired", updatedAt: new Date() })
      .where(
        and(eq(employmentContracts.employeeId, emp.id), eq(employmentContracts.status, "valid")),
      );

    // Update employee: clear org, set statuses
    await db
      .update(employees)
      .set({
        currentOrgUnitId: null,
        currentPositionTitle: null,
        contractStatus: "none",
        workStatus: "pending",
        updatedAt: new Date(),
      })
      .where(eq(employees.id, emp.id));

    // End active assignments
    await db
      .update(employeeAssignments)
      .set({ endedOn: today })
      .where(
        and(
          eq(employeeAssignments.employeeId, emp.id),
          eq(employeeAssignments.orgUnitId, orgUnitId),
          isNull(employeeAssignments.endedOn),
        ),
      );
  }
}
