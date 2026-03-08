export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// --- Dropdown option (used by lazy-loaded combobox/autocomplete selects)
export interface DropdownOption {
  value: string;
  label: string;
}

// --- Error response discriminated union (frontend uses this to pick toast vs inline field errors)
export interface ToastErrorResponse {
  type: "toast";
  error: string;
}

export interface FieldErrorResponse {
  type: "field";
  error: string;
  fields: Record<string, string>;
}

export type ErrorResponse = ToastErrorResponse | FieldErrorResponse;
