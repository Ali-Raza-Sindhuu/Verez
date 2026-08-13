import { Sun, Moon } from "lucide-react";
import { cn } from "../../utils/cn";

export type Theme = "light" | "dark";

export interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  className?: string;
}

/**
 * ThemeToggle
 *
 * Sun/dot/moon switch matching the ECOMS topbar reference. Controlled
 * component — theme state and persistence (e.g. localStorage, a
 * ThemeProvider, or a `dark` class on <html>) are owned by the caller.
 *
 * Example:
 *   const [theme, setTheme] = useState<Theme>("light");
 *   <ThemeToggle theme={theme} onChange={setTheme} />
 */
export function ThemeToggle({ theme, onChange, className }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5",
        "dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        aria-label="Light mode"
        onClick={() => onChange("light")}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          !isDark ? "text-amber-500" : "text-slate-400"
        )}
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => onChange(isDark ? "light" : "dark")}
        className={cn(
          "relative flex h-4 w-8 items-center rounded-full transition-colors duration-150",
          isDark ? "bg-slate-600" : "bg-orange-500"
        )}
      >
        <span
          className={cn(
            "absolute h-3 w-3 rounded-full bg-white shadow transition-transform duration-150",
            isDark ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        aria-label="Dark mode"
        onClick={() => onChange("dark")}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          isDark ? "text-slate-200" : "text-slate-400"
        )}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}