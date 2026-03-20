import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { RoleGuard } from "@/components/shared/role-guard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/hooks";
import { contractTypeListOptions } from "@/features/config/contract-types/api";
import {
  uploadFile,
  useCreateContract,
  useEmployeeDetail,
  useUpdateContract,
} from "@/features/employees/api";
import type { EmploymentContract } from "@/features/employees/types";

/** Contract with optional joined display names from the API */
type ContractRow = EmploymentContract & {
  contractTypeName?: string;
  orgUnitName?: string;
};

type OrgUnitNode = { id: string; unitName: string; children?: OrgUnitNode[] };
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { formatDate, formatForInput } from "@/lib/date-utils";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContractDocStatus,
  type CreateEmploymentContractInput,
  EMPLOYEE_PROFILE_MANAGE_ROLES,
  createEmploymentContractSchema,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Save, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type UseFormSetError, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employees_/$employeeId/contracts")({
  component: ContractsTab,
});

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active" || status === "valid";

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Đang hoạt động
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Ngừng sử dụng
    </span>
  );
}

function ContractsTab() {
  const { employeeId } = Route.useParams();
  const { hasRole } = useAuth();
  const { aggregate, isLoading } = useEmployeeDetail(employeeId);
  const { data: contractTypesData } = useQuery(
    contractTypeListOptions({ page: 1, pageSize: 100, search: undefined }),
  );
  const { data: orgUnitsData } = useQuery(orgUnitTreeOptions());
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractRow | null>(null);
  const [viewingContract, setViewingContract] = useState<ContractRow | null>(null);
  const contracts = aggregate?.contracts as ContractRow[] | undefined;
  const staffCode = aggregate?.employee?.staffCode ?? "";
  const contractTypes = (contractTypesData?.data?.items ?? []) as Array<{
    id: string;
    contractTypeName: string;
  }>;

  const orgUnitOptions = useMemo(() => {
    const flatten = (
      nodes: OrgUnitNode[] | undefined,
      acc: Array<{ id: string; unitName: string }> = [],
    ) => {
      for (const node of nodes ?? []) {
        acc.push({ id: node.id, unitName: node.unitName });
        flatten(node.children, acc);
      }
      return acc;
    };

    return flatten((orgUnitsData?.data ?? []) as OrgUnitNode[]);
  }, [orgUnitsData?.data]);

  const contractTypeMap = useMemo(
    () => new Map(contractTypes.map((item) => [item.id, item.contractTypeName])),
    [contractTypes],
  );
  const orgUnitMap = useMemo(
    () => new Map(orgUnitOptions.map((item) => [item.id, item.unitName])),
    [orgUnitOptions],
  );
  const canManage = hasRole(...EMPLOYEE_PROFILE_MANAGE_ROLES);

  if (isLoading) return <FormSkeleton fields={3} />;

  const handleCreate = async (
    input: CreateEmploymentContractInput,
    setError: UseFormSetError<CreateEmploymentContractInput>,
  ) => {
    try {
      await createContract.mutateAsync({ employeeId, ...input });
      toast.success("Thêm hợp đồng thành công");
      setShowCreateDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdate = async (
    id: string,
    input: CreateEmploymentContractInput,
    setError: UseFormSetError<CreateEmploymentContractInput>,
  ) => {
    try {
      await updateContract.mutateAsync({ employeeId, id, ...input });
      toast.success("Cập nhật hợp đồng thành công");
      setEditingContract(null);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Top-right button */}
      <div className="mb-4 flex justify-end">
        <RoleGuard roles={[...EMPLOYEE_PROFILE_MANAGE_ROLES]}>
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Thêm hợp đồng
          </Button>
        </RoleGuard>
      </div>

      {/* Table */}
      {contracts && contracts.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-sm font-semibold text-gray-700">
                <th className="rounded-l-lg px-4 py-3 text-left font-medium">Loại hợp đồng</th>
                <th className="px-4 py-3 text-left font-medium">Ngày ký</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hiệu lực</th>
                <th className="px-4 py-3 text-left font-medium">Ngày hết hạn</th>
                <th className="px-4 py-3 text-left font-medium">Đơn vị công tác</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="rounded-r-lg px-4 py-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, i) => (
                <tr key={c.id ?? i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    {c.contractTypeName ?? contractTypeMap.get(c.contractTypeId) ?? "—"}
                  </td>
                  <td className="px-4 py-3">{formatDate(c.signedOn)}</td>
                  <td className="px-4 py-3">{formatDate(c.effectiveFrom)}</td>
                  <td className="px-4 py-3">{formatDate(c.effectiveTo)}</td>
                  <td className="px-4 py-3">
                    {c.orgUnitName ?? orgUnitMap.get(c.orgUnitId) ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <RoleGuard roles={[...EMPLOYEE_PROFILE_MANAGE_ROLES]}>
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          onClick={() => setEditingContract(c)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </RoleGuard>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setViewingContract(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">Chưa có hợp đồng nào.</p>
      )}

      <ContractFormDialog
        open={canManage && showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Thêm hợp đồng"
        submitLabel="Lưu hợp đồng"
        staffCode={staffCode}
        contractTypes={contractTypes}
        orgUnits={orgUnitOptions}
        isSubmitting={createContract.isPending}
        onSubmit={handleCreate}
      />

      <ContractFormDialog
        open={canManage && !!editingContract}
        onOpenChange={(open) => {
          if (!open) setEditingContract(null);
        }}
        title="Chỉnh sửa hợp đồng"
        submitLabel="Lưu hợp đồng"
        staffCode={staffCode}
        contract={editingContract}
        contractTypes={contractTypes}
        orgUnits={orgUnitOptions}
        isSubmitting={updateContract.isPending}
        onSubmit={(input, setError) => handleUpdate(editingContract!.id, input, setError)}
      />

      <ContractDetailDialog
        contract={viewingContract}
        onOpenChange={(open) => {
          if (!open) setViewingContract(null);
        }}
        contractTypeName={
          viewingContract
            ? (viewingContract.contractTypeName ??
              contractTypeMap.get(viewingContract.contractTypeId))
            : undefined
        }
        orgUnitName={
          viewingContract
            ? (viewingContract.orgUnitName ?? orgUnitMap.get(viewingContract.orgUnitId))
            : undefined
        }
      />
    </div>
  );
}

function ContractFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  staffCode,
  contract,
  contractTypes,
  orgUnits,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  staffCode?: string;
  contract?: ContractRow | null;
  contractTypes: Array<{ id: string; contractTypeName: string }>;
  orgUnits: Array<{ id: string; unitName: string }>;
  isSubmitting: boolean;
  onSubmit: (
    input: CreateEmploymentContractInput,
    setError: UseFormSetError<CreateEmploymentContractInput>,
  ) => Promise<void>;
}) {
  const isEditing = !!contract;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CreateEmploymentContractInput>({
    resolver: zodResolver(createEmploymentContractSchema),
    defaultValues: {
      contractTypeId: "",
      contractNo: "",
      signedOn: "",
      effectiveFrom: "",
      effectiveTo: "",
      orgUnitId: "",
      contentHtml: undefined,
      contractFileId: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      contractTypeId: contract?.contractTypeId ?? "",
      contractNo: contract?.contractNo ?? "",
      signedOn: formatForInput(contract?.signedOn),
      effectiveFrom: formatForInput(contract?.effectiveFrom),
      effectiveTo: formatForInput(contract?.effectiveTo),
      orgUnitId: contract?.orgUnitId ?? "",
      contentHtml: contract?.contentHtml ?? undefined,
      contractFileId: contract?.contractFileId ?? undefined,
    });
  }, [contract, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  <Plus className="h-4 w-4" />
                </span>
              )}
              {title}
            </DialogTitle>
            {staffCode && (
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                Mã nhân sự: {staffCode}
              </span>
            )}
          </div>
          <DialogDescription className="sr-only">
            Nhập thông tin hợp đồng lao động.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form.setError))}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contractTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại hợp đồng <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại hợp đồng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contractTypes.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.contractTypeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số hợp đồng <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số hợp đồng" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="signedOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày ký <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="effectiveFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày hiệu lực <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effectiveTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày hết hạn <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
              <FormField
                control={form.control}
                name="orgUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Đơn vị công tác theo hợp đồng <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn đơn vị công tác" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orgUnits.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                {isUploading
                  ? "Đang tải..."
                  : form.watch("contractFileId")
                    ? "Đã tải PDF"
                    : "Tải PDF"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  try {
                    const uploaded = await uploadFile(file);
                    form.setValue("contractFileId", uploaded.id, { shouldDirty: true });
                    toast.success("Tải PDF hợp đồng thành công");
                  } catch {
                    toast.error("Tải PDF thất bại");
                  } finally {
                    setIsUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isSubmitting ? "Đang lưu..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ContractDetailDialog({
  contract,
  onOpenChange,
  contractTypeName,
  orgUnitName,
}: {
  contract: ContractRow | null;
  onOpenChange: (open: boolean) => void;
  contractTypeName?: string;
  orgUnitName?: string;
}) {
  const statusLabel = contract
    ? (ContractDocStatus[contract.status as keyof typeof ContractDocStatus]?.label ??
      contract.status)
    : "";

  return (
    <Dialog open={!!contract} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết hợp đồng</DialogTitle>
          <DialogDescription>Xem thông tin chi tiết của hợp đồng lao động.</DialogDescription>
        </DialogHeader>

        {contract ? (
          <div className="grid gap-3 text-sm">
            <DetailRow label="Loại hợp đồng" value={contractTypeName ?? "—"} />
            <DetailRow label="Số hợp đồng" value={contract.contractNo ?? "—"} />
            <DetailRow label="Ngày ký" value={formatDate(contract.signedOn) || "—"} />
            <DetailRow label="Ngày hiệu lực" value={formatDate(contract.effectiveFrom) || "—"} />
            <DetailRow label="Ngày hết hạn" value={formatDate(contract.effectiveTo) || "—"} />
            <DetailRow label="Đơn vị công tác" value={orgUnitName ?? "—"} />
            <DetailRow label="Trạng thái" value={statusLabel || "—"} />
            <DetailRow label="Nội dung" value={contract.contentHtml ?? "—"} multiline />
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className={multiline ? "space-y-1" : "flex items-start justify-between gap-4"}>
      <p className="font-medium text-muted-foreground">{label}</p>
      <p
        className={
          multiline ? "rounded-md border bg-muted/30 p-3 whitespace-pre-wrap" : "text-right"
        }
      >
        {value}
      </p>
    </div>
  );
}
