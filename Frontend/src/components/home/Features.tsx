import { motion } from "framer-motion";
import { LineChart, ClipboardList, FileOutput } from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Profit & sales tracking",
    body: "Watch revenue and profit move in real time, broken down with charts you don't have to build yourself.",
    accent: "text-teal bg-teal/10",
  },
  {
    icon: ClipboardList,
    title: "Order management",
    body: "Every order's status, from placed to delivered, updates live — no refreshing, no guessing.",
    accent: "text-clay bg-clay/10",
  },
  {
    icon: FileOutput,
    title: "Export & reporting",
    body: "Pull a clean CSV or shareable report in one click, formatted for whoever's asking.",
    accent: "text-teal bg-teal/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-teal">Core features</span>
        <h2 className="mt-4 font-display font-semibold text-3xl sm:text-4xl tracking-tight">
          A smarter way to manage your store
        </h2>
        <p className="mt-4 text-slate-text">
          One view of performance — sales, profit, and stock — updated the moment it happens.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/8 bg-card p-6 hover:border-teal/30 transition-colors"
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${f.accent}`}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="mt-5 font-display font-semibold text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-text leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
