export const FREE_PLAN_LIMITS = {
  maxProducts: 10,
  maxImagesPerProduct: 5,
};

export const PREMIUM_PLAN_LIMITS = {
  maxProducts: Infinity,
  maxImagesPerProduct: 5,
};

export function limitsFor(plan) {
  return plan === "premium" ? PREMIUM_PLAN_LIMITS : FREE_PLAN_LIMITS;
}

// NOTE: these are UI-level limits for showing counters/disabling buttons.
// Since there's no backend here, the real enforcement lives in a Postgres
// trigger on the `products` table (see schema-additions.sql) — a client
// check alone can be bypassed by anyone calling the Supabase API directly.
