"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import styles from "./page.module.css"; // adjust path if needed

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [Diets, setDiets] = useState([]);
  const [Cats, setCats] = useState([]);

  const [selectedDiet, setSelectedDiet] = useState("ALL");
  const [selectedCat , setSelectedCat] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:8080/recipes", {
      credentials: "include",
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

    fetch("http://localhost:8080/recipes/Diets", {
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setDiets(data || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to load recipes");
        setLoading(false);
      });

    fetch("http://localhost:8080/recipes/Category", {
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        setCats(data || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to load recipes");
        setLoading(false);
      });
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const dietOk = selectedDiet === "ALL" || r.diet === selectedDiet;
      const catOk = selectedCat === "ALL" || r.category === selectedCat;
      return dietOk && catOk;
    });
  }, [recipes, selectedDiet, selectedCat]);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className={styles.filter}>
        <div>
           <button
          type="button"
          onClick={() => setSelectedDiet("ALL")}
          
        >
          All diets
        </button>

        {Diets.map((Diets) => (
          <div key={Diets}>
            <button onClick={() => setSelectedDiet(Diets)} >{Diets}</button>
          </div>
        ))}

        </div>

        <div>

          <button
          type="button"
          onClick={() => setSelectedCat("ALL")}
          
        >
          All Cats
        </button>

        {Cats.map((Cats) => (
          <div key={Cats}>
            <button onClick={() => setSelectedCat(Cats)} >{Cats}</button>
          </div>
        ))}
          
        </div>
       


         
      </div>

      <div className={styles.body}>
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                src={recipe.imageUrl || "/burger.jpg"} // fallback
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
    </div>
  );
}
