import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  MoreHorizontal,
} from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: typeof DollarSign;
}

const stats: StatCard[] = [
  { label: "Revenue", value: "$48,920", delta: "+12.4%", trend: "up", icon: DollarSign },
  { label: "Orders", value: "1,284", delta: "+8.1%", trend: "up", icon: ShoppingCart },
  { label: "Products in stock", value: "3,402", delta: "-2.3%", trend: "down", icon: Package },
  { label: "Active customers", value: "892", delta: "+4.7%", trend: "up", icon: Users },
];

interface RecentOrder {
  id: string;
  customer: string;
  total: string;
  status: "paid" | "pending" | "fulfilled";
}

const recentOrders: RecentOrder[] = [
  { id: "VXZ-10482", customer: "Amara Chen", total: "$284.50", status: "fulfilled" },
  { id: "VXZ-10481", customer: "Deon Marsh", total: "$62.00", status: "pending" },
  { id: "VXZ-10480", customer: "Priya Nair", total: "$512.75", status: "paid" },
  { id: "VXZ-10479", customer: "Omar Suleiman", total: "$148.00", status: "fulfilled" },
];

const statusStyles: Record<RecentOrder["status"], string> = {
  paid: "bg-teal/10 text-teal border-teal/20",
  fulfilled: "bg-teal/10 text-teal border-teal/20",
  pending: "bg-clay/10 text-clay border-clay/20",
};

const statusLabel: Record<RecentOrder["status"], string> = {
  paid: "Paid",
  fulfilled: "Fulfilled",
  pending: "Pending",
};

const chartBars = [38, 52, 44, 61, 58, 72, 66, 80, 74, 88, 82, 95];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function Dashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-text mt-1">Overview of your store's performance.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto">
          Download report
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-white/8 p-5 bg-white/[0.02] hover:border-white/15 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    s.trend === "up" ? "text-teal" : "text-red-400"
                  }`}
                >
                  {s.trend === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {s.delta}
                </span>
              </div>
              <div className="text-2xl font-display font-semibold tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-text mt-1">{s.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Chart + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <motion.div
          variants={item}
          className="lg:col-span-2 rounded-2xl border border-white/8 p-5 bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold">Revenue</h2>
              <p className="text-xs text-slate-text mt-0.5">Last 12 weeks</p>
            </div>
            <button className="text-slate-text hover:text-cream transition-colors" aria-label="Chart options">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end gap-2.5 h-40">
            {chartBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.03, ease: "easeOut" }}
                  className={`w-full rounded-t-md ${
                    i === chartBars.length - 1 ? "bg-teal" : "bg-teal/25"
                  }`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent orders */}
        <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold">Recent orders</h2>
            <a href="/dashboard/orders" className="text-xs text-teal hover:text-teal-glow transition-colors">
              View all
            </a>
          </div>

          <div className="space-y-1">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
              >
                <div className="min-w-0">
                  <div className="text-sm text-cream truncate">{o.customer}</div>
                  <div className="text-xs text-slate-text font-mono">{o.id}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                  <span className="text-sm font-medium text-cream">{o.total}</span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusStyles[o.status]}`}
                  >
                    {statusLabel[o.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}