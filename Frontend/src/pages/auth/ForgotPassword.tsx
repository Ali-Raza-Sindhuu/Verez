import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  AuthLayout,
  fadeUp,
  stagger,
  FormError,
  PrimaryButton,
} from "@/layouts/AuthLayout";
import { VexezMark } from "@/components/common/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Enter the email on your account to continue.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  return (
    <AuthLayout variant="centered">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-[13px] text-black/50 hover:text-[#14151A] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to log in
      </Link>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center">
            <motion.div variants={fadeUp} custom={0}>
              <VexezMark className="mb-6" />
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-semibold tracking-tight text-[#14151A] text-[28px] sm:text-[32px] text-center">
              Reset your password
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-2 text-[13.5px] text-black/50 text-center">
              Enter your email and we'll send you a reset link.
            </motion.p>

            <form onSubmit={handleSubmit} className="w-full mt-7 space-y-4">
              <motion.div variants={fadeUp} custom={3} className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-black/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="rounded-lg border-black/10 focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0"
                />
              </motion.div>

              <FormError message={error} />

              <motion.div variants={fadeUp} custom={4}>
                <PrimaryButton disabled={loading}>
                  {loading ? "Sending link..." : "Send reset link"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </PrimaryButton>
              </motion.div>
            </form>

            <motion.p variants={fadeUp} custom={5} className="mt-7 text-center text-[13.5px] text-black/50">
              Remembered it after all?{" "}
              <Link
                to="/login"
                className="text-[#3D6DF2] hover:underline font-medium"
              >
                Log in
              </Link>
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="w-12 h-12 rounded-2xl bg-[#3E7C59]/10 text-[#3E7C59] flex items-center justify-center mb-5"
            >
              <MailCheck className="w-5 h-5" />
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="font-semibold tracking-tight text-[#14151A] text-[26px] sm:text-[28px]"
            >
              Check your email
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mt-2 text-[13.5px] text-black/50 max-w-[280px]"
            >
              We sent a password reset link to{" "}
              <span className="font-medium text-[#14151A]">{email}</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full mt-7 space-y-3"
            >
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setLoading(false);
                }}
                className="w-full inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#14151A] text-sm font-medium py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-black/[0.02] transition-colors"
              >
                Use a different email
              </button>

              <p className="text-[12.5px] text-black/40">
                Didn't get it? Check spam, or{" "}
                <button type="button" onClick={handleSubmit} className="text-[#3D6DF2] hover:underline font-medium">
                  resend the link
                </button>
                .
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}