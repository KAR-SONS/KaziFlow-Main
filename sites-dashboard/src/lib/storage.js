import { supabase } from "./supabase";

const BUCKET = "store-assets";

/**
 * Uploads a file to `{storeId}/products/{uuid}-{filename}` and returns
 * its public URL. Throws on failure — callers should catch/display.
 */
export async function uploadProductImage(storeId, file) {
  const ext = file.name.split(".").pop();
  const path = `${storeId}/products/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Uploads a store logo to `{storeId}/logo/{filename}`, overwriting any
 * previous logo file at that fixed path (upsert: true) so old logos
 * don't pile up in storage.
 */
export async function uploadStoreLogo(storeId, file) {
  const ext = file.name.split(".").pop();
  const path = `${storeId}/logo/logo.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Cache-bust so the new logo shows immediately instead of a stale
  // cached version at the same URL.
  return { url: `${data.publicUrl}?t=${Date.now()}`, path };
}

/**
 * Deletes a file given its storage path (not its public URL).
 * Safe to call even if the file doesn't exist.
 */
export async function deleteStoreAsset(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

/**
 * Extracts the storage path from a public URL produced by this bucket,
 * for cases where you only have the URL (e.g. an existing product's
 * image_urls array) and need to delete it later.
 */
export function pathFromPublicUrl(url) {
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split("?")[0];
}
