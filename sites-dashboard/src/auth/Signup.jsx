import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// You send sellers this page's link directly (e.g. after they reach out
// on WhatsApp). They set their own password here. The store name they
// enter is just captured on their profile (see schema-auth-update.sql)
// for your reference — you still create the actual `stores` row
// manually. Once you do, their next login resolves it automatically.
export function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    storeName: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState(null);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { requested_store_name: form.storeName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setStatus("error");
      return;
    }

    // If email confirmation is enabled in Supabase Auth settings,
    // data.session will be null here until they confirm — show the
    // "check your email" state either way, since a store isn't linked
    // yet regardless.
    setStatus("done");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-[#0a0f1a] px-6 font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-white/12 bg-[#0d1420] p-8">
        <h1 className="text-xl font-semibold text-[#f3efe4] mb-1">
          Set up your <span className="text-[#dc9b5f]">KaziFlow</span> account
        </h1>
        <p className="text-sm text-[#98a2b3] mb-6">
          Create your login now — we'll finish building your store and let
          you know when it's live.
        </p>

        {status === "done" ? (
          <div className="text-sm text-[#dc9b5f] bg-[#dc9b5f]/10 border border-[#dc9b5f]/30 rounded-lg p-3 space-y-2">
            <p className="font-medium">Account created.</p>
            <p className="text-[#98a2b3]">
              If email confirmation is required, check your inbox first.
              Otherwise you can log in now — your dashboard will show a
              "no store yet" message until we finish setting up{" "}
              <span className="text-[#f3efe4]">{form.storeName}</span>.
            </p>
            <Link to="/login" className="inline-block underline text-[#f3efe4]">
              Go to login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field
              label="Store name"
              type="text"
              required
              value={form.storeName}
              onChange={update("storeName")}
              placeholder="e.g. Trendy Shop"
            />
            <Field
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
              placeholder="At least 6 characters"
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-[#dc9b5f] text-[#0a0f1a] text-sm font-semibold rounded-full py-2.5 hover:bg-[#e5a86e] transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="text-xs text-[#4b5563] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="underline text-[#98a2b3]">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#98a2b3] mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-[#0a0f1a] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-[#f3efe4] placeholder:text-[#4b5563] focus:outline-none focus:border-[#dc9b5f]"
      />
    </div>
  );
}
