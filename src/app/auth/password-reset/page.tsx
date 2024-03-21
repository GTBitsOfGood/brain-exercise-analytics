"use client";

import React, { useState } from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@/common_utils/types";
import styles from "./page.module.css";
import Layout from "../AuthLayout";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);
  const [validateInputs, setValidateInputs] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();

  const resetErrors = () => {
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setShowGeneralError(false);
  };

  const continueButtonFunction = async () => {
    resetErrors();
    setContinueClicked(true);
    setEmailError(email.length === 0 ? "Email can't be blank." : "");
    setFirstNameError(
      firstName.length === 0 ? "First name can't be blank." : "",
    );
    setLastNameError(lastName.length === 0 ? "Last name can't be blank." : "");

    const anyInputEmpty =
      firstName.length === 0 || lastName.length === 0 || email.length === 0;
    if (!anyInputEmpty) {
      try {
        await internalRequest({
          url: "/api/volunteer/auth/password-reset/create",
          method: HttpMethod.POST,
          body: {
            email,
            firstName,
            lastName,
          },
          authRequired: false,
        });

        setValidateInputs(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 10000);
      } catch (e) {
        const error = e as Error;
        setValidateInputs(false);
        if (error.message === "User not found.") {
          setEmailError(
            "Email address not found. Please try again or contact bei2023@gmail.com to retrieve it.",
          );
        } else if (error.message === "Name doesn't match to existing value") {
          setFirstNameError("Invalid name. Please try again.");
          setLastNameError(" ");
        } else {
          setShowGeneralError(true);
        }
      }
    }
  };

  return (
    <Layout>
      {!validateInputs && (
        <div className={styles["right-container"]}>
          <span className={styles["password-reset"]}>Account Recovery</span>
          <p className={styles.description}>
            If you&apos;ve forgotten your password, you&apos;ll need to reset
            your password to proceed.
            <br />
            Please complete the form below to reset your account.
          </p>
          <div className={styles.inputs}>
            <div className={styles["first-last-name"]}>
              <div className={styles.name}>
                <InputField
                  title="First Name"
                  placeholder="Your first name"
                  required={true}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameError("");
                    setShowGeneralError(false);
                  }}
                  showError={firstNameError !== ""}
                  error={firstNameError}
                />
              </div>
              <div className={styles.name}>
                <InputField
                  title="Last Name"
                  placeholder="Your last name"
                  required={true}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameError("");
                    setShowGeneralError(false);
                  }}
                  showError={lastNameError !== ""}
                  error={lastNameError}
                />
              </div>
            </div>
            <div className={styles.email}>
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
          </div>
          {showGeneralError && (
            <div className={styles["general-error"]}>
              <ErrorIcon
                className={styles["error-icon"]}
                sx={{ width: "18px" }}
              />
              <p className={styles["error-message"]}>
                Error: An internal server error has occurred. Please try again
                later.
              </p>
            </div>
          )}
          <div className={styles["continue-button-container"]}>
            <button
              className={styles["continue-button"]}
              onClick={continueButtonFunction}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {continueClicked && validateInputs && (
        <div>
          <span className={styles["email-sent-text"]}>
            Email has been sent!
          </span>
          <p className={styles["email-sent-description"]}>
            We&apos;ve just sent the password reset link to your email. Please
            use the provided link to reset your password!
          </p>
        </div>
      )}
    </Layout>
  );
}
