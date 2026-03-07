import type {
  OrgEventReasonCode,
  OrgEventTypeCode,
  OrgUnitStatusCode,
  OrgUnitTypeCode,
} from "@hrms/shared";
import { boolean, date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { campuses } from "./campuses";
import { files } from "./files";

export const orgUnits = pgTable("org_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  campusId: uuid("campus_id")
    .notNull()
    .references(() => campuses.id, { onDelete: "restrict" }),
  parentId: uuid("parent_id"),
  unitCode: varchar("unit_code", { length: 50 }).notNull().unique(),
  unitName: varchar("unit_name", { length: 255 }).notNull(),
  unitType: varchar("unit_type", { length: 30 }).$type<OrgUnitTypeCode>().notNull(),
  foundedOn: date("founded_on"),
  address: text("address"),
  officeAddress: text("office_address"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  website: text("website"),
  isLeafConfirmed: boolean("is_leaf_confirmed").notNull().default(false),
  status: varchar("status", { length: 20 }).$type<OrgUnitStatusCode>().notNull().default("active"),
  statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type OrgUnit = typeof orgUnits.$inferSelect;
export type NewOrgUnit = typeof orgUnits.$inferInsert;

export const orgUnitStatusEvents = pgTable("org_unit_status_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgUnitId: uuid("org_unit_id")
    .notNull()
    .references(() => orgUnits.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 20 }).$type<OrgEventTypeCode>().notNull(),
  effectiveOn: date("effective_on").notNull(),
  decisionNo: varchar("decision_no", { length: 50 }),
  decisionOn: date("decision_on"),
  decisionFileId: uuid("decision_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  reason: varchar("reason", { length: 30 }).$type<OrgEventReasonCode>().notNull(),
  note: text("note"),
  mergedIntoOrgUnitId: uuid("merged_into_org_unit_id").references(() => orgUnits.id, {
    onDelete: "restrict",
  }),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type OrgUnitStatusEvent = typeof orgUnitStatusEvents.$inferSelect;
export type NewOrgUnitStatusEvent = typeof orgUnitStatusEvents.$inferInsert;
