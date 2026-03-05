import { db } from "../index";
import { authRoles } from "../schema/auth";

const roles = [
  {
    roleCode: "ADMIN",
    roleName: "Quản trị viên",
    description: "Quản lý tài khoản, cơ cấu tổ chức",
    isSystem: true,
  },
  {
    roleCode: "TCCB",
    roleName: "Phòng Tổ chức Cán bộ",
    description: "Quản lý hồ sơ, hợp đồng, đào tạo, cấu hình",
    isSystem: true,
  },
  {
    roleCode: "TCKT",
    roleName: "Phòng Tài chính Kế toán",
    description: "Xem hồ sơ, thống kê",
    isSystem: true,
  },
  {
    roleCode: "EMPLOYEE",
    roleName: "Cán bộ / Giảng viên / Nhân viên",
    description: "Xem hồ sơ cá nhân, đăng ký đào tạo",
    isSystem: true,
  },
] as const;

async function seedRoles() {
  const result = await db
    .insert(authRoles)
    .values([...roles])
    .onConflictDoNothing({ target: authRoles.roleCode });

  console.log(`${result.count} roles seeded (${roles.length} total defined, conflicts skipped)`);
  process.exit(0);
}

seedRoles().catch((err) => {
  console.error("Failed to seed roles:", err);
  process.exit(1);
});
