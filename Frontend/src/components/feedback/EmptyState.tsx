import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * EmptyState
 *
 * Shown when a list, table, or search has no results. Used for "No
 * products found", "No orders yet", "No vendors match your filters", etc.
 *
 * Example:
 *   <EmptyState
 *     title="No products found"
 *     description="Try adjusting your filters or search terms."
 *     action={<Button onClick={clearFilters}>Clear filters</Button>}
 *   />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <div className="text-slate-300" aria-hidden="true">
        {icon ?? <Inbox className="h-10 w-10" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}