"use client";

import styles from "./create.module.css";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../auth";

export default function CreateRecipe() {
  const { customer, token, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("MAIN");
  const [diet, setDiet] = useState("NONE");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const creator = customer?.firstName ?? "";

  function clearError(field) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!category) errors.category = "Category is required";
    const prep = Number(prepTime);
    if (prepTime !== "" && (Number.isNaN(prep) || prep < 0))
      errors.prepTime = "Must be 0 or more";
    const cook = Number(cookTime);
    if (cookTime !== "" && (Number.isNaN(cook) || cook < 0))
      errors.cookTime = "Must be 0 or more";
    if (description.length > 1000)
      errors.description = "Must be 1000 characters or less";
    return errors;
  }

  useEffect(() => {
    if (!authLoading && !customer) {
      router.replace("/");
    }
  }, [authLoading, customer, router]);

  if (authLoading || !customer) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitLoading(true);

    try {
      const prep = Number(prepTime);
      const cook = Number(cookTime);
      let imageUrl = "";

      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          let detail;
          try { detail = JSON.parse(text); } catch { detail = text; }
          throw new Error(detail?.error || detail || "Image upload failed");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: title.trim(),
          image: imageUrl,
          category,
          diet,
          prepTime: Number.isFinite(prep) ? prep : null,
          cookTime: Number.isFinite(cook) ? cook : null,
          description: description.trim(),
          creator,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        let detail;
        try {
          detail = JSON.parse(text);
        } catch {
          throw new Error(text || "Failed to create recipe");
        }

        if (detail.errors) {
          setFieldErrors(detail.errors);
        } else {
          throw new Error(detail.message || "Failed to create recipe");
        }
        return;
      }

      router.push("/");
    } catch (err) {
      setFieldErrors({ _general: err.message || "Failed to create recipe" });
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Create Recipe</h2>

          <label className={styles.label}>
            Title
            <input
              placeholder="e.g. Classic Margherita Pizza"
              value={title}
              onChange={(e) => { setTitle(e.target.value); clearError("title"); }}
              className={fieldErrors.title ? styles.inputError : ""}
            />
            {fieldErrors.title && <span className={styles.fieldError}>{fieldErrors.title}</span>}
          </label>

          <label className={styles.fileLabel}>
            Recipe image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
                clearError("image");
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(reader.result);
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
              className={fieldErrors.image ? styles.inputError : ""}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className={styles.preview} />
            )}
            {fieldErrors.image && <span className={styles.fieldError}>{fieldErrors.image}</span>}
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              Category
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); clearError("category"); }}
                className={fieldErrors.category ? styles.inputError : ""}
              >
                <option value="MAIN">Main</option>
                <option value="SNACK">Snack</option>
                <option value="DESSERT">Dessert</option>
                <option value="BREAKFAST">Breakfast</option>
                <option value="DRINK">Drink</option>
              </select>
              {fieldErrors.category && <span className={styles.fieldError}>{fieldErrors.category}</span>}
            </label>

            <label className={styles.label}>
              Diet
              <select value={diet} onChange={(e) => setDiet(e.target.value)}>
                <option value="NONE">None</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="GLUTEN_FREE">Gluten-free</option>
                <option value="DAIRY_FREE">Dairy-free</option>
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Prep time (mins)
              <input
                type="number"
                min="0"
                placeholder="e.g. 15"
                value={prepTime}
                onChange={(e) => { setPrepTime(e.target.value); clearError("prepTime"); }}
                className={fieldErrors.prepTime ? styles.inputError : ""}
              />
              {fieldErrors.prepTime && <span className={styles.fieldError}>{fieldErrors.prepTime}</span>}
            </label>

            <label className={styles.label}>
              Cook time (mins)
              <input
                type="number"
                min="0"
                placeholder="e.g. 30"
                value={cookTime}
                onChange={(e) => { setCookTime(e.target.value); clearError("cookTime"); }}
                className={fieldErrors.cookTime ? styles.inputError : ""}
              />
              {fieldErrors.cookTime && <span className={styles.fieldError}>{fieldErrors.cookTime}</span>}
            </label>
          </div>

          <label className={styles.label}>
            Description
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => { setDescription(e.target.value); clearError("description"); }}
              rows={5}
              className={fieldErrors.description ? styles.inputError : ""}
            />
            {fieldErrors.description && <span className={styles.fieldError}>{fieldErrors.description}</span>}
          </label>

          {fieldErrors._general && <p className={styles.errorText}>{fieldErrors._general}</p>}

          <button type="submit" disabled={submitLoading}>
            {uploading ? "Uploading image..." : submitLoading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
      </main>
    </div>
  );
}
