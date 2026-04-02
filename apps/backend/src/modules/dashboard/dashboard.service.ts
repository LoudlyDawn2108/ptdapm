import { count, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  contractTypes,
  employeeAssignments,
  employeeTerminations,
  employees,
  employmentContracts,
  orgUnits,
  trainingCourses,
  trainingRegistrations,
  trainingResults,
} from "../../db/schema";

export async function getStatistics() {
  // ── 1. Báo cáo tổng quan nhân sự ───────────────────────────────────
  const [totalResult] = await db.select({ value: count() }).from(employees);
  const totalEmployees = totalResult?.value ?? 0;

  const [totalOrgUnitsResult] = await db
    .select({ value: count() })
    .from(orgUnits)
    .where(eq(orgUnits.status, "active"));
  const totalOrgUnits = totalOrgUnitsResult?.value ?? 0;

  const byWorkStatus = await db
    .select({
      status: employees.workStatus,
      count: count(),
    })
    .from(employees)
    .groupBy(employees.workStatus);

  const byGender = await db
    .select({
      gender: employees.gender,
      count: count(),
    })
    .from(employees)
    .groupBy(employees.gender);

  // ── 2. Báo cáo biến động nhân sự ───────────────────────────────────
  const newHiresByMonth = await db
    .select({
      month: sql<string>`to_char(${employees.createdAt}, 'YYYY-MM')`.as("month"),
      count: count(),
    })
    .from(employees)
    .where(sql`${employees.createdAt} >= NOW() - INTERVAL '12 months'`)
    .groupBy(sql`to_char(${employees.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${employees.createdAt}, 'YYYY-MM')`);

  const terminationsByMonth = await db
    .select({
      month: sql<string>`to_char(${employeeTerminations.terminatedOn}::timestamp, 'YYYY-MM')`.as(
        "month",
      ),
      count: count(),
    })
    .from(employeeTerminations)
    .where(sql`${employeeTerminations.terminatedOn}::timestamp >= NOW() - INTERVAL '12 months'`)
    .groupBy(sql`to_char(${employeeTerminations.terminatedOn}::timestamp, 'YYYY-MM')`)
    .orderBy(sql`to_char(${employeeTerminations.terminatedOn}::timestamp, 'YYYY-MM')`);

  const [totalTerminations] = await db.select({ value: count() }).from(employeeTerminations);

  // ── 3. Báo cáo cơ cấu nhân sự theo đơn vị ─────────────────────────
  const byOrgUnit = await db
    .select({
      orgUnitId: employees.currentOrgUnitId,
      orgUnitName: orgUnits.unitName,
      count: count(),
    })
    .from(employees)
    .innerJoin(orgUnits, eq(employees.currentOrgUnitId, orgUnits.id))
    .groupBy(employees.currentOrgUnitId, orgUnits.unitName)
    .orderBy(sql`count(*) desc`)
    .limit(20);

  const orgUnitsByType = await db
    .select({
      unitType: orgUnits.unitType,
      count: count(),
    })
    .from(orgUnits)
    .where(eq(orgUnits.status, "active"))
    .groupBy(orgUnits.unitType);

  // ── 4. Báo cáo cơ cấu nhân sự theo trình độ, học hàm, chức danh ──
  const byEducationLevel = await db
    .select({
      level: employees.educationLevel,
      count: count(),
    })
    .from(employees)
    .where(sql`${employees.educationLevel} IS NOT NULL`)
    .groupBy(employees.educationLevel);

  const byAcademicRank = await db
    .select({
      rank: employees.academicRank,
      count: count(),
    })
    .from(employees)
    .where(sql`${employees.academicRank} IS NOT NULL`)
    .groupBy(employees.academicRank);

  const byAcademicTitle = await db
    .select({
      title: employees.academicTitle,
      count: count(),
    })
    .from(employees)
    .where(sql`${employees.academicTitle} IS NOT NULL`)
    .groupBy(employees.academicTitle);

  // ── 5. Báo cáo bổ nhiệm nhân sự ───────────────────────────────────
  const appointmentsByMonth = await db
    .select({
      month: sql<string>`to_char(${employeeAssignments.startedOn}::timestamp, 'YYYY-MM')`.as(
        "month",
      ),
      count: count(),
    })
    .from(employeeAssignments)
    .where(eq(employeeAssignments.eventType, "APPOINT"))
    .groupBy(sql`to_char(${employeeAssignments.startedOn}::timestamp, 'YYYY-MM')`)
    .orderBy(sql`to_char(${employeeAssignments.startedOn}::timestamp, 'YYYY-MM')`);

  const dismissalsByMonth = await db
    .select({
      month: sql<string>`to_char(${employeeAssignments.startedOn}::timestamp, 'YYYY-MM')`.as(
        "month",
      ),
      count: count(),
    })
    .from(employeeAssignments)
    .where(eq(employeeAssignments.eventType, "DISMISS"))
    .groupBy(sql`to_char(${employeeAssignments.startedOn}::timestamp, 'YYYY-MM')`)
    .orderBy(sql`to_char(${employeeAssignments.startedOn}::timestamp, 'YYYY-MM')`);

  const appointmentsByOrgUnit = await db
    .select({
      orgUnitName: orgUnits.unitName,
      count: count(),
    })
    .from(employeeAssignments)
    .innerJoin(orgUnits, eq(employeeAssignments.orgUnitId, orgUnits.id))
    .where(eq(employeeAssignments.eventType, "APPOINT"))
    .groupBy(orgUnits.unitName)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  // ── 6. Báo cáo đào tạo và phát triển ───────────────────────────────
  const [totalCourses] = await db.select({ value: count() }).from(trainingCourses);

  const trainingByStatus = await db
    .select({
      status: trainingCourses.status,
      count: count(),
    })
    .from(trainingCourses)
    .groupBy(trainingCourses.status);

  const [totalRegistrations] = await db.select({ value: count() }).from(trainingRegistrations);

  const registrationsByStatus = await db
    .select({
      status: trainingRegistrations.participationStatus,
      count: count(),
    })
    .from(trainingRegistrations)
    .groupBy(trainingRegistrations.participationStatus);

  const trainingResultsByStatus = await db
    .select({
      status: trainingResults.resultStatus,
      count: count(),
    })
    .from(trainingResults)
    .groupBy(trainingResults.resultStatus);

  // ── 7. Báo cáo hợp đồng và tình trạng làm việc ────────────────────
  const byContractStatus = await db
    .select({
      status: employees.contractStatus,
      count: count(),
    })
    .from(employees)
    .groupBy(employees.contractStatus);

  const contractsByType = await db
    .select({
      contractTypeName: contractTypes.contractTypeName,
      count: count(),
    })
    .from(employmentContracts)
    .innerJoin(contractTypes, eq(employmentContracts.contractTypeId, contractTypes.id))
    .groupBy(contractTypes.contractTypeName)
    .orderBy(sql`count(*) desc`);

  const contractsByDocStatus = await db
    .select({
      status: employmentContracts.status,
      count: count(),
    })
    .from(employmentContracts)
    .groupBy(employmentContracts.status);

  const [totalContracts] = await db.select({ value: count() }).from(employmentContracts);

  return {
    // 1. Tổng quan
    totalEmployees,
    totalOrgUnits,
    byWorkStatus,
    byGender,
    // 2. Biến động
    newHiresByMonth,
    terminationsByMonth,
    totalTerminations: totalTerminations?.value ?? 0,
    // 3. Cơ cấu theo đơn vị
    byOrgUnit,
    orgUnitsByType,
    // 4. Cơ cấu theo trình độ, học hàm, chức danh
    byEducationLevel,
    byAcademicRank,
    byAcademicTitle,
    // 5. Bổ nhiệm
    appointmentsByMonth,
    dismissalsByMonth,
    appointmentsByOrgUnit,
    // 6. Đào tạo
    totalCourses: totalCourses?.value ?? 0,
    trainingByStatus,
    totalRegistrations: totalRegistrations?.value ?? 0,
    registrationsByStatus,
    trainingResultsByStatus,
    // 7. Hợp đồng & tình trạng làm việc
    byContractStatus,
    contractsByType,
    contractsByDocStatus,
    totalContracts: totalContracts?.value ?? 0,
  };
}
