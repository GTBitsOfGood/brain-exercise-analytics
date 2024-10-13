import { CSSProperties, FormEvent, MouseEvent, useState, useEffect } from "react";
import { classes } from "@src/utils/utils";
import { useSelector } from "react-redux";

import styles from "./EditChapterModal.module.css";
import InputField from "../InputField/InputField";
import AuthDropdown from "@src/components/Dropdown/AuthDropdown/AuthDropdown";
import XIcon from "@/src/app/icons/XIcon"
import { Country, State, City } from "country-state-city";
import { RootState } from "@src/redux/rootReducer";
import { internalRequest } from "@src/utils/requests";
import {
  HttpMethod,
  IChapter,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";
import { PatchReq } from "@src/app/api/chapter/route";
import {PatchReq as PatchReqUser} from "@src/app/api/volunteer/route"
interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: Function;
  setSuccessLink: Function
  chapter: IChapter;
}

const editChapterModal = ({ className, style, showModal, setShowModal, setShowSuccessModal, chapter, setSuccessLink}: Props) => {
  const [yearFounded, setYearFounded] = useState<string>("");
  const [chapterName, setChapterName] = useState<string>("");

  const [yearFoundedError, setYearFoundedError] = useState<string>("");
  const [chapterNameError, setChapterNameError] = useState<string>("");

  const [locCountry, setLocCountry] = useState("");
  const [locState, setLocState] = useState("");
  const [locCity, setLocCity] = useState("");

  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>([]);

  const COUNTRIES = Country.getAllCountries().map((country) => ({
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

  const resetErrors = () => {
    setYearFoundedError("");
    setChapterNameError("");
    setCountryError("");
    setStateError("");
    setCityError("");
  };

  const reset = () => {
    setYearFounded("");
    setChapterName("");
    setLocCountry("")
    setLocState("");
    setLocCity("");
    resetErrors();
  };

  const { fullName } = useSelector((state: RootState) => state.volunteerSearch);

  useEffect(() => {
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          beiChapters: [chapter.name],
        },
        entriesPerPage: 9999,
      },
    }).then((res) => {
      setFilteredUsers(res?.data ?? []);
    })
  }, [])

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    resetErrors();
    let error = false;


    if (yearFounded === "") {
      setYearFoundedError("Year founded cannot be blank");
      error = true;
    }

    if (chapterName === "") {
      setChapterNameError("Chapter name cannot be blank");
      error = true;
    }

    if (locCountry === "") {
      setCountryError("Country cannot be blank");
      error = true;
    }

    if (error) {
      console.log(error);
      return;
    }

    try {
      await internalRequest<PatchReq>({
        url: "/api/chapter",
        method: HttpMethod.PATCH,
        body: {
          name: chapter.name,
          newFields: {
            yearFounded: yearFounded,
            name: chapterName,
            location: {
              country: locCountry,
              state: locState,
              city: locCity,
            }
          }
        }
      });

      filteredUsers.forEach(async user => {
        await internalRequest<PatchReqUser>({
          url: "/api/volunteer",
          method: HttpMethod.PATCH,
          body: {
            email: user.email,
            newFields: {
              chapter: chapterName
            }
          }
        });
      });


    setShowModal(false);
    reset();
    setSuccessLink("/chapter/" + encodeURI(chapterName))
    setShowSuccessModal(true);

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <>
        <form className={styles.inputs} onSubmit={handleSaveChanges}>
          <div className={styles.inputHeader}>
            <label>Edit Chapter Profile</label>
          </div>
          <div className={styles.inputSubheader}>
            <label>{chapter.name}</label>
          </div>
          <div className={styles.inputField}>
            <label>Chapter Year Founded</label>
            <InputField
              placeholder="Enter new year founded"
              value={yearFounded}
              onChange={(e) => setYearFounded(e.target.value)}
              showError={yearFoundedError !== ""}
              error={yearFoundedError}
            />
          </div>

          <div className={styles.inputField}>
            <label>Chapter Name</label>
            <InputField
              placeholder="Enter new chapter name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              showError={chapterNameError !== ""}
              error={chapterNameError}
            />
          </div>

          <div className={styles.inputField}>
            <AuthDropdown
              title="Chapter Location"
              required={true}
              placeholder="Select your country"
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

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={reset}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Discard
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSaveChanges}
            >
              Confirm
            </button>
          </div>
        </form>
      </>
      <button className={styles.exit} onClick={() => setShowModal(false)}><XIcon></XIcon></button>
    </div>
  );
};

export default editChapterModal;
