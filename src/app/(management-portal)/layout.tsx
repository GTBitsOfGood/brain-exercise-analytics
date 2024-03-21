"use client";

import { useState } from "react";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import AccountEditModal from "@src/components/AccountEditModal/AccountEditModal";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel onClick={() => setShowModal(!showModal)} />
      </div>
      <div className={styles["rest-of-page"]}>
        {showModal && (
          <div className={styles.accountEditModal}>
            <div
              className={styles.modalBackground}
              onClick={() => setShowModal(false)}
            />
            <div className={styles.accountEditModalContent}>
              <AccountEditModal />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
