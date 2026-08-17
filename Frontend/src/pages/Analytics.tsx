import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
} from "lucide-react";

interface Kpi {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

const kpis: Kpi[] = [
  { label: "Revenue", value: "$48,920", delta: "+12.4%", trend: "up" },
  { label: "Avg. order value", value: "$68.40", delta: "+3.1%", trend: "up" },
  { label: "Conversion rate", value: "3.24%", delta: "-0.4%", trend: "down" },
  { label: "Returning customers", value: "41.2%", delta: "+5.6%", trend: "up" },
];

const revenueBars = [38, 52, 44, 61, 58, 72, 66, 80, 74, 88, 82, 95];
const ordersLine = [30, 45, 38, 55, 60, 52, 68, 74, 70, 85, 80, 92];

interface TopProduct {
  name: string;
  sku: string;
  sold: number;
  revenue: string;
  share: number;
}

const topProducts: TopProduct[] = [
  { name: "Aero Form 01", sku: "VXZ-AF01", sold: 412, revenue: "$60,976", share: 82 },
  { name: "Nova Tray", sku: "VXZ-NT06", sold: 298, revenue: "$16,167", share: 60 },
  { name: "Drift Lamp", sku: "VXZ-DL04", sold: 210, revenue: "$16,065", share: 42 },
  { name: "Quiet Frame", sku: "VXZ-QF08", sold: 154, revenue: "$9,856", share: 31 },
  { name: "Signal Vessel", sku: "VXZ-SV02", sold: 88, revenue: "$8,096", share: 18 },
];

interface TrafficSource {
  label: string;
  value: number;
  color: string;
}

const traffic: TrafficSource[] = [
  { label: "Organic search", value: 42, color: "bg-teal" },
  { label: "Direct", value: 26, color: "bg-teal/60" },
  { label: "Social", value: 18, color: "bg-clay" },
  { label: "Referral", value: 14, color: "bg-white/25" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function Analytics() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-text mt-1">Performance across your store, last 12 weeks.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-4 py-2 transition-colors self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Export report
        </button>
      </motion.div>

      {/* KPI cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-white/8 p-5 bg-white/[0.02] hover:border-white/15 transition-colors"
          >
            <div className="text-xs text-slate-text mb-2">{k.label}</div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-display font-semibold tracking-tight">{k.value}</span>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                  k.trend === "up" ? "text-teal" : "text-red-400"
                }`}
              >
                {k.trend === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {k.delta}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Revenue + orders charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold">Revenue</h2>
              <p className="text-xs text-slate-text mt-0.5">Weekly totals</p>
            </div>
            <button className="text-slate-text hover:text-cream transition-colors" aria-label="Chart options">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-end gap-2.5 h-36">
            {revenueBars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.03, ease: "easeOut" }}
                className={`flex-1 rounded-t-md ${i === revenueBars.length - 1 ? "bg-teal" : "bg-teal/25"}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold">Orders</h2>
              <p className="text-xs text-slate-text mt-0.5">Weekly volume</p>
            </div>
            <button className="text-slate-text hover:text-cream transition-colors" aria-label="Chart options">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <svg viewBox="0 0 300 120" className="w-full h-36" preserveAspectRatio="none">
            <motion.polyline
              points={ordersLine
                .map((v, i) => `${(i / (ordersLine.length - 1)) * 300},${120 - v * 1.1}`)
                .join(" ")}
              fill="none"
              stroke="#1EC2BC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
            {ordersLine.map((v, i) => (
              <circle
                key={i}
                cx={(i / (ordersLine.length - 1)) * 300}
                cy={120 - v * 1.1}
                r={i === ordersLine.length - 1 ? 3.5 : 2}
                fill={i === ordersLine.length - 1 ? "#5CF2E8" : "#1EC2BC"}
              />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Top products + traffic sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2 rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <h2 className="font-display text-base font-semibold mb-4">Top products</h2>
          <div className="space-y-4">
            {topProducts.map((p) => (
              <div key={p.sku}>
                <div className="flex items-center justify-between mb-1.5 gap-3">
                  <div className="min-w-0">
                    <span className="text-sm text-cream">{p.name}</span>
                    <span className="text-xs text-slate-text font-mono ml-2">{p.sku}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-slate-text">
                    <span>{p.sold} sold</span>
                    <span className="text-cream font-medium">{p.revenue}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.share}%` }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-teal"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <h2 className="font-display text-base font-semibold mb-4">Traffic sources</h2>
          <div className="space-y-3">
            {traffic.map((t) => (
              <div key={t.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-text">{t.label}</span>
                  <span className="text-xs text-cream font-medium">{t.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.value}%` }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className={`h-full rounded-full ${t.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}