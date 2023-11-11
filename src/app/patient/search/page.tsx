import Search from "@src/components/Search/Search";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles["search-container"]}>
      <p className={styles["intro-text"]}>
        To begin viewing analytics, search for a patient here!
      </p>
      <div className={styles["search-wrapper"]}>
        <Search />
      </div>
    </div>
  );
}
