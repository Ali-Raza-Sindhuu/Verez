import { motion } from "framer-motion";
import {
  MessageCircle,
  Flag,
  CalendarDays,
  Lightbulb,
  Check,
  Hourglass,
  Timer,
  ChevronsRight,
  Clock3,
} from "lucide-react";

const FOOTER_LINKS_LEFT = ["About Us", "Contact", "What's New", "Careers"];
const FOOTER_LINKS_RIGHT = ["Product", "Solutions", "Integrations", "Price"];

// ---------- generic floating icon tile ----------

function FloatTile({
  icon: Icon,
  bg,
  fg,
  rotate,
  delay,
  className,
  size = "h-14 w-14",
  iconSize = "h-5 w-5",
}: {
  icon: React.ElementType;
  bg: string;
  fg: string;
  rotate: number;
  delay: number;
  className: string;
  size?: string;
  iconSize?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: rotate * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className={`flex ${size} items-center justify-center rounded-2xl shadow-[0_10px_24px_rgba(0,0,0,0.08)]`}
        style={{ background: bg }}
      >
        <Icon className={iconSize} style={{ color: fg }} strokeWidth={2} />
      </motion.div>
    </motion.div>
  );
}

// ---------- the "20" numeral tile (unique, not an icon) ----------

function NumeralTile({ rotate, delay, className }: { rotate: number; delay: number; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: rotate * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex h-14 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
      >
        <span className="text-[22px] font-semibold text-[#14151A]">20</span>
      </motion.div>
    </motion.div>
  );
}

// ---------- clock-with-check tile (dark, bespoke face) ----------

function ClockCheckTile({ rotate, delay, className }: { rotate: number; delay: number; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: rotate * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14151A] shadow-[0_10px_24px_rgba(0,0,0,0.15)]"
      >
        <Clock3 className="h-5 w-5 text-white/90" strokeWidth={2} />
        <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3E9C6F] ring-2 ring-[#14151A]">
          <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="mx-6 mb-6 overflow-hidden rounded-[28px] border border-black/[0.06] bg-[#F1EEE6]">
      <div className="relative px-8 pt-12 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start"
        >
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="grid grid-cols-2 gap-[3px]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#2FA8E8]" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#14151A]" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-[#14151A]">
                Vexez
              </span>
            </div>
            <h3 className="max-w-xs text-[26px] font-semibold leading-[1.2] tracking-tight text-[#14151A] sm:text-[30px]">
              Stay organized and boost your productivity
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px]">
            <ul className="space-y-2.5">
              {FOOTER_LINKS_LEFT.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-black/55 transition hover:text-black/90"
                  >
                    <span className="text-black/30">→</span>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {FOOTER_LINKS_RIGHT.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-black/55 transition hover:text-black/90"
                  >
                    <span className="text-black/30">→</span>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* floating icon field */}
        <div className="relative mt-14 h-[240px] sm:h-[260px]">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
            }}
          />

          {/* upper row */}
          <NumeralTile rotate={-8} delay={0} className="left-[15%] top-[6%]" />
          <FloatTile
            icon={Flag}
            bg="#FFFFFF"
            fg="#3D6DF2"
            rotate={-5}
            delay={0.1}
            className="left-[38%] top-[14%]"
          />
          <FloatTile
            icon={CalendarDays}
            bg="#FFFFFF"
            fg="#14151A"
            rotate={4}
            delay={0.18}
            className="left-[57%] top-[10%]"
          />
          <FloatTile
            icon={Lightbulb}
            bg="#E8A33D"
            fg="#FFFFFF"
            rotate={6}
            delay={0.26}
            className="left-[76%] top-[16%]"
          />

          {/* lower row */}
          <FloatTile
            icon={MessageCircle}
            bg="#FFFFFF"
            fg="#14151A"
            rotate={-7}
            delay={0.06}
            className="left-[1%] top-[42%]"
            size="h-12 w-12"
            iconSize="h-4 w-4"
          />
          <FloatTile
            icon={Check}
            bg="#3D6DF2"
            fg="#FFFFFF"
            rotate={-4}
            delay={0.32}
            className="left-[16%] top-[70%]"
          />
          <ClockCheckTile rotate={4} delay={0.14} className="left-[33%] top-[56%]" />
          <FloatTile
            icon={Hourglass}
            bg="#FFFFFF"
            fg="#14151A"
            rotate={-5}
            delay={0.4}
            className="left-[51%] top-[74%]"
          />
          <FloatTile
            icon={Timer}
            bg="#FFFFFF"
            fg="#E8552F"
            rotate={5}
            delay={0.36}
            className="left-[67%] top-[62%]"
          />
          <FloatTile
            icon={ChevronsRight}
            bg="#FFFFFF"
            fg="#3D6DF2"
            rotate={-3}
            delay={0.44}
            className="left-[83%] top-[68%]"
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/[0.07] py-6 text-[11.5px] text-black/40 sm:flex-row">
          <span>© 2026. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-black/70">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black/70">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}