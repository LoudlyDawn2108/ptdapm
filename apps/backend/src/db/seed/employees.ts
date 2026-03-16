import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  allowanceTypes,
  employeeAllowances,
  employeeBankAccounts,
  employeeFamilyMembers,
  employeePartyMemberships,
  employeePreviousJobs,
  employees,
} from "../schema";

const sampleEmployees = [
  {
    fullName: "Nguyen Van An",
    dob: "1985-03-15",
    gender: "NAM",
    nationalId: "001085012345",
    hometown: "Ha Noi",
    address: "12 Pho Hue, Hai Ba Trung, Ha Noi",
    taxCode: "MST0001",
    socialInsuranceNo: "BHXH0001",
    healthInsuranceNo: "BHYT0001",
    email: "nguyen.van.an@tlu.edu.vn",
    phone: "0901000001",
    educationLevel: "DAI_HOC",
    academicRank: "PGS",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
  },
  {
    fullName: "Tran Thi Binh",
    dob: "1990-07-22",
    gender: "NU",
    nationalId: "001090056789",
    hometown: "Hai Phong",
    address: "45 Le Loi, Ngo Quyen, Hai Phong",
    taxCode: "MST0002",
    socialInsuranceNo: "BHXH0002",
    healthInsuranceNo: "BHYT0002",
    email: "tran.thi.binh@tlu.edu.vn",
    phone: "0901000002",
    educationLevel: "THAC_SI",
    academicRank: "GS",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
  },
  {
    fullName: "Le Hoang Cuong",
    dob: "1988-11-05",
    gender: "NAM",
    nationalId: "001088098765",
    hometown: "Da Nang",
    address: "78 Nguyen Hue, Hai Chau, Da Nang",
    email: "le.hoang.cuong@tlu.edu.vn",
    phone: "0901000003",
    educationLevel: "DAI_HOC",
    workStatus: "working" as const,
    contractStatus: "valid" as const,
  },
  {
    fullName: "Pham Minh Duc",
    dob: "1992-01-30",
    gender: "NAM",
    nationalId: "001092034567",
    hometown: "Nghe An",
    address: "23 Tran Phu, Vinh, Nghe An",
    email: "pham.minh.duc@tlu.edu.vn",
    phone: "0901000004",
    educationLevel: "THAC_SI",
    workStatus: "pending" as const,
    contractStatus: "none" as const,
  },
  {
    fullName: "Vo Thi Em",
    dob: "1995-06-18",
    gender: "NU",
    nationalId: "001095067890",
    hometown: "Can Tho",
    address: "56 Nguyen Trai, Ninh Kieu, Can Tho",
    email: "vo.thi.em@tlu.edu.vn",
    phone: "0901000005",
    educationLevel: "DAI_HOC",
    workStatus: "working" as const,
    contractStatus: "expired" as const,
  },
];

async function seedEmployees() {
  console.log("Seeding employees...");
  let created = 0;
  let skipped = 0;
  const employeeIds: string[] = [];

  for (const emp of sampleEmployees) {
    const existing = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.nationalId, emp.nationalId))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  Skipping ${emp.fullName} (nationalId ${emp.nationalId} already exists)`);
      employeeIds.push((existing[0] as { id: string }).id);
      skipped++;
      continue;
    }

    const [inserted] = await db.insert(employees).values(emp).returning({ id: employees.id });
    if (!inserted) {
      console.error(`  Failed to insert ${emp.fullName}`);
      continue;
    }
    employeeIds.push(inserted.id);
    console.log(`  Created ${emp.fullName}`);
    created++;
  }

  console.log(`\n${created} employees created, ${skipped} skipped\n`);

  // --- Seed family members ---
  console.log("Seeding family members...");
  const familyData = [
    {
      employeeIdx: 0,
      relation: "VO_CHONG",
      fullName: "Le Thi Hoa",
    },
    {
      employeeIdx: 0,
      relation: "CON",
      fullName: "Nguyen Thi Mai",
    },
    {
      employeeIdx: 0,
      relation: "CON",
      fullName: "Nguyen Van Bao",
    },
    {
      employeeIdx: 1,
      relation: "CHA",
      fullName: "Tran Van Hung",
    },
    {
      employeeIdx: 1,
      relation: "ME",
      fullName: "Nguyen Thi Lan",
    },
    {
      employeeIdx: 2,
      relation: "VO_CHONG",
      fullName: "Pham Thi Dao",
    },
    {
      employeeIdx: 3,
      relation: "CHA",
      fullName: "Pham Van Tai",
    },
    {
      employeeIdx: 4,
      relation: "NGUOI_PHU_THUOC",
      fullName: "Vo Van Lam",
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

  // --- Seed bank accounts ---
  console.log("Seeding bank accounts...");
  const bankData = [
    { employeeIdx: 0, bankName: "Techcombank", accountNo: "19001234567890" },
    { employeeIdx: 0, bankName: "Vietcombank", accountNo: "00112233445566" },
    { employeeIdx: 1, bankName: "BIDV", accountNo: "31110000123456" },
    { employeeIdx: 2, bankName: "VPBank", accountNo: "12345678901234" },
    { employeeIdx: 3, bankName: "Techcombank", accountNo: "19009876543210" },
    { employeeIdx: 4, bankName: "Agribank", accountNo: "56789012345678" },
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

  // --- Seed previous jobs ---
  console.log("Seeding previous jobs...");
  const jobData = [
    {
      employeeIdx: 0,
      workplace: "Dai hoc Bach Khoa Ha Noi",
      startedOn: "2010-09-01",
      endedOn: "2015-08-31",
    },
    {
      employeeIdx: 0,
      workplace: "Cong ty FPT Software",
      startedOn: "2008-06-01",
      endedOn: "2010-08-31",
    },
    {
      employeeIdx: 1,
      workplace: "Vien Khoa hoc Cong nghe",
      startedOn: "2015-01-01",
      endedOn: "2019-12-31",
    },
    {
      employeeIdx: 2,
      workplace: "Cong ty Samsung Vietnam",
      startedOn: "2012-03-01",
      endedOn: "2018-06-30",
    },
    {
      employeeIdx: 4,
      workplace: "Truong THPT Nguyen Hue",
      startedOn: "2017-09-01",
      endedOn: "2020-06-30",
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

  // --- Seed party memberships ---
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
      details: "Ket nap Dang vien",
    },
    {
      employeeIdx: 2,
      organizationType: "DOAN",
      joinedOn: "2006-03-26",
      details: "Gia nhap Doan thanh nien",
    },
    { employeeIdx: 3, organizationType: "DOAN", joinedOn: "2010-03-26", details: "Gia nhap Doan" },
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

  // --- Seed allowances (needs allowance_types to exist) ---
  console.log("Seeding employee allowances...");
  const existingTypes = await db.select().from(allowanceTypes).limit(5);

  if (existingTypes.length === 0) {
    console.log(
      "  No allowance types found — skipping employee allowances (run config seed first)",
    );
  } else {
    const allowanceData = [
      { employeeIdx: 0, typeIdx: 0, amount: "1500000", note: "Phu cap an trua" },
      {
        employeeIdx: 0,
        typeIdx: existingTypes.length > 1 ? 1 : 0,
        amount: "800000",
        note: "Phu cap di lai",
      },
      { employeeIdx: 1, typeIdx: 0, amount: "2000000", note: "Phu cap chuc vu" },
      { employeeIdx: 2, typeIdx: 0, amount: "1000000" },
      { employeeIdx: 4, typeIdx: 0, amount: "500000", note: "Phu cap co ban" },
    ];

    let allowanceCount = 0;
    for (const al of allowanceData) {
      const employeeId = employeeIds[al.employeeIdx];
      const allowanceType = existingTypes[al.typeIdx];
      if (!employeeId || !allowanceType) continue;

      await db
        .insert(employeeAllowances)
        .values({
          employeeId,
          allowanceTypeId: allowanceType.id,
          amount: al.amount,
          note: al.note,
        })
        .onConflictDoNothing();
      allowanceCount++;
    }
    console.log(`  ${allowanceCount} employee allowances seeded`);
  }

  console.log("\nEmployee seed completed!");
  process.exit(0);
}

seedEmployees().catch((err) => {
  console.error("Failed to seed employees:", err);
  process.exit(1);
});
