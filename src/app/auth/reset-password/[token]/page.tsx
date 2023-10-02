"use client";

import React, { FC, useState } from "react";
import LeftSideOfPage from "../../../../components/leftSideOfPage";

interface PageProps {
  params: { token: string };
}

const Page: FC<PageProps> = ({ params }) => { // eslint-disable-line
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const directToSignIn = () => {
    window.location.href = "/auth/login";
  };

  const link = <a href={"/auth/signup"}>Sign Up Now</a>;

  return (
    <div>
      <LeftSideOfPage />
      <h1>Account Recovery</h1>
      <p>
        To ensure your account security, please enter and confirm a new password
        below.
      </p>
      <br />
      <label>Password*</label>
      <textarea
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></textarea>
      <br />
      <label>Confirm Password*</label>
      <textarea
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></textarea>
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          directToSignIn();
        }}
      >
        Back to Sign In
      </button>
      <br />
      <br />
      <p>Don&apos;t have an account? {link}</p>
    </div>
  );
};

export default Page;
