import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface AdminSidebarLeafItem {
  type: "leaf";
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface AdminSidebarGroupItem {
  type: "group";
  label: string;
  icon?: ReactNode;
  children: { label: string; href: string }[];
}

export type AdminSidebarItem = AdminSidebarLeafItem | AdminSidebarGroupItem;

export interface AdminSidebarProps {
  logo?: ReactNode;
  items: AdminSidebarItem[];
  activeHref: string;
  onNavigate: (href: string) => void;
  className?: string;
}

/**
 * AdminSidebar
 *
 * Sidebar matching the ECOMS reference: orange filled background on the
 * active leaf item, collapsible groups (e.g. "Products" expanding into
 * Categories / Products / Product List / Add Product / Edit Product /
 * Product Details), muted labels otherwise. A group auto-expands if one
 * of its children matches `activeHref`.
 *
 * This is a dashboard-specific sidebar distinct from the existing generic
 * `Sidebar` in components/layout — that one stays a flat-list primitive;
 * this one adds the grouped/collapsible behavior this design calls for.
 *
 * Example:
 *   <AdminSidebar
 *     logo={<span className="text-lg font-bold">ECOMS</span>}
 *     activeHref="/admin/products"
 *     onNavigate={(href) => navigate(href)}
 *     items={[
 *       { type: "leaf", label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
 *       {
 *         type: "group",
 *         label: "Products",
 *         icon: <Package size={18} />,
 *         children: [
 *           { label: "Categories", href: "/admin/products/categories" },
 *           { label: "Products", href: "/admin/products" },
 *         ],
 *       },
 *     ]}
 *   />
 */
export function AdminSidebar({
  logo,
  items,
  activeHref,
  onNavigate,
  className,
}: AdminSidebarProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () =>
      new Set(
        items
          .filter(
            (item): item is AdminSidebarGroupItem =>
              item.type === "group" &&
              item.children.some((child) => child.href === activeHref)
          )
          .map((item) => item.label)
      )
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white",
        "dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      {logo && (
        <div className="flex h-16 shrink-0 items-center px-5">{logo}</div>
      )}

      <nav className="flex-1 px-3 pb-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            if (item.type === "leaf") {
              const isActive = item.href === activeHref;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                      "transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-500",
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                  >
                    {item.icon && (
                      <span className="shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                </li>
              );
            }

            const isOpen = openGroups.has(item.label);
            const hasActiveChild = item.children.some(
              (child) => child.href === activeHref
            );

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  aria-expanded={isOpen}
                  className={cn(
                    "flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-500",
                    hasActiveChild
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon && (
                      <span className="shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-150",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <ul className="mt-1 flex flex-col gap-0.5 pl-9">
                    {item.children.map((child) => {
                      const isChildActive = child.href === activeHref;
                      return (
                        <li key={child.href}>
                          <button
                            type="button"
                            onClick={() => onNavigate(child.href)}
                            aria-current={isChildActive ? "page" : undefined}
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm",
                              "transition-colors duration-150",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-500",
                              isChildActive
                                ? "font-medium text-orange-600"
                                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                            )}
                          >
                            {child.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}