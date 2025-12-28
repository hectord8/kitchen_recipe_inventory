"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"; // adjust path if needed

import { AuthContext } from "../auth";

export default function ClientRecipes() {
  const { token } = useContext(AuthContext);
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

  const [expandedRecipe, setExpandedRecipe] = useState(null);

  useEffect(() => {
 
    if (!customer) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/ids`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/ids`
      : `${process.env.NEXT_PUBLIC_API_URL}/recipes`;

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/Diets`, {
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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/Category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/${id}`,
        {
          method: isHearted ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

            <button type="button" onClick={() => setSelectedCat("ALL")}>
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
          {customer && (
            <Link className={styles.publish} href="/CreateRecipe">
              Publish your own recipe
            </Link>
          )}
        </div>
      </div>

      <div className={styles.body}>
        {filteredRecipes.map((recipe) => {
          const isHearted = heartedIds.has(recipe.id);
          
          return (
            <div
              key={recipe.id}
              className={`${styles.card} ${
                expandedRecipe === recipe.id ? styles.expanded : ""
              }`}
            >
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
              <h4>{recipe.category}</h4>
              <h4>{recipe.diet}</h4>

              <h5>Prep Time:{recipe.prepTime}</h5>
              <h5>Cook Time:{recipe.cookTime}</h5>

              <h5>Total Time: {recipe.prepTime + recipe.cookTime} </h5>
              <button
                className={styles.details}
                onClick={() =>
                  setExpandedRecipe(
                    expandedRecipe === recipe.id ? null : recipe.id
                  )
                }
              >
                {expandedRecipe === recipe.id ? "See less" : "See more"}
              </button>
              <p>Created by {recipe.creator} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
