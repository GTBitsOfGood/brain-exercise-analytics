"use client";

import React, { useState, useEffect } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import styles from "./page.module.css";

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

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        const res = await internalRequest({
          url: "/api/volunteer/auth/password-reset/create",
          method: HttpMethod.POST,
          body: {
            email,
            name: `${firstName} ${lastName}`,
          },
          authRequired: false,
        });

        const { token } = res as { token: string };
        console.log(token);

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

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.screen}>
      <div className={styles["split-screen"]}>
        <div className={styles.left}>
          <LeftSideOfPage />
        </div>
        <div className={styles["middle-space"]} />
        <div className={styles.right}>
          {!validateInputs && (
            <div className={styles["right-container"]}>
              <span className={styles["account-recovery"]}>
                Account Recovery
              </span>
              <p className={styles.description}>
                If you&apos;ve forgotten your password, you&apos;ll need to
                reset your password to proceed.
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
              <div className={styles["continue-button-container"]}>
                <button
                  className={styles["continue-button"]}
                  onClick={() => continueButtonFunction()}
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
                We&apos;ve just sent the password reset link to your email.
                Please use the provided link to reset your password!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
