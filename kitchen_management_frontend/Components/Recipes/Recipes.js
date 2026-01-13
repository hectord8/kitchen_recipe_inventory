"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"; // adjust path if needed

import { AuthContext } from "../auth";

const normalize = (value) => String(value ?? "").trim().toLowerCase();

const parseDiets = (dietField) =>
  String(dietField ?? "")
    .split(",")
    .map((diet) => normalize(diet))
    .filter(Boolean);

const MAX_PREP_TIME_DEFAULT = 999;
const MAX_COOK_TIME_DEFAULT = 999;
const MAX_PREP_TIME_SLIDER = 40;
const MAX_COOK_TIME_SLIDER = 120;

export default function ClientRecipes() {
  const { customer, token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("ALL");
  const [heartedIds, setHeartedIds] = useState(new Set());
  const [heartsLoaded, setHeartsLoaded] = useState(false);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [maxCookTime, setMaxCookTime] = useState(MAX_COOK_TIME_DEFAULT);
  const [maxPrepTime, setMaxPrepTime] = useState(MAX_PREP_TIME_DEFAULT);


  useEffect(() => {
    if (!customer || !token) {
      setHeartsLoaded(true);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/ids`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((recipes) => {
        const ids = recipes.map((r) => r.id);
        setHeartedIds(new Set(ids.map(Number)));
        setHeartsLoaded(true);
      })
      .catch(() => setHeartsLoaded(true));
  }, [customer, token]);

  useEffect(() => {

   
    const endpoint = favoritesOnly
      ? `${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/ids`
      : `${process.env.NEXT_PUBLIC_API_URL}/recipes`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(endpoint, {
      headers,
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
  }, [favoritesOnly, token, customer]);


  const dietOptions = useMemo(() => {
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
  if (error) return <p className="errorText">{error}</p>;


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
                onClick={() => setFavoritesOnly((prev) => !prev)}
              >
                {favoritesOnly ? "Show All" : "Favorites"}

              </button>
            )}
          </div>

          <div>
            <h2>Diets</h2>
            <button type="button" onClick={() => setSelectedDiet("ALL")}>
              All diets
            </button>
            <div className={styles.filterButtons}>
              {dietOptions.map((dietOption) => (
                <div key={dietOption}>
                  <button
                    onClick={() => setSelectedDiet(dietOption)}
                    style={{
                      color: selectedDiet === dietOption ? "red" : "black",
                    }}
                  >
                    {dietOption}
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
max={MAX_PREP_TIME_SLIDER}
              step={1}
              value={maxPrepTime}
              onChange={(e) => setMaxPrepTime(Number(e.target.value))}
            ></input>
          </div>
          <div>
            <h2>Max Cook Time : {maxCookTime}</h2>

            <input
              type="range"
              min={0}
max={MAX_COOK_TIME_SLIDER}
              step={5}
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
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
                expandedRecipeId === recipe.id ? styles.expanded : ""
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
              {expandedRecipeId === recipe.id && <p>{recipe.summary}</p>}
              <button
                className={styles.details}
                onClick={() =>
                  setExpandedRecipeId(
                    expandedRecipeId === recipe.id ? null : recipe.id
                  )
                }
              >
                {expandedRecipeId === recipe.id ? "See less" : "See more"}
              </button>

              <p>Created by {recipe.creator}. </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
