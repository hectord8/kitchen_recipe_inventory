"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"; // adjust path if needed

import { AuthContext } from "../auth";

export default function ClientRecipes() {
  const { customer, loading: authLoading, token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Favourites, setFavourties] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("ALL");
  const [heartedIds, setHeartedIds] = useState(new Set());
  const [heartsLoaded, setHeartsLoaded] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [maxCookTime, setSelectedCookTime] = useState(999);
  const [maxPrepTime, setSelectedPrepTime] = useState(999);

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
  }, [Favourites]);


const normalize = (s) => String(s ?? "").trim().toLowerCase();

const parseDiets = (dietField) =>
  String(dietField ?? "")
    .split(",")
    .map((d) => normalize(d))
    .filter(Boolean);

const Diets = useMemo(() => {
  const set = new Set();
  recipes.forEach((r) => parseDiets(r.diet).forEach((d) => set.add(d)));
  return [...set].sort();
}, [recipes]);

  const filteredRecipes = useMemo(() => {
    const q = search.toLowerCase().trim();
    const selectedDietNorm = normalize(selectedDiet);

    return recipes.filter((r) => {
      const searchOk =
        !q ||
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.diet?.toLowerCase().includes(q);
      
        
      const recipeDiets = parseDiets(r.diet);
      const dietOk = selectedDietNorm === "all" || recipeDiets.includes(selectedDietNorm);
    

      const prep = Number(r.prepMinutes ?? 0);
      const prepOk = prep <= maxPrepTime;

      const cook = Number(r.cookMinutes ?? 0);
      const cookOk = cook <= maxCookTime;

      return searchOk && dietOk  && prepOk && cookOk;
    });
  }, [recipes, selectedDiet, search, maxPrepTime, maxCookTime]);

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
      console.log(res.ok);
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
          <h4>Search</h4>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
          />
          <div>
            {customer && (
              <button
                type="button"
                onClick={() => setFavourties((prev) => !prev)}
              >
                {Favourites ? "Show All" : "Favourites"}
              </button>
            )}
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
            <h2> Max Prep Time {maxPrepTime} </h2>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={maxPrepTime}
              onChange={(e) => setSelectedPrepTime(Number(e.target.value))}
            ></input>
          </div>
          <div>
            <h2>Max Cook Time : {maxCookTime}</h2>

            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={maxCookTime}
              onChange={(e) => setSelectedCookTime(Number(e.target.value))}
            ></input>
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
                  src={recipe.image || "/burger.jpg"}
                  sizes="100vw"
                  fill
                  alt={recipe.title || "Recipe image"}
                />
              </div>

              <h2>{recipe.title}</h2>

              <h4>{recipe.diet}</h4>

              <h5>Prep Time:{recipe.prepMinutes}</h5>
              <h5>Cook Time:{recipe.cookMinutes}</h5>

              <h5>Total Time: {recipe.readyMinutes} </h5>
              {expandedRecipe === recipe.id && <p>{recipe.summary}</p>}
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

              <p>Created by {recipe.creator}. </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
