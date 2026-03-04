import { integer, numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const salaryGrades = pgTable("salary_grades", {
  id: uuid("id").primaryKey().defaultRandom(),
  gradeCode: varchar("grade_code", { length: 50 }).notNull().unique(),
  gradeName: varchar("grade_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const salaryGradeSteps = pgTable("salary_grade_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  salaryGradeId: uuid("salary_grade_id")
    .notNull()
    .references(() => salaryGrades.id, { onDelete: "cascade" }),
  stepNo: integer("step_no").notNull(),
  coefficient: numeric("coefficient", { precision: 8, scale: 3 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
