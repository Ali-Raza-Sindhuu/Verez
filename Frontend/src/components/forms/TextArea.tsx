import { forwardRef, useId, useState, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  containerClassName?: string;
}

/**
 * TextArea
 *
 * Multi-line text input used for descriptions, notes, and review/comment
 * fields. Registers directly with React Hook Form via ref forwarding.
 *
 * Example:
 *   <TextArea
 *     label="Product description"
 *     placeholder="Describe the product"
 *     maxLength={500}
 *     showCharacterCount
 *   />
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      disabled,
      id,
      className,
      containerClassName,
      maxLength,
      showCharacterCount = false,
      onChange,
      defaultValue,
      value,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    // Only used for the character counter when the component is uncontrolled.
    // When `value` is passed (controlled usage, e.g. via React Hook Form),
    // the count derives from that prop instead.
    const [internalValue, setInternalValue] = useState(
      typeof defaultValue === "string" ? defaultValue : ""
    );

    const currentLength =
      typeof value === "string" ? value.length : internalValue.length;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="ml-0.5 text-red-600">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error || undefined}
          aria-describedby={cn(errorId, helperId) || undefined}
          onChange={(event) => {
            if (value === undefined) {
              setInternalValue(event.target.value);
            }
            onChange?.(event);
          }}
          className={cn(
            "min-h-24 w-full resize-y rounded-md border bg-white px-3 py-2 text-sm text-slate-900",
            "placeholder:text-slate-400",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500",
            className
          )}
          {...rest}
        />

        <div className="flex items-start justify-between gap-2">
          <div>
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

          {showCharacterCount && maxLength && (
            <span className="shrink-0 text-xs text-slate-400">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";