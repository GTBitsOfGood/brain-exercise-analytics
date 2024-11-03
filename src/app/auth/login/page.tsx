"use client";

import React, { FormEvent, MouseEvent, useState } from "react";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import Modal from "@src/components/Modal/Modal";

import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import googleSignIn from "@src/firebase/google_signin";
import { emailSignIn } from "@src/firebase/email_signin";
import { HttpMethod, IUser } from "@/common_utils/types";

import { update } from "@src/redux/reducers/authReducer";
import { useDispatch } from "react-redux";

import styles from "./page.module.css";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailErrorOutline, setEmailErrorOutline] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const resetErrors = () => {
    setEmailError("");
    setEmailErrorOutline(false);
    setPasswordError("");
    setShowGeneralError(false);
  };

  const handleSignIn = async (signIn: () => Promise<User | null>) => {
    try {
      setLoading(true);
      const user = await signIn();
      if (!user || !user.email) {
        throw new Error("Error signing in");
      }

      const userMongo = await internalRequest<IUser>({
        url: "/api/volunteer/auth/login",
        method: HttpMethod.GET,
        queryParams: {
          email: user.email,
          keepLogged,
        },
      });
      dispatch(update(userMongo));
      router.push("/auth/email-verification");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-not-found":
          case "auth/wrong-password":
            setEmailErrorOutline(true);
            setPasswordError("Invalid credentials. Please try again.");
            break;
          default:
            setShowGeneralError(true);
        }
      } else {
        setShowGeneralError(true);
      }
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (
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

    if (hasError) return;

    handleSignIn(() => emailSignIn(email, password));
  };

  const handleGoogleSignIn = async () => handleSignIn(googleSignIn);

  const toggleKeepMeLoggedIn = () => {
    setKeepLogged((prevState) => !prevState);
  };

  const CheckIcon = keepLogged ? CheckBox : CheckBoxOutlineBlank;

  return (
    <div>
      <title>Log In | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0", width: "100%", left: 0 }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <p className={styles.welcome}>Log in</p>
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
      <form onSubmit={handleEmailSignIn}>
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
              errorOutline={emailErrorOutline}
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

        <div className={styles.checkboxContainer}>
          <div className={styles.checkboxLabel}>
            <CheckIcon
              className={styles.checkboxIcon}
              sx={{ width: "18px" }}
              onClick={toggleKeepMeLoggedIn}
            />
            <p>Keep me logged in</p>
          </div>
          <a className={styles.forgotPassword} href="/auth/password-reset">
            Forgot password?
          </a>
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
      </form>

      <div className={styles.bottomTextContainer}>
        <div className={styles.dontHaveAccountLabel}>
          Don&apos;t have an account? <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <a className={styles.signUpButton} href="/auth/signup">
          Sign up now
        </a>
      </div>
    </div>
  );
}
