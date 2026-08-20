import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, BookOpen } from "lucide-react";

export interface NewCourseInput {
  code: string;
  name: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  color: string;
}

interface AddCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (course: NewCourseInput) => void;
}

// Shared token classes — same var(--color-*) system used across the dashboard.
const cx = {
  label: "text-[11px] font-medium text-[var(--color-text-secondary)] mb-1.5 block",
  input:
    "w-full rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface-alt)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent-primary)]/50 transition-colors",
  error: "text-[11px] text-[var(--color-accent-danger)] mt-1",
};

const colorPalette = [
  "#1EC2BC",
  "#E7714A",
  "#9277ff",
  "#65e6f4",
  "#8ce9bd",
  "#e6b873",
  "#f472b6",
  "#60a5fa",
];

const emptyForm: NewCourseInput = {
  code: "",
  name: "",
  instructor: "",
  credits: 3,
  schedule: "",
  room: "",
  color: colorPalette[0],
};

export function AddCourseModal({ open, onClose, onSubmit }: AddCourseModalProps) {
  const [form, setForm] = useState<NewCourseInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewCourseInput, string>>>({});

  function update<K extends keyof NewCourseInput>(key: K, value: NewCourseInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof NewCourseInput, string>> = {};
    if (!form.code.trim()) next.code = "Course code is required.";
    if (!form.name.trim()) next.name = "Course name is required.";
    if (!form.instructor.trim()) next.instructor = "Instructor is required.";
    if (!form.credits || form.credits < 1) next.credits = "Enter at least 1 credit.";
    if (!form.schedule.trim()) next.schedule = "Schedule is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setForm(emptyForm);
    setErrors({});
  }

  function handleClose() {
    setForm(emptyForm);
    setErrors({});
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] shadow-[var(--shadow-lifted)] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-hairline)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h2 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                    Add course
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={cx.label}>Course code</label>
                    <input
                      value={form.code}
                      onChange={(e) => update("code", e.target.value)}
                      placeholder="CS 301"
                      className={cx.input}
                    />
                    {errors.code && <p className={cx.error}>{errors.code}</p>}
                  </div>
                  <div>
                    <label className={cx.label}>Credits</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={form.credits}
                      onChange={(e) => update("credits", Number(e.target.value))}
                      className={cx.input}
                    />
                    {errors.credits && <p className={cx.error}>{errors.credits}</p>}
                  </div>
                </div>

                <div>
                  <label className={cx.label}>Course name</label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Data Structures"
                    className={cx.input}
                  />
                  {errors.name && <p className={cx.error}>{errors.name}</p>}
                </div>

                <div>
                  <label className={cx.label}>Instructor</label>
                  <input
                    value={form.instructor}
                    onChange={(e) => update("instructor", e.target.value)}
                    placeholder="Dr. Farah Zaidi"
                    className={cx.input}
                  />
                  {errors.instructor && <p className={cx.error}>{errors.instructor}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={cx.label}>Schedule</label>
                    <input
                      value={form.schedule}
                      onChange={(e) => update("schedule", e.target.value)}
                      placeholder="Mon, Wed · 9:00 AM"
                      className={cx.input}
                    />
                    {errors.schedule && <p className={cx.error}>{errors.schedule}</p>}
                  </div>
                  <div>
                    <label className={cx.label}>Room</label>
                    <input
                      value={form.room}
                      onChange={(e) => update("room", e.target.value)}
                      placeholder="Room 204 or Online"
                      className={cx.input}
                    />
                  </div>
                </div>

                <div>
                  <label className={cx.label}>Color</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPalette.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update("color", c)}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          form.color === c ? "ring-2 ring-offset-2 ring-offset-[var(--color-surface)] ring-[var(--color-accent-primary)] scale-105" : ""
                        }`}
                        style={{ backgroundColor: c }}
                        aria-label={`Choose color ${c}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] text-sm font-medium px-4 py-2.5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[var(--color-accent-primary)] text-white text-sm font-medium px-4 py-2.5 hover:opacity-90 transition-opacity shadow-[var(--shadow-cta-glow)]"
                  >
                    Add course
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}