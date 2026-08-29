import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";

const links = [
  { to: "/dashboard", label: "Overview", premium: false, end: true },
  { to: "/dashboard/products", label: "Products", premium: false },
  { to: "/dashboard/categories", label: "Categories", premium: true },
  { to: "/dashboard/analytics", label: "Analytics", premium: true },
  { to: "/dashboard/settings", label: "Settings", premium: false },
];

export function Sidebar({ plan, className, onClose }) {
  const baseClasses = "shrink-0 border-r border-white/10 bg-[#0d1420] min-h-screen p-5 flex flex-col";
  const widthClass = className && className.includes("w-") ? "" : "w-56";
  return (
    <aside className={`${widthClass} ${baseClasses} ${className ?? ""}`.trim()}>
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-3 right-3 text-[#f3efe4] bg-transparent p-2"
          aria-label="Close sidebar"
        >
          ✕
        </button>
      )}
      <div className="font-semibold text-xl text-[#f3efe4] mb-8">
        Kazi<span className="text-[#dc9b5f]">Flow</span>
      </div>

      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const locked = link.premium && plan === "free";
          return (
            <NavLink
              key={link.to}
              to={locked ? "/dashboard/settings?upgrade=1" : link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center justify-between text-sm rounded-lg px-3 py-2 transition-colors ${
                  isActive && !locked
                    ? "bg-[#f3efe4] text-[#0a0f1a] font-medium"
                    : "text-[#98a2b3] hover:bg-white/5"
                }`
              }
            >
              <span>{link.label}</span>
              {locked && (
                <span className="text-[10px] uppercase tracking-wide bg-[#dc9b5f] text-[#0a0f1a] rounded-full px-1.5 py-0.5 font-semibold">
                  Pro
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {plan === "free" && (
        <a
          href="https://wa.me/254700000000?text=Hi%2C%20I%20want%20to%20upgrade%20my%20KaziFlow%20store%20to%20Premium"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#dc9b5f] text-[#0a0f1a] text-sm font-semibold text-center rounded-full py-2.5 mb-3 hover:bg-[#e5a86e] transition-colors"
        >
          Upgrade to Premium →
        </a>
      )}

      <button
        onClick={() => supabase.auth.signOut()}
        className="text-sm text-[#6b7280] hover:text-[#98a2b3] text-left"
      >
        Sign out
      </button>
    </aside>
  );
}
