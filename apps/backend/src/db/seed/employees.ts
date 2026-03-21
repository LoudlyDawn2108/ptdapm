import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  type NewEmployee,
  allowanceTypes,
  contractTypes,
  employeeAllowances,
  employeeAssignments,
  employeeBankAccounts,
  employeeCertifications,
  employeeDegrees,
  employeeEvaluations,
  employeeFamilyMembers,
  employeeForeignWorkPermits,
  employeePartyMemberships,
  employeePreviousJobs,
  employees,
  employmentContracts,
} from "../schema";
import { authUsers } from "../schema/auth";
import { orgUnits } from "../schema/organization";
import { salaryGradeSteps, salaryGrades } from "../schema/salary";

// ──────────────────────────────────────────────────────────────────────────────
// Helper: lookup by code/name, returns id or null
// ──────────────────────────────────────────────────────────────────────────────
async function findOrgUnit(code: string) {
  const [row] = await db
    .select({ id: orgUnits.id })
    .from(orgUnits)
    .where(eq(orgUnits.unitCode, code))
    .limit(1);
  return row?.id ?? null;
}

async function findSalaryGradeStep(gradeCode: string, stepNo: number) {
  const [grade] = await db
    .select({ id: salaryGrades.id })
    .from(salaryGrades)
    .where(eq(salaryGrades.gradeCode, gradeCode))
    .limit(1);
  if (!grade) return null;
  const [step] = await db
    .select({ id: salaryGradeSteps.id })
    .from(salaryGradeSteps)
    .where(eq(salaryGradeSteps.salaryGradeId, grade.id))
    .limit(1);
  // Find the exact step
  const rows = await db
    .select({ id: salaryGradeSteps.id, stepNo: salaryGradeSteps.stepNo })
    .from(salaryGradeSteps)
    .where(eq(salaryGradeSteps.salaryGradeId, grade.id));
  const match = rows.find((r) => r.stepNo === stepNo);
  return match?.id ?? null;
}

async function findContractType(name: string) {
  const [row] = await db
    .select({ id: contractTypes.id })
    .from(contractTypes)
    .where(eq(contractTypes.contractTypeName, name))
    .limit(1);
  return row?.id ?? null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Employee data — emails MATCH the user accounts in users.ts
// ──────────────────────────────────────────────────────────────────────────────
type SeedEmployee = Omit<
  NewEmployee,
  "id" | "staffCode" | "createdAt" | "updatedAt" | "currentOrgUnitId" | "salaryGradeStepId"
>;

const sampleEmployees: SeedEmployee[] = [
  {
    // Employee 0 → admin@test.local (ADMIN)
    fullName: "Nguyen Van An",
    dob: "1985-03-15",
    gender: "NAM",
    nationalId: "001085012345",
    hometown: "Ha Noi",
    address: "12 Pho Hue, Hai Ba Trung, Ha Noi",
    taxCode: "MST0001",
    socialInsuranceNo: "BHXH0001",
    healthInsuranceNo: "BHYT0001",
    email: "admin@test.local",
    phone: "0901000001",
    educationLevel: "TIEN_SI",
    academicRank: "PGS",
    academicTitle: "GIANG_VIEN_CC",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
    currentPositionTitle: "Pho Giam doc Trung tam CNTT",
    // orgUnit + salaryGradeStep set after lookup
  },
  {
    // Employee 1 → tccb@test.local (TCCB)
    fullName: "Tran Thi Binh",
    dob: "1990-07-22",
    gender: "NU",
    nationalId: "001090056789",
    hometown: "Hai Phong",
    address: "45 Le Loi, Ngo Quyen, Hai Phong",
    taxCode: "MST0002",
    socialInsuranceNo: "BHXH0002",
    healthInsuranceNo: "BHYT0002",
    email: "tccb@test.local",
    phone: "0901000002",
    educationLevel: "THAC_SI",
    academicRank: "GS",
    academicTitle: "GIANG_VIEN_CHINH",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
    currentPositionTitle: "Chuyen vien Phong TCHC",
  },
  {
    // Employee 2 → tckt@test.local (TCKT)
    fullName: "Le Hoang Cuong",
    dob: "1988-11-05",
    gender: "NAM",
    nationalId: "001088098765",
    hometown: "Da Nang",
    address: "78 Nguyen Hue, Hai Chau, Da Nang",
    taxCode: "MST0003",
    socialInsuranceNo: "BHXH0003",
    healthInsuranceNo: "BHYT0003",
    email: "tckt@test.local",
    phone: "0901000003",
    educationLevel: "DAI_HOC",
    academicTitle: "CHUYEN_VIEN",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
    currentPositionTitle: "Chuyen vien Phong KHTC",
  },
  {
    // Employee 3 → employee@test.local (EMPLOYEE)
    fullName: "Pham Minh Duc",
    dob: "1992-01-30",
    gender: "NAM",
    nationalId: "001092034567",
    hometown: "Nghe An",
    address: "23 Tran Phu, Vinh, Nghe An",
    taxCode: "MST0004",
    socialInsuranceNo: "BHXH0004",
    healthInsuranceNo: "BHYT0004",
    email: "employee@test.local",
    phone: "0901000004",
    educationLevel: "THAC_SI",
    academicTitle: "GIANG_VIEN",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
    currentPositionTitle: "Giang vien Khoa CNTT",
  },
  {
    // Employee 4 — standalone, no user account
    fullName: "Vo Thi Em",
    dob: "1995-06-18",
    gender: "NU",
    nationalId: "001095067890",
    hometown: "Can Tho",
    address: "56 Nguyen Trai, Ninh Kieu, Can Tho",
    taxCode: "MST0005",
    socialInsuranceNo: "BHXH0005",
    healthInsuranceNo: "BHYT0005",
    email: "vo.thi.em@tlu.edu.vn",
    phone: "0901000005",
    educationLevel: "DAI_HOC",
    academicTitle: "TRO_GIANG",
    workStatus: "working" as const,
    contractStatus: "expired" as const,
    currentPositionTitle: "Tro giang Khoa CNTT",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Org unit + salary grade mapping per employee
// ──────────────────────────────────────────────────────────────────────────────
const employeeOrgMapping = [
  { orgCode: "TT_CNTT", gradeCode: "GVCC", stepNo: 3 }, // emp 0 - Trung tam CNTT, GV cao cap bac 3
  { orgCode: "P_TCHC", gradeCode: "CVC", stepNo: 2 }, // emp 1 - Phong TCHC, Chuyen vien chinh bac 2
  { orgCode: "P_KHTC", gradeCode: "CVM", stepNo: 5 }, // emp 2 - Phong KHTC, Chuyen vien bac 5
  { orgCode: "K_CNTT", gradeCode: "GV", stepNo: 3 }, // emp 3 - Khoa CNTT, Giang vien bac 3
  { orgCode: "K_CNTT", gradeCode: "GV", stepNo: 1 }, // emp 4 - Khoa CNTT, Giang vien bac 1
];

async function seedEmployees() {
  console.log("Seeding employees...");
  let created = 0;
  let skipped = 0;
  const employeeIds: string[] = [];

  // Lookup org units & salary grade steps first
  const orgUnitIds: (string | null)[] = [];
  const salaryStepIds: (string | null)[] = [];
  for (const mapping of employeeOrgMapping) {
    orgUnitIds.push(await findOrgUnit(mapping.orgCode));
    salaryStepIds.push(await findSalaryGradeStep(mapping.gradeCode, mapping.stepNo));
  }

  for (const [i, emp] of sampleEmployees.entries()) {
    const [existingEmployee] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.nationalId, emp.nationalId))
      .limit(1);

    if (existingEmployee) {
      await db
        .update(employees)
        .set({
          currentOrgUnitId: orgUnitIds[i] ?? null,
          salaryGradeStepId: salaryStepIds[i] ?? null,
          updatedAt: new Date(),
        })
        .where(eq(employees.id, existingEmployee.id));
      console.log(`  Skipping ${emp.fullName} (nationalId ${emp.nationalId} already exists)`);
      employeeIds.push(existingEmployee.id);
      skipped++;
      continue;
    }

    const insertData: NewEmployee = {
      ...emp,
      currentOrgUnitId: orgUnitIds[i] ?? undefined,
      salaryGradeStepId: salaryStepIds[i] ?? undefined,
    };

    const [inserted] = await db
      .insert(employees)
      .values(insertData)
      .returning({ id: employees.id });
    if (!inserted) {
      console.error(`  Failed to insert ${emp.fullName}`);
      continue;
    }
    employeeIds.push(inserted.id);
    console.log(`  Created ${emp.fullName} (email: ${emp.email})`);
    created++;
  }

  console.log(`\n${created} employees created, ${skipped} skipped\n`);

  console.log("Linking auth users to seeded employees...");
  let linkedUsers = 0;
  for (const [index, employeeId] of employeeIds.entries()) {
    const email = sampleEmployees[index]?.email;
    if (!employeeId || !email) continue;

    const linked = await db
      .update(authUsers)
      .set({ employeeId, updatedAt: new Date() })
      .where(eq(authUsers.email, email))
      .returning({ id: authUsers.id });

    linkedUsers += linked.length;
  }
  console.log(`  ${linkedUsers} auth users linked`);

  console.log("Resetting dependent employee seed data...");
  for (const employeeId of employeeIds) {
    if (!employeeId) continue;

    await db.delete(employeeEvaluations).where(eq(employeeEvaluations.employeeId, employeeId));
    await db.delete(employeeAssignments).where(eq(employeeAssignments.employeeId, employeeId));
    await db.delete(employmentContracts).where(eq(employmentContracts.employeeId, employeeId));
    await db.delete(employeeAllowances).where(eq(employeeAllowances.employeeId, employeeId));
    await db
      .delete(employeeForeignWorkPermits)
      .where(eq(employeeForeignWorkPermits.employeeId, employeeId));
    await db
      .delete(employeeCertifications)
      .where(eq(employeeCertifications.employeeId, employeeId));
    await db.delete(employeeDegrees).where(eq(employeeDegrees.employeeId, employeeId));
    await db
      .delete(employeePartyMemberships)
      .where(eq(employeePartyMemberships.employeeId, employeeId));
    await db.delete(employeePreviousJobs).where(eq(employeePreviousJobs.employeeId, employeeId));
    await db.delete(employeeBankAccounts).where(eq(employeeBankAccounts.employeeId, employeeId));
    await db.delete(employeeFamilyMembers).where(eq(employeeFamilyMembers.employeeId, employeeId));
  }
  console.log(`  Reset dependent data for ${employeeIds.length} seeded employees`);

  console.log("Seeding employee evaluations...");
  const evaluationData = [
    {
      employeeIdx: 0,
      evalType: "REWARD" as const,
      rewardType: "Khen thưởng cấp trường",
      rewardName: "Giảng viên tiêu biểu năm 2024",
      decisionOn: "2024-11-20",
      decisionNo: "KT-2024-001",
      content: "Có thành tích xuất sắc trong giảng dạy và chuyển đổi số.",
      rewardAmount: "5000000",
      visibleToEmployee: true,
      visibleToTckt: true,
    },
    {
      employeeIdx: 0,
      evalType: "DISCIPLINE" as const,
      disciplineType: "Nhắc nhở",
      disciplineName: "Nhắc nhở chậm nộp báo cáo",
      decisionOn: "2023-09-12",
      reason: "Nộp báo cáo tổng kết học kỳ trễ hạn.",
      actionForm: "Nhắc nhở bằng văn bản",
      visibleToEmployee: true,
      visibleToTckt: true,
    },
    {
      employeeIdx: 1,
      evalType: "REWARD" as const,
      rewardType: "Khen thưởng đột xuất",
      rewardName: "Hoàn thành tốt công tác tuyển dụng",
      decisionOn: "2024-08-05",
      decisionNo: "KT-2024-014",
      content: "Hoàn thành vượt tiến độ kế hoạch tuyển dụng năm học mới.",
      rewardAmount: "3000000",
      visibleToEmployee: true,
      visibleToTckt: true,
    },
    {
      employeeIdx: 2,
      evalType: "DISCIPLINE" as const,
      disciplineType: "Phê bình",
      disciplineName: "Phê bình sai sót chứng từ",
      decisionOn: "2024-03-18",
      reason: "Để xảy ra sai sót trong đối chiếu chứng từ nội bộ.",
      actionForm: "Phê bình và yêu cầu rút kinh nghiệm",
      visibleToEmployee: true,
      visibleToTckt: true,
    },
    {
      employeeIdx: 3,
      evalType: "REWARD" as const,
      rewardType: "Khen thưởng cấp khoa",
      rewardName: "Giảng viên trẻ xuất sắc",
      decisionOn: "2024-06-10",
      decisionNo: "KT-2024-021",
      content: "Có nhiều đóng góp trong hướng dẫn sinh viên nghiên cứu khoa học.",
      rewardAmount: "2000000",
      visibleToEmployee: true,
      visibleToTckt: true,
    },
    {
      employeeIdx: 3,
      evalType: "DISCIPLINE" as const,
      disciplineType: "Nhắc nhở",
      disciplineName: "Nhắc nhở cập nhật hồ sơ chuyên môn",
      decisionOn: "2023-12-01",
      reason: "Chậm cập nhật minh chứng chuyên môn theo yêu cầu.",
      actionForm: "Nhắc nhở trực tiếp",
      visibleToEmployee: true,
      visibleToTckt: false,
    },
    {
      employeeIdx: 4,
      evalType: "REWARD" as const,
      rewardType: "Khen thưởng phong trào",
      rewardName: "Hỗ trợ tốt công tác trợ giảng",
      decisionOn: "2024-05-22",
      decisionNo: "KT-2024-030",
      content: "Hỗ trợ hiệu quả các hoạt động học tập của sinh viên.",
      rewardAmount: "1000000",
      visibleToEmployee: true,
      visibleToTckt: true,
    },
  ];

  let evaluationCount = 0;
  for (const evaluation of evaluationData) {
    const employeeId = employeeIds[evaluation.employeeIdx];
    if (!employeeId) continue;

    const { employeeIdx, ...data } = evaluation;
    await db.insert(employeeEvaluations).values({
      employeeId,
      ...data,
    });
    evaluationCount++;
  }
  console.log(`  ${evaluationCount} employee evaluations seeded`);

  // ── Seed family members ────────────────────────────────────────────────
  console.log("Seeding family members...");
  const familyData = [
    {
      employeeIdx: 0,
      relation: "VO_CHONG",
      fullName: "Le Thi Hoa",
      dob: "1987-05-20",
      phone: "0912345001",
    },
    {
      employeeIdx: 0,
      relation: "CON",
      fullName: "Nguyen Thi Mai",
      dob: "2012-09-10",
      isDependent: true,
    },
    {
      employeeIdx: 0,
      relation: "CON",
      fullName: "Nguyen Van Bao",
      dob: "2015-03-25",
      isDependent: true,
    },
    {
      employeeIdx: 1,
      relation: "CHA",
      fullName: "Tran Van Hung",
      dob: "1960-01-15",
      phone: "0912345002",
    },
    {
      employeeIdx: 1,
      relation: "ME",
      fullName: "Nguyen Thi Lan",
      dob: "1963-08-20",
      phone: "0912345003",
      isDependent: true,
    },
    {
      employeeIdx: 1,
      relation: "VO_CHONG",
      fullName: "Nguyen Duc Tuan",
      dob: "1989-04-12",
      phone: "0912345004",
    },
    {
      employeeIdx: 2,
      relation: "VO_CHONG",
      fullName: "Pham Thi Dao",
      dob: "1990-11-08",
      phone: "0912345005",
    },
    {
      employeeIdx: 2,
      relation: "CON",
      fullName: "Le Pham Minh",
      dob: "2018-07-14",
      isDependent: true,
    },
    {
      employeeIdx: 3,
      relation: "CHA",
      fullName: "Pham Van Tai",
      dob: "1965-06-05",
      phone: "0912345006",
    },
    {
      employeeIdx: 3,
      relation: "ME",
      fullName: "Ho Thi Nhung",
      dob: "1968-12-25",
      phone: "0912345007",
    },
    {
      employeeIdx: 4,
      relation: "NGUOI_PHU_THUOC",
      fullName: "Vo Van Lam",
      dob: "1935-02-10",
      isDependent: true,
      note: "Ong noi, mat suc lao dong",
    },
    {
      employeeIdx: 4,
      relation: "ME",
      fullName: "Nguyen Thi Suong",
      dob: "1970-09-18",
      phone: "0912345008",
    },
  ];

  for (const fm of familyData) {
    const employeeId = employeeIds[fm.employeeIdx];
    if (!employeeId) continue;
    const { employeeIdx, ...data } = fm;
    await db
      .insert(employeeFamilyMembers)
      .values({ ...data, employeeId })
      .onConflictDoNothing();
  }
  console.log(`  ${familyData.length} family members seeded`);

  // ── Seed bank accounts ─────────────────────────────────────────────────
  console.log("Seeding bank accounts...");
  const bankData = [
    { employeeIdx: 0, bankName: "Techcombank", accountNo: "19001234567890", isPrimary: true },
    { employeeIdx: 0, bankName: "Vietcombank", accountNo: "00112233445566" },
    { employeeIdx: 1, bankName: "BIDV", accountNo: "31110000123456", isPrimary: true },
    { employeeIdx: 1, bankName: "MB Bank", accountNo: "0801000123456" },
    { employeeIdx: 2, bankName: "VPBank", accountNo: "12345678901234", isPrimary: true },
    { employeeIdx: 3, bankName: "Techcombank", accountNo: "19009876543210", isPrimary: true },
    { employeeIdx: 3, bankName: "Vietinbank", accountNo: "10401000654321" },
    { employeeIdx: 4, bankName: "Agribank", accountNo: "56789012345678", isPrimary: true },
  ];

  for (const ba of bankData) {
    const employeeId = employeeIds[ba.employeeIdx];
    if (!employeeId) continue;
    const { employeeIdx, ...data } = ba;
    await db
      .insert(employeeBankAccounts)
      .values({ ...data, employeeId })
      .onConflictDoNothing();
  }
  console.log(`  ${bankData.length} bank accounts seeded`);

  // ── Seed previous jobs ─────────────────────────────────────────────────
  console.log("Seeding previous jobs...");
  const jobData = [
    {
      employeeIdx: 0,
      workplace: "Dai hoc Bach Khoa Ha Noi",
      startedOn: "2010-09-01",
      endedOn: "2015-08-31",
      note: "Giang vien Khoa CNTT",
    },
    {
      employeeIdx: 0,
      workplace: "Cong ty FPT Software",
      startedOn: "2008-06-01",
      endedOn: "2010-08-31",
      note: "Ky su phan mem",
    },
    {
      employeeIdx: 1,
      workplace: "Vien Khoa hoc Cong nghe",
      startedOn: "2015-01-01",
      endedOn: "2019-12-31",
      note: "Nghien cuu vien",
    },
    {
      employeeIdx: 1,
      workplace: "Phong Nhan su Cong ty ABC",
      startedOn: "2013-06-01",
      endedOn: "2014-12-31",
      note: "Chuyen vien nhan su",
    },
    {
      employeeIdx: 2,
      workplace: "Cong ty Samsung Vietnam",
      startedOn: "2012-03-01",
      endedOn: "2018-06-30",
      note: "Ke toan truong",
    },
    {
      employeeIdx: 3,
      workplace: "Cong ty VNPT",
      startedOn: "2016-07-01",
      endedOn: "2019-08-31",
      note: "Ky su mang",
    },
    {
      employeeIdx: 4,
      workplace: "Truong THPT Nguyen Hue",
      startedOn: "2017-09-01",
      endedOn: "2020-06-30",
      note: "Giao vien tin hoc",
    },
  ];

  for (const pj of jobData) {
    const employeeId = employeeIds[pj.employeeIdx];
    if (!employeeId) continue;
    const { employeeIdx, ...data } = pj;
    await db
      .insert(employeePreviousJobs)
      .values({ ...data, employeeId })
      .onConflictDoNothing();
  }
  console.log(`  ${jobData.length} previous jobs seeded`);

  // ── Seed party memberships ─────────────────────────────────────────────
  console.log("Seeding party memberships...");
  const partyData = [
    {
      employeeIdx: 0,
      organizationType: "DOAN",
      joinedOn: "2003-03-26",
      details: "Gia nhap Doan TNCS Ho Chi Minh tai truong THPT",
    },
    {
      employeeIdx: 0,
      organizationType: "DANG",
      joinedOn: "2012-07-01",
      details: "Ket nap Dang vien chinh thuc tai chi bo Khoa CNTT",
    },
    {
      employeeIdx: 1,
      organizationType: "DOAN",
      joinedOn: "2008-03-26",
      details: "Gia nhap Doan tai truong Dai hoc",
    },
    {
      employeeIdx: 1,
      organizationType: "DANG",
      joinedOn: "2018-01-15",
      details: "Ket nap Dang vien tai Chi bo Phong TCHC",
    },
    {
      employeeIdx: 2,
      organizationType: "DOAN",
      joinedOn: "2006-03-26",
      details: "Gia nhap Doan thanh nien",
    },
    {
      employeeIdx: 3,
      organizationType: "DOAN",
      joinedOn: "2010-03-26",
      details: "Gia nhap Doan TNCS Ho Chi Minh",
    },
    {
      employeeIdx: 3,
      organizationType: "DANG",
      joinedOn: "2022-06-15",
      details: "Ket nap Dang vien du bi tai Chi bo Khoa CNTT",
    },
    {
      employeeIdx: 4,
      organizationType: "DOAN",
      joinedOn: "2013-03-26",
      details: "Gia nhap Doan tai truong Dai hoc",
    },
  ];

  for (const pm of partyData) {
    const employeeId = employeeIds[pm.employeeIdx];
    if (!employeeId) continue;
    const { employeeIdx, ...data } = pm;
    await db
      .insert(employeePartyMemberships)
      .values({ ...data, employeeId })
      .onConflictDoNothing();
  }
  console.log(`  ${partyData.length} party memberships seeded`);

  // ── Seed allowances ────────────────────────────────────────────────────
  console.log("Seeding employee allowances...");
  const existingTypes = await db.select().from(allowanceTypes).limit(10);

  if (existingTypes.length === 0) {
    console.log(
      "  No allowance types found — skipping employee allowances (run config seed first)",
    );
  } else {
    const fallbackAllowanceTypeId = existingTypes[0]?.id;
    if (!fallbackAllowanceTypeId) {
      console.log("  No allowance types found — skipping employee allowances");
    } else {
      // Build a name→id map for convenience
      const typeMap = new Map(existingTypes.map((t) => [t.allowanceName, t.id]));
      const getType = (name: string) => typeMap.get(name) ?? fallbackAllowanceTypeId;

      const allowanceData = [
        {
          employeeIdx: 0,
          typeName: "Phụ cấp chức vụ",
          amount: "2500000",
          note: "Phu cap PGD Trung tam",
        },
        {
          employeeIdx: 0,
          typeName: "Phụ cấp thâm niên nhà giáo",
          amount: "1800000",
          note: "15 nam cong tac",
        },
        { employeeIdx: 0, typeName: "Phụ cấp ưu đãi nghề", amount: "1200000" },
        {
          employeeIdx: 1,
          typeName: "Phụ cấp chức vụ",
          amount: "2000000",
          note: "Phu cap chuyen vien chinh",
        },
        {
          employeeIdx: 1,
          typeName: "Phụ cấp thâm niên nhà giáo",
          amount: "800000",
          note: "5 nam cong tac",
        },
        {
          employeeIdx: 2,
          typeName: "Phụ cấp trách nhiệm",
          amount: "1500000",
          note: "Trach nhiem ke toan",
        },
        { employeeIdx: 2, typeName: "Phụ cấp ưu đãi nghề", amount: "600000" },
        {
          employeeIdx: 3,
          typeName: "Phụ cấp ưu đãi nghề",
          amount: "900000",
          note: "Giang vien tre",
        },
        { employeeIdx: 4, typeName: "Phụ cấp ưu đãi nghề", amount: "500000", note: "Tro giang" },
      ];

      let allowanceCount = 0;
      for (const al of allowanceData) {
        const employeeId = employeeIds[al.employeeIdx];
        if (!employeeId) continue;
        await db
          .insert(employeeAllowances)
          .values({
            employeeId,
            allowanceTypeId: getType(al.typeName),
            amount: al.amount,
            status: "active",
            note: al.note,
          })
          .onConflictDoNothing();
        allowanceCount++;
      }
      console.log(`  ${allowanceCount} employee allowances seeded`);
    }
  }

  // ── Seed degrees ───────────────────────────────────────────────────────
  console.log("Seeding employee degrees...");
  const degreeData = [
    {
      employeeIdx: 0,
      degreeName: "Tien si Cong nghe Thong tin",
      school: "Dai hoc Bach Khoa Ha Noi",
    },
    { employeeIdx: 0, degreeName: "Thac si Khoa hoc May tinh", school: "Dai hoc Quoc gia Ha Noi" },
    { employeeIdx: 0, degreeName: "Cu nhan Cong nghe Thong tin", school: "Dai hoc Thuy loi" },
    { employeeIdx: 1, degreeName: "Thac si Quan tri Nhan luc", school: "Dai hoc Kinh te Quoc dan" },
    { employeeIdx: 1, degreeName: "Cu nhan Quan tri Kinh doanh", school: "Dai hoc Thuong mai" },
    { employeeIdx: 2, degreeName: "Cu nhan Ke toan", school: "Hoc vien Tai chinh" },
    {
      employeeIdx: 2,
      degreeName: "Cu nhan Tai chinh Ngan hang",
      school: "Dai hoc Ngan hang TP.HCM",
    },
    { employeeIdx: 3, degreeName: "Thac si Cong nghe Phan mem", school: "Dai hoc Thuy loi" },
    { employeeIdx: 3, degreeName: "Cu nhan Cong nghe Thong tin", school: "Dai hoc Vinh" },
    { employeeIdx: 4, degreeName: "Cu nhan Su pham Tin hoc", school: "Dai hoc Can Tho" },
  ];

  for (const deg of degreeData) {
    const employeeId = employeeIds[deg.employeeIdx];
    if (!employeeId) continue;
    const { employeeIdx, ...data } = deg;
    await db
      .insert(employeeDegrees)
      .values({ ...data, employeeId })
      .onConflictDoNothing();
  }
  console.log(`  ${degreeData.length} degrees seeded`);

  // ── Seed certifications ────────────────────────────────────────────────
  console.log("Seeding employee certifications...");
  const certData = [
    {
      employeeIdx: 0,
      certName: "IELTS 7.5",
      issuedBy: "British Council",
      issuedOn: "2020-06-15",
      expiresOn: "2022-06-15",
    },
    {
      employeeIdx: 0,
      certName: "AWS Solutions Architect Associate",
      issuedBy: "Amazon Web Services",
      issuedOn: "2023-01-10",
      expiresOn: "2026-01-10",
    },
    {
      employeeIdx: 0,
      certName: "Chung chi Su pham Dai hoc",
      issuedBy: "Bo Giao duc va Dao tao",
      issuedOn: "2010-08-20",
    },
    {
      employeeIdx: 1,
      certName: "TOEIC 850",
      issuedBy: "ETS",
      issuedOn: "2019-03-20",
      expiresOn: "2021-03-20",
    },
    {
      employeeIdx: 1,
      certName: "Chung chi Quan tri Nhan su SHRM-CP",
      issuedBy: "SHRM",
      issuedOn: "2021-09-01",
      expiresOn: "2024-09-01",
    },
    {
      employeeIdx: 2,
      certName: "Chung chi Ke toan truong",
      issuedBy: "Bo Tai chinh",
      issuedOn: "2017-05-10",
    },
    {
      employeeIdx: 2,
      certName: "TOEIC 650",
      issuedBy: "ETS",
      issuedOn: "2018-11-15",
      expiresOn: "2020-11-15",
    },
    {
      employeeIdx: 3,
      certName: "IELTS 6.5",
      issuedBy: "IDP Education",
      issuedOn: "2021-08-10",
      expiresOn: "2023-08-10",
    },
    {
      employeeIdx: 3,
      certName: "Chung chi Su pham Dai hoc",
      issuedBy: "Bo Giao duc va Dao tao",
      issuedOn: "2020-06-15",
    },
    {
      employeeIdx: 3,
      certName: "Google Cloud Professional Data Engineer",
      issuedBy: "Google",
      issuedOn: "2024-03-01",
      expiresOn: "2026-03-01",
    },
    {
      employeeIdx: 4,
      certName: "TOEIC 550",
      issuedBy: "ETS",
      issuedOn: "2020-04-20",
      expiresOn: "2022-04-20",
    },
    {
      employeeIdx: 4,
      certName: "Chung chi Tin hoc MOS",
      issuedBy: "Microsoft",
      issuedOn: "2019-12-01",
    },
  ];

  for (const cert of certData) {
    const employeeId = employeeIds[cert.employeeIdx];
    if (!employeeId) continue;
    const { employeeIdx, ...data } = cert;
    await db
      .insert(employeeCertifications)
      .values({ ...data, employeeId })
      .onConflictDoNothing();
  }
  console.log(`  ${certData.length} certifications seeded`);

  // ── Seed employment contracts ──────────────────────────────────────────
  console.log("Seeding employment contracts...");

  // Contract type lookups
  const ctThuViec = await findContractType("Hợp đồng thử việc");
  const ct1Nam = await findContractType("Hợp đồng xác định thời hạn (1 năm)");
  const ct3Nam = await findContractType("Hợp đồng xác định thời hạn (3 năm)");
  const ctKoXD = await findContractType("Hợp đồng không xác định thời hạn");

  if (!ctThuViec && !ct1Nam && !ct3Nam && !ctKoXD) {
    console.log("  No contract types found — skipping contracts (run config seed first)");
  } else {
    const contractData = [
      // Employee 0 - Nguyen Van An: had trial → 3 year → indefinite
      {
        employeeIdx: 0,
        contractTypeId: ctThuViec,
        contractNo: "HD-TV-2015-001",
        signedOn: "2015-09-01",
        effectiveFrom: "2015-09-01",
        effectiveTo: "2016-02-28",
        status: "expired" as const,
      },
      {
        employeeIdx: 0,
        contractTypeId: ct3Nam,
        contractNo: "HD-XDTH-2016-001",
        signedOn: "2016-03-01",
        effectiveFrom: "2016-03-01",
        effectiveTo: "2019-02-28",
        status: "expired" as const,
      },
      {
        employeeIdx: 0,
        contractTypeId: ctKoXD,
        contractNo: "HD-KXDTH-2019-001",
        signedOn: "2019-03-01",
        effectiveFrom: "2019-03-01",
        effectiveTo: "2049-03-01",
        status: "valid" as const,
      },
      // Employee 1 - Tran Thi Binh: trial → 1 year → indefinite
      {
        employeeIdx: 1,
        contractTypeId: ctThuViec,
        contractNo: "HD-TV-2020-002",
        signedOn: "2020-01-15",
        effectiveFrom: "2020-01-15",
        effectiveTo: "2020-07-14",
        status: "expired" as const,
      },
      {
        employeeIdx: 1,
        contractTypeId: ct1Nam,
        contractNo: "HD-XDTH-2020-002",
        signedOn: "2020-07-15",
        effectiveFrom: "2020-07-15",
        effectiveTo: "2021-07-14",
        status: "expired" as const,
      },
      {
        employeeIdx: 1,
        contractTypeId: ctKoXD,
        contractNo: "HD-KXDTH-2021-002",
        signedOn: "2021-07-15",
        effectiveFrom: "2021-07-15",
        effectiveTo: "2051-07-15",
        status: "valid" as const,
      },
      // Employee 2 - Le Hoang Cuong: trial → 3 year (current)
      {
        employeeIdx: 2,
        contractTypeId: ctThuViec,
        contractNo: "HD-TV-2018-003",
        signedOn: "2018-07-01",
        effectiveFrom: "2018-07-01",
        effectiveTo: "2018-12-31",
        status: "expired" as const,
      },
      {
        employeeIdx: 2,
        contractTypeId: ct3Nam,
        contractNo: "HD-XDTH-2023-003",
        signedOn: "2023-01-01",
        effectiveFrom: "2023-01-01",
        effectiveTo: "2025-12-31",
        status: "valid" as const,
      },
      // Employee 3 - Pham Minh Duc: trial → 1 year (current)
      {
        employeeIdx: 3,
        contractTypeId: ctThuViec,
        contractNo: "HD-TV-2023-004",
        signedOn: "2023-09-01",
        effectiveFrom: "2023-09-01",
        effectiveTo: "2024-02-28",
        status: "expired" as const,
      },
      {
        employeeIdx: 3,
        contractTypeId: ct1Nam,
        contractNo: "HD-XDTH-2024-004",
        signedOn: "2024-03-01",
        effectiveFrom: "2024-03-01",
        effectiveTo: "2025-02-28",
        status: "valid" as const,
      },
      // Employee 4 - Vo Thi Em: trial only (expired, no renewal)
      {
        employeeIdx: 4,
        contractTypeId: ctThuViec,
        contractNo: "HD-TV-2021-005",
        signedOn: "2021-01-10",
        effectiveFrom: "2021-01-10",
        effectiveTo: "2021-07-09",
        status: "expired" as const,
      },
    ];

    let contractCount = 0;
    for (const c of contractData) {
      const employeeId = employeeIds[c.employeeIdx];
      if (!employeeId || !c.contractTypeId) continue;
      // Need orgUnitId — use the employee's current org unit
      const empOrgUnitId = orgUnitIds[c.employeeIdx];
      if (!empOrgUnitId) continue;

      await db
        .insert(employmentContracts)
        .values({
          employeeId,
          contractTypeId: c.contractTypeId,
          contractNo: c.contractNo,
          signedOn: c.signedOn,
          effectiveFrom: c.effectiveFrom,
          effectiveTo: c.effectiveTo,
          orgUnitId: empOrgUnitId,
          status: c.status,
          contentHtml: `<p>Hop dong lao dong so ${c.contractNo} giua Truong Dai hoc Thuy loi va ${sampleEmployees[c.employeeIdx]?.fullName ?? "nhan vien"}.</p>`,
        })
        .onConflictDoNothing();
      contractCount++;
    }
    console.log(`  ${contractCount} employment contracts seeded`);
  }

  // ── Seed employee assignments ──────────────────────────────────────────
  console.log("Seeding employee assignments...");
  const assignmentData = [
    // Employee 0 - started at Khoa CNTT, then moved to TT_CNTT
    {
      employeeIdx: 0,
      orgCode: "K_CNTT",
      positionTitle: "Giang vien",
      eventType: "APPOINT",
      startedOn: "2015-09-01",
      endedOn: "2019-12-31",
      note: "Bo nhiem giang vien Khoa CNTT",
    },
    {
      employeeIdx: 0,
      orgCode: "TT_CNTT",
      positionTitle: "Pho Giam doc Trung tam CNTT",
      eventType: "APPOINT",
      startedOn: "2020-01-01",
      note: "Bo nhiem PGD Trung tam CNTT",
    },
    // Employee 1 - always at P_TCHC
    {
      employeeIdx: 1,
      orgCode: "P_TCHC",
      positionTitle: "Chuyen vien",
      eventType: "APPOINT",
      startedOn: "2020-01-15",
      endedOn: "2022-06-30",
      note: "Bo nhiem chuyen vien",
    },
    {
      employeeIdx: 1,
      orgCode: "P_TCHC",
      positionTitle: "Chuyen vien chinh",
      eventType: "APPOINT",
      startedOn: "2022-07-01",
      note: "Nang bac chuyen vien chinh",
    },
    // Employee 2 - P_KHTC
    {
      employeeIdx: 2,
      orgCode: "P_KHTC",
      positionTitle: "Chuyen vien ke toan",
      eventType: "APPOINT",
      startedOn: "2018-07-01",
      note: "Bo nhiem chuyen vien Phong KHTC",
    },
    // Employee 3 - K_CNTT → BM_CNPM
    {
      employeeIdx: 3,
      orgCode: "K_CNTT",
      positionTitle: "Giang vien",
      eventType: "APPOINT",
      startedOn: "2023-09-01",
      note: "Bo nhiem giang vien Khoa CNTT",
    },
    // Employee 4 - K_CNTT
    {
      employeeIdx: 4,
      orgCode: "K_CNTT",
      positionTitle: "Tro giang",
      eventType: "APPOINT",
      startedOn: "2021-01-10",
      note: "Bo nhiem tro giang Khoa CNTT",
    },
  ];

  for (const a of assignmentData) {
    const employeeId = employeeIds[a.employeeIdx];
    if (!employeeId) continue;
    const orgId = await findOrgUnit(a.orgCode);
    if (!orgId) {
      console.log(`  Skipping assignment — org unit ${a.orgCode} not found`);
      continue;
    }
    const { employeeIdx, orgCode, ...data } = a;
    await db
      .insert(employeeAssignments)
      .values({ ...data, employeeId, orgUnitId: orgId })
      .onConflictDoNothing();
  }
  console.log(`  ${assignmentData.length} assignments seeded`);

  console.log("\nEmployee seed completed!");
  process.exit(0);
}

seedEmployees().catch((err) => {
  console.error("Failed to seed employees:", err);
  process.exit(1);
});
