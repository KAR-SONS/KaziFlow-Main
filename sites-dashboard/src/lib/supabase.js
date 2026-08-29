import { createClient } from "@supabase/supabase-js";

// Vite exposes env vars prefixed with VITE_ via import.meta.env.
// Add these to a .env.local file at your project root:
//   VITE_SUPABASE_URL=your-project-url
//   VITE_SUPABASE_ANON_KEY=your-anon-key
//
// Only ever use the anon key here — RLS policies (see schema.sql) do
// the authorization work that a backend would otherwise do.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
