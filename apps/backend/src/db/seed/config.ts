import { sql } from "drizzle-orm";
import { db } from "..";
import { campuses } from "../schema/campuses";
import { allowanceTypes, contractTypes } from "../schema/contracts";
import { orgUnits } from "../schema/organization";
import { salaryGrades, salaryGradeSteps } from "../schema/salary";

async function seedConfig() {
  console.log("🗑️  Clearing existing config data...");

  // Delete in correct order (children first to avoid FK violations)
  await db.delete(salaryGradeSteps);
  await db.delete(salaryGrades);
  await db.delete(allowanceTypes);
  await db.delete(contractTypes);
  // Don't delete org_units if there are employee_assignments referencing them
  // We'll use a try-catch approach
  try {
    await db.execute(sql`DELETE FROM employee_assignments`);
  } catch { /* table may not exist */ }
  try {
    await db.execute(sql`DELETE FROM org_unit_status_events`);
  } catch { /* table may not exist */ }
  try {
    // Delete employment_contracts that reference org_units
    await db.execute(sql`UPDATE employment_contracts SET org_unit_id = NULL WHERE org_unit_id IS NOT NULL`);
  } catch { /* ignore */ }
  await db.delete(orgUnits);
  await db.delete(campuses);

  console.log("✅ Cleared all config tables\n");

  // ── 1. Campus ──────────────────────────────────────────────────────────
  console.log("🏫 Seeding campuses...");
  const [campusCS1] = await db
    .insert(campuses)
    .values({
      campusCode: "CS1",
      campusName: "Cơ sở 1 - Tây Sơn",
      address: "175 Tây Sơn, Đống Đa, Hà Nội",
      phone: "024 3563 1278",
      email: "cs1@tlu.edu.vn",
    })
    .returning();

  const [campusCS2] = await db
    .insert(campuses)
    .values({
      campusCode: "CS2",
      campusName: "Cơ sở 2 - Phố Hiến",
      address: "Phố Hiến, Hưng Yên",
      phone: "0221 3864 016",
      email: "cs2@tlu.edu.vn",
    })
    .returning();

  console.log(`  ✅ ${2} campuses seeded\n`);

  // ── 2. Org Units (hierarchical) ────────────────────────────────────────
  console.log("🏢 Seeding org units...");

  // Level 0: Top-level units
  const [banGiamHieu] = await db
    .insert(orgUnits)
    .values({
      campusId: campusCS1.id,
      unitCode: "BGH",
      unitName: "Ban Giám hiệu",
      unitType: "BAN",
    })
    .returning();

  const [hoiDong] = await db
    .insert(orgUnits)
    .values({
      campusId: campusCS1.id,
      unitCode: "HD_TRUONG",
      unitName: "Hội đồng trường",
      unitType: "HOI_DONG",
    })
    .returning();

  // Level 0: Phòng ban
  const phongBanData = [
    { unitCode: "P_TCHC", unitName: "Phòng Tổ chức - Hành chính", unitType: "PHONG" as const },
    { unitCode: "P_DTDH", unitName: "Phòng Đào tạo Đại học", unitType: "PHONG" as const },
    { unitCode: "P_KHTC", unitName: "Phòng Kế hoạch - Tài chính", unitType: "PHONG" as const },
    { unitCode: "P_KHCN", unitName: "Phòng Khoa học Công nghệ", unitType: "PHONG" as const },
    { unitCode: "P_CTSV", unitName: "Phòng Công tác Sinh viên", unitType: "PHONG" as const },
    { unitCode: "P_TTPC", unitName: "Phòng Thanh tra - Pháp chế", unitType: "PHONG" as const },
    { unitCode: "P_HTQT", unitName: "Phòng Hợp tác Quốc tế", unitType: "PHONG" as const },
    { unitCode: "P_CSVC", unitName: "Phòng Cơ sở Vật chất", unitType: "PHONG" as const },
  ];

  const phongBanInserted = await db
    .insert(orgUnits)
    .values(phongBanData.map((p) => ({ ...p, campusId: campusCS1.id })))
    .returning();

  // Level 0: Khoa
  const khoaData = [
    { unitCode: "K_CNTT", unitName: "Khoa Công nghệ Thông tin", unitType: "KHOA" as const },
    { unitCode: "K_XD", unitName: "Khoa Công trình", unitType: "KHOA" as const },
    { unitCode: "K_KT", unitName: "Khoa Kinh tế và Quản lý", unitType: "KHOA" as const },
    { unitCode: "K_KTDL", unitName: "Khoa Kỹ thuật Tài nguyên nước", unitType: "KHOA" as const },
    { unitCode: "K_MT", unitName: "Khoa Môi trường", unitType: "KHOA" as const },
    { unitCode: "K_CK", unitName: "Khoa Cơ khí", unitType: "KHOA" as const },
    { unitCode: "K_DDT", unitName: "Khoa Điện - Điện tử", unitType: "KHOA" as const },
    { unitCode: "K_CB", unitName: "Khoa Cơ bản", unitType: "KHOA" as const },
    { unitCode: "K_LLD", unitName: "Khoa Lý luận chính trị", unitType: "KHOA" as const },
    { unitCode: "K_NN", unitName: "Khoa Ngoại ngữ", unitType: "KHOA" as const },
  ];

  const khoaInserted = await db
    .insert(orgUnits)
    .values(khoaData.map((k) => ({ ...k, campusId: campusCS1.id })))
    .returning();

  // Level 1: Bộ môn under Khoa CNTT
  const khoaCNTT = khoaInserted.find((k) => k.unitCode === "K_CNTT")!;
  const boMonCNTT = [
    { unitCode: "BM_CNPM", unitName: "Bộ môn Công nghệ Phần mềm", unitType: "BO_MON" as const },
    { unitCode: "BM_HTTT", unitName: "Bộ môn Hệ thống Thông tin", unitType: "BO_MON" as const },
    { unitCode: "BM_KHMT", unitName: "Bộ môn Khoa học Máy tính", unitType: "BO_MON" as const },
    { unitCode: "BM_MMT", unitName: "Bộ môn Mạng Máy tính", unitType: "BO_MON" as const },
  ];

  await db
    .insert(orgUnits)
    .values(boMonCNTT.map((b) => ({ ...b, campusId: campusCS1.id, parentId: khoaCNTT.id })))
    .returning();

  // Level 1: Bộ môn under Khoa Công trình
  const khoaXD = khoaInserted.find((k) => k.unitCode === "K_XD")!;
  const boMonXD = [
    { unitCode: "BM_XDDD", unitName: "Bộ môn Xây dựng Dân dụng", unitType: "BO_MON" as const },
    { unitCode: "BM_CTTN", unitName: "Bộ môn Công trình Thủy nông", unitType: "BO_MON" as const },
    { unitCode: "BM_VLXD", unitName: "Bộ môn Vật liệu Xây dựng", unitType: "BO_MON" as const },
  ];

  await db
    .insert(orgUnits)
    .values(boMonXD.map((b) => ({ ...b, campusId: campusCS1.id, parentId: khoaXD.id })))
    .returning();

  // Level 0: Trung tâm
  const ttData = [
    { unitCode: "TT_TV", unitName: "Trung tâm Thông tin - Thư viện", unitType: "TRUNG_TAM" as const },
    { unitCode: "TT_CNTT", unitName: "Trung tâm CNTT và Truyền thông", unitType: "TRUNG_TAM" as const },
    { unitCode: "TT_DT", unitName: "Trung tâm Đào tạo và HTQT", unitType: "TRUNG_TAM" as const },
  ];

  await db
    .insert(orgUnits)
    .values(ttData.map((t) => ({ ...t, campusId: campusCS1.id })))
    .returning();

  const totalOrg = 2 + phongBanData.length + khoaData.length + boMonCNTT.length + boMonXD.length + ttData.length;
  console.log(`  ✅ ${totalOrg} org units seeded (with hierarchy)\n`);

  // ── 3. Salary Grades + Steps ───────────────────────────────────────────
  console.log("💰 Seeding salary grades & steps...");

  const gradeData = [
    {
      gradeCode: "GV",
      gradeName: "Giảng viên",
      steps: [
        { stepNo: 1, coefficient: "2.34" },
        { stepNo: 2, coefficient: "2.67" },
        { stepNo: 3, coefficient: "3.00" },
        { stepNo: 4, coefficient: "3.33" },
        { stepNo: 5, coefficient: "3.66" },
        { stepNo: 6, coefficient: "3.99" },
        { stepNo: 7, coefficient: "4.32" },
        { stepNo: 8, coefficient: "4.65" },
        { stepNo: 9, coefficient: "4.98" },
      ],
    },
    {
      gradeCode: "GVCC",
      gradeName: "Giảng viên cao cấp",
      steps: [
        { stepNo: 1, coefficient: "6.20" },
        { stepNo: 2, coefficient: "6.56" },
        { stepNo: 3, coefficient: "6.92" },
        { stepNo: 4, coefficient: "7.28" },
        { stepNo: 5, coefficient: "7.64" },
        { stepNo: 6, coefficient: "8.00" },
      ],
    },
    {
      gradeCode: "GVC",
      gradeName: "Giảng viên chính",
      steps: [
        { stepNo: 1, coefficient: "4.40" },
        { stepNo: 2, coefficient: "4.74" },
        { stepNo: 3, coefficient: "5.08" },
        { stepNo: 4, coefficient: "5.42" },
        { stepNo: 5, coefficient: "5.76" },
        { stepNo: 6, coefficient: "6.10" },
        { stepNo: 7, coefficient: "6.44" },
        { stepNo: 8, coefficient: "6.78" },
      ],
    },
    {
      gradeCode: "NCV",
      gradeName: "Nghiên cứu viên",
      steps: [
        { stepNo: 1, coefficient: "2.34" },
        { stepNo: 2, coefficient: "2.67" },
        { stepNo: 3, coefficient: "3.00" },
        { stepNo: 4, coefficient: "3.33" },
        { stepNo: 5, coefficient: "3.66" },
        { stepNo: 6, coefficient: "3.99" },
        { stepNo: 7, coefficient: "4.32" },
        { stepNo: 8, coefficient: "4.65" },
      ],
    },
    {
      gradeCode: "NCVC",
      gradeName: "Nghiên cứu viên chính",
      steps: [
        { stepNo: 1, coefficient: "4.40" },
        { stepNo: 2, coefficient: "4.74" },
        { stepNo: 3, coefficient: "5.08" },
        { stepNo: 4, coefficient: "5.42" },
        { stepNo: 5, coefficient: "5.76" },
        { stepNo: 6, coefficient: "6.10" },
      ],
    },
    {
      gradeCode: "CVM",
      gradeName: "Chuyên viên",
      steps: [
        { stepNo: 1, coefficient: "2.34" },
        { stepNo: 2, coefficient: "2.67" },
        { stepNo: 3, coefficient: "3.00" },
        { stepNo: 4, coefficient: "3.33" },
        { stepNo: 5, coefficient: "3.66" },
        { stepNo: 6, coefficient: "3.99" },
        { stepNo: 7, coefficient: "4.32" },
        { stepNo: 8, coefficient: "4.65" },
        { stepNo: 9, coefficient: "4.98" },
      ],
    },
    {
      gradeCode: "CVC",
      gradeName: "Chuyên viên chính",
      steps: [
        { stepNo: 1, coefficient: "4.40" },
        { stepNo: 2, coefficient: "4.74" },
        { stepNo: 3, coefficient: "5.08" },
        { stepNo: 4, coefficient: "5.42" },
        { stepNo: 5, coefficient: "5.76" },
        { stepNo: 6, coefficient: "6.10" },
        { stepNo: 7, coefficient: "6.44" },
        { stepNo: 8, coefficient: "6.78" },
      ],
    },
    {
      gradeCode: "KTV",
      gradeName: "Kỹ thuật viên",
      steps: [
        { stepNo: 1, coefficient: "1.86" },
        { stepNo: 2, coefficient: "2.06" },
        { stepNo: 3, coefficient: "2.26" },
        { stepNo: 4, coefficient: "2.46" },
        { stepNo: 5, coefficient: "2.66" },
        { stepNo: 6, coefficient: "2.86" },
        { stepNo: 7, coefficient: "3.06" },
        { stepNo: 8, coefficient: "3.26" },
        { stepNo: 9, coefficient: "3.46" },
        { stepNo: 10, coefficient: "3.66" },
        { stepNo: 11, coefficient: "3.86" },
        { stepNo: 12, coefficient: "4.06" },
      ],
    },
  ];

  let totalSteps = 0;
  for (const grade of gradeData) {
    const [inserted] = await db
      .insert(salaryGrades)
      .values({ gradeCode: grade.gradeCode, gradeName: grade.gradeName })
      .returning();

    await db.insert(salaryGradeSteps).values(
      grade.steps.map((s) => ({
        salaryGradeId: inserted.id,
        stepNo: s.stepNo,
        coefficient: s.coefficient,
      })),
    );
    totalSteps += grade.steps.length;
  }

  console.log(`  ✅ ${gradeData.length} salary grades, ${totalSteps} steps seeded\n`);

  // ── 4. Allowance Types ─────────────────────────────────────────────────
  console.log("💼 Seeding allowance types...");

  const allowanceData = [
    { allowanceName: "Phụ cấp chức vụ", description: "Phụ cấp cho các vị trí quản lý", calcMethod: "Hệ số × Lương cơ sở" },
    { allowanceName: "Phụ cấp thâm niên nhà giáo", description: "Phụ cấp theo năm công tác giảng dạy", calcMethod: "5% mỗi 5 năm, tối đa 30%" },
    { allowanceName: "Phụ cấp ưu đãi nghề", description: "Phụ cấp ưu đãi cho ngành giáo dục", calcMethod: "25-50% × Lương hiện hưởng" },
    { allowanceName: "Phụ cấp trách nhiệm", description: "Phụ cấp cho các vị trí có trách nhiệm đặc biệt", calcMethod: "Hệ số × Lương cơ sở" },
    { allowanceName: "Phụ cấp độc hại", description: "Phụ cấp cho làm việc trong môi trường độc hại", calcMethod: "Theo mức quy định" },
    { allowanceName: "Phụ cấp khu vực", description: "Phụ cấp theo vùng miền", calcMethod: "Hệ số × Lương cơ sở" },
    { allowanceName: "Phụ cấp lưu động", description: "Phụ cấp cho công việc phải di chuyển nhiều", calcMethod: "Theo ngày công tác" },
    { allowanceName: "Phụ cấp kiêm nhiệm", description: "Phụ cấp khi kiêm nhiệm thêm chức vụ", calcMethod: "10-40% phụ cấp chức vụ" },
    { allowanceName: "Phụ cấp đặc biệt", description: "Phụ cấp cho các trường hợp đặc biệt", calcMethod: "Theo quyết định" },
    { allowanceName: "Phụ cấp thu hút", description: "Phụ cấp thu hút nhân tài", calcMethod: "Theo hợp đồng thỏa thuận" },
  ];

  await db.insert(allowanceTypes).values(allowanceData);
  console.log(`  ✅ ${allowanceData.length} allowance types seeded\n`);

  // ── 5. Contract Types ──────────────────────────────────────────────────
  console.log("📄 Seeding contract types...");

  const contractData = [
    { contractTypeName: "Hợp đồng thử việc", minMonths: 1, maxMonths: 6, maxRenewals: 0, renewalGraceDays: 0 },
    { contractTypeName: "Hợp đồng xác định thời hạn (1 năm)", minMonths: 12, maxMonths: 12, maxRenewals: 2, renewalGraceDays: 30 },
    { contractTypeName: "Hợp đồng xác định thời hạn (2 năm)", minMonths: 24, maxMonths: 24, maxRenewals: 1, renewalGraceDays: 30 },
    { contractTypeName: "Hợp đồng xác định thời hạn (3 năm)", minMonths: 36, maxMonths: 36, maxRenewals: 1, renewalGraceDays: 45 },
    { contractTypeName: "Hợp đồng không xác định thời hạn", minMonths: 0, maxMonths: 600, maxRenewals: 0, renewalGraceDays: 0 },
    { contractTypeName: "Hợp đồng vụ việc", minMonths: 1, maxMonths: 12, maxRenewals: 3, renewalGraceDays: 15 },
    { contractTypeName: "Hợp đồng thỉnh giảng", minMonths: 1, maxMonths: 12, maxRenewals: 5, renewalGraceDays: 15 },
  ];

  await db.insert(contractTypes).values(contractData);
  console.log(`  ✅ ${contractData.length} contract types seeded\n`);

  console.log("🎉 Config seed completed!");
}

seedConfig()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed config:", err);
    process.exit(1);
  });
