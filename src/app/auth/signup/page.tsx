"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import LeftSideOfPage from "@src/components/LeftSideOfPage/leftSideOfPage";
import InputField from "@src/components/InputField/inputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import googleSignIn from "@src/firebase/google_signin";
import { emailSignUp } from "@src/firebase/email_signin";
import styles from "./page.module.css";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showGeneralError, setShowGeneralError] = useState(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const redirect = async () => {
    if (email.trim() === "") setEmailError("Email can't be blank.");
    if (password.trim() === "") setPasswordError("Password can't be blank.");
    if (confirmPassword.trim() === "")
      setConfirmPasswordError("Confirmed Password can't be blank.");

    if (emailError || passwordError || confirmPasswordError) return;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address. Please try again.");
      return;
    }

    if (password.length < 8) {
      setPasswordError(
        "Password must have minimum of 8 characters. Please try again.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match. Please try again.");
      return;
    }

    try {
      await emailSignUp(email, password);
      try {
        await internalRequest({
          url: "/api/volunteer/auth/login",
          method: HttpMethod.GET,
          body: {
            email,
          },
        });
        setTimeout(() => {
          window.location.href = "/auth/redirect";
        }, 30000);
      } catch (error) {
        setShowGeneralError(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as { code?: string };
        switch (firebaseError.code) {
          case "auth/email-already-in-use":
            setEmailError("Email already exists.");
            break;
          default:
            setShowGeneralError(true);
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      window.location.href = "/auth/redirect";
    } catch (error) {
      setShowGeneralError(true);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.screen}>
      <div className={styles.splitScreen}>
        <div className={styles.leftPanel}>
          <LeftSideOfPage />
        </div>
        <div className={styles.middleSpace} />
        <div className={styles.rightPanel}>
          {
            <div>
              <span className={styles.accountRecovery}>Sign Up</span>
              <p className={styles.descriptionText}>
                Enter your email and password to sign up!
              </p>
              <div className={styles.inputFields}>
                <div className={styles.googleButtonContainer}>
                  <button
                    className={styles.googleButton}
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      className={styles.googleGLogo}
                      alt="Google g logo"
                      src="https://c.animaapp.com/2gdwBOyI/img/google--g--logo-1.svg"
                    />
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>Sign up with Google
                  </button>
                </div>
                <div className={styles.separator}>
                  <img
                    className={styles.line}
                    alt="Line"
                    src="https://c.animaapp.com/2gdwBOyI/img/line-17.svg"
                  />
                  <div className={styles.textWrapper4}>or</div>
                  <img
                    className={styles.line}
                    alt="Line"
                    src="https://c.animaapp.com/2gdwBOyI/img/line-18.svg"
                  />
                </div>

                <div className={styles.emailField}>
                  <InputField
                    title="Email"
                    placeholder="mail@simmmple.com"
                    required={true}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    showError={emailError !== ""}
                    error={emailError}
                  />
                </div>
                <div className={styles.passwords}>
                  <InputField
                    title="Password"
                    type="password"
                    required={true}
                    placeholder="Min. 8 characters"
                    value={password}
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
                    placeholder="Min. 8 characters"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError("");
                      setShowGeneralError(false);
                    }}
                    showError={confirmPasswordError.length !== 0}
                    error={confirmPasswordError}
                  />
                </div>

                {showGeneralError && (
                  <div className={styles.generalError}>
                    <FontAwesomeIcon
                      className={styles.errorIcon}
                      icon={faExclamationCircle}
                      size="sm"
                    />
                    <p className={styles.errorMessage}>
                      Error: An internal server error has occurred. Please try
                      again later.
                    </p>
                  </div>
                )}
                <div className={styles.continueButtonContainer}>
                  <button
                    className={styles.continueButton}
                    onClick={() => redirect()}
                  >
                    Continue
                  </button>
                </div>

                <div className={styles.bottomTextContainer}>
                  <div className={styles.checkboxLabel}>
                    Already have an Account?{" "}
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </div>
                  <a className={styles.forgotPassword} href="/auth/login">
                    Sign in now
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
