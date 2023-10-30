import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import Switch from "react-switch";
import { Country, State, City } from "country-state-city";
import CHAPTERS from "@src/utils/chapters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Dropdown, { DropdownProps } from "../Dropdown/Dropdown";
import styles from "./AdvancedSearch.module.css";
import "react-calendar/dist/Calendar.css";

interface SelectDropdownProps {
  title: string;
  dropdownprops: DropdownProps<string>;
  style?: object;
}

const SelectDropdown = ({
  title,
  dropdownprops,
  style = {},
}: SelectDropdownProps) => {
  return (
    <div
      className={styles.question_box}
      style={{
        ...style,
      }}
    >
      <div className={styles.label}>{title}</div>
      <div className={styles.answer}>
        <Dropdown {...dropdownprops} />
      </div>
    </div>
  );
};

interface CalendarInputProp {
  iconRef: Element;
  showCalendar: boolean;
  calendarValue: string;
  setShowCalendar: (showCalendar: boolean) => void;
  setCalendarValue: (value: string) => void;
  calendarX: number;
  calendarY: number;
}

const CalendarInput = ({
  iconRef,
  showCalendar,
  calendarValue = "",
  setShowCalendar,
  setCalendarValue,
  calendarX,
  calendarY,
}: CalendarInputProp) => {
  return (
    <div
      className={styles.answer}
      style={{
        display: "flex",
        backgroundColor: "white",
        verticalAlign: "middle",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      onClick={() => setShowCalendar(!showCalendar)}
      ref={iconRef}
    >
      {calendarValue === "" && "MM/DD/YYYY"}
      {calendarValue !== "" && calendarValue}
      <FontAwesomeIcon
        icon={faCalendarAlt}
        style={{ cursor: "pointer", float: "right" }}
      />
      {showCalendar && (
        <div
          style={{
            position: "fixed",
            top: `${calendarY}px`,
            left: `${calendarX}px`,
            zIndex: 50,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            onChange={(value) => {
              if (!value) {
                return;
              }
              const date = new Date(value.toString());
              setCalendarValue(
                `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
              );
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

interface UpdateParamProp {
  country: string[];
  setCountry: (country: string[]) => void;
  state: string[];
  setState: (state: string[]) => void;
  city: string[];
  setCity: (city: string[]) => void;
  active: boolean;
  setActive: (active: boolean) => void;
  dateOfBirth: string[];
  setDateOfBirth: (dob: string[]) => void;
  email: string[];
  setEmail: (email: string[]) => void;
  joinDate: string[];
  setJoinDate: (joinDate: string[]) => void;
  beiChapter: string[];
  setBEIChapter: (chapter: string[]) => void;
  secondPhoneNumber: string[];
  setSecondPhoneNumber: (phoneNumber: string[]) => void;
  additionalAffiliation: string[];
  setAdditionalAffiliation: (words: string[]) => void;
  secondName: string[];
  setSecondName: (name: string[]) => void;
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
  const [dobCalendarX, setDOBCalendarX] = useState<number>(0);
  const [dobCalendarY, setDOBCalendarY] = useState<number>(0);
  const [joinDateCalendarX, setJoinDateCalendarX] = useState<number>(0);
  const [joinDateCalendarY, setJoinDateCalendarY] = useState<number>(0);
  const dobIconRef = useRef<Element>();
  const joinIconRef = useRef<Element>();

  useEffect(() => {
    const onScroll = () => {
      setShowDOBCalendar(false);
      setShowJoinDateCalendar(false);
    };
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (dobIconRef.current) {
      const dobIconRect: Element = dobIconRef.current;
      const newTop = dobIconRect.getBoundingClientRect().y + 50;
      setDOBCalendarY(newTop);
      const left = dobIconRect.getBoundingClientRect().x;
      setDOBCalendarX(left);
    }

    if (joinIconRef.current) {
      const joinIconRect: Element = joinIconRef.current;
      const joinIconTop = joinIconRect.getBoundingClientRect().y + 50;
      setJoinDateCalendarY(joinIconTop);
      const joinIconLeft = joinIconRect.getBoundingClientRect().x;
      setJoinDateCalendarX(joinIconLeft);
    }
  }, []);

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
    if (country !== "") {
      props.setCountry([...props.country, country]);
    }
    if (city !== "") {
      props.setCity([...props.city, city]);
    }
    if (state !== "") {
      props.setState([...props.state, state]);
    }
    if (dateOfBirth !== "") {
      props.setDateOfBirth([...props.dateOfBirth, dateOfBirth]);
    }
    if (email !== "") {
      props.setEmail([...props.email, email]);
    }
    if (additionalAffliction !== "") {
      props.setAdditionalAffiliation([
        ...props.additionalAffiliation,
        additionalAffliction,
      ]);
    }
    if (joinDate !== "") {
      props.setJoinDate([...props.joinDate, joinDate]);
    }
    if (secondPhoneNumber !== "") {
      props.setSecondPhoneNumber([
        ...props.secondPhoneNumber,
        secondPhoneNumber,
      ]);
    }
    if (secondName !== "") {
      props.setSecondName([...props.secondName, secondName]);
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
    <div
      className={styles.body}
      style={{
        backgroundColor: "#E7EEFF",
        padding: 40,
        borderRadius: 20,
        width: "100%",
      }}
    >
      <div
        className={styles.button_row}
        style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}
      >
        <div>
          Active Patient{" "}
          <Switch
            onChange={() => setActive(!active)}
            checked={active}
            onColor="#008AFC"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
        <div
          style={{
            backgroundColor: "white",
            padding: 7,
            paddingLeft: 17,
            paddingRight: 17,
            cursor: "pointer",
          }}
          onClick={reset}
        >
          Clear
        </div>
        <div
          style={{
            backgroundColor: "#008AFC",
            padding: 7,
            paddingLeft: 17,
            paddingRight: 17,
            color: "white",
            cursor: "pointer",
          }}
          onClick={setFinal}
        >
          Apply
        </div>
      </div>
      <div className={styles.cities_row}>
        <SelectDropdown
          title="Country"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: COUNTRIES,
            value: country,
            onChange: (e) => {
              setCountry(e.target.value);
              setState("");
              setCity("");
            },
            showError: false,
          }}
          style={{ flex: 1 }}
        />
        <SelectDropdown
          title="State"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: STATES,
            value: state,
            onChange: (e) => {
              setState(e.target.value);
              setCity("");
            },
            showError: false,
          }}
          style={{ flex: 1 }}
        />
        <SelectDropdown
          title="City"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: CITIES,
            value: city,
            onChange: (e) => {
              setCity(e.target.value);
            },
            showError: false,
          }}
          style={{ flex: 1 }}
        />
        <SelectDropdown
          title="BEI Chapter"
          dropdownprops={{
            required: false,
            placeholder: "input",
            options: CHAPTERS,
            value: beiChapter,
            onChange: (e) => {
              setBeiChapter(e.target.value);
            },
            showError: false,
          }}
          style={{ flex: 1 }}
        />
      </div>
      <div className={styles.row_two}>
        <div className={styles.question_box}>
          <div className={styles.label}>Date of Birth</div>
          <CalendarInput
            iconRef={dobIconRef}
            showCalendar={showDOBCalendar}
            calendarValue={dateOfBirth}
            setShowCalendar={setShowDOBCalendar}
            setCalendarValue={setDateOfBirth}
            calendarX={dobCalendarX}
            calendarY={dobCalendarY}
          />
        </div>
        <div className={styles.question_box}>
          <div className={styles.label}>Email Address</div>
          <input
            type="email"
            className={styles.answer}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.question_box}>
          <div className={styles.label}>Additional Affiliation</div>
          <input
            className={styles.answer}
            maxLength={140}
            onChange={(e) => setAdditionalAffliction(e.target.value)}
            value={additionalAffliction}
          />
        </div>
      </div>
      <div className={styles.row_three}>
        <div className={styles.question_box}>
          <div className={styles.label}>Date of Join</div>
          <CalendarInput
            iconRef={joinIconRef}
            showCalendar={showJoinDateCalendar}
            calendarValue={joinDate}
            setShowCalendar={setShowJoinDateCalendar}
            setCalendarValue={setJoinDate}
            calendarX={joinDateCalendarX}
            calendarY={joinDateCalendarY}
          />
        </div>

        <div className={styles.question_box}>
          <div className={styles.secondaryInfo}>
            <div className={styles.secondInfoTitle}>
              Secondary Contact Person Information
            </div>
            <div className={styles.question_box}>
              <div className={styles.label} style={{ whiteSpace: "nowrap" }}>
                First and Last Name
              </div>
              <input
                className={styles.answer}
                required={false}
                placeholder="input"
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
              <div className={styles.label}>Phone Number</div>
              <input
                className={styles.answer}
                required={false}
                placeholder="input"
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
