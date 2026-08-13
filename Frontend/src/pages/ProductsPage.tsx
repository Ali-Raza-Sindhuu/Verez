import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Boxes, CheckCircle2, Plus, Search, X, XCircle } from "lucide-react";
import { cn } from "../utils/cn";
import { mockProducts } from "../features/product/data/productMockData";
import { getStockStatus, type Product, type ProductStatus, type StockStatus } from "../features/product/types/productTypes";

/**
 * ProductsPage — /products
 *
 * Step 1 scope only: page header, Add Product entry point, summary
 * stats, search, and a basic (non-paginated, non-filtered-beyond-search)
 * product table. Filters, row actions, bulk selection, view switching,
 * and pagination are deliberately left out — they land in later steps
 * per the incremental build plan.
 *
 * Reads from mockProducts directly for now. Once a productApi.ts /
 * mock-service layer exists, swap the `useMemo` source for a fetch
 * call — the render logic below doesn't need to change.
 */
export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(() => computeStats(mockProducts), []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return mockProducts;

    return mockProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.barcode?.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader />

      <StatsRow stats={stats} />

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <SearchField value={searchTerm} onChange={setSearchTerm} />
        <ProductTable products={filteredProducts} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

function PageHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your product catalog, pricing, inventory and product information.
        </p>
      </div>

      <Link
        to="/products/new"
        className={cn(
          "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-4",
          "bg-orange-500 text-sm font-medium text-white shadow-sm",
          "transition-colors duration-150 hover:bg-orange-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Product
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary stats
// ---------------------------------------------------------------------------

interface ProductStats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}

function computeStats(products: Product[]): ProductStats {
  return products.reduce<ProductStats>(
    (acc, product) => {
      const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
      return {
        total: acc.total + 1,
        active: acc.active + (product.status === "active" ? 1 : 0),
        lowStock: acc.lowStock + (stockStatus === "low-stock" ? 1 : 0),
        outOfStock: acc.outOfStock + (stockStatus === "out-of-stock" ? 1 : 0),
      };
    },
    { total: 0, active: 0, lowStock: 0, outOfStock: 0 }
  );
}

function StatsRow({ stats }: { stats: ProductStats }) {
  const cards = [
    { label: "Total Products", value: stats.total, icon: Boxes, tone: "neutral" as const },
    { label: "Active Products", value: stats.active, icon: CheckCircle2, tone: "positive" as const },
    { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, tone: "warning" as const },
    { label: "Out of Stock", value: stats.outOfStock, icon: XCircle, tone: "danger" as const },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              tone === "neutral" && "bg-slate-100 text-slate-500",
              tone === "positive" && "bg-emerald-50 text-emerald-600",
              tone === "warning" && "bg-amber-50 text-amber-600",
              tone === "danger" && "bg-red-50 text-red-600"
            )}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-semibold leading-tight text-slate-900">{value}</span>
            <span className="block truncate text-xs text-slate-500">{label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:w-80">
      <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <input
        type="text"
        role="searchbox"
        aria-label="Search products"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400",
            "hover:bg-slate-200 hover:text-slate-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
        <p className="text-sm font-medium text-slate-700">No products found</p>
        <p className="text-sm text-slate-400">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="py-2.5 pr-4">Product</th>
            <th className="py-2.5 pr-4">SKU</th>
            <th className="py-2.5 pr-4">Category</th>
            <th className="py-2.5 pr-4">Vendor</th>
            <th className="py-2.5 pr-4">Branch</th>
            <th className="py-2.5 pr-4">Price</th>
            <th className="py-2.5 pr-4">Stock</th>
            <th className="py-2.5 pr-4">Status</th>
            <th className="py-2.5 pr-4">Updated</th>
            <th className="py-2.5 pl-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);

  return (
    <tr className="text-slate-700">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <ProductThumbnail image={product.image} name={product.name} />
          <Link
            to={`/products/${product.id}`}
            className="max-w-[220px] truncate font-medium text-slate-800 hover:text-orange-600"
          >
            {product.name}
          </Link>
        </div>
      </td>
      <td className="py-3 pr-4 font-mono text-xs text-slate-500">{product.sku}</td>
      <td className="py-3 pr-4 text-slate-600">{product.category}</td>
      <td className="py-3 pr-4 text-slate-600">{product.vendor}</td>
      <td className="py-3 pr-4 text-slate-600">{product.branch}</td>
      <td className="py-3 pr-4">
        <PriceCell price={product.price} compareAtPrice={product.compareAtPrice} />
      </td>
      <td className="py-3 pr-4">
        <StockCell stock={product.stock} status={stockStatus} />
      </td>
      <td className="py-3 pr-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="py-3 pr-4 text-slate-500">{formatDate(product.updatedAt)}</td>
      <td className="py-3 pl-2 text-right text-slate-400">
        {/* Row action menu (View / Edit / Duplicate / Archive / Delete) lands in a later step */}
        <span aria-hidden="true">⋮</span>
      </td>
    </tr>
  );
}

function ProductThumbnail({ image, name }: { image?: string; name: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
      />
    );
  }

  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-400"
      aria-hidden="true"
    >
      {name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}

function PriceCell({ price, compareAtPrice }: { price: number; compareAtPrice?: number }) {
  return (
    <span className="flex flex-col">
      <span className="font-medium text-slate-800">{formatCurrency(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-xs text-slate-400 line-through">{formatCurrency(compareAtPrice)}</span>
      )}
    </span>
  );
}

function StockCell({ stock, status }: { stock: number; status: StockStatus }) {
  const labels: Record<StockStatus, string> = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  };
  const tones: Record<StockStatus, string> = {
    "in-stock": "text-emerald-600",
    "low-stock": "text-amber-600",
    "out-of-stock": "text-red-600",
  };

  return (
    <span className="flex flex-col">
      <span className="font-medium text-slate-800">{stock}</span>
      <span className={cn("text-xs", tones[status])}>{labels[status]}</span>
    </span>
  );
}

/**
 * Minimal inline status badge for Step 1. This is a stand-in for the
 * shared StatusBadge component referenced in the module spec — once
 * that shared component exists in the UI library, this local mapping
 * should be deleted and StatusBadge imported instead so color mapping
 * lives in exactly one place.
 */
function StatusBadge({ status }: { status: ProductStatus }) {
  const config: Record<ProductStatus, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-emerald-50 text-emerald-700" },
    draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
    archived: { label: "Archived", className: "bg-slate-100 text-slate-400" },
  };
  const { label, className } = config[status];

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}