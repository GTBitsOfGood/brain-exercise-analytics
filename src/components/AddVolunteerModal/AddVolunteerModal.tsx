import {
  CSSProperties,
  FormEvent,
  MouseEvent,
  useState,
  useEffect,
} from "react";
import { classes } from "@src/utils/utils";

import XIcon from "@/src/app/icons/XIcon";
import {
  AdminApprovalStatus,
  HttpMethod,
  IChapter,
  IVolunteerTableEntry,
  Role,
  SearchResponseBody,
} from "@/common_utils/types";
import { PatchReq } from "@src/app/api/volunteer/route";
import { internalRequest } from "@src/utils/requests";
import LiveSearchDropdown from "../LiveSearchDropdown/LiveSearchDropdown";
import styles from "./AddVolunteerModal.module.css";

interface Props {
  className?: string;
  style?: CSSProperties;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: (arg: boolean) => void;
  chapter: IChapter;
  refreshUsers: () => void;
}

const AddVolunteerModal = ({
  className,
  style,
  setShowModal,
  setShowSuccessModal,
  chapter,
  refreshUsers,
}: Props) => {
  const [newVolunteer, setNewVolunteer] = useState<string>("");
  const [newVolunteerObject, setNewVolunteerObject] =
    useState<IVolunteerTableEntry | null>(null);

  const [newVolunteerError, setNewVolunteerError] = useState<string>("");

  const [volunteers, setVolunteers] = useState<IVolunteerTableEntry[]>();
  const [filteredVolunteers, setFilteredVolunteers] =
    useState<IVolunteerTableEntry[]>();
  const [loading, setLoading] = useState(false);

  const resetErrors = () => {
    setNewVolunteerError("");
  };

  const reset = () => {
    setNewVolunteer("");
    setNewVolunteerObject(null);
    resetErrors();
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
          beiChapters: [""],
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
    setNewVolunteerObject(null);

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
    let error = false;

    if (newVolunteer === "") {
      setNewVolunteerError("Choose a valid volunteer");
      error = true;
    }

    if (newVolunteerObject === null) {
      setNewVolunteerError("Choose a valid volunteer");
      error = true;
    }

    if (error) {
      console.log(error);
      return;
    }

    try {
      await internalRequest<PatchReq>({
        url: "/api/volunteer",
        method: HttpMethod.PATCH,
        body: {
          email: newVolunteerObject?.email,
          newFields: {
            chapter: chapter.name,
          },
        },
      });
    } catch (err) {
      console.log(err);
    }

    setShowModal(false);
    reset();
    refreshUsers();
    setShowSuccessModal(true);
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <>
        <form className={styles.inputs} onSubmit={handleSaveChanges}>
          <div className={styles.inputHeader}>
            <label>Add Volunteer</label>
          </div>
          <div className={styles.inputSubheader}>
            <label>{chapter.name}</label>
          </div>

          <div className={styles.inputField}>
            <label>Add Volunteer</label>
            <LiveSearchDropdown
              options={filteredVolunteers}
              value={newVolunteer}
              setValue={setNewVolunteer}
              placeholder={
                loading ? "Loading.." : "Enter the name of the volunteer"
              }
              renderItem={(item) => (
                <p className={styles.p}>
                  {`${item.firstName} ${item.lastName}        ${item.email}`}
                </p>
              )}
              onChange={handleChange}
              onSelect={(item) => {
                setNewVolunteer(`${item.firstName} ${item.lastName}`);
                setNewVolunteerObject(item);
              }}
              showError={newVolunteerError !== ""}
              error={newVolunteerError}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={reset}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Cancel
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

export default AddVolunteerModal;
