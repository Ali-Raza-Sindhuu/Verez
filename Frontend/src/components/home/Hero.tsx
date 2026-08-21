import { motion } from "framer-motion";
import { Check, Clock3, Mail, MessageSquare, CalendarDays } from "lucide-react";
import { fadeUp, FloatCard } from "../../lib/shared";

// ---------- floating hero artifacts ----------

function StickyNoteCard() {
  return (
    <FloatCard
      className="absolute left-0 top-14 z-10 hidden w-[168px] sm:block lg:left-8"
      delay={0.15}
      rotate={-7}
    >
      <div className="relative">
        {/* stacked card peeking out behind */}
        <div className="absolute -bottom-2 -right-2 h-full w-full rounded-md bg-white shadow-md" />

        {/* pin */}
        <span className="absolute -top-1.5 left-1/2 z-20 h-3 w-3 -translate-x-1/2 rounded-full bg-[#E24A3A] shadow-sm ring-2 ring-white/40" />

        <div
          className="relative rounded-md p-4 shadow-lg"
          style={{ background: "#F9E27F" }}
        >
          <p className="font-serif text-[13px] italic leading-snug text-black/75">
            Take notes to keep track of crucial details, and accomplish more
            tasks with ease.
          </p>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -14 }}
          whileInView={{ scale: 1, rotate: -8 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, type: "spring", stiffness: 260, damping: 15 }}
          className="absolute -bottom-5 -right-4 z-20 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white p-2 shadow-xl"
        >
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#3D6DF2]">
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          </div>
        </motion.div>
      </div>
    </FloatCard>
  );
}

function ReminderCard() {
  return (
    <FloatCard
      className="absolute right-0 top-10 z-10 hidden w-[190px] sm:block lg:right-6"
      delay={0.3}
      rotate={4}
      floatDistance={7}
    >
      <div className="relative">
        {/* stacked card peeking out behind */}
        <div className="absolute -bottom-2 -right-1.5 h-full w-full rotate-[4deg] rounded-2xl bg-white/70 shadow-sm" />

        <div className="relative rounded-2xl border border-black/[0.05] bg-white p-4 shadow-xl">
          <p className="mb-3 text-[13.5px] font-semibold text-[#14151A]">Reminders</p>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-black/30">
            Meetings
          </p>
          <p className="mb-2.5 text-[12.5px] font-medium text-black/70">Today's Meeting</p>
          <div className="flex items-center gap-1.5 rounded-lg bg-[#EAF1FF] px-2.5 py-1.5">
            <Clock3 className="h-3 w-3 shrink-0 text-[#3D6DF2]" />
            <span className="text-[11px] font-medium text-[#3D6DF2]">13:00 – 13:45</span>
          </div>
        </div>

        {/* floating stopwatch badge, overlapping left edge */}
        <motion.div
          initial={{ scale: 0, rotate: 10 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, type: "spring", stiffness: 240, damping: 15 }}
          className="absolute -left-9 top-14 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-[#14151A]">
            <span className="absolute h-2.5 w-[1.5px] -translate-y-[3px] bg-[#E24A3A]" />
            <span className="h-[1.5px] w-2 -translate-x-[1px] -translate-y-[1px] rotate-[35deg] bg-[#14151A]" />
          </div>
        </motion.div>
      </div>
    </FloatCard>
  );
}

function TasksPreviewCard() {
  const rows = [
    { label: "New ideas for campaign", pct: 60, date: "Sep 10", tag: "#E8552F" },
    { label: "Design PPT #4", pct: 112, date: "Sep 18", tag: "#3E7C59" },
  ];
  return (
    <FloatCard
      className="absolute -bottom-4 left-0 z-10 hidden w-[210px] sm:block lg:left-10"
      delay={0.4}
      rotate={-2}
      floatDistance={5}
    >
      <div className="relative">
        <div className="absolute -bottom-2 -right-2 h-full w-full rounded-2xl bg-white/60 shadow-sm" />
        <div className="relative rounded-2xl border border-black/[0.05] bg-white p-4 shadow-xl">
          <p className="mb-3 text-[13px] font-semibold text-[#14151A]">Today's tasks</p>
          <div className="space-y-3.5">
            {rows.map((r, i) => (
              <div key={r.label}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px]"
                      style={{ background: r.tag }}
                    >
                      <Check className="h-2 w-2 text-white" strokeWidth={4} />
                    </span>
                    <span className="truncate text-[11.5px] font-medium text-black/75">
                      {r.label}
                    </span>
                  </span>
                  <div className="flex -space-x-1.5">
                    <span
                      className="h-4 w-4 rounded-full border border-white"
                      style={{ background: i === 0 ? "#3D6DF2" : "#3E7C59" }}
                    />
                    <span
                      className="h-4 w-4 rounded-full border border-white"
                      style={{ background: i === 0 ? "#E8A33D" : "#B15CDE" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-5">
                  <span className="text-[9.5px] text-black/35">{r.date}</span>
                  <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(r.pct, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: r.tag }}
                    />
                  </div>
                  <span className="w-7 shrink-0 text-right font-mono text-[9.5px] tabular-nums text-black/40">
                    {r.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FloatCard>
  );
}

function IntegrationsCard() {
  const icons = [
    { icon: Mail, bg: "#EA4335", ring: "rotate-[-6deg]" },
    { icon: MessageSquare, bg: "#611F69", ring: "rotate-[3deg]" },
    { icon: CalendarDays, bg: "#4285F4", ring: "rotate-[9deg]" },
  ];
  return (
    <FloatCard
      className="absolute -bottom-6 right-0 z-10 hidden w-[200px] sm:block lg:right-6"
      delay={0.5}
      rotate={3}
      floatDistance={5}
    >
      <div className="relative">
        <div className="absolute -bottom-2 -left-2 h-full w-full rounded-2xl bg-white/60 shadow-sm" />
        <div className="relative rounded-2xl border border-black/[0.05] bg-white p-4 shadow-xl">
          <p className="mb-3.5 text-[13px] font-semibold text-[#14151A]">100+ Integrations</p>
          <div className="flex -space-x-2.5">
            {icons.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6, rotate: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white shadow-md ${it.ring}`}
                style={{ background: it.bg, zIndex: 3 - i }}
              >
                <it.icon className="h-4 w-4 text-white" strokeWidth={2.25} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </FloatCard>
  );
}

// ---------- hero section ----------

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FBFAF7]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 pb-36 pt-20 text-center sm:pb-44 sm:pt-24">
        <StickyNoteCard />
        <ReminderCard />
        <TasksPreviewCard />
        <IntegrationsCard />

        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-7 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="grid grid-cols-2 gap-[5px]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3D6DF2]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#14151A]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#14151A]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#14151A]" />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-[40px] font-semibold leading-[1.1] tracking-tight text-[#14151A] sm:text-[52px]"
        >
          Think, plan, and track
          <br />
          <span className="text-black/[0.22]">all in one place</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-4 max-w-sm text-[14.5px] text-black/50"
        >
          Efficiently manage your tasks and boost productivity.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-7">
          <motion.a
            href="#"
            whileHover={{ scale: 1.035, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block rounded-xl bg-[#3D6DF2] px-6 py-3 text-[14px] font-medium text-white shadow-[0_10px_24px_rgba(61,109,242,0.3)] transition-colors hover:bg-[#3159d9]"
          >
            Get free demo
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}