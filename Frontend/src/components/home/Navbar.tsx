import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Features", "Solutions", "Resources", "Pricing"];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 border-b border-black/[0.06] bg-white px-8 py-4"
    >
      {/* 3-column grid keeps nav links visually centered regardless of side widths */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center md:grid-cols-[1fr_auto_1fr]">
        {/* logo */}
        <Link to="/" className="flex items-center gap-2 justify-self-start">
          <div className="grid grid-cols-2 gap-[3px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#2FA8E8]" />
            <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
            <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
            <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#14151A]">
            Vexez
          </span>
        </Link>

        {/* centered nav links */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l}
              to="#"
              className="text-[14px] text-[#5B5D66] transition-colors hover:text-[#14151A]"
            >
              {l}
            </Link>
          ))}
        </nav>

        {/* actions */}
        <div className="hidden items-center gap-5 justify-self-end md:flex">
          <Link
            to="/login"
            className="text-[14px] text-[#5B5D66] transition-colors hover:text-[#14151A]"
          >
            Sign in
          </Link>
          <Link
            to="#"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg border border-black/10 bg-white px-4 py-[7px] text-[13.5px] font-medium text-[#14151A] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.02]"
          >
            Get demo
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          className="justify-self-end p-1 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {open ? (
                <X className="h-5 w-5 text-[#14151A]" />
              ) : (
                <Menu className="h-5 w-5 text-[#14151A]" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-4 pb-2 pt-5">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to="#"
                    className="text-[14.5px] text-[#3A3C44] hover:text-[#14151A]"
                  >
                    {l}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-1 flex items-center gap-4 border-t border-black/[0.06] pt-4">
                <Link
                  to="/login"
                  className="text-[14px] text-[#3A3C44] hover:text-[#14151A]"
                >
                  Sign in
                </Link>
                <Link
                  to="#"
                  className="rounded-lg border border-black/10 bg-white px-4 py-2 text-[13.5px] font-medium text-[#14151A] shadow-sm"
                >
                  Get demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}