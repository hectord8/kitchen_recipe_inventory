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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/import?count=5`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include", // keep if you use cookies/sessions
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((data && (data.message || data.error)) || `Request failed: ${res.status}`);
      }

      setResult(data);
    } catch (e) {
      setError(e.message || "Import failed");
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = customer?.role === "ADMIN";

  if (authLoading) return <p>Loading...</p>;
  if (!customer) return <p>Please log in.</p>;
  if (!isAdmin) return <p>Not authorized.</p>;

  return (
    <main className="adminMain">
      <h1>Admin</h1>
      <p>Import 200 random Spoonacular recipes into the database.</p>

      <button onClick={importRecipes} disabled={loading} className="adminButton">
        {loading ? "Importing..." : "Import 200 recipes"}
      </button>

      {error && <p className="errorText">{error}</p>}

      {result && (
        <div className="adminResult">
          <h3>Done ✅</h3>
          <pre className="adminResultPre">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
