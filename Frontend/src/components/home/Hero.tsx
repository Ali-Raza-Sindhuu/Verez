import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, Package } from "lucide-react";

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function Hero() {
  const [email, setEmail] = useState("");
  const revenue = useCountUp(96715);
  const orders = useCountUp(118594);
  const products = useCountUp(257361);

  return (
    <section className="relative pt-40 pb-28 px-6 overflow-hidden">
      {/* ambient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,194,188,0.22), transparent), radial-gradient(circle at 15% 20%, rgba(231,113,74,0.08), transparent 40%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(30,194,188,0.35) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(to bottom, black, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-teal border border-teal/25 bg-teal/5 px-3 py-1.5 rounded-full"
        >
          Trusted by 20,000+ storefronts
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight"
        >
          Run inventory like it
          <br />
          <span className="text-teal">runs itself.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-6 text-slate-text text-lg max-w-xl mx-auto"
        >
          Vexez tracks sales, profit, and stock in one live dashboard — built for
          teams who'd rather ship orders than reconcile spreadsheets.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email"
            className="w-full sm:w-72 bg-card border border-white/10 rounded-full px-5 py-3 text-sm placeholder:text-slate-text/60 focus:outline-none focus:ring-2 focus:ring-teal/60"
          />
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-teal text-ink font-medium px-6 py-3 rounded-full hover:bg-teal-glow transition-colors whitespace-nowrap"
          >
            Request a demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>
      </div>

      {/* dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="relative max-w-5xl mx-auto mt-20 rounded-2xl border border-white/10 bg-card/80 backdrop-blur shadow-glow p-4 sm:p-6"
      >
        <div className="flex items-center gap-1.5 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-clay/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-teal/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <div className="flex items-center gap-2 text-xs text-slate-text mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-teal" /> Net profit
            </div>
            <div className="font-display text-2xl font-semibold">
              ${revenue.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <div className="flex items-center gap-2 text-xs text-slate-text mb-2">
              <Package className="w-3.5 h-3.5 text-clay" /> Orders processed
            </div>
            <div className="font-display text-2xl font-semibold">
              {orders.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <div className="flex items-center gap-2 text-xs text-slate-text mb-2">
              <Package className="w-3.5 h-3.5 text-teal" /> Products tracked
            </div>
            <div className="font-display text-2xl font-semibold">
              {products.toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
