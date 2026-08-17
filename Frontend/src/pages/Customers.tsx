import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

type CustomerStatus = "active" | "new" | "inactive";

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: CustomerStatus;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Amara Chen", email: "amara@brightloop.io", orders: 14, spent: 2840.5, joined: "Jan 2025", status: "active" },
  { id: "c2", name: "Deon Marsh", email: "deon@fieldworks.co", orders: 2, spent: 124.0, joined: "Aug 2026", status: "new" },
  { id: "c3", name: "Priya Nair", email: "priya@nairstudio.com", orders: 31, spent: 6512.75, joined: "Nov 2024", status: "active" },
  { id: "c4", name: "Omar Suleiman", email: "omar@dunehq.com", orders: 6, spent: 748.0, joined: "Mar 2025", status: "active" },
  { id: "c5", name: "Lena Kowalski", email: "lena@kowalski.dev", orders: 1, spent: 96.2, joined: "Jul 2026", status: "new" },
  { id: "c6", name: "Theo Baptiste", email: "theo@baptiste.co", orders: 0, spent: 0, joined: "Feb 2025", status: "inactive" },
  { id: "c7", name: "Yuki Tanaka", email: "yuki@tanakalab.jp", orders: 22, spent: 4128.9, joined: "May 2024", status: "active" },
  { id: "c8", name: "Ines Duarte", email: "ines@duarte.pt", orders: 3, spent: 318.4, joined: "Jun 2026", status: "new" },
];

const statusStyles: Record<CustomerStatus, string> = {
  active: "bg-teal/10 text-teal border-teal/20",
  new: "bg-clay/10 text-clay border-clay/20",
  inactive: "bg-white/5 text-slate-text border-white/10",
};

const statusLabel: Record<CustomerStatus, string> = {
  active: "Active",
  new: "New",
  inactive: "Inactive",
};

const filters: { label: string; value: CustomerStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "New", value: "new" },
  { label: "Inactive", value: "inactive" },
];

const PAGE_SIZE = 6;

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Customers() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CustomerStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return MOCK_CUSTOMERS.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "all" || c.status === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected = paged.length > 0 && paged.every((c) => selected.includes(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !paged.some((c) => c.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...paged.map((c) => c.id)])]);
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
          <h1 className="font-display text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-slate-text mt-1">
            {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "all" ? ` · ${statusLabel[activeFilter]}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-4 py-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors">
            Add customer
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
            placeholder="Search by name or email"
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
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium text-center">Orders</th>
                <th className="px-4 py-3 font-medium text-right">Spent</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(customer.id)}
                      onChange={() => toggleOne(customer.id)}
                      className="w-4 h-4 rounded border-white/20 bg-transparent accent-teal"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal text-xs font-semibold shrink-0">
                        {initials(customer.name)}
                      </span>
                      <div className="min-w-0">
                        <div className="text-cream truncate">{customer.name}</div>
                        <div className="text-xs text-slate-text truncate">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-text">{customer.orders}</td>
                  <td className="px-4 py-3.5 text-right text-cream font-medium">
                    ${customer.spent.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-text">{customer.joined}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[customer.status]}`}
                    >
                      {statusLabel[customer.status]}
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
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-text text-sm">
                    No customers match your search.
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