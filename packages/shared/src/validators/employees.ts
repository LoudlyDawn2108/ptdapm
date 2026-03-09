import { z } from "zod";
import {
  ACADEMIC_RANK_CODES,
  ACADEMIC_TITLE_CODES,
  type AcademicRankCode,
  type AcademicTitleCode,
  CONTRACT_STATUS_CODES,
  type ContractStatusCode,
  EDUCATION_LEVEL_CODES,
  type EducationLevelCode,
  FAMILY_RELATION_CODES,
  type FamilyRelationCode,
  GENDER_CODES,
  type GenderCode,
  PARTY_ORG_TYPE_CODES,
  type PartyOrgTypeCode,
  TRAINING_LEVEL_CODES,
  type TrainingLevelCode,
  WORK_STATUS_CODES,
  type WorkStatusCode,
} from "../constants/enums";

const normalizeOptionalTextInput = (value: unknown) => {
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const requiredText = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string({ error: message }).min(1, message),
  );

const optionalText = () => z.preprocess(normalizeOptionalTextInput, z.string().optional());

const optionalField = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(normalizeOptionalTextInput, schema.optional());

const genderSchema = z.enum(GENDER_CODES as [GenderCode, ...GenderCode[]]);
const workStatusSchema = z.enum(WORK_STATUS_CODES as [WorkStatusCode, ...WorkStatusCode[]]);
const contractStatusSchema = z.enum(
  CONTRACT_STATUS_CODES as [ContractStatusCode, ...ContractStatusCode[]],
);
const educationLevelSchema = z.enum(
  EDUCATION_LEVEL_CODES as [EducationLevelCode, ...EducationLevelCode[]],
);
const trainingLevelSchema = z.enum(
  TRAINING_LEVEL_CODES as [TrainingLevelCode, ...TrainingLevelCode[]],
);
const academicTitleSchema = z.enum(
  ACADEMIC_TITLE_CODES as [AcademicTitleCode, ...AcademicTitleCode[]],
);
const academicRankSchema = z.enum(ACADEMIC_RANK_CODES as [AcademicRankCode, ...AcademicRankCode[]]);
const familyRelationSchema = z.enum(
  FAMILY_RELATION_CODES as [FamilyRelationCode, ...FamilyRelationCode[]],
);
const partyOrgTypeSchema = z.enum(
  PARTY_ORG_TYPE_CODES as [PartyOrgTypeCode, ...PartyOrgTypeCode[]],
);

export const createEmployeeSchema = z.object({
  staffCode: requiredText("Mã cán bộ không được để trống"),
  fullName: requiredText("Họ tên không được để trống"),
  dob: requiredText("Ngày sinh không được để trống"),
  gender: genderSchema,
  nationalId: requiredText("Số CCCD/CMND không được để trống"),
  hometown: optionalText(),
  address: requiredText("Địa chỉ không được để trống"),
  taxCode: optionalText(),
  socialInsuranceNo: optionalText(),
  healthInsuranceNo: optionalText(),
  email: requiredText("Email không được để trống"),
  phone: requiredText("Số điện thoại không được để trống"),
  isForeigner: z.boolean({ error: "Giá trị quốc tịch không hợp lệ" }).default(false),
  educationLevel: optionalField(educationLevelSchema),
  trainingLevel: optionalField(trainingLevelSchema),
  academicTitle: optionalField(academicTitleSchema),
  academicRank: optionalField(academicRankSchema),
  workStatus: workStatusSchema,
  contractStatus: contractStatusSchema,
  currentOrgUnitId: optionalField(z.uuid()),
  currentPositionTitle: optionalText(),
  salaryGradeStepId: optionalField(z.uuid()),
  portraitFileId: optionalField(z.uuid()),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export const createEmployeeFamilyMemberSchema = z.object({
  relation: familyRelationSchema,
  fullName: z.string({ error: "Họ tên không được để trống" }).min(1, "Họ tên không được để trống"),
  dob: z.string().nullish(),
  phone: z.string().nullish(),
  note: z.string().nullish(),
  isDependent: z.boolean({ error: "Giá trị người phụ thuộc không hợp lệ" }).default(false),
});

export type CreateEmployeeFamilyMemberInput = z.infer<typeof createEmployeeFamilyMemberSchema>;

export const updateEmployeeFamilyMemberSchema = createEmployeeFamilyMemberSchema.partial();

export type UpdateEmployeeFamilyMemberInput = z.infer<typeof updateEmployeeFamilyMemberSchema>;

export const createEmployeeBankAccountSchema = z.object({
  bankName: z
    .string({ error: "Tên ngân hàng không được để trống" })
    .min(1, "Tên ngân hàng không được để trống"),
  accountNo: z
    .string({ error: "Số tài khoản không được để trống" })
    .min(1, "Số tài khoản không được để trống"),
  isPrimary: z.boolean({ error: "Giá trị tài khoản chính không hợp lệ" }).default(true),
});

export type CreateEmployeeBankAccountInput = z.infer<typeof createEmployeeBankAccountSchema>;

export const updateEmployeeBankAccountSchema = createEmployeeBankAccountSchema.partial();

export type UpdateEmployeeBankAccountInput = z.infer<typeof updateEmployeeBankAccountSchema>;

export const createEmployeePreviousJobSchema = z.object({
  workplace: z
    .string({ error: "Nơi làm việc không được để trống" })
    .min(1, "Nơi làm việc không được để trống"),
  startedOn: z.string().nullish(),
  endedOn: z.string().nullish(),
  note: z.string().nullish(),
});

export type CreateEmployeePreviousJobInput = z.infer<typeof createEmployeePreviousJobSchema>;

export const updateEmployeePreviousJobSchema = createEmployeePreviousJobSchema.partial();

export type UpdateEmployeePreviousJobInput = z.infer<typeof updateEmployeePreviousJobSchema>;

export const createEmployeePartyMembershipSchema = z.object({
  organizationType: partyOrgTypeSchema,
  joinedOn: z.string().nullish(),
  details: z.string().nullish(),
});

export type CreateEmployeePartyMembershipInput = z.infer<
  typeof createEmployeePartyMembershipSchema
>;

export const updateEmployeePartyMembershipSchema = createEmployeePartyMembershipSchema.partial();

export type UpdateEmployeePartyMembershipInput = z.infer<
  typeof updateEmployeePartyMembershipSchema
>;

export const createEmployeeAllowanceSchema = z.object({
  allowanceTypeId: z.uuid({ error: "Loại phụ cấp không được để trống" }),
  amount: z.coerce.number({ error: "Số tiền phải là một số" }).nullish(),
  note: z.string().nullish(),
});

export type CreateEmployeeAllowanceInput = z.infer<typeof createEmployeeAllowanceSchema>;

export const updateEmployeeAllowanceSchema = createEmployeeAllowanceSchema.partial();

export type UpdateEmployeeAllowanceInput = z.infer<typeof updateEmployeeAllowanceSchema>;
