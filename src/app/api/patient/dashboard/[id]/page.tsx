"use client";

import React from "react";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import styles from "./page.module.css";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel />
      </div>
      <div className={styles["rest-of-page"]} />
    </div>
  );
}
