import type { CatalogStatusCode, ContractDocStatusCode } from "@hrms/shared";
import {
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
// Circular import with employees.ts is safe — Drizzle's .references() callback is lazy-evaluated
import { employees } from "./employees";
import { files } from "./files";
import { orgUnits } from "./organization";

export const allowanceTypes = pgTable("allowance_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  allowanceName: varchar("allowance_name", { length: 200 }).notNull().unique(),
  defaultAmount: numeric("default_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  description: text("description"),
  calcMethod: text("calc_method"),
  status: varchar("status", { length: 20 }).$type<CatalogStatusCode>().notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type AllowanceType = typeof allowanceTypes.$inferSelect;
export type NewAllowanceType = typeof allowanceTypes.$inferInsert;

export const contractTypes = pgTable("contract_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractTypeName: varchar("contract_type_name", { length: 255 }).notNull().unique(),
  minMonths: integer("min_months").notNull(),
  maxMonths: integer("max_months").notNull(),
  maxRenewals: integer("max_renewals").notNull(),
  renewalGraceDays: integer("renewal_grace_days").notNull(),
  status: varchar("status", { length: 20 }).$type<CatalogStatusCode>().notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type ContractType = typeof contractTypes.$inferSelect;
export type NewContractType = typeof contractTypes.$inferInsert;

export const employmentContracts = pgTable("employment_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  contractTypeId: uuid("contract_type_id")
    .notNull()
    .references(() => contractTypes.id, { onDelete: "restrict" }),
  contractNo: varchar("contract_no", { length: 50 }).notNull().unique(),
  signedOn: date("signed_on").notNull(),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to").notNull(),
  orgUnitId: uuid("org_unit_id")
    .notNull()
    .references(() => orgUnits.id, { onDelete: "restrict" }),
  status: varchar("status", { length: 20 })
    .$type<ContractDocStatusCode>()
    .notNull()
    .default("valid"),
  contentHtml: text("content_html"),
  contractFileId: uuid("contract_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmploymentContract = typeof employmentContracts.$inferSelect;
export type NewEmploymentContract = typeof employmentContracts.$inferInsert;

export const contractAppendices = pgTable("contract_appendices", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => employmentContracts.id, { onDelete: "cascade" }),
  appendixNo: varchar("appendix_no", { length: 50 }),
  effectiveOn: date("effective_on").notNull(),
  terms: text("terms").notNull(),
  notes: text("notes"),
  appendixFileId: uuid("appendix_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type ContractAppendix = typeof contractAppendices.$inferSelect;
export type NewContractAppendix = typeof contractAppendices.$inferInsert;
