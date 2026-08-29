import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { UpgradeGate } from "../components/UpgradeGate";

export function Analytics() {
  const { store } = useAuth();

  if (store.plan !== "premium") {
    return (
      <UpgradeGate
        title="Analytics are a Premium feature"
        description="See how many people view your store and click through to WhatsApp — know what's actually working before you restock."
      />
    );
  }

  return <AnalyticsPanel storeId={store.id} />;
}

function AnalyticsPanel({ storeId }) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    supabase
      .from("store_events")
      .select("event_type")
      .eq("store_id", storeId)
      .gte("created_at", since.toISOString())
      .then(({ data }) => {
        const events = data ?? [];
        setCounts({
          store_view: events.filter((e) => e.event_type === "store_view").length,
          product_view: events.filter((e) => e.event_type === "product_view").length,
          whatsapp_click: events.filter((e) => e.event_type === "whatsapp_click").length,
        });
      });
  }, [storeId]);

  if (!counts) {
    return <p className="text-sm text-[#98a2b3]">Loading analytics…</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-semibold text-lg text-[#f3efe4]">Last 30 days</h2>
      <div className="flex flex-col gap-6 ">
        <Stat label="Store views" value={counts.store_view} />
        <Stat label="Product views" value={counts.product_view} />
        <Stat label="WhatsApp clicks" value={counts.whatsapp_click} />
      </div>
      <p className="text-md text-[#6b7280]">
        Store views count each visit to your storefront. WhatsApp clicks
        count taps on "Order via WhatsApp" — your best signal of real buying
        interest.
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-white/10 bg-[#0d1420] rounded-xl p-5">
      <p className="text-xs text-[#6b7280] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#f3efe4]">{value}</p>
    </div>
  );
}
