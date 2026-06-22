import Image from "next/image";
import styles from "./page.module.css";
import ClientRecipes from "@/Components/Recipes/Recipes";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ClientRecipes />
      </main>
    </div>
  );
}
