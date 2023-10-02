"use client";

import React, { useState } from "react";
import LeftSideOfPage from "../../../components/LeftSideOfPage/leftSideOfPage";
import "./page.css";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);

  const validateInputs = () => {
    return (
      firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== ""
    );
  };

  const redirect = () => {
    if (validateInputs()) {
      setContinueClicked(true);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 30000);
    } else {
      alert("Please fill in all the required fields.");
    }
  };

  return (
    <div>
      <div className="split-screen">
        <div className="left">
          <LeftSideOfPage />
        </div>
        <div className="right">
          {!continueClicked && (
            <div>
              <h1 className="account-recovery">Account Recovery</h1>
              <p className="description">
                If you&apos;ve forgotten your password, you&apos;ll need to
                reset your password to proceed.
                <br />
                Please complete the form below to reset your account.
              </p>
              <div className="first-last-name">
                <div className="first-name">
                  <label className="input-label">First Name*</label>
                  <input
                    className="first-name-input"
                    placeholder="Your first name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  ></input>
                </div>
                <div className="last-name">
                  <label className="input-label">Last Name*</label>
                  <input
                    className="last-name-input"
                    placeholder="Your last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="email">
                <label className="input-label">Email*</label>
                <input
                  className="email-input"
                  type="email"
                  placeholder="mail@simmmple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <button className="continue-button" onClick={() => redirect()}>
                Continue
              </button>
            </div>
          )}

          {continueClicked && (
            <div>
              <h1 className="email-sent-text">Email has been sent!</h1>
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
