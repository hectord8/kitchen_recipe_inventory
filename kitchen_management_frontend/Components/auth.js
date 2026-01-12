"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, createContext } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setToken = (t) => {
    setTokenState(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setLoading(false);
      return;
    }

    setTokenState(stored);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (!data) {
          // token invalid/expired
          localStorage.removeItem("token");
          setTokenState(null);
          setCustomer(null);
          router.push("/"); 
        } else {
          setCustomer(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ customer, setCustomer, token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
