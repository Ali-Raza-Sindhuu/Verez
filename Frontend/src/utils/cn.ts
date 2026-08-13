import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx for conditional logic and tailwind-merge
 * to resolve conflicting Tailwind utility classes.
 *
 * Used by every UI component in this library to compose className props
 * safely with internal variant/state classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}