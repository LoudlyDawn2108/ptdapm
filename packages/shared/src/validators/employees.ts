import { z } from "zod";
import {
  ACADEMIC_RANK_CODES,
  type AcademicRankCode,
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

const isValidDateInput = (value: string) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(value)) return false;

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) return false;
  return (parsedDate.toISOString().split("T")[0] ?? "") === value;
};

const requiredUuid = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string({ error: message }).uuid(message),
  );

const optionalUuid = (message = "Giá trị không hợp lệ") =>
  z.preprocess(normalizeOptionalTextInput, z.string().uuid(message).optional());

const requiredEnum = <T extends Readonly<Record<string, string>>>(
  schema: z.ZodEnum<T>,
  message: string,
) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.custom<T[keyof T]>((value) => schema.safeParse(value).success, { message }),
  );

const requiredDate = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string({ error: message })
      .min(1, message)
      .refine((value) => isValidDateInput(value), { message: "Ngày không hợp lệ" }),
  );

const optionalDate = (message = "Ngày không hợp lệ") =>
  optionalField(z.string().refine((value) => isValidDateInput(value), { message }));

const requiredEmail = (requiredMessage: string, invalidMessage: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string({ error: requiredMessage }).min(1, requiredMessage).email(invalidMessage),
  );

const genderSchema = z.enum(GENDER_CODES as [GenderCode, ...GenderCode[]]);
const workStatusSchema = z.enum(WORK_STATUS_CODES as [WorkStatusCode, ...WorkStatusCode[]]);
const contractStatusSchema = z.enum(
  CONTRACT_STATUS_CODES as [ContractStatusCode, ...ContractStatusCode[]],
);
const educationLevelSchema = z.enum(
  EDUCATION_LEVEL_CODES as [EducationLevelCode, ...EducationLevelCode[]],
);
const academicRankSchema = z.enum(ACADEMIC_RANK_CODES as [AcademicRankCode, ...AcademicRankCode[]]);
const familyRelationSchema = z.enum(
  FAMILY_RELATION_CODES as [FamilyRelationCode, ...FamilyRelationCode[]],
);
const partyOrgTypeSchema = z.enum(
  PARTY_ORG_TYPE_CODES as [PartyOrgTypeCode, ...PartyOrgTypeCode[]],
);

export const createEmployeeSchema = z.object({
  staffCode: optionalText(),
  fullName: requiredText("Họ tên không được để trống"),
  dob: requiredDate("Ngày sinh không được để trống"),
  gender: z
    .string({ error: "Giới tính không được để trống" })
    .refine((val) => val !== "" && val != null, {
      message: "Giới tính không được để trống",
    })
    .pipe(genderSchema),
  nationalId: requiredText("Số CCCD/CMND không được để trống"),
  hometown: requiredText("Quê quán không được để trống"),
  address: requiredText("Địa chỉ không được để trống"),
  taxCode: optionalText(),
  socialInsuranceNo: optionalText(),
  healthInsuranceNo: optionalText(),
  email: requiredEmail("Email không được để trống", "Email không hợp lệ"),
  phone: requiredText("Số điện thoại không được để trống"),
  isForeigner: z.boolean({ error: "Giá trị quốc tịch không hợp lệ" }).default(false),
  educationLevel: requiredEnum(educationLevelSchema, "Trình độ văn hóa không được để trống"),
  academicRank: requiredEnum(academicRankSchema, "Học hàm không được để trống"),
  workStatus: optionalField(workStatusSchema),
  contractStatus: optionalField(contractStatusSchema),
  currentOrgUnitId: optionalUuid("Đơn vị công tác không hợp lệ"),
  currentPositionTitle: optionalText(),
  salaryGradeStepId: optionalUuid("Bậc lương không hợp lệ"),
  portraitFileId: optionalUuid("Ảnh chân dung không hợp lệ"),
  terminatedOn: optionalDate(),
  terminationReason: optionalText(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type CreateEmployeeFormInput = z.input<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.omit({ staffCode: true }).partial();

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export const createEmployeeFamilyMemberSchema = z.object({
  relation: familyRelationSchema,
  fullName: z.string({ error: "Họ tên không được để trống" }).min(1, "Họ tên không được để trống"),
  isDependent: z.boolean().default(false),
});

export type CreateEmployeeFamilyMemberInput = z.infer<typeof createEmployeeFamilyMemberSchema>;
export type CreateEmployeeFamilyMemberFormInput = z.input<typeof createEmployeeFamilyMemberSchema>;

export const updateEmployeeFamilyMemberSchema = createEmployeeFamilyMemberSchema.partial();

export type UpdateEmployeeFamilyMemberInput = z.infer<typeof updateEmployeeFamilyMemberSchema>;

export const createEmployeeBankAccountSchema = z.object({
  bankName: z
    .string({ error: "Tên ngân hàng không được để trống" })
    .min(1, "Tên ngân hàng không được để trống"),
  accountNo: z
    .string({ error: "Số tài khoản không được để trống" })
    .min(1, "Số tài khoản không được để trống"),
  isPrimary: z.boolean().default(false),
});

export type CreateEmployeeBankAccountInput = z.infer<typeof createEmployeeBankAccountSchema>;
export type CreateEmployeeBankAccountFormInput = z.input<typeof createEmployeeBankAccountSchema>;

export const updateEmployeeBankAccountSchema = createEmployeeBankAccountSchema.partial();

export type UpdateEmployeeBankAccountInput = z.infer<typeof updateEmployeeBankAccountSchema>;

const employeePreviousJobFieldsSchema = z.object({
  workplace: z
    .string({ error: "Nơi làm việc không được để trống" })
    .min(1, "Nơi làm việc không được để trống"),
  startedOn: requiredDate("Ngày bắt đầu không được để trống"),
  endedOn: requiredDate("Ngày kết thúc không được để trống"),
});

export const createEmployeePreviousJobSchema = employeePreviousJobFieldsSchema.superRefine(
  (data, ctx) => {
    const started = new Date(data.startedOn);
    const ended = new Date(data.endedOn);
    if (!Number.isNaN(started.getTime()) && !Number.isNaN(ended.getTime()) && ended < started) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["endedOn"],
      });
    }
  },
);

export type CreateEmployeePreviousJobInput = z.infer<typeof createEmployeePreviousJobSchema>;

export const updateEmployeePreviousJobSchema = employeePreviousJobFieldsSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.startedOn == null || data.endedOn == null) return;

    const started = new Date(data.startedOn);
    const ended = new Date(data.endedOn);
    if (!Number.isNaN(started.getTime()) && !Number.isNaN(ended.getTime()) && ended < started) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["endedOn"],
      });
    }
  });

export type UpdateEmployeePreviousJobInput = z.infer<typeof updateEmployeePreviousJobSchema>;

export const createEmployeePartyMembershipSchema = z.object({
  organizationType: partyOrgTypeSchema,
  joinedOn: requiredDate("Ngày gia nhập không được để trống"),
  details: requiredText("Thông tin chi tiết không được để trống"),
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
export type CreateEmployeeAllowanceFormInput = z.input<typeof createEmployeeAllowanceSchema>;

export const updateEmployeeAllowanceSchema = createEmployeeAllowanceSchema.partial();

export type UpdateEmployeeAllowanceInput = z.infer<typeof updateEmployeeAllowanceSchema>;

export const importEmployeeRowSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  dob: z.string().refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Ngày sinh không hợp lệ"),
  gender: z.string().min(1, "Giới tính không được để trống"),
  nationalId: z.string().min(1, "Số CCCD/CMND không được để trống"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  hometown: z.string().optional(),
  address: z.string().optional(),
});

export type ImportEmployeeRowInput = z.infer<typeof importEmployeeRowSchema>;
