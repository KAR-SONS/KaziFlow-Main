-- ============================================================
-- KaziFlow Stores — Storage bucket for product images + logos
-- Run this AFTER schema.sql, schema-additions.sql, schema-auth-update.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Create the bucket (public read — storefront pages need to
--    display images to anonymous visitors without an auth check on
--    every image load)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('store-assets', 'store-assets', true)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2. Path convention (enforced by the app, not the DB):
--      {store_id}/products/{uuid}-{filename}
--      {store_id}/logo/{filename}
--
--    Policies below check that the first path segment (store_id)
--    belongs to a store the authenticated user owns — this is what
--    actually stops seller A from uploading into seller B's folder.
--    Public bucket = public reads, but writes are still locked down.
-- ------------------------------------------------------------

create policy "store owners can upload their own assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'store-assets'
  and (storage.foldername(name))[1] in (
    select id::text from public.stores where owner_id = auth.uid()
  )
);

create policy "store owners can update their own assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'store-assets'
  and (storage.foldername(name))[1] in (
    select id::text from public.stores where owner_id = auth.uid()
  )
);

create policy "store owners can delete their own assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'store-assets'
  and (storage.foldername(name))[1] in (
    select id::text from public.stores where owner_id = auth.uid()
  )
);

-- Public read policy (redundant with the bucket's public=true flag for
-- the public URL endpoint, but included so table-level SELECTs against
-- storage.objects also work, e.g. if you ever list files in the
-- dashboard UI programmatically)
create policy "anyone can view store assets"
on storage.objects for select
to public
using (bucket_id = 'store-assets');

-- ------------------------------------------------------------
-- Notes
-- ------------------------------------------------------------
-- - Deleting a product does NOT delete its images from storage — the
--   ImageUploader component below deletes files individually when a
--   seller removes them from the form, but a deleted product's images
--   become orphaned. Fine at this scale; revisit with a cleanup job
--   (or a DB trigger calling storage delete) once volume matters.
-- - 5-image-per-product cap is already enforced at the DB level via
--   the image_urls_max_five constraint from schema-additions.sql —
--   the uploader just mirrors that limit in the UI for a fast error.
