import React, { CSSProperties, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Country, State, City } from "country-state-city";
import InputField from "@src/components/InputField/InputField";

import CHAPTERS from "@src/utils/chapters";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import {
  setActive,
  setCountries,
  setStates,
  setCities,
  setDateOfBirths,
  setEmails,
  setAdditionalAffiliations,
  setDateOfJoins,
  setBeiChapters,
  setSecondaryPhoneNumbers,
  setSecondaryNames,
} from "@src/redux/reducers/patientSearchReducer";
import Dropdown, { DropdownProps } from "../../Dropdown/Dropdown";
import styles from "./AdvancedSearch.module.css";
import "react-calendar/dist/Calendar.css";
import CalendarInput from "./CalendarInput";

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
  onSubmit?: () => void;
}

export const AdvancedSearch = (props: UpdateParamProp) => {
  const dispatch = useDispatch();

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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { active } = useSelector((state: RootState) => state.patientSearch);

  const reset = () => {
    setCountry("");
    setState("");
    setCity("");
    setDateOfBirth("");
    setEmail("");
    setAdditionalAffiliation("");
    setDateOfJoin("");
    setBeiChapter("");
    setSecondaryName("");
    setSecondaryPhoneNumber("");
  };

  const setFinal = () => {
    if (country) dispatch(setCountries(new Set([country])));
    if (state) dispatch(setStates(new Set([state])));
    if (city) dispatch(setCities(new Set([city])));
    if (dateOfBirth) dispatch(setDateOfBirths(new Set([dateOfBirth])));
    if (email) dispatch(setEmails(new Set([email])));
    if (additionalAffiliation)
      dispatch(setAdditionalAffiliations(new Set([additionalAffiliation])));
    if (dateOfJoin) dispatch(setDateOfJoins(new Set([dateOfJoin])));
    if (beiChapter) dispatch(setBeiChapters(new Set([beiChapter])));
    if (secondaryPhoneNumber)
      dispatch(setSecondaryPhoneNumbers(new Set([secondaryPhoneNumber])));
    if (secondaryName) dispatch(setSecondaryNames(new Set([secondaryName])));
    if (props.onSubmit) {
      props.onSubmit();
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
            <ToggleButtonGroup
              color="primary"
              value={String(active)}
              exclusive
              aria-label="Platform"
            >
              <ToggleButton
                value="undefined"
                onClick={() => dispatch(setActive(undefined))}
              >
                All Patients
              </ToggleButton>
              <ToggleButton
                value="true"
                onClick={() => dispatch(setActive(true))}
              >
                Active Patients
              </ToggleButton>
              <ToggleButton
                value="false"
                onClick={() => dispatch(setActive(false))}
              >
                Inactive Patients
              </ToggleButton>
            </ToggleButtonGroup>
          </span>
        </div>
        <div className={styles.button_row_button} onClick={reset}>
          Clear
        </div>
        <div
          className={[styles.button_row_button, styles.button_blue].join(" ")}
          onClick={() => {
            setFinal();
            reset();
          }}
        >
          Apply
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
          <div className={styles.question_box}>
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
    </div>
  );
};
