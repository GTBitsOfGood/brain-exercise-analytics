import React from "react";
import { Poppins } from "next/font/google";
import styles from "./leftSideOfPage.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const LeftSideOfPage = () => {
  return (
    <div className={styles.wrapper}>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}>
          <span className={styles.welcome}>Welcome!</span>
          <span className={styles.bei}>Brain Exercise Initiative</span>
        </div>
      </main>
      <img
        className={styles["BEI-image"]}
        src="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
        alt="BEI Image"
      />
    </div>
  );
};

export default LeftSideOfPage;
