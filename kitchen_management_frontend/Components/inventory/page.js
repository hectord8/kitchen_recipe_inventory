"use client";
import Image from "next/image";
import styles from "./inventory.module.css";
import { useEffect, useState, useContext, useMemo } from "react";

import { AuthContext } from "../auth";

export default function Inventory() {
  const [items, setItems] = useState([]);

  const [error, setError] = useState("");
  const [id, setId] = useState();
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const { token, customer } = useContext(AuthContext);

  useEffect(() => {
    if (!customer || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/items/${customer.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => {
        setItems(items);
        const ids = items.map((r) => r.id);
        console.log("Extracted ids:", ids);
      });
  }, [customer, token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      console.log("customer id " + customer.id);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerId: customer.id,
            item: item,
            description: description,
            image: image,
            quantity: quantity,
          }),
        }
      );

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
          : payload?.message ||
            (typeof payload === "string" && payload) ||
            "Request failed";
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

  async function increaseQuantity(item_id) {
    console.log("increase id " + item_id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/item/${item_id}/increase`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());

      const newQty = await res.json();
      setItems((prev) =>
        prev.map((it) =>
          it.item_id === item_id ? { ...it, quantity: newQty } : it
        )
      );
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }
  async function decreaseQuantity(item_id, currentQty) {
    if (currentQty === 1) {
      const confirmed = window.confirm(
        "This will remove the item from your inventory. Continue?"
      );

      if (!confirmed) return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/item/${item_id}/decrease`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const newQty = await res.json();
      setItems((prev) => {
        if (newQty === 0) {
          return prev.filter((it) => it.item_id !== item_id);
        }

        return prev.map((it) =>
          it.item_id === item_id ? { ...it, quantity: newQty } : it
        );
      });
    } catch (err) {
      setError(err.message);
    }
  }
async function uploadReceipt(e) {
  e.preventDefault();
  setError("");

  if (!image) {
    setError("No file detected");
    return;
  }

  const formData = new FormData();
  formData.append("file", image);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }


  } catch (err) {
    setError(err?.message || "Upload failed");
  }
}


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
          <form styles={styles.receipt}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            ></input>
            <button onClick={uploadReceipt}>get data from receipt</button>
          </form>
          <p>{error}</p>

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
                        <button onClick={() => increaseQuantity(row.item_id)}>
                          +
                        </button>{" "}
                        {row.quantity}{" "}
                        <button
                          onClick={() =>
                            decreaseQuantity(row.item_id, row.quantity)
                          }
                        >
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
