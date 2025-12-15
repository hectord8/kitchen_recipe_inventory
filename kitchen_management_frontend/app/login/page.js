"use client";

import styles from "./login.module.css";
import { useState } from "react";

const API = "http://localhost:8080/Customers/";

export default function Login() {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [passWord, setPassword] = useState("");

  async function login() {
    setError("");
    setCustomer(null);

    try {
      const res = await fetch("http://localhost:8080/Customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, password: passWord })
      });
            
      const data = await res.json().catch(() => null);
      setCustomer(data);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Login</h2>

        {error && <p style={{ color: "black" }}>{error}</p>}

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={passWord}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" onClick={login}>
            Login
          </button>
        </form>

        {customer && (
          <div>
            <p>
              {customer.firstName} — {customer.email}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
