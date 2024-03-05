import React, {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  CSSProperties,
  useMemo,
} from "react";
import { SelectChangeEvent } from "@mui/material";
import { Country, State, City } from "country-state-city";
import InputField from "@src/components/InputField/InputField";
import CHAPTERS from "@src/utils/chapters";

import { classes, transformDate, transformPhoneNumber } from "@src/utils/utils";
import { ClearTagIcon } from "@src/app/icons";
import Dropdown, { DropdownProps } from "../../Dropdown/Dropdown";

import styles from "./AdvancedSearch.module.css";
import "react-calendar/dist/Calendar.css";
import CalendarInput from "./CalendarInput";
import Tag from "../Tag/Tag";

interface SelectDropdownProps<T> {
  title: string;
  style?: CSSProperties;
  labelWidth: number;
  answerWidth: number;
  dropdownProps: DropdownProps<T>;
}

function SelectDropdown<T>({
  title,
  style = {},
  labelWidth,
  answerWidth,
  dropdownProps,
}: SelectDropdownProps<T>) {
  return (
    <div className={styles.question_box} style={style}>
      <div
        className={[styles.label, styles["select-dropdown-label"]].join(" ")}
        style={{
          width: labelWidth,
        }}
      >
        {title}
      </div>
      <div
        className={styles["select-dropdown-answer"]}
        style={{
          width: answerWidth,
        }}
      >
        <Dropdown
          {...dropdownProps}
          style={{
            height: "28px",
            width: "100%",
            border: "none",
            borderRadius: 10,
            backgroundColor: "#F4F7FE",
          }}
          sx={{
            "&.MuiOutlinedInput-root": {
              height: "30px",
              "& fieldset": {
                borderRadius: "10px",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

interface UpdateParamProp {
  style?: CSSProperties;
  active: boolean | undefined;
  setCountries: Dispatch<SetStateAction<Set<string>>>;
  setStates: Dispatch<SetStateAction<Set<string>>>;
  setCities: Dispatch<SetStateAction<Set<string>>>;
  setActive: Dispatch<SetStateAction<boolean | undefined>>;
  setDateOfBirths: Dispatch<SetStateAction<Set<string>>>;
  setEmails: Dispatch<SetStateAction<Set<string>>>;
  setDateOfJoins: Dispatch<SetStateAction<Set<string>>>;
  setBeiChapters: Dispatch<SetStateAction<Set<string>>>;
  setSecondaryPhoneNumbers: Dispatch<SetStateAction<Set<string>>>;
  setAdditionalAffiliations: Dispatch<SetStateAction<Set<string>>>;
  setSecondaryNames: Dispatch<SetStateAction<Set<string>>>;
  onSubmit?: () => void;
  className?: string;
  countries: Set<string>;
  states: Set<string>;
  cities: Set<string>;
  dateOfBirths: Set<string>;
  emails: Set<string>;
  additionalAffiliations: Set<string>;
  dateOfJoins: Set<string>;
  beiChapters: Set<string>;
  secondaryPhoneNumbers: Set<string>;
  secondaryNames: Set<string>;
}

export const AdvancedSearch = (props: UpdateParamProp) => {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [email, setEmail] = useState("");
  const [additionalAffiliation, setAdditionalAffiliation] = useState("");
  const [dateOfJoin, setDateOfJoin] = useState<string>("");
  const [beiChapter, setBeiChapter] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [secondaryName, setSecondaryName] = useState("");
  const [activeButton, setActiveButton] = useState<boolean | null>(null);

  const tagsPresent = useMemo(
    () =>
      props.active !== undefined ||
      props.countries.size > 0 ||
      props.states.size > 0 ||
      props.cities.size > 0 ||
      props.dateOfBirths.size > 0 ||
      props.emails.size > 0 ||
      props.additionalAffiliations.size > 0 ||
      props.dateOfJoins.size > 0 ||
      props.beiChapters.size > 0 ||
      props.secondaryPhoneNumbers.size > 0 ||
      props.secondaryNames.size > 0,
    [
      props.active,
      props.countries,
      props.states,
      props.cities,
      props.dateOfBirths,
      props.emails,
      props.additionalAffiliations,
      props.dateOfJoins,
      props.beiChapters,
      props.secondaryPhoneNumbers,
      props.secondaryNames,
    ],
  );
  const tagsChosen = useMemo(
    () =>
      country !== "" ||
      state !== "" ||
      city !== "" ||
      dateOfBirth !== "" ||
      email !== "" ||
      additionalAffiliation !== "" ||
      dateOfJoin !== "" ||
      beiChapter !== "" ||
      secondaryPhoneNumber !== "" ||
      secondaryName !== "",
    [
      country,
      state,
      city,
      dateOfBirth,
      email,
      additionalAffiliation,
      dateOfJoin,
      beiChapter,
      secondaryPhoneNumber,
      secondaryName,
    ],
  );
  const checkAndUpdateList = useCallback(
    <T,>(element: T | null, setUpdater: Dispatch<SetStateAction<Set<T>>>) => {
      setUpdater((set) => {
        if (
          element !== "" &&
          element !== null &&
          element !== undefined &&
          !set.has(element)
        ) {
          const newSet = new Set<T>(set);
          return newSet.add(element);
        }
        return set;
      });
    },
    [],
  );

  const reset = () => {
    setCountry("");
    setState("");
    setCity("");
    setDateOfBirth("");
    setEmail("");
    setAdditionalAffiliation("");
    setDateOfJoin("");
    setSecondaryName("");
    setSecondaryPhoneNumber("");
    setBeiChapter("");
  };

  const setFinal = () => {
    checkAndUpdateList(country, props.setCountries);
    checkAndUpdateList(state, props.setStates);
    checkAndUpdateList(city, props.setCities);
    checkAndUpdateList(dateOfBirth, props.setDateOfBirths);
    checkAndUpdateList(email, props.setEmails);
    checkAndUpdateList(additionalAffiliation, props.setAdditionalAffiliations);
    checkAndUpdateList(dateOfJoin, props.setDateOfJoins);
    checkAndUpdateList(beiChapter, props.setBeiChapters);
    checkAndUpdateList(secondaryPhoneNumber, props.setSecondaryPhoneNumbers);
    checkAndUpdateList(secondaryName, props.setSecondaryNames);
    if (props.onSubmit) {
      props.onSubmit();
    }
  };
  const handleClearAppliedTags = () => {
    if (tagsPresent) {
      props.setActive(undefined);
      setActiveButton(null);
      props.setCountries(new Set());
      props.setStates(new Set());
      props.setCities(new Set());
      props.setBeiChapters(new Set());
      props.setDateOfBirths(new Set());
      props.setEmails(new Set());
      props.setAdditionalAffiliations(new Set());
      props.setDateOfJoins(new Set());
      props.setSecondaryNames(new Set());
      props.setSecondaryPhoneNumbers(new Set());
    }
  };
  const handleClearChosenTags = () => {
    if (tagsChosen) {
      reset();
    }
  };
  const handleAddChosenTags = () => {
    if (tagsChosen) {
      setFinal();
      reset();
    }
  };

  const COUNTRIES = Country.getAllCountries().map((locCountry) => ({
    value: locCountry.name,
    displayValue: `${locCountry.name}`,
  }));
  const countryCode = Country.getAllCountries().filter(
    (locCountry) => country === locCountry.name,
  )[0]?.isoCode;

  const STATES = State.getStatesOfCountry(countryCode).map((locState) => ({
    value: locState.name,
    displayValue: `${locState.name}`,
  }));
  const stateCode = State.getStatesOfCountry(countryCode).filter(
    (locState) => locState.name === state,
  )[0]?.isoCode;

  const CITIES = City.getCitiesOfState(countryCode, stateCode).map(
    (locCity) => ({
      value: locCity.name,
      displayValue: `${locCity.name}`,
    }),
  );

  return (
    <div className={styles.body} style={props.style}>
      <div className={styles.button_row}>
        <div className={styles.active_patient_box}>
          <span className={styles.active_patient_box_label}>
            <div className={styles["toggle-button-group"]}>
              <button
                className={`${styles["toggle-button"]} ${styles["toggle-button-left"]} ${activeButton === null ? styles["active-button"] : ""}`}
                value="undefined"
                onClick={() => {
                  props.setActive(undefined);
                  setActiveButton(null);
                }}
              >
                All Patients
              </button>
              <button
                className={`${styles["toggle-button"]} ${activeButton === true ? styles["active-button"] : ""}`}
                value="true"
                onClick={() => {
                  props.setActive(true);
                  setActiveButton(true);
                }}
              >
                Active Patients
              </button>
              <button
                className={`${styles["toggle-button"]} ${styles["toggle-button-right"]} ${activeButton === false ? styles["active-button"] : ""}`}
                value="false"
                onClick={() => {
                  props.setActive(false);
                  setActiveButton(false);
                }}
              >
                Inactive Patients
              </button>
            </div>
            {tagsPresent
              ? props.countries.size > 0 &&
                Array.from(props.countries).map((currCountry) => (
                  <div key={`country-${currCountry}`} className={styles.tags}>
                    <Tag
                      title="Country"
                      value={currCountry}
                      setList={props.setCountries}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.states.size > 0 &&
                Array.from(props.states).map((currState) => (
                  <div key={`state-${currState}`} className={styles.tags}>
                    <Tag
                      title="State"
                      value={currState}
                      setList={props.setStates}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.cities.size > 0 &&
                Array.from(props.cities).map((currCity) => (
                  <div key={`city-${currCity}`} className={styles.tags}>
                    <Tag
                      title="City"
                      value={currCity}
                      setList={props.setCities}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.beiChapters.size > 0 &&
                Array.from(props.beiChapters).map((currChapter) => (
                  <div
                    key={`bei-chapter-${currChapter}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="BEI Chapter"
                      value={currChapter}
                      setList={props.setBeiChapters}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.dateOfBirths.size > 0 &&
                Array.from(props.dateOfBirths).map((currDOB) => (
                  <div key={`dob-${currDOB}`} className={styles.tags}>
                    <Tag
                      title="Date of Birth"
                      value={currDOB}
                      setList={props.setDateOfBirths}
                      transformData={transformDate}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.emails.size > 0 &&
                Array.from(props.emails).map((currEmail) => (
                  <div key={`email-${currEmail}`} className={styles.tags}>
                    <Tag
                      title="Email"
                      value={currEmail}
                      setList={props.setEmails}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.additionalAffiliations.size > 0 &&
                Array.from(props.additionalAffiliations).map(
                  (currAdditionalAffiliation) => (
                    <div
                      key={`additional-affiliation-${currAdditionalAffiliation}`}
                      className={styles.tags}
                    >
                      <Tag
                        title="Additional Affiliation"
                        value={currAdditionalAffiliation}
                        setList={props.setAdditionalAffiliations}
                      />
                    </div>
                  ),
                )
              : null}
            {tagsPresent
              ? props.dateOfJoins.size > 0 &&
                Array.from(props.dateOfJoins).map((currDateOfJoin) => (
                  <div
                    key={`join-date-${currDateOfJoin}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Date of Join"
                      value={currDateOfJoin}
                      setList={props.setDateOfJoins}
                      transformData={transformDate}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.secondaryNames.size > 0 &&
                Array.from(props.secondaryNames).map((currSecondaryName) => (
                  <div
                    key={`secondary-name-${currSecondaryName}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Secondary Name"
                      value={currSecondaryName}
                      setList={props.setSecondaryNames}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.secondaryPhoneNumbers.size > 0 &&
                Array.from(props.secondaryPhoneNumbers).map(
                  (currSecondaryPhoneNumber) => (
                    <div
                      key={`phone-number-${currSecondaryPhoneNumber}`}
                      className={styles.tags}
                    >
                      <Tag
                        title="Secondary Phone Number"
                        value={currSecondaryPhoneNumber}
                        setList={props.setSecondaryPhoneNumbers}
                        transformData={transformPhoneNumber}
                      />
                    </div>
                  ),
                )
              : null}

            {tagsPresent && (
              <div className={styles.control_buttons}>
                <div
                  className={[
                    styles["general-button"],
                    styles["clear-tag"],
                  ].join(" ")}
                  onClick={handleClearAppliedTags}
                >
                  <ClearTagIcon className={classes(styles.clear_tag_icon)} />
                  <div>Clear applied tags</div>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
      {/* entire flexbox */}
      <div className={styles.all_questions}>
        <div
          className={[styles.question_box, country && styles.hodingValue].join(
            " ",
          )}
        >
          {" "}
          <SelectDropdown
            title="Country"
            dropdownProps={{
              placeholder: "Select country",
              options: COUNTRIES,
              value: country,
              onChange: (e: SelectChangeEvent<unknown>) => {
                setCountry(e.target.value as string);
                setState("");
                setCity("");
              },
              showError: false,
            }}
            labelWidth={80}
            answerWidth={160}
          />
        </div>
        <div
          className={[styles.question_box, state && styles.hodingValue].join(
            " ",
          )}
        >
          {" "}
          <SelectDropdown
            title="State"
            dropdownProps={{
              placeholder: "Select state",
              options: STATES,
              value: state,
              onChange: (e: SelectChangeEvent<unknown>) => {
                setState(e.target.value as string);
                setCity("");
              },
              showError: false,
            }}
            labelWidth={65}
            answerWidth={145}
          />
        </div>

        <div
          className={[styles.question_box, city && styles.hodingValue].join(
            " ",
          )}
        >
          <SelectDropdown
            title="City"
            dropdownProps={{
              placeholder: "Select city",
              options: CITIES,
              value: city,
              onChange: (e: SelectChangeEvent<unknown>) => {
                setCity(e.target.value as string);
              },
              showError: false,
            }}
            labelWidth={53}
            answerWidth={135}
          />
        </div>
        <div
          className={[
            styles.question_box,
            beiChapter && styles.hodingValue,
          ].join(" ")}
        >
          <SelectDropdown
            title="BEI Chapter"
            dropdownProps={{
              placeholder: "Select BEI Chapter",
              options: CHAPTERS,
              value: beiChapter,
              onChange: (e: SelectChangeEvent<unknown>) => {
                setBeiChapter(e.target.value as string);
              },
              showError: false,
            }}
            labelWidth={105}
            answerWidth={180}
          />
        </div>
        <div
          className={[
            styles.question_box,
            dateOfBirth && styles.hodingValue,
          ].join(" ")}
        >
          <div className={styles.label}>Date of Birth</div>
          <CalendarInput value={dateOfBirth} onChange={setDateOfBirth} />
        </div>
        <div
          className={[styles.question_box, email && styles.hodingValue].join(
            " ",
          )}
        >
          <div className={[styles.label, styles.email_label].join(" ")}>
            Email Address
          </div>
          <InputField
            type="email"
            className={[styles.answer, styles.email_answer].join(" ")}
            inputFieldClassName={styles.answerInput}
            value={email}
            placeholder="bei@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div
          className={[
            styles.question_box,
            additionalAffiliation && styles.hodingValue,
          ].join(" ")}
        >
          <div
            className={[styles.label, styles.additional_affil_label].join(" ")}
          >
            Additional Affiliation
          </div>
          <InputField
            className={[styles.answer, styles.affiliation_answer].join(" ")}
            inputFieldClassName={styles.answerInput}
            placeholder="Enter Additional Affiliation"
            onChange={(e) => setAdditionalAffiliation(e.target.value)}
            value={additionalAffiliation}
          />
        </div>
        <div
          className={[
            styles.question_box,
            dateOfJoin && styles.hodingValue,
          ].join(" ")}
        >
          <div className={styles.label}>Date of Join</div>
          <CalendarInput value={dateOfJoin} onChange={setDateOfJoin} />
        </div>

        <div className={styles.secondaryInfo}>
          <div className={styles.secondaryInfoTitle}>
            Secondary Contact Person Information
          </div>
          <div
            className={[
              styles.question_box,
              secondaryName && styles.hodingValue,
            ].join(" ")}
          >
            <div
              className={[styles.label, styles.sec_person_name_label].join(" ")}
            >
              First and Last Name
            </div>
            <InputField
              className={[styles.answer, styles.sec_person_name_answer].join(
                " ",
              )}
              inputFieldClassName={styles.answerInput}
              required={false}
              placeholder="Enter Name"
              value={secondaryName}
              onChange={(e) => setSecondaryName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.secondaryInfo}>
          <div className={styles.secondaryInfoTitle}>
            Secondary Contact Person Information
          </div>
          <div
            className={[
              styles.question_box,
              secondaryPhoneNumber && styles.hodingValue,
            ].join(" ")}
          >
            <div
              className={[styles.label, styles.sec_person_phone_label].join(
                " ",
              )}
            >
              Phone Number
            </div>
            <InputField
              className={[styles.answer, styles.sec_person_phone_answer].join(
                " ",
              )}
              inputFieldClassName={styles.answerInput}
              required={false}
              type="tel"
              placeholder="Enter Phone Number"
              value={secondaryPhoneNumber}
              onChange={(e) => setSecondaryPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.control_buttons}>
        <div
          className={[
            styles["general-button"],
            styles["clear-button"],
            !tagsChosen && styles.disabled,
          ].join(" ")}
          onClick={handleClearChosenTags}
        >
          Clear
        </div>
        <div
          className={[
            styles["general-button"],
            styles["add-button"],
            !tagsChosen && styles.disabled,
          ].join(" ")}
          onClick={handleAddChosenTags}
        >
          Add Tags
        </div>
      </div>
    </div>
  );
};
