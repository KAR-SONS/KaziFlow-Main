import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [store, setStore] = useState(undefined);
  const [storeError, setStoreError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return; // still loading
    if (session === null) {
      setStore(null);
      return;
    }

    let cancelled = false;
    setStore(undefined); // loading

    supabase
      .from("stores")
      .select("*")
      .eq("owner_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setStoreError(
            "No store found for this account yet — message us on WhatsApp to get set up."
          );
          setStore(null);
        } else {
          setStore(data);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function refreshStore() {
    if (!session) return;
    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", session.user.id)
      .single();
    if (data) setStore(data);
  }

  return (
    <AuthContext.Provider
      value={{ session, store, storeError, refreshStore }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
