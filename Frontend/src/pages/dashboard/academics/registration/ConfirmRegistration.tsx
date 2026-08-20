import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Course } from "./types";
import { cx } from "./token";
import { totalCreditsOf } from "./conflicts";

interface ConfirmRegistrationProps {
  registered: Course[];
  onGoToMyCourses: () => void;
}

export function ConfirmRegistration({ registered, onGoToMyCourses }: ConfirmRegistrationProps) {
  const totalCredits = totalCreditsOf(registered);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${cx.card} p-8 sm:p-12 text-center max-w-lg mx-auto`}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${cx.successChip}`}
      >
        <CheckCircle2 className="w-7 h-7" />
      </motion.div>

      <h2 className={`font-display text-xl font-semibold ${cx.textPrimary}`}>Registration confirmed</h2>
      <p className={`text-sm mt-2 ${cx.textSecondary}`}>
        You're registered for {registered.length} course{registered.length !== 1 ? "s" : ""} ·{" "}
        {totalCredits} credits this semester.
      </p>

      <div className="mt-6 space-y-2 text-left">
        {registered.map((c) => (
          <div key={c.id} className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${cx.border}`}>
            <div className="min-w-0">
              <div className={`text-xs font-mono ${cx.textSecondary}`}>{c.code}</div>
              <div className={`text-sm font-medium truncate ${cx.textPrimary}`}>{c.name}</div>
            </div>
            <span className={`text-xs shrink-0 ${cx.textSecondary}`}>{c.credits} Credits</span>
          </div>
        ))}
      </div>

      <button
        onClick={onGoToMyCourses}
        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium px-4 py-3 mt-7 transition-colors ${cx.accentBtn}`}
      >
        Go to My Courses
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}