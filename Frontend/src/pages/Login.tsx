import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// NOTE: form is UI-only for now — wire the onSubmit handler up to Clerk's
// `useSignIn()` once auth is connected. Structure (fields, error state,
// loading state) is already shaped for that swap.

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
    // TODO: replace with Clerk `signIn.create({ identifier: email, password })`
    setTimeout(() => setLoading(false), 900);
  }

  return (
    <div className="min-h-screen bg-ink text-cream font-body flex">
      {/* left — form */}
      <div className="w-full lg:w-[46%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16 relative">
        <Link
          to="/"
          className="absolute top-8 left-6 sm:left-12 lg:left-16 inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm mx-auto"
        >
          <Link to="/" className="inline-flex items-center gap-2 font-display font-semibold text-lg mb-10">
            <span className="w-8 h-8 rounded-md bg-teal flex items-center justify-center text-ink font-bold">
              V
            </span>
            Vexez
          </Link>

          <h1 className="font-display font-semibold text-3xl tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-text">
            Log in to pick up right where your dashboard left off.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" type="button">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23Z"
                  opacity=".7"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85Z"
                  opacity=".5"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38Z"
                  opacity=".85"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.29 9.28 7.86 10.79.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.2.67.8.56A10.52 10.52 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
              </svg>
              GitHub
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-text/70">or continue with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-teal hover:underline">
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
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-text hover:text-cream"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-clay bg-clay/10 border border-clay/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-text">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* right — visual */}
      <div className="hidden lg:block lg:w-[54%] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 70% 30%, rgba(30,194,188,0.25), transparent), radial-gradient(circle at 20% 80%, rgba(231,113,74,0.12), transparent 45%), #0F1B19",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(30,194,188,0.35) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 60% 60% at 60% 40%, black, transparent 75%)",
          }}
        />

        <div className="relative h-full flex flex-col items-center justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-card/80 backdrop-blur shadow-glow p-6 w-full max-w-md"
          >
            <p className="text-xs text-slate-text mb-1">Total profit overview</p>
            <p className="font-display text-3xl font-semibold">
              $96,715.28
              <span className="ml-2 text-xs font-mono text-teal align-middle">▲ 14.6%</span>
            </p>
            <div className="mt-6 h-24 flex items-end gap-2">
              {[40, 65, 35, 80, 55, 90, 60, 100, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-teal/20 to-teal"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 font-display font-semibold text-2xl text-center max-w-sm leading-snug"
          >
            Every order, every margin, updated the moment it happens.
          </motion.h2>
        </div>
      </div>
    </div>
  );
}