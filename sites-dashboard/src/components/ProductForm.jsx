import { useState } from "react";

export function ProductForm({ categories, maxImages, product, onSubmit, onCancel }) {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.target);
    const imageUrls = (formData.get("image_urls") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, maxImages);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")) || null,
      category_id: formData.get("category_id") || null,
      image_urls: imageUrls,
      ...(product ? { is_available: formData.get("is_available") === "on" } : {}),
    };

    const result = await onSubmit(payload);
    setPending(false);

    if (result?.error) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <Field label="Product name" name="name" defaultValue={product?.name} required />
      <div>
        <label className="block text-xs font-medium text-[#98a2b3] mb-1">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Price (KSH)"
          name="price"
          type="number"
          min="0"
          defaultValue={product?.price ?? ""}
        />
        {categories.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[#98a2b3] mb-1">
              Category
            </label>
            <select
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className={inputClass}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[#98a2b3] mb-1">
          Image URLs (comma-separated, up to {maxImages})
        </label>
        <input
          name="image_urls"
          defaultValue={product?.image_urls?.join(", ") ?? ""}
          placeholder="https://…, https://…"
          className={inputClass}
        />
      </div>

      {product && (
        <label className="flex items-center gap-2 text-xs text-[#98a2b3]">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked={product.is_available}
          />
          Visible on store
        </label>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#dc9b5f] text-[#0a0f1a] text-xs font-semibold rounded-full px-4 py-2.5 disabled:opacity-50"
        >
          {pending ? "Saving…" : product ? "Save changes" : "Add product"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#98a2b3] px-4 py-2.5"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-[#0a0f1a] border border-white/15 rounded-lg px-3 py-2 text-[#f3efe4] placeholder:text-[#4b5563] focus:outline-none focus:border-[#dc9b5f]";

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#98a2b3] mb-1">
        {label}
      </label>
      <input {...props} className={inputClass} />
    </div>
  );
}
