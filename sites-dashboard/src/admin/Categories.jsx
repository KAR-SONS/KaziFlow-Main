import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { UpgradeGate } from "../components/UpgradeGate";

export function Categories() {
  const { store } = useAuth();

  if (store.plan !== "premium") {
    return (
      <UpgradeGate
        title="Categories are a Premium feature"
        description="Group your products so customers can filter your store by category. Upgrade to unlock this, plus unlimited products and analytics."
      />
    );
  }

  return <CategoriesManager storeId={store.id} />;
}

function CategoriesManager({ storeId }) {
  const [categories, setCategories] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("store_id", storeId)
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, [storeId]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const { data, error } = await supabase
      .from("categories")
      .insert({ store_id: storeId, name: name.trim() })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setCategories((prev) => [...prev, data]);
    setName("");
    setError(null);
  }

  async function handleDelete(id) {
    await supabase.from("categories").delete().eq("id", id).eq("store_id", storeId);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  if (categories === null) {
    return <p className="text-sm text-[#98a2b3]">Loading categories…</p>;
  }

  return (
    <div className="max-w-md space-y-6">
      <h2 className="font-semibold text-lg text-[#f3efe4]">Categories</h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shoes"
          className="flex-1 bg-[#0a0f1a] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#f3efe4] placeholder:text-[#4b5563] focus:outline-none focus:border-[#dc9b5f]"
        />
        <button className="bg-[#dc9b5f] text-[#0a0f1a] text-xs font-semibold rounded-full px-4 py-2">
          Add
        </button>
      </form>
      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border border-white/10 bg-[#0d1420] rounded-lg px-4 py-2.5 text-sm text-[#f3efe4]"
          >
            {c.name}
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-400 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-[#6b7280]">
            No categories yet. Products without a category still show
            normally on your store.
          </p>
        )}
      </div>
    </div>
  );
}
