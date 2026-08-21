import { motion } from "framer-motion";
import {
  Sparkles,
  Cloud,
  Mail,
  Waypoints,
  PenTool,
  Layers,
  Mountain,
  Headphones,
  Zap,
  MessageCircle,
  Calendar,
  Hexagon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fadeUp } from "../../lib/shared";

const INTEGRATIONS: { label: string; icon: React.ElementType; bg: string; fg: string }[] = [
  { label: "Drive", icon: Cloud, bg: "#EAF2FF", fg: "#3D6DF2" },
  { label: "Creative", icon: Sparkles, bg: "#FBEAFF", fg: "#C24CD6" },
  { label: "Track", icon: Waypoints, bg: "#EAF2FF", fg: "#3D6DF2" },
  { label: "Mail", icon: Mail, bg: "#FEF1EA", fg: "#E8552F" },
  { label: "Figma", icon: PenTool, bg: "#FBEAFF", fg: "#C24CD6" },
  { label: "Outlook", icon: Mail, bg: "#EAF2FF", fg: "#3D6DF2" },
  { label: "Slack", icon: Layers, bg: "#F1EEFC", fg: "#7C5CFF" },
  { label: "Studio", icon: Mountain, bg: "#F1EEFC", fg: "#6B4CE8" },
  { label: "Cloud CRM", icon: Cloud, bg: "#EAF2FF", fg: "#3D6DF2" },
  { label: "Support", icon: Headphones, bg: "#E9F7EF", fg: "#3E7C59" },
  { label: "Hub", icon: Zap, bg: "#FEF1EA", fg: "#E8552F" },
  { label: "Community", icon: MessageCircle, bg: "#14151A", fg: "#F6F4EF" },
  { label: "Calendar", icon: Calendar, bg: "#EAF2FF", fg: "#3D6DF2" },
  { label: "Hexagon", icon: Hexagon, bg: "#E9F7EF", fg: "#3E7C59" },
];

export function IntegrationsSection() {
  return (
    <section className="relative overflow-hidden bg-[#F6F4EF] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-black/50"
          >
            Integrations
          </Badge>
          <h2 className="text-[34px] font-semibold leading-[1.15] tracking-tight text-[#14151A] sm:text-[42px]">
            Connect integrations
            <br />
            you use every day
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-black/[0.06] sm:block" />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
            className="relative z-10 mx-auto mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg"
          >
            <div className="grid grid-cols-2 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3D6DF2]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#14151A]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#14151A]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#14151A]" />
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-7">
            {INTEGRATIONS.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 7) * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="flex aspect-square items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-sm"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: it.bg }}
                >
                  <it.icon className="h-5 w-5" style={{ color: it.fg }} strokeWidth={2} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
