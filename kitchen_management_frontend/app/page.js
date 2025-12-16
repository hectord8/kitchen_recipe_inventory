
import Image from "next/image";
import styles from "./page.module.css";
import AllRecipes from "@/Components/Recipes/Recipes";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Home</h2>
       
        <AllRecipes/>
      </main>
    </div>
  );
}
