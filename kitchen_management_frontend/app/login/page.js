"use client";
import Link from "next/link";
import styles from "./login.module.css";
import { useState , useContext } from "react";
import { AuthContext } from "@/Components/auth";

import { redirect, RedirectType } from 'next/navigation'



export default function Login() {
  const [customer] = useState(null);
  const { setCustomer } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");

  async function login() {
    setError("");
    setCustomer(null);

    try {
      const res = await fetch("http://localhost:8080/Customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: passWord }),
        credentials: "include"
      });
            
      const data = await res.json().catch(() => null);
      setCustomer(data);
      redirect("/" , RedirectType.push);
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <p>If you dont have an account  
          <Link  className={styles.createaccount} href="/CreateAccount">
               - Create one
            </Link> 
        </p>
      </main>
    </div>
  );
}
