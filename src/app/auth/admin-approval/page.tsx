"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminApprovalStatus, HttpMethod, IUser } from "@/common_utils/types";
import { internalRequest } from "@src/utils/requests";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import styles from "./page.module.css";

const Page = () => {
  const router = useRouter();
  const [adminApprovalStatus, setAdminApprovalStatus] = useState<
    AdminApprovalStatus | undefined
  >(undefined);

  const { email } = useSelector((rootState: RootState) => rootState.auth);

  useEffect(() => {
    internalRequest<IUser>({
      url: "/api/volunteer",
      method: HttpMethod.GET,
      queryParams: {
        email,
      },
    }).then((user) => {
      setAdminApprovalStatus(user.approved);
      if (user.approved === AdminApprovalStatus.APPROVED) {
        router.push("/patient/search");
      }
    });
  }, [router, email]);

  if (!adminApprovalStatus) {
    return <title>Pending Admin Approval | Brain Exercise Initiative</title>;
  }

  return (
    <div>
      <title>Pending Admin Approval | Brain Exercise Initiative</title>
      {adminApprovalStatus === AdminApprovalStatus.PENDING && (
        <>
          <p className={styles["password-reset"]}>
            Waiting for Admin Approval!
          </p>
          <p className={styles.description}>
            Your account is being reviewed for approval. You’ll receive an email
            pending your account approval.
          </p>
        </>
      )}
      {adminApprovalStatus === AdminApprovalStatus.REJECTED && (
        <>
          <p className={styles["password-reset"]}>Admin Approval Denied</p>
          <p className={styles.description}>
            An admin has denied your volunteer status. Contact your local BEI
            chapter or bei2023@gmail.com for more information.
          </p>
        </>
      )}
    </div>
  );
};

export default Page;
