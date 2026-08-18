import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Sparkles,
  ListChecks,
  UserPlus,
  Search,
  Bell,
  ChevronRight,
  Play,
  Pause,
  Square,
  Plus,
  CheckCircle2,
  Users,
  Calendar,
  ChevronsRight,
  Check,
  Timer,
  Mail,
  MessageSquare,
  Menu,
  MessageCircle,
  Headphones,
  Cloud,
  Layers,
  PenTool,
  Waypoints,
  Zap,
  Hexagon,
  Mountain,
  CheckCheck,
  Flag,
  Lightbulb,
  Hourglass,
  ArrowRight,
} from "lucide-react";import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";



/**
 * VEXEZ — Product dashboard home
 * Palette: ink (#14151A), porcelain (#F6F4EF), signal amber (#E8A33D),
 * ledger green (#3E7C59), wire blue (#4C6FFF)
 * Typeface roles: display = tracking-tight sans (system), data = tabular mono for numbers/time
 * Signature: the "ledger" — every number reads like a running tally, stitched together
 * with a hairline connector, echoing an inventory ledger rather than a generic SaaS dashboard.
 */

// ---------- helpers ----------

function useCountUp(target: number, durationMs = 1200) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, target, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return display;
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ---------- decorative ring ----------

function LedgerRing({
  segments,
}: {
  segments: { value: number; color: string }[];
}) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  const r = 30;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#EDEAE1" strokeWidth="7" />
      {segments.map((s, i) => {
        const frac = s.value / total;
        const dash = frac * c;
        const el = (
          <motion.circle
            key={i}
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            initial={{ strokeDasharray: `0 ${c}` }}
            animate={{ strokeDasharray: `${dash} ${c - dash}` }}
            transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ---------- timer ----------

function useLiveTimer(running: boolean) {
  const [seconds, setSeconds] = useState(15718); // 04:21:58
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ---------- sidebar ----------

const NAV_PRIMARY = [{ label: "Create", icon: Plus }];
const NAV_GENERAL = [
  { label: "Home", icon: Sparkles, active: true },
  { label: "My Tasks", icon: ListChecks, count: 22 },
  { label: "Inbox", icon: Bell, count: 15 },
  { label: "Reporting", icon: ChevronsRight },
  { label: "Portfolios", icon: ChevronsRight },
  { label: "Goals", icon: ChevronsRight, count: 8 },
];
const NAV_WORKSPACE = ["Branding & Identity", "Marketing Team", "Product launch", "Team brainstorm"];

function Sidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="hidden w-64 shrink-0 border-r border-black/[0.06] bg-[#FBFAF7] px-4 py-5 md:block"
    >
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#14151A] text-[#E8A33D]">
          <span className="font-mono text-[13px] font-semibold">V</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-[#14151A]">Vexez</span>
      </div>

      <button className="mb-6 flex w-full items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm font-medium text-[#14151A] shadow-sm transition hover:border-black/20">
        <Plus className="h-4 w-4" />
        Create
      </button>

      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-black/35">
        General
      </p>
      <nav className="mb-6 space-y-0.5">
        {NAV_GENERAL.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-[13.5px] transition ${
              item.active
                ? "bg-[#14151A] text-[#F6F4EF]"
                : "text-black/65 hover:bg-black/[0.04] hover:text-black/90"
            }`}
          >
            <span className="flex items-center gap-2">
              <item.icon className="h-[15px] w-[15px]" />
              {item.label}
            </span>
            {item.count && (
              <span
                className={`text-[11px] tabular-nums ${
                  item.active ? "text-[#E8A33D]" : "text-black/35"
                }`}
              >
                {item.count}
              </span>
            )}
          </a>
        ))}
      </nav>

      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-black/35">
        My workspace
      </p>
      <nav className="space-y-0.5">
        {NAV_WORKSPACE.map((label, i) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13.5px] text-black/60 transition hover:bg-black/[0.04] hover:text-black/90"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: ["#4C6FFF", "#3E7C59", "#E8A33D", "#B15CDE"][i % 4] }}
            />
            <span className="truncate">{label}</span>
          </a>
        ))}
      </nav>
    </motion.aside>
  );
}

// ---------- topbar ----------

function Topbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex items-center justify-between border-b border-black/[0.06] bg-white/70 px-6 py-3 backdrop-blur"
    >
      <div className="flex items-center gap-2 text-[13px] text-black/50">
        <Calendar className="h-3.5 w-3.5" />
        Monday, September 30
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-black/[0.08] bg-[#FBFAF7] px-3 py-1.5 text-black/40 sm:flex">
          <Search className="h-3.5 w-3.5" />
          <span className="text-[12.5px]">Search</span>
        </div>
        <button className="relative rounded-full p-1.5 text-black/50 transition hover:bg-black/[0.05]">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E8552F]" />
        </button>
        <Avatar className="h-8 w-8 border border-black/10">
          <AvatarImage src="" alt="Amanda P." />
          <AvatarFallback className="bg-[#14151A] text-[11px] text-[#F6F4EF]">AP</AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  );
}

// ---------- to-do list card ----------

const TODOS = [
  { id: 1, label: "Finish the sales presentation for the client meeting at 2:00 PM", done: false, flag: true },
  { id: 2, label: "Send follow-up emails to potential leads", done: true },
  { id: 3, label: "Review and approve the marketing budget", done: false },
  { id: 4, label: "Take 10 minutes for meditation or deep breathing", done: true },
];

function TodoCard() {
  const [todos, setTodos] = useState(TODOS);
  const toggle = (id: number) =>
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <motion.div
      variants={fadeUp}
      custom={1}
      className="flex flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-[#14151A]">To do list</h3>
        <button className="flex items-center gap-1 text-[12px] text-black/40 hover:text-black/70">
          <Plus className="h-3.5 w-3.5" /> Create new
        </button>
      </div>
      <ul className="space-y-2.5">
        {todos.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.08 }}
            className="flex items-start gap-2.5"
          >
            <Checkbox
              checked={t.done}
              onCheckedChange={() => toggle(t.id)}
              className="mt-0.5 h-4 w-4 rounded-[4px] border-black/25 data-[state=checked]:border-[#3E7C59] data-[state=checked]:bg-[#3E7C59]"
            />
            <span
              className={`text-[13px] leading-snug transition-colors ${
                t.done ? "text-black/35 line-through" : "text-black/75"
              }`}
            >
              {t.label}
            </span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between text-[12px] text-black/40">
          <span>Reminder</span>
          <div className="flex gap-1">
            <button className="rounded p-0.5 hover:bg-black/5">
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            </button>
            <button className="rounded p-0.5 hover:bg-black/5">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#FBFAF7] px-3 py-2 text-[12.5px] text-black/55">
          <Calendar className="h-3.5 w-3.5 text-[#4C6FFF]" />
          Today's Meeting
        </div>
      </div>
    </motion.div>
  );
}

// ---------- time tracker card ----------

function TimeTrackerCard() {
  const [running, setRunning] = useState(true);
  const clock = useLiveTimer(running);

  return (
    <motion.div
      variants={fadeUp}
      custom={2}
      className="flex flex-col items-center rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-4 flex w-full items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-[#14151A]">Time tracker</h3>
        <ChevronRight className="h-4 w-4 rotate-90 text-black/30" />
      </div>

      <div className="my-6 font-mono text-[28px] font-semibold tabular-nums tracking-tight text-[#14151A]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={clock}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {clock}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setRunning((r) => !r)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1EEE6] text-[#14151A] transition hover:bg-[#E8E4D8]"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8552F] text-white transition hover:bg-[#d64a26]"
        >
          <Square className="h-3.5 w-3.5 fill-white" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ---------- activity card ----------

function ActivityCard() {
  const [range, setRange] = useState<"weekly" | "daily">("weekly");
  const working = useCountUp(29);
  const tasks = useCountUp(8);
  const projects = useCountUp(4);

  return (
    <motion.div
      variants={fadeUp}
      custom={3}
      className="flex flex-col rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-[#14151A]">Activity</h3>
        <div className="flex rounded-full bg-[#F1EEE6] p-0.5 text-[11px] font-medium">
          {(["weekly", "daily"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`relative rounded-full px-2.5 py-1 capitalize transition-colors ${
                range === r ? "text-white" : "text-black/45"
              }`}
            >
              {range === r && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-full bg-[#14151A]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <LedgerRing
          segments={[
            { value: 40, color: "#E8A33D" },
            { value: 30, color: "#4C6FFF" },
            { value: 30, color: "#3E7C59" },
          ]}
        />
        <div className="flex-1 space-y-2.5">
          <div>
            <p className="text-[11px] text-black/40">Working hours</p>
            <p className="font-mono text-[15px] font-semibold tabular-nums text-[#14151A]">
              {working}/40
            </p>
          </div>
          <div>
            <p className="text-[11px] text-black/40">Tasks completed</p>
            <p className="font-mono text-[15px] font-semibold tabular-nums text-[#14151A]">
              {tasks}/12
            </p>
          </div>
          <div>
            <p className="text-[11px] text-black/40">Projects completed</p>
            <p className="font-mono text-[15px] font-semibold tabular-nums text-[#14151A]">
              {projects}/7
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- assigned tasks card ----------

const ASSIGNED = [
  { id: 1, label: "New ideas for campaign", pct: 60, tag: "Marketing", color: "#E8552F" },
  { id: 2, label: "Change button", pct: 27, tag: "UI", color: "#E8A33D" },
  { id: 3, label: "New BrandBook", pct: 95, tag: "Branding", color: "#4C6FFF" },
];

function AssignedCard() {
  const [tab, setTab] = useState<"Upcoming" | "Overdue" | "Completed">("Upcoming");
  return (
    <motion.div
      variants={fadeUp}
      custom={4}
      className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:col-span-2"
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-[#14151A]">Tasks I've assigned</h3>
        <button className="flex h-6 w-6 items-center justify-center rounded-full text-black/40 hover:bg-black/5">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mb-4 flex gap-4 border-b border-black/[0.06] text-[12.5px]">
        {(["Upcoming", "Overdue", "Completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-2 transition-colors ${
              tab === t ? "text-[#14151A] font-medium" : "text-black/40"
            }`}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="assigned-underline"
                className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-[#14151A]"
              />
            )}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {ASSIGNED.map((task, i) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.09 }}
            className="flex items-center gap-3"
          >
            <span
              className="h-7 w-1 shrink-0 rounded-full"
              style={{ background: task.color }}
            />
            <span className="w-40 shrink-0 truncate text-[13px] text-black/75">{task.label}</span>
            <Progress
              value={task.pct}
              className="h-1.5 flex-1 bg-black/[0.06] [&>div]:bg-[#14151A]"
            />
            <span className="w-9 shrink-0 text-right font-mono text-[11.5px] tabular-nums text-black/45">
              {task.pct}%
            </span>
            <Avatar className="h-6 w-6 border border-black/10">
              <AvatarFallback className="bg-[#F1EEE6] text-[10px] text-black/60">
                {String.fromCharCode(65 + i)}
              </AvatarFallback>
            </Avatar>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------- navbar ----------

const NAV_LINKS = ["Features", "Solutions", "Resources", "Pricing"];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/80 px-6 py-4 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-[3px]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#4C6FFF]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#14151A]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#14151A]" />
            <span className="h-[7px] w-[7px] rounded-full bg-[#14151A]" />
          </div>
          <span className="text-[16px] font-semibold tracking-tight text-[#14151A]">Vexez</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[13.5px] text-black/60 transition hover:text-black/90"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className="text-[13.5px] font-medium text-black/70 hover:text-black/95">
            Sign in
          </a>
          <Button className="rounded-lg bg-[#14151A] px-4 text-[13px] text-[#F6F4EF] hover:bg-[#2a2b31]">
            Get demo
          </Button>
        </div>

        <button className="p-1 md:hidden" onClick={() => setOpen((o) => !o)}>
          <Menu className="h-5 w-5 text-[#14151A]" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-3 pt-4">
              {NAV_LINKS.map((l) => (
                <a key={l} href="#" className="text-[13.5px] text-black/60">
                  {l}
                </a>
              ))}
              <Button className="mt-1 w-full rounded-lg bg-[#14151A] text-[#F6F4EF]">
                Get demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ---------- floating hero artifacts ----------

function FloatCard({
  children,
  className = "",
  delay = 0,
  rotate = 0,
  floatDistance = 8,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
  floatDistance?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotate * 1.4 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -floatDistance, 0] }}
        transition={{
          duration: 4.5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function StickyNoteCard() {
  return (
    <FloatCard
      className="absolute left-0 top-16 z-10 hidden w-44 sm:block lg:left-10"
      delay={0.15}
      rotate={-6}
    >
      <div className="relative">
        <span className="absolute -top-1.5 left-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#E8552F] shadow" />
        <div
          className="rounded-sm p-4 shadow-lg"
          style={{ background: "#FCE98A" }}
        >
          <p className="font-mono text-[12px] leading-snug text-black/70">
            Take notes to keep track of crucial details, and accomplish more
            tasks with ease.
          </p>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          whileInView={{ scale: 1, rotate: -8 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: "spring", stiffness: 250, damping: 14 }}
          className="absolute -bottom-4 -right-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4C6FFF]">
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        </motion.div>
      </div>
    </FloatCard>
  );
}

function ReminderCard() {
  return (
    <FloatCard
      className="absolute right-0 top-8 z-10 hidden w-48 sm:block lg:right-10"
      delay={0.3}
      rotate={5}
    >
      <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-xl">
        <p className="mb-2 text-[13px] font-semibold text-[#14151A]">Reminders</p>
        <p className="mb-1 text-[10px] uppercase tracking-wide text-black/30">Meetings</p>
        <p className="mb-2 text-[12px] text-black/60">Today's Meeting</p>
        <div className="rounded-md bg-[#F1EEE6] px-2 py-1">
          <p className="mb-0.5 text-[11px] text-black/55">Call with marketing team</p>
          <div className="flex items-center gap-1 text-[10px] text-black/40">
            <Timer className="h-3 w-3" />
            13:00 – 13:45
          </div>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, type: "spring", stiffness: 240, damping: 14 }}
        className="absolute -left-6 top-16 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xl"
      >
        <Timer className="h-5 w-5 text-[#E8A33D]" />
      </motion.div>
    </FloatCard>
  );
}

function TasksPreviewCard() {
  const rows = [
    { label: "New ideas for campaign", pct: 60, date: "Sep 10", color: "#E8552F" },
    { label: "Design PPT #4", pct: 112, date: "Sep 18", color: "#3E7C59" },
  ];
  return (
    <FloatCard
      className="absolute -bottom-6 left-0 z-10 hidden w-56 sm:block lg:left-12"
      delay={0.4}
      rotate={-3}
      floatDistance={6}
    >
      <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-xl">
        <p className="mb-3 text-[13px] font-semibold text-[#14151A]">Today's tasks</p>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11.5px] text-black/70">
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] text-[8px] text-white"
                    style={{ background: r.color }}
                  >
                    ✓
                  </span>
                  {r.label}
                </span>
                <span className="text-[10px] text-black/35">{r.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={Math.min(r.pct, 100)}
                  className="h-1.5 flex-1 bg-black/[0.06] [&>div]:bg-[#4C6FFF]"
                />
                <span className="w-8 text-right font-mono text-[10px] tabular-nums text-black/40">
                  {r.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FloatCard>
  );
}

function IntegrationsCard() {
  return (
    <FloatCard
      className="absolute -bottom-8 right-0 z-10 hidden w-48 sm:block lg:right-8"
      delay={0.5}
      rotate={4}
      floatDistance={6}
    >
      <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-xl">
        <p className="mb-3 text-[13px] font-semibold text-[#14151A]">100+ Integrations</p>
        <div className="flex gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FBEAE5]">
            <Mail className="h-4 w-4 text-[#E8552F]" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDE9FE]">
            <MessageSquare className="h-4 w-4 text-[#7C5CFF]" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6F0FF]">
            <Calendar className="h-4 w-4 text-[#4C6FFF]" />
          </div>
        </div>
      </div>
    </FloatCard>
  );
}

// ---------- hero section ----------

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.06] bg-[#FBFAF7]">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 pb-40 pt-24 text-center sm:pb-48">
        <StickyNoteCard />
        <ReminderCard />
        <TasksPreviewCard />
        <IntegrationsCard />

        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg"
        >
          <div className="grid grid-cols-2 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4C6FFF]" />
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
          className="text-[42px] font-semibold leading-[1.08] tracking-tight text-[#14151A] sm:text-[56px]"
        >
          Think, plan, and track
          <br />
          <span className="text-black/25">all in one place</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-5 max-w-md text-[15px] text-black/50"
        >
          Efficiently manage your tasks and boost productivity.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Button className="rounded-xl bg-[#4C6FFF] px-6 py-5 text-[14px] font-medium text-white shadow-lg shadow-[#4C6FFF]/25 hover:bg-[#3d5eef]">
              Get free demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- hero challenge strip ----------

const CHALLENGES = [
  {
    icon: Sparkles,
    title: "Stay aligned",
    body: "Ensure your team is always on the same page with task-sharing and transparent updates.",
  },
  {
    icon: ListChecks,
    title: "Prioritize with clarity",
    body: "Prioritize and manage tasks effectively so your team can focus on what matters most.",
  },
  {
    icon: UserPlus,
    title: "Own the outcome",
    body: "Hold everyone accountable without the need for constant check-ins.",
  },
];

function ChallengeStrip() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 text-center">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <Badge
          variant="outline"
          className="mb-4 rounded-full border-black/10 bg-[#FBFAF7] px-3 py-1 text-[11px] font-medium text-black/50"
        >
          Solutions
        </Badge>
        <h2 className="text-[34px] font-semibold leading-[1.15] tracking-tight text-[#14151A] sm:text-[42px]">
          Solve your team's
          <br />
          biggest challenges
        </h2>
      </motion.div>

      <div className="relative mt-12 grid grid-cols-1 gap-8 border-t border-black/[0.07] pt-10 text-left sm:grid-cols-3">
        {CHALLENGES.map((c, i) => (
          <motion.div
            key={c.title}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            <span className="absolute -top-[42px] left-0 h-2 w-2 rounded-full bg-[#14151A] ring-4 ring-[#F6F4EF]" />
            <c.icon className="mb-3 h-5 w-5 text-[#E8A33D]" strokeWidth={1.75} />
            <p className="text-[13.5px] leading-relaxed text-black/55">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------- main dashboard mock (hero visual) ----------

function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-14 max-w-5xl rounded-[28px] bg-gradient-to-br from-[#4C6FFF] via-[#5C8CFF] to-[#8FD3FF] p-2 shadow-2xl shadow-[#4C6FFF]/20"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}
        className="absolute -left-6 top-24 z-10 hidden rounded-2xl bg-[#14151A] px-4 py-3 shadow-xl sm:block"
      >
        <span className="font-mono text-2xl font-bold text-[#F6F4EF]">20</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 5 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 14 }}
        className="absolute -right-4 top-16 z-10 hidden h-11 w-11 items-center justify-center rounded-xl bg-white shadow-xl sm:flex"
      >
        <CheckCircle2 className="h-5 w-5 text-[#3E7C59]" />
      </motion.div>

      <div className="overflow-hidden rounded-[22px] bg-[#F6F4EF]">
        <Topbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="mb-5 flex items-center justify-between"
            >
              <h2 className="text-[22px] font-semibold tracking-tight text-[#14151A]">
                Good morning, <span className="text-[#4C6FFF]">Amanda</span>
              </h2>
              <Button
                size="sm"
                className="rounded-lg bg-[#14151A] text-[12.5px] text-[#F6F4EF] hover:bg-[#2a2b31]"
              >
                Customize
              </Button>
            </motion.div>

            <motion.div
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <TodoCard />
              <TimeTrackerCard />
              <ActivityCard />
              <AssignedCard />
            </motion.div>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- features section ----------

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

function FeaturesSection() {
  return (
    <section className="mt-24 bg-[#F1EEE6] px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#4C6FFF] text-[12px] font-medium text-white"
                  style={{ background: ["#4C6FFF", "#E8A33D", "#3E7C59", "#B15CDE"][i] }}
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
                  className="w-6 rounded-md bg-[#4C6FFF]/70"
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
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#4C6FFF] to-[#8FD3FF]"
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

// ---------- integrations section ----------

const INTEGRATIONS: { label: string; icon: React.ElementType; bg: string; fg: string }[] = [
  { label: "Drive", icon: Cloud, bg: "#EAF2FF", fg: "#4C6FFF" },
  { label: "Creative", icon: Sparkles, bg: "#FBEAFF", fg: "#C24CD6" },
  { label: "Track", icon: Waypoints, bg: "#EAF2FF", fg: "#2F6FED" },
  { label: "Mail", icon: Mail, bg: "#FEF1EA", fg: "#E8552F" },
  { label: "Figma", icon: PenTool, bg: "#FBEAFF", fg: "#C24CD6" },
  { label: "Outlook", icon: Mail, bg: "#EAF2FF", fg: "#2F6FED" },
  { label: "Slack", icon: Layers, bg: "#F1EEFC", fg: "#7C5CFF" },
  { label: "Studio", icon: Mountain, bg: "#F1EEFC", fg: "#6B4CE8" },
  { label: "Cloud CRM", icon: Cloud, bg: "#EAF2FF", fg: "#2F6FED" },
  { label: "Support", icon: Headphones, bg: "#E9F7EF", fg: "#3E7C59" },
  { label: "Hub", icon: Zap, bg: "#FEF1EA", fg: "#E8552F" },
  { label: "Community", icon: MessageCircle, bg: "#14151A", fg: "#F6F4EF" },
  { label: "Calendar", icon: Calendar, bg: "#EAF2FF", fg: "#2F6FED" },
  { label: "Hexagon", icon: Hexagon, bg: "#E9F7EF", fg: "#3E7C59" },
];

function IntegrationsSection() {
  return (
    <section className="relative overflow-hidden bg-[#F6F4EF] px-6 pt-24 pb-8">
      <div className="mx-auto max-w-5xl text-center">
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
          {/* connector lines + hub */}
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-black/[0.06] sm:block" />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
            className="relative z-10 mx-auto mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg"
          >
            <div className="grid grid-cols-2 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4C6FFF]" />
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
                transition={{ delay: (i % 7) * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="flex aspect-square items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-sm"
                style={{ background: "white" }}
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

// ---------- testimonials section ----------

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
    avatarColor: "#4C6FFF",
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

function TestimonialCard({ t, delay = 0, className = "" }: { t: Testimonial; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
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
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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

function TestimonialsSection() {
  return (
    <section className="bg-[#F6F4EF] px-6 pb-24 pt-16">
      <div className="mx-auto max-w-5xl">
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
          {/* column 1 */}
          <div className="flex flex-col gap-4">
            <TestimonialCard t={TESTIMONIALS[0]} delay={0} className="sm:min-h-[280px]" />
            <TestimonialCard t={TESTIMONIALS[1]} delay={0.1} />
          </div>
          {/* column 2 */}
          <div className="flex flex-col gap-4">
            <TestimonialCard t={TESTIMONIALS[2]} delay={0.05} />
            <TestimonialCard t={TESTIMONIALS[3]} delay={0.15} className="sm:min-h-[220px]" />
          </div>
          {/* column 3 */}
          <div className="flex flex-col gap-4">
            <TestimonialCard t={TESTIMONIALS[4]} delay={0.1} />
            <VideoTestimonialCard />
          </div>
        </div>
      </div>
    </section>
  );
}



// ---------- pricing section ----------

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
        transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6 }}
        className="relative flex flex-col rounded-3xl bg-gradient-to-b from-[#4C6FFF] to-[#3d5eef] p-6 text-white shadow-xl shadow-[#4C6FFF]/25 sm:-translate-y-4"
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
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-3xl border border-black/[0.06] bg-white/60 p-6"
    >
      <h3 className="text-[16px] font-semibold text-[#14151A]">{plan.name}</h3>
      <p className="mt-0.5 text-[12.5px] text-black/45">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-[38px] font-bold leading-none text-[#14151A]">${plan.price}</span>
        <span className="text-[13px] text-black/40">/mo</span>
      </div>

      <Button className="mt-9 w-full rounded-xl bg-[#4C6FFF] py-5 text-[13.5px] font-semibold text-white hover:bg-[#3d5eef]">
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

function PricingSection() {
  return (
    <section className="bg-[#F6F4EF] px-6 pb-28 pt-4">
      <div className="mx-auto max-w-5xl text-center">
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

// ---------- footer ----------

const FOOTER_LINKS_LEFT = ["About Us", "Contact", "What's New", "Careers"];
const FOOTER_LINKS_RIGHT = ["Product", "Solutions", "Integrations", "Price"];

const FOOTER_ICONS: { icon: React.ElementType; bg: string; fg: string; rotate: number; delay: number }[] = [
  { icon: MessageCircle, bg: "#FFFFFF", fg: "#14151A", rotate: -6, delay: 0 },
  { icon: Check, bg: "#4C6FFF", fg: "#FFFFFF", rotate: 5, delay: 0.35 },
  { icon: Flag, bg: "#FFFFFF", fg: "#4C6FFF", rotate: -4, delay: 0.1 },
  { icon: Timer, bg: "#14151A", fg: "#F6F4EF", rotate: 6, delay: 0.4 },
  { icon: Calendar, bg: "#FFFFFF", fg: "#14151A", rotate: 3, delay: 0.15 },
  { icon: Hourglass, bg: "#FFFFFF", fg: "#14151A", rotate: -5, delay: 0.45 },
  { icon: Lightbulb, bg: "#E8A33D", fg: "#FFFFFF", rotate: 5, delay: 0.2 },
  { icon: Timer, bg: "#FFFFFF", fg: "#14151A", rotate: -3, delay: 0.5 },
  { icon: ChevronsRight, bg: "#FFFFFF", fg: "#4C6FFF", rotate: 4, delay: 0.25 },
];

function FooterFloatIcon({
  icon: Icon,
  bg,
  fg,
  rotate,
  delay,
  className,
}: {
  icon: React.ElementType;
  bg: string;
  fg: string;
  rotate: number;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotate * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
        style={{ background: bg }}
      >
        <Icon className="h-5 w-5" style={{ color: fg }} strokeWidth={2} />
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="mx-6 mb-6 overflow-hidden rounded-[28px] border border-black/[0.06] bg-[#F1EEE6]">
      <div className="relative px-8 pt-14 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start"
        >
          <div>
            <div className="mb-5 flex items-center gap-2">
              <div className="grid grid-cols-2 gap-[3px]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#4C6FFF]" />
                <span className="h-[7px] w-[7px] rounded-full bg-[#14151A]" />
                <span className="h-[7px] w-[7px] rounded-full bg-[#14151A]" />
                <span className="h-[7px] w-[7px] rounded-full bg-[#14151A]" />
              </div>
              <span className="text-[16px] font-semibold tracking-tight text-[#14151A]">Vexez</span>
            </div>
            <h3 className="max-w-xs text-[26px] font-semibold leading-[1.2] tracking-tight text-[#14151A] sm:text-[30px]">
              Stay organized and boost your productivity
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[13px]">
            <ul className="space-y-2.5">
              {FOOTER_LINKS_LEFT.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-black/55 transition hover:text-black/90"
                  >
                    <ArrowRight className="h-3 w-3 text-black/30" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {FOOTER_LINKS_RIGHT.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-black/55 transition hover:text-black/90"
                  >
                    <ArrowRight className="h-3 w-3 text-black/30" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="relative mt-16 h-64 sm:h-72">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          />
          <FooterFloatIcon {...FOOTER_ICONS[0]} className="left-[6%] top-[38%]" />
          <FooterFloatIcon {...FOOTER_ICONS[1]} className="left-[20%] top-[8%]" />
          <FooterFloatIcon {...FOOTER_ICONS[2]} className="left-[18%] top-[62%]" />
          <FooterFloatIcon {...FOOTER_ICONS[3]} className="left-[34%] top-[46%]" />
          <FooterFloatIcon {...FOOTER_ICONS[4]} className="left-[48%] top-[4%]" />
          <FooterFloatIcon {...FOOTER_ICONS[5]} className="left-[52%] top-[58%]" />
          <FooterFloatIcon {...FOOTER_ICONS[6]} className="left-[72%] top-[10%]" />
          <FooterFloatIcon {...FOOTER_ICONS[7]} className="left-[68%] top-[54%]" />
          <FooterFloatIcon {...FOOTER_ICONS[8]} className="left-[86%] top-[42%]" />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/[0.07] py-6 text-[11.5px] text-black/40 sm:flex-row">
          <span>© 2026. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-black/70">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black/70">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F4EF] font-sans antialiased">
      <Navbar />
      <Hero />
      <ChallengeStrip />
      <DashboardMock />
      <FeaturesSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}