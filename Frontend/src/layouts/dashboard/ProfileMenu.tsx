import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { UserCircle, Settings, LogOut, ChevronRight, ChevronDown } from "lucide-react";
import { cx } from "./navConfig";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectAuthUser, logoutUser } from "@/store/features/auth/authSlice";

interface ProfileMenuProps {
  active?: boolean;
  showLabel: boolean;
  onNavigate?: () => void;
  /** 'sidebar' = full row trigger, dropdown opens up/left. 'topbar' = compact trigger, dropdown opens down/right. */
  variant?: "sidebar" | "topbar";
}

export function ProfileMenu({
  active = false,
  showLabel,
  onNavigate,
  variant = "sidebar",
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const name = user?.name ?? "";
  const email = user?.email ?? "";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(path: string) {
    setOpen(false);
    onNavigate?.();
    navigate(path);
  }

  async function handleLogout() {
    setOpen(false);
    onNavigate?.();
    await dispatch(logoutUser());
    navigate("/login");
  }

  const initials = name
    ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "";

  const menuContent = (
    <>
      <div className={`px-3 py-2.5 border-b ${cx.border}`}>
        <p className={`text-sm font-medium truncate ${cx.textPrimary}`}>{name}</p>
        <p className={`text-xs truncate mt-0.5 ${cx.textTertiary}`}>{email}</p>
      </div>

      <div className="py-1">
        <button
          onClick={() => go("/dashboard/profile")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
        >
          <UserCircle className="w-3.5 h-3.5" />
          View profile
        </button>
        <button
          onClick={() => go("/dashboard/settings")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>
      </div>

      <div className={`h-px my-1 ${cx.border} border-t`} />

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-accent-danger)] hover:bg-[var(--color-accent-danger)]/10 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        Log out
      </button>
    </>
  );

  if (variant === "topbar") {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-colors ${
            open ? cx.navActive : cx.navHover
          }`}
          aria-expanded={open}
          aria-label="Account menu"
        >
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold ${cx.avatar}`}>
            {initials}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 hidden sm:block transition-transform ${cx.textTertiary} ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-full right-0 mt-1.5 w-56 rounded-xl border py-1.5 z-50 ${cx.dropdown}`}
            >
              {menuContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // sidebar variant
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
          active || open ? cx.navActive : cx.navHover
        }`}
        title={!showLabel ? "Profile" : undefined}
        aria-expanded={open}
      >
        {(active || open) && (
          <motion.span
            layoutId="active-nav-pill"
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full ${cx.activePill}`}
          />
        )}
        <span className={`w-[18px] h-[18px] shrink-0 rounded-full border flex items-center justify-center overflow-hidden ${cx.avatar}`}>
          <UserCircle className="w-full h-full" strokeWidth={1.5} />
        </span>
        {showLabel && (
          <>
            <span className="whitespace-nowrap font-medium truncate min-w-0">{name.split(" ")[0]}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 ml-auto shrink-0 transition-transform ${cx.textTertiary} ${open ? "rotate-90" : ""}`}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bottom-full left-0 mb-1.5 w-56 rounded-xl border py-1.5 z-50 ${cx.dropdown}`}
          >
            {menuContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}