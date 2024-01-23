"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@/common_utils/types";
import styles from "./page.module.css";

enum State {
  LOADING,
  ERROR,
  SUCCESS,
}

interface PageProps {
  params: { token: string };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState(State.LOADING);

  const verifyEmail = useCallback(async () => {
    try {
      await internalRequest({
        url: "/api/volunteer/auth/email-verification/update-verified",
        method: HttpMethod.POST,
        body: { token: params.token },
        authRequired: false,
      });
      setLoadingState(State.SUCCESS);
      setTimeout(() => {
        router.push("/auth/information");
      }, 1000);
    } catch (err) {
      setLoadingState(State.ERROR);
    }
  }, [params.token, router]);

  useEffect(() => {
    if (params.token) {
      verifyEmail();
    }
  }, [params.token, verifyEmail]);

  if (loadingState === State.LOADING) {
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
          {loadingState === State.ERROR && (
            <div className={styles["right-container"]}>
              <span className={styles["password-reset"]}>
                Error verifying email
              </span>
              <p className={styles.description}>
                Unfortunately, we ran into an error while verifying your email.
                Please try again later or contact bei2023@gmail.com if this
                error persists.
              </p>
            </div>
          )}
          {loadingState === State.SUCCESS && (
            <div className={styles["right-container"]}>
              <span className={styles["password-reset"]}>Email verified!</span>
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
