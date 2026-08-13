import { Download, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/forms/select";
import { DataTable, type DataTableColumn } from "../../components/dataDisplay/dataTable";
import { StatusBadge } from "../../components/dataDisplay/statusBadge";
import type { OrderStatus } from "../../components/dataDisplay/statusBadge";

export interface RecentOrderRow {
  id: string;
  orderId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: OrderStatus;
}

export interface RecentOrdersTableProps {
  orders: RecentOrderRow[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onDownloadReport?: () => void;
  onEdit?: (order: RecentOrderRow) => void;
  onDelete?: (order: RecentOrderRow) => void;
  className?: string;
}

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Pending", value: "pending" },
];

/**
 * RecentOrdersTable
 *
 * "Recent Order" card from the ECOMS dashboard reference. Reuses the
 * existing generic DataTable rather than a bespoke table — this is exactly
 * the reuse pattern the component library was built for.
 *
 * Example:
 *   <RecentOrdersTable
 *     orders={recentOrders}
 *     statusFilter={statusFilter}
 *     onStatusFilterChange={setStatusFilter}
 *     onDownloadReport={() => downloadCsv(recentOrders)}
 *   />
 */
export function RecentOrdersTable({
  orders,
  statusFilter,
  onStatusFilterChange,
  onDownloadReport,
  onEdit,
  onDelete,
  className,
}: RecentOrdersTableProps) {
  const columns: DataTableColumn<RecentOrderRow>[] = [
    { key: "orderId", header: "Order ID" },
    {
      key: "productName",
      header: "Product",
      render: (order) => (
        <div className="flex items-center gap-2">
          <img
            src={order.imageUrl}
            alt={order.productName}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <span>{order.productName}</span>
        </div>
      ),
    },
    { key: "quantity", header: "QTY", render: (order) => `x${order.quantity}`, hideBelow: "sm" },
    {
      key: "price",
      header: "Price",
      hideBelow: "md",
      render: (order) => `$${order.price.toFixed(2)}`,
    },
    {
      key: "totalPrice",
      header: "Total Price",
      render: (order) => `$${order.totalPrice.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (order) => <StatusBadge type="order" status={order.status} />,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Order</CardTitle>
        <div className="flex items-center gap-2">
          {onDownloadReport && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={onDownloadReport}
            >
              Download Report
            </Button>
          )}
          <Select
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            containerClassName="w-36"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={orders}
          getRowId={(order) => order.id}
          emptyTitle="No recent orders"
          rowActions={(order) => (
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                aria-label="Edit order"
                onClick={() => onEdit?.(order)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Delete order"
                onClick={() => onDelete?.(order)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          className="border-0"
        />
      </CardContent>
    </Card>
  );
}