"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import styles from "./page.module.css"; // adjust path if needed
import { AuthContext } from "../auth";

export default function ClientRecipes() {
  const { customer, loading: authLoading } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Favourites, setFavourties] = useState(false);
  const [error, setError] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [Diets, setDiets] = useState([]);
  const [Cats, setCats] = useState([]);

  const [selectedDiet, setSelectedDiet] = useState("ALL");
  const [selectedCat, setSelectedCat] = useState("ALL");

  const [heartedIds, setHeartedIds] = useState(new Set());

  const [heartsLoaded, setHeartsLoaded] = useState(false);

  useEffect(() => {
    console.log("endpoint " + endpoint);
    if (!customer) return;

    fetch("http://localhost:8080/saved-recipes/ids", {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((recipes) => {
        const ids = recipes.map((r) => r.id);
        console.log("Extracted ids:", ids);
        setHeartedIds(new Set(ids.map(Number)));
        setHeartsLoaded(true);
      })
      .catch(() => setHeartsLoaded(true));
  }, [customer]);

  useEffect(() => {
    const endpoint = Favourites
      ? "http://localhost:8080/saved-recipes/ids"
      : "http://localhost:8080/recipes";

    fetch(endpoint, {
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
  }, [Favourites]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const dietOk = selectedDiet === "ALL" || r.diet === selectedDiet;
      const catOk = selectedCat === "ALL" || r.category === selectedCat;
      return dietOk && catOk;
    });
  }, [recipes, selectedDiet, selectedCat]);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  async function toggleHeart(id) {
    const isHearted = heartedIds.has(id);

    setHeartedIds((prev) => {
      const next = new Set(prev);
      isHearted ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      const res = await fetch(`http://localhost:8080/saved-recipes/${id}`, {
        method: isHearted ? "DELETE" : "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update saved recipe");
      }
    } catch (err) {
      console.error(err);

      setHeartedIds((prev) => {
        const next = new Set(prev);
        isHearted ? next.add(id) : next.delete(id);
        return next;
      });
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.filter}>
        <div className={styles.filterFixed}>
          <h1>Filters</h1>
          <div>
            <button
              type="button"
              onClick={() => setFavourties((prev) => !prev)}
            >
              {Favourites ? "Show All" : "Favourites"}
            </button>
          </div>
          <div>
            <h2>Diets</h2>
            <button type="button" onClick={() => setSelectedDiet("ALL")}>
              All diets
            </button>
            <div className={styles.filterButtons}>
              {Diets.map((Diets) => (
                <div key={Diets}>
                  <button
                    onClick={() => setSelectedDiet(Diets)}
                    style={{
                      color: selectedDiet === Diets ? "red" : "black",
                    }}
                  >
                    {Diets}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>Categories</h2>

            <button type="button" onClick={() => setSelectedCat("ALL")} >
              All Cats
            </button>
            <div className={styles.filterButtons}>
              {Cats.map((Cats) => (
                <div key={Cats}>
                  <button
                    onClick={() => setSelectedCat(Cats)}
                    style={{
                      color: selectedCat === Cats ? "red" : "black",
                    }}
                  >
                    {Cats}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {filteredRecipes.map((recipe) => {
          const isHearted = heartedIds.has(recipe.id);

          return (
            <div key={recipe.id} className={styles.card}>
              {customer && heartsLoaded && (
                <button
                  className={`${styles.heart} ${
                    isHearted ? styles.hearted : ""
                  }`}
                  onClick={() => toggleHeart(recipe.id)}
                  type="button"
                  aria-label={isHearted ? "Unheart recipe" : "Heart recipe"}
                />
              )}

              <div className={styles.imageContainer}>
                <Image
                  src={recipe.imageUrl || "/burger.jpg"}
                  sizes="100vw"
                  fill
                  alt={recipe.title || "Recipe image"}
                />
              </div>

              <h2>{recipe.title}</h2>
              <p>Click to view details.</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
