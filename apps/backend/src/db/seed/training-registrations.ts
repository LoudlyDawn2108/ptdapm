import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { employees, trainingCourses, trainingRegistrations } from "../schema";

async function seedTrainingRegistrations() {
  const courseRows = await db
    .select({
      id: trainingCourses.id,
      courseName: trainingCourses.courseName,
    })
    .from(trainingCourses);

  const employeeRows = await db
    .select({
      id: employees.id,
      nationalId: employees.nationalId,
      fullName: employees.fullName,
    })
    .from(employees);

  const courseMap = Object.fromEntries(
    courseRows.map((row) => [row.courseName, row.id]),
  );
  const employeeMap = Object.fromEntries(
    employeeRows.map((row) => [row.nationalId, row.id]),
  );

  const getCourseId = (courseName: string) => {
    const courseId = courseMap[courseName];
    if (!courseId) {
      throw new Error(
        `Training course "${courseName}" not found. Run seed:training-courses first.`,
      );
    }
    return courseId;
  };

  const getEmployeeId = (nationalId: string) => {
    const employeeId = employeeMap[nationalId];
    if (!employeeId) {
      throw new Error(
        `Employee with nationalId "${nationalId}" not found. Run seed:employees first.`,
      );
    }
    return employeeId;
  };

  const registrations = [
    {
      courseName: "Tập huấn nghiệp vụ quản lý nhân sự 2026",
      nationalId: "001085012345",
      participationStatus: "registered" as const,
    },
    {
      courseName: "Tập huấn nghiệp vụ quản lý nhân sự 2026",
      nationalId: "001090056789",
      participationStatus: "learning" as const,
    },
    {
      courseName: "Khóa bồi dưỡng phương pháp giảng dạy hiện đại",
      nationalId: "001088098765",
      participationStatus: "registered" as const,
    },
    {
      courseName: "Kỹ năng giao tiếp và thuyết trình",
      nationalId: "001092034567",
      participationStatus: "registered" as const,
    },
    {
      courseName: "An toàn vệ sinh lao động đợt 1/2026",
      nationalId: "001085012345",
      participationStatus: "completed" as const,
    },
    {
      courseName: "An toàn vệ sinh lao động đợt 1/2026",
      nationalId: "001090056789",
      participationStatus: "failed" as const,
    },
    {
      courseName: "Ứng dụng AI trong công việc hành chính",
      nationalId: "001095067890",
      participationStatus: "registered" as const,
    },
    {
      courseName: "Tiếng Anh giao tiếp công sở - Trình độ B1",
      nationalId: "001088098765",
      participationStatus: "learning" as const,
    },
    {
      courseName: "Đào tạo Scrum Master cho quản lý dự án",
      nationalId: "001085012345",
      participationStatus: "learning" as const,
    },
    {
      courseName: "Huấn luyện phòng cháy chữa cháy 2026",
      nationalId: "001090056789",
      participationStatus: "completed" as const,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const registration of registrations) {
    const courseId = getCourseId(registration.courseName);
    const employeeId = getEmployeeId(registration.nationalId);

    const existing = await db
      .select({ id: trainingRegistrations.id })
      .from(trainingRegistrations)
      .where(
        and(
          eq(trainingRegistrations.courseId, courseId),
          eq(trainingRegistrations.employeeId, employeeId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(trainingRegistrations).values({
      courseId,
      employeeId,
      participationStatus: registration.participationStatus,
    });

    created++;
  }

  console.log(
    `Training registrations seeded: ${created} created, ${skipped} skipped (already exist)`,
  );
  process.exit(0);
}

seedTrainingRegistrations().catch((err) => {
  console.error("Failed to seed training registrations:", err);
  process.exit(1);
});
