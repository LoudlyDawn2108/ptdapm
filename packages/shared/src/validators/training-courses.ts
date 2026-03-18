import { z } from "zod";
import {
  TRAINING_STATUS_CODES,
  type TrainingStatusCode,
} from "../constants/enums";

const amountStringSchema = z
  .string()
  .trim()
  .regex(
    /^\d+(\.\d{1,2})?$/,
    "Giá trị tiền tệ phải là số không âm, tối đa 2 chữ số thập phân (ví dụ: 3500000 hoặc 3500000.00)",
  );

const nullableAmountStringSchema = z
  .string()
  .nullish()
  .refine(
    (value) => {
      if (value == null || value === "") return true;
      return amountStringSchema.safeParse(value).success;
    },
    {
      message:
        "Giá trị tiền tệ phải là số không âm, tối đa 2 chữ số thập phân (ví dụ: 3500000 hoặc 3500000.00)",
    },
  )
  .transform((value) => (value === "" ? undefined : value));

// ---------------------------------------------------------------------------
// Create Training Course (UC 4.33 — Mở khóa đào tạo)
// ---------------------------------------------------------------------------
export const createTrainingCourseSchema = z
  .object({
    courseName: z
      .string({ error: "Tên khóa đào tạo không được để trống" })
      .min(1, "Tên khóa đào tạo không được để trống")
      .max(255),
    courseTypeId: z.string().uuid("Loại khóa đào tạo không hợp lệ"),
    trainingFrom: z.string().date("Ngày bắt đầu đào tạo không hợp lệ"),
    trainingTo: z.string().date("Ngày kết thúc đào tạo không hợp lệ"),
    location: z.string().max(255).nullish(),
    cost: nullableAmountStringSchema,
    commitment: z.string().nullish(),
    certificateName: z.string().max(255).nullish(),
    certificateType: z.string().max(255).nullish(),
    registrationFrom: z.string().date("Ngày mở đăng ký không hợp lệ").nullish(),
    registrationTo: z.string().date("Ngày đóng đăng ký không hợp lệ").nullish(),
    registrationLimit: z
      .number()
      .int("Giới hạn đăng ký phải là số nguyên")
      .min(1, "Giới hạn đăng ký phải lớn hơn hoặc bằng 1")
      .nullish(),
  })
  .superRefine((data, ctx) => {
    if (
      data.trainingFrom &&
      data.trainingTo &&
      data.trainingFrom > data.trainingTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày bắt đầu đào tạo phải trước ngày kết thúc",
        path: ["trainingFrom"],
      });
    }

    if (
      data.registrationFrom &&
      data.registrationTo &&
      data.registrationFrom > data.registrationTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày mở đăng ký phải trước ngày đóng đăng ký",
        path: ["registrationFrom"],
      });
    }

    if (
      data.registrationTo &&
      data.trainingFrom &&
      data.registrationTo > data.trainingFrom
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày đóng đăng ký phải trước hoặc bằng ngày bắt đầu đào tạo",
        path: ["registrationTo"],
      });
    }
  });

export type CreateTrainingCourseInput = z.infer<
  typeof createTrainingCourseSchema
>;

// ---------------------------------------------------------------------------
// Update Training Course (UC 4.34 — Sửa thông tin khóa đào tạo)
// ---------------------------------------------------------------------------
export const updateTrainingCourseSchema = z
  .object({
    courseName: z.string().min(1).max(255).optional(),
    courseTypeId: z.string().uuid().optional(),
    trainingFrom: z.string().date().optional(),
    trainingTo: z.string().date().optional(),
    location: z.string().max(255).nullish(),
    cost: nullableAmountStringSchema,
    commitment: z.string().nullish(),
    certificateName: z.string().max(255).nullish(),
    certificateType: z.string().max(255).nullish(),
    registrationFrom: z.string().date().nullish(),
    registrationTo: z.string().date().nullish(),
    registrationLimit: z.number().int().min(1).nullish(),
  })
  .superRefine((data, ctx) => {
    if (
      data.trainingFrom &&
      data.trainingTo &&
      data.trainingFrom > data.trainingTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày bắt đầu đào tạo phải trước ngày kết thúc",
        path: ["trainingFrom"],
      });
    }

    if (
      data.registrationFrom &&
      data.registrationTo &&
      data.registrationFrom > data.registrationTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày mở đăng ký phải trước ngày đóng đăng ký",
        path: ["registrationFrom"],
      });
    }

    if (
      data.registrationTo &&
      data.trainingFrom &&
      data.registrationTo > data.trainingFrom
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày đóng đăng ký phải trước hoặc bằng ngày bắt đầu đào tạo",
        path: ["registrationTo"],
      });
    }
  });

export type UpdateTrainingCourseInput = z.infer<
  typeof updateTrainingCourseSchema
>;

// ---------------------------------------------------------------------------
// List Training Courses Query
// ---------------------------------------------------------------------------
export const listTrainingCoursesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(
      TRAINING_STATUS_CODES as [TrainingStatusCode, ...TrainingStatusCode[]],
    )
    .optional(),
  search: z.string().optional(),
});

export type ListTrainingCoursesQuery = z.infer<
  typeof listTrainingCoursesQuerySchema
>;

// ---------------------------------------------------------------------------
// Change Training Course Status
// ---------------------------------------------------------------------------
export const changeTrainingCourseStatusSchema = z.object({
  status: z.enum(
    TRAINING_STATUS_CODES as [TrainingStatusCode, ...TrainingStatusCode[]],
    { error: "Trạng thái khóa đào tạo không hợp lệ" },
  ),
});

export type ChangeTrainingCourseStatusInput = z.infer<
  typeof changeTrainingCourseStatusSchema
>;
