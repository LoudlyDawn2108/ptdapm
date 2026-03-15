import type {
  CreateBatchTrainingResultInput,
  CreateTrainingResultInput,
  PaginatedResponse,
  UpdateTrainingResultInput,
} from "@hrms/shared";
import { type SQL, and, eq, sql } from "drizzle-orm";
import type { ResultStatusCode } from "@hrms/shared";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/utils/errors";
import { buildPaginatedResponse } from "../../common/utils/pagination";
import { withAuditLog } from "../../common/utils/user-context";
import { db } from "../../db";
import {
  type TrainingCourse,
  type TrainingResult,
  trainingCourses,
  trainingRegistrations,
  trainingResults,
} from "../../db/schema/training";
import { employees } from "../../db/schema/employees";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function ensureCourseExists(courseId: string): Promise<TrainingCourse> {
  const [course] = await db
    .select()
    .from(trainingCourses)
    .where(eq(trainingCourses.id, courseId));

  if (!course) throw new NotFoundError("Không tìm thấy khóa đào tạo");
  return course;
}

function ensureCourseCompleted(course: TrainingCourse) {
  if (course.status !== "completed") {
    throw new BadRequestError(
      "Chỉ có thể ghi nhận kết quả khi khóa đào tạo đã hoàn thành.",
    );
  }
}

async function ensureRegistrationExists(
  registrationId: string,
  courseId: string,
) {
  const [registration] = await db
    .select()
    .from(trainingRegistrations)
    .where(
      and(
        eq(trainingRegistrations.id, registrationId),
        eq(trainingRegistrations.courseId, courseId),
      ),
    );

  if (!registration) {
    throw new NotFoundError(
      "Không tìm thấy đăng ký tham gia trong khóa đào tạo này",
    );
  }
  return registration;
}

async function ensureNoExistingResult(registrationId: string) {
  const [existing] = await db
    .select({ id: trainingResults.id })
    .from(trainingResults)
    .where(eq(trainingResults.registrationId, registrationId));

  if (existing) {
    throw new ConflictError("Kết quả đào tạo đã được ghi nhận cho đăng ký này");
  }
}

async function ensureResultExists(
  resultId: string,
  courseId: string,
): Promise<TrainingResult & { registrationId: string }> {
  const [result] = await db
    .select()
    .from(trainingResults)
    .innerJoin(
      trainingRegistrations,
      eq(trainingResults.registrationId, trainingRegistrations.id),
    )
    .where(
      and(
        eq(trainingResults.id, resultId),
        eq(trainingRegistrations.courseId, courseId),
      ),
    );

  if (!result) throw new NotFoundError("Không tìm thấy kết quả đào tạo");
  return {
    ...result.training_results,
    registrationId: result.training_registrations.id,
  };
}

async function updateParticipationStatus(
  registrationId: string,
  status: "completed" | "failed" | "learning",
) {
  await db
    .update(trainingRegistrations)
    .set({ participationStatus: status })
    .where(eq(trainingRegistrations.id, registrationId));
}

// ---------------------------------------------------------------------------
// List (paginated) — GET /api/training-courses/:courseId/results
// ---------------------------------------------------------------------------

export async function list(
  courseId: string,
  page: number,
  pageSize: number,
  resultStatus?: ResultStatusCode,
): Promise<
  PaginatedResponse<{
    id: string;
    registrationId: string;
    resultStatus: string;
    completedOn: string | null;
    certificateFileId: string | null;
    note: string | null;
    createdAt: Date;
    employeeId: string;
    fullName: string;
    staffCode: string;
  }>
> {
  await ensureCourseExists(courseId);

  const conditions: SQL[] = [eq(trainingRegistrations.courseId, courseId)];
  if (resultStatus) {
    conditions.push(eq(trainingResults.resultStatus, resultStatus));
  }
  const where = and(...conditions);

  const items = await db
    .select({
      id: trainingResults.id,
      registrationId: trainingResults.registrationId,
      resultStatus: trainingResults.resultStatus,
      completedOn: trainingResults.completedOn,
      certificateFileId: trainingResults.certificateFileId,
      note: trainingResults.note,
      createdAt: trainingResults.createdAt,
      employeeId: employees.id,
      fullName: employees.fullName,
      staffCode: employees.staffCode,
    })
    .from(trainingResults)
    .innerJoin(
      trainingRegistrations,
      eq(trainingResults.registrationId, trainingRegistrations.id),
    )
    .innerJoin(employees, eq(trainingRegistrations.employeeId, employees.id))
    .where(where)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(trainingResults.createdAt);

  // Count total results for this course
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingResults)
    .innerJoin(
      trainingRegistrations,
      eq(trainingResults.registrationId, trainingRegistrations.id),
    )
    .where(where);
  const total = Number(countResult[0]?.count ?? 0);

  return buildPaginatedResponse(items, total, page, pageSize);
}

// ---------------------------------------------------------------------------
// Get by ID — GET /api/training-courses/:courseId/results/:id
// ---------------------------------------------------------------------------

export async function getById(courseId: string, resultId: string) {
  await ensureCourseExists(courseId);

  const [result] = await db
    .select({
      id: trainingResults.id,
      registrationId: trainingResults.registrationId,
      resultStatus: trainingResults.resultStatus,
      completedOn: trainingResults.completedOn,
      certificateFileId: trainingResults.certificateFileId,
      note: trainingResults.note,
      createdByUserId: trainingResults.createdByUserId,
      createdAt: trainingResults.createdAt,
      employeeId: employees.id,
      fullName: employees.fullName,
      staffCode: employees.staffCode,
    })
    .from(trainingResults)
    .innerJoin(
      trainingRegistrations,
      eq(trainingResults.registrationId, trainingRegistrations.id),
    )
    .innerJoin(employees, eq(trainingRegistrations.employeeId, employees.id))
    .where(
      and(
        eq(trainingResults.id, resultId),
        eq(trainingRegistrations.courseId, courseId),
      ),
    );

  if (!result) throw new NotFoundError("Không tìm thấy kết quả đào tạo");
  return result;
}

// ---------------------------------------------------------------------------
// Create — POST /api/training-courses/:courseId/results (UC 4.36)
// ---------------------------------------------------------------------------

export async function create(
  courseId: string,
  data: CreateTrainingResultInput,
  actorUserId: string,
): Promise<TrainingResult> {
  const course = await ensureCourseExists(courseId);
  ensureCourseCompleted(course);
  await ensureRegistrationExists(data.registrationId, courseId);
  await ensureNoExistingResult(data.registrationId);

  const [created] = await db
    .insert(trainingResults)
    .values({
      registrationId: data.registrationId,
      resultStatus: data.resultStatus,
      completedOn: data.completedOn ?? course.trainingTo,
      certificateFileId: data.certificateFileId ?? null,
      note: data.note ?? null,
      createdByUserId: actorUserId,
    })
    .returning();

  if (!created) throw new Error("Insert training result failed");

  // Cập nhật trạng thái tham gia trên bản đăng ký
  await updateParticipationStatus(data.registrationId, data.resultStatus);

  await withAuditLog(
    db,
    actorUserId,
    "CREATE",
    "training_result",
    created.id,
    undefined,
    {
      registrationId: data.registrationId,
      resultStatus: data.resultStatus,
      courseId,
    },
  );

  return created;
}

// ---------------------------------------------------------------------------
// Batch Create — POST /api/training-courses/:courseId/results/batch (UC A1)
// ---------------------------------------------------------------------------

export async function createBatch(
  courseId: string,
  data: CreateBatchTrainingResultInput,
  actorUserId: string,
): Promise<TrainingResult[]> {
  const course = await ensureCourseExists(courseId);
  ensureCourseCompleted(course);

  const createdResults: TrainingResult[] = [];

  // Validate and insert inside the same transaction to prevent race conditions
  await db.transaction(async (tx) => {
    for (const item of data.results) {
      // Validate registration exists (inside tx)
      const [registration] = await tx
        .select()
        .from(trainingRegistrations)
        .where(
          and(
            eq(trainingRegistrations.id, item.registrationId),
            eq(trainingRegistrations.courseId, courseId),
          ),
        );
      if (!registration) {
        throw new NotFoundError(
          "Không tìm thấy đăng ký tham gia trong khóa đào tạo này",
        );
      }

      // Validate no existing result (inside tx)
      const [existingResult] = await tx
        .select({ id: trainingResults.id })
        .from(trainingResults)
        .where(eq(trainingResults.registrationId, item.registrationId));
      if (existingResult) {
        throw new ConflictError(
          "Kết quả đào tạo đã được ghi nhận cho đăng ký này",
        );
      }

      const [created] = await tx
        .insert(trainingResults)
        .values({
          registrationId: item.registrationId,
          resultStatus: item.resultStatus,
          completedOn: item.completedOn ?? course.trainingTo,
          certificateFileId: item.certificateFileId ?? null,
          note: item.note ?? null,
          createdByUserId: actorUserId,
        })
        .returning();

      if (!created) throw new Error("Insert training result failed");
      createdResults.push(created);

      // Cập nhật trạng thái tham gia
      await tx
        .update(trainingRegistrations)
        .set({ participationStatus: item.resultStatus })
        .where(eq(trainingRegistrations.id, item.registrationId));
    }
  });

  // Audit log cho batch
  await withAuditLog(
    db,
    actorUserId,
    "CREATE_BATCH",
    "training_result",
    courseId,
    undefined,
    {
      courseId,
      count: createdResults.length,
      registrationIds: data.results.map((r) => r.registrationId),
    },
  );

  return createdResults;
}

// ---------------------------------------------------------------------------
// Update — PUT /api/training-courses/:courseId/results/:id
// ---------------------------------------------------------------------------

export async function update(
  courseId: string,
  resultId: string,
  data: UpdateTrainingResultInput,
  actorUserId: string,
): Promise<TrainingResult> {
  const course = await ensureCourseExists(courseId);
  const existing = await ensureResultExists(resultId, courseId);

  // Xác định resultStatus cuối cùng (dùng giá trị mới nếu có, không thì giữ nguyên)
  const finalStatus = data.resultStatus ?? existing.resultStatus;
  const finalCertFileId =
    data.certificateFileId !== undefined
      ? (data.certificateFileId ?? null)
      : existing.certificateFileId;

  // Kiểm tra logic: nếu kết quả là "completed" thì phải có chứng chỉ
  if (finalStatus === "completed" && !finalCertFileId) {
    throw new BadRequestError(
      "File chứng chỉ là bắt buộc khi kết quả là Hoàn thành",
    );
  }

  const updateSet: Record<string, unknown> = {
    ...(data.resultStatus !== undefined && {
      resultStatus: data.resultStatus,
    }),
    ...(data.completedOn !== undefined && {
      completedOn: data.completedOn ?? course.trainingTo,
    }),
    ...(data.certificateFileId !== undefined && {
      certificateFileId: data.certificateFileId ?? null,
    }),
    ...(data.note !== undefined && { note: data.note ?? null }),
  };

  const [updated] = await db
    .update(trainingResults)
    .set(updateSet)
    .where(eq(trainingResults.id, resultId))
    .returning();

  if (!updated) throw new Error("Update training result failed");

  // Đồng bộ participationStatus nếu resultStatus thay đổi
  if (data.resultStatus && data.resultStatus !== existing.resultStatus) {
    await updateParticipationStatus(existing.registrationId, data.resultStatus);
  }

  await withAuditLog(
    db,
    actorUserId,
    "UPDATE",
    "training_result",
    resultId,
    { resultStatus: existing.resultStatus },
    { ...updateSet, courseId },
  );

  return updated;
}

// ---------------------------------------------------------------------------
// Delete — DELETE /api/training-courses/:courseId/results/:id
// ---------------------------------------------------------------------------

export async function remove(
  courseId: string,
  resultId: string,
  actorUserId: string,
): Promise<{ id: string }> {
  const existing = await ensureResultExists(resultId, courseId);

  await db.delete(trainingResults).where(eq(trainingResults.id, resultId));

  // Reset participationStatus về "learning"
  await updateParticipationStatus(existing.registrationId, "learning");

  await withAuditLog(
    db,
    actorUserId,
    "DELETE",
    "training_result",
    resultId,
    {
      resultStatus: existing.resultStatus,
      registrationId: existing.registrationId,
    },
    undefined,
  );

  return { id: resultId };
}
