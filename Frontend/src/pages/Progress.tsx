import { motion } from "framer-motion";
import {
  TrendingUp,
  Flame,
  Target,
  CheckCircle2,
  Award,
  Clock,
} from "lucide-react";

const gpaTrend = [3.4, 3.5, 3.45, 3.6, 3.58, 3.65, 3.7, 3.72];
const semesterLabels = ["F23", "S24", "F24", "S25", "F25", "S26", "Su26", "F26"];

const weeklyStudyHours = [8, 12, 9, 14, 11, 15, 12.5];
const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CourseLoad {
  course: string;
  color: string;
  completion: number;
  grade: string;
}

const courseLoads: CourseLoad[] = [
  { course: "Data Structures", color: "#1EC2BC", completion: 62, grade: "A-" },
  { course: "Linear Algebra", color: "#E7714A", completion: 58, grade: "B+" },
  { course: "Technical Writing", color: "#9277ff", completion: 71, grade: "A" },
  { course: "Operating Systems Lab", color: "#65e6f4", completion: 45, grade: "B" },
];

const stats = [
  { label: "Study streak", value: "12 days", icon: Flame, color: "text-clay" },
  { label: "Tasks completed", value: "84%", icon: CheckCircle2, color: "text-teal" },
  { label: "Assignments on time", value: "91%", icon: Target, color: "text-teal" },
  { label: "Avg. weekly study", value: "11.6h", icon: Clock, color: "text-teal" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function Progress() {
  const maxStudyHours = Math.max(...weeklyStudyHours);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto">
      <motion.div variants={item} className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="text-sm text-slate-text mt-1">Your academic performance at a glance.</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02] hover:border-white/15 transition-colors">
              <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div className="text-2xl font-display font-semibold">{s.value}</div>
              <div className="text-xs text-slate-text mt-1">{s.label}</div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-teal" />
            <div>
              <h2 className="font-display text-base font-semibold">GPA trajectory</h2>
              <p className="text-xs text-slate-text mt-0.5">8 semesters, climbing overall</p>
            </div>
          </div>
          <svg viewBox="0 0 400 130" className="w-full h-36" preserveAspectRatio="none">
            <motion.polyline
              points={gpaTrend.map((v, i) => `${(i / (gpaTrend.length - 1)) * 400},${130 - (v - 3) * 170}`).join(" ")}
              fill="none"
              stroke="#1EC2BC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
            {gpaTrend.map((v, i) => (
              <circle
                key={i}
                cx={(i / (gpaTrend.length - 1)) * 400}
                cy={130 - (v - 3) * 170}
                r={i === gpaTrend.length - 1 ? 4 : 2.5}
                fill={i === gpaTrend.length - 1 ? "#5CF2E8" : "#1EC2BC"}
              />
            ))}
          </svg>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-text">
            {semesterLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-teal" />
            <div>
              <h2 className="font-display text-base font-semibold">Weekly study hours</h2>
              <p className="text-xs text-slate-text mt-0.5">This week vs. last 6 weeks</p>
            </div>
          </div>
          <div className="flex items-end gap-3 h-32">
            {weeklyStudyHours.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[9px] text-slate-text">{h}h</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(h / maxStudyHours) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  className={`w-full rounded-t-md ${i === weeklyStudyHours.length - 1 ? "bg-teal" : "bg-teal/25"}`}
                  style={{ minHeight: 4 }}
                />
                <span className="text-[9px] text-slate-text/60">{weekdayLabels[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-4 h-4 text-teal" />
          <h2 className="font-display text-base font-semibold">Course completion this semester</h2>
        </div>
        <div className="space-y-4">
          {courseLoads.map((c) => (
            <div key={c.course}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-cream flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.course}
                </span>
                <span className="text-xs text-slate-text">
                  {c.completion}% covered · <span className="text-cream font-medium">{c.grade}</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.completion}%` }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}