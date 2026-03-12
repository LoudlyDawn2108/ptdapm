export const toLabel = <T extends { label: string }>(
  record: Record<string, T>,
  value?: string | null,
): string => {
  if (!value) return "—";
  return record[value]?.label ?? value;
};

export const displayValue = (value?: string | null | boolean): string => {
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return value && value.length > 0 ? value : "—";
};

export const isEnumValue = <T extends Record<string, unknown>>(
  enumRecord: T,
  value: string | null | undefined,
): value is Extract<keyof T, string> => value != null && value in enumRecord;
