import { z } from "zod";
import { EVAL_TYPE_CODES, type EvalTypeCode } from "../constants/enums";

export const createEvaluationSchema = z
  .object({
    evalType: z.enum(EVAL_TYPE_CODES as [EvalTypeCode, ...EvalTypeCode[]]),
    rewardType: z.string().max(255).nullish(),
    rewardName: z.string().max(255).nullish(),
    decisionOn: z.union([z.literal(""), z.string().date()]).nullish(),
    decisionNo: z.string().max(50).nullish(),
    content: z.string().nullish(),
    rewardAmount: z.string().nullish(),
    disciplineType: z.string().max(255).nullish(),
    disciplineName: z.string().max(255).nullish(),
    reason: z.string().nullish(),
    actionForm: z.string().max(255).nullish(),
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

export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;

export const updateEvaluationSchema = z
  .object({
    evalType: z.enum(EVAL_TYPE_CODES as [EvalTypeCode, ...EvalTypeCode[]]),
    rewardType: z.string().max(255).nullish(),
    rewardName: z.string().max(255).nullish(),
    decisionOn: z.union([z.literal(""), z.string().date()]).nullish(),
    decisionNo: z.string().max(50).nullish(),
    content: z.string().nullish(),
    rewardAmount: z.string().nullish(),
    disciplineType: z.string().max(255).nullish(),
    disciplineName: z.string().max(255).nullish(),
    reason: z.string().nullish(),
    actionForm: z.string().max(255).nullish(),
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

export type UpdateEvaluationInput = z.infer<typeof updateEvaluationSchema>;

export const listEvaluationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  evalType: z
    .enum(EVAL_TYPE_CODES as [EvalTypeCode, ...EvalTypeCode[]])
    .optional(),
});

export type ListEvaluationsQuery = z.infer<typeof listEvaluationsQuerySchema>;
