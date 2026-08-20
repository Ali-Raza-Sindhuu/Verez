import { motion } from "framer-motion";
import { cx } from "./token";
import type { RegistrationFilters } from "./types";

const tabs: { value: RegistrationFilters["category"]; label: string }[] = [
  { value: "all", label: "All Courses" },
  { value: "core", label: "Core" },
  { value: "elective", label: "Electives" },
  { value: "gen-ed", label: "General Education" },
];

interface CourseTabsProps {
  active: RegistrationFilters["category"];
  onChange: (c: RegistrationFilters["category"]) => void;
  count: number;
}

export function CourseTabs({ active, onChange, count }: CourseTabsProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const isActive = active === t.value;
          return (
            <button
              key={t.value}
              onClick={() => onChange(t.value)}
              className={`relative shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                isActive ? cx.textPrimary : `${cx.textSecondary} hover:text-[var(--color-text-primary)]`
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="course-tab-pill"
                  className="absolute inset-0 rounded-full bg-[var(--color-accent-primary)]/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
      <span className={`text-xs shrink-0 ${cx.textTertiary}`}>
        {count} course{count !== 1 ? "s" : ""} found
      </span>
    </div>
  );
}