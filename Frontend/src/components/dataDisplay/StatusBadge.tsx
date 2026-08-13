import { Badge, type BadgeVariant } from "./badge";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type InventoryStatus = "inStock" | "lowStock" | "outOfStock";

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

const orderStatusMap: Record<OrderStatus, StatusConfig> = {
  pending: { label: "Pending", variant: "neutral" },
  confirmed: { label: "Confirmed", variant: "info" },
  processing: { label: "Processing", variant: "info" },
  shipped: { label: "Shipped", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

const paymentStatusMap: Record<PaymentStatus, StatusConfig> = {
  pending: { label: "Pending", variant: "neutral" },
  paid: { label: "Paid", variant: "success" },
  failed: { label: "Failed", variant: "danger" },
  refunded: { label: "Refunded", variant: "warning" },
};

const inventoryStatusMap: Record<InventoryStatus, StatusConfig> = {
  inStock: { label: "In stock", variant: "success" },
  lowStock: { label: "Low stock", variant: "warning" },
  outOfStock: { label: "Out of stock", variant: "danger" },
};

export type StatusBadgeProps =
  | { type: "order"; status: OrderStatus }
  | { type: "payment"; status: PaymentStatus }
  | { type: "inventory"; status: InventoryStatus };

const configMaps = {
  order: orderStatusMap,
  payment: paymentStatusMap,
  inventory: inventoryStatusMap,
} as const;

/**
 * StatusBadge
 *
 * Typed wrapper around Badge for the three recurring status domains in the
 * platform: order, payment, and inventory. Status-to-label/variant mapping
 * lives here, centrally, instead of being duplicated (or hardcoded into
 * Badge, a generic UI primitive) across every page that displays a status.
 *
 * Example:
 *   <StatusBadge type="order" status="shipped" />
 *   <StatusBadge type="payment" status="refunded" />
 *   <StatusBadge type="inventory" status="lowStock" />
 */
export function StatusBadge(props: StatusBadgeProps) {
  const config = (configMaps[props.type] as Record<string, StatusConfig>)[
    props.status
  ];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
