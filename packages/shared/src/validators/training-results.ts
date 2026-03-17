import { z } from "zod";
import { RESULT_STATUS_CODES, type ResultStatusCode } from "../constants/enums";

// ---------------------------------------------------------------------------
// Create Training Result (UC 4.36 — Ghi nhận kết quả đào tạo)
// ---------------------------------------------------------------------------

const trainingResultItemSchema = z
  .object({
    registrationId: z.string().uuid("Mã đăng ký không hợp lệ"),
    resultStatus: z.enum(
      RESULT_STATUS_CODES as [ResultStatusCode, ...ResultStatusCode[]],
      { error: "Trạng thái kết quả không hợp lệ" },
    ),
    completedOn: z.string().date("Ngày hoàn thành không hợp lệ").nullish(),
    certificateFileId: z.string().uuid("File chứng chỉ không hợp lệ").nullish(),
    note: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.resultStatus === "completed" && !data.certificateFileId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File chứng chỉ là bắt buộc khi kết quả là Hoàn thành",
        path: ["certificateFileId"],
      });
    }
  });

export const createTrainingResultSchema = trainingResultItemSchema;

export type CreateTrainingResultInput = z.infer<
  typeof createTrainingResultSchema
>;

// ---------------------------------------------------------------------------
// Batch Create Training Results (UC 4.36 A1 — Ghi nhận kết quả cho nhiều HV)
// ---------------------------------------------------------------------------

export const createBatchTrainingResultSchema = z.object({
  results: z
    .array(trainingResultItemSchema)
    .min(1, "Danh sách kết quả không được rỗng"),
});

export type CreateBatchTrainingResultInput = z.infer<
  typeof createBatchTrainingResultSchema
>;

// ---------------------------------------------------------------------------
// Update Training Result
// ---------------------------------------------------------------------------

export const updateTrainingResultSchema = z
  .object({
    resultStatus: z
      .enum(RESULT_STATUS_CODES as [ResultStatusCode, ...ResultStatusCode[]], {
        error: "Trạng thái kết quả không hợp lệ",
      })
      .optional(),
    completedOn: z.string().date("Ngày hoàn thành không hợp lệ").nullish(),
    certificateFileId: z.string().uuid("File chứng chỉ không hợp lệ").nullish(),
    note: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.resultStatus === "completed" && !data.certificateFileId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File chứng chỉ là bắt buộc khi kết quả là Hoàn thành",
        path: ["certificateFileId"],
      });
    }
  });

export type UpdateTrainingResultInput = z.infer<
  typeof updateTrainingResultSchema
>;

// ---------------------------------------------------------------------------
// List Training Results Query
// ---------------------------------------------------------------------------

export const listTrainingResultsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  resultStatus: z
    .enum(RESULT_STATUS_CODES as [ResultStatusCode, ...ResultStatusCode[]])
    .optional(),
});

export type ListTrainingResultsQuery = z.infer<
  typeof listTrainingResultsQuerySchema
>;
