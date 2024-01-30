import React, {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  CSSProperties,
} from "react";
import { SelectChangeEvent } from "@mui/material";
import { Country, State, City } from "country-state-city";
import InputField from "@src/components/InputField/InputField";
import CHAPTERS from "@src/utils/chapters";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
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
  setCountries: Dispatch<SetStateAction<Set<string>>>;
  setStates: Dispatch<SetStateAction<Set<string>>>;
  setCities: Dispatch<SetStateAction<Set<string>>>;
  setActives: Dispatch<SetStateAction<Set<boolean>>>;
  setDateOfBirths: Dispatch<SetStateAction<Set<string>>>;
  setEmails: Dispatch<SetStateAction<Set<string>>>;
  setDateOfJoins: Dispatch<SetStateAction<Set<string>>>;
  setBeiChapters: Dispatch<SetStateAction<Set<string>>>;
  setSecondaryPhoneNumbers: Dispatch<SetStateAction<Set<string>>>;
  setAdditionalAffiliations: Dispatch<SetStateAction<Set<string>>>;
  setSecondaryNames: Dispatch<SetStateAction<Set<string>>>;
  onSubmit?: () => void;
}

export const AdvancedSearch = (props: UpdateParamProp) => {
  const [country, setCountry] = useState(""); // values chosen before the aply button
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [active, setActive] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [email, setEmail] = useState("");
  const [additionalAffiliation, setAdditionalAffiliation] = useState("");
  const [dateOfJoin, setDateOfJoin] = useState<string>("");
  const [beiChapter, setBeiChapter] = useState("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState("");
  const [secondaryName, setSecondaryName] = useState("");

  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

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
    setActive(false);
    setDateOfBirth("");
    setEmail("");
    setAdditionalAffiliation("");
    setDateOfJoin("");
    setSecondaryName("");
    setSecondaryPhoneNumber("");
  };

  const setFinal = () => {
    checkAndUpdateList(active, props.setActives);
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
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="Platform"
            >
              <ToggleButton value="allPatients">All Patients</ToggleButton>
              <ToggleButton value="activePatients">
                Active Patients
              </ToggleButton>
              <ToggleButton value="inactivePatients">
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
