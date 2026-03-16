import type { ContractStatusCode, WorkStatusCode } from "@hrms/shared";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  numeric,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const employeeStaffCodeSeq = pgSequence("employee_staff_code_seq");
import { allowanceTypes } from "./contracts";
import { files } from "./files";
import { orgUnits } from "./organization";
import { salaryGradeSteps } from "./salary";

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffCode: varchar("staff_code", { length: 30 })
    .notNull()
    .unique()
    .default(sql`nextval('employee_staff_code_seq')::text`),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  dob: date("dob").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  nationalId: varchar("national_id", { length: 20 }).notNull().unique(),
  hometown: text("hometown"),
  address: text("address").notNull(),
  taxCode: varchar("tax_code", { length: 30 }),
  socialInsuranceNo: varchar("social_insurance_no", { length: 30 }),
  healthInsuranceNo: varchar("health_insurance_no", { length: 30 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  isForeigner: boolean("is_foreigner").notNull().default(false),
  educationLevel: varchar("education_level", { length: 50 }),
  trainingLevel: varchar("training_level", { length: 50 }),
  academicRank: varchar("academic_rank", { length: 50 }),
  academicTitle: varchar("academic_title", { length: 50 }),
  workStatus: varchar("work_status", { length: 20 })
    .$type<WorkStatusCode>()
    .notNull()
    .default("pending"),
  contractStatus: varchar("contract_status", { length: 20 })
    .$type<ContractStatusCode>()
    .notNull()
    .default("none"),
  currentOrgUnitId: uuid("current_org_unit_id").references(() => orgUnits.id, {
    onDelete: "set null",
  }),
  currentPositionTitle: varchar("current_position_title", { length: 255 }),
  salaryGradeStepId: uuid("salary_grade_step_id").references(() => salaryGradeSteps.id, {
    onDelete: "set null",
  }),
  portraitFileId: uuid("portrait_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  terminatedOn: date("terminated_on"),
  terminationReason: text("termination_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

export const employeeTerminations = pgTable("employee_terminations", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  terminatedOn: date("terminated_on").notNull(),
  reason: text("reason").notNull(),
  isAuto: boolean("is_auto").notNull().default(false),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeTermination = typeof employeeTerminations.$inferSelect;
export type NewEmployeeTermination = typeof employeeTerminations.$inferInsert;

export const employeeAssignments = pgTable("employee_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  orgUnitId: uuid("org_unit_id")
    .notNull()
    .references(() => orgUnits.id, { onDelete: "restrict" }),
  positionTitle: varchar("position_title", { length: 255 }),
  eventType: varchar("event_type", { length: 20 }).notNull().default("APPOINT"),
  startedOn: date("started_on").notNull(),
  endedOn: date("ended_on"),
  note: text("note"),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeAssignment = typeof employeeAssignments.$inferSelect;
export type NewEmployeeAssignment = typeof employeeAssignments.$inferInsert;

export const employeeFamilyMembers = pgTable("employee_family_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  relation: varchar("relation", { length: 30 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  dob: date("dob"),
  phone: varchar("phone", { length: 30 }),
  note: text("note"),
  isDependent: boolean("is_dependent").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeFamilyMember = typeof employeeFamilyMembers.$inferSelect;
export type NewEmployeeFamilyMember = typeof employeeFamilyMembers.$inferInsert;

export const employeeBankAccounts = pgTable("employee_bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  accountNo: varchar("account_no", { length: 50 }).notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeBankAccount = typeof employeeBankAccounts.$inferSelect;
export type NewEmployeeBankAccount = typeof employeeBankAccounts.$inferInsert;

export const employeePreviousJobs = pgTable("employee_previous_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  workplace: varchar("workplace", { length: 255 }).notNull(),
  startedOn: date("started_on"),
  endedOn: date("ended_on"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeePreviousJob = typeof employeePreviousJobs.$inferSelect;
export type NewEmployeePreviousJob = typeof employeePreviousJobs.$inferInsert;

export const employeePartyMemberships = pgTable("employee_party_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  organizationType: varchar("organization_type", { length: 10 }).notNull(),
  joinedOn: date("joined_on"),
  details: text("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeePartyMembership = typeof employeePartyMemberships.$inferSelect;
export type NewEmployeePartyMembership = typeof employeePartyMemberships.$inferInsert;

/**
 * Employee degrees table.
 *
 * NOTE: `major`, `graduationYear`, and `classification` columns were intentionally omitted
 * from this schema. The current design stores only the degree name, school, and an optional
 * file attachment. If richer degree metadata is needed in the future, these columns can be
 * added via a new migration. Current data is test-only — no production data migration required.
 */
export const employeeDegrees = pgTable("employee_degrees", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  degreeName: varchar("degree_name", { length: 255 }).notNull(),
  school: varchar("school", { length: 255 }).notNull(),
  degreeFileId: uuid("degree_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeDegree = typeof employeeDegrees.$inferSelect;
export type NewEmployeeDegree = typeof employeeDegrees.$inferInsert;

/**
 * Employee certifications table.
 *
 * NOTE: `issuedOn` and `expiresOn` date columns were intentionally omitted from this schema.
 * The current design stores only the cert name, issuer, and an optional file attachment.
 * If date tracking is needed in the future, these columns can be added via a new migration.
 * Current data is test-only — no production data migration required.
 */
export const employeeCertifications = pgTable("employee_certifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  certName: varchar("cert_name", { length: 255 }).notNull(),
  issuedBy: varchar("issued_by", { length: 255 }),
  certFileId: uuid("cert_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeCertification = typeof employeeCertifications.$inferSelect;
export type NewEmployeeCertification = typeof employeeCertifications.$inferInsert;

export const employeeForeignWorkPermits = pgTable("employee_foreign_work_permits", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  visaNo: varchar("visa_no", { length: 50 }),
  visaExpiresOn: date("visa_expires_on"),
  passportNo: varchar("passport_no", { length: 50 }),
  passportExpiresOn: date("passport_expires_on"),
  workPermitNo: varchar("work_permit_no", { length: 50 }),
  workPermitExpiresOn: date("work_permit_expires_on"),
  workPermitFileId: uuid("work_permit_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeForeignWorkPermit = typeof employeeForeignWorkPermits.$inferSelect;
export type NewEmployeeForeignWorkPermit = typeof employeeForeignWorkPermits.$inferInsert;

export const employeeAllowances = pgTable("employee_allowances", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  allowanceTypeId: uuid("allowance_type_id")
    .notNull()
    .references(() => allowanceTypes.id, { onDelete: "restrict" }),
  amount: numeric("amount", { precision: 14, scale: 2 }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeAllowance = typeof employeeAllowances.$inferSelect;
export type NewEmployeeAllowance = typeof employeeAllowances.$inferInsert;

export const employeesRelations = relations(employees, ({ one, many }) => ({
  orgUnit: one(orgUnits, {
    fields: [employees.currentOrgUnitId],
    references: [orgUnits.id],
  }),
  salaryGradeStep: one(salaryGradeSteps, {
    fields: [employees.salaryGradeStepId],
    references: [salaryGradeSteps.id],
  }),
  portraitFile: one(files, {
    fields: [employees.portraitFileId],
    references: [files.id],
  }),
  terminations: many(employeeTerminations),
  assignments: many(employeeAssignments),
  familyMembers: many(employeeFamilyMembers),
  bankAccounts: many(employeeBankAccounts),
  previousJobs: many(employeePreviousJobs),
  partyMemberships: many(employeePartyMemberships),
  degrees: many(employeeDegrees),
  certifications: many(employeeCertifications),
  foreignWorkPermits: many(employeeForeignWorkPermits),
  allowances: many(employeeAllowances),
}));

export const employeeTerminationsRelations = relations(employeeTerminations, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeTerminations.employeeId],
    references: [employees.id],
  }),
}));

export const employeeAssignmentsRelations = relations(employeeAssignments, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeAssignments.employeeId],
    references: [employees.id],
  }),
  orgUnit: one(orgUnits, {
    fields: [employeeAssignments.orgUnitId],
    references: [orgUnits.id],
  }),
}));

export const employeeFamilyMembersRelations = relations(employeeFamilyMembers, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeFamilyMembers.employeeId],
    references: [employees.id],
  }),
}));

export const employeeBankAccountsRelations = relations(employeeBankAccounts, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeBankAccounts.employeeId],
    references: [employees.id],
  }),
}));

export const employeePreviousJobsRelations = relations(employeePreviousJobs, ({ one }) => ({
  employee: one(employees, {
    fields: [employeePreviousJobs.employeeId],
    references: [employees.id],
  }),
}));

export const employeePartyMembershipsRelations = relations(employeePartyMemberships, ({ one }) => ({
  employee: one(employees, {
    fields: [employeePartyMemberships.employeeId],
    references: [employees.id],
  }),
}));

export const employeeDegreesRelations = relations(employeeDegrees, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeDegrees.employeeId],
    references: [employees.id],
  }),
  degreeFile: one(files, {
    fields: [employeeDegrees.degreeFileId],
    references: [files.id],
  }),
}));

export const employeeCertificationsRelations = relations(employeeCertifications, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeCertifications.employeeId],
    references: [employees.id],
  }),
  certFile: one(files, {
    fields: [employeeCertifications.certFileId],
    references: [files.id],
  }),
}));

export const employeeForeignWorkPermitsRelations = relations(
  employeeForeignWorkPermits,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeForeignWorkPermits.employeeId],
      references: [employees.id],
    }),
    workPermitFile: one(files, {
      fields: [employeeForeignWorkPermits.workPermitFileId],
      references: [files.id],
    }),
  }),
);

export const employeeAllowancesRelations = relations(employeeAllowances, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeAllowances.employeeId],
    references: [employees.id],
  }),
  allowanceType: one(allowanceTypes, {
    fields: [employeeAllowances.allowanceTypeId],
    references: [allowanceTypes.id],
  }),
}));
