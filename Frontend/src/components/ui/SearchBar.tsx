import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  shortcutLabel?: string;
  className?: string;
}

/**
 * SearchBar
 *
 * Global search field for the dashboard header. Presentational only —
 * not wired to any search API yet. Controlled if `value`/`onChange` are
 * passed, otherwise falls back to internal state so it can be dropped in
 * standalone.
 *
 * Shows a keyboard-shortcut hint ("⌘K") when idle and unfocused, and a
 * clear ("x") button once there's text. Width is responsive: full-width
 * on mobile, capped between ~300–450px from `sm` up.
 *
 * Example:
 *   <SearchBar placeholder="Search anything..." onChange={setQuery} />
 */
export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search anything...",
  shortcutLabel = "⌘K",
  className,
  ...inputProps
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleClear = () => {
    handleChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  // Optional convenience: focus the field on Ctrl/Cmd+K, matching the hint.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3",
        "transition-colors duration-150",
        "sm:w-[300px] sm:max-w-[450px] lg:w-[360px]",
        focused && "border-orange-300 bg-white ring-2 ring-orange-100",
        className
      )}
    >
      <Search
        className={cn("h-4 w-4 shrink-0 transition-colors", focused ? "text-orange-500" : "text-slate-400")}
        aria-hidden="true"
      />

      <input
        {...inputProps}
        ref={inputRef}
        type="text"
        role="searchbox"
        aria-label={placeholder}
        value={currentValue}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400",
          "focus:outline-none"
        )}
      />

      {currentValue ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400",
            "hover:bg-slate-200 hover:text-slate-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : (
        !focused && (
          <kbd
            className={cn(
              "hidden shrink-0 items-center rounded border border-slate-200 bg-white px-1.5 py-0.5",
              "text-[11px] font-medium text-slate-400 sm:flex"
            )}
          >
            {shortcutLabel}
          </kbd>
        )
      )}
    </div>
  );
}