import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
}

const sideStyles: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0 h-full w-full max-w-sm",
  right: "inset-y-0 right-0 h-full w-full max-w-sm",
  top: "inset-x-0 top-0 w-full max-h-[80vh]",
  bottom: "inset-x-0 bottom-0 w-full max-h-[80vh]",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Drawer
 *
 * Panel that slides in from an edge of the screen. Used for mobile
 * navigation, filter panels, order details, and the shopping cart.
 *
 * Example:
 *   <Drawer open={cartOpen} onClose={() => setCartOpen(false)} side="right" title="Your cart">
 *     <CartItemsList />
 *   </Drawer>
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  footer,
  closeOnOverlayClick = true,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      panelRef.current?.focus();
    } else {
      previouslyFocusedRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const node = panelRef.current;
    if (!node) return;

    const focusable = Array.from(
      node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50" onKeyDown={handleKeyDown}>
      <div
        className="fixed inset-0 bg-slate-900/50"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        tabIndex={-1}
        className={cn(
          "fixed flex flex-col bg-white shadow-lg",
          "focus:outline-none",
          sideStyles[side]
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <h2 id="drawer-title" className="text-base font-semibold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className={cn(
                "shrink-0 rounded-md p-1 text-slate-400",
                "hover:bg-slate-100 hover:text-slate-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
