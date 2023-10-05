"use client";

import React, { useState, useEffect } from "react";
import LeftSideOfPage from "../../../components/LeftSideOfPage/leftSideOfPage";
import InputField from "../../../components/InputField/inputField";
import "./page.css";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);
  const [validateInputs, setValidateInputs] = useState(true);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const redirect = () => {
    const isValid =
      firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";
    setValidateInputs(isValid);
    if (isValid) {
      setContinueClicked(true);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 30000);
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
          {!continueClicked && (
            <div>
              <span className="account-recovery">Account Recovery</span>
              {validateInputs && (
                <p className="description">
                  If you&apos;ve forgotten your password, you&apos;ll need to
                  reset your password to proceed.
                  <br />
                  Please complete the form below to reset your account.
                </p>
              )}
              {!validateInputs && (
                <p className="invalid-input">
                  We&apos;re sorry, the information you&apos;ve entered is not
                  valid.
                  <br />
                  Please try again.
                </p>
              )}
              <div className="inputs">
                <div className="first-last-name">
                  <div className="name">
                    <InputField
                      title="First Name"
                      placeholder="Your first name"
                      required={true}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      showError={!validateInputs}
                      error="Invalid name. Please try again."
                    />
                  </div>
                  <div className="name">
                    <InputField
                      title="Last Name"
                      placeholder="Your last name"
                      required={true}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      showError={!validateInputs}
                      error="Invalid name. Please try again."
                    />
                  </div>
                </div>
                <div className="email">
                  <InputField
                    title="Email"
                    placeholder="mail@simmmple.com"
                    required={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    showError={!validateInputs}
                    error="Email can't be empty. Please try again."
                  />
                </div>
              </div>
              <button className="continue-button" onClick={() => redirect()}>
                Continue
              </button>
            </div>
          )}

          {continueClicked && (
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
