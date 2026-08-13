import { forwardRef, type InputHTMLAttributes } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  loading?: boolean;
  onClear?: () => void;
  containerClassName?: string;
}

/**
 * SearchInput
 *
 * Search box used in table toolbars, product listings, and filter panels.
 * Debouncing is left to the caller (e.g. via a useDebouncedValue hook) so
 * this component stays a pure controlled input — pass `value`/`onChange`
 * as usual and debounce upstream before firing a request.
 *
 * Example:
 *   <SearchInput
 *     value={query}
 *     onChange={(e) => setQuery(e.target.value)}
 *     onClear={() => setQuery("")}
 *     loading={isSearching}
 *     placeholder="Search products..."
 *   />
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { loading = false, onClear, value, className, containerClassName, ...rest },
    ref
  ) => {
    const hasValue = typeof value === "string" && value.length > 0;

    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />

        <input
          ref={ref}
          type="search"
          value={value}
          role="searchbox"
          className={cn(
            "h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-900",
            "placeholder:text-slate-400",
            "transition-colors duration-150",
            "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            className
          )}
          {...rest}
        />

        <div className="absolute right-3 flex items-center">
          {loading ? (
            <Loader2
              className="h-4 w-4 animate-spin text-slate-400"
              aria-label="Searching"
            />
          ) : (
            hasValue &&
            onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear search"
                className={cn(
                  "rounded-md p-0.5 text-slate-400",
                  "hover:text-slate-600",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
