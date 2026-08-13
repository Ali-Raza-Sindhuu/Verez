import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { ProductGrid } from "../components/dataDisplay/productGrid";
import { mockProducts } from "../features/product/data/productMockData";

/**
 * HomePage
 *
 * Storefront landing page. Uses mockProducts for the featured section
 * until the real product API/state layer exists — swap the `products`
 * source for a Redux selector or API call later, everything else stays
 * the same. Only "active" products are shown, same as a real storefront
 * would filter.
 */
export function HomePage() {
  const navigate = useNavigate();

  const featuredProducts = mockProducts
    .filter((product) => product.status === "active")
    .map((product) => ({
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      stockStatus: product.stockStatus,
      onAddToCart: () => console.log("added to cart", product.id),
    }));

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero */}
      <section className="bg-slate-50 px-4 py-20 text-center sm:py-28">
        <h1 className="mx-auto max-w-2xl text-3xl font-semibold text-slate-900 sm:text-4xl">
          Everything you need, from every vendor you trust.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
          Shop across hundreds of vendors and branches in one place, with
          fast delivery and easy returns.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Shop now
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/vendor")}>
            Sell on Velour
          </Button>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Featured products
          </h2>
          <button
            type="button"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            View all
          </button>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["Footwear", "Accessories", "Electronics", "Home"].map((category) => (
            <button
              key={category}
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
            >
              {category}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}