import React from "react";
import styles from "./LeftSideOfPage.module.css";

const LeftSideOfPage = () => {
  return (
    <div className={styles.wrapper}>
      <img
        className={styles["BEI-image"]}
        src="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
        alt="BEI Image"
      />
      <div className={styles["text-wrapper"]}>
        <span className={styles.bei}>Brain Exercise Initiative </span>
        <span className={styles.slogan}>
          Helping more seniors remember and thrive
        </span>
      </div>
    </div>
  );
};

export default LeftSideOfPage;
