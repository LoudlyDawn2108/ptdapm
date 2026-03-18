import type { PaginatedResponse, ParticipationStatusCode } from "@hrms/shared";
import { type SQL, and, eq, sql } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { buildPaginatedResponse } from "../../common/utils/pagination";
import { db } from "../../db";
import {
  trainingCourses,
  trainingCourseTypes,
  trainingRegistrations,
} from "../../db/schema/training";

function ensureActorEmployeeId(employeeId: string | null): string {
  if (!employeeId) {
    throw new BadRequestError(
      "Tài khoản chưa được liên kết với hồ sơ nhân sự.",
    );
  }
  return employeeId;
}

// ---------------------------------------------------------------------------
// List my training registrations — GET /api/my/training (UC 4.41)
// ---------------------------------------------------------------------------

export async function list(
  employeeId: string | null,
  page: number,
  pageSize: number,
  participationStatus?: ParticipationStatusCode,
): Promise<
  PaginatedResponse<{
    registrationId: string;
    courseId: string;
    courseName: string;
    courseTypeName: string | null;
    trainingFrom: string;
    trainingTo: string;
    location: string | null;
    courseStatus: string;
    participationStatus: string;
    registeredAt: Date;
    cost: string | null;
    registrationLimit: number | null;
    registrationCount: number;
  }>
> {
  const actorEmployeeId = ensureActorEmployeeId(employeeId);

  const conditions: SQL[] = [
    eq(trainingRegistrations.employeeId, actorEmployeeId),
  ];
  if (participationStatus) {
    conditions.push(
      eq(trainingRegistrations.participationStatus, participationStatus),
    );
  }
  const where = and(...conditions);

  const items = await db
    .select({
      registrationId: trainingRegistrations.id,
      courseId: trainingCourses.id,
      courseName: trainingCourses.courseName,
      courseTypeName: trainingCourseTypes.typeName,
      trainingFrom: trainingCourses.trainingFrom,
      trainingTo: trainingCourses.trainingTo,
      location: trainingCourses.location,
      courseStatus: trainingCourses.status,
      participationStatus: trainingRegistrations.participationStatus,
      registeredAt: trainingRegistrations.registeredAt,
      cost: trainingCourses.cost,
      registrationLimit: trainingCourses.registrationLimit,
      registrationCount:
        sql<number>`(SELECT count(*) FROM ${trainingRegistrations} tr WHERE tr.course_id = ${trainingCourses.id})`.as(
          "registration_count",
        ),
    })
    .from(trainingRegistrations)
    .innerJoin(
      trainingCourses,
      eq(trainingRegistrations.courseId, trainingCourses.id),
    )
    .leftJoin(
      trainingCourseTypes,
      eq(trainingCourses.courseTypeId, trainingCourseTypes.id),
    )
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
// List available courses for employee — GET /api/my/training/available
// ---------------------------------------------------------------------------

export async function listAvailable(
  page: number,
  pageSize: number,
): Promise<
  PaginatedResponse<{
    id: string;
    courseName: string;
    courseTypeId: string;
    trainingFrom: string;
    trainingTo: string;
    location: string | null;
    status: string;
  }>
> {
  const where = eq(trainingCourses.status, "open_registration");

  const items = await db
    .select({
      id: trainingCourses.id,
      courseName: trainingCourses.courseName,
      courseTypeId: trainingCourses.courseTypeId,
      trainingFrom: trainingCourses.trainingFrom,
      trainingTo: trainingCourses.trainingTo,
      location: trainingCourses.location,
      status: trainingCourses.status,
    })
    .from(trainingCourses)
    .where(where)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(trainingCourses.createdAt);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingCourses)
    .where(where);
  const total = Number(countResult[0]?.count ?? 0);

  return buildPaginatedResponse(items, total, page, pageSize);
}

// ---------------------------------------------------------------------------
// Get course detail for employee (without exposing participant PII)
// GET /api/my/training/courses/:courseId
// ---------------------------------------------------------------------------

export async function getCourseDetail(
  courseId: string,
  employeeId: string | null,
) {
  const actorEmployeeId = ensureActorEmployeeId(employeeId);

  const [course] = await db
    .select()
    .from(trainingCourses)
    .where(eq(trainingCourses.id, courseId));

  if (!course) {
    throw new NotFoundError("Không tìm thấy khóa đào tạo");
  }

  const [courseType] = await db
    .select({
      id: trainingCourseTypes.id,
      typeName: trainingCourseTypes.typeName,
    })
    .from(trainingCourseTypes)
    .where(eq(trainingCourseTypes.id, course.courseTypeId));

  const [registrationCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainingRegistrations)
    .where(eq(trainingRegistrations.courseId, courseId));

  const [myRegistration] = await db
    .select({
      registrationId: trainingRegistrations.id,
      participationStatus: trainingRegistrations.participationStatus,
    })
    .from(trainingRegistrations)
    .where(
      and(
        eq(trainingRegistrations.courseId, courseId),
        eq(trainingRegistrations.employeeId, actorEmployeeId),
      ),
    )
    .limit(1);

  return {
    ...course,
    courseType: courseType ?? null,
    registrationCount: Number(registrationCountResult?.count ?? 0),
    myRegistration: myRegistration ?? null,
  };
}
