"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";

const API = "http://localhost:8080/Customers/register";

export default function CreateAccount() {
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [password,  setPassWord] = useState("");
  const [email, setEmail] = useState("");


  async function addCustomer(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, password, email }),
       credentials: "include"
    });
    console.log(res.ok);
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);


    setFirstName("");
    setPassWord("");
    setEmail("");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Customers</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className={styles.form} onSubmit={addCustomer} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassWord(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <button type="submit">Create customer</button>
        </form>

    
      </main>
    </div>
  );
}
