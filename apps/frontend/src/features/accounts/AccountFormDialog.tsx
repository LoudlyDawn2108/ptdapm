import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import { api } from "@/api/client";
import { handleApiError } from "@/lib/error-handler";
import { applyFieldErrors } from "@/lib/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateAccountInput,
  Role,
  createAccountSchema,
  enumToSortedList,
} from "@hrms/shared";
import { Plus, Save } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateAccount } from "./api";

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountFormDialog({
  open,
  onOpenChange,
}: AccountFormDialogProps) {
  const createMutation = useCreateAccount();

  const fetchEmployeeOptions = useCallback(async (search: string) => {
    const { data, error } = await api.api.employees.get({
      query: {
        page: 1,
        pageSize: 50,
        ...(search ? { search } : {}),
      } as any,
    });
    if (error) throw handleApiError(error);
    const items = (data as any)?.data?.items ?? [];
    return items.map((emp: any) => ({
      value: emp.employeeId,
      label: `${emp.fullName} — ${emp.employeeCode}`,
    }));
  }, []);

  const form = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: "",
      employeeId: "",
      roleCode: undefined as any,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      email: "",
      employeeId: "",
      roleCode: undefined as any,
    });
  }, [open, form]);

  const onSubmit = async (values: CreateAccountInput) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Tạo tài khoản thành công");
      onOpenChange(false);
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  };

  const isPending = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tạo tài khoản
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nhân sự <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      queryKey={["employees", "combobox"]}
                      fetchOptions={fetchEmployeeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Tìm kiếm nhân sự..."
                      emptyMessage="Không tìm thấy nhân sự."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vai trò <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enumToSortedList(Role).map((r) => (
                        <SelectItem key={r.code} value={r.code}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isPending ? "Đang tạo..." : "Tạo tài khoản"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

