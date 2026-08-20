import { ArrowLeft, Info } from "lucide-react";
import { cx } from "./token";

interface RegistrationHeaderProps {
  onBack: () => void;
  semester?: string;
  deadline?: string;
}

export function RegistrationHeader({
  onBack,
  semester = "Fall 2026",
  deadline = "Aug 28, 2026",
}: RegistrationHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <button
        onClick={onBack}
        className={`mt-1 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cx.ghostBtn}`}
        aria-label="Back to My Courses"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>
            Course Registration
          </h1>
          <button
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${cx.textTertiary} hover:text-[var(--color-text-primary)] transition-colors`}
            aria-label="Registration help"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <p className={`text-sm mt-1 ${cx.textSecondary}`}>
          {semester} Semester · Registration closes {deadline}
        </p>
      </div>
    </div>
  );
}