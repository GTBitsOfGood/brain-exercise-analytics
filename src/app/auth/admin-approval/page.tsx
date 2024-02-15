"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import styles from "./page.module.css";

enum AdminApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

const Page = () => {
  const router = useRouter();
  const [adminApprovalStatus, setAdminApprovalStatus] = useState(
    AdminApprovalStatus.PENDING,
  );

  useEffect(() => {
    const authUserCookie = getCookie("authUser");
    if (authUserCookie) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const authUser = JSON.parse(authUserCookie);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (authUser && authUser.user && authUser.user.approved) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setAdminApprovalStatus(authUser.user.approved);
      }
    }
  }, [router, adminApprovalStatus]);

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

export default Page;
