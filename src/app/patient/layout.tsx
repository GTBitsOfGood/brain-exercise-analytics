import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import styles from "./layout.module.css";
// import useModal from "../../components/AccountEditModal/useModal";
export default function Layout({ children }: { children: React.ReactNode }) {
  // const { showModal, openModal, closeModal } = useModal();
  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel />
      </div>
      <div className={styles["rest-of-page"]}>{children}</div>
    </div>
  );
}
