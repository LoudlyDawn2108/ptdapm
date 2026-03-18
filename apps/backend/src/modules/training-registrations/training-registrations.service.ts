import type {
  CreateTrainingRegistrationInput,
  PaginatedResponse,
  ParticipationStatusCode,
  RoleCode,
} from "@hrms/shared";
import { type SQL, and, eq, sql } from "drizzle-orm";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../common/utils/errors";
import { buildPaginatedResponse } from "../../common/utils/pagination";
import { withAuditLog } from "../../common/utils/user-context";
import { db } from "../../db";
import {
  type TrainingCourse,
  type TrainingRegistration,
  trainingCourses,
  trainingRegistrations,
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

function ensureCourseOpenForRegistration(course: TrainingCourse) {
  if (course.status !== "open_registration") {
    throw new BadRequestError(
      "Khóa đào tạo không trong trạng thái mở đăng ký.",
    );
  }
}

function ensureRegistrationPeriodActive(course: TrainingCourse) {
  if (!course.registrationFrom || !course.registrationTo) return;

  const today = new Date().toISOString().slice(0, 10);
  if (today < course.registrationFrom || today > course.registrationTo) {
    throw new BadRequestError("Khóa đào tạo đã hết thời gian đăng ký.");
  }
}

async function ensureEmployeeExists(employeeId: string) {
  const [employee] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.id, employeeId));

  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");
  return employee;
}

function isPostgresUniqueViolation(error: unknown): error is { code: string } {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

async function ensureRegistrationExists(
  registrationId: string,
  courseId: string,
): Promise<TrainingRegistration> {
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
    throw new NotFoundError("Không tìm thấy đăng ký tham gia khóa đào tạo");
  }
  return registration;
}

// ---------------------------------------------------------------------------
// List (paginated) — GET /api/training-courses/:courseId/registrations
// ---------------------------------------------------------------------------

export async function list(
  courseId: string,
  page: number,
  pageSize: number,
  participationStatus?: ParticipationStatusCode,
): Promise<
  PaginatedResponse<{
    id: string;
    courseId: string;
    employeeId: string;
    registeredAt: Date;
    participationStatus: string;
    fullName: string;
    staffCode: string;
  }>
> {
  await ensureCourseExists(courseId);

  const conditions: SQL[] = [eq(trainingRegistrations.courseId, courseId)];
  if (participationStatus) {
    conditions.push(
      eq(trainingRegistrations.participationStatus, participationStatus),
    );
  }
  const where = and(...conditions);

  const items = await db
    .select({
      id: trainingRegistrations.id,
      courseId: trainingRegistrations.courseId,
      employeeId: trainingRegistrations.employeeId,
      registeredAt: trainingRegistrations.registeredAt,
      participationStatus: trainingRegistrations.participationStatus,
      fullName: employees.fullName,
      staffCode: employees.staffCode,
    })
    .from(trainingRegistrations)
    .innerJoin(employees, eq(trainingRegistrations.employeeId, employees.id))
    .where(where)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(trainingRegistrations.registeredAt);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingRegistrations)
    .where(where);
  const total = Number(countResult[0]?.count ?? 0);

  return buildPaginatedResponse(items, total, page, pageSize);
}

// ---------------------------------------------------------------------------
// Get by ID — GET /api/training-courses/:courseId/registrations/:id
// ---------------------------------------------------------------------------

export async function getById(courseId: string, registrationId: string) {
  await ensureCourseExists(courseId);

  const [registration] = await db
    .select({
      id: trainingRegistrations.id,
      courseId: trainingRegistrations.courseId,
      employeeId: trainingRegistrations.employeeId,
      registeredAt: trainingRegistrations.registeredAt,
      participationStatus: trainingRegistrations.participationStatus,
      fullName: employees.fullName,
      staffCode: employees.staffCode,
    })
    .from(trainingRegistrations)
    .innerJoin(employees, eq(trainingRegistrations.employeeId, employees.id))
    .where(
      and(
        eq(trainingRegistrations.id, registrationId),
        eq(trainingRegistrations.courseId, courseId),
      ),
    );

  if (!registration) {
    throw new NotFoundError("Không tìm thấy đăng ký tham gia khóa đào tạo");
  }

  return registration;
}

// ---------------------------------------------------------------------------
// Create — POST /api/training-courses/:courseId/registrations (UC 4.40)
// ---------------------------------------------------------------------------

export async function create(
  courseId: string,
  data: CreateTrainingRegistrationInput,
  actorUserId: string,
  actorEmployeeId: string | null,
  actorRole: string,
): Promise<TrainingRegistration> {
  // Resolve employeeId: ADMIN/TCCB can register on behalf, others use own
  let employeeId: string;
  const isAdmin = actorRole === "ADMIN" || actorRole === "TCCB";
  if (isAdmin && data.employeeId) {
    employeeId = data.employeeId;
  } else {
    if (!actorEmployeeId) {
      throw new BadRequestError(
        "Tài khoản chưa được liên kết với hồ sơ nhân sự.",
      );
    }
    employeeId = actorEmployeeId;
  }

  await ensureEmployeeExists(employeeId);

  // Use transaction to atomically check capacity + uniqueness and insert
  let created: TrainingRegistration;
  try {
    created = await db.transaction(async (tx) => {
      const [course] = await tx
        .select()
        .from(trainingCourses)
        .where(eq(trainingCourses.id, courseId))
        .for("update");

      if (!course) throw new NotFoundError("Không tìm thấy khóa đào tạo");

      ensureCourseOpenForRegistration(course);
      ensureRegistrationPeriodActive(course);

      if (course.registrationLimit != null) {
        const countResult = await tx
          .select({ count: sql<number>`count(*)` })
          .from(trainingRegistrations)
          .where(eq(trainingRegistrations.courseId, courseId));
        const count = Number(countResult[0]?.count ?? 0);
        if (count >= course.registrationLimit) {
          throw new BadRequestError("Khóa đào tạo đã đủ số lượng đăng ký.");
        }
      }

      const [existing] = await tx
        .select({ id: trainingRegistrations.id })
        .from(trainingRegistrations)
        .where(
          and(
            eq(trainingRegistrations.courseId, courseId),
            eq(trainingRegistrations.employeeId, employeeId),
          ),
        );
      if (existing) {
        throw new ConflictError("Bạn đã đăng ký khóa đào tạo này.");
      }

      const [row] = await tx
        .insert(trainingRegistrations)
        .values({
          courseId,
          employeeId,
          participationStatus: "registered",
        })
        .returning();

      if (!row) throw new Error("Insert training registration failed");
      return row;
    });
  } catch (error) {
    if (isPostgresUniqueViolation(error)) {
      throw new ConflictError("Bạn đã đăng ký khóa đào tạo này.");
    }
    throw error;
  }

  await withAuditLog(
    db,
    actorUserId,
    "CREATE",
    "training_registration",
    created.id,
    undefined,
    { courseId, employeeId },
  );

  return created;
}

// ---------------------------------------------------------------------------
// Delete — DELETE /api/training-courses/:courseId/registrations/:id
// ---------------------------------------------------------------------------

export async function remove(
  courseId: string,
  registrationId: string,
  actorUserId: string,
  actorEmployeeId: string | null,
  actorRole: RoleCode,
): Promise<{ id: string }> {
  const registration = await ensureRegistrationExists(registrationId, courseId);

  const isAdmin = actorRole === "ADMIN" || actorRole === "TCCB";
  if (!isAdmin) {
    if (!actorEmployeeId || registration.employeeId !== actorEmployeeId) {
      throw new ForbiddenError("Bạn chỉ có thể hủy đăng ký của chính mình.");
    }
  }

  if (registration.participationStatus !== "registered") {
    throw new BadRequestError(
      "Chỉ có thể hủy đăng ký khi trạng thái là Đã đăng ký.",
    );
  }

  await db
    .delete(trainingRegistrations)
    .where(eq(trainingRegistrations.id, registrationId));

  await withAuditLog(
    db,
    actorUserId,
    "DELETE",
    "training_registration",
    registrationId,
    { courseId, employeeId: registration.employeeId },
    undefined,
  );

  return { id: registrationId };
}
