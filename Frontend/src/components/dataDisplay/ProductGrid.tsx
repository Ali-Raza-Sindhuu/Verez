import { ProductCard, type ProductCardProps } from "./productCard";
import { SkeletonProduct } from "../feedback/skeleton";
import { EmptyState } from "../feedback/emptyState";
import { cn } from "../../utils/cn";

export interface ProductGridItem extends ProductCardProps {
  id: string | number;
}

export interface ProductGridProps {
  products: ProductGridItem[];
  loading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

/**
 * ProductGrid
 *
 * Responsive grid of ProductCard, used on storefront listing, search
 * results, and category pages. Handles loading and empty states itself so
 * callers only ever pass products (or none yet).
 *
 * Example:
 *   <ProductGrid products={products} loading={isLoading} />
 */
export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or search terms.",
  className,
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonProduct key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
