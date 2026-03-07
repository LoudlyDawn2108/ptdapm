import {
  boolean,
  date,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const employeeEvaluations = pgTable("employee_evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  evalType: varchar("eval_type", { length: 20 }).notNull(),
  rewardType: varchar("reward_type", { length: 255 }),
  rewardName: varchar("reward_name", { length: 255 }),
  decisionOn: date("decision_on"),
  decisionNo: varchar("decision_no", { length: 50 }),
  content: text("content"),
  rewardAmount: numeric("reward_amount", { precision: 14, scale: 2 }),
  disciplineType: varchar("discipline_type", { length: 255 }),
  disciplineName: varchar("discipline_name", { length: 255 }),
  reason: text("reason"),
  actionForm: varchar("action_form", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  visibleToEmployee: boolean("visible_to_employee").notNull().default(true),
  visibleToTckt: boolean("visible_to_tckt").notNull().default(true),
  createdByUserId: uuid("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type EmployeeEvaluation = typeof employeeEvaluations.$inferSelect;
export type NewEmployeeEvaluation = typeof employeeEvaluations.$inferInsert;
