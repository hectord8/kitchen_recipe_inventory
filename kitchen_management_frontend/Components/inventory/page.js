"use client";
import Image from "next/image";
import styles from "./inventory.module.css";
import { useEffect, useState, useContext } from "react";
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

      console.log("res " + res);
      if (!res.ok) throw new Error(await res.text());
      const savedItem = await res.json();

      setItems((prev) => [...prev, savedItem]);
      setItem("");
      setDescription("");
      setQuantity("");

      router.push("/");
    } catch (err) {
      console.log("error " + err);
      setError(err.message || "Failed to create recipe");
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
      
    console.log("quantity returned:", await res.json());

    } catch (err) {
      console.log(err)
      setError(err.message);
    }
  }
  async function decreaseQuantity(item_id) {
    console.log("decrease id " + item_id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/item/${item_id}/decrease`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.body}>
          <form className={styles.create}>
            <h2>Inventory</h2>
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

          <div className={styles.items}>
            <table className={styles.table}>
              <tbody>
                <tr className={styles.tableHeaders}>
                  <th>Name</th>
                  <th>description</th>
                  <th>quantity</th>
                </tr>
                {items.map((row) => {
                  console.log("row id " + row.item_id);
                  return (
                    <tr key={row.item_id} className={styles.card}>
                      <td>{row.item}</td>
                      <td>{row.description}</td>
                      <td>
                        <button onClick={() => increaseQuantity(row.item_id)}>
                          +
                        </button>{" "}
                        {row.quantity}{" "}
                        <button onClick={() => decreaseQuantity(row.item_id)}>
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
