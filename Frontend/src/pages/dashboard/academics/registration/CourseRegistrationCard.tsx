import { Check, Plus, Users, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Course } from "./types";
import { cx, categoryLabel, categoryChipClass } from "./token";
import { alreadyRegisteredCodes } from "./mockCourses";

interface CourseRegistrationCardProps {
  course: Course;
  selected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

export function CourseRegistrationCard({
  course,
  selected,
  onToggle,
  onViewDetails,
}: CourseRegistrationCardProps) {
  const seatsLeft = course.seatsTotal - course.seatsTaken;
  const isFull = seatsLeft <= 0;
  const isRegistered = alreadyRegisteredCodes.includes(course.code);
  const lowSeats = !isFull && seatsLeft <= Math.max(3, Math.round(course.seatsTotal * 0.1));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`${cx.card} p-4 sm:p-5 transition-colors hover:border-[var(--color-border-strong)] ${
        selected ? "border-[var(--color-accent-primary)]/40" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            onClick={onToggle}
            disabled={isFull || isRegistered}
            aria-label={selected ? "Remove course" : "Select course"}
            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
              selected
                ? "bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)]"
                : `${cx.borderStrong} hover:border-[var(--color-accent-primary)]/50`
            } ${isFull || isRegistered ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-mono ${cx.textSecondary}`}>{course.code}</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryChipClass[course.category]}`}
              >
                {categoryLabel[course.category]}
              </span>
              {isRegistered && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cx.successChip}`}>
                  Already registered
                </span>
              )}
            </div>
            <h3 className={`font-display text-[15px] font-semibold truncate ${cx.textPrimary}`}>{course.name}</h3>
            <p className={`text-xs mt-0.5 truncate ${cx.textSecondary}`}>
              {course.instructor} · {course.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 shrink-0 pl-8 sm:pl-0">
          <div className="text-left sm:text-right">
            <div className={`text-sm font-medium ${cx.textPrimary}`}>{course.credits} Credits</div>
            <div
              className={`text-xs flex items-center gap-1 mt-0.5 ${
                isFull ? cx.danger : lowSeats ? "text-[var(--color-accent-secondary)]" : cx.textSecondary
              }`}
            >
              <Users className="w-3 h-3" />
              {seatsLeft} / {course.seatsTotal} seats left
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetails}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${cx.textTertiary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
              aria-label="View details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={onToggle}
              disabled={isFull || isRegistered}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full transition-colors shrink-0 ${
                isFull || isRegistered
                  ? `${cx.cardAlt} ${cx.textTertiary} cursor-not-allowed`
                  : selected
                  ? cx.successChip
                  : cx.accentBtn
              }`}
            >
              {selected ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}