"use client";

import React, { useState, useEffect } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import LeftSideOfPage from "../../../components/LeftSideOfPage/leftSideOfPage";
import InputField from "../../../components/InputField/inputField";
import styles from "./page.module.css";
import { internalRequest } from "../../../utils/requests";
import { HttpMethod } from "../../../utils/types";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const continueButtonFunction = async () => {
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
            name: `${firstName} ${lastName}`,
          },
          authRequired: false,
        });

        setValidateInputs(true);
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 30000);
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
      <main className={poppins.variable}>
        <div className={styles["split-screen"]}>
          <div className={styles.left}>
            <LeftSideOfPage />
          </div>
          <div className={styles["middle-space"]} />
          <div className={styles.right}>
            {!validateInputs && (
              <div>
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
                      placeholder="mail@simmmple.com"
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
      </main>
    </div>
  );
}
