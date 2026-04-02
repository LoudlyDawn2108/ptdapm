import { z } from "zod";
import { EVAL_TYPE_CODES } from "../constants/enums";
import { safeStringNullish } from "./common";

/**
 * Regex pattern to detect common SQL injection attempts.
 */
const SQL_INJECTION_PATTERN =
  /('[\s]*OR[\s]+|'[\s]*AND[\s]+|--[\s]*$|;[\s]*--|UNION[\s]+SELECT|DROP[\s]+TABLE|INSERT[\s]+INTO|DELETE[\s]+FROM|UPDATE[\s]+.*SET|SELECT[\s]+.*FROM|'[\s]*=[\s]*'|1[\s]*=[\s]*1|'[\s]*;)/i;

const rewardAmountSchema = z
  .string()
  .nullish()
  .refine(
    (value) => {
      if (value == null || value === "") return true;
      return /^\d+(\.\d{1,2})?$/.test(value.trim());
    },
    {
      message: "Số tiền thưởng phải là số không âm, tối đa 2 chữ số thập phân",
    },
  )
  .refine(
    (value) => {
      if (value == null || value === "") return true;
      return !SQL_INJECTION_PATTERN.test(value);
    },
    {
      message: "Dữ liệu chứa ký tự không hợp lệ",
    },
  )
  .transform((value) => (value === "" ? undefined : value));

export const createEvaluationSchema = z
  .object({
    evalType: z.enum(EVAL_TYPE_CODES),
    rewardType: safeStringNullish(255),
    rewardName: safeStringNullish(255),
    decisionOn: z.union([z.literal(""), z.string().date()]).nullish(),
    decisionNo: safeStringNullish(50),
    content: safeStringNullish(),
    rewardAmount: rewardAmountSchema,
    disciplineType: safeStringNullish(255),
    disciplineName: safeStringNullish(255),
    reason: safeStringNullish(),
    actionForm: safeStringNullish(255),
    visibleToEmployee: z.boolean().default(true),
    visibleToTckt: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.evalType === "REWARD") {
      if (!data.rewardType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Loại khen thưởng không được để trống",
          path: ["rewardType"],
        });
      }
      if (!data.rewardName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên khen thưởng không được để trống",
          path: ["rewardName"],
        });
      }
      if (!data.decisionOn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày quyết định không được để trống",
          path: ["decisionOn"],
        });
      }
      if (!data.decisionNo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số quyết định không được để trống",
          path: ["decisionNo"],
        });
      }
    }

    if (data.evalType === "DISCIPLINE") {
      if (!data.disciplineType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Loại kỷ luật không được để trống",
          path: ["disciplineType"],
        });
      }
      if (!data.disciplineName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên kỷ luật không được để trống",
          path: ["disciplineName"],
        });
      }
      if (!data.decisionOn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày quyết định không được để trống",
          path: ["decisionOn"],
        });
      }
      if (!data.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lý do không được để trống",
          path: ["reason"],
        });
      }
      if (!data.actionForm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hình thức xử lý không được để trống",
          path: ["actionForm"],
        });
      }
    }
  });

export type CreateEvaluationInput = z.input<typeof createEvaluationSchema>;

export const updateEvaluationSchema = z
  .object({
    evalType: z.enum(EVAL_TYPE_CODES),
    rewardType: safeStringNullish(255),
    rewardName: safeStringNullish(255),
    decisionOn: z.union([z.literal(""), z.string().date()]).nullish(),
    decisionNo: safeStringNullish(50),
    content: safeStringNullish(),
    rewardAmount: rewardAmountSchema,
    disciplineType: safeStringNullish(255),
    disciplineName: safeStringNullish(255),
    reason: safeStringNullish(),
    actionForm: safeStringNullish(255),
    visibleToEmployee: z.boolean().default(true),
    visibleToTckt: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.evalType === "REWARD") {
      if (!data.rewardType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Loại khen thưởng không được để trống",
          path: ["rewardType"],
        });
      }
      if (!data.rewardName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên khen thưởng không được để trống",
          path: ["rewardName"],
        });
      }
      if (!data.decisionOn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày quyết định không được để trống",
          path: ["decisionOn"],
        });
      }
      if (!data.decisionNo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số quyết định không được để trống",
          path: ["decisionNo"],
        });
      }
    }

    if (data.evalType === "DISCIPLINE") {
      if (!data.disciplineType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Loại kỷ luật không được để trống",
          path: ["disciplineType"],
        });
      }
      if (!data.disciplineName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên kỷ luật không được để trống",
          path: ["disciplineName"],
        });
      }
      if (!data.decisionOn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày quyết định không được để trống",
          path: ["decisionOn"],
        });
      }
      if (!data.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lý do không được để trống",
          path: ["reason"],
        });
      }
      if (!data.actionForm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hình thức xử lý không được để trống",
          path: ["actionForm"],
        });
      }
    }
  });

export type UpdateEvaluationInput = z.input<typeof updateEvaluationSchema>;

export const listEvaluationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  evalType: z.enum(EVAL_TYPE_CODES).optional(),
});

export type ListEvaluationsQuery = z.infer<typeof listEvaluationsQuerySchema>;
