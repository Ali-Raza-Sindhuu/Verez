import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthLayout,
  fadeUp,
  stagger,
  FormError,
  PrimaryButton,
  CheckChip,
  passwordRequirements,
} from "@/layouts/AuthLayout";
import { VexezMark } from "@/components/common/Logo";
import { useAppDispatch } from "@/store/hooks";
import { resetPassword } from "@/store/features/auth/authSlice";

const REDIRECT_SECONDS = 4;

export default function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const requirements = passwordRequirements(password);
  const allMet = requirements.every((r) => r.met);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing or invalid. Request a new one.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Fill in both fields to continue.");
      return;
    }
    if (!allMet) {
      setError("Password doesn't meet the requirements yet.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const result = await dispatch(resetPassword({ token, password }));
    setLoading(false);

    if (resetPassword.fulfilled.match(result)) {
      setDone(true);
    } else {
      setError((result.payload as string) ?? "Couldn't reset password. Try again.");
    }
  }

  useEffect(() => {
    if (!token) {
      setError("This reset link is missing or invalid. Request a new one.");
    }
  }, [token]);

  useEffect(() => {
    if (!done) return;
    if (countdown <= 0) {
      navigate("/login");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [done, countdown, navigate]);

  return (
    <AuthLayout variant="centered">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center">
            <motion.div variants={fadeUp} custom={0}>
              <VexezMark className="mb-6" />
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-semibold tracking-tight text-[#14151A] text-[28px] sm:text-[32px] text-center">
              Set a new password
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-2 text-[13.5px] text-black/50 text-center">
              Choose a strong password you haven't used before.
            </motion.p>

            <form onSubmit={handleSubmit} className="w-full mt-7 space-y-4">
              <motion.div variants={fadeUp} custom={3} className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] text-black/70">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="pr-11 rounded-lg border-black/10 focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#14151A] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="pt-1 space-y-1.5">
                  {requirements.map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <CheckChip met={r.met} />
                      <span className={`text-[12.5px] transition-colors ${r.met ? "text-black/70" : "text-black/40"}`}>
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[13px] text-black/70">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="pr-11 rounded-lg border-black/10 focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#14151A] transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <FormError message={error} />

              <motion.div variants={fadeUp} custom={5}>
                <PrimaryButton disabled={loading}>
                  {loading ? "Updating password..." : "Reset password"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </PrimaryButton>
              </motion.div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="done"
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
              <CircleCheck className="w-5 h-5" />
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="font-semibold tracking-tight text-[#14151A] text-[26px] sm:text-[28px]"
            >
              Password updated
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mt-2 text-[13.5px] text-black/50 max-w-[280px]"
            >
              Your password has been reset. Taking you to log in in {countdown}s.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full mt-7"
            >
              <PrimaryButton type="button" onClick={() => navigate("/login")}>
                Go to log in now
                <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}