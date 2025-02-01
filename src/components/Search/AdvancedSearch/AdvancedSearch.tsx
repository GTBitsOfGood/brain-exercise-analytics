import React, {
  useState,
  useCallback,
  CSSProperties,
  useMemo,
  useEffect,
} from "react";

import { SelectChangeEvent } from "@mui/material";
import { Country, State, City } from "country-state-city";
import InputField from "@src/components/InputField/InputField";

import { classes, transformDate, transformPhoneNumber } from "@src/utils/utils";
import { ClearTagIcon } from "@src/app/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import {
  IPatientSearchReducer,
  IChapter,
  HttpMethod,
} from "@/common_utils/types";
import { internalRequest } from "@src/utils/requests";

import { update, clear } from "@src/redux/reducers/patientSearchReducer";
import Dropdown, {
  DropdownProps,
  DropdownOption,
} from "../../Dropdown/Dropdown";

import styles from "./AdvancedSearch.module.css";
import "react-calendar/dist/Calendar.css";
import CalendarInput from "./CalendarInput";
import Tag from "../Tag/Tag";

interface SelectDropdownProps<T> {
  title: string;
  style?: CSSProperties;
  labelWidth: number;
  answerWidth: number;
  showFocusedBorder?: boolean;
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
            backgroundColor: "transparent",
          }}
          sx={{
            "&.MuiOutlinedInput-root": {
              height: "30px",
              "& fieldset": {
                borderRadius: "10px",
              },
              "&.Mui-focused fieldset": {
                border: "none",
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
  className?: string;
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
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [secondaryName, setSecondaryName] = useState("");

  const {
    active,
    countries,
    states,
    cities,
    dateOfBirths,
    emails,
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhones,
    secondaryNames,
  } = useSelector(
    (patientSearchState: RootState) => patientSearchState.patientSearch,
  );

  const tagsPresent = useMemo(
    () =>
      active !== undefined ||
      countries.length > 0 ||
      states.length > 0 ||
      cities.length > 0 ||
      dateOfBirths.length > 0 ||
      emails.length > 0 ||
      additionalAffiliations.length > 0 ||
      dateOfJoins.length > 0 ||
      beiChapters.length > 0 ||
      secondaryPhones.length > 0 ||
      secondaryNames.length > 0,
    [
      active,
      countries,
      states,
      cities,
      dateOfBirths,
      emails,
      additionalAffiliations,
      dateOfJoins,
      beiChapters,
      secondaryPhones,
      secondaryNames,
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
      secondaryPhone !== "" ||
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
      secondaryPhone,
      secondaryName,
    ],
  );

  const checkAndUpdateList = useCallback(
    <T,>(currentArray: Array<T>, value: T): Array<T> => {
      const safeArray =
        currentArray instanceof Array
          ? Array.from(new Set(currentArray))
          : new Array<T>();
      if (value) {
        safeArray.push(value);
      }
      return Array.from(new Set(safeArray));
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
    setBeiChapter("");
    setSecondaryName("");
    setSecondaryPhone("");
    setBeiChapter("");
  };

  const setFinal = () => {
    const dispatchMappings = [
      { condition: country, field: "countries", value: countries },
      { condition: state, field: "states", value: states },
      { condition: city, field: "cities", value: cities },
      { condition: dateOfBirth, field: "dateOfBirths", value: dateOfBirths },
      { condition: email, field: "emails", value: emails },
      {
        condition: additionalAffiliation,
        field: "additionalAffiliations",
        value: additionalAffiliations,
      },
      { condition: dateOfJoin, field: "dateOfJoins", value: dateOfJoins },
      { condition: beiChapter, field: "beiChapters", value: beiChapters },
      {
        condition: secondaryPhone,
        field: "secondaryPhones",
        value: secondaryPhones,
      },
      {
        condition: secondaryName,
        field: "secondaryNames",
        value: secondaryNames,
      },
    ];

    dispatchMappings.forEach(({ condition, field, value }) => {
      if (condition) {
        dispatch(update({ [field]: checkAndUpdateList(value, condition) }));
      }
    });

    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  const handleClearAppliedTags = () => {
    if (tagsPresent) {
      dispatch(clear());
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
    .map((locCountry) => ({
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

  const curryOnCloseSetTag = useCallback(
    <T,>(array: Array<T>, field: keyof IPatientSearchReducer) => {
      return (value: T) => {
        const updatedSet = new Set<T>(array);
        updatedSet.delete(value);
        dispatch(update({ [field]: Array.from(updatedSet) }));
      };
    },
    [dispatch],
  );

  const [chapters, setChapters] = useState<DropdownOption<string>[]>([]);

  const loadChapters = useCallback(() => {
    internalRequest<IChapter[] | null>({
      url: "/api/chapter/get-chapters",
      method: HttpMethod.GET,
    }).then((res) => {
      const chapterDropdown = res
        ? res.map((chapter) => ({
            value: chapter.name,
            displayValue: chapter.name,
          }))
        : [];
      setChapters(chapterDropdown);
    });
  }, []);

  useEffect(() => {
    loadChapters();
  }, [loadChapters]);

  return (
    <div className={styles.body} style={props.style}>
      <div className={styles.button_row}>
        <div className={styles.active_patient_box}>
          <span className={styles.active_patient_box_label}>
            <div className={styles["toggle-button-group"]}>
              <button
                className={`${styles["toggle-button"]} ${styles["toggle-button-left"]} ${active === undefined ? styles["active-button"] : styles["inactive-button"]}`}
                value="undefined"
                onClick={() => dispatch(update({ active: undefined }))}
              >
                All Patients
              </button>
              <button
                className={`${styles["toggle-button"]} ${active === true ? styles["active-button"] : styles["inactive-button"]}`}
                value="true"
                onClick={() => dispatch(update({ active: true }))}
              >
                Active Patients
              </button>
              <button
                className={`${styles["toggle-button"]} ${styles["toggle-button-right"]} ${active === false ? styles["active-button"] : styles["inactive-button"]}`}
                value="false"
                onClick={() => dispatch(update({ active: false }))}
              >
                Inactive Patients
              </button>
            </div>
            {tagsPresent
              ? countries.length > 0 &&
                countries.map((currCountry) => (
                  <div key={`country-${currCountry}`} className={styles.tags}>
                    <Tag
                      title="Country"
                      value={currCountry}
                      handleClose={curryOnCloseSetTag(countries, "countries")}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? states.length > 0 &&
                states.map((currState) => (
                  <div key={`state-${currState}`} className={styles.tags}>
                    <Tag
                      title="State"
                      value={currState}
                      handleClose={curryOnCloseSetTag(states, "states")}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? cities.length > 0 &&
                cities.map((currCity) => (
                  <div key={`city-${currCity}`} className={styles.tags}>
                    <Tag
                      title="City"
                      value={currCity}
                      handleClose={curryOnCloseSetTag(cities, "cities")}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? beiChapters.length > 0 &&
                beiChapters.map((currChapter) => (
                  <div
                    key={`bei-chapter-${currChapter}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="BEI Chapter"
                      value={currChapter}
                      handleClose={curryOnCloseSetTag(
                        beiChapters,
                        "beiChapters",
                      )}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? dateOfBirths.length > 0 &&
                dateOfBirths.map((currDOB) => (
                  <div key={`dob-${currDOB}`} className={styles.tags}>
                    <Tag
                      title="Date of Birth"
                      value={currDOB}
                      handleClose={curryOnCloseSetTag(
                        dateOfBirths,
                        "dateOfBirths",
                      )}
                      transformData={transformDate}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? emails.length > 0 &&
                emails.map((currEmail) => (
                  <div key={`email-${currEmail}`} className={styles.tags}>
                    <Tag
                      title="Email"
                      value={currEmail}
                      handleClose={curryOnCloseSetTag(emails, "emails")}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? additionalAffiliations.length > 0 &&
                additionalAffiliations.map((currAdditionalAffiliation) => (
                  <div
                    key={`additional-affiliation-${currAdditionalAffiliation}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Additional Affiliation"
                      value={currAdditionalAffiliation}
                      handleClose={curryOnCloseSetTag(
                        additionalAffiliations,
                        "additionalAffiliations",
                      )}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? dateOfJoins.length > 0 &&
                dateOfJoins.map((currDateOfJoin) => (
                  <div
                    key={`join-date-${currDateOfJoin}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Date of Join"
                      value={currDateOfJoin}
                      handleClose={curryOnCloseSetTag(
                        dateOfJoins,
                        "dateOfJoins",
                      )}
                      transformData={transformDate}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? secondaryNames.length > 0 &&
                secondaryNames.map((currSecondaryName) => (
                  <div
                    key={`secondary-name-${currSecondaryName}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Secondary Name"
                      value={currSecondaryName}
                      handleClose={curryOnCloseSetTag(
                        secondaryNames,
                        "secondaryNames",
                      )}
                    />
                  </div>
                ))
              : null}
            {tagsPresent
              ? secondaryPhones.length > 0 &&
                secondaryPhones.map((currSecondaryPhoneNumber) => (
                  <div
                    key={`phone-number-${currSecondaryPhoneNumber}`}
                    className={styles.tags}
                  >
                    <Tag
                      title="Secondary Phone Number"
                      value={currSecondaryPhoneNumber}
                      handleClose={curryOnCloseSetTag(
                        secondaryPhones,
                        "secondaryPhones",
                      )}
                      transformData={transformPhoneNumber}
                    />
                  </div>
                ))
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
              placeholder: countryCode == null ? "Select country first" : "Select state",
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
              placeholder: stateCode == null ? "Select state first" : "Select city",
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
              options: chapters,
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
            value={additionalAffiliation}
            placeholder="Enter Additional Affiliation"
            onChange={(e) => setAdditionalAffiliation(e.target.value)}
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
            Secondary Contact Information
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
            Secondary Contact Information
          </div>
          <div
            className={[
              styles.question_box,
              secondaryPhone && styles.hodingValue,
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
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
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
