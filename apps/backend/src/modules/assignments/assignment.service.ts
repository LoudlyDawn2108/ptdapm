import { type CreateAssignmentInput, isTodayOrFutureDateString } from "@hrms/shared";
import { and, desc, eq, isNull } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { db } from "../../db";
import { employeeAssignments, employees, orgUnits } from "../../db/schema";

function getTodayDateString(now = new Date()) {
  return now.toISOString().split("T")[0]!;
}

function assertStartedOnNotPast(startedOn: string) {
  if (!isTodayOrFutureDateString(startedOn)) {
    throw new BadRequestError("Ngày bắt đầu không được ở trong quá khứ");
  }
}

async function getActiveOrgUnit(orgUnitId: string, action: "appoint" | "dismiss") {
  const [unit] = await db.select().from(orgUnits).where(eq(orgUnits.id, orgUnitId));
  if (!unit) throw new NotFoundError("Không tìm thấy đơn vị tổ chức");

  if (unit.status !== "active") {
    throw new BadRequestError(
      action === "appoint"
        ? "Không thể bổ nhiệm vào đơn vị đã giải thể/sáp nhập"
        : "Không thể bãi nhiệm tại đơn vị đã giải thể/sáp nhập",
    );
  }

  return unit;
}

async function getEmployeeOrThrow(employeeId: string) {
  const [employee] = await db.select().from(employees).where(eq(employees.id, employeeId));
  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");
  return employee;
}

async function listActiveAssignmentsByEmployee(employeeId: string) {
  return db
    .select({
      id: employeeAssignments.id,
      orgUnitId: employeeAssignments.orgUnitId,
      positionTitle: employeeAssignments.positionTitle,
      startedOn: employeeAssignments.startedOn,
      createdAt: employeeAssignments.createdAt,
    })
    .from(employeeAssignments)
    .where(and(eq(employeeAssignments.employeeId, employeeId), isNull(employeeAssignments.endedOn)))
    .orderBy(desc(employeeAssignments.startedOn), desc(employeeAssignments.createdAt));
}

async function syncEmployeeAssignmentState(
  employeeId: string,
  assignment?: { orgUnitId: string; positionTitle: string | null },
) {
  if (assignment) {
    await db
      .update(employees)
      .set({
        currentOrgUnitId: assignment.orgUnitId,
        currentPositionTitle: assignment.positionTitle ?? null,
        workStatus: "working",
        updatedAt: new Date(),
      })
      .where(eq(employees.id, employeeId));

    return;
  }

  await db
    .update(employees)
    .set({
      currentOrgUnitId: null,
      currentPositionTitle: null,
      workStatus: "pending",
      updatedAt: new Date(),
    })
    .where(eq(employees.id, employeeId));
}

export async function listByOrgUnit(orgUnitId: string) {
  const [unit] = await db.select().from(orgUnits).where(eq(orgUnits.id, orgUnitId));
  if (!unit) throw new NotFoundError("Không tìm thấy đơn vị tổ chức");

  return db
    .select({
      id: employeeAssignments.id,
      employeeId: employeeAssignments.employeeId,
      positionTitle: employeeAssignments.positionTitle,
      eventType: employeeAssignments.eventType,
      startedOn: employeeAssignments.startedOn,
      endedOn: employeeAssignments.endedOn,
      note: employeeAssignments.note,
      staffCode: employees.staffCode,
      fullName: employees.fullName,
    })
    .from(employeeAssignments)
    .innerJoin(employees, eq(employeeAssignments.employeeId, employees.id))
    .where(eq(employeeAssignments.orgUnitId, orgUnitId))
    .orderBy(employeeAssignments.startedOn);
}

export async function appoint(orgUnitId: string, data: CreateAssignmentInput, userId?: string) {
  await getActiveOrgUnit(orgUnitId, "appoint");
  await getEmployeeOrThrow(data.employeeId);
  assertStartedOnNotPast(data.startedOn);

  const activeAssignments = await listActiveAssignmentsByEmployee(data.employeeId);
  if (activeAssignments.some((assignment) => assignment.orgUnitId === orgUnitId)) {
    throw new BadRequestError("Nhân sự đã được bổ nhiệm tại đơn vị này");
  }

  if (data.sourceOrgUnitId) {
    const sourceAssignment = activeAssignments.find(
      (assignment) => assignment.orgUnitId === data.sourceOrgUnitId,
    );

    if (!sourceAssignment) {
      throw new BadRequestError("Nhân sự không đang công tác tại đơn vị nguồn đã chọn");
    }
  }

  if (activeAssignments.length > 0) {
    if (data.sourceOrgUnitId) {
      await db
        .update(employeeAssignments)
        .set({ endedOn: data.startedOn, eventType: "DISMISS" })
        .where(
          and(
            eq(employeeAssignments.employeeId, data.employeeId),
            eq(employeeAssignments.orgUnitId, data.sourceOrgUnitId),
            isNull(employeeAssignments.endedOn),
          ),
        );
    } else {
      await db
        .update(employeeAssignments)
        .set({ endedOn: data.startedOn, eventType: "DISMISS" })
        .where(
          and(
            eq(employeeAssignments.employeeId, data.employeeId),
            isNull(employeeAssignments.endedOn),
          ),
        );
    }
  }

  const [assignment] = await db
    .insert(employeeAssignments)
    .values({
      employeeId: data.employeeId,
      orgUnitId,
      positionTitle: data.positionTitle ?? null,
      eventType: "APPOINT",
      startedOn: data.startedOn,
      createdByUserId: userId,
    })
    .returning();

  await syncEmployeeAssignmentState(data.employeeId, {
    orgUnitId,
    positionTitle: data.positionTitle ?? null,
  });

  if (!assignment) throw new Error("Insert failed");
  return assignment;
}

export async function dismissAssignment(orgUnitId: string, assignmentId: string) {
  await getActiveOrgUnit(orgUnitId, "dismiss");

  const [assignment] = await db
    .select()
    .from(employeeAssignments)
    .where(
      and(eq(employeeAssignments.id, assignmentId), eq(employeeAssignments.orgUnitId, orgUnitId)),
    );

  if (!assignment) throw new NotFoundError("Không tìm thấy bổ nhiệm");
  if (assignment.endedOn) {
    throw new BadRequestError("Bổ nhiệm này đã kết thúc");
  }

  const today = getTodayDateString();

  const [updatedAssignment] = await db
    .update(employeeAssignments)
    .set({ endedOn: today, eventType: "DISMISS" })
    .where(eq(employeeAssignments.id, assignmentId))
    .returning();

  const [nextAssignment] = await listActiveAssignmentsByEmployee(assignment.employeeId);
  await syncEmployeeAssignmentState(assignment.employeeId, nextAssignment);

  if (!updatedAssignment) throw new Error("Update failed");
  return updatedAssignment;
}

export async function dismiss(orgUnitId: string, assignmentId: string, userId?: string) {
  void userId;

  const updatedAssignment = await dismissAssignment(orgUnitId, assignmentId);
  return { id: updatedAssignment.id };
}
