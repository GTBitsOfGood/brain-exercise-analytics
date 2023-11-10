import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import CHAPTERS from "@src/utils/chapters";
import Switch from "react-switch";
import Dropdown, { IDropdownProps } from "../../Dropdown/Dropdown";
import styles from "./AdvancedSearch.module.css";
import "react-calendar/dist/Calendar.css";
import { CalendarInput } from "./CalendarInput";

interface SelectDropdownProps {
  title: string;
  dropdownprops: IDropdownProps;
  style?: object;
  labelMinWidth: string;
  answerMinWidth: string;
}

function SelectDropdown({
  title,
  dropdownprops,
  style = {},
  labelMinWidth,
  answerMinWidth,
}: SelectDropdownProps) {
  return (
    <div
      className={styles.question_box}
      style={{
        ...style,
      }}
    >
      <div className={styles.label} style={{ minWidth: labelMinWidth }}>
        {title}
      </div>
      <div
        className={styles.select_dropdown_answer}
        style={{ minWidth: answerMinWidth }}
      >
        <Dropdown
          {...dropdownprops}
          inputBoxHeight={"30px"}
          hoverColor="transparent"
          style={{ borderRadius: 0, borderWidth: 0, height: "28px" }}
        />
      </div>
    </div>
  );
}

interface UpdateParamProp {
  country: Set<string>;
  setCountry: (country: Set<string>) => void;
  state: Set<string>;
  setState: (state: Set<string>) => void;
  city: Set<string>;
  setCity: (city: Set<string>) => void;
  active: boolean;
  setActive: (active: boolean) => void;
  dateOfBirth: Set<string>;
  setDateOfBirth: (dob: Set<string>) => void;
  email: Set<string>;
  setEmail: (email: Set<string>) => void;
  joinDate: Set<string>;
  setJoinDate: (joinDate: Set<string>) => void;
  beiChapter: Set<string>;
  setBEIChapter: (chapter: Set<string>) => void;
  secondPhoneNumber: Set<string>;
  setSecondPhoneNumber: (phoneNumber: Set<string>) => void;
  additionalAffiliation: Set<string>;
  setAdditionalAffiliation: (words: Set<string>) => void;
  secondName: Set<string>;
  setSecondName: (name: Set<string>) => void;
}

export const AdvancedSearch = (props: UpdateParamProp) => {
  const [country, setCountry] = useState(""); // values chosen before the aply button
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [active, setActive] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [additionalAffliction, setAdditionalAffliction] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [beiChapter, setBeiChapter] = useState("");
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const [showJoinDateCalendar, setShowJoinDateCalendar] = useState(false);
  const [secondPhoneNumber, setSecondPhoneNumber] = useState("");
  const [secondName, setSecondName] = useState("");

  const reset = () => {
    setCountry("");
    setState("");
    setCity("");
    setActive(true);
    setDateOfBirth("");
    setEmail("");
    setAdditionalAffliction("");
    setJoinDate("");
    setSecondName("");
    setSecondPhoneNumber("");
  };

  const setFinal = () => {
    props.setActive(active);
    if (country !== "" && !props.country.has(country)) {
      props.setCountry(props.country.add(country));
    }
    if (city !== "" && !props.city.has(city)) {
      props.setCity(props.city.add(city));
    }
    if (state !== "" && !props.state.has(state)) {
      props.setState(props.state.add(state));
    }
    if (dateOfBirth !== "" && !props.dateOfBirth.has(dateOfBirth)) {
      props.setDateOfBirth(props.dateOfBirth.add(dateOfBirth));
    }
    if (email !== "" && !props.email.has(email)) {
      props.setEmail(props.email.add(email));
    }
    if (
      additionalAffliction !== "" &&
      !props.additionalAffiliation.has(additionalAffliction)
    ) {
      props.setAdditionalAffiliation(
        props.additionalAffiliation.add(additionalAffliction),
      );
    }
    if (joinDate !== "" && !props.joinDate.has(joinDate)) {
      props.setJoinDate(props.joinDate.add(joinDate));
    }
    if (
      secondPhoneNumber !== "" &&
      !props.secondPhoneNumber.has(secondPhoneNumber)
    ) {
      props.setSecondPhoneNumber(
        props.secondPhoneNumber.add(secondPhoneNumber),
      );
    }
    if (secondName !== "" && !props.secondName.has(secondName)) {
      props.setSecondName(props.secondName.add(secondName));
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
    <div className={styles.body}>
      <div className={styles.button_row}>
        <div className={styles.active_patient_box}>
          <span className={styles.active_patient_box_label}>
            Active Patient
          </span>
          <Switch
            onChange={() => setActive(!active)}
            checked={active}
            onColor="#008AFC"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
        <div className={styles.button_row_button} onClick={reset}>
          Clear
        </div>
        <div
          className={[styles.button_row_button, styles.button_blue].join(" ")}
          onClick={setFinal}
        >
          Apply
        </div>
      </div>
      {/* entire flexbox */}
      <div className={styles.all_questions}>
        <SelectDropdown
          title="Country"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: COUNTRIES,
            selectedValue: country,
            setSelectedValue: setCountry,
            onChange: (e: React.MouseEvent<HTMLLIElement>) => {
              setCountry(e.currentTarget.innerText);
              setState("");
              setCity("");
            },
            showError: false,
          }}
          labelMinWidth="99px"
          answerMinWidth="183px"
        />
        <SelectDropdown
          title="State"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: STATES,
            selectedValue: state,
            setSelectedValue: setState,
            onChange: (e: React.MouseEvent<HTMLLIElement>) => {
              setState(e.currentTarget.innerText);
              setCity("");
            },
            showError: false,
          }}
          labelMinWidth="99px"
          answerMinWidth="183px"
        />
        <SelectDropdown
          title="City"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: CITIES,
            selectedValue: city,
            setSelectedValue: setCity,
            onChange: (e: React.MouseEvent<HTMLLIElement>) => {
              setCity(e.currentTarget.innerText);
            },
            showError: false,
          }}
          labelMinWidth="99px"
          answerMinWidth="183px"
        />
        <SelectDropdown
          title="BEI Chapter"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: CHAPTERS,
            selectedValue: beiChapter,
            setSelectedValue: setBeiChapter,
            onChange: (e: React.MouseEvent<HTMLLIElement>) => {
              setBeiChapter(e.currentTarget.innerText);
            },
            showError: false,
          }}
          labelMinWidth="99px"
          answerMinWidth="258px"
        />
        <div className={styles.question_box}>
          <div className={styles.label}>Date of Birth</div>
          <CalendarInput
            showCalendar={showDOBCalendar}
            calendarValue={dateOfBirth}
            setShowCalendar={setShowDOBCalendar}
            setCalendarValue={setDateOfBirth}
          />
        </div>
        <div className={styles.question_box}>
          <div className={[styles.label, styles.email_label].join(" ")}>
            Email Address
          </div>
          <input
            type="email"
            className={[styles.answer, styles.email_box].join(" ")}
            value={email}
            placeholder="***@****.***"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.question_box}>
          <div
            className={[styles.label, styles.additional_affil_label].join(" ")}
          >
            Additional Affiliation
          </div>
          <input
            className={[styles.answer, styles.affiliation_answer].join(" ")}
            placeholder="input"
            maxLength={140}
            onChange={(e) => setAdditionalAffliction(e.target.value)}
            value={additionalAffliction}
          />
        </div>
        <div className={styles.question_box}>
          <div className={styles.label}>Date of Join</div>
          <CalendarInput
            showCalendar={showJoinDateCalendar}
            calendarValue={joinDate}
            setShowCalendar={setShowJoinDateCalendar}
            setCalendarValue={setJoinDate}
          />
        </div>

        <div className={styles.question_box}>
          <div className={styles.secondaryInfo}>
            <div className={styles.secondInfoTitle}>
              Secondary Contact Person Information
            </div>
            <div className={styles.question_box}>
              <div
                className={[styles.label, styles.sec_person_name_label].join(
                  " ",
                )}
              >
                First and Last Name
              </div>
              <input
                className={[styles.answer, styles.sec_person_name_answer].join(
                  " ",
                )}
                required={false}
                placeholder="Anna White"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.question_box}>
          <div className={styles.secondaryInfo}>
            <div className={styles.secondInfoTitle}>
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
              <input
                className={[styles.answer, styles.sec_person_phone_answer].join(
                  " ",
                )}
                required={false}
                type="tel"
                placeholder="***-***-****"
                value={secondPhoneNumber}
                onChange={(e) => setSecondPhoneNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
