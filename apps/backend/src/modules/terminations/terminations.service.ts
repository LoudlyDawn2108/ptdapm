import type { CreateTerminationInput } from "@hrms/shared";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { withAuditLog } from "../../common/utils/user-context";
import { db } from "../../db";
import { authUsers, session } from "../../db/schema/auth";
import { employmentContracts } from "../../db/schema/contracts";
import {
  type EmployeeTermination,
  employeeAssignments,
  employeeTerminations,
  employees,
} from "../../db/schema/employees";

export async function terminate(
  employeeId: string,
  data: CreateTerminationInput,
  actorUserId: string,
): Promise<EmployeeTermination> {
  // 1. Kiểm tra nhân sự tồn tại
  const [employee] = await db
    .select({
      id: employees.id,
      workStatus: employees.workStatus,
    })
    .from(employees)
    .where(eq(employees.id, employeeId));

  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");

  // 2. E1: Nhân sự đã ở trạng thái thôi việc
  if (employee.workStatus === "terminated") {
    throw new BadRequestError(
      "Nhân sự này đã được đánh dấu thôi việc trước đó.",
    );
  }

  // 3. E2: Kiểm tra hợp đồng còn hiệu lực
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

  if (activeContract) {
    throw new BadRequestError(
      "Vui lòng thanh lý hợp đồng và bãi nhiệm chức vụ của nhân sự trước khi đánh dấu thôi việc.",
    );
  }

  // 4. E2: Kiểm tra còn giữ chức vụ (assignment chưa kết thúc)
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

  if (activeAssignment) {
    throw new BadRequestError(
      "Vui lòng thanh lý hợp đồng và bãi nhiệm chức vụ của nhân sự trước khi đánh dấu thôi việc.",
    );
  }

  // Wrap all mutations in a transaction for atomicity
  const result = await db.transaction(async (tx) => {
    // 5. Insert bản ghi thôi việc
    const [termination] = await tx
      .insert(employeeTerminations)
      .values({
        employeeId,
        terminatedOn: data.terminatedOn,
        reason: data.reason,
        isAuto: false,
        createdByUserId: actorUserId,
      })
      .returning();

    if (!termination) throw new Error("Insert termination failed");

    // 6. Cập nhật trạng thái nhân sự
    await tx
      .update(employees)
      .set({
        workStatus: "terminated",
        currentOrgUnitId: null,
        currentPositionTitle: null,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, employeeId));

    // 7. Cập nhật tất cả hợp đồng valid/renewal_wait → expired
    await tx
      .update(employmentContracts)
      .set({ status: "expired", updatedAt: new Date() })
      .where(
        and(
          eq(employmentContracts.employeeId, employeeId),
          inArray(employmentContracts.status, ["valid", "draft"]),
        ),
      );

    // 8. Kết thúc tất cả assignments chưa kết thúc
    await tx
      .update(employeeAssignments)
      .set({ endedOn: data.terminatedOn })
      .where(
        and(
          eq(employeeAssignments.employeeId, employeeId),
          isNull(employeeAssignments.endedOn),
        ),
      );

    // 9. Khóa tài khoản liên kết
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

      await tx.delete(session).where(eq(session.userId, linkedUser.id));
    }

    return termination;
  });

  // 10. Ghi audit log (outside transaction — db type required)
  await withAuditLog(
    db,
    actorUserId,
    "TERMINATE",
    "employee",
    employeeId,
    { workStatus: employee.workStatus },
    {
      workStatus: "terminated",
      terminatedOn: data.terminatedOn,
      reason: data.reason,
    },
  );

  return result;
}

export async function getByEmployeeId(
  employeeId: string,
): Promise<EmployeeTermination> {
  // Kiểm tra nhân sự tồn tại
  const [employee] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.id, employeeId));

  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");

  // Lấy bản ghi thôi việc mới nhất
  const [termination] = await db
    .select()
    .from(employeeTerminations)
    .where(eq(employeeTerminations.employeeId, employeeId))
    .orderBy(employeeTerminations.createdAt)
    .limit(1);

  if (!termination)
    throw new NotFoundError("Nhân sự chưa có bản ghi thôi việc");

  return termination;
}
