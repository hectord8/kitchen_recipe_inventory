"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";

const API = "http://localhost:8080/Customers/";

export default function CreateAccount() {
  const [customers, setCustomers] = useState([]); 
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");


  async function addCustomer(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email }),
    });

    if (!res.ok) throw new Error(`POST failed: ${res.status}`);


    setFirstName("");
    setLastName("");
    setEmail("");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Customers</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={addCustomer} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <button type="submit">Add customer</button>
        </form>

    
      </main>
    </div>
  );
}
