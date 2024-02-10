"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import Cookies from "js-cookie";
import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import styles from "./page.module.css";

enum AdminApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [adminApprovalStatus, setadminApprovalStatus] = useState(
    AdminApprovalStatus.PENDING,
  );

  return (
    <div className={styles.screen}>
      <div className={styles["split-screen"]}>
        <div className={styles.left}>
          <LeftSideOfPage />
        </div>
        <div className={styles["middle-space"]} />
        <div className={styles.right}>
          {adminApprovalStatus === AdminApprovalStatus.PENDING && (
            <div className={styles["right-container"]}>
              <span className={styles["password-reset"]}>
                Waiting for Admin Approval!
              </span>
              <p className={styles.description}>
                Your account is being reviewed for approval. You’ll receive an
                email pending your account approval.
              </p>
            </div>
          )}
          {adminApprovalStatus === AdminApprovalStatus.REJECTED && (
            <div className={styles["right-container"]}>
              <span className={styles["password-reset"]}>
                Admin Approval Denied
              </span>
              <p className={styles.description}>
                An admin has denied your volunteer status. Contact your local
                BEI chapter or bei2023@gmail.com for more information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
