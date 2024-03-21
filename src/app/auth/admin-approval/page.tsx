"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { AdminApprovalStatus, IAuthUserCookie } from "@/common_utils/types";
import styles from "./page.module.css";
import Layout from "../AuthLayout";

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
    <Layout>
      {adminApprovalStatus === AdminApprovalStatus.PENDING && (
        <div className={styles["right-container"]}>
          <span className={styles["password-reset"]}>
            Waiting for Admin Approval!
          </span>
          <p className={styles.description}>
            Your account is being reviewed for approval. You’ll receive an email
            pending your account approval.
          </p>
        </div>
      )}
      {adminApprovalStatus === AdminApprovalStatus.REJECTED && (
        <div className={styles["right-container"]}>
          <span className={styles["password-reset"]}>
            Admin Approval Denied
          </span>
          <p className={styles.description}>
            An admin has denied your volunteer status. Contact your local BEI
            chapter or bei2023@gmail.com for more information.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Page;
