"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import { getAuth } from "firebase/auth";
import styles from "./page.module.css";

type Response = {
  message: string;
  verified: boolean;
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [render, setRender] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  console.log("The current user is", user?.email);
  const [isClient, setIsClient] = useState(false);

  const verifyEmail = async () => {
    try {
      const res: Response = await internalRequest({
        url: "/api/volunteer/auth/verify-email/create",
        method: HttpMethod.POST,
        body: {
          email: user?.email,
        },
        authRequired: false,
      });
      console.log(res.verified);
      if (res.verified === true) {
        router.push("/patient/dashboard");
      } else {
        setLoading(false);
        setError(true);
        setRender(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 10000);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setRender(true);
    }
  };

  useEffect(() => {
    setIsClient(true);
    verifyEmail();
  }, [user]);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return <div></div>;
  }

  return (
    <div className={styles.screen}>
      <div className={styles["split-screen"]}>
        <div className={styles.left}>
          <LeftSideOfPage />
        </div>
        <div className={styles["middle-space"]} />
        <div className={styles.right}>
          {render && !error && (
            <div className={styles["right-container"]}>
              <span className={styles["account-recovery"]}>
                Error sending email
              </span>
              <p className={styles.description}>
                Unfortunately, we ran into an error while sending an email
                verification link. Please try again later or contact
                bei2023@gmail.com if this error persists.
              </p>
            </div>
          )}
          {render && error && (
            <div className={styles["right-container"]}>
              <span className={styles["account-recovery"]}>
                Email has been sent!
              </span>
              <p className={styles.description}>
                We&apos;ve sent an email verification link to your inbox. Please
                use the provided link to proceed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
