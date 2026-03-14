import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchOrgUnitDropdown } from "@/lib/api/config-dropdowns";
import {
  WorkStatus,
  Gender,
  ContractStatus,
  AcademicRank,
  enumToSortedList,
} from "@hrms/shared";
import { Filter, X } from "lucide-react";
import { useState, useCallback } from "react";

export interface EmployeeFilterValues {
  workStatus?: string;
  gender?: string;
  contractStatus?: string;
  academicRank?: string;
  orgUnitId?: string;
}

interface AdvancedFilterPanelProps {
  values: EmployeeFilterValues;
  onChange: (values: EmployeeFilterValues) => void;
  activeCount: number;
}

export function AdvancedFilterPanel({
  values,
  onChange,
  activeCount,
}: AdvancedFilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<EmployeeFilterValues>(values);

  const handleOpen = useCallback(
    (isOpen: boolean) => {
      if (isOpen) setDraft(values);
      setOpen(isOpen);
    },
    [values],
  );

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared: EmployeeFilterValues = {};
    setDraft(cleared);
    onChange(cleared);
    setOpen(false);
  };

  const updateDraft = (key: keyof EmployeeFilterValues, value: string | undefined) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Bộ lọc nâng cao
          {activeCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[440px]">
        <SheetHeader>
          <SheetTitle>Bộ lọc nâng cao</SheetTitle>
          <SheetDescription>
            Lọc danh sách hồ sơ nhân sự theo nhiều tiêu chí
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Đơn vị công tác */}
          <div className="space-y-2">
            <Label>Đơn vị công tác</Label>
            <Combobox
              queryKey={["org-units", "dropdown", "filter"]}
              fetchOptions={fetchOrgUnitDropdown}
              value={draft.orgUnitId ?? ""}
              onChange={(v) => updateDraft("orgUnitId", v || undefined)}
              placeholder="Chọn đơn vị..."
            />
          </div>

          {/* Trạng thái làm việc */}
          <FilterSelect
            label="Trạng thái làm việc"
            value={draft.workStatus}
            onChange={(v) => updateDraft("workStatus", v)}
            items={enumToSortedList(WorkStatus)}
          />

          {/* Trạng thái hợp đồng */}
          <FilterSelect
            label="Trạng thái hợp đồng"
            value={draft.contractStatus}
            onChange={(v) => updateDraft("contractStatus", v)}
            items={enumToSortedList(ContractStatus)}
          />

          {/* Chức danh khoa học */}
          <FilterSelect
            label="Chức danh khoa học"
            value={draft.academicRank}
            onChange={(v) => updateDraft("academicRank", v)}
            items={enumToSortedList(AcademicRank)}
          />

          {/* Giới tính */}
          <FilterSelect
            label="Giới tính"
            value={draft.gender}
            onChange={(v) => updateDraft("gender", v)}
            items={enumToSortedList(Gender)}
          />
        </div>

        <div className="mt-8 flex gap-3">
          <Button onClick={handleApply} className="flex-1">
            Áp dụng bộ lọc
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─── helper: reusable enum select ──────────────────────── */
function FilterSelect({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  items: { code: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value ?? "all"}
        onValueChange={(v) => onChange(v === "all" ? undefined : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
