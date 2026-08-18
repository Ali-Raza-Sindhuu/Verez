import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  AuthLayout,
  fadeUp,
  stagger,
  OAuthButtons,
  OrDivider,
  FormError,
  PrimaryButton,
} from "@/layouts/AuthLayout";
import { VexezMark } from "@/components/common/Logo";

const highlights = [
  "Track every course, cohort, and learner in one place",
  "Assign, grade, and message without leaving the dashboard",
  "Set up your first classroom in minutes",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 900);
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
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="rounded-lg border-black/10 focus-visible:ring-[#3D6DF2]/30 focus-visible:border-[#3D6DF2] focus-visible:ring-offset-0"
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
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
          </motion.div>

          <FormError message={error} />

          <motion.div variants={fadeUp} custom={5}>
            <PrimaryButton disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </PrimaryButton>
          </motion.div>
        </form>

        <motion.div variants={fadeUp} custom={6} className="w-full">
          <OrDivider />
        </motion.div>

        <motion.div variants={fadeUp} custom={7} className="w-full">
          <OAuthButtons />
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