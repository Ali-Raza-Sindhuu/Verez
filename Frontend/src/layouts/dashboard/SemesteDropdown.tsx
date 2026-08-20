import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cx } from "./navConfig";

interface SemesterDropdownProps {
  semester: string;
  semesters: string[];
  onSelect: (semester: string) => void;
  showLabel: boolean;
}

export function SemesterDropdown({ semester, semesters, onSelect, showLabel }: SemesterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="px-3 pt-3 shrink-0" ref={ref}>
      <div className="relative">
        <button
          onClick={() => showLabel && setOpen((o) => !o)}
          className={`w-full flex items-center gap-2.5 rounded-xl border transition-colors ${cx.chip} ${
            showLabel ? "px-3 py-2.5 justify-between" : "px-0 py-2.5 justify-center"
          }`}
          title={!showLabel ? semester : undefined}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            {showLabel && <span className="text-sm font-medium truncate">{semester}</span>}
          </div>
          {showLabel && (
            <ChevronDown
              className={`w-3.5 h-3.5 ${cx.textTertiary} shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {open && showLabel && (
          <div className={`absolute left-0 right-0 top-full mt-1.5 rounded-xl border py-1.5 z-50 ${cx.dropdown}`}>
            {semesters.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onSelect(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  s === semester
                    ? "text-[var(--color-accent-primary)]"
                    : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}