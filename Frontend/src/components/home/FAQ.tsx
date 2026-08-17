import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How can Vexez help my e-commerce business?",
    a: "Vexez is an all-in-one CRM built for e-commerce brands. It helps you track sales, manage orders, and optimize product performance from one simple dashboard.",
  },
  {
    q: "Do I need technical skills to use Vexez?",
    a: "No. Vexez is designed for store owners and teams, not engineers — setup takes minutes and the interface stays out of your way.",
  },
  {
    q: "Can Vexez scale with my growing business?",
    a: "Yes. The same dashboard handles 100 orders or 100,000, and every plan can be upgraded without migrating your data.",
  },
  {
    q: "Is my data safe with Vexez?",
    a: "All data is encrypted in transit and at rest, with role-based access control so only the right people see the right numbers.",
  },
  {
    q: "How long does it take to get started?",
    a: "Most teams are live within a day — connect your store, import your catalog, and your dashboard populates automatically.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 px-6 bg-surface/50 border-y border-white/5">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-teal">FAQ</span>
        <h2 className="mt-4 font-display font-semibold text-3xl sm:text-4xl tracking-tight">
          Have any questions?
        </h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="rounded-xl border border-white/8 bg-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-sm sm:text-base">{f.q}</span>
              <Plus
                className={`w-4 h-4 shrink-0 text-teal transition-transform duration-300 ${
                  open === i ? "rotate-45" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-slate-text leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
