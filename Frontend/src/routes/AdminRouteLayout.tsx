// routes/AdminRouteLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";

export function AdminRouteLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7fa] dark:bg-[#1a1c31]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}