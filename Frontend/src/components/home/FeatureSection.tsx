import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { fadeUp } from "../../lib/shared";

function FeatureCard({
  title,
  body,
  children,
  delay = 0,
  className = "",
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-lg ${className}`}
    >
      <div className="mb-6 flex min-h-[140px] items-center justify-center rounded-xl bg-[#FBFAF7]">
        {children}
      </div>
      <h4 className="mb-1.5 text-[15px] font-semibold text-[#14151A]">{title}</h4>
      <p className="text-[13px] leading-relaxed text-black/50">{body}</p>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="bg-[#F1EEE6] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-black/50"
          >
            Features
          </Badge>
          <h2 className="text-[34px] font-semibold tracking-tight text-[#14151A] sm:text-[42px]">
            Keep everything in one place
          </h2>
          <p className="mt-3 text-[15px] text-black/45">
            Forget complex project management tools.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FeatureCard
            title="Seamless Collaboration"
            body="Work together with your team effortlessly, share tasks, and update progress in real-time."
            delay={0}
          >
            <div className="flex -space-x-2">
              {["A", "M", "J", "R"].map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#3D6DF2] text-[12px] font-medium text-white"
                  style={{ background: ["#3D6DF2", "#E8A33D", "#3E7C59", "#B15CDE"][i] }}
                >
                  {l}
                </motion.div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            title="Time Management Tools"
            body="Optimize your time with integrated tools like timers, reminders, and schedules."
            delay={0.08}
          >
            <div className="flex items-end gap-3">
              {[28, 44, 60].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: h }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-6 rounded-md bg-[#3D6DF2]/70"
                />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            title="Advanced task tracking"
            body="A bird's-eye view of your entire team's behaviour and productivity."
            delay={0.16}
          >
            <div className="flex w-full flex-col gap-2 px-4">
              {[70, 45, 90].map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left", width: `${w}%` }}
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#3D6DF2] to-[#8FD3FF]"
                />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            title="Customizable Workspaces"
            body="Rearrange widgets, pick a theme, and shape every view around how you actually work."
            delay={0.24}
          >
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center rounded-lg bg-[#E8A33D] px-4 py-3 font-mono text-lg font-bold text-white shadow-md"
            >
              04:21
            </motion.div>
          </FeatureCard>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-[13px] text-black/35"
        >
          and a lot more features…
        </motion.p>
      </div>
    </section>
  );
}