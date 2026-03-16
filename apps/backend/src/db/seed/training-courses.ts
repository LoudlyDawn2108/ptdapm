import { eq } from "drizzle-orm";
import { db } from "../index";
import { trainingCourseTypes, trainingCourses } from "../schema/training";

async function seedTrainingCourses() {
  // Fetch existing training course types to map by name → id
  const typeRows = await db
    .select({
      id: trainingCourseTypes.id,
      typeName: trainingCourseTypes.typeName,
    })
    .from(trainingCourseTypes);

  const typeMap = Object.fromEntries(typeRows.map((r) => [r.typeName, r.id]));

  const getTypeId = (name: string) => {
    const id = typeMap[name];
    if (!id)
      throw new Error(
        `Training course type "${name}" not found. Run seed:training-types first.`,
      );
    return id;
  };

  const courses = [
    {
      courseName: "Tập huấn nghiệp vụ quản lý nhân sự 2026",
      courseTypeId: getTypeId("Đào tạo nội bộ"),
      trainingFrom: "2026-04-01",
      trainingTo: "2026-04-05",
      location: "Hội trường A - Trụ sở chính",
      cost: "5000000",
      commitment:
        "Cam kết phục vụ tối thiểu 2 năm sau khi hoàn thành khóa đào tạo",
      certificateName: "Chứng chỉ nghiệp vụ quản lý nhân sự",
      certificateType: "Chứng chỉ",
      registrationFrom: "2026-03-01",
      registrationTo: "2026-03-25",
      registrationLimit: 40,
      status: "open_registration" as const,
    },
    {
      courseName: "Khóa bồi dưỡng phương pháp giảng dạy hiện đại",
      courseTypeId: getTypeId("Bồi dưỡng chuyên môn"),
      trainingFrom: "2026-05-10",
      trainingTo: "2026-05-14",
      location: "Phòng đào tạo B2 - Cơ sở 2",
      cost: "8000000",
      certificateName: "Chứng chỉ bồi dưỡng nghiệp vụ sư phạm",
      certificateType: "Chứng chỉ",
      registrationFrom: "2026-04-01",
      registrationTo: "2026-04-30",
      registrationLimit: 30,
      status: "open_registration" as const,
    },
    {
      courseName: "Kỹ năng giao tiếp và thuyết trình",
      courseTypeId: getTypeId("Đào tạo kỹ năng mềm"),
      trainingFrom: "2026-03-20",
      trainingTo: "2026-03-22",
      location: "Phòng hội thảo C1",
      cost: "3000000",
      registrationFrom: "2026-03-01",
      registrationTo: "2026-03-15",
      registrationLimit: 25,
      status: "open_registration" as const,
    },
    {
      courseName: "An toàn vệ sinh lao động đợt 1/2026",
      courseTypeId: getTypeId("Đào tạo an toàn lao động"),
      trainingFrom: "2026-02-10",
      trainingTo: "2026-02-12",
      location: "Hội trường lớn - Trụ sở chính",
      cost: "2000000",
      certificateName: "Chứng nhận hoàn thành ATVSLĐ",
      certificateType: "Chứng nhận",
      registrationFrom: "2026-01-15",
      registrationTo: "2026-02-05",
      registrationLimit: 100,
      status: "completed" as const,
    },
    {
      courseName: "Ứng dụng AI trong công việc hành chính",
      courseTypeId: getTypeId("Đào tạo tin học"),
      trainingFrom: "2026-06-01",
      trainingTo: "2026-06-03",
      location: "Phòng máy tính D3 - Cơ sở 1",
      cost: "4500000",
      certificateName: "Chứng chỉ ứng dụng AI cơ bản",
      certificateType: "Chứng chỉ",
      registrationFrom: "2026-05-01",
      registrationTo: "2026-05-25",
      registrationLimit: 35,
      status: "open_registration" as const,
    },
    {
      courseName: "Tiếng Anh giao tiếp công sở - Trình độ B1",
      courseTypeId: getTypeId("Đào tạo ngoại ngữ"),
      trainingFrom: "2026-04-15",
      trainingTo: "2026-06-15",
      location: "Phòng học E2 - Cơ sở 1",
      cost: "12000000",
      commitment: "Cam kết tham gia đầy đủ các buổi học và đạt chứng chỉ B1",
      certificateName: "Chứng chỉ tiếng Anh B1",
      certificateType: "Chứng chỉ quốc tế",
      registrationFrom: "2026-03-15",
      registrationTo: "2026-04-10",
      registrationLimit: 20,
      status: "open_registration" as const,
    },
    {
      courseName: "Đào tạo Scrum Master cho quản lý dự án",
      courseTypeId: getTypeId("Đào tạo bên ngoài"),
      trainingFrom: "2026-03-01",
      trainingTo: "2026-03-05",
      location: "Trung tâm đào tạo XYZ - TP.HCM",
      cost: "15000000",
      commitment: "Cam kết áp dụng Scrum vào quản lý dự án nội bộ trong 1 năm",
      certificateName: "Professional Scrum Master (PSM I)",
      certificateType: "Chứng chỉ quốc tế",
      registrationFrom: "2026-02-01",
      registrationTo: "2026-02-25",
      registrationLimit: 15,
      status: "in_progress" as const,
    },
    {
      courseName: "Huấn luyện phòng cháy chữa cháy 2026",
      courseTypeId: getTypeId("Đào tạo an toàn lao động"),
      trainingFrom: "2026-01-15",
      trainingTo: "2026-01-16",
      location: "Sân tập - Trụ sở chính",
      cost: "1500000",
      certificateName: "Chứng nhận PCCC",
      certificateType: "Chứng nhận",
      registrationFrom: "2026-01-01",
      registrationTo: "2026-01-10",
      registrationLimit: 80,
      status: "completed" as const,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const course of courses) {
    const existing = await db
      .select({ id: trainingCourses.id })
      .from(trainingCourses)
      .where(eq(trainingCourses.courseName, course.courseName))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(trainingCourses).values(course);
    created++;
  }

  console.log(
    `Training courses seeded: ${created} created, ${skipped} skipped (already exist)`,
  );
  process.exit(0);
}

seedTrainingCourses().catch((err) => {
  console.error("Failed to seed training courses:", err);
  process.exit(1);
});
