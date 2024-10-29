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
import LiveSearchDropdown from "../LiveSearchDropdown/LiveSearchDropdown";
import styles from "./AddVolunteerModal.module.css";
import { internalRequest } from "@src/utils/requests";

interface Props {
  className?: string;
  style?: CSSProperties;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: (arg: boolean) => void;
  chapter: IChapter,
}

const addChapterModal = ({ className, style, setShowModal, setShowSuccessModal, chapter }: Props) => {
  const [chapterPresident, setChapterPresident] = useState<string>("");
  const [chapterPresidentObject, setChapterPresidentObject] =
    useState<IVolunteerTableEntry | null>(null);

  const [chapterPresidentError, setChapterPresidentError] = useState<string>("");

  const [volunteers, setVolunteers] = useState<IVolunteerTableEntry[]>();
  const [filteredVolunteers, setFilteredVolunteers] =
    useState<IVolunteerTableEntry[]>();
  const [loading, setLoading] = useState(false);


  const resetErrors = () => {
    setChapterPresidentError("");
  };

  const reset = () => {
    setChapterPresident("");
    setChapterPresidentObject(null);
    resetErrors();
  };

  useEffect(() => {
    setLoading(true)
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
      setLoading(false)
    });
  }, []);

  type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: ChangeHandler = (e) => {
    const { target } = e;
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

    if (chapterPresident === "") {
      setChapterPresidentError("Choose a valid volunteer");
      error = true;
    }

    if (chapterPresidentObject === null) {
      setChapterPresidentError("Choose a valid volunteer");
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
          email: chapterPresidentObject?.email,
          newFields: {
            chapter: chapter.name,
          },
        },
      });
    } catch (error) {
      console.log(error)
    }

    setShowModal(false);
    reset();
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
              value={chapterPresident}
              setValue={setChapterPresident}
              placeholder={
                loading
                  ? "Loading.."
                  : "Enter the name of the volunteer"
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

export default addChapterModal;
