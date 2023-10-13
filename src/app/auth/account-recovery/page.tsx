"use client";

import React, { useState, useEffect } from "react";
import LeftSideOfPage from "../../../components/LeftSideOfPage/leftSideOfPage";
import InputField from "../../../components/InputField/inputField";
import "./page.css";
import { internalRequest } from "../../../utils/requests";
import { HttpMethod } from "../../../utils/types";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);
  const [validateInputs, setValidateInputs] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");

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
        } else {
          setEmailError(
            "Error: An internal server error has occurred. Please try again later.",
          );
        }
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="screen">
      <div className="split-screen">
        <div className="left">
          <LeftSideOfPage />
        </div>
        <div className="middle-space" />
        <div className="right">
          {!validateInputs && (
            <div>
              <span className="account-recovery">Account Recovery</span>
              <p className="description">
                If you&apos;ve forgotten your password, you&apos;ll need to
                reset your password to proceed.
                <br />
                Please complete the form below to reset your account.
              </p>
              <div className="inputs">
                <div className="first-last-name">
                  <div className="name">
                    <InputField
                      title="First Name"
                      placeholder="Your first name"
                      required={true}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setFirstNameError("");
                      }}
                      showError={firstNameError !== ""}
                      error={firstNameError}
                    />
                  </div>
                  <div className="name">
                    <InputField
                      title="Last Name"
                      placeholder="Your last name"
                      required={true}
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setLastNameError("");
                      }}
                      showError={lastNameError !== ""}
                      error={lastNameError}
                    />
                  </div>
                </div>
                <div className="email">
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
                <div className="continue-button-container">
                  <button
                    className="continue-button"
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
              <span className="email-sent-text">Email has been sent!</span>
              <p className="email-sent-description">
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
