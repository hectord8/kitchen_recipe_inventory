"use client";
import styles from "./inventory.module.css";
import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../auth";

export default function Inventory() {
  const [items, setItems] = useState([]);

  const [error, setError] = useState("");
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [itemImage] = useState("");
  // const [imageFile, setImageFile] = useState(null);
  const [quantity, setQuantity] = useState("");
  const { customer } = useContext(AuthContext);

  useEffect(() => {
    if (!customer) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/items/${customer.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => {
        setItems(items);
      });
  }, [customer]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          customerId: customer.id,
          item,
          description,
          image: itemImage,
          quantity,
        }),
      });

      const text = await res.text();
      let payload;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text;
      }

      if (!res.ok) {
        const msg = payload?.errors
          ? Object.entries(payload.errors)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")
          : payload?.message || (typeof payload === "string" && payload) || "Request failed";
        throw new Error(msg);
      }

      const savedItem = payload;

      setItems((prev) => [...prev, savedItem]);
      setItem("");
      setDescription("");
      setQuantity("");
    } catch (err) {
      setError(err?.message || "Request failed");
    }
  }

  async function increaseQuantity(itemId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/item/${itemId}/increase`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(await res.text());

      const newQty = await res.json();
      setItems((prev) =>
        prev.map((it) => (it.item_id === itemId ? { ...it, quantity: newQty } : it))
      );
    } catch (err) {
      setError(err.message);
    }
  }
  async function decreaseQuantity(itemId, currentQty) {
    if (currentQty === 1) {
      const confirmed = window.confirm("This will remove the item from your inventory. Continue?");

      if (!confirmed) return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/item/${itemId}/decrease`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const newQty = await res.json();
      setItems((prev) => {
        if (newQty === 0) {
          return prev.filter((it) => it.item_id !== itemId);
        }

        return prev.map((it) => (it.item_id === itemId ? { ...it, quantity: newQty } : it));
      });
    } catch (err) {
      setError(err.message);
    }
  }
  // async function uploadReceipt(e) {
  //   e.preventDefault();
  //   setError("");
  //
  //   if (!imageFile) {
  //     setError("No file detected");
  //     return;
  //   }
  //
  //   const formData = new FormData();
  //   formData.append("file", imageFile);
  //
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/upload`, {
  //       method: "POST",
  //       credentials: "include",
  //       body: formData,
  //     });
  //
  //     const data = await res.json().catch(() => null);
  //     if (!res.ok) {
  //       throw new Error(data?.message || "Upload failed");
  //     }
  //   } catch (err) {
  //     setError(err?.message || "Upload failed");
  //   }
  // }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.body}>
          <h2>Inventory</h2>
          <form className={styles.create}>
            <input
              value={item}
              placeholder="item name"
              onChange={(e) => setItem(e.target.value)}
            ></input>
            <input
              value={description}
              placeholder="description"
              onChange={(e) => setDescription(e.target.value)}
            ></input>

            <input
              value={quantity}
              placeholder="Amount "
              onChange={(e) => setQuantity(e.target.value)}
            ></input>

            <button onClick={handleSubmit}>create</button>
          </form>
          {/* <form className={styles.receipt}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <button onClick={uploadReceipt}>Get data from receipt</button>
          </form> */}
          {error && <p className="errorText">{error}</p>}

          <div className={styles.items}>
            <table className={styles.table}>
              <tbody>
                <tr className={styles.tableHeaders}>
                  <th>Name</th>
                  <th>description</th>
                  <th>quantity</th>
                </tr>
                {items.map((row) => {
                  return (
                    <tr key={row.item_id} className={styles.card}>
                      <td>{row.item}</td>
                      <td>{row.description}</td>
                      <td>
                        <button onClick={() => increaseQuantity(row.item_id)}>+</button>{" "}
                        {row.quantity}{" "}
                        <button onClick={() => decreaseQuantity(row.item_id, row.quantity)}>
                          -
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
