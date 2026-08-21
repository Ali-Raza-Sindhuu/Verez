import { useState, useEffect } from "react";
import { motion, useMotionValue, animate, delay } from "framer-motion";

/**
 * VEXEZ — shared design tokens & helpers
 * Palette: ink (#14151A), porcelain (#F6F4EF), signal amber (#E8A33D),
 * ledger green (#3E7C59), wire blue (#3D6DF2)
 * Import { fadeUp, useCountUp, LedgerRing, useLiveTimer } from "./lib/shared"
 * in any section file that needs them.
 */

// ---------- count-up number animation ----------

export function useCountUp(target: number, durationMs = 1200) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, target, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return display;
}

// ---------- shared scroll/stagger variant ----------

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

// ---------- decorative ring (used in ActivityCard) ----------

export function LedgerRing({
  segments,
}: {
  segments: { value: number; color: string }[];
}) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  const r = 30;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#EDEAE1" strokeWidth="7" />
      {segments.map((s, i) => {
        const frac = s.value / total;
        const dash = frac * c;
        const el = (
          <motion.circle
            key={i}
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            initial={{ strokeDasharray: `0 ${c}` }}
            animate={{ strokeDasharray: `${dash} ${c - dash}` }}
            transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ---------- live-ticking timer (used in TimeTrackerCard) ----------

export function useLiveTimer(running: boolean) {
  const [seconds, setSeconds] = useState(15718); // 04:21:58
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ---------- floating card wrapper (used in Hero) ----------

export function FloatCard({
  children,
  className = "",
  delay = 0,
  rotate = 0,
  floatDistance = 8,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
  floatDistance?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotate * 1.4 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -floatDistance, 0] }}
        transition={{
          duration: 4.5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}