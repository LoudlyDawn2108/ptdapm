import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type DropdownOption = { value: string; label: string };

const EMPTY_VALUE_SENTINEL = "__empty__";

interface ComboboxProps {
  /** TanStack Query cache key base */
  queryKey: string[];
  /** Fetch function — receives debounced search string, returns options */
  fetchOptions: (search: string) => Promise<DropdownOption[]>;
  /** Controlled value (uuid) */
  value: string;
  /** Called when user selects an option */
  onChange: (value: string) => void;
  /** For RHF field registration */
  onBlur?: () => void;
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Message shown when search returns no results */
  emptyMessage?: string;
  staticOptions?: DropdownOption[];
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export function Combobox({
  queryKey,
  fetchOptions,
  value,
  onChange,
  onBlur,
  placeholder = "Chọn...",
  emptyMessage = "Không tìm thấy.",
  staticOptions = [],
  disabled = false,
  invalid = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: options = [], isFetching } = useQuery({
    queryKey: [...queryKey, debouncedSearch],
    queryFn: () => fetchOptions(debouncedSearch),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: open,
  });

  const { data: initialOptions = [] } = useQuery({
    queryKey: [...queryKey, ""],
    queryFn: () => fetchOptions(""),
    staleTime: 60_000,
    enabled: !!value && !open,
  });

  const mergedOptions = [
    ...staticOptions,
    ...options.filter(
      (option) => !staticOptions.some((staticOption) => staticOption.value === option.value),
    ),
  ];

  const mergedInitialOptions = [
    ...staticOptions,
    ...initialOptions.filter(
      (option) => !staticOptions.some((staticOption) => staticOption.value === option.value),
    ),
  ];

  const commandValueForOption = (optionValue: string) =>
    optionValue.length > 0 ? optionValue : EMPTY_VALUE_SENTINEL;

  const isSelected = (optionValue: string) => optionValue === value;

  const selectedLabel =
    mergedOptions.find((o) => o.value === value)?.label ??
    mergedInitialOptions.find((o) => o.value === value)?.label;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchText("");
        onBlur?.();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchText("");
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onBlur]);

  return (
    <div ref={containerRef} className="relative">
      <Command shouldFilter={false}>
        <div className="relative">
          <CommandPrimitive.Input
            ref={inputRef}
            data-slot="combobox-input"
            aria-invalid={invalid}
            value={open ? searchText : (selectedLabel ?? "")}
            onValueChange={(v) => {
              setSearchText(v);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 pr-8 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
              !value && !open && "text-muted-foreground",
              className,
            )}
          />
          <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 opacity-50" />
        </div>
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg bg-popover p-1 shadow-2xl ring-1 ring-foreground/5 animate-in fade-in-0 zoom-in-95">
            <CommandList>
              {isFetching && mergedOptions.length === 0 ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : mergedOptions.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup className="p-0">
                  {mergedOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={commandValueForOption(option.value)}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                        setSearchText("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(option.value) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isFetching && mergedOptions.length > 0 && (
                <div className="flex items-center justify-center border-t py-2">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                </div>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
