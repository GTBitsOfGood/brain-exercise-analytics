"use client";

import React, { FC, useState, useEffect } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import LeftSideOfPage from "../../../../components/LeftSideOfPage/leftSideOfPage";
import InputField from "../../../../components/InputField/inputField";
import styles from "./page.module.css";
import { internalRequest } from "../../../../utils/requests";
import { HttpMethod } from "../../../../utils/types";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface PageProps {
  params: { token: string };
}

const Page: FC<PageProps> = ({ params }) => {
  // eslint-disable-line
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showGeneralError, setShowGeneralError] = useState(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await internalRequest({
          url: "/api/volunteer/auth/password-reset/validate",
          queryParams: { token: params.token },
          method: HttpMethod.GET,
          authRequired: false,
        });
      } catch (error) {
        window.location.href = "/auth/password-reset/error";
      }
    };
    validateToken();
  }, [params.token]);

  const confirmButtonFunction = async () => {
    setConfirmClicked(true);
    setPasswordError(
      password.length < 8
        ? "Password must have a minimum of 8 characters. Please try again."
        : "",
    );
    if (password.length >= 8 && confirmPassword.length < 8) {
      setConfirmPasswordError("Please confirm your new password.");
    } else if (
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password !== confirmPassword
    ) {
      setConfirmPasswordError("Passwords don't match. Please try again.");
    }
    const inputsValid =
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword;
    if (inputsValid) {
      try {
        await internalRequest({
          url: "/api/volunteer/auth/password-reset/update-password",
          method: HttpMethod.POST,
          body: {
            token: params.token,
            password,
          },
          authRequired: true,
        });

        setPasswordSuccess(true);

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 5000);
      } catch (error) {
        setShowGeneralError(true);
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <div className={styles.screen}>
        <main className={poppins.variable}>
          <div className={styles["split-screen"]}>
            <div className={styles.left}>
              <LeftSideOfPage />
            </div>
            <div className={styles["middle-space"]} />
            <div className={styles.right}>
              <h1 className={styles["password-reset"]}>Password Reset</h1>
              <p className={styles.description}>
                To ensure your account security, please enter and confirm a new
                password below.
              </p>
              <div className={styles["passwords-container"]}>
                <div className={styles.passwords}>
                  <InputField
                    title="Password"
                    type="password"
                    required={true}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setShowGeneralError(false);
                    }}
                    showError={confirmClicked && passwordError.length !== 0}
                    error={passwordError}
                  />
                </div>
                <div className={styles.passwords}>
                  <InputField
                    title="Confirm Password"
                    type="password"
                    required={true}
                    value={confirmPassword}
                    placeholder={"Min. 8 characters"}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError("");
                      setShowGeneralError(false);
                    }}
                    showError={
                      confirmClicked && confirmPasswordError.length !== 0
                    }
                    error={confirmPasswordError}
                  />
                </div>
                {showGeneralError && (
                  <div className={styles["general-error"]}>
                    <FontAwesomeIcon
                      className={styles["error-icon"]}
                      icon={faExclamationCircle}
                      size="sm"
                    />
                    <p className={styles["error-message"]}>
                      Error: An internal server error has occurred. Please try
                      again later.
                    </p>
                  </div>
                )}
                {passwordSuccess && (
                  <div className={styles["success-container"]}>
                    <CheckCircleOutlineIcon className={styles["check-icon"]} />
                    <p className={styles["success-text"]}>
                      Password has been reset successfully.
                    </p>
                  </div>
                )}
                <div className={styles["button-container"]}>
                  <button
                    className={styles["confirm-button"]}
                    onClick={() => confirmButtonFunction()}
                  >
                    {passwordSuccess ? "Go to Sign in" : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
