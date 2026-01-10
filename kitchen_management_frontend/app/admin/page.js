"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/Components/auth";

export default function AdminPage() {
  const { token, customer, loading: authLoading } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function importRecipes() {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/import?count=100`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include", // keep if you use cookies/sessions
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          (data && (data.message || data.error)) || `Request failed: ${res.status}`
        );
      }

      setResult(data);
    } catch (e) {
      setError(e.message || "Import failed");
    } finally {
      setLoading(false);
    }
  }

  // basic client-side guard (still enforce on backend!)
  const isAdmin =
    customer?.role === "ADMIN" || customer?.email === "123@123.com"; // adjust to your logic

  if (authLoading) return <p>Loading...</p>;
  if (!customer) return <p>Please log in.</p>;
  if (!isAdmin) return <p>Not authorized.</p>;

  return (
    <main style={{ margin:60,  padding: 24, maxWidth: 720 }}>
      <h1>Admin</h1>
      <p>Import 200 random Spoonacular recipes into the database.</p>

      <button
        onClick={importRecipes}
        disabled={loading}
        style={{
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Importing..." : "Import 200 recipes"}
      </button>

      {error && (
        <p style={{ marginTop: 16, color: "crimson" }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>Done ✅</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
