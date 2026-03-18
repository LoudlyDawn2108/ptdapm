import { db } from "../index";
import { trainingCourseTypes } from "../schema/training";

const types = [
  {
    typeName: "Đào tạo nội bộ",
    description: "Các khóa đào tạo do đơn vị tự tổ chức trong nội bộ",
  },
  {
    typeName: "Đào tạo bên ngoài",
    description: "Các khóa đào tạo do đơn vị bên ngoài tổ chức",
  },
  {
    typeName: "Bồi dưỡng chuyên môn",
    description: "Các khóa bồi dưỡng nâng cao chuyên môn nghiệp vụ",
  },
  {
    typeName: "Đào tạo kỹ năng mềm",
    description: "Các khóa đào tạo kỹ năng giao tiếp, quản lý, lãnh đạo",
  },
  {
    typeName: "Đào tạo an toàn lao động",
    description: "Các khóa huấn luyện về an toàn, vệ sinh lao động",
  },
  {
    typeName: "Đào tạo tin học",
    description: "Các khóa đào tạo về công nghệ thông tin, phần mềm",
  },
  {
    typeName: "Đào tạo ngoại ngữ",
    description: "Các khóa đào tạo tiếng Anh, tiếng Nhật và ngoại ngữ khác",
  },
] as const;

async function seedTrainingCourseTypes() {
  const result = await db
    .insert(trainingCourseTypes)
    .values([...types])
    .onConflictDoNothing({ target: trainingCourseTypes.typeName });

  console.log(
    `${result.count} training course types seeded (${types.length} total defined, conflicts skipped)`,
  );
  process.exit(0);
}

seedTrainingCourseTypes().catch((err) => {
  console.error("Failed to seed training course types:", err);
  process.exit(1);
});
