import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cx } from "./navConfig";

interface NavItemLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  showLabel: boolean;
  onClick?: () => void;
}

export function NavItemLink({ to, icon: Icon, label, active, showLabel, onClick }: NavItemLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active ? cx.navActive : cx.navHover
      }`}
      title={!showLabel ? label : undefined}
    >
      {active && (
        <motion.span
          layoutId="active-nav-pill"
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full ${cx.activePill}`}
        />
      )}
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {showLabel && <span className="whitespace-nowrap font-medium">{label}</span>}
    </Link>
  );
}