import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronsLeft } from "lucide-react";
import { NavItemLink } from "./NavItemLink";
import { CollapsibleNavSection } from "./CollapsableNavSection";
import { SemesterDropdown } from "./SemesteDropdown";
import { ProfileMenu } from "./ProfileMenu";
import { sections, bottomNav, semesters, cx } from "./navConfig";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (fn: (c: boolean) => boolean) => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  semester: string;
  setSemester: (s: string) => void;
  isActive: (href: string) => boolean;
  sidebarWidth: number;
  showLabels: boolean;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  isMobile,
  mobileOpen,
  setMobileOpen,
  semester,
  setSemester,
  isActive,
  sidebarWidth,
  showLabels,
}: SidebarProps) {
  const profileActive = isActive("/dashboard/profile");
  const closeMobile = () => isMobile && setMobileOpen(false);

  // Accordion: only one section open at a time. Defaults to whichever
  // section contains the currently active route.
  const activeSectionLabel =
    sections.find((s) => s.items.some((item) => isActive(item.href)))?.label ?? sections[0].label;

  const [openSection, setOpenSection] = useState<string>(activeSectionLabel);

  // If navigation moves the active route into a different section, follow it
  // (e.g. clicking a link elsewhere, browser back/forward, deep link).
  useEffect(() => {
    setOpenSection(activeSectionLabel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionLabel]);

  return (
    <motion.aside
      animate={{ width: isMobile ? (mobileOpen ? 248 : 0) : sidebarWidth }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`fixed md:sticky top-0 h-screen z-50 border-r flex flex-col overflow-hidden transition-colors duration-300 ${cx.surface} ${cx.border} ${
        isMobile && !mobileOpen ? "pointer-events-none" : ""
      }`}
    >
      <div className={`flex items-center h-16 px-4 border-b shrink-0 ${cx.border}`}>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight shrink-0 min-w-0"
        >
          <span className="w-8 h-8 rounded-md bg-[var(--color-accent-primary)] flex items-center justify-center text-white font-bold shrink-0">
            V
          </span>
          {showLabels && <span className="whitespace-nowrap truncate">Vexez</span>}
        </Link>

        {/* Collapse toggle lives up top, next to the brand — not a standalone bottom button. */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`ml-auto shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${cx.navHover}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <SemesterDropdown semester={semester} semesters={semesters} onSelect={setSemester} showLabel={showLabels} />

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {sections.map((section) => (
          <CollapsibleNavSection
            key={section.label}
            section={section}
            isActive={isActive}
            showLabel={showLabels}
            onNavigate={closeMobile}
            isOpen={openSection === section.label}
            onToggle={() =>
              setOpenSection((current) => (current === section.label ? "" : section.label))
            }
          />
        ))}
      </nav>

      <div className={`p-3 border-t shrink-0 space-y-0.5 ${cx.border}`}>
        {bottomNav.map((item) => (
          <NavItemLink
            key={item.href}
            to={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
            showLabel={showLabels}
            onClick={closeMobile}
          />
        ))}

        {/* Profile sits at the very bottom, in place of a standalone collapse button. */}
        <ProfileMenu active={profileActive} showLabel={showLabels} onNavigate={closeMobile} />
      </div>
    </motion.aside>
  );
}