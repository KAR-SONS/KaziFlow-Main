import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { limitsFor } from "../lib/planLimits";
import { ProductForm } from "../components/ProductForm";

export function Products() {
  const { store } = useAuth();
  const limits = limitsFor(store.plan);

  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
  }

  useEffect(() => {
    loadProducts();
    supabase
      .from("categories")
      .select("id, name")
      .eq("store_id", store.id)
      .then(({ data }) => setCategories(data ?? []));
  }, [store.id]);

  if (products === null) {
    return <p className="text-sm text-[#98a2b3]">Loading products…</p>;
  }

  const atLimit = store.plan === "free" && products.length >= limits.maxProducts;

  async function handleCreate(payload) {
    if (store.plan === "free" && products.length >= limits.maxProducts) {
      return {
        error: `Free plan is limited to ${limits.maxProducts} products. Upgrade to Premium for unlimited products.`,
      };
    }

    const { error } = await supabase
      .from("products")
      .insert({ ...payload, store_id: store.id, is_available: true });

    if (error) return { error: error.message };

    setAdding(false);
    loadProducts();
    return { success: true };
  }

  async function handleUpdate(productId, payload) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId)
      .eq("store_id", store.id);

    if (error) return { error: error.message };

    setEditingId(null);
    loadProducts();
    return { success: true };
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .eq("store_id", store.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    // Note: this doesn't delete the product's images from storage — see
    // the orphaned-files note in storage-setup.sql.
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg text-[#f3efe4]">
          Products{" "}
          <span className="text-sm font-normal text-[#6b7280]">
            ({products.length}
            {store.plan === "free" ? ` / ${limits.maxProducts}` : ""})
          </span>
        </h2>
        {!adding && !atLimit && (
          <button
            onClick={() => setAdding(true)}
            className="bg-[#dc9b5f] text-[#0a0f1a] text-xs font-semibold rounded-full px-4 py-2.5"
          >
            + Add product
          </button>
        )}
      </div>

      {atLimit && !adding && (
        <div className="border border-[#dc9b5f]/40 bg-[#dc9b5f]/10 rounded-xl p-4 text-sm text-[#f3efe4]">
          You've reached the {limits.maxProducts}-product limit on the free
          plan.{" "}
          <a
            href="https://wa.me/254700000000?text=Hi%2C%20I%20want%20to%20upgrade%20my%20KaziFlow%20store%20to%20Premium"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-[#dc9b5f]"
          >
            Upgrade to Premium
          </a>{" "}
          for unlimited products.
        </div>
      )}

      {adding && (
        <div className="border border-white/10 bg-[#0d1420] rounded-xl p-5">
          <ProductForm
            storeId={store.id}
            categories={categories}
            maxImages={limits.maxImagesPerProduct}
            onSubmit={handleCreate}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) =>
          editingId === product.id ? (
            <div
              key={product.id}
              className="border border-white/10 bg-[#0d1420] rounded-xl p-5"
            >
              <ProductForm
                storeId={store.id}
                categories={categories}
                maxImages={limits.maxImagesPerProduct}
                product={product}
                onSubmit={(payload) => handleUpdate(product.id, payload)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={product.id}
              className="border border-white/10 bg-[#0d1420] rounded-xl p-4 flex items-center gap-4"
            >
              {product.image_urls?.[0] && (
                <img
                  src={product.image_urls[0]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-sm text-[#f3efe4]">
                  {product.name}
                  {!product.is_available && (
                    <span className="ml-2 text-[10px] uppercase text-[#6b7280] border border-white/15 rounded-full px-1.5 py-0.5">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#6b7280]">
                  {product.price ? `KSH ${product.price}` : "No price set"} ·{" "}
                  {product.image_urls?.length ?? 0} photo
                  {(product.image_urls?.length ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex gap-3 text-xs shrink-0">
                <button
                  onClick={() => setEditingId(product.id)}
                  className="text-[#dc9b5f]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}

        {products.length === 0 && !adding && (
          <p className="text-sm text-[#6b7280]">
            No products yet — add your first one above.
          </p>
        )}
      </div>
    </div>
  );
}
