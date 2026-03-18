import type {
  CatalogStatusCode,
  ParticipationStatusCode,
  ResultStatusCode,
  TrainingStatusCode,
} from "@hrms/shared";
import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { files } from "./files";

export const trainingCourseTypes = pgTable("training_course_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  typeName: varchar("type_name", { length: 255 }).notNull().unique(),
  description: text("description"),
  status: varchar("status", { length: 20 })
    .$type<CatalogStatusCode>()
    .notNull()
    .default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type TrainingCourseType = typeof trainingCourseTypes.$inferSelect;
export type NewTrainingCourseType = typeof trainingCourseTypes.$inferInsert;

export const trainingCourses = pgTable(
  "training_courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseName: varchar("course_name", { length: 255 }).notNull(),
    courseTypeId: uuid("course_type_id")
      .notNull()
      .references(() => trainingCourseTypes.id, { onDelete: "restrict" }),
    trainingFrom: date("training_from").notNull(),
    trainingTo: date("training_to").notNull(),
    location: varchar("location", { length: 255 }),
    cost: numeric("cost", { precision: 14, scale: 2 }),
    commitment: text("commitment"),
    certificateName: varchar("certificate_name", { length: 255 }),
    certificateType: varchar("certificate_type", { length: 255 }),
    registrationFrom: date("registration_from"),
    registrationTo: date("registration_to"),
    registrationLimit: integer("registration_limit"),
    status: varchar("status", { length: 30 })
      .$type<TrainingStatusCode>()
      .notNull()
      .default("open_registration"),
    createdByUserId: uuid("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusCreatedAtIdx: index("training_courses_status_created_at_idx").on(
      table.status,
      table.createdAt,
    ),
  }),
);
export type TrainingCourse = typeof trainingCourses.$inferSelect;
export type NewTrainingCourse = typeof trainingCourses.$inferInsert;

export const trainingRegistrations = pgTable(
  "training_registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => trainingCourses.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    participationStatus: varchar("participation_status", { length: 20 })
      .$type<ParticipationStatusCode>()
      .notNull()
      .default("registered"),
  },
  (table) => ({
    courseEmployeeUnique: uniqueIndex(
      "training_registrations_course_employee_uidx",
    ).on(table.courseId, table.employeeId),
    courseIdIdx: index("training_registrations_course_id_idx").on(
      table.courseId,
    ),
    employeeIdIdx: index("training_registrations_employee_id_idx").on(
      table.employeeId,
    ),
    participationStatusIdx: index(
      "training_registrations_participation_status_idx",
    ).on(table.participationStatus),
  }),
);
export type TrainingRegistration = typeof trainingRegistrations.$inferSelect;
export type NewTrainingRegistration = typeof trainingRegistrations.$inferInsert;

export const trainingResults = pgTable("training_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationId: uuid("registration_id")
    .notNull()
    .unique()
    .references(() => trainingRegistrations.id, { onDelete: "cascade" }),
  resultStatus: varchar("result_status", { length: 20 })
    .$type<ResultStatusCode>()
    .notNull(),
  completedOn: date("completed_on"),
  certificateFileId: uuid("certificate_file_id").references(() => files.id, {
    onDelete: "set null",
  }),
  note: text("note"),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type TrainingResult = typeof trainingResults.$inferSelect;
export type NewTrainingResult = typeof trainingResults.$inferInsert;
