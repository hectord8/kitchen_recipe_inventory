"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, createContext } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data) {
          setCustomer(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ customer, setCustomer, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
