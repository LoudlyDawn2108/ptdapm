import {
  ACADEMIC_RANK_CODES,
  CONTRACT_STATUS_CODES,
  EMPLOYEE_PROFILE_VIEW_ROLES,
  GENDER_CODES,
  WORK_STATUS_CODES,
} from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import type { Employee } from "../../db/schema";
import * as employeeService from "../employees/employee.service";
import {
  exportEmployeePdf,
  exportEmployeesXlsx,
  exportSingleEmployeeXlsx,
} from "./employees-export.service";

const listFormatSchema = z.enum(["csv", "xlsx"]);
const detailFormatSchema = z.enum(["csv", "xlsx", "pdf"]);

const getAggregateById: (
  id: string,
  userRole?: string,
) => ReturnType<typeof employeeService.getAggregateById> = employeeService.getAggregateById;

const exportListQuerySchema = z.object({
  format: listFormatSchema.optional(),
  search: z.string().optional(),
  orgUnitId: z.string().optional(),
  workStatus: z.enum(WORK_STATUS_CODES as [string, ...string[]]).optional(),
  contractStatus: z.enum(CONTRACT_STATUS_CODES as [string, ...string[]]).optional(),
  gender: z.enum(GENDER_CODES as [string, ...string[]]).optional(),
  academicRank: z.enum(ACADEMIC_RANK_CODES as [string, ...string[]]).optional(),
  positionTitle: z.string().optional(),
});

const exportDetailQuerySchema = z.object({
  format: detailFormatSchema.optional(),
});

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCSV(headers: string[], rows: string[][]): string {
  const headerRow = headers.map(escapeCSV).join(",");
  const dataRows = rows.map((row) => row.map(escapeCSV).join(","));
  return [headerRow, ...dataRows].join("\r\n");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().split("T")[0] ?? "";
  return String(value);
}

async function listAllEmployees(params: {
  search?: string;
  orgUnitId?: string;
  workStatus?: string;
  contractStatus?: string;
  gender?: string;
  academicRank?: string;
  positionTitle?: string;
}): Promise<Employee[]> {
  const pageSize = 500;
  const MAX_PAGES = 100;
  let page = 1;
  let total = 0;
  const items: Employee[] = [];

  do {
    const response = await employeeService.list(
      page,
      pageSize,
      params.search,
      params.orgUnitId,
      params.workStatus as Parameters<typeof employeeService.list>[4],
      params.contractStatus as Parameters<typeof employeeService.list>[5],
      params.gender as Parameters<typeof employeeService.list>[6],
      params.academicRank as Parameters<typeof employeeService.list>[7],
      params.positionTitle,
    );
    items.push(...response.items);
    total = response.total;
    page += 1;
  } while (items.length < total && page <= MAX_PAGES);

  return items;
}

function sectionCSV(title: string, headers: string[], rows: string[][]): string {
  return `${escapeCSV(title)}\r\n${toCSV(headers, rows)}`;
}

function responseWithFile(buffer: string | Buffer, filename: string, contentType: string) {
  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function buildEmployeesCsv(employees: Employee[]) {
  const headers = [
    "staffCode",
    "fullName",
    "gender",
    "dob",
    "nationalId",
    "email",
    "phone",
    "workStatus",
    "contractStatus",
  ];

  const rows = employees.map((employee) => [
    formatValue(employee.staffCode),
    formatValue(employee.fullName),
    formatValue(employee.gender),
    formatValue(employee.dob),
    formatValue(employee.nationalId),
    formatValue(employee.email),
    formatValue(employee.phone),
    formatValue(employee.workStatus),
    formatValue(employee.contractStatus),
  ]);

  return toCSV(headers, rows);
}

function buildEmployeeAggregateCsv(
  aggregate: Awaited<ReturnType<typeof employeeService.getAggregateById>>,
) {
  const employee = aggregate.employee;
  const degrees = aggregate.degrees ?? [];
  const certifications = aggregate.certifications ?? [];
  const foreignWorkPermits = aggregate.foreignWorkPermits ?? [];
  const contracts = aggregate.contracts ?? [];
  const evaluations = aggregate.evaluations ?? [];

  const employeeHeaders = [
    "staffCode",
    "fullName",
    "gender",
    "dob",
    "nationalId",
    "email",
    "phone",
    "workStatus",
    "contractStatus",
    "address",
    "hometown",
    "taxCode",
    "socialInsuranceNo",
    "healthInsuranceNo",
    "currentOrgUnitId",
    "currentPositionTitle",
  ];

  const employeeRows = [
    [
      formatValue(employee.staffCode),
      formatValue(employee.fullName),
      formatValue(employee.gender),
      formatValue(employee.dob),
      formatValue(employee.nationalId),
      formatValue(employee.email),
      formatValue(employee.phone),
      formatValue(employee.workStatus),
      formatValue(employee.contractStatus),
      formatValue(employee.address),
      formatValue(employee.hometown),
      formatValue(employee.taxCode),
      formatValue(employee.socialInsuranceNo),
      formatValue(employee.healthInsuranceNo),
      formatValue(employee.currentOrgUnitId),
      formatValue(employee.currentPositionTitle),
    ],
  ];

  const familyMemberHeaders = ["relation", "fullName"];
  const familyMemberRows = aggregate.familyMembers.map((member) => [
    formatValue(member.relation),
    formatValue(member.fullName),
  ]);

  const bankAccountHeaders = ["bankName", "accountNo"];
  const bankAccountRows = aggregate.bankAccounts.map((account) => [
    formatValue(account.bankName),
    formatValue(account.accountNo),
  ]);

  const previousJobHeaders = ["workplace", "startedOn", "endedOn"];
  const previousJobRows = aggregate.previousJobs.map((job) => [
    formatValue(job.workplace),
    formatValue(job.startedOn),
    formatValue(job.endedOn),
  ]);

  const partyMembershipHeaders = ["organizationType", "joinedOn", "details"];
  const partyMembershipRows = aggregate.partyMemberships.map((membership) => [
    formatValue(membership.organizationType),
    formatValue(membership.joinedOn),
    formatValue(membership.details),
  ]);

  const allowanceHeaders = ["allowanceName", "amount", "note"];
  const allowanceRows = aggregate.allowances.map((allowance) => [
    formatValue(allowance.allowanceName),
    formatValue(allowance.amount),
    formatValue(allowance.note),
  ]);

  const degreeHeaders = ["degreeName", "school"];
  const degreeRows = degrees.map((degree) => [
    formatValue(degree.degreeName),
    formatValue(degree.school),
  ]);

  const certificationHeaders = ["certName", "issuedBy"];
  const certificationRows = certifications.map((certification) => [
    formatValue(certification.certName),
    formatValue(certification.issuedBy),
  ]);

  const foreignWorkPermitHeaders = [
    "visaNo",
    "visaExpiresOn",
    "passportNo",
    "passportExpiresOn",
    "workPermitNo",
    "workPermitExpiresOn",
  ];
  const foreignWorkPermitRows = foreignWorkPermits.map((permit) => [
    formatValue(permit.visaNo),
    formatValue(permit.visaExpiresOn),
    formatValue(permit.passportNo),
    formatValue(permit.passportExpiresOn),
    formatValue(permit.workPermitNo),
    formatValue(permit.workPermitExpiresOn),
  ]);

  const contractHeaders = [
    "contractNo",
    "signedOn",
    "effectiveFrom",
    "effectiveTo",
    "orgUnitId",
    "status",
  ];
  const contractRows = contracts.map((contract) => [
    formatValue(contract.contractNo),
    formatValue(contract.signedOn),
    formatValue(contract.effectiveFrom),
    formatValue(contract.effectiveTo),
    formatValue(contract.orgUnitId),
    formatValue(contract.status),
  ]);

  const evaluationHeaders = [
    "evalType",
    "rewardName",
    "disciplineName",
    "decisionOn",
    "decisionNo",
    "isActive",
  ];
  const evaluationRows = evaluations.map((evaluation) => [
    formatValue(evaluation.evalType),
    formatValue(evaluation.rewardName),
    formatValue(evaluation.disciplineName),
    formatValue(evaluation.decisionOn),
    formatValue(evaluation.decisionNo),
    formatValue(evaluation.isActive),
  ]);

  return [
    sectionCSV("Employee", employeeHeaders, employeeRows),
    sectionCSV("Family Members", familyMemberHeaders, familyMemberRows),
    sectionCSV("Bank Accounts", bankAccountHeaders, bankAccountRows),
    sectionCSV("Previous Jobs", previousJobHeaders, previousJobRows),
    sectionCSV("Party Memberships", partyMembershipHeaders, partyMembershipRows),
    sectionCSV("Allowances", allowanceHeaders, allowanceRows),
    sectionCSV("Degrees", degreeHeaders, degreeRows),
    sectionCSV("Certifications", certificationHeaders, certificationRows),
    sectionCSV("Foreign Work Permits", foreignWorkPermitHeaders, foreignWorkPermitRows),
    sectionCSV("Contracts", contractHeaders, contractRows),
    sectionCSV("Evaluations", evaluationHeaders, evaluationRows),
  ].join("\r\n\r\n");
}

export const employeeExportRoutes = new Elysia({ prefix: "/api/employees" })
  .use(authPlugin)
  .get(
    "/export",
    async ({ query, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_VIEW_ROLES);
      const format = query.format ?? "csv";

      const employees = await listAllEmployees({
        search: query.search,
        orgUnitId: query.orgUnitId,
        workStatus: query.workStatus,
        contractStatus: query.contractStatus,
        gender: query.gender,
        academicRank: query.academicRank,
        positionTitle: query.positionTitle,
      });

      if (format === "xlsx") {
        const buffer = await exportEmployeesXlsx(employees);
        return responseWithFile(
          buffer,
          "employees.xlsx",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
      }

      const csv = buildEmployeesCsv(employees);
      return responseWithFile(csv, "employees.csv", "text/csv");
    },
    { auth: true, query: exportListQuerySchema },
  )
  .get(
    "/:employeeId/export",
    async ({ params, query, user }) => {
      requireRole(user.role, ...EMPLOYEE_PROFILE_VIEW_ROLES);
      const format = query.format ?? "csv";

      const aggregate = await getAggregateById(params.employeeId, user.role);

      if (format === "xlsx") {
        const buffer = await exportSingleEmployeeXlsx(aggregate);
        return responseWithFile(
          buffer,
          `employee-${params.employeeId}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
      }

      if (format === "pdf") {
        const buffer = await exportEmployeePdf(aggregate);
        return responseWithFile(buffer, `employee-${params.employeeId}.pdf`, "application/pdf");
      }

      const csv = buildEmployeeAggregateCsv(aggregate);
      return responseWithFile(csv, `employee-${params.employeeId}.csv`, "text/csv");
    },
    {
      auth: true,
      params: z.object({ employeeId: z.string().uuid() }),
      query: exportDetailQuerySchema,
    },
  );
