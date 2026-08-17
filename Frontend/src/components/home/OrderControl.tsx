import { motion } from "framer-motion";

const stats = [
  { label: "Increase sales daily", value: "Give your sales team a shared, live-data view" },
  { label: "Scale without stress", value: "Handle 100 or 100,000 orders on the same rails" },
];

const rows = [
  { id: "#8104", customer: "Alicia Reyes", status: "Fulfilled", total: "$412.00" },
  { id: "#8103", customer: "Marcus Lee", status: "Processing", total: "$128.50" },
  { id: "#8102", customer: "Dana Fields", status: "Shipped", total: "$964.10" },
];

const statusColor: Record<string, string> = {
  Fulfilled: "text-teal bg-teal/10",
  Processing: "text-clay bg-clay/10",
  Shipped: "text-slate-text bg-white/5",
};

export default function OrderControl() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-teal">Get benefits</span>
        <h2 className="mt-4 font-display font-semibold text-3xl sm:text-4xl tracking-tight">
          Bring order to your online business
        </h2>
      </div>

      <div className="max-w-5xl mx-auto rounded-2xl border border-white/8 bg-card p-6 sm:p-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="font-display font-semibold text-xl">Stay in control of every order</h3>
          <p className="mt-2 text-sm text-slate-text">
            A dashboard built to give you everything at a glance, with a clean, modern interface you can scale on.
          </p>
          <div className="mt-6 space-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-slate-text mt-0.5">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-surface border border-white/5 p-4 inline-flex items-center gap-3">
            <span className="font-display text-2xl font-semibold text-teal">87%</span>
            <span className="text-xs text-slate-text max-w-[10rem]">
              Real-time sales tracking so you always know where you stand
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl bg-surface border border-white/5 overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-text border-b border-white/5">
                <th className="px-4 py-3 font-normal">Order</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-slate-text">{r.id}</td>
                  <td className="px-4 py-3">{r.customer}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
