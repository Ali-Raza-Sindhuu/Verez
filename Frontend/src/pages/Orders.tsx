import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

type OrderStatus = "paid" | "pending" | "fulfilled" | "cancelled" | "refunded";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

const MOCK_ORDERS: Order[] = [
  { id: "VXZ-10482", customer: "Amara Chen", email: "amara@brightloop.io", date: "Aug 16, 2026", items: 3, total: 284.5, status: "fulfilled" },
  { id: "VXZ-10481", customer: "Deon Marsh", email: "deon@fieldworks.co", date: "Aug 16, 2026", items: 1, total: 62.0, status: "pending" },
  { id: "VXZ-10480", customer: "Priya Nair", email: "priya@nairstudio.com", date: "Aug 15, 2026", items: 5, total: 512.75, status: "paid" },
  { id: "VXZ-10479", customer: "Omar Suleiman", email: "omar@dunehq.com", date: "Aug 15, 2026", items: 2, total: 148.0, status: "fulfilled" },
  { id: "VXZ-10478", customer: "Lena Kowalski", email: "lena@kowalski.dev", date: "Aug 14, 2026", items: 4, total: 396.2, status: "cancelled" },
  { id: "VXZ-10477", customer: "Theo Baptiste", email: "theo@baptiste.co", date: "Aug 14, 2026", items: 1, total: 45.0, status: "refunded" },
  { id: "VXZ-10476", customer: "Yuki Tanaka", email: "yuki@tanakalab.jp", date: "Aug 13, 2026", items: 6, total: 728.9, status: "paid" },
  { id: "VXZ-10475", customer: "Ines Duarte", email: "ines@duarte.pt", date: "Aug 13, 2026", items: 2, total: 118.4, status: "fulfilled" },
];

const statusStyles: Record<OrderStatus, string> = {
  paid: "bg-teal/10 text-teal border-teal/20",
  fulfilled: "bg-teal/10 text-teal border-teal/20",
  pending: "bg-clay/10 text-clay border-clay/20",
  cancelled: "bg-white/5 text-slate-text border-white/10",
  refunded: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabel: Record<OrderStatus, string> = {
  paid: "Paid",
  fulfilled: "Fulfilled",
  pending: "Pending",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const filters: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

const PAGE_SIZE = 6;

export default function Orders() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      const matchesQuery =
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase()) ||
        o.email.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "all" || o.status === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected = paged.length > 0 && paged.every((o) => selected.includes(o.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !paged.some((o) => o.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...paged.map((o) => o.id)])]);
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-slate-text mt-1">
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "all" ? ` · ${statusLabel[activeFilter]}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-4 py-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors">
            New order
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order, customer, email"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setPage(1);
              }}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                activeFilter === f.value
                  ? "bg-teal/10 text-teal border-teal/20"
                  : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
          <button className="shrink-0 inline-flex items-center gap-1 text-xs text-slate-text border border-white/10 rounded-full px-3.5 py-1.5 hover:text-cream hover:border-white/20 transition-colors ml-1">
            <Filter className="w-3.5 h-3.5" />
            More
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02] text-left text-xs text-slate-text uppercase tracking-wide">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-white/20 bg-transparent accent-teal"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-center">Items</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => toggleOne(order.id)}
                      className="w-4 h-4 rounded border-white/20 bg-transparent accent-teal"
                    />
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-cream">{order.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-cream">{order.customer}</div>
                    <div className="text-xs text-slate-text">{order.email}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-text">{order.date}</td>
                  <td className="px-4 py-3.5 text-center text-slate-text">{order.items}</td>
                  <td className="px-4 py-3.5 text-right text-cream font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="text-slate-text hover:text-cream transition-colors" aria-label="Row actions">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-text text-sm">
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/8 bg-white/[0.02]">
          <span className="text-xs text-slate-text">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-text hover:text-cream hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-text hover:text-cream hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}