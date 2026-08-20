import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)] text-[var(--color-text-primary)] px-6 text-center">
      <span className="font-display text-6xl font-semibold tracking-tight text-[var(--color-accent-primary)]">
        404
      </span>
      <h1 className="font-display text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-bg)] hover:opacity-90 transition-opacity mt-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  );
}
