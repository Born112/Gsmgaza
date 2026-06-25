import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in UZS (Uzbek Sum).
 * Outputs e.g. "1 750 000 сум"
 */
export function formatPrice(amount: number): string {
  return (
    new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " сум"
  );
}

/**
 * Multi-field substring search — case-insensitive.
 * Returns true if any of the given field values contains the query.
 */
export function matchesSearch(query: string, ...fields: (string | null | undefined)[]): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return fields.some(f => f?.toLowerCase().includes(q));
}
