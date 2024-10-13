import { useRouter } from "next/navigation";
import { CSSProperties, FormEvent, MouseEvent, useState, useEffect } from "react";
import { classes } from "@src/utils/utils";
import { useSelector } from "react-redux";

import useAuth from "@src/hooks/useAuth";
import styles from "./AddChapterModal.module.css";
import InputField from "../InputField/InputField";
import LiveSearchDropdown from "../LiveSearchDropdown/LiveSearchDropdown";
import AuthDropdown from "@src/components/Dropdown/AuthDropdown/AuthDropdown";
import XIcon from "@/src/app/icons/XIcon"
import { Country, State, City } from "country-state-city";
import { RootState } from "@src/redux/rootReducer";
import { internalRequest } from "@src/utils/requests";
import {
  AdminApprovalStatus,
  HttpMethod,
  IVolunteerTableEntry,
  Role,
  SearchResponseBody,
} from "@/common_utils/types";
import { PostReq } from "@server/mongodb/actions/Chapter";
import {PatchReq as PatchReqUser} from "@src/app/api/volunteer/route"


interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: Function;
  setChapterCreated: Function;
}

const addChapterModal = ({ className, style, showModal, setShowModal, setShowSuccessModal, setChapterCreated}: Props) => {
  const [chapterName, setChapterName] = useState<string>("");
  const [chapterPresident, setChapterPresident] = useState<string>("");
  const [chapterPresidentObject, setChapterPresidentObject] = useState<IVolunteerTableEntry>();


  const [chapterNameError, setChapterNameError] = useState<string>("");
  const [chapterPresidentError, setChapterPresidentError] = useState<string>("");

  const [locCountry, setLocCountry] = useState("");
  const [locState, setLocState] = useState("");
  const [locCity, setLocCity] = useState("");

  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  const [volunteers, setVolunteers] = useState<IVolunteerTableEntry[]>();
  const [filteredVolunteers, setFilteredVolunteers] = useState<IVolunteerTableEntry[]>();
  const [loading, setLoading] = useState(false);

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
    setChapterNameError("");
    setChapterPresidentError("");
    setCountryError("");
    setStateError("");
    setCityError("");
  };

  const reset = () => {
    setChapterName("");
    setChapterPresident("");
    setLocCountry("")
    setLocState("");
    setLocCity("");
    resetErrors();
  };

  // Getting Volunteers
  const {
    fullName,
    volunteerRoles,
  } = useSelector((state: RootState) => state.volunteerSearch);

  useEffect(() => {
    setLoading(true)
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          roles: volunteerRoles,
          approved: [AdminApprovalStatus.APPROVED],
        },
        entriesPerPage: 9999,
      },
    }).then((res) => {
      setVolunteers(res?.data ?? []);
      setLoading(false)
    });
  }, []);

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
    const { target } = e;
    if (!target.value.trim()) return setFilteredVolunteers([]);

    const filteredValue = volunteers?.filter((volunteer) =>
      (volunteer.firstName + " " + volunteer.lastName).toLowerCase().startsWith(target.value.toLowerCase())
    );
    setFilteredVolunteers(filteredValue);
  };

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    resetErrors();
    let error = false;

    if (chapterName === "") {
      setChapterNameError("Chapter name cannot be blank");
      error = true;
    }

    if (chapterPresident === "") {
      setChapterPresidentError("Choose a valid chapter president");
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
      await internalRequest<PostReq>({
        url: "/api/chapter",
        method: HttpMethod.POST,
        body: {
          name: chapterName,
          chapterPresident: chapterPresidentObject?._id,
          yearFounded: new Date().getFullYear(),
          country: locCountry,
          city: locCity,
          state: locState,
        },
      });

      setShowModal(false);
      reset();
      setChapterCreated(chapterName)
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
            <label>Add a New Chapter</label>
          </div>
          <div className={styles.inputField}>
            <label>Chapter Name</label>
            <InputField
              placeholder="Enter a chapter name"
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

          <div className={styles.inputField}>
            <label>Chapter President</label>
            <LiveSearchDropdown
              options={filteredVolunteers}
              value={chapterPresident}
              setValue={setChapterPresident}
              placeholder={loading ? "Loading.." : "Enter the name of the chapter president"}
              renderItem={(item) => 
                <p className={styles.p}>{item.firstName + " " + item.lastName + "        " + item.phoneNumber}</p>}
              onChange={handleChange}
              onSelect={(item) => {
                setChapterPresident(item.firstName + " " + item.lastName)
                setChapterPresidentObject(item)}
              }
              showError={chapterPresidentError !== ""}
              error={chapterPresidentError}
            />
          </div>
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

export default addChapterModal;
