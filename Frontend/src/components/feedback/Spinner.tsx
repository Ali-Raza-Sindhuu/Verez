import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

/**
 * Spinner
 *
 * Generic loading indicator used inside buttons, cards, tables, and
 * full-page loading states.
 *
 * Example:
 *   <Spinner />
 *   <Spinner size="lg" label="Loading orders" />
 */
export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn("animate-spin text-slate-400", sizeStyles[size], className)}
    />
  );
}