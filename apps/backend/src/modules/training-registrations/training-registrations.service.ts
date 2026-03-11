import type {
  CreateTrainingRegistrationInput,
  PaginatedResponse,
  ParticipationStatusCode,
} from "@hrms/shared";
import { type SQL, and, eq, sql } from "drizzle-orm";
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

async function getRegistrationCount(courseId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingRegistrations)
    .where(eq(trainingRegistrations.courseId, courseId));
  return Number(result[0]?.count ?? 0);
}

async function ensureNotAtCapacity(
  courseId: string,
  registrationLimit: number | null,
) {
  if (registrationLimit == null) return;
  const count = await getRegistrationCount(courseId);
  if (count >= registrationLimit) {
    throw new BadRequestError("Khóa đào tạo đã đủ số lượng đăng ký.");
  }
}

async function ensureNotAlreadyRegistered(
  courseId: string,
  employeeId: string,
) {
  const [existing] = await db
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
}

async function ensureEmployeeExists(employeeId: string) {
  const [employee] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.id, employeeId));

  if (!employee) throw new NotFoundError("Không tìm thấy nhân sự");
  return employee;
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
  const course = await ensureCourseExists(courseId);
  ensureCourseOpenForRegistration(course);
  ensureRegistrationPeriodActive(course);
  await ensureNotAtCapacity(courseId, course.registrationLimit);

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
  await ensureNotAlreadyRegistered(courseId, employeeId);

  const [created] = await db
    .insert(trainingRegistrations)
    .values({
      courseId,
      employeeId,
      participationStatus: "registered",
    })
    .returning();

  if (!created) throw new Error("Insert training registration failed");

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
): Promise<{ id: string }> {
  const registration = await ensureRegistrationExists(registrationId, courseId);

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
