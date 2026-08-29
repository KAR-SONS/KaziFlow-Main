import { useRef, useState } from "react";
import { uploadProductImage, deleteStoreAsset, pathFromPublicUrl } from "../lib/storage";

/**
 * Controlled multi-image uploader.
 *
 * value: array of public URLs (matches products.image_urls)
 * onChange: (newUrls: string[]) => void
 */
export function ImageUploader({ storeId, value = [], onChange, maxImages = 5 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFiles(fileList) {
    const files = Array.from(fileList);
    const remaining = maxImages - value.length;

    if (remaining <= 0) {
      setError(`You can only have up to ${maxImages} images.`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    setUploading(true);
    setError(null);

    try {
      const uploaded = [];
      for (const file of toUpload) {
        if (!file.type.startsWith("image/")) continue;
        const { url } = await uploadProductImage(storeId, file);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(url) {
    onChange(value.filter((u) => u !== url));
    // Best-effort delete from storage — don't block the UI on it, and
    // don't surface an error if it fails (file may already be gone).
    const path = pathFromPublicUrl(url);
    if (path) deleteStoreAsset(path).catch(() => {});
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[#98a2b3] mb-2">
        Product photos ({value.length}/{maxImages})
      </label>

      <div className="grid grid-cols-5 gap-2 mb-2">
        {value.map((url) => (
          <div key={url} className="relative aspect-square group">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover rounded-lg border border-white/10"
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0a0f1a] border border-white/20 text-[#f3efe4] text-[11px] leading-none grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border border-dashed border-white/20 text-[#6b7280] text-xs grid place-items-center hover:border-[#dc9b5f] hover:text-[#dc9b5f] transition-colors disabled:opacity-50"
          >
            {uploading ? "…" : "+ Add"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
