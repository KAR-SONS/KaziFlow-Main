import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { InstallPrompt } from "../components/InstallPrompt";

export function DashboardLayout() {
  const { store } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex font-sans">
      {/* Desktop sidebar */}
      <Sidebar plan={store.plan} className="hidden md:flex" />
      <div className="flex-1 min-h-screen bg-[#0a0f1a]">
        <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden mr-4 p-2 rounded bg-transparent text-[#f3efe4]"
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
            Live store →
          </a>
        </header>
        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-64">
              <Sidebar plan={store.plan} onClose={() => setMobileOpen(false)} className="w-64" />
            </div>
          </div>
        )}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
       <InstallPrompt />
    </div>
  );
}
