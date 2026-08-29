import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("error");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-[#0a0f1a] px-6 font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-white/12 bg-[#0d1420] p-8">
        <h1 className="text-xl font-semibold text-[#f3efe4] mb-1">
          KaziFlow <span className="text-[#dc9b5f]">Dashboard</span>
        </h1>
        <p className="text-sm text-[#98a2b3] mb-6">
          Log in with your store account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-[#f3efe4] text-[#0a0f1a] text-sm font-semibold rounded-full py-2.5 hover:bg-white transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-xs text-[#4b5563] mt-6 space-y-1">
          <span className="block">
            New here?{" "}
            <span className="text-[#98a2b3]">
              Use the signup link we sent you.
            </span>
          </span>
          <span className="block">
            Don't have a link yet?{" "}
            <a
              href="https://wa.me/254728482191?text=Hi%2C%20I%20want%20to%20create%20a%20KaziFlow%20store"
              className="underline text-[#98a2b3]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Message us on WhatsApp
            </a>
          </span>
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
