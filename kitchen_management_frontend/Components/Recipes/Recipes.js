"use client";

import { useEffect, useState, useMemo, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css"; // adjust path if needed

import { AuthContext } from "../auth";

const normalize = (value) => String(value ?? "").trim().toLowerCase();

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


const parseJsonArray = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
};

const stripHtml = (value) => {
  if (!value) return "";
  try {
    const doc = new DOMParser().parseFromString(value, "text/html");
    return doc.body.textContent?.trim() || "";
  } catch (err) {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
};

const MAX_PREP_TIME_SLIDER = 40;
const MAX_COOK_TIME_SLIDER = 120;

const DEFAULT_PREP_UNLIMITED = true;
const DEFAULT_COOK_UNLIMITED = true;
const DEFAULT_MAX_PREP_TIME = MAX_PREP_TIME_SLIDER;
const DEFAULT_MAX_COOK_TIME = MAX_COOK_TIME_SLIDER;

export default function ClientRecipes() {
  const { customer, token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDiet, setSelectedDiet] = useState(""); // empty = all diets
  const [heartedIds, setHeartedIds] = useState(new Set());
  const [heartsLoaded, setHeartsLoaded] = useState(false);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const [prepUnlimited, setPrepUnlimited] = useState(DEFAULT_PREP_UNLIMITED);
  const [cookUnlimited, setCookUnlimited] = useState(DEFAULT_COOK_UNLIMITED);
  const [maxCookTime, setMaxCookTime] = useState(DEFAULT_MAX_COOK_TIME);
  const [maxPrepTime, setMaxPrepTime] = useState(DEFAULT_MAX_PREP_TIME);


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
    if (!customer || !token) {
      setFavoritesOnly(false);
    }
  }, [customer, token]);

  useEffect(() => {

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/recipes`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setLoading(true);
    setError("");

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
  }, [token]);



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

      const prep = parseMinutes(r.prepMinutes);
      const prepOk = prepUnlimited || (prep !== null && prep <= maxPrepTime);

      const cook = parseMinutes(r.cookMinutes);
      const cookOk = cookUnlimited || (cook !== null && cook <= maxCookTime);

      const favoriteOk =
        !favoritesOnly || (heartsLoaded && heartedIds.has(Number(r.id)));

      return searchOk && dietOk && prepOk && cookOk && favoriteOk;
    });
  }, [
    recipes,
    selectedDiet,
    search,
    maxPrepTime,
    maxCookTime,
    prepUnlimited,
    cookUnlimited,
    favoritesOnly,
    heartedIds,
    heartsLoaded,
  ]);


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
                disabled={!heartsLoaded}
                className={favoritesOnly ? styles.selected : ""}
              >
                {favoritesOnly ? "Show All" : "Favorites"}
              </button>

            )}
          </div>

          <div>
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

            <label>
              More diets
              <select
                value={dietUi.selectedInButtons ? "" : selectedDiet}
                disabled={dietUi.moreOptions.length === 0}
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
          </div>

          <div>
            <h2>
              Max Prep Time: {prepUnlimited ? "No limit" : `${maxPrepTime} min`}
            </h2>
            <label>
              <input
                type="checkbox"
                checked={prepUnlimited}
                onChange={(e) => setPrepUnlimited(e.target.checked)}
              />
              No limit
            </label>
            <input
              type="range"
              min={0}
              max={MAX_PREP_TIME_SLIDER}
              step={1}
              value={maxPrepTime}
              disabled={prepUnlimited}
              onChange={(e) => setMaxPrepTime(Number(e.target.value))}
            />
          </div>

          <div>
            <h2>
              Max Cook Time: {cookUnlimited ? "No limit" : `${maxCookTime} min`}
            </h2>
            <label>
              <input
                type="checkbox"
                checked={cookUnlimited}
                onChange={(e) => setCookUnlimited(e.target.checked)}
              />
              No limit
            </label>
            <input
              type="range"
              min={0}
              max={MAX_COOK_TIME_SLIDER}
              step={5}
              value={maxCookTime}
              disabled={cookUnlimited}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
            />
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
              className={`${styles.card} ${
                expandedRecipeId === recipeId ? styles.expanded : ""
              }`}
            >
              <div className={styles.imageContainer}>
                {customer && token && (
                  <button
                    className={`${styles.heart} ${isHearted ? styles.hearted : ""}`}
                    onClick={() => toggleHeart(recipeId)}
                    type="button"
                    disabled={!heartsLoaded}
                    aria-label={isHearted ? "Unheart recipe" : "Heart recipe"}
                  />
                )}
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
              {expandedRecipeId === recipeId && (
                <div>
                  {stripHtml(recipe.summary) && <p>{stripHtml(recipe.summary)}</p>}
                  {parseJsonArray(recipe.ingredientsJson).length > 0 && (
                    <div>
                      <h4>Ingredients</h4>
                      <ul>
                        {parseJsonArray(recipe.ingredientsJson).map((item, index) => (
                          <li key={`${recipe.id}-ingredient-${index}`}>{stripHtml(item)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {parseJsonArray(recipe.instructionStepsJson).length > 0 ? (
                    <div>
                      <h4>Instructions</h4>
                      <ol>
                        {parseJsonArray(recipe.instructionStepsJson).map((step, index) => (
                          <li key={`${recipe.id}-step-${index}`}>{stripHtml(step)}</li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    stripHtml(recipe.instructions) && (
                      <div>
                        <h4>Instructions</h4>
                        <p>{stripHtml(recipe.instructions)}</p>
                      </div>
                    )
                  )}
                </div>
              )}
              <button

                className={styles.details}
                onClick={() =>
                  setExpandedRecipeId(
                    expandedRecipeId === recipeId ? null : recipeId
                  )
                }
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
