"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import styles from "./page.module.css";

type Response = {
  message: string;
  verified: boolean;
};

interface PageProps {
  params: { token: string };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const verifyEmail = async () => {
    try {
      const res: Response = await internalRequest({
        url: "/api/volunteer/auth/verify-email/update-verified",
        method: HttpMethod.POST,
        body: { token: params.token },
        authRequired: false,
      });
      console.log(res);
      if (res.verified === true) {
        router.push("/auth/information");
      } else {
        setLoading(false);
        setTimeout(() => {
          router.push("/auth/login");
        }, 10000);
      }
    } catch (err) {
      console.log(err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.token) {
      setIsClient(true);
      verifyEmail();
    }
  }, [params.token]);

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
          {error && (
            <div className={styles["right-container"]}>
              <span className={styles["account-recovery"]}>
                Error verifying email
              </span>
              <p className={styles.description}>
                Unfortunately, we ran into an error while verifying your email.
                Please try again later or contact bei2023@gmail.com if this
                error persists.
              </p>
            </div>
          )}
          {!error && (
            <div className={styles["right-container"]}>
              <span className={styles["account-recovery"]}>
                Email verified!
              </span>
              <p className={styles.description}>
                Your email has been successfully verified. Redirecting you
                shortly...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
