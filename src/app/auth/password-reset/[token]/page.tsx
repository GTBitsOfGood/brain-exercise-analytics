"use client";

import React, { useState } from "react";
import { CheckCircleOutline, Error as ErrorIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@/common_utils/types";
import styles from "./page.module.css";
import Layout from "../../AuthLayout";

interface PageProps {
  params: { token: string };
}

export default function Page({ params }: PageProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();

  const resetErrors = () => {
    setPasswordError("");
    setConfirmPasswordError("");
    setShowGeneralError(false);
  };

  const confirmButtonFunction = async () => {
    resetErrors();
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
          authRequired: false,
        });

        setPasswordSuccess(true);

        setTimeout(() => {
          router.push("/auth/login");
        }, 5000);
      } catch (error) {
        setShowGeneralError(true);
      }
    }
  };

  return (
    <Layout>
      <h1 className={styles["password-reset"]}>Password Reset</h1>
      <p className={styles.description}>
        To ensure your account security, please enter and confirm a new password
        below.
      </p>
      <div className={styles["passwords-container"]}>
        <div className={styles.passwords}>
          <InputField
            title="Password"
            type="password"
            required={true}
            value={password}
            placeholder={"Min. 8 characters"}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
              setShowGeneralError(false);
            }}
            showError={passwordError.length !== 0}
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
            showError={confirmPasswordError.length !== 0}
            error={confirmPasswordError}
          />
        </div>
      </div>
      {showGeneralError && (
        <div className={styles["general-error"]}>
          <ErrorIcon className={styles["error-icon"]} sx={{ width: "18px" }} />
          <p className={styles["error-message"]}>
            Error: An internal server error has occurred. Please try again
            later.
          </p>
        </div>
      )}
      {passwordSuccess && (
        <div className={styles["success-container"]}>
          <CheckCircleOutline className={styles["check-icon"]} />
          <p className={styles["success-text"]}>
            Password has been reset successfully.
          </p>
        </div>
      )}
      <div className={styles["button-container"]}>
        <button
          className={styles["confirm-button"]}
          onClick={() =>
            passwordSuccess
              ? router.push("/auth/login")
              : confirmButtonFunction()
          }
        >
          {passwordSuccess ? "Go to Sign in" : "Confirm"}
        </button>
      </div>
    </Layout>
  );
}
