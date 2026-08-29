import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { uploadStoreLogo } from "../lib/storage";

const FREE_SWATCHES = ["#17171a", "#c23b2b", "#1a5c3a", "#1a3a5c"];

export function Settings() {
  const { store, refreshStore } = useAuth();
  const [theme, setTheme] = useState(store.theme_color ?? "#17171a");
  const [logoUrl, setLogoUrl] = useState(store.logo_url ?? null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState(null);
  const [status, setStatus] = useState("idle");

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setLogoError(null);
    try {
      const { url } = await uploadStoreLogo(store.id, file);
      const { error } = await supabase
        .from("stores")
        .update({ logo_url: url })
        .eq("id", store.id);
      if (error) throw error;

      setLogoUrl(url);
      await refreshStore();
    } catch (err) {
      setLogoError(err.message || "Upload failed.");
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");

    const formData = new FormData(e.target);
    const update = {
      store_name: formData.get("store_name"),
      description: formData.get("description"),
      whatsapp: formData.get("whatsapp"),
      location: formData.get("location"),
    };

    if (store.plan === "premium") {
      update.theme_color = theme;
    } else {
      update.theme_color = FREE_SWATCHES.includes(theme) ? theme : "#17171a";
    }

    const { error } = await supabase
      .from("stores")
      .update(update)
      .eq("id", store.id);

    if (error) {
      setStatus("error");
      return;
    }

    await refreshStore();
    setStatus("saved");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="font-semibold text-lg text-[#f3efe4]">Store settings</h2>

      {/* Logo — uploads immediately on file select, separate from the
          rest of the form since it doesn't need the "Save changes" step */}
      <div>
        <label className="block text-xs font-medium text-[#98a2b3] mb-2">
          Store logo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0a0f1a] border border-white/15 overflow-hidden grid place-items-center shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-[#4b5563]">No logo</span>
            )}
          </div>
          <label className="text-xs font-semibold text-[#dc9b5f] cursor-pointer">
            {logoUploading ? "Uploading…" : "Upload new logo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={logoUploading}
              onChange={handleLogoChange}
            />
          </label>
        </div>
        {logoError && <p className="text-red-400 text-xs mt-1">{logoError}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <Field label="Store name" name="store_name" defaultValue={store.store_name} />
        <div>
          <label className="block text-xs font-medium text-[#98a2b3] mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={store.description ?? ""}
            rows={2}
            className={inputClass}
          />
        </div>
        <Field
          label="WhatsApp number"
          name="whatsapp"
          defaultValue={store.whatsapp}
          placeholder="2547XXXXXXXX"
        />
        <Field label="Location" name="location" defaultValue={store.location ?? ""} />

        <div>
          <label className="block text-xs font-medium text-[#98a2b3] mb-2">
            Theme colour
            {store.plan === "free" && (
              <span className="ml-1 text-[#6b7280]">
                (Premium unlocks any colour)
              </span>
            )}
          </label>
          <div className="flex gap-2 items-center">
            {FREE_SWATCHES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setTheme(c)}
                style={{ background: c }}
                className={`w-8 h-8 rounded-full border-2 ${
                  theme === c ? "border-[#dc9b5f]" : "border-transparent"
                }`}
              />
            ))}
            {store.plan === "premium" && (
              <input
                type="color"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-dashed border-white/20 bg-transparent"
              />
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-[#6b7280]">
            Store link:{" "}
            <span className="font-mono text-[#98a2b3]">
              {store.subdomain}.kaziflow.co.ke
            </span>{" "}
            (fixed — message us on WhatsApp if you need this changed)
          </p>
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-[#dc9b5f] text-[#0a0f1a] text-xs font-semibold rounded-full px-4 py-2.5 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && <p className="text-[#dc9b5f] text-xs">Saved.</p>}
        {status === "error" && (
          <p className="text-red-400 text-xs">Something went wrong.</p>
        )}
      </form>
    </div>
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
