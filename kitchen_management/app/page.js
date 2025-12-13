"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect ,  useState} from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getData() {
      const res = await fetch("http://localhost:8080/Customers/");
      const data = await res.json(); 
      setMessage(data.CustomerList);
      console.log("Text grasbbed" , data.CustomerList)
    }

    getData().catch(console.error);
  }, []);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Home</h2>

  

        {Array.isArray(message) && message.map(c => (
          <div key={c.id}>
            {c.firstName} {c.lastName} — {c.email}
          </div>
        ))}
      </main>
    </div>
  );
}
