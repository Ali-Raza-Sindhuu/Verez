import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

/**
 * AdminLayout
 *
 * Top-level shell for every authenticated admin route. Renders the
 * fixed-height Sidebar on the left and a column on the right made up of
 * the sticky Header plus the routed page content (via React Router's
 * <Outlet />).
 *
 * Sidebar manages its own collapsed/expanded state internally, so this
 * layout doesn't need to lift or pass that state down — it just stacks
 * the two pieces side by side. Header no longer owns a sidebar-toggle
 * button (removed per the "other plans" for a separate sidebar
 * control), so nothing needs to be wired between them here yet.
 *
 * Page content should NOT re-implement scrolling/height — this
 * component owns the outer scroll container so Header can stay sticky
 * without the whole viewport scrolling underneath it.
 *
 * Example (in your router config):
 *   {
 *     element: <AdminLayout />,
 *     children: [
 *       { path: "/admin", element: <DashboardPage /> },
 *       { path: "/products", element: <ProductsPage /> },
 *     ],
 *   }
 */
export function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}