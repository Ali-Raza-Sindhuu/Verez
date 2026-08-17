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
  Package,
} from "lucide-react";

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: StockStatus;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Aero Form 01", sku: "VXZ-AF01", category: "Objects", price: 148.0, stock: 84, status: "in-stock" },
  { id: "p2", name: "Signal Vessel", sku: "VXZ-SV02", category: "Objects", price: 92.0, stock: 12, status: "low-stock" },
  { id: "p3", name: "Core Module", sku: "VXZ-CM03", category: "Hardware", price: 214.0, stock: 0, status: "out-of-stock" },
  { id: "p4", name: "Drift Lamp", sku: "VXZ-DL04", category: "Lighting", price: 76.5, stock: 156, status: "in-stock" },
  { id: "p5", name: "Ember Case", sku: "VXZ-EC05", category: "Accessories", price: 38.0, stock: 8, status: "low-stock" },
  { id: "p6", name: "Nova Tray", sku: "VXZ-NT06", category: "Objects", price: 54.25, stock: 210, status: "in-stock" },
  { id: "p7", name: "Halcyon Dock", sku: "VXZ-HD07", category: "Hardware", price: 132.0, stock: 0, status: "out-of-stock" },
  { id: "p8", name: "Quiet Frame", sku: "VXZ-QF08", category: "Lighting", price: 64.0, stock: 47, status: "in-stock" },
];

const stockStyles: Record<StockStatus, string> = {
  "in-stock": "bg-teal/10 text-teal border-teal/20",
  "low-stock": "bg-clay/10 text-clay border-clay/20",
  "out-of-stock": "bg-red-500/10 text-red-400 border-red-500/20",
};

const stockLabel: Record<StockStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
};

const categories = ["All", "Objects", "Hardware", "Lighting", "Accessories"];

const PAGE_SIZE = 6;

export default function Products() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected = paged.length > 0 && paged.every((p) => selected.includes(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !paged.some((p) => p.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...paged.map((p) => p.id)])]);
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
          <h1 className="font-display text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-slate-text mt-1">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {category !== "All" ? ` · ${category}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-4 py-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors">
            Add product
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
            placeholder="Search by name or SKU"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                category === c
                  ? "bg-teal/10 text-teal border-teal/20"
                  : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {c}
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
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium text-center">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="w-4 h-4 rounded border-white/20 bg-transparent accent-teal"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center text-teal shrink-0">
                        <Package className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-cream truncate">{product.name}</div>
                        <div className="text-xs text-slate-text font-mono">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-text">{product.category}</td>
                  <td className="px-4 py-3.5 text-right text-cream font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-center text-slate-text">{product.stock}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${stockStyles[product.status]}`}
                    >
                      {stockLabel[product.status]}
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
                    No products match your search.
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