import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateOrgUnitInput,
  OrgUnitType,
  createOrgUnitSchema,
  enumToSortedList,
} from "@hrms/shared";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { orgUnitTreeOptions, useCreateOrgUnit, useUpdateOrgUnit } from "./api";

type OrgUnitNode = { id: string; unitName: string; status?: string; children?: OrgUnitNode[] };

interface OrgUnitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: any | null;
  defaultParentId?: string | null;
}

export function OrgUnitFormDialog({
  open,
  onOpenChange,
  editingItem,
  defaultParentId,
}: OrgUnitFormDialogProps) {
  const isUpdate = !!editingItem;
  const createMutation = useCreateOrgUnit();
  const updateMutation = useUpdateOrgUnit();

  const { data: treeData } = useQuery(orgUnitTreeOptions());
  const orgUnitOptions = useMemo(() => {
    const flatten = (
      nodes: OrgUnitNode[] | undefined,
      acc: Array<{ id: string; unitName: string }> = [],
    ) => {
      for (const node of nodes ?? []) {
        if (node.status === "active") {
          acc.push({ id: node.id, unitName: node.unitName });
        }
        flatten(node.children, acc);
      }
      return acc;
    };
    return flatten((treeData?.data ?? []) as OrgUnitNode[]);
  }, [treeData?.data]);

  const form = useForm({
    resolver: zodResolver(createOrgUnitSchema),
    defaultValues: {
      unitCode: "",
      unitName: "",
      unitType: "KHOA" as const,
      parentId: null as string | null,
      email: "",
      phone: "",
      website: "",
      address: "",
      officeAddress: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editingItem) {
      form.reset({
        unitCode: editingItem.unitCode ?? "",
        unitName: editingItem.unitName ?? "",
        unitType: editingItem.unitType ?? "KHOA",
        parentId: editingItem.parentId ?? null,
        email: editingItem.email ?? "",
        phone: editingItem.phone ?? "",
        website: editingItem.website ?? "",
        address: editingItem.address ?? "",
        officeAddress: editingItem.officeAddress ?? "",
      });
    } else {
      form.reset({
        unitCode: "",
        unitName: "",
        unitType: "KHOA" as any,
        parentId: defaultParentId ?? null,
        email: "",
        phone: "",
        website: "",
        address: "",
        officeAddress: "",
      });
    }
  }, [open, editingItem, defaultParentId, form]);

  const onSubmit = async (values: any) => {
    // Sanitize: strip empty strings for optional fields (Zod .optional() rejects null)
    const sanitized: Record<string, any> = {
      unitCode: values.unitCode,
      unitName: values.unitName,
      unitType: values.unitType,
      isLeafConfirmed: values.isLeafConfirmed ?? false,
    };
    // Only include optional fields if they have a truthy value
    if (values.parentId) sanitized.parentId = values.parentId;
    if (values.email) sanitized.email = values.email;
    if (values.phone) sanitized.phone = values.phone;
    if (values.website) sanitized.website = values.website;
    if (values.address) sanitized.address = values.address;
    if (values.officeAddress) sanitized.officeAddress = values.officeAddress;
    if (values.foundedOn) sanitized.foundedOn = values.foundedOn;

    try {
      if (isUpdate) {
        const { unitCode, parentId, ...updateData } = sanitized;
        await updateMutation.mutateAsync({
          id: editingItem!.id,
          ...updateData,
        });
        toast.success("Cập nhật đơn vị thành công");
      } else {
        await createMutation.mutateAsync(sanitized as any);
        toast.success("Thêm đơn vị thành công");
      }
      onOpenChange(false);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const sortedTypes = enumToSortedList(OrgUnitType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isUpdate ? (
              <>
                <Pencil className="h-5 w-5" />
                Sửa đơn vị
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Thêm đơn vị
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="unitCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mã đơn vị <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="DV001" disabled={isUpdate} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên đơn vị <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ban Giám hiệu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="unitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại đơn vị <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại đơn vị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sortedTypes.map((t) => (
                          <SelectItem key={t.code} value={t.code}>
                            {t.label}
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
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị cha</FormLabel>
                    <Select
                      value={field.value ?? "__none__"}
                      onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn vị cha" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">— Không có —</SelectItem>
                        {orgUnitOptions.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="email@tlu.edu.vn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="0999999999" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link website</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="https://example.vn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="175 Tây Sơn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="officeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ văn phòng</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Tòa A1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Đang lưu..." : "Lưu đơn vị"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
