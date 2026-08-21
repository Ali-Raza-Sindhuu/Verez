import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Course } from "./types";
import { cx } from "./token";
import { MAX_CREDITS, totalCreditsOf } from "./conflicts";

interface RegistrationSummaryProps {
  selected: Course[];
  onRemove: (id: number) => void;
  onClearAll: () => void;
}

export function RegistrationSummary({ selected, onRemove, onClearAll }: RegistrationSummaryProps) {
  const totalCredits = totalCreditsOf(selected);
  const remaining = Math.max(0, MAX_CREDITS - totalCredits);

  return (
    <div className={`${cx.card} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Registration Summary</h2>
        {selected.length > 0 && (
          <button
            onClick={onClearAll}
            className={`text-[11px] font-medium flex items-center gap-1 transition-colors ${cx.textTertiary} hover:text-[var(--color-accent-danger)]`}
          >
            <Trash2 className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className={`text-[10px] ${cx.textTertiary}`}>Selected Courses</div>
          <div className={`text-lg font-display font-semibold ${cx.textPrimary}`}>{selected.length}</div>
        </div>
        <div>
          <div className={`text-[10px] ${cx.textTertiary}`}>Total Credits</div>
          <div className={`text-lg font-display font-semibold ${cx.textPrimary}`}>{totalCredits}</div>
        </div>
        <div>
          <div className={`text-[10px] ${cx.textTertiary}`}>Maximum Allowed</div>
          <div className={`text-sm font-medium ${cx.textSecondary}`}>{MAX_CREDITS} credits</div>
        </div>
        <div>
          <div className={`text-[10px] ${cx.textTertiary}`}>Remaining</div>
          <div className={`text-sm font-medium ${cx.textSecondary}`}>{remaining} credits</div>
        </div>
      </div>

      <div className={`h-1.5 rounded-full mb-4 overflow-hidden ${cx.cardAlt}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (totalCredits / MAX_CREDITS) * 100)}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`h-full rounded-full ${
            totalCredits > MAX_CREDITS ? "bg-[var(--color-accent-danger)]" : "bg-[var(--color-accent-primary)]"
          }`}
        />
      </div>

      {selected.length === 0 ? (
        <p className={`text-xs text-center py-6 ${cx.textTertiary}`}>
          No courses selected yet. Add courses from the list to build your schedule.
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
          <AnimatePresence initial={false}>
            {selected.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${cx.border}`}
              >
                <div className="min-w-0">
                  <div className={`text-xs font-mono ${cx.textSecondary}`}>{c.code}</div>
                  <div className={`text-[13px] font-medium truncate ${cx.textPrimary}`}>{c.name}</div>
                  <div className={`text-[11px] ${cx.textTertiary}`}>{c.credits} Credits</div>
                </div>
                <button
                  onClick={() => onRemove(c.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${cx.textTertiary} hover:text-[var(--color-accent-danger)] hover:bg-[var(--color-accent-danger)]/10`}
                  aria-label={`Remove ${c.code}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}