import { motion } from "framer-motion";
import { Clock, MapPin, User, ArrowLeft, ArrowRight } from "lucide-react";
import type { Course, RegistrationConflict } from "./types";
import { cx, categoryLabel, categoryChipClass } from "./token";
import { ConflictAlert } from "./ConflictAlert";
import { totalCreditsOf } from "./conflicts";

const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ReviewScheduleProps {
  selected: Course[];
  conflicts: RegistrationConflict[];
  onBack: () => void;
  onConfirm: () => void;
}

export function ReviewSchedule({ selected, conflicts, onBack, onConfirm }: ReviewScheduleProps) {
  const totalCredits = totalCreditsOf(selected);
  const hasBlockingConflicts = conflicts.length > 0;

  const sorted = [...selected].sort((a, b) => {
    const dayA = Math.min(...a.schedule.days.map((d) => dayOrder.indexOf(d)));
    const dayB = Math.min(...b.schedule.days.map((d) => dayOrder.indexOf(d)));
    if (dayA !== dayB) return dayA - dayB;
    return a.schedule.startTime.localeCompare(b.schedule.startTime);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className={`${cx.card} p-5 mb-4`}>
        <div className="flex items-center justify-between mb-1">
          <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Your weekly schedule</h2>
          <span className={`text-xs ${cx.textSecondary}`}>
            {selected.length} course{selected.length !== 1 ? "s" : ""} · {totalCredits} credits
          </span>
        </div>
        <p className={`text-xs ${cx.textTertiary}`}>Double-check times and rooms before confirming.</p>
      </div>

      <ConflictAlert conflicts={conflicts} />

      <div className="space-y-3">
        {sorted.map((c) => (
          <div key={c.id} className={`${cx.card} p-4 sm:p-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className={`w-16 shrink-0 rounded-xl px-2 py-2 text-center ${cx.cardAlt}`}>
                <div className={`text-[10px] font-medium ${cx.textTertiary}`}>
                  {c.schedule.days.join("/")}
                </div>
                <div className={`text-xs font-mono font-medium mt-0.5 ${cx.textPrimary}`}>
                  {c.schedule.startTime}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-mono ${cx.textSecondary}`}>{c.code}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryChipClass[c.category]}`}>
                    {categoryLabel[c.category]}
                  </span>
                </div>
                <h3 className={`text-sm font-semibold truncate ${cx.textPrimary}`}>{c.name}</h3>
                <div className={`flex items-center gap-3 mt-1.5 text-xs flex-wrap ${cx.textSecondary}`}>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {c.instructor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {c.schedule.startTime}–{c.schedule.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {c.schedule.room}
                  </span>
                </div>
              </div>

              <div className={`text-sm font-medium shrink-0 ${cx.textPrimary}`}>{c.credits} Credits</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-1.5 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${cx.ghostBtn}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={hasBlockingConflicts}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${
            hasBlockingConflicts ? `${cx.cardAlt} ${cx.textTertiary} cursor-not-allowed` : cx.accentBtn
          }`}
        >
          Confirm Registration
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}