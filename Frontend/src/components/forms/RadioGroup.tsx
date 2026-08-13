import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  name: string;
  orientation?: "vertical" | "horizontal";
  containerClassName?: string;
}

/**
 * RadioGroup
 *
 * A set of mutually exclusive options, used for things like payment method
 * selection, status filters, or plan selection. Not ref-forwardable like
 * the other inputs (native radio groups don't have a single ref target);
 * wire it into React Hook Form using the Controller component instead:
 *
 *   <Controller
 *     name="paymentMethod"
 *     control={control}
 *     render={({ field }) => (
 *       <RadioGroup
 *         name="paymentMethod"
 *         label="Payment method"
 *         options={[{ label: "Cash", value: "cash" }, { label: "Card", value: "card" }]}
 *         value={field.value}
 *         onChange={field.onChange}
 *       />
 *     )}
 *   />
 */
export function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  name,
  disabled,
  orientation = "vertical",
  containerClassName,
}: RadioGroupProps) {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;

  return (
    <div
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-invalid={!!error || undefined}
      aria-describedby={errorId}
      className={cn("flex flex-col gap-2", containerClassName)}
    >
      {label && (
        <span
          id={`${groupId}-label`}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </span>
      )}

      <div
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isOptionDisabled = disabled || option.disabled;

          return (
            <div key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={isOptionDisabled}
                onChange={() => onChange?.(option.value)}
                className={cn(
                  "h-4 w-4 shrink-0 appearance-none rounded-full border bg-white",
                  "transition-colors duration-150",
                  "checked:border-[5px] checked:border-indigo-600",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500",
                  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:border-slate-200",
                  error ? "border-red-500" : "border-slate-300"
                )}
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "text-sm text-slate-700 select-none",
                  isOptionDisabled && "cursor-not-allowed text-slate-400"
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
