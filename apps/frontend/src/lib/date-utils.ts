import { format, formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format a date string or Date to "dd/MM/yyyy".
 * Returns empty string for null/undefined.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy");
}

/**
 * Format a date string or Date to "dd/MM/yyyy HH:mm".
 * Returns empty string for null/undefined.
 */
export function formatDateTime(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy HH:mm");
}

/**
 * Format a date as relative time in Vietnamese (e.g., "3 ngày trước").
 * Returns empty string for null/undefined.
 */
export function formatRelative(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: vi });
}

/**
 * Format a date for form inputs (yyyy-MM-dd).
 */
export function formatForInput(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd");
}
