import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { RegistrationStep } from "./types";
import { cx } from "./token";

const steps: { step: RegistrationStep; label: string }[] = [
  { step: 1, label: "Select Courses" },
  { step: 2, label: "Review & Schedule" },
  { step: 3, label: "Confirm Registration" },
];

interface RegistrationStepsProps {
  current: RegistrationStep;
}

export function RegistrationSteps({ current }: RegistrationStepsProps) {
  return (
    <div className="flex items-center mb-6 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const done = s.step < current;
        const active = s.step === current;
        return (
          <div key={s.step} className="flex items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className={`relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  done
                    ? "bg-[var(--color-accent-primary)] text-white"
                    : active
                    ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]"
                    : `${cx.cardAlt} ${cx.textTertiary}`
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : s.step}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  active ? cx.textPrimary : done ? cx.textSecondary : cx.textTertiary
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-10 sm:w-16 h-px mx-3 shrink-0 relative overflow-hidden bg-[var(--color-border-hairline)]">
                <motion.div
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-[var(--color-accent-primary)]"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}