import { useState } from "react";
import { ShoppingBag, Users, UserCheck, TrendingUp } from "lucide-react";

import { StatCard } from "../features/dashboard/StatCard";
import { RevenueChart } from "../features/dashboard/RevenueChart";
import { TrafficSourcesChart } from "../features/dashboard/TrafficSourceChart";
import { TopCategories } from "../features/dashboard/TopCategories";
import { TopSellingItems } from "../features/dashboard/TopSellingItems";
import { CustomersMap } from "../features/dashboard/CustomerMap";
import { RecentOrdersTable } from "../features/dashboard/RecentOrderTable";
import { PromoBanner } from "../features/dashboard/PromoBanner";
import { PointsEarnedCard } from "../features/dashboard/PointsEarnedCard";
import {
  mockRevenueData,
  mockTrafficSources,
  mockTopCategories,
  mockTopSellingItems,
  mockCustomersMapData,
  mockRecentOrders,
} from "../features/dashboard/mockDashboardData";


import promoImage from "../assets/promoBanner.jpg";
/**
 * AdminDashboardPage
 *
 * Landing page for /admin, matching the ECOMS dashboard reference layout.
 * The page is two columns overall: a wider left column stacking stat
 * cards -> revenue/traffic -> top selling/customers map -> recent orders,
 * and a persistent right rail (promo banner -> top categories -> points
 * earned) that runs alongside the full height of the left column, not
 * just next to the last row.
 *
 * Reads from mock data for now — swap each mock* import for a Redux
 * selector / API call once the real analytics endpoints exist. The layout
 * and every component underneath stays the same.
 */
export function AdminDashboardPage() {
  const [customersRange, setCustomersRange] = useState("last_week");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
      {/* Left column — main content */}
      <div className="flex flex-col gap-4 xl:col-span-3">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value="42,750"
            trendValue="+5%"
            trendDirection="up"
            caption="Increase in orders last week"
          />
          <StatCard
            icon={Users}
            label="Total Customers"
            value="82,365"
            trendValue="-1.5%"
            trendDirection="down"
            caption="Total visitors decreased by"
          />
          <StatCard
            icon={UserCheck}
            label="Unique Customers"
            value="18,642"
            trendValue="+3.1%"
            trendDirection="up"
            caption="Increase last week"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Sales"
            value="$50,354"
            trendValue="+5.4%"
            trendDirection="up"
            caption="Revenue increases this month"
          />
        </div>

        {/* Revenue + Traffic sources */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RevenueChart data={mockRevenueData} className="lg:col-span-2" />
          <TrafficSourcesChart
            total={2500}
            sources={mockTrafficSources}
            onViewAll={() => console.log("view all traffic sources")}
          />
        </div>

        {/* Top selling items + Customers map */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TopSellingItems
            items={mockTopSellingItems}
            onViewAll={() => console.log("view all top selling items")}
          />
          <CustomersMap
            data={mockCustomersMapData}
            rangeValue={customersRange}
            onRangeChange={setCustomersRange}
            className="lg:col-span-2"
          />
        </div>

        {/* Recent orders */}
        <RecentOrdersTable
          orders={mockRecentOrders}
          statusFilter={orderStatusFilter}
          onStatusFilterChange={setOrderStatusFilter}
          onDownloadReport={() => console.log("download report")}
          onEdit={(order) => console.log("edit", order.id)}
          onDelete={(order) => console.log("delete", order.id)}
        />
      </div>

      {/* Right rail — persists alongside the full left column */}
      <div className="flex flex-col gap-4 xl:col-span-1">
        <PromoBanner
          imageUrl={promoImage}
          storeLabel="Online Store"
          headline="Just for you"
          discountLabel="30% OFF"
          onClick={() => console.log("promo clicked")}
        />

        <TopCategories
          items={mockTopCategories}
          onViewAll={() => console.log("view all categories")}
        />

        <PointsEarnedCard
          points={3764}
          onEarnPoint={() => console.log("earn point")}
          onViewItems={() => console.log("view items")}
        />
      </div>
    </div>
  );
}