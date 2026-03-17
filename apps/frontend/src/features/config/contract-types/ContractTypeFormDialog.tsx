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
  CatalogStatus,
  type CreateContractTypeInput,
  createContractTypeSchema,
} from "@hrms/shared";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateContractType,
  useUpdateContractType,
} from "./api";
import type { ContractTypeRow } from "./columns";

interface ContractTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: ContractTypeRow | null;
}

export function ContractTypeFormDialog({
  open,
  onOpenChange,
  editingItem,
}: ContractTypeFormDialogProps) {
  const isUpdate = !!editingItem;
  const createMutation = useCreateContractType();
  const updateMutation = useUpdateContractType();

  const form = useForm({
    resolver: zodResolver(createContractTypeSchema),
    defaultValues: {
      contractTypeName: "",
      minMonths: 0,
      maxMonths: 1,
      maxRenewals: 0,
      renewalGraceDays: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editingItem) {
      form.reset({
        contractTypeName: editingItem.contractTypeName,
        minMonths: editingItem.minMonths,
        maxMonths: editingItem.maxMonths,
        maxRenewals: editingItem.maxRenewals,
        renewalGraceDays: (editingItem as any).renewalGraceDays ?? 0,
      });
    } else {
      form.reset({
        contractTypeName: "",
        minMonths: 0,
        maxMonths: 1,
        maxRenewals: 0,
        renewalGraceDays: 0,
      });
    }
  }, [open, editingItem, form]);

  const onSubmit = async (values: any) => {
    try {
      if (isUpdate) {
        await updateMutation.mutateAsync({
          id: editingItem!.id,
          ...values,
        });
        toast.success("Cập nhật danh mục hợp đồng thành công");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Thêm danh mục hợp đồng thành công");
      }
      onOpenChange(false);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isUpdate ? (
              <>
                <Pencil className="h-5 w-5" />
                Cập nhật danh mục hợp đồng
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Thêm danh mục hợp đồng
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractTypeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên loại hợp đồng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Hợp đồng thử việc" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="minMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số tháng tối thiểu <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số tháng tối đa <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxRenewals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số lần gia hạn tối đa <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUpdate && (
              <FormField
                control={form.control}
                name={"status" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trạng thái <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value ?? editingItem?.status ?? "active"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(CatalogStatus).map(([code, meta]) => (
                          <SelectItem key={code} value={code}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Đang lưu..." : "Lưu danh mục hợp đồng"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
