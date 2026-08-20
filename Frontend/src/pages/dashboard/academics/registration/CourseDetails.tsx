import { AnimatePresence, motion } from "framer-motion";
import { X, User, Building2, Layers, BookMarked, Clock, MapPin, Users, Check, Plus } from "lucide-react";
import type { Course } from "./types";
import { cx, categoryLabel, categoryChipClass } from "./token";
import { alreadyRegisteredCodes } from "./mockCourses";

interface CourseDetailsProps {
  course: Course | null;
  selected: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function CourseDetails({ course, selected, onClose, onToggle }: CourseDetailsProps) {
  if (!course) return null;

  const seatsLeft = course.seatsTotal - course.seatsTaken;
  const isFull = seatsLeft <= 0;
  const isRegistered = alreadyRegisteredCodes.includes(course.code);

  const facts = [
    { icon: User, label: "Instructor", value: course.instructor },
    { icon: Building2, label: "Department", value: course.department },
    { icon: Layers, label: "Level", value: `${course.level} level` },
    { icon: BookMarked, label: "Credits", value: `${course.credits} credits` },
    { icon: Clock, label: "Schedule", value: `${course.schedule.days.join(", ")} · ${course.schedule.startTime}–${course.schedule.endTime}` },
    { icon: MapPin, label: "Room", value: course.schedule.room },
  ];

  return (
    <AnimatePresence>
      {course && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-lg rounded-2xl border shadow-[var(--shadow-lifted)] max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] ${cx.border}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-start justify-between px-5 py-4 border-b ${cx.border}`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-xs font-mono ${cx.textSecondary}`}>{course.code}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryChipClass[course.category]}`}>
                      {categoryLabel[course.category]}
                    </span>
                  </div>
                  <h2 className={`font-display text-lg font-semibold ${cx.textPrimary}`}>{course.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${cx.textTertiary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <p className={`text-sm leading-relaxed ${cx.textSecondary}`}>{course.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  {facts.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex items-start gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cx.accentChip}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <div className="min-w-0">
                          <div className={`text-[10px] ${cx.textTertiary}`}>{f.label}</div>
                          <div className={`text-xs mt-0.5 ${cx.textPrimary}`}>{f.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`rounded-xl border p-3.5 ${cx.border}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs flex items-center gap-1.5 ${cx.textSecondary}`}>
                      <Users className="w-3.5 h-3.5" />
                      Seats
                    </span>
                    <span
                      className={`text-xs font-medium ${isFull ? cx.danger : cx.textPrimary}`}
                    >
                      {seatsLeft} / {course.seatsTotal} available
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full mt-2 overflow-hidden ${cx.cardAlt}`}>
                    <div
                      className={`h-full rounded-full ${isFull ? "bg-[var(--color-accent-danger)]" : "bg-[var(--color-accent-primary)]"}`}
                      style={{ width: `${Math.min(100, (course.seatsTaken / course.seatsTotal) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className={`text-xs font-medium mb-2 ${cx.textSecondary}`}>Prerequisites</div>
                  {course.prerequisites.length === 0 ? (
                    <p className={`text-xs ${cx.textTertiary}`}>None</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {course.prerequisites.map((p) => (
                        <span key={p} className={`text-[11px] font-mono px-2 py-1 rounded-lg ${cx.cardAlt} ${cx.textSecondary}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={onToggle}
                  disabled={isFull || isRegistered}
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${
                    isFull || isRegistered
                      ? `${cx.cardAlt} ${cx.textTertiary} cursor-not-allowed`
                      : selected
                      ? cx.successChip
                      : cx.accentBtn
                  }`}
                >
                  {isRegistered ? (
                    "Already registered"
                  ) : isFull ? (
                    "No seats available"
                  ) : selected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to selection
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add course
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}