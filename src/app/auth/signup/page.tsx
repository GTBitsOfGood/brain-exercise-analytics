"use client";

import React, { useState } from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import googleSignIn from "@src/firebase/google_signin";
import { emailSignUp } from "@src/firebase/email_signin";
import { IUser, HttpMethod } from "@/common_utils/types";

import styles from "./page.module.css";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setShowGeneralError(false);
  };

  const handleSignUp = async (signUp: () => Promise<User | null>) => {
    try {
      const user = await signUp();
      if (!user) {
        throw new Error("Error signing up");
      }

      await internalRequest<IUser>({
        url: "/api/volunteer/auth/login",
        method: HttpMethod.GET,
        body: {
          email: user.email,
        },
      });

      router.push("/auth/information");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setEmailError("Email already exists.");
            break;
          default:
            setShowGeneralError(true);
        }
      }
    }
  };

  const handleEmailSignUp = async () => {
    resetErrors();

    let hasError = false;
    if (email.trim() === "") {
      setEmailError("Email can't be blank.");
      hasError = true;
    }
    if (password.trim() === "") {
      setPasswordError("Password can't be blank.");
      hasError = true;
    }
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Confirmed Password can't be blank.");
      hasError = true;
    }

    if (hasError) return;

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
      setPasswordError(" ");
      setConfirmPasswordError("Passwords do not match. Please try again.");
      return;
    }

    handleSignUp(() => emailSignUp(email, password));
  };

  const handleGoogleSignIn = async () => handleSignUp(googleSignIn);

  return (
    <div className={styles.screen}>
      <div className={styles.splitScreen}>
        <div className={styles.leftPanel}>
          <LeftSideOfPage />
        </div>
        <div className={styles.middleSpace} />
        <div className={styles.rightPanel}>
          <div className={styles.rightContainer}>
            <span className={styles.signUpLabel}>Sign Up</span>
            <p className={styles.descriptionText}>
              Enter your email and password to sign up!
            </p>

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

            <div className={styles.inputFields}>
              <div className={styles.emailField}>
                <InputField
                  title="Email"
                  placeholder="mail@simple.com"
                  required={true}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setShowGeneralError(false);
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
            </div>

            {showGeneralError && (
              <div className={styles.generalError}>
                <ErrorIcon
                  className={styles.errorIcon}
                  sx={{ width: "18px" }}
                />
                <p className={styles.errorMessage}>
                  Error: An internal server error has occurred. Please try again
                  later.
                </p>
              </div>
            )}
            <div className={styles.continueButtonContainer}>
              <button
                className={styles.continueButton}
                onClick={handleEmailSignUp}
              >
                Continue
              </button>
            </div>

            <div className={styles.bottomTextContainer}>
              <div className={styles.alreadyHaveAccountLabel}>
                Already have an Account? <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
              <a className={styles.signInButton} href="/auth/login">
                Sign in now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
