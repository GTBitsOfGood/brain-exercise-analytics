"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Country, State, City } from "country-state-city";
import { useRouter } from "next/navigation";

import useAuthRedirect from "@src/hooks/useAuthRedirect";
import LeftSideOfPage from "@src/components/LeftSideOfPage/LeftSideOfPage";
import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@src/utils/types";
import Dropdown from "@src/components/Dropdown/Dropdown";

import CHAPTERS from "@src/utils/chapters";
import styles from "./page.module.css";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");

  const [locCountry, setLocCountry] = useState("");
  const [locState, setLocState] = useState("");
  const [locCity, setLocCity] = useState("");
  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  const [chapter, setChapter] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [chapterError, setChapterError] = useState("");
  const [showGeneralError, setShowGeneralError] = useState(false);

  const router = useRouter();
  const authLoading = useAuthRedirect();

  const COUNTRIES = Country.getAllCountries().map((country) => ({
    value: country.name,
    displayValue: `${country.name}`,
  }));
  const countryCode = Country.getAllCountries().filter(
    (country) => country.name === locCountry,
  )[0]?.isoCode;

  const STATES = State.getStatesOfCountry(countryCode).map((state) => ({
    value: state.name,
    displayValue: `${state.name}`,
  }));
  const stateCode = State.getStatesOfCountry(countryCode).filter(
    (state) => state.name === locState,
  )[0]?.isoCode;

  const CITIES = City.getCitiesOfState(countryCode, stateCode).map((city) => ({
    value: city.name,
    displayValue: `${city.name}`,
  }));

  const formatPhoneNumber = (num: string) => {
    const len = num.length;
    if (len === 0) return "";
    if (len <= 3) return num;
    if (len <= 6) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
    return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 10) return;
    setNumber(rawValue);
  };

  const resetErrors = () => {
    setFirstNameError("");
    setLastNameError("");
    setNumberError("");
    setCountryError("");
    setStateError("");
    setCityError("");
    setChapterError("");
    setShowGeneralError(false);
  };

  const redirect = async () => {
    resetErrors();
    if (firstName.trim() === "")
      setFirstNameError("First name can't be blank.");
    if (lastName.trim() === "") setLastNameError("Last name can't be blank.");
    if (number.trim().length !== 10)
      setNumberError("Contact number must be 10 digits.");
    if (locCountry.trim() === "") setCountryError("Please select a country.");
    if (STATES.length !== 0 && locState.trim() === "")
      setStateError("Please select a state.");
    if (CITIES.length !== 0 && locCity.trim() === "")
      setCityError("Please select a city.");
    if (chapter.trim() === "") setChapterError("Please select a chapter.");

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      number.trim().length !== 10 ||
      locCountry.trim() === "" ||
      (STATES.length !== 0 && locState.trim() === "") ||
      (CITIES.length !== 0 && locCity.trim() === "") ||
      chapter.trim() === ""
    )
      return;
    try {
      const name = `${firstName} ${lastName}`;
      await internalRequest({
        url: "/api/volunteer/auth/signup",
        method: HttpMethod.POST,
        body: {
          name,
          phoneNumber: number,
          country: locCountry,
          state: locState,
          city: locCity,
          chapter,
        },
      });
      router.push("/auth/dashboard");
    } catch (error) {
      setShowGeneralError(true);
    }
  };

  if (authLoading) {
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
          <div className={styles.rightContainer}>
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
                  value={locCountry}
                  onChange={(e) => {
                    setLocCountry(e.target.value);
                    setCountryError("");
                    setStateError("");
                    setCityError("");
                  }}
                  showError={countryError !== ""}
                  error={countryError}
                />
              </div>
              {locCountry === "" ? null : (
                <div className={styles.cityStateFields}>
                  <Dropdown
                    required={true}
                    placeholder="Select Your State"
                    options={STATES}
                    value={locState}
                    onChange={(e) => {
                      setLocState(e.target.value);
                      setStateError("");
                      setCityError("");
                    }}
                    showError={stateError !== ""}
                    error={stateError}
                  />
                  <Dropdown
                    required={true}
                    placeholder="Select Your City"
                    options={CITIES}
                    value={locCity}
                    onChange={(e) => {
                      setLocCity(e.target.value);
                      setCityError("");
                    }}
                    showError={cityError !== ""}
                    error={cityError}
                  />
                </div>
              )}
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
                />
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
        </div>
      </div>
    </div>
  );
}
