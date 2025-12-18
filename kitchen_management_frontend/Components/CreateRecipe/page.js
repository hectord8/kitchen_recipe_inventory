"use client";

import styles from "./create.module.css";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../auth";

export default function CreateRecipe() {
  const { customer } = useContext(AuthContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("MAIN");
  const [diet, setDiet] = useState("NONE");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [description, setDescription] = useState("");
  const creator = customer.firstName;
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/uploads", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());

    // Expecting backend returns JSON like: { "url": "http://.../files/abc.jpg" }
    const data = await res.json();
    return data.url;
  }
 
  

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // simple validation
      const prep = Number(prepTime);
      const cook = Number(cookTime);
      if (Number.isNaN(prep) || prep < 0) throw new Error("Prep time must be a number ≥ 0");
      if (Number.isNaN(cook) || cook < 0) throw new Error("Cook time must be a number ≥ 0");
      if (!title.trim()) throw new Error("Title is required");

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      

       console.log(creator);

      const res = await fetch("http://localhost:8080/recipes/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          image: imageUrl,      
          category,
          diet,
          prepTime: prep,
          cookTime: cook,
          description: description.trim(),
          creator,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Create Recipe</h2>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className={styles.label}>
            Recipe image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <label className={styles.label}>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="MAIN">Main</option>
              <option value="SNACK">Snack</option>
              <option value="DESSERT">Dessert</option>
              <option value="BREAKFAST">Breakfast</option>
              <option value="DRINK">Drink</option>
            </select>
          </label>

          <label className={styles.label}>
            Diet
            <select value={diet} onChange={(e) => setDiet(e.target.value)}>
              <option value="NONE">None</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
              <option value="GLUTEN_FREE">Gluten-free</option>
              <option value="DAIRY_FREE">Dairy-free</option>
            </select>
          </label>

          <input
            type="number"
            min="0"
            placeholder="Prep time (mins)"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="Cook time (mins)"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />

   

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </main>
    </div>
  );
}
