"use client";

import React, { useEffect, useState } from "react";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";

import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import googleSignIn from "@src/firebase/google_signin";
import { emailSignIn } from "@src/firebase/email_signin";
import { HttpMethod, IUser } from "@/common_utils/types";

import { setCookie } from "cookies-next";
import { update } from "@src/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import styles from "./page.module.css";
import Layout from "../AuthLayout";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setShowGeneralError(false);
  };

  const handleSignIn = async (signIn: () => Promise<User | null>) => {
    try {
      const user = await signIn();
      if (!user || !user.email) {
        throw new Error("Error signing in");
      }

      const userMongo = await internalRequest<IUser>({
        url: "/api/volunteer/auth/login",
        method: HttpMethod.GET,
        queryParams: {
          email: user.email,
        },
      });
      setCookie(
        "authUser",
        { user: userMongo, keepLogged },
        keepLogged ? { maxAge: 7 * 24 * 60 * 60 } : undefined,
      );
      dispatch(update(userMongo));

      router.push("/auth/email-verification");
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
      } else {
        setShowGeneralError(true);
      }
    }
  };

  const handleEmailSignIn = async () => {
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

    handleSignIn(() => emailSignIn(email, password));
  };

  const handleGoogleSignIn = async () => handleSignIn(googleSignIn);

  const toggleKeepMeLoggedIn = () => {
    setKeepLogged((prevState) => !prevState);
  };

  const CheckIcon = keepLogged ? CheckBox : CheckBoxOutlineBlank;

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Enter") {
        handleEmailSignIn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [email, password]);

  return (
    <Layout>
      <span className={styles.welcome}>Log in</span>
      <p className={styles.descriptionText}>
        Enter your email and password to sign in!
      </p>
      <div className={styles.googleButtonContainer}>
        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          <img
            className={styles.googleGLogo}
            alt="Google g logo"
            src="https://c.animaapp.com/2gdwBOyI/img/google--g--logo-1.svg"
          />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>Continue with Google
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
            placeholder="example@email.com"
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
            placeholder="Minimum 8 Characters"
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

      {showGeneralError && (
        <div className={styles.generalError}>
          <ErrorIcon className={styles.errorIcon} sx={{ width: "18px" }} />
          <p className={styles.errorMessage}>
            Error: An internal server error has occurred. Please try again
            later.
          </p>
        </div>
      )}
      <div className={styles.signInButtonContainer}>
        <button className={styles.signInButton} onClick={handleEmailSignIn}>
          Continue
        </button>
      </div>

      <div className={styles.bottomTextContainer}>
        <div className={styles.dontHaveAccountLabel}>
          Don&apos;t have an account? <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <a className={styles.signUpButton} href="/auth/signup">
          Sign up now
        </a>
      </div>
    </Layout>
  );
}
