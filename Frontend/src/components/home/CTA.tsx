import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta" className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-teal/20 px-8 py-16 sm:py-20 text-center"
        style={{
          background:
            "radial-gradient(ellipse 90% 100% at 50% 100%, rgba(30,194,188,0.28), transparent), #0F1B19",
        }}
      >
        <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight max-w-2xl mx-auto">
          Ready to transform your business, effortlessly?
        </h2>
        <p className="mt-4 text-slate-text max-w-md mx-auto">
          Get started with Vexez today and bring clarity to how your store runs.
        </p>
        <a
          href="#"
          className="mt-8 inline-flex items-center gap-1.5 bg-teal text-ink font-medium px-6 py-3 rounded-full hover:bg-teal-glow transition-colors"
        >
          Get started now
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
