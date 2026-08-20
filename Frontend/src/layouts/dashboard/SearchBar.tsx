import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { sections, bottomNav, cx, type NavItem } from "./navConfig";

const allItems: NavItem[] = [...sections.flatMap((s) => s.items), ...bottomNav];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  // Global Cmd/Ctrl+K to focus search from anywhere on the dashboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  function select(item: NavItem) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    navigate(item.href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[highlighted]);
    }
  }

  return (
    <div className="relative w-full max-w-xs hidden sm:block" ref={wrapRef}>
      <div
        className={`flex items-center gap-2 border rounded-full px-3.5 py-2 w-full bg-[var(--color-surface-alt)] transition-colors ${
          open ? "border-[var(--color-accent-primary)]/40" : cx.border
        }`}
      >
        <Search className={`w-4 h-4 shrink-0 ${cx.textTertiary}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks, projects..."
          className={`bg-transparent text-sm focus:outline-none w-full ${cx.textPrimary} placeholder:text-[var(--color-text-tertiary)]`}
        />
        {!query && (
          <kbd
            className={`hidden md:inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium shrink-0 ${cx.border} ${cx.textTertiary}`}
          >
            ⌘K
          </kbd>
        )}
      </div>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full left-0 right-0 mt-1.5 rounded-xl border py-1.5 z-50 ${cx.dropdown}`}
          >
            {results.length === 0 ? (
              <p className={`px-3 py-4 text-center text-[13px] ${cx.textTertiary}`}>
                No results for "{query}"
              </p>
            ) : (
              results.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => select(item)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${
                      i === highlighted
                        ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
                        : `${cx.textSecondary} hover:bg-[var(--color-surface-alt)]`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {i === highlighted && <CornerDownLeft className="w-3 h-3 shrink-0 opacity-60" />}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}