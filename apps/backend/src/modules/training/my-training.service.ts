import type { PaginatedResponse, ParticipationStatusCode } from "@hrms/shared";
import { type SQL, and, eq, sql } from "drizzle-orm";
import { BadRequestError } from "../../common/utils/errors";
import { buildPaginatedResponse } from "../../common/utils/pagination";
import { db } from "../../db";
import {
  trainingCourses,
  trainingCourseTypes,
  trainingRegistrations,
} from "../../db/schema/training";

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
  }>
> {
  if (!employeeId) {
    throw new BadRequestError(
      "Tài khoản chưa được liên kết với hồ sơ nhân sự.",
    );
  }

  const conditions: SQL[] = [eq(trainingRegistrations.employeeId, employeeId)];
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
