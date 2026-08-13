import { ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../dataDisplay/Badge";
import { cn } from "../../utils/cn";

export type StockStatus = "inStock" | "lowStock" | "outOfStock";

export interface ProductCardProps {
  imageUrl: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  stockStatus?: StockStatus;
  onAddToCart?: () => void;
  className?: string;
}

const stockConfig: Record<StockStatus, { label: string; variant: "success" | "warning" | "danger" }> = {
  inStock: { label: "In stock", variant: "success" },
  lowStock: { label: "Low stock", variant: "warning" },
  outOfStock: { label: "Out of stock", variant: "danger" },
};

/**
 * ProductCard
 *
 * Storefront product tile used in ProductGrid, search results, and related
 * product rails. Uses plain props (no Redux/cart wiring) — the parent
 * decides what onAddToCart does.
 *
 * Example:
 *   <ProductCard
 *     imageUrl="/products/sneaker.jpg"
 *     name="Classic Runner Sneaker"
 *     price={89.99}
 *     oldPrice={119.99}
 *     rating={4.5}
 *     stockStatus="lowStock"
 *     onAddToCart={() => dispatch(addToCart(product.id))}
 *   />
 */
export function ProductCard({
  imageUrl,
  name,
  price,
  oldPrice,
  rating,
  stockStatus = "inStock",
  onAddToCart,
  className,
}: ProductCardProps) {
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  const stock = stockConfig[stockStatus];
  const isOutOfStock = stockStatus === "outOfStock";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white",
        "transition-shadow duration-150 hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {discountPercent && (
          <Badge variant="danger" className="absolute left-2 top-2">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 text-sm font-medium text-slate-900">{name}</p>

        {rating !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-slate-900">
            ${price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <Badge variant={stock.variant} className="w-fit">
          {stock.label}
        </Badge>

        <Button
          size="sm"
          className="mt-auto"
          disabled={isOutOfStock}
          leftIcon={<ShoppingCart className="h-4 w-4" />}
          onClick={onAddToCart}
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}