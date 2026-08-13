import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "../../utils/cn";

export type Theme = "light" | "dark";

export interface ThemeToggleProps {
  /** Controlled theme; omit to let the component manage its own state. */
  theme?: Theme;
  /** Called with the next theme whenever the toggle is clicked. */
  onChange?: (theme: Theme) => void;
  className?: string;
}

/**
 * ThemeToggle
 *
 * Sun/Moon switch for the header. The app is light-mode only for now —
 * this component does not touch `document.documentElement` or any
 * global theme context. It just tracks/reports the intended theme so a
 * future ThemeProvider can wire `onChange` up to real dark-mode logic.
 *
 * Works controlled (`theme`/`onChange`) or uncontrolled (drop it in
 * with no props and it manages its own local state).
 *
 * Example:
 *   <ThemeToggle onChange={(next) => console.log("would switch to", next)} />
 */
export function ThemeToggle({ theme, onChange, className }: ThemeToggleProps) {
  const [internalTheme, setInternalTheme] = useState<Theme>("light");

  const isControlled = theme !== undefined;
  const currentTheme = isControlled ? theme : internalTheme;
  const isDark = currentTheme === "dark";

  const handleClick = () => {
    const next: Theme = isDark ? "light" : "dark";
    if (!isControlled) setInternalTheme(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-slate-500",
        "transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-200",
          isDark ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-200",
          isDark ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
        aria-hidden="true"
      />
    </button>
  );
}