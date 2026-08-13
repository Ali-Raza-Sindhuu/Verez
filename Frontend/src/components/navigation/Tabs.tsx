import { useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * Tabs
 *
 * Simple tab navigation for switching between related views without a
 * route change, e.g. product details (Overview / Reviews / Shipping) or a
 * settings page (Profile / Security / Notifications).
 *
 * Works uncontrolled (defaultValue) or controlled (value + onValueChange).
 *
 * Example:
 *   <Tabs
 *     defaultValue="overview"
 *     items={[
 *       { value: "overview", label: "Overview", content: <OverviewPanel /> },
 *       { value: "reviews", label: "Reviews", content: <ReviewsPanel /> },
 *     ]}
 *   />
 */
export function Tabs({ items, defaultValue, value, onValueChange, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items[0]?.value
  );

  const activeValue = value ?? internalValue;
  const activeItem = items.find((item) => item.value === activeValue);

  const selectTab = (tabValue: string) => {
    if (value === undefined) {
      setInternalValue(tabValue);
    }
    onValueChange?.(tabValue);
  };

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 border-b border-slate-200">
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => selectTab(item.value)}
              className={cn(
                "relative -mb-px border-b-2 px-4 py-2 text-sm font-medium",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 focus-visible:rounded-t-md",
                "disabled:cursor-not-allowed disabled:opacity-40",
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="pt-4">
        {activeItem?.content}
      </div>
    </div>
  );
}