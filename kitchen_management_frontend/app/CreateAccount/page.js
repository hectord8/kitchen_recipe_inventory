"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = `${process.env.NEXT_PUBLIC_API_URL}/Customers/register`;

const fieldLabels = {
  firstName: "First name",
  password: "Password",
  email: "Email",
};

const formatFieldLabel = (field) =>
  fieldLabels[field] || `${field.charAt(0).toUpperCase()}${field.slice(1)}`;

export default function CreateAccount() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/login"), 3000);
    return () => clearTimeout(timer);
  }, [success, router]);

  async function addCustomer(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, password, email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.errors) {
          setFieldErrors(body.errors);
          return;
        }

        setError("Unable to create account. Please try again.");
        return;
      }

      setSuccess(true);
      setFirstName("");
      setPassword("");
      setEmail("");
    } catch (err) {
      setError("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.successBox} role="status">
            <h2>Account created!</h2>
            <p>You can now log in with your new account.</p>
            <p className={styles.redirect}>
              Redirecting to{" "}
              <Link href="/login">login page</Link>…
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Create account</h2>
        <p className={styles.helper}>
          Create a new account to save recipes and track your inventory.
        </p>

        {(error || Object.keys(fieldErrors).length > 0) && (
          <div className={styles.errorBox} role="alert" aria-live="polite">
            {error && <p>{error}</p>}
            {Object.keys(fieldErrors).length > 0 && (
              <ul className={styles.errorList}>
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field}>
                    {formatFieldLabel(field)}: {message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form className={styles.form} onSubmit={addCustomer}>
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            autoComplete="new-password"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            autoComplete="email"
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>
      </main>
    </div>
  );
}
