"use client";

import React, { FormEvent, MouseEvent, useState } from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { update } from "@src/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import Modal from "@src/components/Modal/Modal";

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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setShowGeneralError(false);
  };

  const handleSignUp = async (signUp: () => Promise<User | null>) => {
    try {
      setLoading(true);
      const user = await signUp();
      if (!user || !user.email) {
        throw new Error("Error signing up");
      }

      const userMongo = await internalRequest<IUser>({
        url: "/api/volunteer/auth/login",
        method: HttpMethod.GET,
        queryParams: {
          email: user.email,
          keepLogged: true,
        },
      });

      dispatch(update(userMongo));
      router.push("/auth/email-verification");
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
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
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
    <div>
      <title>Sign Up | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0", width: "100%", left: 0 }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <p className={styles.signUpLabel}>Create an account</p>
      <p className={styles.descriptionText}>
        Enter your email and password to sign up!
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

      <form onSubmit={handleEmailSignUp}>
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
            <ErrorIcon className={styles.errorIcon} sx={{ width: "18px" }} />
            <p className={styles.errorMessage}>
              Error: An internal server error has occurred. Please try again
              later.
            </p>
          </div>
        )}
        <div className={styles.continueButtonContainer}>
          <button className={styles.continueButton} onClick={handleEmailSignUp}>
            Continue
          </button>
        </div>
      </form>

      <div className={styles.bottomTextContainer}>
        <div className={styles.alreadyHaveAccountLabel}>
          Already have an Account? <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <a className={styles.signInButton} href="/auth/login">
          Sign in now
        </a>
      </div>
    </div>
  );
}
