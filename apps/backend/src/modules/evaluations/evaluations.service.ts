import type {
  CreateEvaluationInput,
  PaginatedResponse,
  UpdateEvaluationInput,
} from "@hrms/shared";
import { type SQL, and, eq } from "drizzle-orm";
import { NotFoundError } from "../../common/utils/errors";
import {
  buildPaginatedResponse,
  countRows,
} from "../../common/utils/pagination";
import { withAuditLog } from "../../common/utils/user-context";
import { db } from "../../db";
import {
  type EmployeeEvaluation,
  employeeEvaluations,
} from "../../db/schema/evaluations";
import { employees } from "../../db/schema/employees";

async function ensureEmployeeExists(employeeId: string) {
  const [employee] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.id, employeeId));

  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");
  return employee;
}

async function ensureEvaluationExists(
  employeeId: string,
  evaluationId: string,
): Promise<EmployeeEvaluation> {
  const [evaluation] = await db
    .select()
    .from(employeeEvaluations)
    .where(
      and(
        eq(employeeEvaluations.id, evaluationId),
        eq(employeeEvaluations.employeeId, employeeId),
      ),
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
  await ensureEmployeeExists(employeeId);

  const [created] = await db
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
      createdByUserId: actorUserId,
    })
    .returning();

  if (!created) throw new Error("Insert evaluation failed");

  await withAuditLog(
    db,
    actorUserId,
    "CREATE",
    "employee_evaluation",
    created.id,
    undefined,
    {
      employeeId,
      evalType: data.evalType,
    },
  );

  return created;
}

export async function update(
  employeeId: string,
  evaluationId: string,
  data: UpdateEvaluationInput,
  actorUserId: string,
): Promise<EmployeeEvaluation> {
  await ensureEmployeeExists(employeeId);
  const existing = await ensureEvaluationExists(employeeId, evaluationId);

  const [updated] = await db
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
    })
    .where(eq(employeeEvaluations.id, evaluationId))
    .returning();

  if (!updated) throw new Error("Update evaluation failed");

  await withAuditLog(
    db,
    actorUserId,
    "UPDATE",
    "employee_evaluation",
    evaluationId,
    { evalType: existing.evalType },
    { evalType: data.evalType },
  );

  return updated;
}

export async function remove(
  employeeId: string,
  evaluationId: string,
  actorUserId: string,
): Promise<{ id: string }> {
  await ensureEmployeeExists(employeeId);
  const existing = await ensureEvaluationExists(employeeId, evaluationId);

  await db
    .delete(employeeEvaluations)
    .where(eq(employeeEvaluations.id, evaluationId));

  await withAuditLog(
    db,
    actorUserId,
    "DELETE",
    "employee_evaluation",
    evaluationId,
    { evalType: existing.evalType, employeeId },
    undefined,
  );

  return { id: evaluationId };
}
