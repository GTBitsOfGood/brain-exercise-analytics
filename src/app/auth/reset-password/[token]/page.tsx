"use client";

import React, { FC, useState, useEffect } from "react";
import LeftSideOfPage from "../../../../components/LeftSideOfPage/leftSideOfPage";
import InputField from "../../../../components/InputField/inputField";
import "./page.css";
import { internalRequest } from "../../../../utils/requests";
import { HttpMethod } from "../../../../utils/types";

interface PageProps {
  params: { token: string };
}

const Page: FC<PageProps> = ({ params }) => { // eslint-disable-line
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const directToSignIn = async () => {
    setConfirmClicked(true);
    setPasswordError(
      password.length < 8
        ? "Password must be at least 8 characters. Please try again."
        : "",
    );
    if (password.length >= 8 && confirmPassword.length < 8) {
      setConfirmPasswordError("Please confirm your new password.");
    } else if (
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password !== confirmPassword
    ) {
      setConfirmPasswordError("Passwords don't match. Please try again.");
    }
    const inputsValid =
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      password === confirmPassword;
    if (inputsValid) {
      try {
        // Make the internalRequest
        await internalRequest({
          url: "/api/volunteer/auth/password-reset/update-password",
          method: HttpMethod.POST,
          body: {
            token: params.token,
            password,
          },
          authRequired: true,
        });
      } catch (error) {
        setConfirmPasswordError(
          "Error: An internal server error has occurred. Please try again later.",
        );
      }

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 5000);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <div className="screen">
        <div className="split-screen">
          <div className="left">
            <LeftSideOfPage />
          </div>
          <div className="middle-space" />
          <div className="right">
            <h1 className="password-reset">Password Reset</h1>
            <p className="description">
              To ensure your account security, please enter and confirm a new
              password below.
            </p>
            <div className="passwords-container">
              <div className="passwords">
                <InputField
                  title="Password"
                  type="password"
                  required={true}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  showError={confirmClicked && passwordError.length !== 0}
                  error={
                    "Password must be at least 8 characters. Please try again."
                  }
                />
              </div>
              <div className="passwords">
                <InputField
                  title="Confirm Password"
                  type="password"
                  required={true}
                  value={confirmPassword}
                  placeholder={"Min. 8 characters"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showError={
                    confirmClicked && confirmPasswordError.length !== 0
                  }
                  error={confirmPasswordError}
                />
              </div>
              <div className="button-container">
                <button
                  className="confirm-button"
                  onChange={() => directToSignIn()}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
