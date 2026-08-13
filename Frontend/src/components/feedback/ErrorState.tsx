import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * ErrorState
 *
 * Shown when a page, table, or panel fails to load data. Distinct from
 * EmptyState: this means something went wrong, not "nothing here yet".
 *
 * Example:
 *   <ErrorState
 *     title="Something went wrong"
 *     description="We couldn't load your orders. Please try again."
 *     onRetry={refetch}
 *   />
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-red-400" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
