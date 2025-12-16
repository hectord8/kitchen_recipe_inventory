"use client";

import Link from "next/link";
import { useContext, useState} from "react";
import { AuthContext } from "./auth";

export default function Nav() {
    const { customer , setCustomer, loading } = useContext(AuthContext);
    const { loggedIn, loggedOut } = useState(true);

   
async function logOut() {

    setCustomer(null);

    try {
      const res = await fetch("http://localhost:8080/Customers/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, password: passWord }),
        credentials: "include"
      });
            
      const data = await res.json().catch(() => null);
      setCustomer(data);
    } catch (err) {
     
    }
  }
  return (
    <nav>
      <Link className="link" href="/">Home</Link>
      <Link className="link" href="/login">Login</Link>
      <Link className="link" href="/CreateAccount">Create</Link>

      {!loading && customer && (
        <span style={{ marginLeft: "1rem" }}>
          Hello, {customer.firstName ?? customer}
          <button onClick={logOut}>Log out</button>
        </span>
      )}

 
    </nav>
  );
}
