"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../auth";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Nav() {
  const router = useRouter();
  const { customer, setCustomer, loading } = useContext(AuthContext);

  async function logOut() {
    await fetch("http://localhost:8080/Customers/logout", {
      method: "POST",
      credentials: "include",
    });
    setCustomer(null);
    router.push("/");
  }
  return (
    <div className={styles.nav}>
      <Link className="link" href="/">
        <div className={styles.imageContainer} > 
          <Image src="/logo.png" sizes="100vw" fill alt="logo"  style={{objectFit:"contain"}}/>
          
        </div>
      </Link>
      {!loading && customer && (
        <Link className={styles.favs} href="/SavedRecipes">
           Saved For Later
        </Link>
      )}
      
      <div className={styles.customer}>
        {!loading && customer && (
          <span>
            <h3>Hello, {customer.firstName ?? customer}</h3>

            <button className={styles.login} onClick={logOut}>Log out</button>
          </span>
        )}
        {!customer && (
          <span>
            <Link className={styles.login} href="/login">
              Login
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
