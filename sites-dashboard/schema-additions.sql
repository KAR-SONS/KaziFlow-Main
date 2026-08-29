-- ============================================================
-- KaziFlow Stores — schema additions for a backend-less (Vite + Supabase)
-- frontend. Run this AFTER schema.sql.
--
-- Why this file exists: the dashboard is a pure client-side app calling
-- Supabase directly. Any "free plan = max 10 products" check written in
-- React can be bypassed by someone calling the Supabase REST API
-- directly with their own auth token. RLS controls *who* can write to a
-- row, but not *business rules* like product counts — those need to
-- live in the database itself via a trigger.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Hard cap on images per product (5, regardless of plan)
-- ------------------------------------------------------------
alter table public.products
  add constraint image_urls_max_five
  check (
    image_urls is null
    or array_length(image_urls, 1) is null
    or array_length(image_urls, 1) <= 5
  );

-- ------------------------------------------------------------
-- 2. Free-plan product count cap (10), enforced in the DB
-- ------------------------------------------------------------
create or replace function public.enforce_product_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_plan public.store_plan;
  v_count int;
  v_max constant int := 10;
begin
  select plan into v_plan from public.stores where id = new.store_id;

  if v_plan = 'premium' then
    return new;
  end if;

  select count(*) into v_count
  from public.products
  where store_id = new.store_id;

  if v_count >= v_max then
    raise exception
      'Free plan is limited to % products. Upgrade to Premium for unlimited products.',
      v_max;
  end if;

  return new;
end;
$$;

create trigger products_enforce_free_limit
  before insert on public.products
  for each row execute procedure public.enforce_product_limit();

-- ------------------------------------------------------------
-- Notes
-- ------------------------------------------------------------
-- - The React app still checks the limit client-side too (see
--   src/admin/Products.jsx) — that's purely for a fast, friendly error
--   message. This trigger is what actually protects the rule.
-- - If a product is inserted via a bulk import or Supabase Studio, this
--   trigger still applies, which is the point.
-- - Downgrading a premium store back to free does NOT retroactively
--   hide/delete their existing >10 products — they just can't add more
--   until they're back under the limit. Decide if that's the behavior
--   you want; it's the safer default (no silent data loss).
