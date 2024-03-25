"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@/common_utils/types";
import { getAuth } from "firebase/auth";
import firebaseInit from "@src/firebase/config";
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

  const verifyEmail = useCallback(
    async (email: string | null) => {
      try {
        const res: Response = await internalRequest({
          url: "/api/volunteer/auth/email-verification/create",
          method: HttpMethod.POST,
          body: {
            email,
          },
        });
        if (res.verified === true) {
          router.push("/auth/information");
        } else {
          setLoadingState(State.SUCCESS);
        }
      } catch (err) {
        setLoadingState(State.ERROR);
      }
    },
    [router]
  );

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        verifyEmail(user.email);
      } else {
        deleteCookie("authUser");
        router.push("/auth/login");
      }
    });
  }, [verifyEmail, router]);

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
                Error sending email
              </span>
              <p className={styles.description}>
                Unfortunately, we ran into an error while sending an email
                verification link. Please try again later or contact
                bei2023@gmail.com if this error persists.
              </p>
            </div>
          )}
          {loadingState === State.SUCCESS && (
            <div className={styles["right-container"]}>
              <span className={styles["password-reset"]}>
                Email has been sent!
              </span>
              <p className={styles.description}>
                We&apos;ve sent an email verification link to your inbox. Please
                use the link provided in the email to verify your email and
                proceed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
