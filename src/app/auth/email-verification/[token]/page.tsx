import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie"; // Used for client-side cookie handling
import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import styles from "./page.module.css";

enum AdminApprovalStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

const Page = () => {
  const [adminApprovalStatus, setAdminApprovalStatus] = useState(
    AdminApprovalStatus.PENDING,
  );
  const router = useRouter();

  useEffect(() => {
    // Assuming this is client-side code; for server-side, use request.cookies.get("authUser") as shown
    const authUserCookie = Cookies.get("authUser");
    if (authUserCookie) {
      const { user = {} as IUser, keepLogged = false } =
        JSON.parse(authUserCookie);

      // Update the adminApprovalStatus based on the user's approval status
      if (user.approved) {
        setAdminApprovalStatus(user.approved);
      } else {
        // Handle case where user is not found or approval status is not set
        console.error("User not found or approval status is missing");
        // Optionally redirect the user to a login or error page
      }

      // Redirect if approved
      if (user.approved === AdminApprovalStatus.APPROVED) {
        router.push("/patient/search");
      }
    }
  }, [router]);

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
