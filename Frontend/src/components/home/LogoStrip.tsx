const logos = ["RotaShow", "Waves", "RotaShow", "Travelers", "Goldlines", "Velocity", "Travelers"];

export default function LogoStrip() {
  return (
    <section className="border-y border-white/5 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-slate-text/50 font-display text-sm tracking-wide">
        {logos.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </section>
  );
}
