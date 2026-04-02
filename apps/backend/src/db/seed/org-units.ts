import type { OrgUnitTypeCode } from "@hrms/shared";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { campuses, employeeAssignments, employees, orgUnits } from "../schema";

// ──────────────────────────────────────────────────────────────────────────────
// Org unit hierarchy matching Figma design:
//   Trường ĐHTL (root)
//   ├── Ban Giám hiệu (BAN)
//   ├── Phòng Tổ chức Hành chính (PHONG)
//   ├── Phòng Kế hoạch Tài chính (PHONG)
//   ├── Phòng Đào tạo (PHONG)
//   ├── Khoa Công nghệ thông tin (KHOA)
//   │   ├── Bộ môn Công nghệ Phần mềm (BO_MON)
//   │   └── Bộ môn Mạng máy tính (BO_MON)
//   ├── Khoa Kỹ thuật Tài nguyên nước (KHOA)
//   └── Trung tâm CNTT (TRUNG_TAM)
// ──────────────────────────────────────────────────────────────────────────────

type OrgUnitSeed = {
  unitCode: string;
  unitName: string;
  unitType: OrgUnitTypeCode;
  parentCode?: string; // resolved at seed time
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  officeAddress?: string;
};

const orgUnitData: OrgUnitSeed[] = [
  // ── Root ──
  {
    unitCode: "TRUONG",
    unitName: "Trường Đại học Thủy Lợi",
    unitType: "HOI_DONG",
    email: "info@tlu.edu.vn",
    phone: "02438522201",
    website: "https://tlu.edu.vn",
    address: "175 Tây Sơn, Đống Đa, Hà Nội",
    officeAddress: "Tòa nhà A1",
  },
  // ── Level 1: Ban, Phòng, Khoa, Trung tâm ──
  {
    unitCode: "BGH",
    unitName: "Ban Giám hiệu",
    unitType: "BAN",
    parentCode: "TRUONG",
    email: "bangiamhieu@tlu.edu.vn",
    phone: "02438522202",
    officeAddress: "Tòa A1, Tầng 5",
  },
  {
    unitCode: "P_TCHC",
    unitName: "Phòng Tổ chức Hành chính",
    unitType: "PHONG",
    parentCode: "TRUONG",
    email: "tchc@tlu.edu.vn",
    phone: "02438522210",
    officeAddress: "Tòa A1, Tầng 2",
  },
  {
    unitCode: "P_KHTC",
    unitName: "Phòng Kế hoạch Tài chính",
    unitType: "PHONG",
    parentCode: "TRUONG",
    email: "khtc@tlu.edu.vn",
    phone: "02438522211",
    officeAddress: "Tòa A1, Tầng 3",
  },
  {
    unitCode: "P_DT",
    unitName: "Phòng Đào tạo",
    unitType: "PHONG",
    parentCode: "TRUONG",
    email: "daotao@tlu.edu.vn",
    phone: "02438522212",
    officeAddress: "Tòa A1, Tầng 4",
  },
  {
    unitCode: "K_CNTT",
    unitName: "Khoa Công nghệ thông tin",
    unitType: "KHOA",
    parentCode: "TRUONG",
    email: "cntt@tlu.edu.vn",
    phone: "02438522220",
    website: "https://fit.tlu.edu.vn",
    officeAddress: "Tòa A2, Tầng 3",
  },
  {
    unitCode: "K_KTTN",
    unitName: "Khoa Kỹ thuật Tài nguyên nước",
    unitType: "KHOA",
    parentCode: "TRUONG",
    email: "kttn@tlu.edu.vn",
    phone: "02438522230",
    officeAddress: "Tòa A3, Tầng 2",
  },
  {
    unitCode: "TT_CNTT",
    unitName: "Trung tâm Công nghệ thông tin",
    unitType: "TRUNG_TAM",
    parentCode: "TRUONG",
    email: "ttcntt@tlu.edu.vn",
    phone: "02438522240",
    officeAddress: "Tòa A2, Tầng 1",
  },
  // ── Level 2: Bộ môn ──
  {
    unitCode: "BM_CNPM",
    unitName: "Bộ môn Công nghệ Phần mềm",
    unitType: "BO_MON",
    parentCode: "K_CNTT",
    email: "cnpm@tlu.edu.vn",
    officeAddress: "Tòa A2, Tầng 4, Phòng 401",
  },
  {
    unitCode: "BM_MMT",
    unitName: "Bộ môn Mạng máy tính",
    unitType: "BO_MON",
    parentCode: "K_CNTT",
    email: "mmt@tlu.edu.vn",
    officeAddress: "Tòa A2, Tầng 4, Phòng 402",
  },
];

// ── Assignment data: links employees to org units ──
// Employee mapping (from employees.ts):
//   emp 0 (admin) → TT_CNTT  - Phó Giám đốc TT CNTT
//   emp 1 (tccb)  → P_TCHC   - Chuyên viên Phòng TCHC
//   emp 2 (tckt)  → P_KHTC   - Chuyên viên Phòng KHTC
//   emp 3 (employee) → K_CNTT - Giảng viên Khoa CNTT
//   emp 4 (standalone) → K_CNTT - Trợ giảng Khoa CNTT
const assignmentData = [
  {
    nationalId: "001085012345",
    orgCode: "TT_CNTT",
    position: "Phó Giám đốc Trung tâm CNTT",
    startedOn: "2019-03-01",
  },
  {
    nationalId: "001090056789",
    orgCode: "P_TCHC",
    position: "Chuyên viên Phòng TCHC",
    startedOn: "2020-07-15",
  },
  {
    nationalId: "001088098765",
    orgCode: "P_KHTC",
    position: "Chuyên viên Phòng KHTC",
    startedOn: "2018-07-01",
  },
  {
    nationalId: "001092034567",
    orgCode: "K_CNTT",
    position: "Giảng viên Khoa CNTT",
    startedOn: "2020-09-01",
  },
  {
    nationalId: "001095067890",
    orgCode: "K_CNTT",
    position: "Trợ giảng Khoa CNTT",
    startedOn: "2021-01-15",
  },
  {
    nationalId: "001085012345",
    orgCode: "BGH",
    position: "Phó Hiệu trưởng",
    startedOn: "2023-01-01",
  },
  {
    nationalId: "001075011111",
    orgCode: "BGH",
    position: "Hiệu trưởng",
    startedOn: "2026-01-01",
  },
  {
    nationalId: "001078022222",
    orgCode: "BGH",
    position: "Phó hiệu trưởng",
    startedOn: "2026-01-06",
  },
  {
    nationalId: "001093033333",
    orgCode: "BGH",
    position: "Trợ lý",
    startedOn: "2026-01-17",
  },
  {
    nationalId: "001091044444",
    orgCode: "K_CNTT",
    position: "Giảng viên Khoa CNTT",
    startedOn: "2024-09-01",
  },
  {
    nationalId: "001087066666",
    orgCode: "K_KTTN",
    position: "Giảng viên Khoa KTTN",
    startedOn: "2020-09-01",
  },
  {
    nationalId: "001089077777",
    orgCode: "P_DT",
    position: "Chuyên viên Phòng Đào tạo",
    startedOn: "2022-03-01",
  },
  {
    nationalId: "001090088888",
    orgCode: "BM_CNPM",
    position: "Giảng viên BM CNPM",
    startedOn: "2021-09-01",
  },
  {
    nationalId: "001086099999",
    orgCode: "BM_MMT",
    position: "Giảng viên BM Mạng máy tính",
    startedOn: "2019-09-01",
  },
];

async function seedOrgUnits() {
  console.log("Seeding org units...");

  // Get campus
  const [campus] = await db.select({ id: campuses.id }).from(campuses).limit(1);
  if (!campus) {
    console.error("No campus found — run seed:campus first");
    process.exit(1);
  }

  // Build a code → id map for parent resolution
  const codeToId = new Map<string, string>();
  let created = 0;
  let skipped = 0;

  for (const unit of orgUnitData) {
    // Check if already exists
    const [existing] = await db
      .select({ id: orgUnits.id })
      .from(orgUnits)
      .where(eq(orgUnits.unitCode, unit.unitCode))
      .limit(1);

    if (existing) {
      codeToId.set(unit.unitCode, existing.id);
      console.log(`  Skipping ${unit.unitCode} — ${unit.unitName} (already exists)`);
      skipped++;
      continue;
    }

    const parentId = unit.parentCode ? (codeToId.get(unit.parentCode) ?? null) : null;

    const [inserted] = await db
      .insert(orgUnits)
      .values({
        campusId: campus.id,
        unitCode: unit.unitCode,
        unitName: unit.unitName,
        unitType: unit.unitType,
        parentId,
        email: unit.email ?? null,
        phone: unit.phone ?? null,
        website: unit.website ?? null,
        address: unit.address ?? null,
        officeAddress: unit.officeAddress ?? null,
        status: "active",
      })
      .returning();

    if (inserted) {
      codeToId.set(unit.unitCode, inserted.id);
      console.log(`  Created ${unit.unitCode} — ${unit.unitName}`);
      created++;
    }
  }

  console.log(`\n${created} org units created, ${skipped} skipped\n`);

  // ── Seed employee assignments ──────────────────────────────────────────
  console.log("Seeding employee assignments...");
  let assignmentCount = 0;

  for (const a of assignmentData) {
    // Find employee
    const [emp] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.nationalId, a.nationalId))
      .limit(1);
    if (!emp) {
      console.log(`  Skipping assignment — employee ${a.nationalId} not found`);
      continue;
    }

    // Find org unit
    const orgUnitId = codeToId.get(a.orgCode);
    if (!orgUnitId) {
      console.log(`  Skipping assignment — org unit ${a.orgCode} not found`);
      continue;
    }

    // Check if assignment already exists
    const existingAssignments = await db
      .select({ id: employeeAssignments.id })
      .from(employeeAssignments)
      .where(eq(employeeAssignments.employeeId, emp.id))
      .limit(10);

    // Only skip if there's an existing assignment for the same org unit
    const alreadyAssigned = existingAssignments.length > 0;

    // Insert the assignment regardless (could be multiple assignments)
    await db
      .insert(employeeAssignments)
      .values({
        employeeId: emp.id,
        orgUnitId,
        positionTitle: a.position,
        eventType: "APPOINT",
        startedOn: a.startedOn,
      })
      .onConflictDoNothing();

    assignmentCount++;
    console.log(`  Assigned ${a.nationalId} → ${a.orgCode} as ${a.position}`);
  }
  console.log(`  ${assignmentCount} assignments created`);

  // ── Update employees' currentOrgUnitId ─────────────────────────────────
  console.log("\nUpdating employees' currentOrgUnitId...");
  const orgMapping = [
    { nationalId: "001085012345", orgCode: "TT_CNTT" },
    { nationalId: "001090056789", orgCode: "P_TCHC" },
    { nationalId: "001088098765", orgCode: "P_KHTC" },
    { nationalId: "001092034567", orgCode: "K_CNTT" },
    { nationalId: "001095067890", orgCode: "K_CNTT" },
    { nationalId: "001075011111", orgCode: "BGH" },
    { nationalId: "001078022222", orgCode: "BGH" },
    { nationalId: "001093033333", orgCode: "BGH" },
    { nationalId: "001091044444", orgCode: "K_CNTT" },
    { nationalId: "001094055555", orgCode: "P_TCHC" },
    { nationalId: "001087066666", orgCode: "K_KTTN" },
    { nationalId: "001089077777", orgCode: "P_DT" },
    { nationalId: "001090088888", orgCode: "BM_CNPM" },
    { nationalId: "001086099999", orgCode: "BM_MMT" },
  ];

  for (const m of orgMapping) {
    const orgId = codeToId.get(m.orgCode);
    if (!orgId) continue;
    await db
      .update(employees)
      .set({ currentOrgUnitId: orgId, updatedAt: new Date() })
      .where(eq(employees.nationalId, m.nationalId));
    console.log(`  ${m.nationalId} → ${m.orgCode}`);
  }

  console.log("\nOrg unit seeding complete!");
}

seedOrgUnits()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed org units:", err);
    process.exit(1);
  });
