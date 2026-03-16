import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function SectionHeader({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "mt-2"}>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}

export function RequiredLabel({ label }: { label: string }) {
  const isRequired = label.trim().endsWith("*");
  const text = isRequired ? label.replace(/\s*\*$/, "") : label;
  return (
    <span className="text-xs font-medium text-slate-600">
      {text}
      {isRequired && <span className="text-red-500"> *</span>}
    </span>
  );
}

export function FI<T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredLabel label={label} />
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              value={(field.value as string) ?? ""}
              className="h-9 rounded-md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormFieldSelect<T extends FieldValues>({
  form,
  name,
  label,
  items,
}: {
  form: UseFormReturn<T>;
  name: string;
  label: string;
  items: { code: string; label: string }[];
}) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredLabel label={label} />
          </FormLabel>
          <Select value={(field.value as string) ?? ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full h-9 rounded-md">
                <SelectValue placeholder="Chọn..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DynamicSection({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <SectionHeader title={title} compact />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full bg-[#E9EEFF] text-[#3B5CCC] hover:bg-[#DCE6FF]"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
      onClick={onClick}
    >
      <Minus className="h-4 w-4" />
    </Button>
  );
}
