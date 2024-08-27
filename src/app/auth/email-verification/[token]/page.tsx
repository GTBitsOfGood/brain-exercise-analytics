"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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
    return (
      <div>
        <title>Email Verification | Brain Exercise Initiative</title>
      </div>
    );
  }

  return (
    <div>
      <title>Email Verification | Brain Exercise Initiative</title>
      {loadingState === State.ERROR && (
        <>
          <p className={styles["password-reset"]}>Error verifying email</p>
          <p className={styles.description}>
            Unfortunately, we ran into an error while verifying your email.
            Please try again later or contact bei2023@gmail.com if this error
            persists.
          </p>
        </>
      )}
      {loadingState === State.SUCCESS && (
        <>
          <p className={styles["password-reset"]}>Email verified!</p>
          <p className={styles.description}>
            Your email has been successfully verified. Redirecting you
            shortly...
          </p>
        </>
      )}
    </div>
  );
}
