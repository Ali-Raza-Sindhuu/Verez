import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trendValue: string;
  trendDirection: "up" | "down";
  caption: string;
  className?: string;
}


export function StatCard({
  icon: Icon,
  label,
  value,
  trendValue,
  trendDirection,
  caption,
  className,
}: StatCardProps) {
  const isUp = trendDirection === "up";

  return (
    <div
      className={cn(
        "rounded-[8px] border border-slate-200 bg-white p-4",
        "dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-white">
          {value}
        </span>
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            isUp ? "text-emerald-600" : "text-red-500"
          )}
        >
          {isUp ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {trendValue}
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{caption}</p>
    </div>
  );
}