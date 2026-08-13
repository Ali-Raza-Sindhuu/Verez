import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { SkeletonTable } from "../feedback/skeleton";
import { EmptyState } from "../feedback/emptyState";
import { Pagination } from "../navigation/pagination";

export interface DataTableColumn<T> {
  /** Unique key for this column, also used to read a default cell value from the row. */
  key: string;
  header: string;
  /** Custom cell renderer. If omitted, falls back to row[key]. */
  render?: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  hideBelow?: "sm" | "md" | "lg";
}

export interface DataTablePagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Unique key extractor for each row, used for React keys and row identity. */
  getRowId: (row: T) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  rowActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  pagination?: DataTablePagination;
  className?: string;
}

const hideBelowClass: Record<NonNullable<DataTableColumn<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

const alignClass: Record<NonNullable<DataTableColumn<unknown>["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * DataTable
 *
 * Generic table for any admin resource — users, products, orders, vendors,
 * branches, inventory. Not coupled to any single domain: pass typed columns
 * and rows and it handles loading, empty state, row actions, and pagination.
 *
 * Example:
 *   interface User { id: string; name: string; email: string; role: string }
 *
 *   const columns: DataTableColumn<User>[] = [
 *     { key: "name", header: "Name" },
 *     { key: "email", header: "Email", hideBelow: "md" },
 *     { key: "role", header: "Role" },
 *   ];
 *
 *   <DataTable
 *     columns={columns}
 *     data={users}
 *     getRowId={(user) => user.id}
 *     rowActions={(user) => <DropdownMenu items={buildUserActions(user)} />}
 *   />
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription,
  rowActions,
  onRowClick,
  pagination,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return <SkeletonTable columns={columns.length + (rowActions ? 1 : 0)} />;
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-lg border border-slate-200", className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={{ width: column.width }}
                  className={cn(
                    "px-4 py-3 font-medium text-slate-600",
                    alignClass[column.align ?? "left"],
                    column.hideBelow && hideBelowClass[column.hideBelow]
                  )}
                >
                  {column.header}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className="w-12 px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const rowId = getRowId(row);
              return (
                <tr
                  key={rowId}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-slate-100 last:border-b-0",
                    onRowClick && "cursor-pointer hover:bg-slate-50"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-slate-700",
                        alignClass[column.align ?? "left"],
                        column.hideBelow && hideBelowClass[column.hideBelow]
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String((row as Record<string, unknown>)[column.key] ?? "")}
                    </td>
                  ))}
                  {rowActions && (
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
