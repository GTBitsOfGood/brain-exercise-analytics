"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { AdminApprovalStatus, IAuthUserCookie } from "@/common_utils/types";
import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import styles from "./page.module.css";

const Page = () => {
  const router = useRouter();
  const [adminApprovalStatus, setAdminApprovalStatus] = useState<
    AdminApprovalStatus | undefined
  >(undefined);

  useEffect(() => {
    const authUserCookie = getCookie("authUser");
    if (authUserCookie) {
      const authUser = (JSON.parse(authUserCookie) as IAuthUserCookie).user;
      setAdminApprovalStatus(authUser.approved);
      if (authUser.approved === AdminApprovalStatus.APPROVED) {
        router.push("/patient/search");
      }
    }
  }, [router]);

  if (!adminApprovalStatus) {
    return null;
  }

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
