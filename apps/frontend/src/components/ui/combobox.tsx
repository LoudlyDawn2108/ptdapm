import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";

export type DropdownOption = { value: string; label: string };

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
  disabled?: boolean;
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
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 300);

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

  const selectedLabel =
    options.find((o) => o.value === value)?.label ??
    initialOptions.find((o) => o.value === value)?.label;

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) setSearchText("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className,
          )}
          onClick={() => setOpen(!open)}
          onBlur={onBlur}
        >
          <span className="truncate">{selectedLabel ?? (value ? value : placeholder)}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm kiếm..."
            value={searchText}
            onValueChange={setSearchText}
          />
          <CommandList>
            {isFetching && options.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                      setSearchText("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {isFetching && options.length > 0 && (
              <div className="flex items-center justify-center border-t py-2">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
