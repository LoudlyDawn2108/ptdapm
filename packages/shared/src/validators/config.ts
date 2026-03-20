import { z } from "zod";
import { CATALOG_STATUS_CODES } from "../constants/enums";

const catalogStatusSchema = z.enum(CATALOG_STATUS_CODES);

// ---------------------------------------------------------------------------
// Contract Types
// ---------------------------------------------------------------------------
export const createContractTypeSchema = z.object({
  contractTypeName: z
    .string({ error: "Tên loại hợp đồng không được để trống" })
    .min(1, "Tên loại hợp đồng không được để trống"),
  minMonths: z
    .number({ error: "Số tháng tối thiểu phải là một số" })
    .int({ error: "Số tháng tối thiểu phải là một số" })
    .min(0, "Số tháng tối thiểu phải lớn hơn hoặc bằng 0"),
  maxMonths: z
    .number({ error: "Số tháng tối đa phải là một số" })
    .int({ error: "Số tháng tối đa phải là một số" })
    .min(1, "Số tháng tối đa phải lớn hơn hoặc bằng 1"),
  maxRenewals: z
    .number({ error: "Số lần gia hạn tối đa phải là một số" })
    .int({ error: "Số lần gia hạn tối đa phải là một số" })
    .min(0, "Số lần gia hạn tối đa phải lớn hơn hoặc bằng 0"),
  renewalGraceDays: z
    .number({ error: "Số ngày cho phép gia hạn phải là một số" })
    .int({ error: "Số ngày cho phép gia hạn phải là một số" })
    .min(0, "Số ngày cho phép gia hạn phải lớn hơn hoặc bằng 0"),
});

export type CreateContractTypeInput = z.infer<typeof createContractTypeSchema>;

export const updateContractTypeSchema = createContractTypeSchema.extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateContractTypeInput = z.infer<typeof updateContractTypeSchema>;

// ---------------------------------------------------------------------------
// Allowance Types
// ---------------------------------------------------------------------------
export const createAllowanceTypeSchema = z.object({
  allowanceName: z
    .string({ error: "Tên loại phụ cấp không được để trống" })
    .min(1, "Tên loại phụ cấp không được để trống"),
  description: z.string().optional(),
  calcMethod: z.string().optional(),
});

export type CreateAllowanceTypeInput = z.infer<typeof createAllowanceTypeSchema>;

export const updateAllowanceTypeSchema = createAllowanceTypeSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateAllowanceTypeInput = z.infer<typeof updateAllowanceTypeSchema>;

// ---------------------------------------------------------------------------
// Salary Grades
// ---------------------------------------------------------------------------
export const createSalaryGradeSchema = z.object({
  gradeCode: z
    .string({ error: "Mã ngạch lương không được để trống" })
    .min(1, "Mã ngạch lương không được để trống"),
  gradeName: z
    .string({ error: "Tên ngạch lương không được để trống" })
    .min(1, "Tên ngạch lương không được để trống"),
});

export type CreateSalaryGradeInput = z.infer<typeof createSalaryGradeSchema>;

export const updateSalaryGradeSchema = createSalaryGradeSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateSalaryGradeInput = z.infer<typeof updateSalaryGradeSchema>;

// ---------------------------------------------------------------------------
// Salary Grade Steps
// ---------------------------------------------------------------------------
export const createSalaryGradeStepSchema = z.object({
  stepNo: z
    .number({ error: "Số bước không được để trống" })
    .int({ error: "Số bước phải là một số nguyên" })
    .min(1, "Số bước phải lớn hơn hoặc bằng 1"),
  coefficient: z
    .string({ error: "Hệ số lương không được để trống" })
    .min(1, "Hệ số lương không được để trống"),
});

export type CreateSalaryGradeStepInput = z.infer<typeof createSalaryGradeStepSchema>;

export const updateSalaryGradeStepSchema = createSalaryGradeStepSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateSalaryGradeStepInput = z.infer<typeof updateSalaryGradeStepSchema>;

// ---------------------------------------------------------------------------
// Training Course Types
// ---------------------------------------------------------------------------
export const createTrainingCourseTypeSchema = z.object({
  typeName: z
    .string({ error: "Tên loại khóa đào tạo không được để trống" })
    .min(1, "Tên loại khóa đào tạo không được để trống"),
  description: z.string().nullish(),
});

export type CreateTrainingCourseTypeInput = z.infer<typeof createTrainingCourseTypeSchema>;

export const updateTrainingCourseTypeSchema = createTrainingCourseTypeSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateTrainingCourseTypeInput = z.infer<typeof updateTrainingCourseTypeSchema>;
