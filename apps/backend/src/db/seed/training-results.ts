import { and, eq } from "drizzle-orm";
import { db } from "../index";
import {
  employees,
  trainingCourses,
  trainingRegistrations,
  trainingResults,
} from "../schema";

async function seedTrainingResults() {
  const resultRows = [
    {
      courseName: "An toàn vệ sinh lao động đợt 1/2026",
      nationalId: "001085012345",
      resultStatus: "completed" as const,
      completedOn: "2026-02-12",
      note: "Hoàn thành đầy đủ nội dung và đạt yêu cầu đánh giá cuối khóa.",
    },
    {
      courseName: "An toàn vệ sinh lao động đợt 1/2026",
      nationalId: "001090056789",
      resultStatus: "failed" as const,
      completedOn: "2026-02-12",
      note: "Không đạt bài đánh giá cuối khóa.",
    },
    {
      courseName: "Huấn luyện phòng cháy chữa cháy 2026",
      nationalId: "001090056789",
      resultStatus: "completed" as const,
      completedOn: "2026-01-16",
      note: "Đạt yêu cầu thực hành và lý thuyết PCCC.",
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const row of resultRows) {
    const [registration] = await db
      .select({ id: trainingRegistrations.id })
      .from(trainingRegistrations)
      .innerJoin(
        trainingCourses,
        eq(trainingRegistrations.courseId, trainingCourses.id),
      )
      .innerJoin(employees, eq(trainingRegistrations.employeeId, employees.id))
      .where(
        and(
          eq(trainingCourses.courseName, row.courseName),
          eq(employees.nationalId, row.nationalId),
        ),
      )
      .limit(1);

    if (!registration) {
      throw new Error(
        `Registration not found for course "${row.courseName}" and nationalId "${row.nationalId}". Run seed:training-courses and seed:training-registrations first.`,
      );
    }

    const [existingResult] = await db
      .select({ id: trainingResults.id })
      .from(trainingResults)
      .where(eq(trainingResults.registrationId, registration.id))
      .limit(1);

    if (existingResult) {
      skipped++;
      continue;
    }

    await db.insert(trainingResults).values({
      registrationId: registration.id,
      resultStatus: row.resultStatus,
      completedOn: row.completedOn,
      note: row.note,
    });

    created++;
  }

  console.log(
    `Training results seeded: ${created} created, ${skipped} skipped (already exist)`,
  );
  process.exit(0);
}

seedTrainingResults().catch((err) => {
  console.error("Failed to seed training results:", err);
  process.exit(1);
});
