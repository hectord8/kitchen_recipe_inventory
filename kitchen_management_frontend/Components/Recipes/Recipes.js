"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"; // adjust path if needed

import { AuthContext } from "../auth";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const formatDietLabel = (dietKey) =>
  normalize(dietKey)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const parseMinutes = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const parseDiets = (dietField) =>
  String(dietField ?? "")
    .split(",")
    .map((diet) => normalize(diet))
    .filter(Boolean);

function sanitizeHtml(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "");
}

function safeJsonParse(str) {
  if (!str) return null;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export default function ClientRecipes() {
  const { customer } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDiet, setSelectedDiet] = useState(""); // empty = all diets
  const [heartedIds, setHeartedIds] = useState(new Set());
  const [heartsLoaded, setHeartsLoaded] = useState(false);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    if (!customer) {
      setHeartsLoaded(true);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/ids`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((recipes) => {
        const ids = recipes.map((r) => r.id);
        setHeartedIds(new Set(ids.map(Number)));
        setHeartsLoaded(true);
      })
      .catch(() => setHeartsLoaded(true));
  }, [customer]);

  useEffect(() => {
    if (!customer) {
      setFavoritesOnly(false);
    }
  }, [customer]);

  useEffect(() => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/recipes`;

    setLoading(true);
    setError("");

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
  }, []);

  const dietUi = useMemo(() => {
    const counts = new Map();

    recipes.forEach((r) => {
      const unique = new Set(parseDiets(r.diet));
      unique.forEach((dietKey) => {
        counts.set(dietKey, (counts.get(dietKey) ?? 0) + 1);
      });
    });

    const pinnedDietKeys = ["vegan", "vegetarian", "gluten free", "keto"];
    const maxDietButtons = 4;

    const allByCount = [...counts.entries()]
      .sort((a, b) => {
        const countDiff = b[1] - a[1];
        if (countDiff !== 0) return countDiff;
        return a[0].localeCompare(b[0]);
      })
      .map(([key]) => key);

    const pinnedPresent = pinnedDietKeys.filter((key) => counts.has(key));
    const fillKeys = allByCount.filter((key) => !pinnedPresent.includes(key));

    const buttonDietKeys = [...pinnedPresent];
    for (const key of fillKeys) {
      if (buttonDietKeys.length >= maxDietButtons) break;
      buttonDietKeys.push(key);
    }

    const buttonOptions = buttonDietKeys.map((key) => ({
      key,
      label: formatDietLabel(key),
      count: counts.get(key) ?? 0,
    }));

    const moreOptions = allByCount
      .filter((key) => !buttonDietKeys.includes(key))
      .map((key) => ({
        key,
        label: formatDietLabel(key),
        count: counts.get(key) ?? 0,
      }));

    const selectedInButtons = buttonDietKeys.includes(selectedDiet);

    return {
      buttonOptions,
      moreOptions,
      selectedInButtons,
    };
  }, [recipes, selectedDiet]);

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
      const dietOk = !selectedDietNorm || recipeDiets.includes(selectedDietNorm);

      const favoriteOk = !favoritesOnly || (heartsLoaded && heartedIds.has(Number(r.id)));

      return searchOk && dietOk && favoriteOk;
    });
  }, [recipes, selectedDiet, search, favoritesOnly, heartedIds, heartsLoaded]);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-recipes/${id}`, {
        method: isHearted ? "DELETE" : "POST",
        credentials: "include",
      });

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
      {expandedRecipeId !== null && (
        <div className={styles.backdrop} onClick={() => setExpandedRecipeId(null)} />
      )}
      <div className={styles.filter}>
        <div className={styles.filterFixed}>
          <h1>Filters</h1>

          <div className={styles.filterSection}>
            <h4>Search</h4>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
            />
          </div>

          {customer && (
            <div className={styles.filterSection}>
              <button
                type="button"
                onClick={() => setFavoritesOnly((prev) => !prev)}
                disabled={!heartsLoaded}
                className={favoritesOnly ? styles.selected : ""}
              >
                {favoritesOnly ? "Show All" : "Favorites"}
              </button>
            </div>
          )}

          <div className={styles.filterSection}>
            <h2>Diets</h2>
            <button
              type="button"
              onClick={() => setSelectedDiet("")}
              className={!selectedDiet ? styles.selected : ""}
            >
              All diets
            </button>

            <div className={styles.filterButtons}>
              {dietUi.buttonOptions.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDiet(key)}
                  className={selectedDiet === key ? styles.selected : ""}
                >
                  {label}
                </button>
              ))}
            </div>

            {dietUi.moreOptions.length > 0 && (
              <label>
                More diets
                <select
                  value={dietUi.selectedInButtons ? "" : selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                >
                  <option value="">Select a diet…</option>
                  {dietUi.moreOptions.map(({ key, label, count }) => (
                    <option key={key} value={key}>
                      {label} ({count})
                    </option>
                  ))}
                </select>
              </label>
            )}
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
          const recipeId = Number(recipe.id);
          const isHearted = heartedIds.has(recipeId);

          return (
            <div
              key={recipeId}
              className={`${styles.card} ${expandedRecipeId === recipeId ? styles.expanded : ""}`}
            >
              <div className={styles.imageContainer}>
                {customer && (
                  <button
                    className={`${styles.heart} ${isHearted ? styles.hearted : ""}`}
                    onClick={() => toggleHeart(recipeId)}
                    type="button"
                    disabled={!heartsLoaded}
                    aria-label={isHearted ? "Unheart recipe" : "Heart recipe"}
                  />
                )}
                <Image
                  src={
                    recipe.image?.startsWith("/")
                      ? `${process.env.NEXT_PUBLIC_API_URL}${recipe.image}`
                      : recipe.image || "/burger.jpg"
                  }
                  sizes="100vw"
                  fill
                  alt={recipe.title || "Recipe image"}
                />
              </div>

              <h2>{recipe.title}</h2>

              <div className={styles.meta}>
                {recipe.category && (
                  <span className={styles.tag}>{recipe.category}</span>
                )}
                {recipe.diet && parseDiets(recipe.diet).map((d) => (
                  <span key={d} className={styles.tag}>{formatDietLabel(d)}</span>
                ))}
                {recipe.calories && (
                  <span className={styles.tag}>{recipe.calories} cal</span>
                )}
              </div>

              {recipe.prepMinutes != null && (
                <h5>Prep Time: {recipe.prepMinutes}m</h5>
              )}
              {recipe.cookMinutes != null && (
                <h5>Cook Time: {recipe.cookMinutes}m</h5>
              )}
              {recipe.readyMinutes != null && (
                <h5>Total Time: {recipe.readyMinutes}m</h5>
              )}
              {expandedRecipeId === recipeId && (
                <>
                  <button className={styles.closeBtn} onClick={() => setExpandedRecipeId(null)}>
                    ×
                  </button>

                  {(recipe.description || recipe.summary) && (
                    <div className={styles.section}>
                      <h4 className={styles.sectionTitle}>Description</h4>
                      <p className={styles.summary}>
                        {recipe.description || sanitizeHtml(recipe.summary)}
                      </p>
                    </div>
                  )}

                  {safeJsonParse(recipe.ingredientsJson) && (
                    <div className={styles.section}>
                      <h4 className={styles.sectionTitle}>Ingredients</h4>
                      <ul className={styles.list}>
                        {safeJsonParse(recipe.ingredientsJson).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {safeJsonParse(recipe.instructionStepsJson) && (
                    <div className={styles.section}>
                      <h4 className={styles.sectionTitle}>Instructions</h4>
                      <ol className={styles.list}>
                        {safeJsonParse(recipe.instructionStepsJson).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              )}
              <button
                className={styles.details}
                onClick={() => setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId)}
              >
                {expandedRecipeId === recipeId ? "See less" : "See more"}
              </button>

              <p>Created by {recipe.creator}. </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
