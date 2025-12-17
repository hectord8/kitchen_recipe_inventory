"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "../auth";
import styles from "./navbar.module.css";
export default function Nav() {
  const { customer, setCustomer, loading } = useContext(AuthContext);
 

  async function logOut() {
    await fetch("http://localhost:8080/Customers/logout", {
        method: "POST",
        credentials: "include",
    });
    setCustomer(null);
    }
  return (
    <div className={styles.nav}>
        
        <Link className="link" href="/">
                Home
        </Link>
        <Link className="link" href="/SavedRecipes">
                saved
        </Link>

         {!customer && (
        <span style={{ marginLeft: "1rem" }}>
           
         
          
        </span>
      )}
     
      <div className={styles.customer}>
        {!loading && customer && (
        <span >
          <h5>Hello, {customer.firstName ?? customer}</h5>
          
          <button onClick={logOut}>Log out</button>
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
