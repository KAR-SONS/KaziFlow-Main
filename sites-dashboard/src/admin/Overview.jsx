import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { limitsFor } from "../lib/planLimits";

export function Overview() {
  const { store } = useAuth();
  const limits = limitsFor(store.plan);
  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .then(({ count }) => setProductCount(count ?? 0));
  }, [store.id]);

  const atLimit =
    store.plan === "free" &&
    productCount !== null &&
    productCount >= limits.maxProducts;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Products"
          value={
            productCount === null
              ? "…"
              : `${productCount}${
                  store.plan === "free" ? ` / ${limits.maxProducts}` : ""
                }`
          }
        />
        <StatCard
          label="Plan"
          value={store.plan === "premium" ? "Premium" : "Free"}
        />
      </div>

      {atLimit && (
        <div className="border border-[#dc9b5f]/40 bg-[#dc9b5f]/10 rounded-xl p-4 text-sm">
          <p className="font-semibold text-[#f3efe4] mb-1">
            You've hit the free product limit.
          </p>
          <p className="text-[#98a2b3] mb-3">
            Upgrade to Premium to add unlimited products, drop ads from your
            store, and unlock category search + analytics.
          </p>
          <a
            href="https://wa.me/254728482191?text=Hi%2C%20I%20want%20to%20upgrade%20my%20KaziFlow%20store%20to%20Premium"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#dc9b5f] text-[#0a0f1a] text-md font-semibold rounded-full px-4 py-2"
          >
            Upgrade to Premium →
          </a>
        </div>
      )}

      <div className="border border-white/10 bg-[#0d1420] rounded-xl p-4 text-md">
        <p className="font-semibold text-[#f3efe4] mb-1">Your store link</p>
        <a
          href={`https://${store.subdomain}.kaziflow.co.ke`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#dc9b5f] underline"
        >
          {store.subdomain}.kaziflow.co.ke
        </a>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-white/10 bg-[#0d1420] rounded-xl p-5">
      <p className="text-xs text-[#6b7280] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#f3efe4]">{value}</p>
    </div>
  );
}
