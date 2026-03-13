import type {
  CreateSalaryGradeInput,
  CreateSalaryGradeStepInput,
  DropdownOption,
  PaginatedResponse,
  UpdateSalaryGradeInput,
  UpdateSalaryGradeStepInput,
} from "@hrms/shared";
import { type SQL, and, eq, ilike } from "drizzle-orm";
import { queryDropdown } from "../../../common/utils/dropdown";
import { BadRequestError, ConflictError, NotFoundError } from "../../../common/utils/errors";
import { buildPaginatedResponse, countRows } from "../../../common/utils/pagination";
import { db } from "../../../db";
import {
  type SalaryGrade,
  type SalaryGradeStep,
  salaryGradeSteps,
  salaryGrades,
} from "../../../db/schema";
import { employees } from "../../../db/schema";

// ── Grades ──────────────────────────────────────────────────────────────────

export async function list(
  page: number,
  pageSize: number,
  search?: string,
): Promise<PaginatedResponse<SalaryGrade>> {
  const where: SQL | undefined = search
    ? ilike(salaryGrades.gradeName, `%${search}%`)
    : undefined;

  const [items, total] = await Promise.all([
    db
      .select()
      .from(salaryGrades)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(salaryGrades.createdAt),
    countRows(salaryGrades, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

export async function dropdown(search?: string, limit?: number): Promise<DropdownOption[]> {
  return queryDropdown(
    {
      table: salaryGrades,
      valueColumn: salaryGrades.id,
      labelColumns: [salaryGrades.gradeName],
      statusColumn: salaryGrades.status,
    },
    search,
    limit,
  );
}

export async function getById(id: string): Promise<SalaryGrade> {
  const [item] = await db.select().from(salaryGrades).where(eq(salaryGrades.id, id));
  if (!item) throw new NotFoundError("Không tìm thấy ngạch lương");
  return item;
}

export async function create(data: CreateSalaryGradeInput): Promise<SalaryGrade> {
  const existing = await db
    .select({ id: salaryGrades.id })
    .from(salaryGrades)
    .where(eq(salaryGrades.gradeCode, data.gradeCode))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Mã ngạch lương đã tồn tại");
  }

  const [created] = await db.insert(salaryGrades).values(data).returning();
  if (!created) throw new Error("Insert failed");
  return created;
}

export async function update(id: string, data: UpdateSalaryGradeInput): Promise<SalaryGrade> {
  const grade = await getById(id);

  // If editing fields other than status, check not used by employees
  if (data.gradeCode || data.gradeName) {
    const isUsed = await isGradeUsedByEmployees(id);
    if (isUsed) {
      throw new BadRequestError("Không thể chỉnh sửa ngạch lương đã được sử dụng trong hồ sơ nhân sự");
    }
  }

  // Cannot edit if inactive (except status toggle)
  if (grade.status === "inactive" && !data.status) {
    throw new BadRequestError("Không thể chỉnh sửa danh mục đã ngừng sử dụng");
  }

  const [updated] = await db
    .update(salaryGrades)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(salaryGrades.id, id))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function remove(id: string): Promise<{ id: string }> {
  await getById(id);

  const isUsed = await isGradeUsedByEmployees(id);
  if (isUsed) {
    throw new BadRequestError("Không thể xóa ngạch lương đã được sử dụng trong hồ sơ nhân sự");
  }

  await db.delete(salaryGrades).where(eq(salaryGrades.id, id));
  return { id };
}

async function isGradeUsedByEmployees(gradeId: string): Promise<boolean> {
  // Check if any salary grade STEP of this grade is used by employees
  const steps = await db
    .select({ id: salaryGradeSteps.id })
    .from(salaryGradeSteps)
    .where(eq(salaryGradeSteps.salaryGradeId, gradeId));

  if (steps.length === 0) return false;

  const stepIds = steps.map((s) => s.id);
  for (const stepId of stepIds) {
    const [emp] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.salaryGradeStepId, stepId))
      .limit(1);
    if (emp) return true;
  }
  return false;
}

// ── Steps ───────────────────────────────────────────────────────────────────

export async function listSteps(gradeId: string): Promise<SalaryGradeStep[]> {
  await getById(gradeId);

  return db
    .select()
    .from(salaryGradeSteps)
    .where(eq(salaryGradeSteps.salaryGradeId, gradeId))
    .orderBy(salaryGradeSteps.stepNo);
}

export async function createStep(
  gradeId: string,
  data: CreateSalaryGradeStepInput,
): Promise<SalaryGradeStep> {
  await getById(gradeId);

  // Check duplicate stepNo in same grade
  const existing = await db
    .select({ id: salaryGradeSteps.id })
    .from(salaryGradeSteps)
    .where(
      and(
        eq(salaryGradeSteps.salaryGradeId, gradeId),
        eq(salaryGradeSteps.stepNo, data.stepNo),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Bậc lương trong cùng ngạch đã tồn tại");
  }

  const [created] = await db
    .insert(salaryGradeSteps)
    .values({ ...data, salaryGradeId: gradeId })
    .returning();
  if (!created) throw new Error("Insert failed");
  return created;
}

export async function updateStep(
  gradeId: string,
  stepId: string,
  data: UpdateSalaryGradeStepInput,
): Promise<SalaryGradeStep> {
  await getById(gradeId);

  const [step] = await db
    .select()
    .from(salaryGradeSteps)
    .where(and(eq(salaryGradeSteps.id, stepId), eq(salaryGradeSteps.salaryGradeId, gradeId)));

  if (!step) throw new NotFoundError("Không tìm thấy bậc lương");

  // Check if used by employees
  if (data.stepNo || data.coefficient) {
    const [emp] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.salaryGradeStepId, stepId))
      .limit(1);
    if (emp) {
      throw new BadRequestError("Không thể chỉnh sửa bậc lương đã được sử dụng trong hồ sơ nhân sự");
    }
  }

  // Check duplicate stepNo
  if (data.stepNo && data.stepNo !== step.stepNo) {
    const dup = await db
      .select({ id: salaryGradeSteps.id })
      .from(salaryGradeSteps)
      .where(
        and(
          eq(salaryGradeSteps.salaryGradeId, gradeId),
          eq(salaryGradeSteps.stepNo, data.stepNo),
        ),
      )
      .limit(1);
    if (dup.length > 0) {
      throw new ConflictError("Bậc lương trong cùng ngạch đã tồn tại");
    }
  }

  const [updated] = await db
    .update(salaryGradeSteps)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(salaryGradeSteps.id, stepId))
    .returning();

  if (!updated) throw new Error("Update failed");
  return updated;
}

export async function removeStep(gradeId: string, stepId: string): Promise<{ id: string }> {
  await getById(gradeId);

  const [step] = await db
    .select()
    .from(salaryGradeSteps)
    .where(and(eq(salaryGradeSteps.id, stepId), eq(salaryGradeSteps.salaryGradeId, gradeId)));

  if (!step) throw new NotFoundError("Không tìm thấy bậc lương");

  // Check if used by employees
  const [emp] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.salaryGradeStepId, stepId))
    .limit(1);

  if (emp) {
    throw new BadRequestError("Không thể xóa bậc lương đã được sử dụng trong hồ sơ nhân sự");
  }

  await db.delete(salaryGradeSteps).where(eq(salaryGradeSteps.id, stepId));
  return { id: stepId };
}
