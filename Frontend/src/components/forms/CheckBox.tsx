import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Checkbox
 *
 * Single boolean input used in forms, table row selection, and settings
 * toggles. Registers directly with React Hook Form via ref forwarding.
 *
 * Example:
 *   <Checkbox label="I agree to the terms and conditions" />
 *   <Checkbox label="Select all" checked={allSelected} onChange={handleSelectAll} />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, disabled, id, className, containerClassName, ...rest },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const errorId = error ? `${checkboxId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        <div className="flex items-center gap-2">
          <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              aria-invalid={!!error || undefined}
              aria-describedby={errorId}
              className={cn(
                "peer h-4 w-4 shrink-0 appearance-none rounded border bg-white",
                "transition-colors duration-150",
                "checked:bg-indigo-600 checked:border-indigo-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500",
                "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:border-slate-200",
                error ? "border-red-500" : "border-slate-300",
                className
              )}
              {...rest}
            />
            <Check
              className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
              aria-hidden="true"
            />
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm text-slate-700 select-none",
                disabled && "cursor-not-allowed text-slate-400"
              )}
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
