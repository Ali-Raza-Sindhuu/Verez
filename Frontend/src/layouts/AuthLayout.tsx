import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { GithubIcon, GoogleIcon } from "@/components/icons/SocialIcons";
import { VexezMark } from "@/components/common/Logo";

/**
 * Shared building blocks for every auth page (Login, SignUp, ForgotPassword,
 * ResetPassword). Import from here instead of redefining the mark, motion
 * variants, card shell, and dotted backdrop in every page file.
 */

// ---------------------------------------------------------------------------
// Motion variants — shared across all auth pages
// ---------------------------------------------------------------------------

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: i * 0.08,
    },
  }),
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// ---------------------------------------------------------------------------
// Brand mark
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Password strength "check chip"
// ---------------------------------------------------------------------------

export function CheckChip({ met }: { met: boolean }) {
  return (
    <span
      className={`flex items-center justify-center w-4 h-4 rounded-md transition-colors duration-200 ${
        met ? "bg-[#3E7C59]" : "bg-black/10"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-2.5 h-2.5 transition-colors duration-200 ${
          met ? "text-white" : "text-transparent"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export function passwordRequirements(password: string) {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One number", met: /\d/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
  ];
}

// ---------------------------------------------------------------------------
// OAuth buttons
// ---------------------------------------------------------------------------



export function OAuthButtons({
  onGoogle,
  onGithub,
}: {
  onGoogle?: () => void;
  onGithub?: () => void;
}) {
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onGoogle}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white text-[#14151A] text-sm font-medium py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-black/[0.02] transition-colors"
      >
        <GoogleIcon />
        Google
      </button>

      <button
        type="button"
        onClick={onGithub}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white text-[#14151A] text-sm font-medium py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-black/[0.02] transition-colors"
      >
        <GithubIcon />
        GitHub
      </button>
    </div>
  );
}

export function OrDivider({
  label = "or continue with",
}: {
  label?: string;
}) {
  return (
    <div className="w-full flex items-center gap-3 my-6">
      <span className="h-px flex-1 bg-black/10" />
      <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] text-black/50">
        {label}
      </span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline error banner
// ---------------------------------------------------------------------------

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="text-[13px] text-[#E24A3A] bg-[#E24A3A]/[0.06] border border-[#E24A3A]/20 rounded-lg px-3 py-2"
    >
      {message}
    </motion.p>
  );
}

// ---------------------------------------------------------------------------
// Primary CTA button
// ---------------------------------------------------------------------------

export function PrimaryButton({
  children,
  disabled,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3D6DF2] text-white font-medium text-sm py-2.5 shadow-[0_10px_24px_rgba(61,109,242,0.3)] hover:bg-[#3159d9] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {children}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Dotted-grid backdrop
// ---------------------------------------------------------------------------

export function DottedBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        className="h-[560px] w-[560px] sm:h-[640px] sm:w-[640px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent 75%)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AuthLayout
// ---------------------------------------------------------------------------

type SplitPanelProps = {
  src: string;
  poster: string;
  badge: string;
  heading: string;
  points: string[];
};

function SplitVideoPanel({
  src,
  poster,
  badge,
  heading,
  points,
}: SplitPanelProps) {
  return (
    <div className="hidden lg:block lg:w-[44%] relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,21,26,0.75) 0%, rgba(20,21,26,0.55) 45%, rgba(20,21,26,0.88) 100%), radial-gradient(ellipse 80% 60% at 30% 20%, rgba(61,109,242,0.35), transparent)",
        }}
      />

      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 30% 30%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 30% 30%, black, transparent 75%)",
        }}
      />

      <div className="relative h-full flex flex-col justify-center px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        >
          <VexezMark className="[&_span]:text-white" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-8 w-fit rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-white/80"
        >
          {badge}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className="mt-6 font-semibold tracking-tight text-3xl leading-snug max-w-sm text-white"
        >
          {heading}
        </motion.h2>

        <motion.ul
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mt-10 space-y-4"
        >
          {points.map((p, i) => (
            <motion.li
              key={p}
              variants={fadeUp}
              custom={i}
              className="flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-[#3D6DF2]/25 text-[#8FADFB] flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>

              <span className="text-sm text-white/75">{p}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

export function AuthLayout({
  children,
  variant = "centered",
  video,
  cardClassName = "",
}: {
  children: ReactNode;
  variant?: "centered" | "split";
  video?: SplitPanelProps;
  cardClassName?: string;
}) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={`relative w-full max-w-sm sm:max-w-md rounded-3xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-8 ${cardClassName}`}
    >
      {children}
    </motion.div>
  );

  if (variant === "split" && video) {
    return (
      <div className="min-h-screen w-full bg-[#F6F4EF] flex">
        <SplitVideoPanel {...video} />

        <div className="w-full lg:w-[56%] flex items-center justify-center px-4 py-12 relative overflow-hidden">
          <DottedBackdrop />
          {card}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F4EF] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <DottedBackdrop />
      {card}
    </div>
  );
}