"use client";

import React, {
  FormEvent,
  MouseEvent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Country, State, City } from "country-state-city";
import { useRouter } from "next/navigation";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import Modal from "@src/components/Modal/Modal";

import { IUser, HttpMethod, Role, IChapter } from "@/common_utils/types";

import InputField from "@src/components/InputField/InputField";
import { internalRequest } from "@src/utils/requests";
import AuthDropdown from "@src/components/Dropdown/AuthDropdown/AuthDropdown";
import { formatPhoneNumber } from "@src/utils/utils";

import { DropdownOption } from "@src/components/Dropdown/Dropdown";
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
  const [role, setRole] = useState("");
  const [chapter, setChapter] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [chapterError, setChapterError] = useState("");
  const [showGeneralError, setShowGeneralError] = useState(false);

  const [chapters, setChapters] = useState<DropdownOption<string>[]>([]);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const COUNTRIES = Country.getAllCountries()
    .sort((a, b) => {
      if (a.name === "United States") {
        return -1;
      }
      if (b.name === "United States") {
        return 1;
      }
      return 0;
    })
    .map((country) => ({
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

  const ROLES = Object.values(Role)
    .filter((roleOption) => roleOption !== Role.NONPROFIT_PATIENT)
    .map((roleOption) => ({
      value: roleOption,
      displayValue: roleOption,
    }));

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
    setRoleError("");
    setChapterError("");
    setShowGeneralError(false);
  };

  const onSubmit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setLoading(true);
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
    if (role.trim() === "") {
      setRoleError("Please select a role.");
    }
    if (chapter.trim() === "") setChapterError("Please select a chapter.");

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      number.trim().length !== 10 ||
      locCountry.trim() === "" ||
      (STATES.length !== 0 && locState.trim() === "") ||
      (CITIES.length !== 0 && locCity.trim() === "") ||
      role.trim() === "" ||
      chapter.trim() === ""
    ) {
      setLoading(false);
      return;
    }
    try {
      await internalRequest<IUser>({
        url: "/api/volunteer/auth/signup",
        method: HttpMethod.POST,
        body: {
          firstName,
          lastName,
          phoneNumber: number,
          country: locCountry,
          state: locState,
          city: locCity,
          role,
          chapter,
        },
      });
      router.push("/patient/search");
    } catch (error) {
      setShowGeneralError(true);
      setLoading(false);
    }
  };

  const loadChapters = useCallback(() => {
    setLoading(true);
    internalRequest<IChapter[] | null>({
      url: "/api/chapter/get-chapters",
      method: HttpMethod.GET,
      body: {},
    }).then((res) => {
      const chapterDropdown = res
        ? res.map((chapterVal) => ({
            value: chapterVal.name,
            displayValue: chapterVal.name,
          }))
        : [];
      setChapters(chapterDropdown);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadChapters();
  }, [loadChapters]);

  return (
    <div>
      <title>Personal Information | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0", width: "100%", left: 0 }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <p className={styles.accountRecovery}>Personal Information</p>
      <p className={styles.descriptionText}>
        Fill in your information to complete your sign up
      </p>
      <form onSubmit={onSubmit}>
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
              title="Phone Number"
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
            <AuthDropdown
              title="Location"
              required={true}
              placeholder="Select Your Country"
              options={COUNTRIES}
              value={locCountry}
              onChange={(e) => {
                setLocCountry(e.target.value);
                setLocState("");
                setLocCity("");
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
              <AuthDropdown
                required={true}
                placeholder="Select Your State"
                options={STATES}
                value={locState}
                onChange={(e) => {
                  setLocState(e.target.value);
                  setLocCity("");
                  setStateError("");
                  setCityError("");
                }}
                showError={stateError !== ""}
                error={stateError}
              />
              <AuthDropdown
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
          <div className={styles.roleField}>
            <AuthDropdown
              title="Role"
              required={true}
              placeholder="Select your role"
              options={ROLES}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setRoleError("");
              }}
              showError={roleError !== ""}
              error={roleError}
            />
          </div>
          <div className={styles.locationField}>
            <AuthDropdown
              title="Chapter"
              required={true}
              placeholder="Select Your Chaper"
              options={chapters}
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
            <ErrorOutlineIcon
              className={styles.notFoundIcon}
              sx={{ width: "18px" }}
            />
            <p className={styles.notFoundMessage}>
              Don&apos;t see your Chapter? Contact{" "}
              <strong className={styles.notFoundEmail}>
                example@email.com
              </strong>
            </p>
          </div>
          {showGeneralError && (
            <div className={styles.generalError}>
              <ErrorIcon className={styles.errorIcon} sx={{ width: "18px" }} />
              <p className={styles.errorMessage}>
                Error: An internal server error has occurred. Please try again
                later.
              </p>
            </div>
          )}
          <div className={styles.continueButtonContainer}>
            <button className={styles.continueButton} onClick={onSubmit}>
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
