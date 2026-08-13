import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}

/**
 * Breadcrumb
 *
 * Path indicator for admin/dashboard pages, e.g. Dashboard / Products /
 * Edit Product. The last item is treated as the current page (not a link).
 * `onNavigate` is intentionally decoupled from any router — wire it to
 * React Router's `navigate` where this is used.
 *
 * Example:
 *   <Breadcrumb
 *     items={[
 *       { label: "Dashboard", href: "/admin" },
 *       { label: "Products", href: "/admin/products" },
 *       { label: "Edit Product" },
 *     ]}
 *     onNavigate={(href) => navigate(href)}
 *   />
 */
export function Breadcrumb({ items, onNavigate, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="flex items-center gap-1.5">
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      isLast ? "font-medium text-slate-900" : "text-slate-500"
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate?.(item.href!)}
                    className={cn(
                      "text-slate-500 hover:text-slate-700 hover:underline",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 focus-visible:rounded-sm"
                    )}
                  >
                    {item.label}
                  </button>
                )}
              </li>

              {!isLast && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-slate-300"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}