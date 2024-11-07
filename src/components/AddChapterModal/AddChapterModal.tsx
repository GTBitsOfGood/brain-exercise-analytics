import {
  CSSProperties,
  FormEvent,
  MouseEvent,
  useState,
  useEffect,
} from "react";
import { classes } from "@src/utils/utils";

import AuthDropdown from "@src/components/Dropdown/AuthDropdown/AuthDropdown";
import XIcon from "@/src/app/icons/XIcon";
import { Country, State, City } from "country-state-city";
import { internalRequest } from "@src/utils/requests";
import {
  AdminApprovalStatus,
  HttpMethod,
  IVolunteerTableEntry,
  Role,
  // Role,
  SearchResponseBody,
} from "@/common_utils/types";
import { PostReq } from "@server/mongodb/actions/Chapter";
// import { PatchReq as PatchReqUser } from "@src/app/api/volunteer/route";
import LiveSearchDropdown from "../LiveSearchDropdown/LiveSearchDropdown";
import InputField from "../InputField/InputField";
import styles from "./AddChapterModal.module.css";

interface Props {
  className?: string;
  style?: CSSProperties;
  setShowModal: (arg: boolean) => void;
  setShowSuccessModal: (arg: boolean) => void;
  setChapterCreated: (arg: string) => void;
}

const AddChapterModal = ({
  className,
  style,
  setShowModal,
  setShowSuccessModal,
  setChapterCreated,
}: Props) => {
  const [chapterName, setChapterName] = useState<string>("");
  const [chapterPresident, setChapterPresident] = useState<string>("");
  const [chapterPresidentObject, setChapterPresidentObject] =
    useState<IVolunteerTableEntry | null>(null);

  const [chapterNameError, setChapterNameError] = useState<string>("");
  const [chapterPresidentError, setChapterPresidentError] =
    useState<string>("");

  const [locCountry, setLocCountry] = useState("");
  const [locState, setLocState] = useState("");
  const [locCity, setLocCity] = useState("");

  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  const [volunteers, setVolunteers] = useState<IVolunteerTableEntry[]>();
  const [filteredVolunteers, setFilteredVolunteers] =
    useState<IVolunteerTableEntry[]>();
  const [loading, setLoading] = useState(false);

  const [resetChangeTriggers, setResetChangeTriggers] = useState(false);

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
    .map((country) => ({
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
    setLocCountry("");
    setLocState("");
    setLocCity("");
    setChapterPresidentObject(null);
    resetErrors();
    setResetChangeTriggers(!resetChangeTriggers);
  };

  useEffect(() => {
    setLoading(true);
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          roles: [Role.NONPROFIT_VOLUNTEER],
          approved: [AdminApprovalStatus.APPROVED],
        },
        entriesPerPage: 9999,
      },
    }).then((res) => {
      setVolunteers(res?.data ?? []);
      setLoading(false);
    });
  }, []);

  type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: ChangeHandler = (e) => {
    const { target } = e;
    setChapterPresidentObject(null);

    if (!target.value.trim()) return setFilteredVolunteers([]);

    const filteredValue = volunteers?.filter((volunteer) =>
      `${volunteer.firstName} ${volunteer.lastName}`
        .toLowerCase()
        .startsWith(target.value.toLowerCase()),
    );
    return setFilteredVolunteers(filteredValue);
  };

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    resetErrors();
    setResetChangeTriggers(!resetChangeTriggers);
    let error = false;

    if (chapterName === "") {
      setChapterNameError("Chapter name cannot be blank");
      error = true;
    }

    if (chapterPresident === "") {
      setChapterPresidentError("Chapter president cannot be blank");
      error = true;
    }

    if (chapterPresidentObject === null) {
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
      setChapterCreated(chapterName);
      setShowSuccessModal(true);
    } catch (errors) {
      console.log(errors);
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
              defaultBackgroundColor="#e3eafc"
              hoverColor="#ffffff"
              resetChangeTrigger={resetChangeTriggers}
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
              resetChangeTriggers={resetChangeTriggers}
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
                resetChangeTriggers={resetChangeTriggers}
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
                resetChangeTriggers={resetChangeTriggers}
              />
            </div>
          )}

          <div className={styles.inputField}>
            <label>Chapter President</label>
            <LiveSearchDropdown
              options={filteredVolunteers}
              value={chapterPresident}
              setValue={setChapterPresident}
              placeholder={
                loading
                  ? "Loading.."
                  : "Enter the name of the chapter president"
              }
              renderItem={(item) => (
                <p className={styles.p}>
                  {`${item.firstName} ${item.lastName}        ${item.email}`}
                </p>
              )}
              onChange={handleChange}
              onSelect={(item) => {
                setChapterPresident(`${item.firstName} ${item.lastName}`);
                setChapterPresidentObject(item);
              }}
              showError={chapterPresidentError !== ""}
              error={chapterPresidentError}
              resetChangeTriggers={resetChangeTriggers}
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
      <button className={styles.exit} onClick={() => setShowModal(false)}>
        <XIcon></XIcon>
      </button>
    </div>
  );
};

export default AddChapterModal;
