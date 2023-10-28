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
      style={{
        display: "flex",
        gap: 20,
        // paddingRight: 10,
        ...style,
      }}
    >
      <div className={styles.label}>{title}</div>
      <div style={{ flex: 1 }}>
        <Dropdown {...dropdownprops} />
      </div>
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
  const [dobCalendarX, setDOBCalendarX] = useState<number>();
  const [dobCalendarY, setDOBCalendarY] = useState<number>();
  const [joinDateCalendarX, setJoinDateCalendarX] = useState("");
  const [joinDateCalendarY, setJoinDateCalendarY] = useState("");
  const dobIconRef = useRef();
  const joinIconRef = useRef();

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
      const newTop = dobIconRect.getBoundingClientRect().y;
      setDOBCalendarY(newTop);
      const left = dobIconRect.getBoundingClientRect().x;
      setDOBCalendarX(left);
    }

    if (joinIconRef.current) {
      const joinIconRect: Element = joinIconRef.current;
      const joinIconTop = joinIconRect.getBoundingClientRect().y - 50;
      setDOBCalendarY(joinIconTop);
      const joinIconLeft = joinIconRect.getBoundingClientRect().x;
      setDOBCalendarX(joinIconLeft);
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
      style={{ backgroundColor: "#E7EEFF", padding: 40, borderRadius: 20 }}
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
          }}
          onClick={setFinal}
        >
          Apply
        </div>
      </div>
      <div className={styles.cities_name} style={{ display: "flex" }}>
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
      <div className={styles.row_two} style={{ display: "flex" }}>
        <div style={{ display: "flex", gap: 20 }}>
          <div className={styles.label}>Date of Birth</div>
          <div
            onClick={() => setShowDOBCalendar(!showDOBCalendar)}
            ref={dobIconRef}
          >
            {dateOfBirth}{" "}
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ cursor: "pointer" }}
            />
            {showDOBCalendar && (
              <div
                style={{
                  position: "fixed",
                  top: `${dobCalendarY}px`,
                  left: `${dobCalendarX}px`,
                }}
              >
                <Calendar
                  onChange={(value, event) => {
                    if (!value) {
                      return;
                    }
                    const date = new Date(value.toString());
                    setDateOfBirth(
                      `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className={styles.label}>Email Address</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className={styles.label}>Additional Affiliation</div>
          <input
            maxLength={140}
            onChange={(e) => setAdditionalAffliction(e.target.value)}
            value={additionalAffliction}
          />
        </div>
      </div>
      <div className={styles.row_three} style={{ display: "flex" }}>
        <div style={{ display: "flex", gap: 20 }}>
          <div>Date of Join</div>
          <div onClick={() => setShowJoinDateCalendar(!showJoinDateCalendar)}>
            {joinDate}{" "}
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ cursor: "pointer" }}
            />
            {showJoinDateCalendar && <Calendar />}
          </div>
        </div>

        <div>
          <div className={styles.secondInfoTitle}>
            Secondary Contact Person Information
          </div>
          <div>First and Last Name</div>
          <input
            required={false}
            placeholder="input"
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
          />
        </div>

        <div className={styles.secondaryInfo}>
          <div className={styles.secondInfoTitle}>
            Secondary Contact Person Information
          </div>
          <div style={{ display: "flex" }}>
            <div>Phone Number</div>
            <input
              required={false}
              placeholder="input"
              value={secondPhoneNumber}
              onChange={(e) => setSecondPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
