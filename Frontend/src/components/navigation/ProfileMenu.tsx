import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings, SlidersHorizontal, UserRound } from "lucide-react";
import { cn } from "../../utils/cn";
import { Avatar } from "./Avatar";

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
}

const MOCK_USER: UserProfile = {
  name: "Admin User",
  role: "Administrator",
};

export interface ProfileMenuProps {
  user?: UserProfile;
  onProfile?: () => void;
  onAccountSettings?: () => void;
  onPreferences?: () => void;
  onLogout?: () => void;
  className?: string;
}

/**
 * ProfileMenu
 *
 * Right-most item in the header. Shows avatar + name + role + chevron on
 * larger screens, collapses to just the avatar below `sm`. Static mock
 * user for now — no auth wiring. Callbacks are exposed but left unwired
 * (`onLogout` etc.) for a future auth/session layer to hook into.
 *
 * Closes on outside click and Escape, matching the other header
 * dropdowns.
 *
 * Example:
 *   <ProfileMenu user={currentUser} onLogout={handleLogout} />
 */
export function ProfileMenu({
  user = MOCK_USER,
  onProfile,
  onAccountSettings,
  onPreferences,
  onLogout,
  className,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const menuItems = [
    { label: "Profile", icon: UserRound, onClick: onProfile },
    { label: "Account Settings", icon: Settings, onClick: onAccountSettings },
    { label: "Preferences", icon: SlidersHorizontal, onClick: onPreferences },
  ] as const;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        className={cn(
          "flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 sm:pr-3",
          "transition-colors duration-150 hover:bg-slate-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
          open && "bg-slate-100"
        )}
      >
        <Avatar name={user.name} src={user.avatarUrl} size="md" />

        <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
          <span className="truncate text-sm font-medium text-slate-800">{user.name}</span>
          <span className="truncate text-xs text-slate-400">{user.role}</span>
        </span>

        <ChevronDown
          className={cn(
            "hidden h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 sm:block",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className={cn(
            "absolute right-0 top-[calc(100%+8px)] z-20 w-56 origin-top-right",
            "rounded-xl border border-slate-200 bg-white shadow-lg",
            "animate-in fade-in zoom-in-95 duration-150"
          )}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
            <Avatar name={user.name} src={user.avatarUrl} size="md" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-slate-800">{user.name}</span>
              <span className="block truncate text-xs text-slate-400">{user.role}</span>
            </span>
          </div>

          <ul className="flex flex-col gap-0.5 p-1.5">
            {menuItems.map(({ label, icon: Icon, onClick }) => (
              <li key={label}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onClick?.();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700",
                    "hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-600",
                "hover:bg-red-50"
              )}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}