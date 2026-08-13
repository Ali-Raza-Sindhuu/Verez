import { useState, type ReactNode } from "react";
import { Sidebar, type SidebarNavItem } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavigation } from "./MobileNavigation";

export interface AdminLayoutProps {
  navItems: SidebarNavItem[];
  onNavigate?: (href: string) => void;
  pageTitle?: string;
  headerActions?: ReactNode;
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  children: ReactNode;
}

/**
 * AdminLayout
 *
 * Sample composition showing how Sidebar, Header, and MobileNavigation fit
 * together. This is a reference for how admin/manager/vendor dashboard
 * layouts should be assembled — not a complete dashboard. Sidebar is
 * hidden below the `lg` breakpoint and replaced by Header's menu button
 * opening MobileNavigation.
 *
 * Example:
 *   <AdminLayout
 *     pageTitle="Products"
 *     navItems={navItems}
 *     onNavigate={(href) => navigate(href)}
 *   >
 *     <ProductsPage />
 *   </AdminLayout>
 */
export function AdminLayout({
  navItems,
  onNavigate,
  pageTitle,
  headerActions,
  sidebarHeader,
  sidebarFooter,
  children,
}: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden lg:block">
        <Sidebar
          navItems={navItems}
          onNavigate={onNavigate}
          header={sidebarHeader}
          footer={sidebarFooter}
        />
      </div>

      <MobileNavigation
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={navItems}
        onNavigate={(href) => {
          onNavigate?.(href);
          setMobileNavOpen(false);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={pageTitle}
          onMenuClick={() => setMobileNavOpen(true)}
          actions={headerActions}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}