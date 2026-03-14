# 08 — Form Patterns (RHF + Zod + shadcn)

## Stack

| Tool | Role |
|---|---|
| **React Hook Form (RHF)** | Form state, validation lifecycle, submission |
| **@hookform/resolvers/zod** | Bridges Zod schemas → RHF validation |
| **Zod schemas from @hrms/shared** | Same validation rules as backend — single source of truth |
| **shadcn/ui Form components** | `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormMessage>` |

---

## Basic Form Pattern

```typescript
// features/config/contract-types/components/contract-type-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContractTypeSchema } from "@hrms/shared";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateContractType } from "../api";
import { applyFieldErrors } from "@/lib/error-handler";

type FormValues = z.infer<typeof createContractTypeSchema>;

export function ContractTypeForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(createContractTypeSchema),
    defaultValues: {
      name: "",
      minMonths: 0,
      maxMonths: 0,
      maxRenewals: 0,
      renewalWaitDays: 0,
    },
  });

  const createMutation = useCreateContractType();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Tạo loại hợp đồng thành công");
      onSuccess();
    } catch (error) {
      // Map backend field errors → RHF inline errors
      applyFieldErrors(form.setError, error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên loại hợp đồng</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời hạn tối thiểu (tháng)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* More fields... */}

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Đang tạo..." : "Tạo mới"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Edit Form Pattern (with default values from server)

```typescript
// features/employees/components/employee-edit-form.tsx
import { useQuery } from "@tanstack/react-query";
import { employeeDetailOptions } from "../api";

export function EmployeeEditForm({ employeeId }: { employeeId: string }) {
  const { data: employee, isLoading } = useQuery(
    employeeDetailOptions(employeeId),
  );

  if (isLoading) return <FormSkeleton />;
  if (!employee) return null;

  return <EmployeeFormInner defaultValues={employee} employeeId={employeeId} />;
}

function EmployeeFormInner({
  defaultValues,
  employeeId,
}: {
  defaultValues: Employee;
  employeeId: string;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      fullName: defaultValues.fullName,
      dateOfBirth: defaultValues.dateOfBirth,
      gender: defaultValues.gender,
      // ... map server data → form values
    },
  });

  const updateMutation = useUpdateEmployee(employeeId);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Cập nhật thành công");
    } catch (error) {
      applyFieldErrors(form.setError, error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>{/* fields */}</form>
    </Form>
  );
}
```

---

## Multi-Tab Form (Employee Profile — UC 4.25/4.26)

Employee create/edit requires a multi-tab form. Use TanStack Router search params for active tab (URL-synced).

```typescript
// routes/_authenticated/employees/$employeeId.tsx
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const tabSchema = z.object({
  tab: z
    .enum([
      "personal",
      "family",
      "bank",
      "work-history",
      "party",
      "allowances",
      "degrees",
      "certs",
      "contracts",
      "evaluations",
    ])
    .default("personal"),
});

export const Route = createFileRoute("/_authenticated/employees/$employeeId")({
  validateSearch: tabSchema,
  component: EmployeeDetailPage,
});

function EmployeeDetailPage() {
  const { employeeId } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <Tabs
      value={tab}
      onValueChange={(value) =>
        navigate({ search: { tab: value as any } })
      }
    >
      <TabsList>
        <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
        <TabsTrigger value="family">Gia đình</TabsTrigger>
        <TabsTrigger value="bank">Ngân hàng</TabsTrigger>
        <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
        {/* More tabs... */}
      </TabsList>

      <TabsContent value="personal">
        <PersonalInfoTab employeeId={employeeId} />
      </TabsContent>
      <TabsContent value="family">
        <FamilyTab employeeId={employeeId} />
      </TabsContent>
      {/* More tab content... */}
    </Tabs>
  );
}
```

---

## Select / Combobox in Forms (per combobox plan)

```typescript
// Using Controller for combobox integration with RHF
import { Controller } from "react-hook-form";
import { Combobox } from "@/components/ui/combobox";
import { useDropdownQuery } from "@/hooks/use-dropdown-query";

function ContractTypeSelect({ control }: { control: Control<FormValues> }) {
  return (
    <Controller
      control={control}
      name="contractTypeId"
      render={({ field, fieldState }) => {
        const [search, setSearch] = useState("");
        const debouncedSearch = useDebounce(search, 300);
        const { data: options, isLoading } = useQuery(
          dropdownOptions(
            "contract-types",
            fetchContractTypeDropdown,
            debouncedSearch,
          ),
        );

        return (
          <FormItem>
            <FormLabel>Loại hợp đồng</FormLabel>
            <Combobox
              options={options ?? []}
              value={field.value}
              onValueChange={field.onChange}
              onSearchChange={setSearch}
              isLoading={isLoading}
              placeholder="Chọn loại hợp đồng..."
            />
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
}
```

---

## Date Picker in Forms

```typescript
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";

<Controller
  control={form.control}
  name="dateOfBirth"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Ngày sinh</FormLabel>
      <DatePicker
        value={field.value ? new Date(field.value) : undefined}
        onChange={(date) => field.onChange(date?.toISOString())}
        placeholder="Chọn ngày sinh..."
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Conditional Fields (Foreign National — UC 4.25)

```typescript
function PersonalInfoForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const isForeign = form.watch("isForeignNational");

  return (
    <Form {...form}>
      {/* Common fields */}

      <FormField
        control={form.control}
        name="isForeignNational"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel>Là người nước ngoài</FormLabel>
          </FormItem>
        )}
      />

      {isForeign && (
        <>
          <FormField name="nationality" /* ... */ />
          <FormField name="passportNumber" /* ... */ />
          <FormField name="workPermitFile" /* ... */ />
          {/* These fields become required when isForeign is true */}
          {/* Zod schema handles conditional validation via .refine() */}
        </>
      )}
    </Form>
  );
}
```

---

## File Upload in Forms

```typescript
<FormField
  control={form.control}
  name="portraitFile"
  render={({ field: { onChange, value, ...field } }) => (
    <FormItem>
      <FormLabel>Ảnh chân dung</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Confirmation Dialog Pattern

```typescript
// components/shared/confirm-dialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Xác nhận",
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === "destructive" ? "bg-destructive" : ""}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Key Rules

1. **Always use `zodResolver` with schemas from `@hrms/shared`** — same validation on frontend and backend.
2. **Use `mutateAsync` + try/catch** — to catch field errors and apply to RHF.
3. **Multi-tab forms use URL state** — active tab in search params, each tab lazy-loads its data.
4. **Confirm dialogs for destructive actions** — delete, status changes, resignation.
5. **Loading state on submit button** — use `mutation.isPending` to disable and show spinner.
6. **Don't reset form on error** — only reset on success or explicit user action.
