import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Unlimited product listings",
  "Real-time sales dashboard",
  "Inventory management",
  "Secure checkout & SSL encryption",
  "Email marketing integration",
  "24/7 customer support",
];

const tiers = [
  { name: "Starter", monthly: 1600, yearly: 1280, highlight: false, sub: "For individuals" },
  { name: "Standard", monthly: 4995, yearly: 3996, highlight: true, sub: "For growing startups" },
  { name: "Enterprise", monthly: 9995, yearly: 7996, highlight: false, sub: "For scaled teams" },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-28 px-6 bg-surface/50 border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-teal">Pricing</span>
        <h2 className="mt-4 font-display font-semibold text-3xl sm:text-4xl tracking-tight">
          Plans for teams of any size
        </h2>
        <p className="mt-4 text-slate-text">Simple, transparent pricing — cancel any time.</p>

        <div className="mt-8 inline-flex items-center gap-1 bg-card border border-white/10 rounded-full p-1">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              !yearly ? "bg-teal text-ink" : "text-slate-text"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              yearly ? "bg-teal text-ink" : "text-slate-text"
            }`}
          >
            Yearly · save 20%
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl p-6 border ${
              t.highlight
                ? "bg-teal text-ink border-teal shadow-glow relative"
                : "bg-card border-white/8"
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 right-6 bg-ink text-teal text-xs font-mono px-3 py-1 rounded-full">
                Most popular
              </span>
            )}
            <p className={`text-sm ${t.highlight ? "text-ink/70" : "text-slate-text"}`}>{t.name}</p>
            <p className={`text-xs mt-0.5 ${t.highlight ? "text-ink/60" : "text-slate-text/70"}`}>{t.sub}</p>
            <p className="mt-4 font-display text-3xl font-semibold">
              ${(yearly ? t.yearly : t.monthly).toLocaleString()}
              <span className="text-base font-normal">/m</span>
            </p>
            <button
              className={`mt-5 w-full rounded-full py-2.5 text-sm font-medium transition-colors ${
                t.highlight
                  ? "bg-ink text-teal hover:bg-ink/80"
                  : "bg-teal text-ink hover:bg-teal-glow"
              }`}
            >
              Get started
            </button>
            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 shrink-0 ${t.highlight ? "text-ink" : "text-teal"}`} />
                  <span className={t.highlight ? "text-ink/80" : "text-slate-text"}>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
