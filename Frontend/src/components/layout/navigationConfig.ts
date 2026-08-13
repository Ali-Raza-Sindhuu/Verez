import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  Tag,
  Warehouse,
  BarChart3,
  ClipboardPenLine,
  ArrowLeftRight,
  History,
  ShoppingCart,
  ClipboardList,
  Clock3,
  LoaderCircle,
  Truck,
  PackageCheck,
  CircleX,
  Store,
  UserCheck,
  Building2,
  Users,
  UsersRound,
  UserRound,
  UserCog,
  ShieldCheck,
  Shield,
  BadgeCheck,
  KeyRound,
  CreditCard,
  Receipt,
  RotateCcw,
  MapPin,
  Megaphone,
  TicketPercent,
  BadgePercent,
  Sparkles,
  Star,
  Bell,
  ChartNoAxesCombined,
  TrendingUp,
  Settings,
} from "lucide-react";



export interface NavLeafItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  permission?: string;
}

export interface NavParentItem {
  label: string;
  icon: LucideIcon;
  permission?: string;
  children: NavLeafItem[];
}

export type NavItem = NavLeafItem | NavParentItem;

export function isNavParent(item: NavItem): item is NavParentItem {
  return "children" in item;
}

export const navigationConfig: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard.read",
  },
  {
    label: "Products",
    icon: Package,
    permission: "products.read",
    children: [
      { label: "All Products", path: "/admin/products", icon: Boxes, permission: "products.read" },
      { label: "Categories", path: "/admin/products/categories", icon: Tags, permission: "products.categories.read" },
      { label: "Subcategories", path: "/admin/products/subcategories", icon: Tag, permission: "products.subcategories.read" },
    ],
  },
  {
    label: "Inventory",
    icon: Warehouse,
    permission: "inventory.read",
    children: [
      { label: "Stock Overview", path: "/admin/inventory", icon: BarChart3, permission: "inventory.read" },
      { label: "Stock Adjustments", path: "/admin/inventory/adjustments", icon: ClipboardPenLine, permission: "inventory.adjustments.read" },
      { label: "Stock Transfers", path: "/admin/inventory/transfers", icon: ArrowLeftRight, permission: "inventory.transfers.read" },
      { label: "Stock History", path: "/admin/inventory/history", icon: History, permission: "inventory.history.read" },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    permission: "orders.read",
    children: [
      { label: "All Orders", path: "/admin/orders", icon: ClipboardList, permission: "orders.read" },
      { label: "Pending", path: "/admin/orders/pending", icon: Clock3, permission: "orders.read" },
      { label: "Processing", path: "/admin/orders/processing", icon: LoaderCircle, permission: "orders.read" },
      { label: "Shipped", path: "/admin/orders/shipped", icon: Truck, permission: "orders.read" },
      { label: "Delivered", path: "/admin/orders/delivered", icon: PackageCheck, permission: "orders.read" },
      { label: "Cancelled", path: "/admin/orders/cancelled", icon: CircleX, permission: "orders.read" },
    ],
  },
  {
    label: "Vendors",
    icon: Store,
    permission: "vendors.read",
    children: [
      { label: "All Vendors", path: "/admin/vendors", icon: Store, permission: "vendors.read" },
      { label: "Pending Approval", path: "/admin/vendors/pending", icon: UserCheck, permission: "vendors.approve" },
      { label: "Vendor Categories", path: "/admin/vendors/categories", icon: Tags, permission: "vendors.categories.read" },
    ],
  },
  {
    label: "Branches",
    icon: Building2,
    permission: "branches.read",
    children: [
      { label: "All Branches", path: "/admin/branches", icon: Building2, permission: "branches.read" },
      { label: "Branch Users", path: "/admin/branches/users", icon: Users, permission: "branches.users.read" },
    ],
  },
  {
    label: "Users",
    icon: UsersRound,
    permission: "users.read",
    children: [
      { label: "All Users", path: "/admin/users", icon: UsersRound, permission: "users.read" },
      { label: "Customers", path: "/admin/users/customers", icon: UserRound, permission: "users.read" },
      { label: "Managers", path: "/admin/users/managers", icon: UserCog, permission: "users.read" },
      { label: "Admins", path: "/admin/users/admins", icon: ShieldCheck, permission: "users.admins.read" },
    ],
  },
  {
    label: "Access Control",
    icon: Shield,
    permission: "accessControl.read",
    children: [
      { label: "Roles", path: "/admin/access-control/roles", icon: BadgeCheck, permission: "roles.read" },
      { label: "Permissions", path: "/admin/access-control/permissions", icon: KeyRound, permission: "permissions.read" },
    ],
  },
  {
    label: "Payments",
    icon: CreditCard,
    permission: "payments.read",
    children: [
      { label: "Transactions", path: "/admin/payments/transactions", icon: Receipt, permission: "payments.read" },
      { label: "Refunds", path: "/admin/payments/refunds", icon: RotateCcw, permission: "payments.refunds.read" },
    ],
  },
  {
    label: "Shipping",
    icon: Truck,
    permission: "shipping.read",
    children: [
      { label: "Shipments", path: "/admin/shipping/shipments", icon: Boxes, permission: "shipping.read" },
      { label: "Delivery Tracking", path: "/admin/shipping/tracking", icon: MapPin, permission: "shipping.tracking.read" },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    permission: "marketing.read",
    children: [
      { label: "Coupons", path: "/admin/marketing/coupons", icon: TicketPercent, permission: "marketing.coupons.read" },
      { label: "Discounts", path: "/admin/marketing/discounts", icon: BadgePercent, permission: "marketing.discounts.read" },
      { label: "Promotions", path: "/admin/marketing/promotions", icon: Sparkles, permission: "marketing.promotions.read" },
    ],
  },
  {
    label: "Reviews",
    icon: Star,
    permission: "reviews.read",
    children: [
      { label: "All Reviews", path: "/admin/reviews", icon: Star, permission: "reviews.read" },
      { label: "Pending Reviews", path: "/admin/reviews/pending", icon: Clock3, permission: "reviews.read" },
    ],
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
    permission: "notifications.read",
  },
  {
    label: "Reports",
    icon: ChartNoAxesCombined,
    permission: "reports.read",
    children: [
      { label: "Sales", path: "/admin/reports/sales", icon: TrendingUp, permission: "reports.sales.read" },
      { label: "Products", path: "/admin/reports/products", icon: Package, permission: "reports.products.read" },
      { label: "Inventory", path: "/admin/reports/inventory", icon: Warehouse, permission: "reports.inventory.read" },
      { label: "Vendors", path: "/admin/reports/vendors", icon: Store, permission: "reports.vendors.read" },
      { label: "Branches", path: "/admin/reports/branches", icon: Building2, permission: "reports.branches.read" },
    ],
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    permission: "settings.read",
  },
];