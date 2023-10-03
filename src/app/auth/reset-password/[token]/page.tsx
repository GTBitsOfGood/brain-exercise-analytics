"use client";

import React, { FC, useState } from "react";
import LeftSideOfPage from "../../../../components/LeftSideOfPage/leftSideOfPage";
import "./page.css";

interface PageProps {
  params: { token: string };
}

const Page: FC<PageProps> = ({ params }) => { // eslint-disable-line
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const directToSignIn = () => {
    window.location.href = "/auth/login";
  };

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
            <label className="input-label">Password*</label>
            <input
              className="input-field"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <br />
            <label className="input-label">Confirm Password*</label>
            <input
              className="input-field"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
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
