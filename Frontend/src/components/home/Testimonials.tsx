import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    quote:
      "The platform is incredibly easy to use, and the support team is outstanding. We launched our new store in days.",
    name: "Sarah Liam",
    role: "CEO & Managing Director",
  },
  {
    quote:
      "We tried a few other platforms before, but nothing matched the flexibility and performance we got with Vexez.",
    name: "Kevin Peterson",
    role: "Entrepreneur",
  },
  {
    quote:
      "Reporting used to take our team a whole afternoon. Now it's a single export, formatted and ready to share.",
    name: "Priya Nandan",
    role: "Operations Lead",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const r = reviews[index];

  return (
    <section id="testimonials" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal">Testimonials</span>
            <h2 className="mt-4 font-display font-semibold text-3xl sm:text-4xl tracking-tight">
              Helping e-commerce brands thrive
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-teal/40"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full bg-teal text-ink flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-white/8 bg-card p-8"
          >
            <p className="font-display text-xl sm:text-2xl leading-snug">"{r.quote}"</p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-slate-text">{r.role}</p>
              </div>
              <div className="flex gap-0.5 text-teal">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-teal" />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
