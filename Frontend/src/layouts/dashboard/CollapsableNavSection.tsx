import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavItemLink } from "./NavItemLink";
import { cx, type NavSection } from "./navConfig";

interface CollapsibleNavSectionProps {
  section: NavSection;
  isActive: (href: string) => boolean;
  showLabel: boolean;
  onNavigate?: () => void;
  /** Controlled from the parent — only one section is open at a time (accordion). */
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleNavSection({
  section,
  isActive,
  showLabel,
  onNavigate,
  isOpen,
  onToggle,
}: CollapsibleNavSectionProps) {
  const hasActiveItem = section.items.some((item) => isActive(item.href));

  // Icon-only rail mode (sidebar collapsed on desktop): no headers, no collapse
  // affordance — just a flat stack of icons, since there's no room for chevrons/labels.
  if (!showLabel) {
    return (
      <div className="space-y-0.5">
        {section.items.map((item) => (
          <NavItemLink
            key={item.href}
            to={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
            showLabel={false}
            onClick={onNavigate}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 mb-1.5 group transition-colors ${
          hasActiveItem
            ? "text-[var(--color-accent-primary)]"
            : `${cx.textTertiary} hover:text-[var(--color-text-secondary)]`
        }`}
        aria-expanded={isOpen}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">{section.label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-1">
              {section.items.map((item) => (
                <NavItemLink
                  key={item.href}
                  to={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  showLabel={showLabel}
                  onClick={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}