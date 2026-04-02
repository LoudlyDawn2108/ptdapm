import { z } from "zod";
import { ORG_EVENT_REASON_CODES, ORG_UNIT_TYPE_CODES } from "../constants/enums";

const orgUnitTypeSchema = z.enum(ORG_UNIT_TYPE_CODES);

const orgEventReasonSchema = z.enum(ORG_EVENT_REASON_CODES);

// ---------------------------------------------------------------------------
// Org Units
// ---------------------------------------------------------------------------
export const createOrgUnitSchema = z.object({
  parentId: z.string().uuid().nullable().optional(),
  unitCode: z
    .string({ error: "Mã đơn vị không được để trống" })
    .min(1, "Mã đơn vị không được để trống")
    .max(50, "Mã đơn vị không được vượt quá 50 ký tự"),
  unitName: z
    .string({ error: "Tên đơn vị không được để trống" })
    .min(1, "Tên đơn vị không được để trống")
    .max(255, "Tên đơn vị không được vượt quá 255 ký tự"),
  unitType: orgUnitTypeSchema,
  foundedOn: z.string().optional(),
  address: z.string().optional(),
  officeAddress: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9]*$/, "Số điện thoại chỉ được nhập số")
    .optional()
    .or(z.literal("")),
  website: z.string().optional(),
  isLeafConfirmed: z.boolean().default(false),
});

export type CreateOrgUnitInput = z.infer<typeof createOrgUnitSchema>;

export const updateOrgUnitSchema = z.object({
  unitName: z
    .string({ error: "Tên đơn vị không được để trống" })
    .min(1, "Tên đơn vị không được để trống")
    .max(255, "Tên đơn vị không được vượt quá 255 ký tự")
    .optional(),
  unitType: orgUnitTypeSchema.optional(),
  foundedOn: z.string().optional(),
  address: z.string().optional(),
  officeAddress: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9]*$/, "Số điện thoại chỉ được nhập số")
    .optional()
    .or(z.literal("")),
  website: z.string().optional(),
  isLeafConfirmed: z.boolean().optional(),
});

export type UpdateOrgUnitInput = z.infer<typeof updateOrgUnitSchema>;

export const dissolveOrgUnitSchema = z.object({
  effectiveOn: z
    .string({ error: "Ngày hiệu lực không được để trống" })
    .min(1, "Ngày hiệu lực không được để trống"),
  decisionNo: z.string().nullish(),
  decisionOn: z.string().nullish(),
  reason: orgEventReasonSchema,
  note: z.string().nullish(),
  childAction: z.enum(["dissolve_all", "reassign"]),
  newParentId: z.uuid().nullish(),
});

export type DissolveOrgUnitInput = z.infer<typeof dissolveOrgUnitSchema>;

export const mergeOrgUnitSchema = z.object({
  effectiveOn: z
    .string({ error: "Ngày hiệu lực không được để trống" })
    .min(1, "Ngày hiệu lực không được để trống"),
  decisionNo: z.string().nullish(),
  decisionOn: z.string().nullish(),
  reason: orgEventReasonSchema,
  note: z.string().nullish(),
  targetOrgUnitId: z.uuid({ error: "Đơn vị nhận sáp nhập không được để trống" }),
});

export type MergeOrgUnitInput = z.infer<typeof mergeOrgUnitSchema>;

// ---------------------------------------------------------------------------
// Employee Assignments
// ---------------------------------------------------------------------------
export const createAssignmentSchema = z.object({
  employeeId: z.uuid({ error: "Mã nhân sự không được để trống" }),
  positionTitle: z.string().nullish(),
  startedOn: z
    .string({ error: "Ngày bắt đầu không được để trống" })
    .min(1, "Ngày bắt đầu không được để trống")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày bắt đầu không hợp lệ (YYYY-MM-DD)")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Ngày bắt đầu không hợp lệ"),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
