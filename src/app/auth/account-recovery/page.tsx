"use client";

import React, { useState } from "react";
import LeftSideOfPage from "../../../components/leftSideOfPage";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [continueClicked, setContinueClicked] = useState(false);

  const redirect = () => {
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 30000);
  };

  return (
    <div>
      <LeftSideOfPage />
      {!continueClicked && (
        <div>
          <h1>Account Recovery</h1>
          <p>
            If you&apos;ve forgotten your password, you&apos;ll need to reset
            your password to proceed.
          </p>
          <p>Please complete the form below to reset your account.</p>
          <br />
          {/* flexbox to contain the side-by-side inputs */}
          <div style={{ display: "flex" }}>
            <label>First name*</label>
            <textarea
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></textarea>
            <label>Last name*</label>
            <textarea
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></textarea>
          </div>
          <br />
          <label>Email*</label>
          <textarea
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></textarea>
          <br />
          <br />
          <br />
          <button
            onClick={() => {
              redirect();
              setContinueClicked(true);
            }}
          >
            Continue
          </button>
        </div>
      )}

      {continueClicked && (
        <div>
          <h1>Email has been sent!</h1>
          <p>
            We&apos;ve just sent the password reset link to your email. Please
            use the provided link to reset your password!
          </p>
        </div>
      )}
    </div>
  );
}
