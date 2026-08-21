import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fadeUp } from "../../lib/shared";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "This task manager has completely transformed the way my team works. We now collaborate in real-time and always meet deadlines.",
    name: "John D.",
    role: "Marketing Lead",
    initials: "JD",
    avatarColor: "#3D6DF2",
  },
  {
    quote:
      "I love how easy it is to create and assign tasks. The platform's interface makes work feel less overwhelming.",
    name: "Daniela T.",
    role: "Operations Manager",
    initials: "DT",
    avatarColor: "#E8A33D",
  },
  {
    quote: "An essential tool for anyone looking to manage their tasks better.",
    name: "Sarah W.",
    role: "Freelance Designer",
    initials: "SW",
    avatarColor: "#B15CDE",
  },
  {
    quote:
      "The time-tracking feature has been a game-changer for my freelance projects. It helps me stay organized and productive.",
    name: "Alex M.",
    role: "Freelance Developer",
    initials: "AM",
    avatarColor: "#3E7C59",
  },
  {
    quote: "The built-in analytics give me a complete overview of our team's productivity.",
    name: "Sam J.",
    role: "Project Coordinator",
    initials: "SJ",
    avatarColor: "#E8552F",
  },
];

function TestimonialCard({
  t,
  delay = 0,
  className = "",
}: {
  t: Testimonial;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -3 }}
      className={`flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}
    >
      <p className="text-[13.5px] leading-relaxed text-black/70">&ldquo;{t.quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-2.5">
        <Avatar className="h-8 w-8 border border-black/10">
          <AvatarFallback
            className="text-[11px] font-medium text-white"
            style={{ background: t.avatarColor }}
          >
            {t.initials}
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-[12.5px] text-black/45">{t.name}</p>
          <p className="text-[12.5px] font-semibold text-[#14151A]">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoTestimonialCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="relative flex aspect-[4/3.4] items-center justify-center bg-gradient-to-br from-[#3a3d4a] via-[#2b2d38] to-[#14151A] sm:aspect-auto sm:h-full sm:min-h-[220px]">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <Avatar className="h-20 w-20 border-2 border-white/10">
          <AvatarFallback className="bg-white/10 text-lg font-medium text-white/70">
            MK
          </AvatarFallback>
        </Avatar>

        <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
          Watch video review
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8552F] shadow-lg"
        >
          <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-[#F6F4EF] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Badge
              variant="outline"
              className="mb-4 rounded-full border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-black/50"
            >
              Testimonials
            </Badge>
            <h2 className="text-[34px] font-semibold leading-[1.15] tracking-tight text-[#14151A] sm:text-[42px]">
              People just like you
              <br />
              are already using Vexez
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <TestimonialCard t={TESTIMONIALS[0]} delay={0} className="sm:min-h-[280px]" />
            <TestimonialCard t={TESTIMONIALS[1]} delay={0.1} />
          </div>
          <div className="flex flex-col gap-4">
            <TestimonialCard t={TESTIMONIALS[2]} delay={0.05} />
            <TestimonialCard t={TESTIMONIALS[3]} delay={0.15} className="sm:min-h-[220px]" />
          </div>
          <div className="flex flex-col gap-4">
            <TestimonialCard t={TESTIMONIALS[4]} delay={0.1} />
            <VideoTestimonialCard />
          </div>
        </div>
      </div>
    </section>
  );
}
