"use client";

import React, { useState } from "react";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import googleSignIn from "@src/firebase/google_signin";
import { emailSignIn } from "@src/firebase/email_signin";
import styles from "./page.module.css";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [keepLogged, setKeepLogged] = useState(true);
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setShowGeneralError(false);
  };

  const signIn = async () => {
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

    if (hasError) return;

    try {
      await emailSignIn(email, password);
      try {
        await internalRequest({
          url: "/api/volunteer/auth/login",
          method: HttpMethod.GET,
          body: {
            email,
          },
        });

        router.push("/auth/information");
      } catch (error) {
        setShowGeneralError(true);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-not-found":
            setEmailError(
              "Email address not found. Please try again or contact bei2023@gmail.com to retrieve it.",
            );
            break;
          case "auth/wrong-password":
            setPasswordError(
              "Wrong password. Please try again or click Forgot Password to reset it.",
            );
            break;
          default:
            setShowGeneralError(true);
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn();
      if (!user) {
        throw new Error("Error signing in");
      }

      await internalRequest({
        url: "/api/volunteer/auth/login",
        method: HttpMethod.GET,
        body: {
          email: user.email,
        },
      });
      router.push("/auth/information");
    } catch (error) {
      setShowGeneralError(true);
    }
  };

  const toggleKeepMeLoggedIn = () => {
    setKeepLogged((prevState) => !prevState);
  };

  const CheckIcon = keepLogged ? CheckBox : CheckBoxOutlineBlank;

  return (
    <div className={styles.screen}>
      <div className={styles.splitScreen}>
        <div className={styles.leftPanel}>
          <LeftSideOfPage />
        </div>
        <div className={styles.middleSpace} />
        <div className={styles.rightPanel}>
          <div className={styles.rightContainer}>
            <span className={styles.welcome}>Welcome</span>
            <p className={styles.descriptionText}>
              Enter your email and password to sign in!
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
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>Sign in with Google
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
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxLabel}>
                <CheckIcon
                  className={styles.checkboxIcon}
                  sx={{ width: "18px" }}
                  onClick={toggleKeepMeLoggedIn}
                />
                <p>Keep me logged in</p>
              </div>
              <a
                className={styles.forgotPassword}
                href="/auth/account-recovery"
              >
                Forgot password?
              </a>
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
            <div className={styles.signInButtonContainer}>
              <button className={styles.signInButton} onClick={signIn}>
                Sign In
              </button>
            </div>

            <div className={styles.bottomTextContainer}>
              <div className={styles.dontHaveAccountLabel}>
                Don&apos;t have an Account?{" "}
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
              <a className={styles.signUpButton} href="/auth/signup">
                Sign up now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
