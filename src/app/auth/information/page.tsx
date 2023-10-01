"use client";

import React, { useState, useEffect } from "react";
import Button from "@src/components/buttons/Buttons";
import Dropdown from "@src/components/dropdown/Dropdown";
import Saly from "@src/components/saly/Saly";

import { Country } from "country-state-city";
import CHAPTERS from "@src/utils/chapters";

import { useRouter } from "next/navigation";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.module.css";

const COUNTRIES = Country.getAllCountries().map((country) => ({
  value: country.name,
  displayValue: `${country.name}`,
}));

export default function SignUp() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [chapter, setChapter] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [numberError, setNumberError] = useState("");

  const handleSubmit = () => {
    setFirstNameError("");
    setLastNameError("");
    setNumberError("");

    let isValid = true;

    if (firstName.trim() === "") {
      setFirstNameError("Invalid name. Please try again.");
      isValid = false;
    }

    if (lastName.trim() === "") {
      setLastNameError("Invalid name. Please try again.");
      isValid = false;
    }

    const numberPattern = /^\d+$/;
    if (number.trim() === "" || !numberPattern.test(number)) {
      setNumberError("Invalid number. Please try again.");
      isValid = false;
    }

    if (isValid) {
      router.push("/auth/dashboard", { scroll: false });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.signIn}>
      <div className={styles.group}>
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonInstance}
            divClassName={styles.designComponentInstanceNode}
            leftIcon={false}
            rightIcon={false}
            size="xs"
            text="Sign Up"
            variant="solid"
            onClick={handleSubmit}
          />
        </div>
        <div className={styles.frame}>
          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>First Name</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <input
              type="text"
              className={styles.smallInput}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
            />
            {firstNameError && (
              <p className={styles.error}>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size="lg"
                  className={styles.errorIcon}
                />
                {firstNameError}
              </p>
            )}
          </div>

          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Last Name</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <input
              type="text"
              className={styles.smallInput}
              placeholder="Your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {lastNameError && (
              <p className={styles.error}>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size="lg"
                  className={styles.errorIcon}
                />
                {lastNameError}
              </p>
            )}
          </div>

          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Contact Number</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <input
              type="tel"
              className={styles.largeInput}
              placeholder="Your number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            {numberError && (
              <p className={styles.error}>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size="lg"
                  className={styles.errorIcon}
                />
                {numberError}
              </p>
            )}
          </div>

          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Location</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <Dropdown
              options={COUNTRIES}
              className={styles.largeInput}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            ></Dropdown>
          </div>

          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Location</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <Dropdown
              options={CHAPTERS}
              className={styles.largeInput}
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            ></Dropdown>
          </div>
        </div>
        <header className={styles.header}>
          <div className={styles.title}>Information</div>
        </header>
      </div>
      <div className={styles.overlapWrapper}>
        <div className={styles.overlap2}>
          <div className={styles.groupWrapper}>
            <div className={styles.group2}>
              <div className={styles.textWrapper10}>Welcome!</div>
              <div className={styles.textWrapper11}>
                Brain Exercise Initiative
              </div>
            </div>
          </div>
          <Saly
            bei="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
            className={styles.saly14}
          />
        </div>
      </div>
    </div>
  );
}

SignUp.title = "Volunteer Sign Up | Brain Exercise Initiative";
