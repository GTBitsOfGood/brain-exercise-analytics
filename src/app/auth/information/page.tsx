"use client";

import React, { useState, useEffect } from "react";

import { Country } from "country-state-city";
import CHAPTERS from "@src/utils/chapters";
import LeftSideOfPage from "../../../components/LeftSideOfPage/leftSideOfPage";
import "./page.css";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [validateInputs, setValidateInputs] = useState(true);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const redirect = () => {
    const isValid =
      firstName.trim() !== "" && lastName.trim() !== "" && number.trim() !== "";
    setValidateInputs(isValid);
    if (isValid) {
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
          <div>
            <span className="account-recovery">Information</span>
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
                  <label className="input-label">First Name*</label>
                  <input
                    className="name-input"
                    placeholder="Your first name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  ></input>
                </div>
                <div className="name">
                  <label className="input-label">Last Name*</label>
                  <input
                    className="name-input"
                    placeholder="Your last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="email">
                <label className="input-label">Contact Number*</label>
                <input
                  className="email-input"
                  type="tel"
                  placeholder="Your number"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                ></input>
              </div>
            </div>
            <button className="continue-button" onClick={() => redirect()}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
