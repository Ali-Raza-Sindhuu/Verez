import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Card
 *
 * Generic surface container used for product cards, dashboard summary
 * cards, settings panels, and list items. Composed with CardHeader,
 * CardTitle, CardContent, and CardFooter — use only the parts you need.
 *
 * Example:
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Total revenue</CardTitle>
 *     </CardHeader>
 *     <CardContent>
 *       <p className="text-2xl font-semibold">$12,480</p>
 *     </CardContent>
 *   </Card>
 */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, children, ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ className, children, ...rest }: CardTitleProps) {
  return (
    <h3
      className={cn("text-sm font-semibold text-slate-900", className)}
      {...rest}
    >
      {children}
    </h3>
  );
}

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, children, ...rest }: CardContentProps) {
  return (
    <div className={cn("px-4 py-3", className)} {...rest}>
      {children}
    </div>
  );
}

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, children, ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}