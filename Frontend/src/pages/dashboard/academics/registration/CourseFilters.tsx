import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { departments } from "./mockCourses";
import { cx } from "./token";
import type { RegistrationFilters } from "./types";

interface CourseFiltersProps {
  filters: RegistrationFilters;
  onChange: (filters: RegistrationFilters) => void;
}

const levels = ["100", "200", "300", "400"];

function FilterDropdown({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 text-xs rounded-full px-3.5 py-2 border transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] ${cx.border}`}
      >
        {current}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute left-0 top-full mt-1.5 w-44 rounded-xl border py-1.5 z-30 ${cx.dropdown}`}>
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onSelect(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                o.value === value
                  ? "text-[var(--color-accent-primary)]"
                  : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseFilters({ filters, onChange }: CourseFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <div
        className={`flex items-center gap-2 rounded-full px-3.5 py-2 flex-1 max-w-sm border bg-[var(--color-surface-alt)] ${cx.border}`}
      >
        <Search className={`w-4 h-4 shrink-0 ${cx.textTertiary}`} />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by course name or code..."
          className={`bg-transparent text-sm focus:outline-none w-full ${cx.textPrimary} placeholder:text-[var(--color-text-tertiary)]`}
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        <FilterDropdown
          label="Department"
          value={filters.department}
          options={[{ value: "all", label: "All departments" }, ...departments.map((d) => ({ value: d, label: d }))]}
          onSelect={(v) => onChange({ ...filters, department: v })}
        />
        <FilterDropdown
          label="Level"
          value={filters.level}
          options={[
            { value: "all", label: "All levels" },
            ...levels.map((l) => ({ value: l, label: `${l} level` })),
          ]}
          onSelect={(v) => onChange({ ...filters, level: v })}
        />
        <button
          className={`hidden sm:inline-flex items-center gap-1.5 text-xs rounded-full px-3.5 py-2 border transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] ${cx.border}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>
    </div>
  );
}