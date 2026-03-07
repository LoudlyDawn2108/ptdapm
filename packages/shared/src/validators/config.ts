import { z } from "zod";
import { CATALOG_STATUS_CODES, type CatalogStatusCode } from "../constants/enums";

const catalogStatusSchema = z.enum(
  CATALOG_STATUS_CODES as [CatalogStatusCode, ...CatalogStatusCode[]],
);

// ---------------------------------------------------------------------------
// Contract Types
// ---------------------------------------------------------------------------
export const createContractTypeSchema = z.object({
  contractTypeName: z.string().min(1, "Tên loại hợp đồng không được để trống"),
  minMonths: z.number().int().min(0),
  maxMonths: z.number().int().min(1),
  maxRenewals: z.number().int().min(0),
  renewalGraceDays: z.number().int().min(0),
});

export type CreateContractTypeInput = z.infer<typeof createContractTypeSchema>;

export const updateContractTypeSchema = createContractTypeSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateContractTypeInput = z.infer<typeof updateContractTypeSchema>;

// ---------------------------------------------------------------------------
// Allowance Types
// ---------------------------------------------------------------------------
export const createAllowanceTypeSchema = z.object({
  allowanceName: z.string().min(1, "Tên loại phụ cấp không được để trống"),
  description: z.string().nullish(),
  calcMethod: z.string().nullish(),
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
  gradeCode: z.string().min(1, "Mã ngạch lương không được để trống"),
  gradeName: z.string().min(1, "Tên ngạch lương không được để trống"),
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
  stepNo: z.number().int().min(1),
  coefficient: z.string().min(1, "Hệ số lương không được để trống"),
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
  typeName: z.string().min(1, "Tên loại khóa đào tạo không được để trống"),
  description: z.string().nullish(),
});

export type CreateTrainingCourseTypeInput = z.infer<typeof createTrainingCourseTypeSchema>;

export const updateTrainingCourseTypeSchema = createTrainingCourseTypeSchema.partial().extend({
  status: catalogStatusSchema.optional(),
});

export type UpdateTrainingCourseTypeInput = z.infer<typeof updateTrainingCourseTypeSchema>;
