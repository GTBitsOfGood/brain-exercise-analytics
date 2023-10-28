"use client";

import React from "react";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import { Poppins } from "next/font/google";
import Search from "@src/components/Search/Search";
import styles from "./page.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel />
      </div>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}>
          <div className={styles["rest-of-page"]}>
            <span className={styles["intro-text"]}>
              To begin viewing analytics, search for a patient here!
            </span>
            <Search />
          </div>
        </div>
      </main>
    </div>
  );
}
