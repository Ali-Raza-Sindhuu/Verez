import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onDismiss?: () => void;
  children?: ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { container: string; icon: ReactNode }
> = {
  success: {
    container: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />,
  },
  error: {
    container: "bg-red-50 text-red-800 border-red-200",
    icon: <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />,
  },
  warning: {
    container: "bg-amber-50 text-amber-800 border-amber-200",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />,
  },
  info: {
    container: "bg-sky-50 text-sky-800 border-sky-200",
    icon: <Info className="h-5 w-5 text-sky-600" aria-hidden="true" />,
  },
};

/**
 * Alert
 *
 * Inline feedback banner for form-level errors, success confirmations, or
 * page-level notices. Not for transient toasts — this stays in the layout
 * until dismissed or removed by the parent.
 *
 * Example:
 *   <Alert variant="error" title="Something went wrong">
 *     We couldn't save your changes. Please try again.
 *   </Alert>
 */
export function Alert({
  variant = "info",
  title,
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3",
        config.container,
        className
      )}
      {...rest}
    >
      <div className="shrink-0 pt-0.5">{config.icon}</div>

      <div className="flex-1 text-sm">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "mt-1")}>{children}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            "shrink-0 rounded-md p-1 text-current opacity-60",
            "hover:opacity-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}