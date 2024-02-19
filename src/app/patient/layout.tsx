import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel />
      </div>
      <div className={styles["rest-of-page"]}>{children}</div>
    </div>
  );
}
