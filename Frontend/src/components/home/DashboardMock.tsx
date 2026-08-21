import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ListChecks,
  Bell,
  ChevronsRight,
  Search,
  ChevronRight,
  Play,
  Pause,
  Square,
  Calendar,
  Check,
  Home as HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeUp, LedgerRing, useLiveTimer, useCountUp } from "../../lib/shared";

// ---------- sidebar ----------

const NAV_GENERAL = [
  { label: "Home", icon: HomeIcon, active: true },
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
      className="hidden w-[190px] shrink-0 border-r border-black/[0.06] bg-[#FBFAF7] px-3.5 py-4 md:block"
    >
      <div className="mb-5 flex items-center gap-2 px-1.5">
        <div className="grid grid-cols-2 gap-[2px]">
          <span className="h-[5px] w-[5px] rounded-full bg-[#3D6DF2]" />
          <span className="h-[5px] w-[5px] rounded-full bg-[#14151A]" />
          <span className="h-[5px] w-[5px] rounded-full bg-[#14151A]" />
          <span className="h-[5px] w-[5px] rounded-full bg-[#14151A]" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-[#14151A]">Vexez</span>
      </div>

      <button className="mb-5 flex w-full items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#14151A] shadow-sm transition hover:border-black/20">
        <Plus className="h-3.5 w-3.5" />
        Create
      </button>

      <p className="mb-1.5 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-black/35">
        General
      </p>
      <nav className="mb-5 space-y-0.5">
        {NAV_GENERAL.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`group flex items-center justify-between rounded-md px-1.5 py-1.5 text-[12px] transition ${
              item.active
                ? "bg-[#14151A] text-[#F6F4EF]"
                : "text-black/65 hover:bg-black/[0.04] hover:text-black/90"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <item.icon className="h-[13px] w-[13px]" />
              {item.label}
            </span>
            {item.count && (
              <span
                className={`text-[10px] tabular-nums ${
                  item.active ? "text-[#E8A33D]" : "text-black/35"
                }`}
              >
                {item.count}
              </span>
            )}
          </a>
        ))}
      </nav>

      <p className="mb-1.5 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-black/35">
        My workspace
      </p>
      <nav className="space-y-0.5">
        {NAV_WORKSPACE.map((label, i) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[12px] text-black/60 transition hover:bg-black/[0.04] hover:text-black/90"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: ["#3D6DF2", "#3E7C59", "#E8A33D", "#B15CDE"][i % 4] }}
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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between border-b border-black/[0.06] bg-white/70 px-5 py-2.5 backdrop-blur"
    >
      <div className="flex items-center gap-1.5 text-[12px] text-black/50">
        <Calendar className="h-3 w-3" />
        Monday, September 30
      </div>
      <div className="flex items-center gap-2.5">
        <div className="hidden items-center gap-1.5 rounded-lg border border-black/[0.08] bg-[#FBFAF7] px-2.5 py-1 text-black/40 sm:flex">
          <Search className="h-3 w-3" />
          <span className="text-[11px]">Search</span>
        </div>
        <button className="relative rounded-full p-1 text-black/50 transition hover:bg-black/[0.05]">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#E8552F]" />
        </button>
        <Avatar className="h-7 w-7 border border-black/10">
          <AvatarImage src="" alt="Amanda P." />
          <AvatarFallback className="bg-[#14151A] text-[10px] text-[#F6F4EF]">AP</AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  );
}

// ---------- to-do list card ----------

const TODOS = [
  { id: 1, label: "Finish the sales presentation for the client meeting at 2:00 PM", done: false },
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
      className="flex flex-col rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[12.5px] font-semibold text-[#14151A]">To do list</h3>
        <button className="flex items-center gap-1 text-[10.5px] text-black/40 hover:text-black/70">
          <Plus className="h-3 w-3" /> Create new
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((t, i) => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="flex items-start gap-2"
          >
            <Checkbox
              checked={t.done}
              onCheckedChange={() => toggle(t.id)}
              className="mt-0.5 h-3.5 w-3.5 rounded-[3px] border-black/25 data-[state=checked]:border-[#3E7C59] data-[state=checked]:bg-[#3E7C59]"
            />
            <span
              className={`text-[11.5px] leading-snug transition-colors ${
                t.done ? "text-black/35 line-through" : "text-black/75"
              }`}
            >
              {t.label}
            </span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between text-[11px] text-black/40">
          <span>Reminder</span>
          <div className="flex gap-0.5">
            <button className="rounded p-0.5 hover:bg-black/5">
              <ChevronRight className="h-3 w-3 rotate-180" />
            </button>
            <button className="rounded p-0.5 hover:bg-black/5">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-[#FBFAF7] px-2.5 py-1.5 text-[11px] text-black/55">
          <Calendar className="h-3 w-3 text-[#3D6DF2]" />
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
      className="flex flex-col items-center rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-3 flex w-full items-center justify-between">
        <h3 className="text-[12.5px] font-semibold text-[#14151A]">Time tracker</h3>
        <ChevronRight className="h-3.5 w-3.5 rotate-90 text-black/30" />
      </div>

      <div className="my-5 font-mono text-[24px] font-semibold tabular-nums tracking-tight text-[#14151A]">
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

      <div className="flex items-center gap-2.5">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setRunning((r) => !r)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EEE6] text-[#14151A] transition hover:bg-[#E8E4D8]"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8552F] text-white transition hover:bg-[#d64a26]"
        >
          <Square className="h-3 w-3 fill-white" />
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
      className="flex flex-col rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[12.5px] font-semibold text-[#14151A]">Activity</h3>
        <div className="flex rounded-full bg-[#F1EEE6] p-0.5 text-[10px] font-medium">
          {(["weekly", "daily"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`relative rounded-full px-2 py-0.5 capitalize transition-colors ${
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

      <div className="flex items-center gap-4">
        <div className="scale-90">
          <LedgerRing
            segments={[
              { value: 40, color: "#E8A33D" },
              { value: 30, color: "#3D6DF2" },
              { value: 30, color: "#3E7C59" },
            ]}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-[10px] text-black/40">Working hours</p>
            <p className="font-mono text-[13.5px] font-semibold tabular-nums text-[#14151A]">
              {working}/40
            </p>
          </div>
          <div>
            <p className="text-[10px] text-black/40">Tasks completed</p>
            <p className="font-mono text-[13.5px] font-semibold tabular-nums text-[#14151A]">
              {tasks}/12
            </p>
          </div>
          <div>
            <p className="text-[10px] text-black/40">Projects completed</p>
            <p className="font-mono text-[13.5px] font-semibold tabular-nums text-[#14151A]">
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
  { id: 1, label: "New ideas for campaign", pct: 60, color: "#E8552F" },
  { id: 2, label: "Change button", pct: 27, color: "#E8A33D" },
  { id: 3, label: "New BrandBook", pct: 95, color: "#3D6DF2" },
];

function AssignedCard() {
  const [tab, setTab] = useState<"Upcoming" | "Overdue" | "Completed">("Upcoming");
  return (
    <motion.div
      variants={fadeUp}
      custom={4}
      className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:col-span-2"
    >
      <div className="mb-0.5 flex items-center justify-between">
        <h3 className="text-[12.5px] font-semibold text-[#14151A]">Tasks I've assigned</h3>
        <button className="flex h-5 w-5 items-center justify-center rounded-full text-black/40 hover:bg-black/5">
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <div className="mb-3 flex gap-3.5 border-b border-black/[0.06] text-[11.5px]">
        {(["Upcoming", "Overdue", "Completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-1.5 transition-colors ${
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

      <ul className="space-y-2.5">
        {ASSIGNED.map((task, i) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-2.5"
          >
            <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: task.color }} />
            <span className="w-36 shrink-0 truncate text-[11.5px] text-black/75">{task.label}</span>
            <Progress
              value={task.pct}
              className="h-1.5 flex-1 bg-black/[0.06] [&>div]:bg-[#14151A]"
            />
            <span className="w-8 shrink-0 text-right font-mono text-[10.5px] tabular-nums text-black/45">
              {task.pct}%
            </span>
            <Avatar className="h-5 w-5 border border-black/10">
              <AvatarFallback className="bg-[#F1EEE6] text-[9px] text-black/60">
                {String.fromCharCode(65 + i)}
              </AvatarFallback>
            </Avatar>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------- main dashboard mock (hero visual) ----------

export function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-10 max-w-4xl rounded-[24px] bg-gradient-to-br from-[#3D6DF2] via-[#4E82F5] to-[#7FC4F5] p-2 shadow-2xl shadow-[#3D6DF2]/25"
    >
      {/* "20" badge — overlapping bottom-left edge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, type: "spring", stiffness: 210, damping: 15 }}
        className="absolute -left-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-2xl bg-white px-4 py-3 shadow-xl sm:block"
      >
        <span className="font-sans text-2xl font-bold text-[#14151A]">20</span>
      </motion.div>

      {/* green check badge — overlapping top-right edge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: 10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, type: "spring", stiffness: 220, damping: 15 }}
        className="absolute -right-6 top-6 z-10 hidden h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl sm:flex"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3E9C6F]">
          <Check className="h-5 w-5 text-white" strokeWidth={3.5} />
        </div>
      </motion.div>

      <div className="overflow-hidden rounded-[18px] bg-[#F6F4EF]">
        <Topbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="mb-4 flex items-center justify-between"
            >
              <h2 className="text-[18px] font-semibold tracking-tight text-[#14151A]">
                Good morning, <span className="text-[#3D6DF2]">Amanda</span>
              </h2>
              <Button
                size="sm"
                className="h-7 rounded-lg bg-[#14151A] px-2.5 text-[11px] text-[#F6F4EF] hover:bg-[#2a2b31]"
              >
                Customize
              </Button>
            </motion.div>

            <motion.div
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
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