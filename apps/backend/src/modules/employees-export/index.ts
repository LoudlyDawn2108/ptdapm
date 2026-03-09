import { idParamSchema } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { BadRequestError } from "../../common/utils/errors";
import type { Employee } from "../../db/schema";
import * as employeeService from "../employees/employee.service";

const exportListQuerySchema = z.object({
  format: z.string().optional(),
  search: z.string().optional(),
  orgUnitId: z.string().optional(),
  workStatus: z.string().optional(),
  contractStatus: z.string().optional(),
});

const exportDetailQuerySchema = z.object({
  format: z.string().optional(),
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
  return [headerRow, ...dataRows].join("\n");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().split("T")[0] ?? "";
  return String(value);
}

function ensureCsvFormat(format?: string) {
  if (format !== "csv") {
    throw new BadRequestError("Định dạng không hợp lệ");
  }
}

async function listAllEmployees(params: {
  search?: string;
  orgUnitId?: string;
  workStatus?: string;
  contractStatus?: string;
}): Promise<Employee[]> {
  const pageSize = 500;
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
    );
    items.push(...response.items);
    total = response.total;
    page += 1;
  } while (items.length < total);

  return items;
}

function sectionCSV(title: string, headers: string[], rows: string[][]): string {
  return `${escapeCSV(title)}\n${toCSV(headers, rows)}`;
}

export const employeeExportRoutes = new Elysia({ prefix: "/api/employees" })
  .use(authPlugin)
  .get(
    "/export",
    async ({ query }) => {
      ensureCsvFormat(query.format);

      const employees = await listAllEmployees({
        search: query.search,
        orgUnitId: query.orgUnitId,
        workStatus: query.workStatus,
        contractStatus: query.contractStatus,
      });

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

      const csv = toCSV(headers, rows);

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="employees.csv"',
        },
      });
    },
    { auth: true, query: exportListQuerySchema },
  )
  .get(
    "/:employeeId/export",
    async ({ params, query }) => {
      ensureCsvFormat(query.format);

      const aggregate = await employeeService.getAggregateById(params.employeeId);
      const employee = aggregate.employee;

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

      const familyMemberHeaders = ["relation", "fullName", "dob", "phone", "isDependent", "note"];
      const familyMemberRows = aggregate.familyMembers.map((member) => [
        formatValue(member.relation),
        formatValue(member.fullName),
        formatValue(member.dob),
        formatValue(member.phone),
        formatValue(member.isDependent),
        formatValue(member.note),
      ]);

      const bankAccountHeaders = ["bankName", "accountNo", "isPrimary"];
      const bankAccountRows = aggregate.bankAccounts.map((account) => [
        formatValue(account.bankName),
        formatValue(account.accountNo),
        formatValue(account.isPrimary),
      ]);

      const previousJobHeaders = ["workplace", "startedOn", "endedOn", "note"];
      const previousJobRows = aggregate.previousJobs.map((job) => [
        formatValue(job.workplace),
        formatValue(job.startedOn),
        formatValue(job.endedOn),
        formatValue(job.note),
      ]);

      const partyMembershipHeaders = ["organizationType", "joinedOn", "details"];
      const partyMembershipRows = aggregate.partyMemberships.map((membership) => [
        formatValue(membership.organizationType),
        formatValue(membership.joinedOn),
        formatValue(membership.details),
      ]);

      const allowanceHeaders = ["allowanceTypeId", "amount", "note"];
      const allowanceRows = aggregate.allowances.map((allowance) => [
        formatValue(allowance.allowanceTypeId),
        formatValue(allowance.amount),
        formatValue(allowance.note),
      ]);

      const csv = [
        sectionCSV("Employee", employeeHeaders, employeeRows),
        sectionCSV("Family Members", familyMemberHeaders, familyMemberRows),
        sectionCSV("Bank Accounts", bankAccountHeaders, bankAccountRows),
        sectionCSV("Previous Jobs", previousJobHeaders, previousJobRows),
        sectionCSV("Party Memberships", partyMembershipHeaders, partyMembershipRows),
        sectionCSV("Allowances", allowanceHeaders, allowanceRows),
      ].join("\n\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="employee-${params.employeeId}.csv"`,
        },
      });
    },
    { auth: true, params: z.object({ employeeId: z.string().uuid() }), query: exportDetailQuerySchema },
  );
