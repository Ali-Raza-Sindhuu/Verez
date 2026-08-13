import type { ReactNode } from "react";
import { AdminLayout, type AdminLayoutProps } from "./AdminLayout";

export type DashboardLayoutProps = AdminLayoutProps;

/**
 * DashboardLayout
 *
 * Same structural shell as AdminLayout (Sidebar + Header + MobileNavigation),
 * exposed under its own name for manager and vendor dashboards. These
 * roles share the identical layout skeleton — what differs is only the
 * `navItems` passed in (e.g. vendor gets "My products" / "My orders"
 * instead of the full admin nav), which is decided by the feature/page
 * using this layout, not by the layout itself.
 *
 * Example:
 *   <DashboardLayout pageTitle="My Orders" navItems={vendorNavItems} onNavigate={navigate}>
 *     <VendorOrdersPage />
 *   </DashboardLayout>
 */
export function DashboardLayout(props: DashboardLayoutProps): ReactNode {
  return <AdminLayout {...props} />;
}