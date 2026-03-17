import type {
  CreateTrainingCourseInput,
  PaginatedResponse,
  UpdateTrainingCourseInput,
} from "@hrms/shared";
import { type SQL, and, eq, ilike, sql } from "drizzle-orm";
import type { TrainingStatusCode } from "@hrms/shared";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import {
  buildPaginatedResponse,
  countRows,
} from "../../common/utils/pagination";
import { withAuditLog } from "../../common/utils/user-context";
import { db } from "../../db";
import {
  type TrainingCourse,
  trainingCourses,
  trainingCourseTypes,
  trainingRegistrations,
} from "../../db/schema/training";
import { employees } from "../../db/schema/employees";
import { orgUnits } from "../../db/schema/organization";

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

async function ensureCourseTypeExists(courseTypeId: string) {
  const [courseType] = await db
    .select({ id: trainingCourseTypes.id })
    .from(trainingCourseTypes)
    .where(eq(trainingCourseTypes.id, courseTypeId));

  if (!courseType) throw new NotFoundError("Không tìm thấy loại khóa đào tạo");
  return courseType;
}

async function getRegistrationCount(courseId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingRegistrations)
    .where(eq(trainingRegistrations.courseId, courseId));
  return Number(result[0]?.count ?? 0);
}

// ---------------------------------------------------------------------------
// List (paginated, with optional status + search filters)
// ---------------------------------------------------------------------------

export async function list(
  page: number,
  pageSize: number,
  status?: TrainingStatusCode,
  search?: string,
): Promise<PaginatedResponse<TrainingCourse>> {
  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(trainingCourses.status, status));
  }

  if (search) {
    conditions.push(ilike(trainingCourses.courseName, `%${search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db
      .select()
      .from(trainingCourses)
      .where(where)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(trainingCourses.createdAt),
    countRows(trainingCourses, where),
  ]);

  return buildPaginatedResponse(items, total, page, pageSize);
}

// ---------------------------------------------------------------------------
// Get by ID — UC 4.35: Chi tiết khóa đào tạo + danh sách đăng ký
// ---------------------------------------------------------------------------

export async function getById(courseId: string) {
  const course = await ensureCourseExists(courseId);

  // Lấy thông tin loại khóa đào tạo
  const [courseType] = await db
    .select({
      id: trainingCourseTypes.id,
      typeName: trainingCourseTypes.typeName,
    })
    .from(trainingCourseTypes)
    .where(eq(trainingCourseTypes.id, course.courseTypeId));

  // Lấy danh sách đăng ký kèm thông tin nhân sự và đơn vị công tác
  const registrations = await db
    .select({
      id: trainingRegistrations.id,
      employeeId: trainingRegistrations.employeeId,
      registeredAt: trainingRegistrations.registeredAt,
      participationStatus: trainingRegistrations.participationStatus,
      fullName: employees.fullName,
      staffCode: employees.staffCode,
      currentOrgUnitId: employees.currentOrgUnitId,
      orgUnitName: orgUnits.unitName,
    })
    .from(trainingRegistrations)
    .innerJoin(employees, eq(trainingRegistrations.employeeId, employees.id))
    .leftJoin(orgUnits, eq(employees.currentOrgUnitId, orgUnits.id))
    .where(eq(trainingRegistrations.courseId, courseId))
    .orderBy(trainingRegistrations.registeredAt);

  return {
    ...course,
    courseType: courseType ?? null,
    registrationCount: registrations.length,
    registrations,
  };
}

// ---------------------------------------------------------------------------
// Create — UC 4.33: Mở khóa đào tạo cho cán bộ giảng viên
// ---------------------------------------------------------------------------

export async function create(
  data: CreateTrainingCourseInput,
  actorUserId: string,
): Promise<TrainingCourse> {
  // Kiểm tra loại khóa đào tạo tồn tại
  await ensureCourseTypeExists(data.courseTypeId);

  const [created] = await db
    .insert(trainingCourses)
    .values({
      courseName: data.courseName,
      courseTypeId: data.courseTypeId,
      trainingFrom: data.trainingFrom,
      trainingTo: data.trainingTo,
      location: data.location ?? null,
      cost: data.cost ?? null,
      commitment: data.commitment ?? null,
      certificateName: data.certificateName ?? null,
      certificateType: data.certificateType ?? null,
      registrationFrom: data.registrationFrom ?? null,
      registrationTo: data.registrationTo ?? null,
      registrationLimit: data.registrationLimit ?? null,
      status: "open_registration",
      createdByUserId: actorUserId,
    })
    .returning();

  if (!created) throw new Error("Insert training course failed");

  await withAuditLog(
    db,
    actorUserId,
    "CREATE",
    "training_course",
    created.id,
    undefined,
    { courseName: data.courseName, courseTypeId: data.courseTypeId },
  );

  return created;
}

// ---------------------------------------------------------------------------
// Update — UC 4.34: Sửa thông tin khóa đào tạo đã mở
// ---------------------------------------------------------------------------

export async function update(
  courseId: string,
  data: UpdateTrainingCourseInput,
  actorUserId: string,
): Promise<TrainingCourse> {
  const existing = await ensureCourseExists(courseId);

  // E1: Chỉ cho phép sửa khi đang mở đăng ký hoặc đang đào tạo
  if (
    existing.status !== "open_registration" &&
    existing.status !== "in_progress"
  ) {
    throw new BadRequestError(
      "Không thể chỉnh sửa khóa đào tạo đã hoàn thành.",
    );
  }

  // Kiểm tra loại khóa đào tạo nếu có thay đổi
  if (data.courseTypeId) {
    await ensureCourseTypeExists(data.courseTypeId);
  }

  // A1: Nếu đang đào tạo, chỉ cho sửa: location, cost, commitment, certificateName, certificateType
  const isInProgress = existing.status === "in_progress";

  // E2: Nếu giảm giới hạn đăng ký, kiểm tra số lượng đã đăng ký
  if (!isInProgress && data.registrationLimit != null) {
    const registrationCount = await getRegistrationCount(courseId);
    if (data.registrationLimit < registrationCount) {
      throw new BadRequestError(
        `Giới hạn đăng ký không được nhỏ hơn số lượng đã đăng ký (${registrationCount}).`,
      );
    }
  }

  // Build update set based on status
  const updateSet: Record<string, unknown> = {
    location: data.location !== undefined ? (data.location ?? null) : undefined,
    cost: data.cost !== undefined ? (data.cost ?? null) : undefined,
    commitment:
      data.commitment !== undefined ? (data.commitment ?? null) : undefined,
    certificateName:
      data.certificateName !== undefined
        ? (data.certificateName ?? null)
        : undefined,
    certificateType:
      data.certificateType !== undefined
        ? (data.certificateType ?? null)
        : undefined,
    updatedAt: new Date(),
  };

  // Các trường chỉ được sửa khi đang mở đăng ký (không phải in_progress)
  if (!isInProgress) {
    if (data.courseName !== undefined) updateSet.courseName = data.courseName;
    if (data.courseTypeId !== undefined)
      updateSet.courseTypeId = data.courseTypeId;
    if (data.trainingFrom !== undefined)
      updateSet.trainingFrom = data.trainingFrom;
    if (data.trainingTo !== undefined) updateSet.trainingTo = data.trainingTo;
    if (data.registrationFrom !== undefined)
      updateSet.registrationFrom = data.registrationFrom ?? null;
    if (data.registrationTo !== undefined)
      updateSet.registrationTo = data.registrationTo ?? null;
    if (data.registrationLimit !== undefined)
      updateSet.registrationLimit = data.registrationLimit ?? null;
  }

  // Remove undefined keys
  const cleanSet = Object.fromEntries(
    Object.entries(updateSet).filter(([, v]) => v !== undefined),
  );

  const [updated] = await db
    .update(trainingCourses)
    .set(cleanSet)
    .where(eq(trainingCourses.id, courseId))
    .returning();

  if (!updated) throw new Error("Update training course failed");

  await withAuditLog(
    db,
    actorUserId,
    "UPDATE",
    "training_course",
    courseId,
    { courseName: existing.courseName, status: existing.status },
    { ...cleanSet },
  );

  return updated;
}
