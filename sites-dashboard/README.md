# KaziFlow Dashboard — Storage bucket for images

Adds real image uploads (product photos + store logo) via Supabase
Storage, replacing the old "paste image URLs" text field.

## 1. Run the SQL

Run **`storage-setup.sql`** in the Supabase SQL editor (after
`schema.sql`, `schema-additions.sql`, `schema-auth-update.sql`). It:
- Creates a public `store-assets` bucket (public read — storefront
  pages need to show images to visitors without an auth check on every
  image load)
- Adds RLS policies on `storage.objects` so a seller can only
  upload/update/delete files inside their **own** store's folder —
  checked via `(storage.foldername(name))[1]` matching a store they own

Path convention: `{store_id}/products/{uuid}.{ext}` and
`{store_id}/logo/logo.{ext}`.

## 2. Files to add/replace

```
src/
├── lib/
│   └── storage.js          ← new — upload/delete/URL helpers
├── components/
│   ├── ImageUploader.jsx   ← new — multi-image picker with previews
│   └── ProductForm.jsx     ← replace — uses ImageUploader now
└── admin/
    ├── Products.jsx        ← replace — passes storeId to ProductForm,
    │                          shows a thumbnail in the product list
    └── Settings.jsx        ← replace — adds logo upload
```

## What changed in the UI

- **Products**: instead of typing comma-separated image URLs, sellers
  now see a 5-slot grid — click "+ Add" to pick photos, hover a photo
  to remove it. Uploads happen immediately on file select.
- **Settings**: a logo circle with an "Upload new logo" link. Uploading
  saves straight to the store record (no separate "Save" click needed
  for the logo specifically — it's independent of the rest of the
  form).

## Known limitation (documented in storage-setup.sql)

Deleting a product removes its DB row but **not** its images from
storage — they become orphaned files. Fine at this scale (a few KB
each, Supabase's free tier storage is generous), but worth a cleanup
job later if the seller count grows a lot. Not worth solving now.
