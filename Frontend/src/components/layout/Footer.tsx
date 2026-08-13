import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface FooterProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Footer
 *
 * Minimal structural footer used at the bottom of PublicLayout. Content
 * (links, copyright, socials) is passed as children so it stays a plain
 * structural shell, not a hardcoded storefront footer.
 *
 * Example:
 *   <Footer>
 *     <p className="text-sm text-slate-500">© 2026 Velour. All rights reserved.</p>
 *   </Footer>
 */
export function Footer({ children, className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-slate-200 bg-white px-4 py-6",
        className
      )}
    >
      {children}
    </footer>
  );
}