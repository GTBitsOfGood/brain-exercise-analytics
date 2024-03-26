"use client";

import React from "react";
import styles from "./page.module.css";

const Page = () => {
  return (
    <div>
      <p className={styles["password-reset"]}>Error resetting password</p>
      <p className={styles.description}>
        Unfortunately, we ran into an error while verifying your password reset
        token. Your token might have expired or is invalid. Please try again
        later or contact bei2023@gmail.com if this error persists.
      </p>
    </div>
  );
};

export default Page;
