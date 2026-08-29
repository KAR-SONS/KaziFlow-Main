# KaziFlow Dashboard — auth flow update

Changes the seller flow from magic-link to: **you send a signup link →
they set email/password + store name → you manually create their
store → they log in normally.**

## What changed

- **`src/auth/Signup.jsx`** (new) — email, password, and a "store name"
  field. Calls `supabase.auth.signUp()`, passing the store name through
  as user metadata so it lands on their `profiles` row automatically.
- **`src/auth/Login.jsx`** (replaces the old one) — switched from
  `signInWithOtp` (magic link) to `signInWithPassword`.
- **`src/App.jsx`** — adds a `/signup` route. It's **not linked from
  anywhere public** (not on the login page, not in nav) — you send that
  URL directly to a seller after they reach out, same spirit as your
  WhatsApp-first onboarding.
- **`ProtectedRoute.jsx` is unchanged** — it already showed a "no store
  linked to this account" fallback with a WhatsApp link when someone
  logs in before you've created their store, which is exactly the state
  a seller will be in right after signing up. No new code needed there.

## Database change

Run **`schema-auth-update.sql`** (after `schema.sql` and
`schema-additions.sql`). It:
1. Adds `profiles.requested_store_name` — captures what the seller
   typed at signup, so you have it on hand rather than relying on
   memory of the WhatsApp conversation.
2. Updates the `handle_new_user` trigger to populate that column from
   signup metadata automatically.

The file also includes the two queries you'll actually use day-to-day:
finding a newly-signed-up seller's profile id, then inserting their
`stores` row with that id as `owner_id`. The moment that row exists,
their next dashboard load resolves it — no other change needed on
their end.

## One setting to check in Supabase

Go to **Authentication → Providers → Email** in your Supabase
dashboard and decide on **"Confirm email"**:
- **Enabled** (default): seller must click a link in their email before
  they can log in. More secure, slightly more friction.
- **Disabled**: seller can log in immediately after signing up, even
  before you've created their store — they'll just see the "no store
  yet" screen until you do.

Either works with this flow; it only changes how soon they can *log
in*, not when their store becomes usable (that's gated by you creating
the `stores` row regardless).

## Files in this update

```
src/
├── App.jsx              ← replace yours (adds /signup route)
└── auth/
    ├── Login.jsx         ← replace (password instead of magic link)
    └── Signup.jsx        ← new
schema-auth-update.sql    ← run in Supabase SQL editor
```
