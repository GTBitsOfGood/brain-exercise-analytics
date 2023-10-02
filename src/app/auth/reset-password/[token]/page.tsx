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
      <div className="split-screen">
        <div className="left">
          <LeftSideOfPage />
        </div>
        <div className="right">
          <h1 className="account-recovery">Account Recovery</h1>
          <p className="description">
            To ensure your account security, please enter and confirm a new
            password below.
          </p>
          <label className="input-label">Password*</label>
          <input
            className="password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <br />
          <label className="input-label">Confirm Password*</label>
          <input
            className="confirm-password-input"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
          <button className="sign-in-button" onClick={() => directToSignIn()}>
            Back to Sign In
          </button>
          <div className="sign-up">
            <p className="no-account">Don&apos;t have an account?</p>
            <a className="link" href={"/auth/signup"}>
              Sign Up Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
