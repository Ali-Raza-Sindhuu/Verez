import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp } from "../../lib/shared";

type Plan = {
  name: string;
  tagline: string;
  price: number;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Basic plan",
    tagline: "Perfect for individuals.",
    price: 5,
    features: [
      "All product features",
      "Unlimited lists & tasks",
      "Priority support",
      "Unlimited tasks",
      "Unlimited file storage",
      "Unlimited projects",
    ],
  },
  {
    name: "Pro plan",
    tagline: "Ideal for small teams.",
    price: 9,
    featured: true,
    features: [
      "All product features",
      "Unlimited lists & tasks",
      "Priority support",
      "Unlimited tasks",
      "Unlimited file storage",
      "Unlimited projects",
    ],
  },
  {
    name: "Advanced plan",
    tagline: "Best for large organizations.",
    price: 15,
    features: [
      "All product features",
      "Unlimited lists & tasks",
      "Priority support",
      "Unlimited tasks",
      "Unlimited file storage",
      "Unlimited projects",
    ],
  },
];

function PricingCard({ plan, delay = 0 }: { plan: Plan; delay?: number }) {
  if (plan.featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const }}
        whileHover={{ y: -6 }}
        className="relative flex flex-col rounded-3xl bg-gradient-to-b from-[#3D6DF2] to-[#3d5eef] p-6 text-white shadow-xl shadow-[#3D6DF2]/25 sm:-translate-y-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.35, type: "spring", stiffness: 240, damping: 14 }}
          className="absolute -right-3 -top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-lg"
        >
          <Zap className="h-5 w-5 fill-[#E8A33D] text-[#E8A33D]" />
        </motion.div>

        <h3 className="text-[16px] font-semibold">{plan.name}</h3>
        <p className="mt-0.5 text-[12.5px] text-white/70">{plan.tagline}</p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-[38px] font-bold leading-none">${plan.price}</span>
          <span className="text-[13px] text-white/60">/mo</span>
        </div>
        <p className="mt-1 text-[11.5px] font-medium text-[#FFD98A]">Best choice</p>

        <Button className="mt-5 w-full rounded-xl bg-white py-5 text-[13.5px] font-semibold text-[#14151A] hover:bg-white/90">
          Get started
        </Button>

        <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-6">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[12.5px] text-white/85">
              <Check className="h-3.5 w-3.5 shrink-0 text-white/70" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
        <a href="#" className="mt-4 text-[12px] font-medium text-white underline underline-offset-2">
          Learn more
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-3xl border border-black/[0.06] bg-white/60 p-6"
    >
      <h3 className="text-[16px] font-semibold text-[#14151A]">{plan.name}</h3>
      <p className="mt-0.5 text-[12.5px] text-black/45">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-[38px] font-bold leading-none text-[#14151A]">${plan.price}</span>
        <span className="text-[13px] text-black/40">/mo</span>
      </div>

      <Button className="mt-9 w-full rounded-xl bg-[#3D6DF2] py-5 text-[13.5px] font-semibold text-white hover:bg-[#3d5eef]">
        Get started
      </Button>

      <ul className="mt-6 space-y-2.5 border-t border-black/[0.06] pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[12.5px] text-black/60">
            <Check className="h-3.5 w-3.5 shrink-0 text-black/35" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      <a href="#" className="mt-4 text-[12px] font-medium text-black/70 underline underline-offset-2">
        Learn more
      </a>
    </motion.div>
  );
}

export function PricingSection() {
  return (
    <section className="bg-[#F6F4EF] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-black/50"
          >
            Pricing
          </Badge>
          <h2 className="text-[34px] font-semibold tracking-tight text-[#14151A] sm:text-[42px]">
            Simple pricing plans
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 text-left sm:grid-cols-3 sm:items-start">
          {PLANS.map((p, i) => (
            <PricingCard key={p.name} plan={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
