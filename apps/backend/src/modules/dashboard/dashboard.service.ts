import { count, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { employees, orgUnits } from "../../db/schema";

export async function getStatistics() {
  // Total employees
  const [totalResult] = await db.select({ value: count() }).from(employees);
  const totalEmployees = totalResult?.value ?? 0;

  // By work status
  const byWorkStatus = await db
    .select({
      status: employees.workStatus,
      count: count(),
    })
    .from(employees)
    .groupBy(employees.workStatus);

  // By contract status
  const byContractStatus = await db
    .select({
      status: employees.contractStatus,
      count: count(),
    })
    .from(employees)
    .groupBy(employees.contractStatus);

  // By org unit (top 20)
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

  // By gender
  const byGender = await db
    .select({
      gender: employees.gender,
      count: count(),
    })
    .from(employees)
    .groupBy(employees.gender);

  // By education level
  const byEducationLevel = await db
    .select({
      level: employees.educationLevel,
      count: count(),
    })
    .from(employees)
    .where(sql`${employees.educationLevel} IS NOT NULL`)
    .groupBy(employees.educationLevel);

  // By academic rank
  const byAcademicRank = await db
    .select({
      rank: employees.academicRank,
      count: count(),
    })
    .from(employees)
    .where(sql`${employees.academicRank} IS NOT NULL`)
    .groupBy(employees.academicRank);

  // Org unit stats
  const [totalOrgUnits] = await db
    .select({ value: count() })
    .from(orgUnits)
    .where(eq(orgUnits.status, "active"));

  return {
    totalEmployees,
    totalOrgUnits: totalOrgUnits?.value ?? 0,
    byWorkStatus,
    byContractStatus,
    byOrgUnit,
    byGender,
    byEducationLevel,
    byAcademicRank,
  };
}
