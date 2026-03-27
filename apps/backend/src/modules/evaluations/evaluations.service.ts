import type { CreateEvaluationInput, PaginatedResponse, UpdateEvaluationInput } from "@hrms/shared";
import { type SQL, and, eq } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../common/utils/pagination";
import { db } from "../../db";
import { auditLogs } from "../../db/schema/audit";
import { employees } from "../../db/schema/employees";
import { type EmployeeEvaluation, employeeEvaluations } from "../../db/schema/evaluations";

async function ensureEmployeeExists(employeeId: string) {
  const [employee] = await db
    .select({ id: employees.id, workStatus: employees.workStatus })
    .from(employees)
    .where(eq(employees.id, employeeId));

  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");
  return employee;
}

function ensureEmployeeCanBeEvaluated(workStatus: string) {
  if (workStatus === "terminated") {
    throw new BadRequestError("Không thể tạo hoặc cập nhật đánh giá cho nhân sự đã thôi việc.");
  }
}

async function ensureEvaluationExists(
  employeeId: string,
  evaluationId: string,
): Promise<EmployeeEvaluation> {
  const [evaluation] = await db
    .select()
    .from(employeeEvaluations)
    .where(
      and(eq(employeeEvaluations.id, evaluationId), eq(employeeEvaluations.employeeId, employeeId)),
    );

  if (!evaluation) throw new NotFoundError("Không tìm thấy bản đánh giá");
  return evaluation;
}

export async function list(
  employeeId: string,
  page: number,
  pageSize: number,
  evalType?: string,
): Promise<PaginatedResponse<EmployeeEvaluation>> {
  await ensureEmployeeExists(employeeId);

  const conditions: SQL[] = [eq(employeeEvaluations.employeeId, employeeId)];

  if (evalType) {
    conditions.push(eq(employeeEvaluations.evalType, evalType));
  }

  const where = and(...conditions);

  const [items, total] = await Promise.all([
    db
      .select()
      .from(employeeEvaluations)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(employeeEvaluations.createdAt),
    countRows(employeeEvaluations, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(
  employeeId: string,
  evaluationId: string,
): Promise<EmployeeEvaluation> {
  await ensureEmployeeExists(employeeId);
  return ensureEvaluationExists(employeeId, evaluationId);
}

export async function create(
  employeeId: string,
  data: CreateEvaluationInput,
  actorUserId: string,
): Promise<EmployeeEvaluation> {
  const employee = await ensureEmployeeExists(employeeId);
  ensureEmployeeCanBeEvaluated(employee.workStatus);

  const [created] = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(employeeEvaluations)
      .values({
        employeeId,
        evalType: data.evalType,
        rewardType: data.rewardType ?? null,
        rewardName: data.rewardName ?? null,
        decisionOn: data.decisionOn ?? null,
        decisionNo: data.decisionNo ?? null,
        content: data.content ?? null,
        rewardAmount: data.rewardAmount ?? null,
        disciplineType: data.disciplineType ?? null,
        disciplineName: data.disciplineName ?? null,
        reason: data.reason ?? null,
        actionForm: data.actionForm ?? null,
        visibleToEmployee: data.visibleToEmployee ?? true,
        visibleToTckt: data.visibleToTckt ?? true,
        createdByUserId: actorUserId,
      })
      .returning();

    if (!row) throw new Error("Insert evaluation failed");

    await tx.insert(auditLogs).values({
      actorUserId,
      action: "CREATE",
      entityType: "employee_evaluation",
      entityId: row.id,
      newValues: {
        employeeId,
        evalType: data.evalType,
      },
    });

    return [row] as const;
  });

  if (!created) throw new Error("Insert evaluation failed");

  return created;
}

export async function update(
  employeeId: string,
  evaluationId: string,
  data: UpdateEvaluationInput,
  actorUserId: string,
): Promise<EmployeeEvaluation> {
  const employee = await ensureEmployeeExists(employeeId);
  ensureEmployeeCanBeEvaluated(employee.workStatus);
  const existing = await ensureEvaluationExists(employeeId, evaluationId);

  const [updated] = await db.transaction(async (tx) => {
    const [row] = await tx
      .update(employeeEvaluations)
      .set({
        evalType: data.evalType,
        rewardType: data.rewardType ?? null,
        rewardName: data.rewardName ?? null,
        decisionOn: data.decisionOn ?? null,
        decisionNo: data.decisionNo ?? null,
        content: data.content ?? null,
        rewardAmount: data.rewardAmount ?? null,
        disciplineType: data.disciplineType ?? null,
        disciplineName: data.disciplineName ?? null,
        reason: data.reason ?? null,
        actionForm: data.actionForm ?? null,
        visibleToEmployee: data.visibleToEmployee ?? true,
        visibleToTckt: data.visibleToTckt ?? true,
      })
      .where(eq(employeeEvaluations.id, evaluationId))
      .returning();

    if (!row) throw new Error("Update evaluation failed");

    await tx.insert(auditLogs).values({
      actorUserId,
      action: "UPDATE",
      entityType: "employee_evaluation",
      entityId: evaluationId,
      oldValues: { evalType: existing.evalType },
      newValues: { evalType: data.evalType },
    });

    return [row] as const;
  });

  if (!updated) throw new Error("Update evaluation failed");

  return updated;
}

export async function remove(
  employeeId: string,
  evaluationId: string,
  actorUserId: string,
): Promise<{ id: string }> {
  await ensureEmployeeExists(employeeId);
  const existing = await ensureEvaluationExists(employeeId, evaluationId);

  await db.transaction(async (tx) => {
    await tx.delete(employeeEvaluations).where(eq(employeeEvaluations.id, evaluationId));

    await tx.insert(auditLogs).values({
      actorUserId,
      action: "DELETE",
      entityType: "employee_evaluation",
      entityId: evaluationId,
      oldValues: { evalType: existing.evalType, employeeId },
    });
  });

  return { id: evaluationId };
}
