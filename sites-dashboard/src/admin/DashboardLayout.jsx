import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout() {
  const { store } = useAuth();

  return (
    <div className="flex font-sans">
      <Sidebar plan={store.plan} />
      <div className="flex-1 min-h-screen bg-[#0a0f1a]">
        <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6b7280] uppercase tracking-wide">
              {store.plan === "premium" ? "Premium store" : "Free store"}
            </p>
            <h1 className="font-semibold text-lg text-[#f3efe4]">
              {store.store_name}
            </h1>
          </div>
          <a
            href={`https://${store.subdomain}.kaziflow.co.ke`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#dc9b5f] hover:text-[#e5a86e]"
          >
            View live store →
          </a>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
