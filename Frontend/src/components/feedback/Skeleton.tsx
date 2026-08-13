import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Skeleton
 *
 * Base pulsing placeholder block. Compose it (or use the preset shapes
 * below) to build loading states for any layout.
 *
 * Example:
 *   <Skeleton className="h-4 w-32" />
 */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...rest}
    />
  );
}

/** Placeholder for a line (or block) of text, e.g. inside a paragraph. */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Placeholder matching the shape of a generic Card (header + body lines). */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <SkeletonText lines={2} />
    </div>
  );
}

/** Placeholder matching a DataTable: header row + N body rows. */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200">
      <div className="flex gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Placeholder matching a ProductCard: image + title + price line. */
export function SkeletonProduct() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/** Placeholder matching a dashboard summary card: label + big number. */
export function SkeletonDashboardStat() {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <Skeleton className="mb-3 h-3 w-1/2" />
      <Skeleton className="h-7 w-2/3" />
    </div>
  );
}