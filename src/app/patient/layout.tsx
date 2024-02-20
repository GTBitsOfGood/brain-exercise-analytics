"use client";

import { useState } from "react";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import AccountEditModal from "@src/components/AccountEditModal/AccountEditModal";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Remove the following eslint-disable line after implementing the modal popup functionality:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel />
      </div>
      {showModal && (
        <div className={styles.accountEditModal}>
          <div className={styles.accountEditModalContent}>
            <AccountEditModal />
          </div>
        </div>
      )}
      <div className={styles["rest-of-page"]}>{children}</div>
    </div>
  );
}
