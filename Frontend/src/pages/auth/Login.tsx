import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { loginUser, startOAuthLogin } from "@/store/features/auth/authSlice";
import {
  AuthLayout,
  fadeUp,
  stagger,
  FormError,
  PrimaryButton,
} from "@/layouts/AuthLayout";
import { VexezMark } from "@/components/common/Logo";
import { GithubIcon, GoogleIcon } from "@/components/icons/SocialIcons";

const highlights = [
  "Track every course, cohort, and learner in one place",
  "Assign, grade, and message without leaving the dashboard",
  "Set up your first classroom in minutes",
];

function OAuthButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white py-2.5 text-[13.5px] font-medium text-[#14151A] transition-colors hover:bg-black/[0.03] hover:border-black/15 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}

// Distinct error shapes:
// - "user_not_found": no account with this email — steer them to sign up
// - "invalid_password": account exists, wrong password — plain inline message
// - "generic": anything else (network error, server error, etc.)
type LoginErrorState =
  | { type: "user_not_found" }
  | { type: "invalid_password"; message: string }
  | { type: "generic"; message: string }
  | null;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<LoginErrorState>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError({ type: "generic", message: "Enter your email and password to continue." });
      return;
    }

    setLoading(true);
    const result = await dispatch(loginUser({ email, password }));
    setLoading(false);

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
      return;
    }

    // result.payload is { message, code } from authSlice's extractLoginError.
    const payload = result.payload as { message?: string; code?: string } | undefined;
    const code = payload?.code;
    const message = payload?.message ?? "Login failed. Please try again.";

    if (code === "USER_NOT_FOUND") {
      setError({ type: "user_not_found" });
    } else if (code === "INVALID_PASSWORD" || code === "INVALID_CREDENTIALS") {
      setError({ type: "invalid_password", message: "Incorrect password. Please try again." });
    } else {
      setError({ type: "generic", message });
    }
  }

  function handleOAuth(provider: "google" | "github") {
    setError(null);
    setOauthLoading(provider);
    try {
      dispatch(startOAuthLogin(provider));
    } finally {
      setOauthLoading(null);
    }
  }

  return (
    <AuthLayout
      variant="split"
      video={{
        src: "https://cdn.coverr.co/videos/coverr-students-studying-in-a-library-5344/1080p.mp4",
        poster: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        badge: "Trusted by 4,000+ classrooms",
        heading: "Pick up right where your learners left off.",
        points: highlights,
      }}
    >
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.div variants={fadeUp} custom={0} className="lg:hidden">
          <VexezMark className="mb-6" />
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="font-semibold tracking-tight text-[#14151A] text-[28px] sm:text-[32px] text-center">
          Welcome back
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="mt-2 text-[13.5px] text-black/50 text-center">
          Log in to your account
        </motion.p>

        <form onSubmit={handleSubmit} className="w-full mt-7 space-y-4">
          <motion.div variants={fadeUp} custom={3} className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] text-black/70">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              autoComplete="email"
              className={`rounded-lg focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0 ${
                error?.type === "user_not_found" ? "border-[#C4472B]/40" : "border-black/10"
              }`}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[13px] text-black/70">Password</Label>
              <Link
                to="/forgot-password"
                className="text-[12.5px] text-black/50 hover:text-[#14151A] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="current-password"
                className={`pr-11 rounded-lg focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0 ${
                  error?.type === "invalid_password" ? "border-[#C4472B]/40" : "border-black/10"
                }`}
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
          </motion.div>

          {/* No account found — steer to sign up instead of a dead-end error */}
          <AnimatePresence>
            {error?.type === "user_not_found" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 rounded-lg border border-[#C4472B]/20 bg-[#C4472B]/[0.04] p-3.5">
                  <UserX className="w-4 h-4 text-[#C4472B] shrink-0 mt-0.5" />
                  <div className="text-[13px] leading-relaxed text-[#8A3320]">
                    We couldn't find an account for <span className="font-medium">{email}</span>.{" "}
                    <Link to="/signup" className="font-medium text-[#3D6DF2] hover:underline">
                      Create one instead?
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wrong password / other errors use the standard inline message */}
          {error?.type !== "user_not_found" && (
            <FormError message={error?.message ?? null} />
          )}

          <motion.div variants={fadeUp} custom={5}>
            <PrimaryButton disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </PrimaryButton>
          </motion.div>
        </form>

        <motion.div variants={fadeUp} custom={6} className="w-full mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-[12px] text-black/40">or continue with</span>
          <div className="h-px flex-1 bg-black/10" />
        </motion.div>

        <motion.div variants={fadeUp} custom={7} className="w-full mt-4 grid grid-cols-2 gap-2.5">
          <OAuthButton
            label={oauthLoading === "google" ? "Redirecting..." : "Google"}
            icon={<GoogleIcon />}
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null || loading}
          />
          <OAuthButton
            label={oauthLoading === "github" ? "Redirecting..." : "GitHub"}
            icon={<GithubIcon />}
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null || loading}
          />
        </motion.div>

        <motion.p variants={fadeUp} custom={8} className="mt-7 text-center text-[13.5px] text-black/50">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#3D6DF2] hover:underline font-medium"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}