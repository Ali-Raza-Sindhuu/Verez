import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export interface TopCategoryItem {
  id: string;
  name: string;
  categoryLabel: string;
  imageUrl: string;
  price: string;
  salesLabel: string;
}

export interface TopCategoriesProps {
  items: TopCategoryItem[];
  onViewAll?: () => void;
  onItemClick?: (item: TopCategoryItem) => void;
  className?: string;
}

/**
 * TopCategories
 *
 * "Top Categories" card from the ECOMS dashboard reference: 2x2 grid of
 * product tiles, each with an image, name, category label, price, and a
 * small sales-count pill.
 *
 * Example:
 *   <TopCategories
 *     items={[
 *       { id: "1", name: "Leather Jacket", categoryLabel: "Fashion", imageUrl: "/jacket.jpg", price: "$120", salesLabel: "22K Sales" },
 *       { id: "2", name: "Modern Wooden Chair", categoryLabel: "Furniture", imageUrl: "/chair.jpg", price: "$60", salesLabel: "14K Sales" },
 *     ]}
 *     onViewAll={() => navigate("/admin/products")}
 *   />
 */
export function TopCategories({
  items,
  onViewAll,
  onItemClick,
  className,
}: TopCategoriesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
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

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick?.(item)}
              className="flex flex-col items-start gap-2 rounded-lg text-left transition-opacity hover:opacity-90"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-slate-400">{item.categoryLabel}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  Price: {item.price}
                </span>
                <span className="rounded bg-orange-50 px-1.5 py-0.5 font-medium text-orange-600 dark:bg-orange-500/10">
                  {item.salesLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}