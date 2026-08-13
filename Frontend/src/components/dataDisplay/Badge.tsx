import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

/**
 * Badge
 *
 * Small labeled pill for order status, payment status, inventory status,
 * or user status. For business-specific status mappings (order/payment/
 * inventory), use StatusBadge instead, which wraps this component with
 * typed value-to-variant mappings.
 *
 * Example:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="danger">Out of stock</Badge>
 */
export function Badge({ variant = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantStyles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}