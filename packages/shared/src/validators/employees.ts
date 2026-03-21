import { z } from "zod";
import {
  ACADEMIC_RANK_CODES,
  ACADEMIC_TITLE_CODES,
  ALLOWANCE_ASSIGNMENT_STATUS_CODES,
  AcademicRank,
  CONTRACT_DOC_STATUS_CODES,
  CONTRACT_STATUS_CODES,
  EDUCATION_LEVEL_CODES,
  EducationLevel,
  FAMILY_RELATION_CODES,
  GENDER_CODES,
  PARTY_ORG_TYPE_CODES,
  TRAINING_LEVEL_CODES,
  WORK_STATUS_CODES,
} from "../constants/enums";

const normalizeOptionalTextInput = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
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

const educationLevelDisplayToCode = new Map<string, (typeof EDUCATION_LEVEL_CODES)[number]>(
  Object.values(EducationLevel).map((item) => [item.label, item.code]),
);

const academicRankDisplayToCode = new Map<string, (typeof ACADEMIC_RANK_CODES)[number]>(
  Object.values(AcademicRank).map((item) => [item.label, item.code]),
);

const requiredEducationLevel = (message: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;

      const trimmedValue = value.trim();
      return educationLevelDisplayToCode.get(trimmedValue) ?? trimmedValue;
    },
    z.custom<(typeof EDUCATION_LEVEL_CODES)[number]>(
      (value) => educationLevelSchema.safeParse(value).success,
      { message },
    ),
  );

const requiredAcademicRank = (message: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;

      const trimmedValue = value.trim();
      return academicRankDisplayToCode.get(trimmedValue) ?? trimmedValue;
    },
    z.custom<(typeof ACADEMIC_RANK_CODES)[number]>(
      (value) => academicRankSchema.safeParse(value).success,
      {
        message,
      },
    ),
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

const genderSchema = z.enum(GENDER_CODES);
const workStatusSchema = z.enum(WORK_STATUS_CODES);
const contractStatusSchema = z.enum(CONTRACT_STATUS_CODES);
const allowanceAssignmentStatusSchema = z.enum(ALLOWANCE_ASSIGNMENT_STATUS_CODES);
const educationLevelSchema = z.enum(EDUCATION_LEVEL_CODES);
const trainingLevelSchema = z.enum(TRAINING_LEVEL_CODES);
const academicTitleSchema = z.enum(ACADEMIC_TITLE_CODES);
const academicRankSchema = z.enum(ACADEMIC_RANK_CODES);
const familyRelationSchema = z.enum(FAMILY_RELATION_CODES);
const partyOrgTypeSchema = z.enum(PARTY_ORG_TYPE_CODES);

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
  taxCode: requiredText("Mã số thuế không được để trống"),
  socialInsuranceNo: optionalText(),
  healthInsuranceNo: optionalText(),
  email: requiredEmail("Email không được để trống", "Email không hợp lệ"),
  phone: requiredText("Số điện thoại không được để trống"),
  isForeigner: z.boolean({ error: "Giá trị quốc tịch không hợp lệ" }).default(false),
  educationLevel: requiredEducationLevel("Trình độ văn hóa không được để trống"),
  trainingLevel: optionalField(trainingLevelSchema),
  academicTitle: optionalField(academicTitleSchema),
  academicRank: requiredAcademicRank("Học hàm/học vị không được để trống"),
  // NOTE: workStatus, contractStatus, and salaryGradeStepId are optional at creation time.
  // The DB schema defines defaults: workStatus='pending', contractStatus='none'.
  // Backend does NOT need explicit values — Postgres defaults apply on INSERT.
  // Existing create/edit forms rely on this behavior.
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
  dob: optionalDate(),
  phone: z.string().nullish(),
  note: z.string().nullish(),
  isDependent: z.boolean({ error: "Giá trị người phụ thuộc không hợp lệ" }).default(false),
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
  isPrimary: z.boolean({ error: "Giá trị tài khoản chính không hợp lệ" }).default(false),
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
  note: z.string().nullish(),
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
  status: z.enum(ALLOWANCE_ASSIGNMENT_STATUS_CODES, {
    error: "Trạng thái phụ cấp không được để trống",
  }),
  note: z.string().nullish(),
});

export type CreateEmployeeAllowanceInput = z.infer<typeof createEmployeeAllowanceSchema>;
export type CreateEmployeeAllowanceFormInput = z.input<typeof createEmployeeAllowanceSchema>;

export const updateEmployeeAllowanceSchema = z.object({
  allowanceTypeId: z.uuid({ error: "Loại phụ cấp không hợp lệ" }).optional(),
  status: allowanceAssignmentStatusSchema.optional(),
  note: z.string().nullish(),
});

export type UpdateEmployeeAllowanceInput = z.infer<typeof updateEmployeeAllowanceSchema>;

const contractFieldsSchema = z.object({
  contractTypeId: z.uuid({ error: "Loại hợp đồng không được để trống" }),
  contractNo: z
    .string({ error: "Số hợp đồng không được để trống" })
    .min(1, "Số hợp đồng không được để trống"),
  signedOn: requiredDate("Ngày ký không được để trống"),
  effectiveFrom: requiredDate("Ngày hiệu lực không được để trống"),
  effectiveTo: requiredDate("Ngày hết hạn không được để trống"),
  orgUnitId: z.uuid({ error: "Đơn vị không được để trống" }),
  status: z.enum(CONTRACT_DOC_STATUS_CODES).optional(),
  contentHtml: z.string().nullish(),
  contractFileId: z.string().uuid().nullish(),
});

export const createEmployeeContractSchema = contractFieldsSchema.superRefine((data, ctx) => {
  const from = new Date(data.effectiveFrom);
  const to = new Date(data.effectiveTo);
  if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && to <= from) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày hết hạn phải sau ngày hiệu lực",
      path: ["effectiveTo"],
    });
  }
  const signed = new Date(data.signedOn);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (!Number.isNaN(signed.getTime()) && signed > today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày ký không được trong tương lai",
      path: ["signedOn"],
    });
  }
});
export type CreateEmployeeContractInput = z.infer<typeof createEmployeeContractSchema>;

export const updateEmployeeContractSchema = contractFieldsSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.effectiveFrom != null && data.effectiveTo != null) {
      const from = new Date(data.effectiveFrom);
      const to = new Date(data.effectiveTo);
      if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && to <= from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày hết hạn phải sau ngày hiệu lực",
          path: ["effectiveTo"],
        });
      }
    }
    if (data.signedOn != null) {
      const signed = new Date(data.signedOn);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (!Number.isNaN(signed.getTime()) && signed > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày ký không được trong tương lai",
          path: ["signedOn"],
        });
      }
    }
  });
export type UpdateEmployeeContractInput = z.infer<typeof updateEmployeeContractSchema>;

export const createContractAppendixSchema = z.object({
  appendixNo: z.string().nullish(),
  effectiveOn: requiredDate("Ngày hiệu lực không được để trống"),
  terms: z
    .string({ error: "Nội dung điều khoản không được để trống" })
    .min(1, "Nội dung điều khoản không được để trống"),
  notes: z.string().nullish(),
  appendixFileId: z.string().uuid().nullish(),
});
export type CreateContractAppendixInput = z.infer<typeof createContractAppendixSchema>;

export const updateContractAppendixSchema = createContractAppendixSchema.partial();
export type UpdateContractAppendixInput = z.infer<typeof updateContractAppendixSchema>;

export const createEmployeeDegreeSchema = z.object({
  degreeName: z
    .string({ error: "Tên bằng không được để trống" })
    .min(1, "Tên bằng không được để trống"),
  school: z
    .string({ error: "Trường/Nơi cấp không được để trống" })
    .min(1, "Trường/Nơi cấp không được để trống"),
  degreeFileId: optionalUuid("File bằng không hợp lệ"),
});
export type CreateEmployeeDegreeInput = z.infer<typeof createEmployeeDegreeSchema>;
export const updateEmployeeDegreeSchema = createEmployeeDegreeSchema.partial();
export type UpdateEmployeeDegreeInput = z.infer<typeof updateEmployeeDegreeSchema>;

const certificationFieldsSchema = z.object({
  certName: z
    .string({ error: "Tên chứng chỉ không được để trống" })
    .min(1, "Tên chứng chỉ không được để trống"),
  issuedBy: requiredText("Nơi cấp không được để trống"),
  issuedOn: optionalDate(),
  expiresOn: optionalDate(),
  certFileId: optionalUuid("File chứng chỉ không hợp lệ"),
});

export const createEmployeeCertificationSchema = certificationFieldsSchema.superRefine(
  (data, ctx) => {
    if (data.issuedOn && data.expiresOn) {
      const issued = new Date(data.issuedOn);
      const expires = new Date(data.expiresOn);
      if (!Number.isNaN(issued.getTime()) && !Number.isNaN(expires.getTime()) && expires < issued) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ngày hết hạn phải sau ngày cấp",
          path: ["expiresOn"],
        });
      }
    }
  },
);
export type CreateEmployeeCertificationInput = z.infer<typeof createEmployeeCertificationSchema>;
export const updateEmployeeCertificationSchema = createEmployeeCertificationSchema;
export type UpdateEmployeeCertificationInput = z.infer<typeof updateEmployeeCertificationSchema>;

export const createForeignWorkPermitSchema = z.object({
  visaNo: optionalText(),
  visaExpiresOn: optionalDate(),
  passportNo: optionalText(),
  passportExpiresOn: optionalDate(),
  workPermitNo: optionalText(),
  workPermitExpiresOn: optionalDate(),
  workPermitFileId: optionalUuid("File giấy phép lao động không hợp lệ"),
});
export type CreateForeignWorkPermitInput = z.infer<typeof createForeignWorkPermitSchema>;
export const updateForeignWorkPermitSchema = createForeignWorkPermitSchema.partial();
export type UpdateForeignWorkPermitInput = z.infer<typeof updateForeignWorkPermitSchema>;

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
