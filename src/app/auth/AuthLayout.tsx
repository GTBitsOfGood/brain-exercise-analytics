import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.screen}>
      <div className={styles.splitScreen}>
        <div className={styles.leftPanel}>
          <LeftSideOfPage />
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.rightContainer}>{children}</div>
        </div>
      </div>
    </div>
  );
}
