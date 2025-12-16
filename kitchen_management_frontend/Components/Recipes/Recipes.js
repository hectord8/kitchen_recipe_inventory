"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css"; // adjust path if needed

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/recipes", {
      credentials: "include", // ok to keep (not required for public list)
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setRecipes(data || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to load recipes");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <div key={recipe.id} className={styles.card}>
          <div className={styles.imageContainer}>
            <Image
              src={recipe.imageUrl || "/burger.jpg"}   // fallback
              sizes="100vw"
              fill
              alt={recipe.title || "Recipe image"}
            />
          </div>

          <h2>{recipe.title}</h2>
          <p>
            {/* replace with recipe.description later if you add it */}
            Click to view details.
          </p>
        </div>
      ))}
    </div>
  );
}
