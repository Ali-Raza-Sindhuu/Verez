import { ArrowRight } from "lucide-react";
import { cx } from "./token";
import { MIN_CREDITS } from "./conflicts";

interface RegistrationActionsProps {
  totalCredits: number;
  hasBlockingConflicts: boolean;
  onProceed: () => void;
  label?: string;
}

export function RegistrationActions({
  totalCredits,
  hasBlockingConflicts,
  onProceed,
  label = "Review Schedule",
}: RegistrationActionsProps) {
  const belowMinimum = totalCredits < MIN_CREDITS;
  const disabled = belowMinimum || hasBlockingConflicts;

  return (
    <div className="mt-4">
      <button
        onClick={onProceed}
        disabled={disabled}
        className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium px-4 py-3 transition-colors ${
          disabled ? `${cx.cardAlt} ${cx.textTertiary} cursor-not-allowed` : cx.accentBtn
        }`}
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
      {belowMinimum && (
        <p className={`text-[11px] text-center mt-2 ${cx.textTertiary}`}>
          Select at least {MIN_CREDITS} credits to continue.
        </p>
      )}
      {!belowMinimum && hasBlockingConflicts && (
        <p className="text-[11px] text-center mt-2 text-[var(--color-accent-danger)]">
          Resolve the conflicts above to continue.
        </p>
      )}
    </div>
  );
}