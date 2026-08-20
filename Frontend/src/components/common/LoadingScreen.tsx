"use client";

import { motion } from "framer-motion";

// Replace these with your actual image URLs (course thumbnails, abstract visuals, etc.)
const TILE_IMAGES = [
  "/images/vexez-tile-1.svg",
  "/images/vexez-tile-2.svg",
  "/images/vexez-tile-3.svg",
  "/images/vexez-tile-4.svg",
  "/images/vexez-tile-5.svg",
  "/images/vexez-tile-6.svg",
  "/images/vexez-tile-7.svg",
  "/images/vexez-tile-8.svg",
  "/images/vexez-tile-9.svg",
];

export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Futuristic background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-[var(--color-accent-primary)]/10 blur-3xl" />
      </div>

      {/* Optional scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-accent-primary) 2px, var(--color-accent-primary) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Knowledge Grid */}
        <div className="grid grid-cols-3 gap-3">
          {TILE_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              className="relative h-16 w-16 overflow-hidden rounded-xl border border-[var(--color-accent-primary)]/30 bg-[var(--color-bg-elevated)]"
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.08 * i,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                scale: 1.06,
                borderColor: "var(--color-accent-primary)",
                boxShadow: "0 0 18px var(--color-accent-primary)",
              }}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover opacity-90"
              />
              {/* Subtle overlay gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--color-accent-primary)]/10 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Central brand + text */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base font-bold tracking-[0.25em] uppercase text-[var(--color-text-primary)]"
          >
            Vexez
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-text-tertiary)]"
          >
            Initializing learning engine
          </motion.div>
        </div>

        {/* Bold progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "10rem" }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--color-accent-primary)]"
            animate={{ x: ["-100%", "300%"] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}