"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@/common_utils/types";
import firebaseInit from "@src/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import { deleteCookie } from "cookies-next";

import styles from "./page.module.css";

type Response = {
  message: string;
  verified: boolean;
};

enum State {
  LOADING,
  ERROR,
  SUCCESS,
}

firebaseInit();

export default function Page() {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState(State.LOADING);
  const { email } = useSelector((rootState: RootState) => rootState.auth);
  const [response, setResponse] = useState<Response>();

  const verifyEmail = useCallback(async (emailToVerify: string | null) => {
    try {
      const res: Response = await internalRequest({
        url: "/api/volunteer/auth/email-verification/create",
        method: HttpMethod.POST,
        body: {
          email: emailToVerify,
        },
      });
      setResponse(res);
      if (res.verified !== true) {
        setLoadingState(State.SUCCESS);
        deleteCookie("authUser");
      }
    } catch (err) {
      setLoadingState(State.ERROR);
    }
  }, []);

  useEffect(() => {
    if (response?.verified === true) {
      router.push("/auth/information");
    }
  }, [response, router]);

  useEffect(() => {
    verifyEmail(email);
  }, [verifyEmail, email]);

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
          <p className={styles["password-reset"]}>Error sending email</p>
          <p className={styles.description}>
            Unfortunately, we ran into an error while sending an email
            verification link. Please try again later or contact
            bei2023@gmail.com if this error persists.
          </p>
        </>
      )}
      {loadingState === State.SUCCESS && (
        <>
          <p className={styles["password-reset"]}>Email sent!</p>
          <p className={styles.description}>
            We&apos;ve sent an email verification link to your inbox. Please use
            the link provided in the email to verify your email and proceed.
          </p>
        </>
      )}
    </div>
  );
}
