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
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Dropdown, { DropdownProps } from "../../Dropdown/Dropdown";
import { transformDate, transformPhoneNumber } from "@src/utils/utils";

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
      <div className={styles.label} style={{ width: labelWidth }}>
        {title}
      </div>
      <div
        className={styles.select_dropdown_answer}
        style={{ width: answerWidth }}
      >
        <Dropdown
          {...dropdownProps}
          style={{
            height: "28px",
            width: "100%",
            border: "none",
            borderRadius: 0,
          }}
          sx={{
            "&.MuiOutlinedInput-root": {
              height: "30px",
              "& fieldset": {
                borderRadius: "0px",
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
  // hihihihi
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
  const [country, setCountry] = useState(""); // values chosen before the aply button
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [email, setEmail] = useState("");
  const [additionalAffiliation, setAdditionalAffiliation] = useState("");
  const [dateOfJoin, setDateOfJoin] = useState<string>("");
  const [beiChapter, setBeiChapter] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [secondaryName, setSecondaryName] = useState("");
  const [activeButton, setActiveButton] = useState(undefined);

  // hihihih
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
    ]
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
    []
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

  const COUNTRIES = Country.getAllCountries().map((locCountry) => ({
    value: locCountry.name,
    displayValue: `${locCountry.name}`,
  }));
  const countryCode = Country.getAllCountries().filter(
    (locCountry) => country === locCountry.name
  )[0]?.isoCode;

  const STATES = State.getStatesOfCountry(countryCode).map((locState) => ({
    value: locState.name,
    displayValue: `${locState.name}`,
  }));
  const stateCode = State.getStatesOfCountry(countryCode).filter(
    (locState) => locState.name === state
  )[0]?.isoCode;

  const CITIES = City.getCitiesOfState(countryCode, stateCode).map(
    (locCity) => ({
      value: locCity.name,
      displayValue: `${locCity.name}`,
    })
  );

  return (
    <div className={styles.body} style={props.style}>
      <div className={styles.button_row}>
        <div className={styles.active_patient_box}>
          <span className={styles["active_patient_box_label"]}>
            <div className={styles["toggle-button-group"]}>
              <button
                className={`${styles["toggle-button"]} ${styles["toggle-button-left"]} ${activeButton === undefined ? styles["active-button"] : ""}`}
                value="undefined"
                onClick={() => {
                  props.setActive(undefined);
                  setActiveButton(undefined);
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
                Array.from(props.countries).map((country) => (
                  <div key={`country-${country}`} className={styles.tags}>
                    <Tag
                      title="Country"
                      value={country}
                      setList={props.setCountries}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.states.size > 0 &&
                Array.from(props.states).map((state) => (
                  <div key={`state-${state}`} className={styles.tags}>
                    <Tag
                      title="State"
                      value={state}
                      setList={props.setStates}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.cities.size > 0 &&
                Array.from(props.cities).map((city) => (
                  <div key={`city-${city}`} className={styles.tags}>
                    <Tag title="City" value={city} setList={props.setCities} />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.dateOfBirths.size > 0 &&
                Array.from(props.dateOfBirths).map((dob) => (
                  <div key={`dob-${dob}`} className={styles.tags}>
                    <Tag
                      title="Date of Birth"
                      value={dob}
                      setList={props.setDateOfBirths}
                      transformData={transformDate}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.emails.size > 0 &&
                Array.from(props.emails).map((email) => (
                  <div key={`email-${email}`} className={styles.tags}>
                    <Tag
                      title="Email"
                      value={email}
                      setList={props.setEmails}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.dateOfJoins.size > 0 &&
                Array.from(props.dateOfJoins).map((dateOfJoin) => (
                  <div key={`join-date-${dateOfJoin}`} className={styles.tags}>
                    <Tag
                      title="Join Date"
                      value={dateOfJoin}
                      setList={props.setDateOfJoins}
                      transformData={transformDate}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.beiChapters.size > 0 &&
                Array.from(props.beiChapters).map((chapter) => (
                  <div key={`bei-chapter-${chapter}`} className={styles.tags}>
                    <Tag
                      title="BEI Chapter"
                      value={chapter}
                      setList={props.setBeiChapters}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? props.secondaryPhoneNumbers.size > 0 &&
                Array.from(props.secondaryPhoneNumbers).map(
                  (secondaryPhoneNumber) => (
                    <div
                      key={`phone-number-${secondaryPhoneNumber}`}
                      className={styles.tags}
                    >
                      <Tag
                        title="Secondary Phone Number"
                        value={secondaryPhoneNumber}
                        setList={props.setSecondaryPhoneNumbers}
                        transformData={transformPhoneNumber}
                      />
                    </div>
                  )
                )
              : null}
            {tagsPresent
              ? props.additionalAffiliations.size > 0 &&
                Array.from(props.additionalAffiliations).map(
                  (additionalAffiliation) => (
                    <div
                      key={`additional-affiliation-${additionalAffiliation}`}
                      className={styles.tags}
                    >
                      <Tag
                        title="Additional Affiliation"
                        value={additionalAffiliation}
                        setList={props.setAdditionalAffiliations}
                      />
                    </div>
                  )
                )
              : null}
            {tagsPresent
              ? props.secondaryNames.size > 0 &&
                Array.from(props.secondaryNames).map((secondaryName) => (
                  <div
                    key={`secondary-name-${secondaryName}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Secondary Name"
                      value={secondaryName}
                      setList={props.setSecondaryNames}
                    />
                  </div>
                ))
              : null}
            <div
              className={[styles.button_row_button, styles.button_blue].join(
                " "
              )}
              onClick={() => {
                setFinal();
                reset();
              }}
            >
              Apply
            </div>
          </span>
        </div>
      </div>
      {/* entire flexbox */}
      <div className={styles.all_questions}>
        <SelectDropdown
          title="Country"
          dropdownProps={{
            placeholder: "Select Country",
            options: COUNTRIES,
            value: country,
            onChange: (e: SelectChangeEvent<unknown>) => {
              setCountry(e.target.value as string);
              setState("");
              setCity("");
            },
            showError: false,
          }}
          labelWidth={99}
          answerWidth={183}
        />
        <SelectDropdown
          title="State"
          dropdownProps={{
            placeholder: "Select State",
            options: STATES,
            value: state,
            onChange: (e: SelectChangeEvent<unknown>) => {
              setState(e.target.value as string);
              setCity("");
            },
            showError: false,
          }}
          labelWidth={99}
          answerWidth={183}
        />
        <SelectDropdown
          title="City"
          dropdownProps={{
            placeholder: "Select City",
            options: CITIES,
            value: city,
            onChange: (e: SelectChangeEvent<unknown>) => {
              setCity(e.target.value as string);
            },
            showError: false,
          }}
          labelWidth={99}
          answerWidth={183}
        />
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
          labelWidth={120}
          answerWidth={258}
        />
        <div className={styles.question_box}>
          <div className={styles.label}>Date of Birth</div>
          <CalendarInput value={dateOfBirth} onChange={setDateOfBirth} />
        </div>
        <div className={styles.question_box}>
          <div className={[styles.label, styles.email_label].join(" ")}>
            Email Address
          </div>
          <InputField
            type="email"
            className={[styles.answer, styles.email_answer].join(" ")}
            inputFieldClassName={styles.answerInput}
            value={email}
            placeholder="example@domain.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.question_box}>
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
        <div className={styles.question_box}>
          <div className={styles.label}>Date of Join</div>
          <CalendarInput value={dateOfJoin} onChange={setDateOfJoin} />
        </div>

        <div className={styles.secondaryInfo}>
          <div className={styles.secondaryInfoTitle}>
            Secondary Contact Person Information
          </div>
          <div className={styles.question_box}>
            <div
              className={[styles.label, styles.sec_person_name_label].join(" ")}
            >
              First and Last Name
            </div>
            <InputField
              className={[styles.answer, styles.sec_person_name_answer].join(
                " "
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
          <div className={styles.question_box}>
            <div
              className={[styles.label, styles.sec_person_phone_label].join(
                " "
              )}
            >
              Phone Number
            </div>
            <InputField
              className={[styles.answer, styles.sec_person_phone_answer].join(
                " "
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
    </div>
  );
};
