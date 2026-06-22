"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../auth";
import styles from "./navbar.module.css";
import Image from "next/image";

export default function Nav() {
  const { customer, setCustomer, loading } = useContext(AuthContext);

  async function logOut() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setCustomer(null);
  }
  return (
    <div className={styles.nav}>
      <Link className={styles.logoLink} href="/">
        <div className={styles.imageContainer}>
          <Image src="/logo.png" sizes="100vw" fill alt="logo" style={{ objectFit: "contain" }} />
        </div>
      </Link>
      {!loading && customer && customer.role === "ADMIN" && (
        <Link className={styles.link} href="/admin">
          Admin
        </Link>
      )}

      <div className={`${styles.customer} ${customer ? styles.signedIn : ""}`}>
        {!loading && customer && (
          <span>
            <h3>Hello, {customer.firstName ?? customer}</h3>

            <button className={styles.login} onClick={logOut}>
              Log out
            </button>
          </span>
        )}
        {!customer && (
          <span>
            <Link className={styles.link} href="/login">
              Login
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
