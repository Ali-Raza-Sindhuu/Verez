import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import heroImg from "@/assets/hero.png";

interface HomeLoaderProps {
  onComplete: () => void;
}

// Home-page-only intro. Not used anywhere else in the app — DashboardLayout,
// ProtectedRoute, etc. keep their own separate LoadingScreen. This one exists
// purely to give the marketing page a branded first-paint moment: the same
// 4-dot Vexez mark used in the Navbar/Footer/DashboardMock, animated in with
// GSAP, with hero.png revealed softly behind it for depth, then handed off
// to Framer Motion for the exit transition into the actual page.
export function HomeLoader({ onComplete }: HomeLoaderProps) {
  const [percent, setPercent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const dotsRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef({ value: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Skip the animated sequence entirely — jump straight to done.
      setPercent(100);
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 300);
      }, 200);
      return () => clearTimeout(t);
    }

    const dots = dotsRef.current?.querySelectorAll<HTMLSpanElement>("[data-dot]") ?? [];
    const letters = wordRef.current?.querySelectorAll<HTMLSpanElement>("[data-letter]") ?? [];

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        // Small hold at 100% so the number is actually readable before exit.
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 500);
        }, 350);
      },
    });

    // Background image: soft, blurred reveal behind the mark for atmosphere.
    tl.fromTo(
      bgRef.current,
      { opacity: 0, scale: 1.15 },
      { opacity: 0.14, scale: 1, duration: 1.4, ease: "power2.out" },
      0
    );

    // The 4 brand dots — staggered elastic pop-in, one at a time, same
    // reading order as the static VexezMark (top-left, top-right, then
    // bottom row), so it reads as "the logo assembling itself".
    tl.fromTo(
      dots,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.55,
        stagger: 0.11,
        ease: "back.out(2.6)",
      },
      0.15
    );

    // Wordmark letters rise in right after the dots settle.
    tl.fromTo(
      letters,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: "power2.out" },
      0.55
    );

    // Progress bar fill + numeric counter, driven by the same tween so they
    // stay perfectly in sync.
    tl.to(
      counterRef.current,
      {
        value: 100,
        duration: 1.3,
        ease: "power1.inOut",
        onUpdate: () => setPercent(Math.round(counterRef.current.value)),
      },
      0.75
    );
    tl.fromTo(
      barFillRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.3, ease: "power1.inOut", transformOrigin: "left center" },
      0.75
    );

    // Gentle continuous pulse on the dots while the bar fills, so the mark
    // doesn't just sit static for the ~1.3s the counter takes.
    tl.to(
      dots,
      { scale: 1.15, duration: 0.5, stagger: { each: 0.08, repeat: 3, yoyo: true }, ease: "sine.inOut" },
      0.9
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const word = "Vexez";

  return (
    <motion.div
      initial={false}
      animate={exiting ? { opacity: 0, scale: 1.04, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#F6F4EF]"
      aria-hidden={exiting}
    >
      {/* Soft atmospheric image reveal behind the mark */}
      <img
        ref={bgRef}
        src={heroImg}
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover opacity-0 blur-2xl"
      />

      <div className="relative flex flex-col items-center">
        {/* 4-dot brand mark, same grid layout as VexezMark, scaled up */}
        <div ref={dotsRef} className="mb-6 grid grid-cols-2 gap-2">
          <span data-dot className="h-3.5 w-3.5 rounded-full bg-[#3D6DF2]" />
          <span data-dot className="h-3.5 w-3.5 rounded-full bg-[#14151A]" />
          <span data-dot className="h-3.5 w-3.5 rounded-full bg-[#14151A]" />
          <span data-dot className="h-3.5 w-3.5 rounded-full bg-[#14151A]" />
        </div>

        {/* Wordmark, letter-by-letter reveal */}
        <span ref={wordRef} className="mb-8 flex text-2xl font-semibold tracking-tight text-[#14151A]">
          {word.split("").map((ch, i) => (
            <span key={i} data-letter className="inline-block">
              {ch}
            </span>
          ))}
        </span>

        {/* Progress bar + percentage */}
        <div className="flex w-40 flex-col items-center gap-2">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-black/[0.08]">
            <div ref={barFillRef} className="h-full w-full origin-left scale-x-0 rounded-full bg-[#3D6DF2]" />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-black/40">{percent}%</span>
        </div>
      </div>
    </motion.div>
  );
}
