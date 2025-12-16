"use client";

import { useEffect, useState, createContext } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/Customers/me", {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setCustomer(data);
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
