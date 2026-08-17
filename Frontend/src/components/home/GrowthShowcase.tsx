import { motion } from "framer-motion";
import { TrendingUp, Layers, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: TrendingUp,
    title: "Drive revenue with confidence",
    body: "Real-time analytics surface sales, profit margin, and product performance the instant they shift.",
  },
  {
    icon: Layers,
    title: "All-in-one, exceptionally simple",
    body: "Stay ahead of demand with trend tracking and benchmarks, without juggling five separate tools.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable, secure, and future-ready",
    body: "Recommendations tailored to your store's history, backed by infrastructure that scales with you.",
  },
];

export default function GrowthShowcase() {
  return (
    <section id="growth" className="py-28 px-6 bg-surface/50 border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight">
          Accelerate growth with a simple, smart CRM
        </h2>
        <p className="mt-4 text-slate-text">
          Everything you need to scale a store — organized, and easy to act on.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/8 bg-card p-6"
        >
          <p className="text-xs text-slate-text mb-1">Total profit overview</p>
          <p className="font-display text-3xl font-semibold">
            $96,715.28
            <span className="ml-2 text-xs font-mono text-teal align-middle">▲ 14.6%</span>
          </p>
          <div className="mt-6 h-28 flex items-end gap-2">
            {[40, 65, 35, 80, 55, 90, 60, 100, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-teal/20 to-teal"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-text">Total products</p>
              <p className="font-display text-xl font-semibold">257,361</p>
            </div>
            <span className="text-xs font-mono text-teal">+8.2%</span>
          </div>
        </motion.div>

        <div className="space-y-8">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-text leading-relaxed">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
