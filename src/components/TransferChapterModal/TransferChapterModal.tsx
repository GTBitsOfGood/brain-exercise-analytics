import {
  CSSProperties,
  FormEvent,
  MouseEvent,
  useState,
  useEffect,
} from "react";
import { classes } from "@src/utils/utils";

import XIcon from "@/src/app/icons/XIcon";
import { internalRequest } from "@src/utils/requests";
import {
  AdminApprovalStatus,
  HttpMethod,
  IChapter,
  IVolunteerTableEntry,
  SearchResponseBody,
  Role,
  IUser,
} from "@/common_utils/types";
import { PatchReq } from "@src/app/api/chapter/route";
import { PatchReq as PatchReqUser } from "@src/app/api/volunteer/route";
import { useRouter } from "next/navigation";
import LiveSearchDropdown from "../LiveSearchDropdown/LiveSearchDropdown";
import styles from "./TransferChapterModal.module.css";

interface Props {
  className?: string;
  style?: CSSProperties;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: (arg: boolean) => void;
  chapter: IChapter;
}

const TransferChapterModal = ({
  className,
  style,
  setShowModal,
  setShowSuccessModal,
  chapter,
}: Props) => {
  const router = useRouter();

  const [chapterPresident, setChapterPresident] = useState<string>("");
  const [chapterPresidentError, setChapterPresidentError] =
    useState<string>("");
  const [chapterPresidentObject, setChapterPresidentObject] =
    useState<IVolunteerTableEntry | null>(null);

  const [volunteers, setVolunteers] = useState<IVolunteerTableEntry[]>();
  const [filteredVolunteers, setFilteredVolunteers] =
    useState<IVolunteerTableEntry[]>();
  const [loading, setLoading] = useState(false);

  const [confirmPopup, setConfirmPopup] = useState(false);
  const [confirmPopupPressed, setConfirmPopupPressed] = useState(false);

  const resetErrors = () => {
    setChapterPresidentError("");
  };

  const reset = () => {
    setChapterPresident("");
    setChapterPresidentObject(null);
    resetErrors();
  };

  useEffect(() => {
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

    if (!confirmPopupPressed) {
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

    if (error) {
      console.log(error);
      setConfirmPopupPressed(false);
      return;
    }

    try {
      await internalRequest<PatchReq>({
        url: "/api/chapter",
        method: HttpMethod.PATCH,
        body: {
          name: chapter.name,
          newFields: {
            chapterPresident: chapterPresidentObject?._id,
          },
        },
      });

      await internalRequest<PatchReqUser>({
        url: "/api/volunteer",
        method: HttpMethod.PATCH,
        body: {
          email: chapterPresidentObject?.email,
          newFields: {
            chapter: chapter.name,
            role: Role.NONPROFIT_CHAPTER_PRESIDENT,
          },
        },
      });

      await internalRequest<IUser>({
        url: "/api/patient/get-patient",
        method: HttpMethod.GET,
        queryParams: {
          id: chapter.chapterPresident,
        },
      }).then(async (pres) => {
        internalRequest<IUser>({
          url: "/api/volunteer",
          method: HttpMethod.PATCH,
          body: {
            email: pres.email,
            newFields: {
              role: Role.NONPROFIT_VOLUNTEER,
            },
          },
        }).then(() => {
          router.push("/patient/search");
        });
      });

      setShowModal(false);
      reset();
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
            <label>Leadership Transfer</label>
          </div>
          <div className={styles.inputSubheader}>
            <label>{chapter.name}</label>
          </div>
          <div className={styles.text1}>
            You are transfering this chapter from:
          </div>
          <div className={styles.text2}>Current Chapter President</div>
          <div className={styles.currPresContainer}>
            {/* <div className={styles.text2}>{chapter.chapterPresident}</div>
            <div>{chapter.chapterPresident.email}</div> */}
          </div>
          <div className={styles.text1}>To:</div>

          <div className={styles.inputField}>
            <label>New Chapter President</label>
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
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => {
                reset();
                setShowModal(false);
              }}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              onClick={() => {
                if (
                  chapterPresident !== "" &&
                  chapterPresidentObject !== null
                ) {
                  setConfirmPopup(true);
                }
              }}
            >
              Confirm Chapter Transfer
            </button>
          </div>

          {confirmPopup && (
            <div className={styles.confirmPopup}>
              <div className={styles.confirmTitle}>Leadership Transfer</div>
              <div className={styles.confirmDesc}>
                The current Chapter President will lose access to the Chapter
                portal after you confirm.
              </div>
              <div className={styles.confirmPopupButtons}>
                <button
                  type="button"
                  onClick={() => setConfirmPopup(false)}
                  className={`${styles.submitButton} ${styles.disabled}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  onClick={() => {
                    setConfirmPopupPressed(true);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </form>
      </>
      <button className={styles.exit} onClick={() => setShowModal(false)}>
        <XIcon></XIcon>
      </button>
    </div>
  );
};

export default TransferChapterModal;
