import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "../../utils/cn";

export interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  trigger?: ReactNode;
  align?: "left" | "right";
  triggerLabel?: string;
}

/**
 * DropdownMenu
 *
 * Small action menu, most commonly used for DataTable row actions (Edit,
 * Deactivate, Delete, etc). Opens on click, supports Arrow Up/Down
 * navigation and Escape to close, closes on outside click.
 *
 * Example:
 *   <DropdownMenu
 *     items={[
 *       { label: "Edit", icon: <Pencil size={14} />, onClick: handleEdit },
 *       { label: "Deactivate", onClick: handleDeactivate },
 *       { label: "Delete", danger: true, onClick: handleDelete },
 *     ]}
 *   />
 */
export function DropdownMenu({
  items,
  trigger,
  align = "right",
  triggerLabel = "Open menu",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (open && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % items.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md text-slate-500",
          "hover:bg-slate-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
        )}
      >
        {trigger ?? <MoreVertical className="h-4 w-4" />}
      </button>

      {open && (
        <div
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className={cn(
            "absolute z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, index) => (
            <button
  key={item.label}
  ref={(el) => {
    itemRefs.current[index] = el;
  }}
  type="button"
  role="menuitem"
  disabled={item.disabled}
  onClick={() => {
    item.onClick();
    setOpen(false);
  }}
  className={cn(
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-40",
    item.danger
      ? "text-red-600 hover:bg-red-50 focus-visible:bg-red-50"
      : "text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100"
  )}
>
  {item.icon && (
    <span className="shrink-0" aria-hidden="true">
      {item.icon}
    </span>
  )}
  {item.label}
</button>
          ))}
        </div>
      )}
    </div>
  );
}