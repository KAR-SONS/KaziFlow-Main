-- ============================================================
-- KaziFlow Stores — auth flow update
-- Run this AFTER schema.sql and schema-additions.sql.
--
-- Context: sellers now sign up themselves (email + password + a store
-- name they'd like) via a link you send them. You still manually
-- create their `stores` row afterward — this just captures what they
-- typed as `requested_store_name` on their profile so you have it on
-- hand instead of relying on memory of the WhatsApp conversation.
-- ============================================================

alter table public.profiles
  add column requested_store_name text;

-- Update the new-user trigger to also capture the store name passed
-- in at signup via supabase.auth.signUp({ options: { data: {...} } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, requested_store_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'requested_store_name'
  );
  return new;
end;
$$;

-- ------------------------------------------------------------
-- When you're ready to activate a seller, find their profile:
--
--   select id, email, requested_store_name, created_at
--   from public.profiles
--   order by created_at desc;
--
-- Then create their store, using that profile id as owner_id:
--
--   insert into public.stores (owner_id, store_name, subdomain, whatsapp)
--   values ('<profile-id-here>', 'Trendy Shop', 'trendyshop', '2547XXXXXXXX');
--
-- The instant that row exists, their next dashboard login resolves it
-- automatically — no other change needed on their side.
-- ------------------------------------------------------------
