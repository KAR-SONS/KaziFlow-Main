import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { session, store, storeError } = useAuth();

  if (session === undefined || store === undefined) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0a0f1a] text-[#98a2b3] text-sm">
        Loading…
      </div>
    );
  }

  if (session === null) {
    return <Navigate to="/login" replace />;
  }

  if (store === null) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0a0f1a] px-6">
        <div className="max-w-sm text-center">
          <p className="text-[#f3efe4] font-semibold mb-2">
            No store linked to this account
          </p>
          <p className="text-[#98a2b3] text-sm mb-6">
            {storeError ||
              "Message us on WhatsApp to get your store set up."}
          </p>
          <a
            href="https://wa.me/254728482191?text=Hi%2C%20I%20want%20to%20create%20a%20KaziFlow%20store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#dc9b5f] text-[#0a0f1a] font-semibold text-sm rounded-full px-5 py-2.5"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return children;
}
