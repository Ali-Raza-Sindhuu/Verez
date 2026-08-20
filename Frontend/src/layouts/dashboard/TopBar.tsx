import { Menu, Sun, Moon } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";
import { cx, type Theme } from "./navConfig";

interface TopbarProps {
  isMobile: boolean;
  onToggleMobileSidebar: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Topbar({ isMobile, onToggleMobileSidebar, theme, onToggleTheme }: TopbarProps) {
  return (
    <header
      className={`sticky top-0 z-30 h-16 border-b backdrop-blur-md flex items-center justify-between px-4 md:px-6 gap-4 transition-colors duration-300 ${cx.surface}/85 ${cx.border}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isMobile && (
          <button className="shrink-0" onClick={onToggleMobileSidebar} aria-label="Toggle sidebar">
            <Menu className="w-5 h-5" />
          </button>
        )}

        <SearchBar />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleTheme}
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${cx.navHover}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        <NotificationsMenu />

        <ProfileMenu variant="topbar" showLabel={false} />
      </div>
    </header>
  );
}