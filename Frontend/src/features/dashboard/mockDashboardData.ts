import type { RevenuePoint } from "./RevenueChart";
import type { TrafficSource } from "./TrafficSourceChart";
import type { TopCategoryItem } from "./TopCategories";
import type { TopSellingItem } from "./TopSellingItems";
import type { CustomersMapPoint } from "./CustomerMap";
import type { RecentOrderRow } from "./RecentOrderTable";

/**
 * Dashboard mock data
 *
 * Temporary dummy data so AdminDashboardPage can be built and visually
 * verified before the real analytics/orders API exists. Remove once real
 * data flows in from Redux/axios.
 */

export const mockRevenueData: RevenuePoint[] = [
  { day: "Mon", order: 20, income: 30 },
  { day: "Tue", order: 45, income: 40 },
  { day: "Wed", order: 30, income: 25 },
  { day: "Thu", order: 60, income: 35 },
  { day: "Fri", order: 50, income: 55 },
  { day: "Sat", order: 65, income: 45 },
  { day: "Sun", order: 55, income: 65 },
];

export const mockTrafficSources: TrafficSource[] = [
  { label: "Direct", value: 700, color: "#f97316" },
  { label: "Google", value: 600, color: "#fb923c" },
  { label: "Social Media", value: 500, color: "#fdba74" },
  { label: "Referral", value: 400, color: "#fed7aa" },
  { label: "Campaigns", value: 300, color: "#ffedd5" },
];

export const mockTopCategories: TopCategoryItem[] = [
  { id: "1", name: "Leather Jacket", categoryLabel: "Fashion", imageUrl: "https://placehold.co/200", price: "$120", salesLabel: "22K Sales" },
  { id: "2", name: "Modern Wooden Chair", categoryLabel: "Furniture", imageUrl: "https://placehold.co/200", price: "$60", salesLabel: "14K Sales" },
  { id: "3", name: "Foundation Makeup", categoryLabel: "Beauty & Health", imageUrl: "https://placehold.co/200", price: "$80", salesLabel: "18K Sales" },
  { id: "4", name: "Bluetooth Speaker", categoryLabel: "Electronics", imageUrl: "https://placehold.co/200", price: "$20", salesLabel: "30K Sales" },
];

export const mockTopSellingItems: TopSellingItem[] = [
  { id: "1", name: "Shoes For Man", productId: "PROD211", imageUrl: "https://placehold.co/64", saleLabel: "Sale +18%" },
  { id: "2", name: "Chair", productId: "PROD206", imageUrl: "https://placehold.co/64", saleLabel: "Sale +40%" },
  { id: "3", name: "Smart Watch", productId: "PROD208", imageUrl: "https://placehold.co/64", saleLabel: "Sale +30%" },
  { id: "4", name: "Trendy Ladies Purse", productId: "PROD212", imageUrl: "https://placehold.co/64", saleLabel: "Sale +15.1%" },
  { id: "5", name: "Bluetooth Speaker", productId: "PROD212", imageUrl: "https://placehold.co/64", saleLabel: "Sale +12.5%" },
];

export const mockCustomersMapData: CustomersMapPoint[] = [
  { day: "Mon", newCustomers: 12, returningCustomers: 30 },
  { day: "Tue", newCustomers: 20, returningCustomers: 28 },
  { day: "Wed", newCustomers: 5, returningCustomers: 8 },
  { day: "Thu", newCustomers: 28, returningCustomers: 20 },
  { day: "Fri", newCustomers: 22, returningCustomers: 15 },
  { day: "Sat", newCustomers: 25, returningCustomers: 5 },
  { day: "Sun", newCustomers: 8, returningCustomers: 15 },
];

export const mockRecentOrders: RecentOrderRow[] = [
  {
    id: "1",
    orderId: "#359874",
    productName: "Running Shoes",
    imageUrl: "https://placehold.co/40",
    quantity: 1,
    price: 120,
    totalPrice: 120,
    status: "confirmed",
  },
  {
    id: "2",
    orderId: "#359875",
    productName: "Modern Wooden Chair",
    imageUrl: "https://placehold.co/40",
    quantity: 3,
    price: 25,
    totalPrice: 75,
    status: "shipped",
  },
  {
    id: "3",
    orderId: "#359876",
    productName: "Bluetooth Speaker",
    imageUrl: "https://placehold.co/40",
    quantity: 2,
    price: 20,
    totalPrice: 40,
    status: "pending",
  },
];