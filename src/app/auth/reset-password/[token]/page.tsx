"use client";

import React, { FC, useState, useEffect } from "react";
import LeftSideOfPage from "../../../../components/LeftSideOfPage/leftSideOfPage";
import InputField from "../../../../components/InputField/inputField";
import "./page.css";

interface PageProps {
  params: { token: string };
}

const Page: FC<PageProps> = ({ params }) => { `// eslint-disable-line
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const directToSignIn = () => {
    window.location.href = "/auth/login";
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
            <h1 className="account-recovery">Account Recovery</h1>
            <p className="description">
              To ensure your account security, please enter and confirm a new
              password below.
            </p>
            <InputField
              title="Password"
              type="password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showError={false}
            />
            <InputField
              title="Confirm Password"
              type="password"
              required={true}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showError={false}
            />
            <div className="button-and-text">
              <button
                className="sign-in-button"
                onClick={() => directToSignIn()}
              >
                Back to Sign In
              </button>
              <div className="sign-up">
                <p className="no-account">
                  Don&apos;t have an account?{" "}
                  <a className="link" href={"/auth/signup"}>
                    Sign Up Now
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
