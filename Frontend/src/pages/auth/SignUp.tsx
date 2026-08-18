import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  AuthLayout,
  fadeUp,
  stagger,
  OAuthButtons,
  OrDivider,
  FormError,
  PrimaryButton,
  CheckChip,
  passwordRequirements,
} from "@/layouts/AuthLayout";
import { VexezMark } from "@/components/common/Logo";

const perks = [
  "Live sales, profit, and stock in one dashboard",
  "Unlimited product listings on every plan",
  "Set up in minutes — no engineer required",
];

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requirements = passwordRequirements(password);

  function handleSubmit(e: React.FormEvent) {
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
    setTimeout(() => setLoading(false), 900);
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

        <motion.div variants={fadeUp} custom={8} className="w-full">
          <OrDivider />
        </motion.div>

        <motion.div variants={fadeUp} custom={9} className="w-full">
          <OAuthButtons />
        </motion.div>

        <motion.p variants={fadeUp} custom={10} className="mt-7 text-center text-[13.5px] text-black/50">
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