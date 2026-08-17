import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { label: "Product", href: "#features" },
  { label: "Workflow", href: "#growth" },
  { label: "Pricing", href: "#pricing" },
  { label: "Stories", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink/85 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className="w-8 h-8 rounded-md bg-teal flex items-center justify-center text-ink font-bold">
            V
          </span>
          Vexez
        </Link>

        <ul className="hidden md:flex items-center gap-9 text-sm text-slate-text">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="hover:text-cream transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-text hover:text-cream transition-colors">
            Log in
          </Link>
          <Link
            to="/signUp"
            className="group inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2.5 rounded-full hover:bg-teal-glow transition-colors"
          >
            Get a demo
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-ink border-b border-white/5 px-6 pb-6 flex flex-col gap-4"
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-slate-text hover:text-cream" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            className="text-slate-text hover:text-cream"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
          <Link
            to="/signUp"
            className="bg-teal text-ink text-center font-medium px-4 py-2.5 rounded-full"
            onClick={() => setOpen(false)}
          >
            Get a demo
          </Link>
        </motion.div>
      )}
    </header>
  );
}