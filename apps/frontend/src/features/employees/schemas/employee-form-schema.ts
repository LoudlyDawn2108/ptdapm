import { z } from "zod";

// ============================================================================
// Shared Employee Form Schema
// ============================================================================
// This schema is used by both Create (new.tsx) and Edit (edit.tsx) forms.
// The only difference is that Edit form sub-entities have an optional `id` field.
// ============================================================================

// ── Flat employee fields validation ──
const employeeFlatFields = {
  fullName: z.string().min(1, "Họ tên không được để trống"),
  gender: z.string().min(1, "Giới tính không được để trống"),
  dob: z.string().min(1, "Ngày sinh không được để trống"),
  hometown: z.string().min(1, "Quê quán không được để trống"),
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ (chỉ được nhập số)"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  nationalId: z.string().min(1, "Số CCCD/CMND không được để trống"),
  taxCode: z.string().min(1, "Mã số thuế không được để trống"),
  socialInsuranceNo: z.string().optional(),
  healthInsuranceNo: z.string().optional(),
  portraitFileId: z.string().min(1, "Ảnh chân dung không được để trống"),
  isForeigner: z.boolean().default(false),
  visaNumber: z.string().optional(),
  visaExpiry: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  workPermitNumber: z.string().optional(),
  workPermitExpiry: z.string().optional(),
  workPermitFileId: z.string().optional(),
  educationLevel: z.string().min(1, "Trình độ văn hóa không được để trống"),
  academicRank: z.string().min(1, "Học hàm/Học vị không được để trống"),
};

// ── Sub-entity schemas (base - without id) ──
const familyMemberBase = z.object({
  relation: z.string().min(1, "Mối quan hệ không được để trống"),
  fullName: z.string().min(1, "Họ tên không được để trống"),
});

const bankAccountBase = z.object({
  bankName: z.string().min(1, "Tên ngân hàng không được để trống"),
  accountNo: z.string().min(1, "Số tài khoản không được để trống"),
});

const partyMembershipBase = z.object({
  organizationType: z.string().min(1, "Loại tổ chức không được để trống"),
  joinedOn: z.string().min(1, "Ngày gia nhập không được để trống"),
  details: z.string().min(1, "Thông tin chi tiết không được để trống"),
});

const degreeBase = z.object({
  degreeName: z.string().min(1, "Tên bằng không được để trống"),
  school: z.string().min(1, "Trường/Nơi cấp không được để trống"),
  degreeFileId: z.string().optional(),
});

const certificateBase = z.object({
  certName: z.string().min(1, "Tên chứng chỉ không được để trống"),
  issuedBy: z.string().min(1, "Nơi cấp không được để trống"),
  certFileId: z.string().optional(),
});

const previousJobBase = z.object({
  workplace: z.string().min(1, "Nơi làm việc không được để trống"),
  startedOn: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endedOn: z.string().min(1, "Ngày kết thúc không được để trống"),
});

// ── SuperRefine for foreigner validation ──
const foreignerValidation = (
  data: { isForeigner: boolean; [key: string]: unknown },
  ctx: z.RefinementCtx,
) => {
  if (data.isForeigner) {
    const foreignerFields = [
      { field: "visaNumber", label: "Số visa" },
      { field: "visaExpiry", label: "Ngày hết hạn visa" },
      { field: "passportNumber", label: "Số hộ chiếu" },
      { field: "passportExpiry", label: "Ngày hết hạn hộ chiếu" },
      { field: "workPermitNumber", label: "Số giấy phép lao động" },
      { field: "workPermitExpiry", label: "Ngày hết hạn giấy phép" },
    ] as const;
    for (const { field, label } of foreignerFields) {
      if (!data[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} là bắt buộc khi là người nước ngoài`,
          path: [field],
        });
      }
    }
  }
};

// ============================================================================
// CREATE FORM SCHEMA (for new.tsx)
// Sub-entities do NOT have `id` field
// ============================================================================
export const createEmployeeFormSchema = z
  .object({
    ...employeeFlatFields,
    // Sub-entity arrays (without id)
    familyMembers: z.array(familyMemberBase).default([]),
    bankAccounts: z.array(bankAccountBase).default([]),
    partyMemberships: z.array(partyMembershipBase).default([]),
    degrees: z.array(degreeBase).default([]),
    certificates: z.array(certificateBase).default([]),
    previousJobs: z.array(previousJobBase).default([]),
  })
  .superRefine(foreignerValidation);

export type CreateEmployeeFormInput = z.input<typeof createEmployeeFormSchema>;
export type CreateEmployeeFormValues = z.output<typeof createEmployeeFormSchema>;

// ============================================================================
// EDIT FORM SCHEMA (for edit.tsx)
// Sub-entities HAVE optional `id` field for tracking existing records
// ============================================================================
export const editEmployeeFormSchema = z
  .object({
    ...employeeFlatFields,
    // Sub-entity arrays (with optional id for existing records)
    familyMembers: z.array(familyMemberBase.extend({ id: z.string().optional() })).default([]),
    bankAccounts: z.array(bankAccountBase.extend({ id: z.string().optional() })).default([]),
    partyMemberships: z
      .array(partyMembershipBase.extend({ id: z.string().optional() }))
      .default([]),
    degrees: z.array(degreeBase.extend({ id: z.string().optional() })).default([]),
    certificates: z.array(certificateBase.extend({ id: z.string().optional() })).default([]),
    previousJobs: z.array(previousJobBase.extend({ id: z.string().optional() })).default([]),
  })
  .superRefine(foreignerValidation);

export type EditEmployeeFormInput = z.input<typeof editEmployeeFormSchema>;
export type EditEmployeeFormValues = z.output<typeof editEmployeeFormSchema>;
