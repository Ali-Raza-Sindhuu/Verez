import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Pagination
 *
 * Page navigation used below DataTable and product listing grids. Shows a
 * condensed set of page numbers with ellipses for large page counts.
 *
 * Example:
 *   <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={disabled || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={pageButtonStyles()}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-8 w-8 items-center justify-center text-sm text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            disabled={disabled}
            onClick={() => onPageChange(page)}
            className={pageButtonStyles(page === currentPage)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={disabled || currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={pageButtonStyles()}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function pageButtonStyles(active = false) {
  return cn(
    "flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500",
    "disabled:cursor-not-allowed disabled:opacity-40",
    active
      ? "bg-indigo-600 text-white"
      : "text-slate-600 hover:bg-slate-100"
  );
}

/** Builds a condensed page list like: 1 … 4 5 6 … 12 */
function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1;
  const range: (number | "ellipsis")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("ellipsis");

  for (let page = left; page <= right; page++) {
    range.push(page);
  }

  if (right < total - 1) range.push("ellipsis");
  if (total > 1) range.push(total);

  return range;
}