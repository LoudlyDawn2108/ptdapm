import { FormSkeleton } from "@/components/shared/loading-skeleton";
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
import { contractTypeListOptions } from "@/features/config/contract-types/api";
import {
  employeeDetailOptions,
  useCreateContract,
  useUpdateContract,
} from "@/features/employees/api";
import { orgUnitTreeOptions } from "@/features/org-units/api";
import { formatDate, formatForInput } from "@/lib/date-utils";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContractDocStatus,
  type CreateEmploymentContractInput,
  createEmploymentContractSchema,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
  const { data, isLoading } = useQuery(employeeDetailOptions(employeeId));
  const { data: contractTypesData } = useQuery(
    contractTypeListOptions({ page: 1, pageSize: 100, search: undefined }),
  );
  const { data: orgUnitsData } = useQuery(orgUnitTreeOptions());
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [viewingContract, setViewingContract] = useState<any | null>(null);
  const aggregate = data?.data as any;
  const contracts = aggregate?.contracts as any[] | undefined;
  const contractTypes = (contractTypesData?.data?.items ?? []) as Array<{
    id: string;
    contractTypeName: string;
  }>;

  const orgUnitOptions = useMemo(() => {
    const flatten = (
      nodes: any[] | undefined,
      acc: Array<{ id: string; unitName: string }> = [],
    ) => {
      for (const node of nodes ?? []) {
        acc.push({ id: node.id, unitName: node.unitName });
        flatten(node.children, acc);
      }
      return acc;
    };

    return flatten((orgUnitsData?.data ?? []) as any[]);
  }, [orgUnitsData?.data]);

  const contractTypeMap = useMemo(
    () => new Map(contractTypes.map((item) => [item.id, item.contractTypeName])),
    [contractTypes],
  );
  const orgUnitMap = useMemo(
    () => new Map(orgUnitOptions.map((item) => [item.id, item.unitName])),
    [orgUnitOptions],
  );

  if (isLoading) return <FormSkeleton fields={3} />;

  const handleCreate = async (input: CreateEmploymentContractInput, setError: any) => {
    try {
      await createContract.mutateAsync({ employeeId, ...input });
      toast.success("Thêm hợp đồng thành công");
      setShowCreateDialog(false);
    } catch (error) {
      applyFieldErrors(setError, error);
    }
  };

  const handleUpdate = async (id: string, input: CreateEmploymentContractInput, setError: any) => {
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
        <Button size="sm" className="gap-1.5" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4" />
          Thêm hợp đồng
        </Button>
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
              {contracts.map((c: any, i: number) => (
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
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => setEditingContract(c)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
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
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Thêm hợp đồng"
        description="Nhập thông tin hợp đồng lao động cho nhân sự."
        submitLabel="Thêm hợp đồng"
        contractTypes={contractTypes}
        orgUnits={orgUnitOptions}
        isSubmitting={createContract.isPending}
        onSubmit={handleCreate}
      />

      <ContractFormDialog
        open={!!editingContract}
        onOpenChange={(open) => {
          if (!open) setEditingContract(null);
        }}
        title="Chỉnh sửa hợp đồng"
        description="Cập nhật thông tin hợp đồng lao động."
        submitLabel="Lưu thay đổi"
        contract={editingContract}
        contractTypes={contractTypes}
        orgUnits={orgUnitOptions}
        isSubmitting={updateContract.isPending}
        onSubmit={(input, setError) => handleUpdate(editingContract.id, input, setError)}
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
  description,
  submitLabel,
  contract,
  contractTypes,
  orgUnits,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  contract?: any | null;
  contractTypes: Array<{ id: string; contractTypeName: string }>;
  orgUnits: Array<{ id: string; unitName: string }>;
  isSubmitting: boolean;
  onSubmit: (input: CreateEmploymentContractInput, setError: any) => Promise<void>;
}) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form.setError))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="contractTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại hợp đồng</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
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
                  <FormLabel>Số hợp đồng</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Nhập số hợp đồng" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="signedOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày ký</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effectiveFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày hiệu lực</FormLabel>
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
                    <FormLabel>Ngày hết hạn</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="orgUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị công tác</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
  contract: any | null;
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
