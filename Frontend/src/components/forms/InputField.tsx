import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  containerClassName?: string;
}

/**
 * InputField
 *
 * Standard text input used in forms across the platform (auth, checkout,
 * admin CRUD forms, filters, etc). Designed to be registered directly with
 * React Hook Form via ref forwarding, e.g.:
 *
 *   <InputField label="Email" type="email" {...register("email")} error={errors.email?.message} />
 *
 * Example:
 *   <InputField
 *     label="Email"
 *     type="email"
 *     placeholder="Enter email"
 *     error="Invalid email"
 *   />
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
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
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="ml-0.5 text-red-600">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <span
              className="pointer-events-none absolute left-3 flex items-center text-slate-400"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={cn(errorId, helperId) || undefined}
            className={cn(
              "h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900",
              "placeholder:text-slate-400",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              icon && "pl-9",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500",
              className
            )}
            {...rest}
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

InputField.displayName = "InputField";
