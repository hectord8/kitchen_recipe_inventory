"use client";
import Link from "next/link";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/Components/auth";

export default function Login() {
  const router = useRouter();
  const { setCustomer } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function login(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
        credentials: "include",
      });

      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }

      const data = await res.json().catch(() => null);
      if (!data) throw new Error("No customer returned from server");

      setCustomer(data.customer);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Unable to log in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <h2>Login</h2>
        <p className={styles.helper}>Sign in to access your inventory and saved recipes.</p>

        {error && (
          <p className={styles.errorBox} role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <p className={styles.hint}>
          Demo: Email <strong>Test@test.com</strong> &mdash; Password <strong>12345678</strong>
        </p>

        <form className={styles.form} onSubmit={login}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          If you don&apos;t have an account
          <Link className={styles.createaccount} href="/CreateAccount">
            - Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
