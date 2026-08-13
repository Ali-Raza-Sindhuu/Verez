import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/dataDisplay/badge";

export interface TopSellingItem {
  id: string;
  name: string;
  productId: string;
  imageUrl: string;
  saleLabel: string;
}

export interface TopSellingItemsProps {
  items: TopSellingItem[];
  onViewAll?: () => void;
  className?: string;
}

/**
 * TopSellingItems
 *
 * "Top Selling Items" card from the ECOMS dashboard reference: a compact
 * list of products with thumbnail, name, product ID, and a sale-percentage
 * badge on the right.
 *
 * Example:
 *   <TopSellingItems
 *     items={[
 *       { id: "1", name: "Shoes For Man", productId: "PROD211", imageUrl: "/shoes.jpg", saleLabel: "Sale +18%" },
 *     ]}
 *     onViewAll={() => navigate("/admin/products")}
 *   />
 */
export function TopSellingItems({ items, onViewAll, className }: TopSellingItemsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-orange-600 hover:underline"
          >
            View All
          </button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-700"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-slate-400">ID: {item.productId}</p>
              </div>
              <Badge variant="warning" className="shrink-0">
                {item.saleLabel}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}