import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { SearchBar } from "../ui/SearchBar";
import { ThemeToggle, type Theme } from "../navigation/ThemeToggle";
import { MessageMenu, type MessagePreview } from "../navigation/MessageMenu";
import { NotificationMenu, type NotificationItem } from "../navigation/NotificationMenu";
import { CalendarMenu, type UpcomingEvent } from "../navigation/CalendarMenu";
import { ProfileMenu, type UserProfile } from "../navigation/ProfileMenu";

export interface HeaderProps {
  /** Search — controlled if both are passed, otherwise SearchBar manages its own state. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  /** Theme — controlled if both are passed, otherwise ThemeToggle manages its own state. */
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;

  /** Mock data overrides — default to built-in placeholders when omitted. */
  messages?: MessagePreview[];
  notifications?: NotificationItem[];
  events?: UpcomingEvent[];
  user?: UserProfile;

  /** Navigation callbacks, left unwired until routes/APIs exist. */
  onViewAllMessages?: () => void;
  onViewAllNotifications?: () => void;
  onProfile?: () => void;
  onAccountSettings?: () => void;
  onPreferences?: () => void;
  onLogout?: () => void;

  className?: string;
}

/**
 * Header (Topbar)
 *
 * Full dashboard topbar: global search on the left,
 * theme/messages/notifications/calendar/profile on the right. UI only —
 * no API calls, auth, or RBAC. All dynamic content (messages,
 * notifications, events, user) is mock data by default and swappable
 * via props so a future data layer can feed it without touching this
 * component's markup.
 *
 * Rendered as a floating white card — offset from the top and right
 * edges of its container (parent should give it left-side breathing
 * room too, or set that here as needed) so it reads as detached from
 * the page background rather than a full-bleed bar.
 *
 * Sidebar toggling is handled elsewhere (not this component) — see the
 * separate sidebar-control plans.
 *
 * Responsive behavior:
 *  - Desktop (lg+): everything, including Calendar.
 *  - Tablet (sm–lg): Calendar hidden; Messages/Notifications/Profile/Search remain.
 *  - Mobile (<sm): Messages hidden; search collapses to an icon that
 *    expands into a full-width overlay bar; Profile shows avatar only.
 *
 * Example:
 *   <Header searchValue={query} onSearchChange={setQuery} />
 */
export function Header({
  searchValue,
  onSearchChange,
  theme,
  onThemeChange,
  messages,
  notifications,
  events,
  user,
  onViewAllMessages,
  onViewAllNotifications,
  onProfile,
  onAccountSettings,
  onPreferences,
  onLogout,
  className,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-3 z-10 mr-3 flex h-16 shrink-0 items-center gap-2 rounded-2xl bg-white px-3 shadow-sm sm:px-4 dark:bg-[#242745]",
        className
      )}
    >
      {mobileSearchOpen ? (
        <div className="flex w-full items-center gap-2 sm:hidden">
          <SearchBar value={searchValue} onChange={onSearchChange} className="w-full" />
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500",
              "hover:bg-slate-100 hover:text-slate-800",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
            )}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          {/* Left: search */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {/* Full search bar from sm and up */}
            <div className="hidden min-w-0 sm:block">
              <SearchBar value={searchValue} onChange={onSearchChange} />
            </div>

            {/* Compact search trigger on mobile only */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 sm:hidden",
                "hover:bg-slate-100 hover:text-slate-800",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
              )}
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>

          {/* Right: theme, messages, notifications, calendar, profile */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <ThemeToggle theme={theme} onChange={onThemeChange} />

            <div className="hidden sm:block">
              <MessageMenu messages={messages} onViewAll={onViewAllMessages} />
            </div>

            <NotificationMenu notifications={notifications} onViewAll={onViewAllNotifications} />

            <div className="hidden lg:block">
              <CalendarMenu events={events} />
            </div>

            <div className="ml-1 h-6 w-px bg-slate-200" aria-hidden="true" />

            <ProfileMenu
              user={user}
              onProfile={onProfile}
              onAccountSettings={onAccountSettings}
              onPreferences={onPreferences}
              onLogout={onLogout}
            />
          </div>
        </>
      )}
    </header>
  );
}