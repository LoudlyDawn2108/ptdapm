import { date, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { files } from "./files";
import { orgUnits } from "./organization";

export const allowanceTypes = pgTable("allowance_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  allowanceName: varchar("allowance_name", { length: 200 }).notNull().unique(),
  description: text("description"),
  calcMethod: text("calc_method"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contractTypes = pgTable("contract_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractTypeName: varchar("contract_type_name", { length: 255 }).notNull().unique(),
  minMonths: integer("min_months").notNull(),
  maxMonths: integer("max_months").notNull(),
  maxRenewals: integer("max_renewals").notNull(),
  renewalGraceDays: integer("renewal_grace_days").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const employmentContracts = pgTable("employment_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").notNull(),
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
  status: varchar("status", { length: 20 }).notNull().default("valid"),
  contentHtml: text("content_html"),
  contractFileId: uuid("contract_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

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
