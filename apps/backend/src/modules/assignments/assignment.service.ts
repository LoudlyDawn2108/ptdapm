import type { CreateAssignmentInput } from "@hrms/shared";
import { and, eq, isNull } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { db } from "../../db";
import { employeeAssignments, employees, orgUnits } from "../../db/schema";

export async function listByOrgUnit(orgUnitId: string) {
  // Verify org unit exists
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

export async function appoint(
  orgUnitId: string,
  data: CreateAssignmentInput,
  userId?: string,
) {
  // Verify org unit exists and is active
  const [unit] = await db.select().from(orgUnits).where(eq(orgUnits.id, orgUnitId));
  if (!unit) throw new NotFoundError("Không tìm thấy đơn vị tổ chức");
  if (unit.status !== "active") {
    throw new BadRequestError("Không thể bổ nhiệm vào đơn vị đã giải thể/sáp nhập");
  }

  // Verify employee exists
  const [emp] = await db.select().from(employees).where(eq(employees.id, data.employeeId));
  if (!emp) throw new NotFoundError("Không tìm thấy nhân sự");

  // Check if employee already has active assignment in this unit
  const [existingAssignment] = await db
    .select({ id: employeeAssignments.id })
    .from(employeeAssignments)
    .where(
      and(
        eq(employeeAssignments.employeeId, data.employeeId),
        eq(employeeAssignments.orgUnitId, orgUnitId),
        isNull(employeeAssignments.endedOn),
      ),
    )
    .limit(1);

  if (existingAssignment) {
    throw new BadRequestError("Nhân sự đã được bổ nhiệm tại đơn vị này");
  }

  // Create assignment
  const [assignment] = await db
    .insert(employeeAssignments)
    .values({
      employeeId: data.employeeId,
      orgUnitId,
      positionTitle: data.positionTitle,
      eventType: "APPOINT",
      startedOn: data.startedOn,
      createdByUserId: userId,
    })
    .returning();

  // Update employee's current org unit and position
  await db
    .update(employees)
    .set({
      currentOrgUnitId: orgUnitId,
      currentPositionTitle: data.positionTitle,
      workStatus: "working",
      updatedAt: new Date(),
    })
    .where(eq(employees.id, data.employeeId));

  if (!assignment) throw new Error("Insert failed");
  return assignment;
}

export async function dismiss(
  orgUnitId: string,
  assignmentId: string,
  userId?: string,
) {
  const [assignment] = await db
    .select()
    .from(employeeAssignments)
    .where(
      and(
        eq(employeeAssignments.id, assignmentId),
        eq(employeeAssignments.orgUnitId, orgUnitId),
      ),
    );

  if (!assignment) throw new NotFoundError("Không tìm thấy bổ nhiệm");

  if (assignment.endedOn) {
    throw new BadRequestError("Bổ nhiệm này đã kết thúc");
  }

  const today = new Date().toISOString().split("T")[0];

  // End the assignment
  await db
    .update(employeeAssignments)
    .set({ endedOn: today, eventType: "DISMISS" })
    .where(eq(employeeAssignments.id, assignmentId));

  // Check if employee has other active assignments
  const [otherAssignment] = await db
    .select({ id: employeeAssignments.id, orgUnitId: employeeAssignments.orgUnitId })
    .from(employeeAssignments)
    .where(
      and(
        eq(employeeAssignments.employeeId, assignment.employeeId),
        isNull(employeeAssignments.endedOn),
      ),
    )
    .limit(1);

  if (otherAssignment) {
    // Transfer to the other assignment's org unit
    await db
      .update(employees)
      .set({
        currentOrgUnitId: otherAssignment.orgUnitId,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, assignment.employeeId));
  } else {
    // No other active assignments — clear org unit
    await db
      .update(employees)
      .set({
        currentOrgUnitId: null,
        currentPositionTitle: null,
        workStatus: "pending",
        updatedAt: new Date(),
      })
      .where(eq(employees.id, assignment.employeeId));
  }

  return { id: assignmentId };
}
