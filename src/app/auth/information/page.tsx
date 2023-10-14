"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import LeftSideOfPage from "@src/components/LeftSideOfPage/leftSideOfPage";
import InputField from "@src/components/InputField/inputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import Dropdown from "@src/components/Dropdown/dropdown";

import { Country } from "country-state-city";
import CHAPTERS from "@src/utils/chapters";
import styles from "./page.module.css";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [chapter, setChapter] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [chapterError, setChapterError] = useState("");
  const [showGeneralError, setShowGeneralError] = useState(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const COUNTRIES = Country.getAllCountries().map((country) => ({
    value: country.name,
    displayValue: `${country.name}`,
  }));

  const formatPhoneNumber = (num: string) => {
    const len = num.length;
    if (len === 0) return "";
    if (len <= 3) return `(${num})`;
    if (len <= 6) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
    return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setNumber(rawValue);
  };

  const redirect = async () => {
    setFirstNameError(
      firstName.trim() === "" ? "First name can't be blank." : "",
    );
    setLastNameError(lastName.trim() === "" ? "Last name can't be blank." : "");
    setNumberError(
      number.trim().length !== 10 ? "Contact number must be 10 digits." : "",
    );

    setLocationError(location.trim() === "" ? "Please select a location." : "");

    setChapterError(chapter.trim() === "" ? "Please select a chapter." : "");

    if (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      number.trim().length === 10 &&
      location !== "" &&
      chapter !== ""
    ) {
      try {
        await internalRequest({
          url: "/api/volunteer/auth/signup",
          method: HttpMethod.POST,
          body: {
            firstName,
            lastName,
            number,
            location,
            chapter,
          },
        });
        setTimeout(() => {
          window.location.href = "/auth/dashboard";
        }, 30000);
      } catch (error) {
        setShowGeneralError(true);
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.screen}>
      <div className={styles.splitScreen}>
        <div className={styles.leftPanel}>
          <LeftSideOfPage />
        </div>
        <div className={styles.middleSpace} />
        <div className={styles.rightPanel}>
          {
            <div>
              <span className={styles.accountRecovery}>Information</span>
              <p className={styles.descriptionText}></p>
              <div className={styles.inputFields}>
                <div className={styles.firstLastName}>
                  <div className={styles.nameField}>
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
                  <div className={styles.nameField}>
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
                <div className={styles.emailField}>
                  <InputField
                    title="Contact Number"
                    placeholder="Your number"
                    required={true}
                    value={formatPhoneNumber(number) || ""}
                    onChange={(e) => {
                      handlePhoneChange(e);
                      setNumberError("");
                    }}
                    showError={numberError !== ""}
                    error={numberError}
                  />
                </div>
                <div className={styles.locationField}>
                  <Dropdown
                    title="Location"
                    required={true}
                    placeholder="Select Your Country"
                    options={COUNTRIES}
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setLocationError("");
                    }}
                    showError={locationError !== ""}
                    error={locationError}
                  ></Dropdown>
                </div>
                <div className={styles.locationField}>
                  <Dropdown
                    title="Chapter"
                    required={true}
                    placeholder="Select Your Chaper"
                    options={CHAPTERS}
                    value={chapter}
                    onChange={(e) => {
                      setChapter(e.target.value);
                      setChapterError("");
                    }}
                    showError={chapterError !== ""}
                    error={chapterError}
                  ></Dropdown>
                </div>
                <div className={styles.chapterNotFound}>
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className={styles.notFoundIcon}
                    size="sm"
                  />
                  <p className={styles.notFoundMessage}>
                    Don&apos;t see your Chapter? Contact{" "}
                    <strong>example@email.com</strong>
                  </p>
                </div>
                {showGeneralError && (
                  <div className={styles.generalError}>
                    <FontAwesomeIcon
                      className={styles.errorIcon}
                      icon={faExclamationCircle}
                      size="sm"
                    />
                    <p className={styles.errorMessage}>
                      Error: An internal server error has occurred. Please try
                      again later.
                    </p>
                  </div>
                )}
                <div className={styles.continueButtonContainer}>
                  <button
                    className={styles.continueButton}
                    onClick={() => redirect()}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
