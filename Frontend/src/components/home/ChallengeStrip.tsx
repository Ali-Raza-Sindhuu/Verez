import { motion } from "framer-motion";
import { Compass, ListChecks, UserPlus } from "lucide-react";
import { fadeUp } from "../../lib/shared";

const CHALLENGES = [
  {
    icon: Compass,
    body: "Ensure your team is always on the same page with task-sharing and transparent updates.",
  },
  {
    icon: ListChecks,
    body: "Prioritize and manage tasks effectively so your team can focus on what matters most.",
  },
  {
    icon: UserPlus,
    body: "Hold everyone accountable without the need for constant check-ins.",
  },
];

function CornerDot({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-[7px] w-[7px] rounded-full border border-black/15 bg-white ${className}`}
    />
  );
}

export function ChallengeStrip() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-14 text-center">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <span className="mb-4 inline-block rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-black/50 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          Solutions
        </span>
        <h2 className="text-[32px] font-semibold leading-[1.18] tracking-tight text-[#14151A] sm:text-[38px]">
          Solve your team's
          <br />
          biggest challenges
        </h2>
      </motion.div>

      {/* wireframe-style frame with corner + divider node dots */}
      <div className="relative mx-auto mt-12">
        <div className="relative rounded-2xl border border-black/[0.08] px-2 pb-8 pt-9">
          <CornerDot className="-top-[3.5px] left-0" />
          <CornerDot className="-top-[3.5px] left-1/3 -translate-x-1/2" />
          <CornerDot className="-top-[3.5px] left-2/3 -translate-x-1/2" />
          <CornerDot className="-top-[3.5px] right-0" />

          <div className="grid grid-cols-1 gap-8 text-left sm:grid-cols-3 sm:gap-6">
            {CHALLENGES.map((c, i) => (
              <motion.div
                key={c.body}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="px-4 sm:px-3"
              >
                <c.icon className="mb-3 h-[18px] w-[18px] text-[#E8A33D]" strokeWidth={2} />
                <p className="text-[13px] leading-relaxed text-black/55">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}