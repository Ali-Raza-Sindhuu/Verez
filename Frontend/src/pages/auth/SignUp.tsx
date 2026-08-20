import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
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
import { registerUser, startOAuthLogin } from "@/store/features/auth/authSlice";
import { GithubIcon, GoogleIcon } from "@/components/icons/SocialIcons";

const perks = [
  "Live sales, profit, and stock in one dashboard",
  "Unlimited product listings on every plan",
  "Set up in minutes — no engineer required",
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

export default function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requirements = passwordRequirements(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Fill in every field to create your account.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    if (!agreed) {
      setError("Accept the terms to continue.");
      return;
    }

    setLoading(true);
    const result = await dispatch(registerUser({ name, email, password, role }));
    setLoading(false);

    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard");
    } else {
      setError((result.payload as string) ?? "Sign up failed. Please try again.");
    }
  }

  function handleOAuth(provider: "google" | "github") {
    setError(null);
    setOauthLoading(provider);
    // startOAuthLogin typically redirects the browser to the provider's
    // consent screen, so there's usually nothing to await here — reset
    // the loading state defensively in case it ever resolves in-page.
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
        src: "https://cdn.coverr.co/videos/coverr-working-on-a-laptop-with-charts-and-graphs-2633/1080p.mp4",
        poster: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
        badge: "Trusted by 20,000+ storefronts",
        heading: "Run inventory like it runs itself.",
        points: perks,
      }}
    >
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.div variants={fadeUp} custom={0} className="lg:hidden">
          <VexezMark className="mb-6" />
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="font-semibold tracking-tight text-[#14151A] text-[28px] sm:text-[32px] text-center">
          Create your account
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="mt-2 text-[13.5px] text-black/50 text-center">
          Start free — no card required.
        </motion.p>

        <form onSubmit={handleSubmit} className="w-full mt-7 space-y-4">
          <motion.div variants={fadeUp} custom={3} className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] text-black/70">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jordan Ali"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="rounded-lg border-black/10 focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0"
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={3.5} className="space-y-1.5">
            <Label className="text-[13px] text-black/70">I am a</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["STUDENT", "TEACHER"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    role === option
                      ? "border-[#3D6DF2] bg-[#3D6DF2]/10 text-[#3D6DF2]"
                      : "border-black/10 text-black/60 hover:border-black/20"
                  }`}
                >
                  {option === "STUDENT" ? "Student" : "Teacher"}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="space-y-1.5">
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

          <motion.div variants={fadeUp} custom={5} className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] text-black/70">Password</Label>
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

          <motion.label variants={fadeUp} custom={6} className="flex items-start gap-2.5 text-[13px] text-black/60 cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(v) => setAgreed(Boolean(v))}
              className="mt-0.5 border-black/20 data-[state=checked]:bg-[#3E7C59] data-[state=checked]:border-[#3E7C59]"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-[#3D6DF2] hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#3D6DF2] hover:underline">
                Privacy Policy
              </Link>.
            </span>
          </motion.label>

          <FormError message={error} />

          <motion.div variants={fadeUp} custom={7}>
            <PrimaryButton disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </PrimaryButton>
          </motion.div>
        </form>

        <motion.div variants={fadeUp} custom={8} className="w-full mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-[12px] text-black/40">or continue with</span>
          <div className="h-px flex-1 bg-black/10" />
        </motion.div>

        <motion.div variants={fadeUp} custom={9} className="w-full mt-4 grid grid-cols-2 gap-2.5">
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
        <motion.p variants={fadeUp} custom={10} className="mt-3 text-center text-[11.5px] text-black/35">
          Signing up as a {role === "STUDENT" ? "student" : "teacher"} via Google/GitHub
        </motion.p>

        <motion.p variants={fadeUp} custom={11} className="mt-4 text-center text-[13.5px] text-black/50">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#3D6DF2] hover:underline font-medium"
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}