import type { CreateTerminationInput } from "@hrms/shared";
import { and, eq, isNull } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { db } from "../../db";
import {
  employeeAssignments,
  employeeTerminations,
  employees,
  employmentContracts,
} from "../../db/schema";
import { authUsers, session as sessionTable } from "../../db/schema/auth";

export async function getByEmployeeId(employeeId: string) {
  const [emp] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);
  if (!emp) throw new NotFoundError("Không tìm thấy nhân sự");

  const [termination] = await db
    .select()
    .from(employeeTerminations)
    .where(eq(employeeTerminations.employeeId, employeeId))
    .orderBy(employeeTerminations.createdAt)
    .limit(1);

  return termination ?? null;
}

export async function terminate(
  employeeId: string,
  data: CreateTerminationInput,
  userId?: string,
) {
  // 1. Verify employee exists
  const [emp] = await db
    .select({
      id: employees.id,
      workStatus: employees.workStatus,
    })
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);
  if (!emp) throw new NotFoundError("Không tìm thấy nhân sự");

  // E1: Employee already terminated
  if (emp.workStatus === "terminated") {
    throw new BadRequestError(
      "Nhân sự này đã được đánh dấu thôi việc trước đó",
    );
  }

  // E2: Check for active contracts (status = "valid")
  const [activeContract] = await db
    .select({ id: employmentContracts.id })
    .from(employmentContracts)
    .where(
      and(
        eq(employmentContracts.employeeId, employeeId),
        eq(employmentContracts.status, "valid"),
      ),
    )
    .limit(1);

  // E2: Check for active management assignments (active = no endedOn)
  const [activeAssignment] = await db
    .select({ id: employeeAssignments.id })
    .from(employeeAssignments)
    .where(
      and(
        eq(employeeAssignments.employeeId, employeeId),
        isNull(employeeAssignments.endedOn),
      ),
    )
    .limit(1);

  if (activeContract || activeAssignment) {
    throw new BadRequestError(
      "Vui lòng thanh lý hợp đồng và bãi nhiệm chức vụ của nhân sự trước khi đánh dấu thôi việc",
    );
  }

  const today = new Date().toISOString().split("T")[0]!;

  return await db.transaction(async (tx) => {
    // 2. Insert termination record
    const [termination] = await tx
      .insert(employeeTerminations)
      .values({
        employeeId,
        terminatedOn: data.terminatedOn,
        reason: data.reason,
        isAuto: false,
        createdByUserId: userId,
      })
      .returning();

    // 3. Update employee: workStatus → terminated, contractStatus → expired, clear org unit
    await tx
      .update(employees)
      .set({
        workStatus: "terminated",
        contractStatus: "expired",
        currentOrgUnitId: null,
        currentPositionTitle: null,
        terminatedOn: data.terminatedOn,
        terminationReason: data.reason,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, employeeId));

    // 4. Expire all non-expired contracts
    await tx
      .update(employmentContracts)
      .set({ status: "expired", updatedAt: new Date() })
      .where(
        and(
          eq(employmentContracts.employeeId, employeeId),
          eq(employmentContracts.status, "draft"),
        ),
      );

    // 5. End all remaining assignments
    await tx
      .update(employeeAssignments)
      .set({ endedOn: today, eventType: "DISMISS" })
      .where(
        and(
          eq(employeeAssignments.employeeId, employeeId),
          isNull(employeeAssignments.endedOn),
        ),
      );

    // 6. Lock linked auth account + revoke sessions
    const [linkedUser] = await tx
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.employeeId, employeeId))
      .limit(1);

    if (linkedUser) {
      await tx
        .update(authUsers)
        .set({ status: "locked", updatedAt: new Date() })
        .where(eq(authUsers.id, linkedUser.id));

      await tx
        .delete(sessionTable)
        .where(eq(sessionTable.userId, linkedUser.id));
    }

    return termination!;
  });
}
