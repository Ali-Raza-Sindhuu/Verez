import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Select
 *
 * Native <select> styled to match InputField, used for filters, status
 * pickers, and dropdown fields in both forms and table toolbars. Registers
 * directly with React Hook Form via ref forwarding.
 *
 * Example:
 *   <Select
 *     label="Role"
 *     placeholder="Select a role"
 *     options={[{ label: "Admin", value: "admin" }, { label: "Vendor", value: "vendor" }]}
 *   />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      error,
      helperText,
      required,
      disabled,
      id,
      className,
      containerClassName,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="ml-0.5 text-red-600">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={cn(errorId, helperId) || undefined}
            defaultValue={rest.defaultValue ?? ""}
            className={cn(
              "h-10 w-full appearance-none rounded-md border bg-white pl-3 pr-9 text-sm text-slate-900",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500",
              className
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
        </div>

        {error ? (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-sm text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
